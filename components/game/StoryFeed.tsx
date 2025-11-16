'use client';

import React, { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface StoryContribution {
  id: string;
  content: string;
  type: 'player' | 'ai';
  playerNickname?: string;
  playerColor?: string;
  orderNum: number;
  createdAt?: number;
}

interface StoryFeedProps {
  contributions: StoryContribution[];
  aiThinking?: boolean;
  autoScroll?: boolean;
}

/**
 * StoryFeed Component
 *
 * Displays the collaborative story as it unfolds with:
 * - Player contributions with color-coded attribution
 * - AI twists with special styling
 * - Auto-scroll to latest contribution
 * - AI thinking indicator
 * - Chronological ordering
 *
 * @example
 * <StoryFeed
 *   contributions={storyContributions}
 *   aiThinking={false}
 *   autoScroll={true}
 * />
 */
export function StoryFeed({
  contributions,
  aiThinking = false,
  autoScroll = true,
}: StoryFeedProps) {
  const feedEndRef = useRef<HTMLDivElement>(null);
  const feedRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new contributions arrive
  useEffect(() => {
    if (autoScroll && feedEndRef.current) {
      feedEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [contributions.length, aiThinking, autoScroll]);

  // Sort contributions by order number
  const sortedContributions = [...contributions].sort(
    (a, b) => a.orderNum - b.orderNum
  );

  return (
    <Card className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            The Story
          </h2>
          <Badge variant="secondary">
            {contributions.length} contribution{contributions.length !== 1 ? 's' : ''}
          </Badge>
        </div>
      </div>

      {/* Story Feed */}
      <div
        ref={feedRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
      >
        {/* Empty State */}
        {sortedContributions.length === 0 && !aiThinking && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-2">
              <p className="text-lg font-medium text-[var(--text-secondary)]">
                Your story begins here...
              </p>
              <p className="text-sm text-[var(--text-tertiary)]">
                Write the first line to get started!
              </p>
            </div>
          </div>
        )}

        {/* Contributions */}
        {sortedContributions.map((contribution, index) => {
          const isAI = contribution.type === 'ai';
          const isFirst = index === 0;

          return (
            <div
              key={contribution.id}
              className={`
                group relative
                ${isFirst ? 'text-lg' : ''}
              `}
            >
              {/* Attribution */}
              <div className="flex items-center gap-2 mb-2">
                {!isAI && contribution.playerColor && (
                  <div
                    className="w-3 h-3 rounded-full ring-2 ring-offset-1 ring-offset-[var(--bg-primary)]"
                    style={{
                      backgroundColor: contribution.playerColor,
                    }}
                  />
                )}
                <span
                  className={`
                    text-sm font-medium
                    ${
                      isAI
                        ? 'text-[var(--brand-accent)]'
                        : 'text-[var(--text-secondary)]'
                    }
                  `}
                >
                  {isAI ? '✨ AI Twist' : contribution.playerNickname}
                </span>
                {isFirst && (
                  <Badge variant="secondary" className="text-xs">
                    Opening
                  </Badge>
                )}
              </div>

              {/* Content */}
              <div
                className={`
                  p-4 rounded-lg
                  ${
                    isAI
                      ? 'bg-gradient-to-br from-[var(--brand-accent)]/10 to-[var(--brand-primary)]/10 border-2 border-[var(--brand-accent)]/30'
                      : 'bg-[var(--bg-secondary)]'
                  }
                  transition-all duration-200
                  group-hover:ring-2 group-hover:ring-[var(--brand-primary)]/20
                `}
              >
                <p
                  className={`
                    leading-relaxed
                    ${
                      isAI
                        ? 'text-[var(--text-primary)] font-medium italic'
                        : 'text-[var(--text-primary)]'
                    }
                  `}
                >
                  {contribution.content}
                </p>
              </div>

              {/* Contribution Number */}
              <div className="absolute -left-8 top-0 text-xs text-[var(--text-tertiary)] opacity-0 group-hover:opacity-100 transition-opacity">
                #{contribution.orderNum}
              </div>
            </div>
          );
        })}

        {/* AI Thinking Indicator */}
        {aiThinking && (
          <div className="p-4 rounded-lg bg-gradient-to-br from-[var(--brand-accent)]/10 to-[var(--brand-primary)]/10 border-2 border-[var(--brand-accent)]/30">
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-[var(--brand-accent)] rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 bg-[var(--brand-accent)] rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 bg-[var(--brand-accent)] rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
              <span className="text-sm font-medium text-[var(--brand-accent)] italic">
                AI is crafting chaos...
              </span>
            </div>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={feedEndRef} />
      </div>

      {/* Footer (optional story stats) */}
      {contributions.length > 0 && (
        <div className="p-3 border-t border-[var(--border)] bg-[var(--bg-secondary)]">
          <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)]">
            <span>
              {contributions.filter((c) => c.type === 'player').length} player
              contributions
            </span>
            <span>
              {contributions.filter((c) => c.type === 'ai').length} AI twists
            </span>
          </div>
        </div>
      )}
    </Card>
  );
}
