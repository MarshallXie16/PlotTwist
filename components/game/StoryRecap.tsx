import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { StoryContribution } from './StoryFeed';

export interface StoryRecapProps {
  roomId: string;
  contributions: StoryContribution[];
  players: Array<{ id: string; nickname: string; color: string }>;
  gameMode: 'freeform' | 'themed';
  theme?: string | null;
  onPlayAgain?: () => void;
  onBackToHome?: () => void;
}

export function StoryRecap({
  roomId,
  contributions,
  players,
  gameMode,
  theme,
  onPlayAgain,
  onBackToHome,
}: StoryRecapProps) {
  const playerContributions = contributions.filter((c) => c.type === 'player');
  const aiContributions = contributions.filter((c) => c.type === 'ai');

  const playerStats = players.map((player) => ({
    ...player,
    contributionCount: playerContributions.filter(
      (c) => c.playerNickname === player.nickname
    ).length,
  }));

  const topContributor = playerStats.reduce((prev, current) =>
    current.contributionCount > prev.contributionCount ? current : prev
  );

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] p-4">
      <div className="container mx-auto max-w-4xl space-y-6">
        <div className="text-center space-y-2 py-8">
          <h1 className="text-4xl font-bold text-[var(--text-primary)]">
            Story Complete! 🎉
          </h1>
          <p className="text-[var(--text-secondary)]">
            Your chaotic masterpiece
          </p>
        </div>

        <Card className="border-[var(--brand-primary)]">
          <CardHeader>
            <CardTitle>The Story</CardTitle>
            <CardDescription>
              {gameMode === 'themed' && theme && `Theme: ${theme}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {contributions.map((contribution, index) => (
              <div
                key={contribution.id}
                className={`p-4 rounded-lg ${
                  contribution.type === 'ai'
                    ? 'bg-gradient-to-r from-[var(--brand-primary)]/10 to-transparent border-l-4 border-[var(--brand-primary)]'
                    : 'bg-[var(--bg-secondary)]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xs text-[var(--text-tertiary)] w-8">
                    #{index + 1}
                  </span>
                  <div className="flex-1">
                    <p
                      className={`text-[var(--text-primary)] ${
                        contribution.type === 'ai' ? 'italic' : ''
                      }`}
                    >
                      {contribution.content}
                    </p>
                    <p className="text-xs text-[var(--text-tertiary)] mt-2">
                      {contribution.type === 'player' && contribution.playerNickname ? (
                        <span style={{ color: contribution.playerColor }}>
                          — {contribution.playerNickname}
                        </span>
                      ) : (
                        <span className="text-[var(--brand-primary)]">— AI Chaos Agent</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Contributions</CardDescription>
              <CardTitle className="text-3xl">{contributions.length}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Player Contributions</CardDescription>
              <CardTitle className="text-3xl text-[var(--color-info)]">
                {playerContributions.length}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>AI Twists</CardDescription>
              <CardTitle className="text-3xl text-[var(--brand-primary)]">
                {aiContributions.length}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Contributors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {playerStats
                .sort((a, b) => b.contributionCount - a.contributionCount)
                .map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-secondary)]"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full"
                        style={{ backgroundColor: player.color }}
                      />
                      <span className="font-medium text-[var(--text-primary)]">
                        {player.nickname}
                      </span>
                      {player.id === topContributor.id && (
                        <Badge variant="default">Top Contributor</Badge>
                      )}
                    </div>
                    <span className="text-[var(--text-secondary)]">
                      {player.contributionCount} {player.contributionCount === 1 ? 'contribution' : 'contributions'}
                    </span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pb-8">
          {onPlayAgain && (
            <Button
              size="lg"
              onClick={onPlayAgain}
              className="bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-accent)]"
            >
              Play Again
            </Button>
          )}
          {onBackToHome && (
            <Button
              size="lg"
              variant="secondary"
              onClick={onBackToHome}
            >
              Back to Home
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
