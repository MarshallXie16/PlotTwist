'use client';

import { useState, useEffect } from 'react';
import { useSocket } from '@/hooks/use-socket';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function SocketTestPage() {
  const { socket, isConnected, joinRoom, leaveRoom, submitContribution, startTyping, stopTyping } = useSocket();

  const [roomId, setRoomId] = useState('SZz0a3XDoR');
  const [playerId, setPlayerId] = useState('59IfH7Azcj');
  const [contribution, setContribution] = useState('');
  const [events, setEvents] = useState<string[]>([]);
  const [joined, setJoined] = useState(false);

  // Listen to socket events
  useEffect(() => {
    if (!socket) return;

    const addEvent = (message: string) => {
      setEvents(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    };

    socket.on('room:updated', (data) => {
      addEvent(`Room updated: ${data.playerCount} players`);
    });

    socket.on('room:player-joined', (data) => {
      addEvent(`Player joined: ${data.nickname} (${data.color})`);
    });

    socket.on('room:player-left', (data) => {
      addEvent(`Player left: ${data.playerId}`);
    });

    socket.on('story:new-contribution', (data) => {
      addEvent(`New contribution from ${data.playerNickname}: "${data.content}"`);
    });

    socket.on('player:typing', (data) => {
      addEvent(`${data.nickname} is ${data.isTyping ? 'typing' : 'stopped typing'}`);
    });

    socket.on('error', (data) => {
      addEvent(`❌ Error: ${data.message}`);
    });

    return () => {
      socket.off('room:updated');
      socket.off('room:player-joined');
      socket.off('room:player-left');
      socket.off('story:new-contribution');
      socket.off('player:typing');
      socket.off('error');
    };
  }, [socket]);

  const handleJoinRoom = async () => {
    const result = await joinRoom(roomId, playerId);
    if (result.success) {
      setJoined(true);
      setEvents(prev => [...prev, `✅ Joined room ${roomId}`]);
    } else {
      setEvents(prev => [...prev, `❌ Failed to join: ${result.error}`]);
    }
  };

  const handleLeaveRoom = () => {
    leaveRoom(roomId, playerId);
    setJoined(false);
    setEvents(prev => [...prev, `👋 Left room ${roomId}`]);
  };

  const handleSubmitContribution = async () => {
    if (!contribution.trim()) return;

    const result = await submitContribution(roomId, playerId, contribution);
    if (result.success) {
      setEvents(prev => [...prev, `✅ Submitted: "${contribution}"`]);
      setContribution('');
    } else {
      setEvents(prev => [...prev, `❌ Failed to submit: ${result.error}`]);
    }
  };

  const handleStartTyping = () => {
    startTyping(roomId, playerId);
    setEvents(prev => [...prev, '⌨️ Started typing']);
  };

  const handleStopTyping = () => {
    stopTyping(roomId, playerId);
    setEvents(prev => [...prev, '⏸️ Stopped typing']);
  };

  return (
    <div className="min-h-screen p-8 bg-[var(--bg-primary)]">
      <div className="max-w-4xl mx-auto space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Socket.io Test Page
              <Badge variant={isConnected ? 'default' : 'destructive'}>
                {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Connection Controls */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Room ID</label>
              <Input
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Room ID"
                disabled={joined}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Player ID</label>
              <Input
                value={playerId}
                onChange={(e) => setPlayerId(e.target.value)}
                placeholder="Player ID"
                disabled={joined}
              />
            </div>

            <div className="flex gap-2">
              {!joined ? (
                <Button onClick={handleJoinRoom} disabled={!isConnected}>
                  Join Room
                </Button>
              ) : (
                <Button onClick={handleLeaveRoom} variant="destructive">
                  Leave Room
                </Button>
              )}
            </div>

            {/* Contribution Controls */}
            {joined && (
              <div className="space-y-2 pt-4 border-t border-[var(--border)]">
                <label className="text-sm font-medium">Submit Contribution</label>
                <div className="flex gap-2">
                  <Input
                    value={contribution}
                    onChange={(e) => setContribution(e.target.value)}
                    placeholder="Write a contribution..."
                    onFocus={handleStartTyping}
                    onBlur={handleStopTyping}
                  />
                  <Button onClick={handleSubmitContribution}>Submit</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Event Log */}
        <Card>
          <CardHeader>
            <CardTitle>Event Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 max-h-96 overflow-y-auto font-mono text-sm">
              {events.length === 0 ? (
                <p className="text-[var(--text-tertiary)]">No events yet...</p>
              ) : (
                events.map((event, i) => (
                  <div key={i} className="text-[var(--text-secondary)]">
                    {event}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Testing Instructions</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none">
            <ol className="space-y-2 text-sm">
              <li>Open this page in two browser windows/tabs</li>
              <li>In both windows, click "Join Room" (they should join the same room ID)</li>
              <li>Submit a contribution in one window - it should appear in both</li>
              <li>Type in the input field to trigger typing indicators</li>
              <li>Leave the room in one window to test disconnection</li>
            </ol>
            <p className="text-xs text-[var(--text-tertiary)] mt-4">
              <strong>Note:</strong> Make sure you created a room and player with the IDs above in the database first,
              or update the IDs to match existing records.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
