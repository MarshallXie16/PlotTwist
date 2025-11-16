'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const THEMES = [
  'Horror',
  'Romance',
  'Sci-Fi',
  'Fantasy',
  'Mystery',
  'Comedy',
  'Adventure',
  'Western',
  'Noir',
  'Superhero',
];

export default function LandingPage() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);

  // Create room form state
  const [nickname, setNickname] = useState('');
  const [gameMode, setGameMode] = useState<'freeform' | 'themed'>('freeform');
  const [theme, setTheme] = useState(THEMES[0]);
  const [maxPlayers, setMaxPlayers] = useState(6);

  // Join room form state
  const [joinRoomId, setJoinRoomId] = useState('');
  const [joinNickname, setJoinNickname] = useState('');

  /**
   * Handle create room
   */
  const handleCreateRoom = async () => {
    if (!nickname.trim()) {
      return;
    }

    try {
      setIsCreating(true);

      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname: nickname.trim(),
          gameMode,
          theme: gameMode === 'themed' ? theme : null,
          maxPlayers,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create room');
      }

      const data = await response.json();

      // Navigate to room
      router.push(`/room/${data.roomId}?playerId=${data.playerId}`);
    } catch (error) {
      console.error('Error creating room:', error);
      alert('Failed to create room. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  /**
   * Handle join room
   */
  const handleJoinRoom = async () => {
    if (!joinRoomId.trim() || !joinNickname.trim()) {
      return;
    }

    try {
      setIsJoining(true);

      // Navigate to room page, which will handle the join flow
      router.push(`/room/${joinRoomId.trim()}?nickname=${encodeURIComponent(joinNickname.trim())}`);
    } catch (error) {
      console.error('Error joining room:', error);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-primary)]">
      <div className="max-w-4xl w-full space-y-12 text-center">
        {/* Hero Section */}
        <div className="space-y-6">
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-[var(--brand-primary)] via-[var(--brand-accent)] to-[var(--brand-secondary)] bg-clip-text text-transparent">
            Plot Twist
          </h1>
          <p className="text-2xl md:text-3xl text-[var(--text-secondary)] font-medium">
            Collaborative storytelling meets AI chaos
          </p>
          <p className="text-lg text-[var(--text-tertiary)] max-w-2xl mx-auto">
            Write stories together with friends, then watch as AI injects
            hilarious twists that send your narrative spiraling into beautiful
            chaos.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {/* Create Room Dialog */}
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="text-lg px-8 py-6 gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create Room
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create a New Room</DialogTitle>
                <DialogDescription>
                  Set up your storytelling session and invite your friends.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 pt-4">
                {/* Nickname */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--text-primary)]">
                    Your Nickname *
                  </label>
                  <Input
                    placeholder="Enter your nickname..."
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    maxLength={20}
                  />
                </div>

                {/* Game Mode */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--text-primary)]">
                    Game Mode
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={gameMode === 'freeform' ? 'default' : 'secondary'}
                      onClick={() => setGameMode('freeform')}
                      type="button"
                    >
                      Freeform
                    </Button>
                    <Button
                      variant={gameMode === 'themed' ? 'default' : 'secondary'}
                      onClick={() => setGameMode('themed')}
                      type="button"
                    >
                      Themed
                    </Button>
                  </div>
                  <p className="text-xs text-[var(--text-tertiary)]">
                    {gameMode === 'freeform'
                      ? 'Write any story you want'
                      : 'AI will match a specific genre'}
                  </p>
                </div>

                {/* Theme (if themed mode) */}
                {gameMode === 'themed' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--text-primary)]">
                      Theme
                    </label>
                    <select
                      value={theme}
                      onChange={(e) => setTheme(e.target.value)}
                      className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                    >
                      {THEMES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Max Players */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--text-primary)]">
                    Max Players: {maxPlayers}
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="8"
                    value={maxPlayers}
                    onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-xs text-[var(--text-tertiary)]">
                    Recommended: 4-6 players for best experience
                  </p>
                </div>

                {/* Create Button */}
                <Button
                  onClick={handleCreateRoom}
                  disabled={!nickname.trim() || isCreating}
                  className="w-full"
                  size="lg"
                >
                  {isCreating ? 'Creating...' : 'Create Room'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Join Room Dialog */}
          <Dialog open={joinDialogOpen} onOpenChange={setJoinDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6 gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                Join Room
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Join a Room</DialogTitle>
                <DialogDescription>
                  Enter the room ID from your friend's invitation.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 pt-4">
                {/* Room ID */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--text-primary)]">
                    Room ID *
                  </label>
                  <Input
                    placeholder="Enter room ID..."
                    value={joinRoomId}
                    onChange={(e) => setJoinRoomId(e.target.value)}
                    maxLength={10}
                  />
                </div>

                {/* Nickname */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--text-primary)]">
                    Your Nickname *
                  </label>
                  <Input
                    placeholder="Enter your nickname..."
                    value={joinNickname}
                    onChange={(e) => setJoinNickname(e.target.value)}
                    maxLength={20}
                  />
                </div>

                {/* Join Button */}
                <Button
                  onClick={handleJoinRoom}
                  disabled={!joinRoomId.trim() || !joinNickname.trim() || isJoining}
                  className="w-full"
                  size="lg"
                >
                  {isJoining ? 'Joining...' : 'Join Room'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 pt-12">
          <Card className="p-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-[var(--brand-primary)]/20 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-[var(--brand-primary)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[var(--text-primary)]">
              Multiplayer
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Collaborate with 2-8 friends in real-time to create unique stories
              together.
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-[var(--brand-accent)]/20 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-[var(--brand-accent)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[var(--text-primary)]">
              AI Chaos Agent
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">
              AI injects hilarious, unexpected twists that send your story in wild
              new directions.
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-[var(--brand-secondary)]/20 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-[var(--brand-secondary)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[var(--text-primary)]">
              Pure Fun
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">
              No winners, no losers. Just laugh together as chaos unfolds in your
              collaborative narrative.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
