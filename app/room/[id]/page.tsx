'use client';

import React, { use, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSocket } from '@/hooks/use-socket';
import { WaitingRoom } from '@/components/game/WaitingRoom';
import { PlayerList, type Player } from '@/components/game/PlayerList';
import { StoryFeed, type StoryContribution } from '@/components/game/StoryFeed';
import { ContributionInput } from '@/components/game/ContributionInput';
import { StoryRecap } from '@/components/game/StoryRecap';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

type GameState = 'joining' | 'waiting' | 'playing' | 'completed';

interface RoomPageProps {
  params: Promise<{ id: string }>;
}

export default function RoomPage({ params }: RoomPageProps) {
  const resolvedParams = use(params);
  const roomId = resolvedParams.id;
  const router = useRouter();
  const searchParams = useSearchParams();

  const [gameState, setGameState] = useState<GameState>('joining');
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [storyId, setStoryId] = useState<string | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [contributions, setContributions] = useState<StoryContribution[]>([]);
  const [roomData, setRoomData] = useState<{
    gameMode: 'freeform' | 'themed';
    theme?: string | null;
    maxPlayers: number;
  } | null>(null);
  const [aiThinking, setAIThinking] = useState(false);
  const [hasJoinedSocket, setHasJoinedSocket] = useState(false);

  const { toast } = useToast();

  const {
    socket,
    isConnected,
    joinRoom,
    submitContribution,
    startTyping,
    stopTyping,
    startGame,
    requestAITwist,
    endStory,
  } = useSocket();

  /**
   * Initial setup: join or connect to room
   */
  useEffect(() => {
    const initialize = async () => {
      const existingPlayerId = searchParams.get('playerId');
      const nickname = searchParams.get('nickname');

      // If we have a playerId, we created the room or are returning
      if (existingPlayerId) {
        setPlayerId(existingPlayerId);
        setGameState('waiting');
        return;
      }

      // If we have a nickname, we need to join the room
      if (nickname) {
        try {
          const response = await fetch(`/api/rooms/${roomId}/join`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nickname }),
          });

          if (!response.ok) {
            const error = await response.json();
            alert(error.error || 'Failed to join room');
            router.push('/');
            return;
          }

          const data = await response.json();
          setPlayerId(data.playerId);
          setRoomData(data.room);
          setGameState('waiting');

          // Update URL to include playerId
          router.replace(`/room/${roomId}?playerId=${data.playerId}`);
        } catch (error) {
          console.error('Error joining room:', error);
          alert('Failed to join room');
          router.push('/');
        }
      } else {
        // No playerId or nickname, redirect to home
        router.push('/');
      }
    };

    initialize();
  }, [roomId, searchParams, router]);

  /**
   * Connect to WebSocket when playerId is ready
   */
  useEffect(() => {
    if (!playerId || !isConnected || hasJoinedSocket) return;

    const connect = async () => {
      const result = await joinRoom(roomId, playerId);
      if (!result.success) {
        console.error('Failed to join room via WebSocket:', result.error);
        return;
      }

      // Mark as joined to prevent duplicate joins
      setHasJoinedSocket(true);

      // Fetch initial room state (players and contributions)
      try {
        const response = await fetch(`/api/rooms/${roomId}`);
        if (response.ok) {
          const data = await response.json();

          // Set initial players
          setPlayers(
            data.players.map((p: any) => ({
              id: p.id,
              nickname: p.nickname,
              color: p.color,
              isActive: p.isActive,
              isTyping: false,
            }))
          );

          // Set room data if not already set
          if (!roomData) {
            setRoomData({
              gameMode: data.room.gameMode,
              theme: data.room.theme,
              maxPlayers: data.room.maxPlayers,
            });
          }

          // Set story ID if exists
          if (data.story) {
            setStoryId(data.story.id);
          }

          // Set initial contributions if any exist
          if (data.contributions && data.contributions.length > 0) {
            setContributions(
              data.contributions.map((c: any) => ({
                id: c.id,
                content: c.content,
                type: c.type,
                playerNickname: c.playerNickname,
                playerColor: c.playerColor,
                orderNum: c.orderNum,
              }))
            );
          }

          // If game already started, set state to playing
          if (data.stats.isGameStarted && data.stats.contributionCount > 0) {
            setGameState('playing');
          }

          // If story is complete, set state to completed
          if (data.story && data.story.isComplete) {
            setGameState('completed');
          }
        }
      } catch (error) {
        console.error('Error fetching initial room state:', error);
      }
    };

    connect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerId, isConnected, hasJoinedSocket]);

  /**
   * Listen to WebSocket events
   */
  useEffect(() => {
    if (!socket) return;

    // Room updated (player count changed)
    socket.on('room:updated', ({ playerCount }) => {
      console.log(`Room updated: ${playerCount} players`);
    });

    // Player joined
    socket.on('room:player-joined', ({ playerId: newPlayerId, nickname, color }) => {
      setPlayers((prev) => {
        // Check if player already exists
        if (prev.some((p) => p.id === newPlayerId)) {
          return prev;
        }
        // Show toast notification AFTER state update
        setTimeout(() => {
          toast({
            title: 'Player joined',
            description: `${nickname} joined the room`,
          });
        }, 0);
        return [...prev, { id: newPlayerId, nickname, color, isActive: true, isTyping: false }];
      });
    });

    // Player left
    socket.on('room:player-left', ({ playerId: leftPlayerId }) => {
      setPlayers((prev) => {
        const leftPlayer = prev.find((p) => p.id === leftPlayerId);
        if (leftPlayer) {
          // Show toast notification AFTER state update
          setTimeout(() => {
            toast({
              title: 'Player left',
              description: `${leftPlayer.nickname} left the room`,
              variant: 'destructive',
            });
          }, 0);
        }
        return prev.map((p) => (p.id === leftPlayerId ? { ...p, isActive: false } : p));
      });
    });

    // New contribution
    socket.on('story:new-contribution', (data) => {
      setContributions((prev) => [
        ...prev,
        {
          id: data.contributionId,
          content: data.content,
          type: data.type,
          playerNickname: data.playerNickname,
          playerColor: data.playerColor,
          orderNum: data.orderNum,
        },
      ]);
    });

    // Game started
    socket.on('game:started', () => {
      console.log('Game started!');
      toast({
        title: 'Game started!',
        description: 'Let the chaos begin! Start writing your story.',
      });
      setGameState('playing');
    });

    // Story completed
    socket.on('story:completed', ({ storyId: completedStoryId }) => {
      console.log('Story completed!', completedStoryId);
      toast({
        title: 'Story completed! 🎉',
        description: 'Check out your masterpiece!',
      });
      setGameState('completed');
    });

    // AI thinking
    socket.on('game:ai-thinking', ({ isThinking }) => {
      setAIThinking(isThinking);
    });

    // Typing indicators
    socket.on('player:typing', ({ playerId: typingPlayerId, isTyping }) => {
      setPlayers((prev) =>
        prev.map((p) => (p.id === typingPlayerId ? { ...p, isTyping } : p))
      );
    });

    return () => {
      socket.off('room:updated');
      socket.off('room:player-joined');
      socket.off('room:player-left');
      socket.off('story:new-contribution');
      socket.off('game:started');
      socket.off('story:completed');
      socket.off('game:ai-thinking');
      socket.off('player:typing');
    };
  }, [socket]);

  /**
   * Handle contribution submission
   */
  const handleSubmitContribution = async (content: string) => {
    if (!playerId) return;

    const result = await submitContribution(roomId, playerId, content);
    if (!result.success) {
      console.error('Failed to submit contribution:', result.error);
      alert('Failed to submit contribution. Please try again.');
    }
  };

  /**
   * Handle typing indicators
   */
  const handleTypingStart = () => {
    if (!playerId) return;
    startTyping(roomId, playerId);
  };

  const handleTypingStop = () => {
    if (!playerId) return;
    stopTyping(roomId, playerId);
  };

  /**
   * Handle AI twist request
   */
  const handleRequestAI = () => {
    requestAITwist(roomId);
  };

  /**
   * Handle start game
   */
  const handleStartGame = async () => {
    if (!playerId) return;

    const result = await startGame(roomId, playerId);
    if (!result.success) {
      console.error('Failed to start game:', result.error);
      alert(result.error || 'Failed to start game');
    }
    // State transition will happen when we receive game:started event
  };

  /**
   * Handle end game
   */
  const handleEndGame = () => {
    if (!storyId) return;

    endStory(roomId, storyId);
    // State transition will happen when we receive story:completed event
  };

  /**
   * Handle play again
   */
  const handlePlayAgain = () => {
    router.push('/');
  };

  /**
   * Handle back to home
   */
  const handleBackToHome = () => {
    router.push('/');
  };

  // Loading state
  if (gameState === 'joining' || !playerId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[var(--brand-primary)] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-[var(--text-secondary)]">Joining room...</p>
        </div>
      </div>
    );
  }

  // Waiting room state
  if (gameState === 'waiting') {
    return (
      <WaitingRoom
        roomId={roomId}
        gameMode={roomData?.gameMode || 'freeform'}
        theme={roomData?.theme}
        players={players}
        currentPlayerId={playerId}
        maxPlayers={roomData?.maxPlayers || 6}
        onStartGame={handleStartGame}
        shareableLink={`${typeof window !== 'undefined' ? window.location.origin : ''}/room/${roomId}`}
      />
    );
  }

  // Story completed state
  if (gameState === 'completed') {
    return (
      <StoryRecap
        roomId={roomId}
        contributions={contributions}
        players={players}
        gameMode={roomData?.gameMode || 'freeform'}
        theme={roomData?.theme}
        onPlayAgain={handlePlayAgain}
        onBackToHome={handleBackToHome}
      />
    );
  }

  // Game playing state
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="container mx-auto p-4 h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between py-4 border-b border-[var(--border)]">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Plot Twist</h1>
            <p className="text-sm text-[var(--text-tertiary)]">Room: {roomId}</p>
          </div>
          <div className="flex items-center gap-4">
            {/* End Game Button */}
            <Button
              variant="destructive"
              size="sm"
              onClick={handleEndGame}
              disabled={!storyId || contributions.length === 0}
            >
              End Game
            </Button>

            {/* Connection Status */}
            {isConnected ? (
              <div className="flex items-center gap-2 text-sm text-[var(--color-success)]">
                <div className="w-2 h-2 bg-[var(--color-success)] rounded-full animate-pulse" />
                Connected
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-[var(--color-error)]">
                <div className="w-2 h-2 bg-[var(--color-error)] rounded-full" />
                Disconnected
              </div>
            )}
          </div>
        </div>

        {/* Main Game Area */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 py-4 overflow-hidden">
          {/* Player List - Sidebar */}
          <div className="lg:col-span-1">
            <PlayerList
              players={players}
              currentPlayerId={playerId}
              showTypingIndicators={true}
              maxPlayers={roomData?.maxPlayers || 6}
            />
          </div>

          {/* Story Feed - Main Content */}
          <div className="lg:col-span-3 flex flex-col gap-4 h-full">
            <div className="flex-1 overflow-hidden">
              <StoryFeed
                contributions={contributions}
                aiThinking={aiThinking}
                autoScroll={true}
              />
            </div>

            {/* Contribution Input */}
            <ContributionInput
              onSubmit={handleSubmitContribution}
              onTypingStart={handleTypingStart}
              onTypingStop={handleTypingStop}
              showAIButton={true}
              onRequestAI={handleRequestAI}
              aiThinking={aiThinking}
              disabled={!isConnected}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
