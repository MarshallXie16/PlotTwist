'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export interface Player {
  id: string;
  nickname: string;
  color: string;
  isTyping?: boolean;
  isActive?: boolean;
}

interface PlayerListProps {
  players: Player[];
  currentPlayerId?: string;
  showTypingIndicators?: boolean;
  maxPlayers?: number;
}

/**
 * PlayerList Component
 *
 * Displays the list of active players in a room with:
 * - Player nickname with color indicator
 * - Typing indicators
 * - Current player highlighting
 * - Player count / max players
 *
 * @example
 * <PlayerList
 *   players={activePlayers}
 *   currentPlayerId="player-123"
 *   showTypingIndicators={true}
 *   maxPlayers={6}
 * />
 */
export function PlayerList({
  players,
  currentPlayerId,
  showTypingIndicators = true,
  maxPlayers = 6,
}: PlayerListProps) {
  const activePlayers = players.filter((p) => p.isActive !== false);
  const spotsRemaining = maxPlayers - activePlayers.length;

  return (
    <Card className="p-4">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            Players
          </h3>
          <Badge variant="secondary">
            {activePlayers.length}/{maxPlayers}
          </Badge>
        </div>

        {/* Player List */}
        <div className="space-y-2">
          {activePlayers.map((player) => {
            const isCurrentPlayer = player.id === currentPlayerId;

            return (
              <div
                key={player.id}
                className={`
                  flex items-center gap-3 p-3 rounded-lg
                  transition-all duration-200
                  ${
                    isCurrentPlayer
                      ? 'bg-[var(--bg-tertiary)] ring-2 ring-[var(--brand-primary)]'
                      : 'bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)]'
                  }
                `}
              >
                {/* Color Indicator */}
                <div
                  className="w-4 h-4 rounded-full ring-2 ring-offset-2 ring-offset-[var(--bg-secondary)] flex-shrink-0"
                  style={{
                    backgroundColor: player.color,
                  }}
                  aria-label={`${player.nickname}'s color`}
                />

                {/* Player Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`
                        font-medium truncate
                        ${
                          isCurrentPlayer
                            ? 'text-[var(--brand-primary)]'
                            : 'text-[var(--text-primary)]'
                        }
                      `}
                    >
                      {player.nickname}
                    </span>
                    {isCurrentPlayer && (
                      <Badge variant="default" className="text-xs px-2 py-0">
                        You
                      </Badge>
                    )}
                  </div>

                  {/* Typing Indicator */}
                  {showTypingIndicators && player.isTyping && (
                    <div className="flex items-center gap-1 mt-1">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-[var(--brand-primary)] rounded-full animate-bounce [animation-delay:0ms]" />
                        <span className="w-1.5 h-1.5 bg-[var(--brand-primary)] rounded-full animate-bounce [animation-delay:150ms]" />
                        <span className="w-1.5 h-1.5 bg-[var(--brand-primary)] rounded-full animate-bounce [animation-delay:300ms]" />
                      </div>
                      <span className="text-xs text-[var(--text-tertiary)] ml-1">
                        typing...
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty Slots */}
        {spotsRemaining > 0 && (
          <div className="pt-2 border-t border-[var(--border)]">
            <p className="text-sm text-[var(--text-tertiary)] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--text-tertiary)] opacity-30" />
              {spotsRemaining} {spotsRemaining === 1 ? 'spot' : 'spots'} remaining
            </p>
          </div>
        )}

        {/* No Players State */}
        {activePlayers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-[var(--text-tertiary)]">
              Waiting for players to join...
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
