'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlayerList, type Player } from './PlayerList';

interface WaitingRoomProps {
  roomId: string;
  gameMode: 'freeform' | 'themed';
  theme?: string | null;
  players: Player[];
  currentPlayerId: string;
  minPlayers?: number;
  maxPlayers?: number;
  onStartGame?: () => void;
  onCopyLink?: () => void;
  shareableLink?: string;
}

/**
 * WaitingRoom Component
 *
 * Pre-game lobby showing:
 * - Room details (mode, theme)
 * - Player list with real-time updates
 * - Shareable invite link
 * - Game start button (when enough players)
 * - QR code for in-person sharing
 *
 * @example
 * <WaitingRoom
 *   roomId="abc123"
 *   gameMode="themed"
 *   theme="Horror"
 *   players={activePlayers}
 *   currentPlayerId="player-1"
 *   onStartGame={handleStart}
 *   shareableLink="https://plottwist.app/room/abc123"
 * />
 */
export function WaitingRoom({
  roomId,
  gameMode,
  theme,
  players,
  currentPlayerId,
  minPlayers = 2,
  maxPlayers = 6,
  onStartGame,
  onCopyLink,
  shareableLink,
}: WaitingRoomProps) {
  const [linkCopied, setLinkCopied] = useState(false);

  const activePlayers = players.filter((p) => p.isActive !== false);
  const canStart = activePlayers.length >= minPlayers;
  const isHost = activePlayers[0]?.id === currentPlayerId; // First player is host

  /**
   * Copy invite link to clipboard
   */
  const handleCopyLink = async () => {
    const link = shareableLink || `${window.location.origin}/room/${roomId}`;

    try {
      await navigator.clipboard.writeText(link);
      setLinkCopied(true);
      onCopyLink?.();

      setTimeout(() => {
        setLinkCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--bg-primary)]">
      <div className="max-w-4xl w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-[var(--text-primary)]">
            Waiting Room
          </h1>
          <p className="text-[var(--text-secondary)]">
            Invite your friends to join the chaos!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column: Room Info */}
          <div className="space-y-6">
            {/* Room Details */}
            <Card className="p-6 space-y-4">
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                Room Details
              </h2>

              <div className="space-y-3">
                {/* Room ID */}
                <div>
                  <label className="text-sm text-[var(--text-tertiary)]">
                    Room ID
                  </label>
                  <div className="mt-1 flex items-center gap-2">
                    <code className="flex-1 px-3 py-2 bg-[var(--bg-tertiary)] rounded font-mono text-sm text-[var(--text-primary)]">
                      {roomId}
                    </code>
                  </div>
                </div>

                {/* Game Mode */}
                <div>
                  <label className="text-sm text-[var(--text-tertiary)]">
                    Game Mode
                  </label>
                  <div className="mt-1">
                    <Badge variant="default" className="text-sm capitalize">
                      {gameMode}
                    </Badge>
                  </div>
                </div>

                {/* Theme (if themed mode) */}
                {gameMode === 'themed' && theme && (
                  <div>
                    <label className="text-sm text-[var(--text-tertiary)]">
                      Theme
                    </label>
                    <div className="mt-1">
                      <Badge variant="secondary" className="text-sm">
                        {theme}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Invite Link */}
            <Card className="p-6 space-y-4">
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                Invite Players
              </h2>

              <div className="space-y-3">
                {/* Copy Link */}
                <div>
                  <label className="text-sm text-[var(--text-tertiary)]">
                    Shareable Link
                  </label>
                  <div className="mt-1 flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={
                        shareableLink || `${window.location.origin}/room/${roomId}`
                      }
                      className="flex-1 px-3 py-2 bg-[var(--bg-tertiary)] rounded text-sm text-[var(--text-primary)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                      onClick={(e) => e.currentTarget.select()}
                    />
                    <Button
                      onClick={handleCopyLink}
                      variant="secondary"
                      size="sm"
                      className="gap-2"
                    >
                      {linkCopied ? (
                        <>
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Instructions */}
                <div className="p-3 bg-[var(--bg-tertiary)] rounded-lg">
                  <p className="text-sm text-[var(--text-secondary)]">
                    <strong>How to invite:</strong> Share this link with your
                    friends. They can join directly from their browser!
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Players */}
          <div className="space-y-6">
            {/* Player List */}
            <PlayerList
              players={players}
              currentPlayerId={currentPlayerId}
              showTypingIndicators={false}
              maxPlayers={maxPlayers}
            />

            {/* Start Game */}
            <Card className="p-6 space-y-4">
              {canStart ? (
                <>
                  <div className="flex items-center gap-2 text-[var(--color-success)]">
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="font-medium">Ready to start!</span>
                  </div>

                  {isHost ? (
                    <Button
                      onClick={onStartGame}
                      size="lg"
                      className="w-full gap-2 text-base"
                    >
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
                          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Start Game
                    </Button>
                  ) : (
                    <div className="text-center p-4 bg-[var(--bg-tertiary)] rounded-lg">
                      <p className="text-sm text-[var(--text-secondary)]">
                        Waiting for host to start the game...
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center p-4 bg-[var(--bg-tertiary)] rounded-lg">
                  <p className="text-sm text-[var(--text-secondary)]">
                    <strong>Waiting for players...</strong>
                  </p>
                  <p className="text-xs text-[var(--text-tertiary)] mt-1">
                    Need at least {minPlayers} players to start ({' '}
                    {minPlayers - activePlayers.length} more)
                  </p>
                </div>
              )}
            </Card>

            {/* Game Rules */}
            <Card className="p-4 bg-[var(--bg-tertiary)]">
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">
                How to Play
              </h3>
              <ul className="space-y-1 text-xs text-[var(--text-secondary)]">
                <li>• Take turns adding to the collaborative story</li>
                <li>• AI will inject hilarious twists at random moments</li>
                <li>• React and build on the chaos</li>
                <li>• Have fun and be creative!</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
