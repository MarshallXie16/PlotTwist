'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import type { ServerToClientEvents, ClientToServerEvents } from '@/lib/socket-types';

type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

/**
 * Custom hook for Socket.io connection and event management
 */
export function useSocket() {
  const [socket, setSocket] = useState<TypedSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<TypedSocket | null>(null);

  // Initialize socket connection
  useEffect(() => {
    // Create socket connection
    const socketInstance: TypedSocket = io({
      path: '/socket.io',
      transports: ['websocket', 'polling'],
    });

    socketInstance.on('connect', () => {
      console.log('[Socket] Connected:', socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('[Socket] Disconnected');
      setIsConnected(false);
    });

    socketInstance.on('error', (data) => {
      console.error('[Socket] Error:', data.message);
    });

    socketRef.current = socketInstance;
    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, []);

  /**
   * Join a room
   */
  const joinRoom = useCallback(
    (roomId: string, playerId: string): Promise<{ success: boolean; error?: string }> => {
      return new Promise((resolve) => {
        if (!socketRef.current) {
          resolve({ success: false, error: 'Socket not connected' });
          return;
        }

        socketRef.current.emit('room:join', { roomId, playerId }, (response) => {
          if (response.success) {
            console.log('[Socket] Joined room:', roomId);
          } else {
            console.error('[Socket] Failed to join room:', response.error);
          }
          resolve(response);
        });
      });
    },
    []
  );

  /**
   * Leave a room
   */
  const leaveRoom = useCallback((roomId: string, playerId: string) => {
    if (!socketRef.current) return;

    socketRef.current.emit('room:leave', { roomId, playerId });
    console.log('[Socket] Left room:', roomId);
  }, []);

  /**
   * Submit a story contribution
   */
  const submitContribution = useCallback(
    (
      roomId: string,
      playerId: string,
      content: string
    ): Promise<{ success: boolean; contributionId?: string; error?: string }> => {
      return new Promise((resolve) => {
        if (!socketRef.current) {
          resolve({ success: false, error: 'Socket not connected' });
          return;
        }

        socketRef.current.emit(
          'contribution:submit',
          { roomId, playerId, content },
          (response) => {
            if (response.success) {
              console.log('[Socket] Contribution submitted:', response.contributionId);
            } else {
              console.error('[Socket] Failed to submit contribution:', response.error);
            }
            resolve(response);
          }
        );
      });
    },
    []
  );

  /**
   * Start typing indicator
   */
  const startTyping = useCallback((roomId: string, playerId: string) => {
    if (!socketRef.current) return;

    socketRef.current.emit('typing:start', { roomId, playerId });
  }, []);

  /**
   * Stop typing indicator
   */
  const stopTyping = useCallback((roomId: string, playerId: string) => {
    if (!socketRef.current) return;

    socketRef.current.emit('typing:stop', { roomId, playerId });
  }, []);

  /**
   * Start the game
   */
  const startGame = useCallback(
    (roomId: string, playerId: string): Promise<{ success: boolean; error?: string }> => {
      return new Promise((resolve) => {
        if (!socketRef.current) {
          resolve({ success: false, error: 'Socket not connected' });
          return;
        }

        socketRef.current.emit('game:start', { roomId, playerId }, (response) => {
          if (response.success) {
            console.log('[Socket] Game started');
          } else {
            console.error('[Socket] Failed to start game:', response.error);
          }
          resolve(response);
        });
      });
    },
    []
  );

  /**
   * Request an AI-generated twist
   */
  const requestAITwist = useCallback((roomId: string) => {
    if (!socketRef.current) return;

    socketRef.current.emit('game:request-ai-twist', { roomId });
    console.log('[Socket] Requested AI twist');
  }, []);

  /**
   * End the current story
   */
  const endStory = useCallback((roomId: string, storyId: string) => {
    if (!socketRef.current) return;

    socketRef.current.emit('game:end-story', { roomId, storyId });
    console.log('[Socket] Ended story:', storyId);
  }, []);

  return {
    socket,
    isConnected,
    joinRoom,
    leaveRoom,
    submitContribution,
    startTyping,
    stopTyping,
    startGame,
    requestAITwist,
    endStory,
  };
}
