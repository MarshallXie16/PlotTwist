import { NextRequest, NextResponse } from 'next/server';
import {
  initDb,
  getRoom,
  getActivePlayers,
  getStoryByRoom,
  getStoryContributions,
} from '@/lib/db';

// Initialize database
initDb();

/**
 * GET /api/rooms/[id]
 * Get room status and details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: roomId } = await params;

    // Get room
    const room = getRoom(roomId);
    if (!room || !room.is_active) {
      return NextResponse.json(
        { error: 'Room not found or inactive' },
        { status: 404 }
      );
    }

    // Get active players
    const players = getActivePlayers(roomId);

    // Get story if exists
    const story = getStoryByRoom(roomId);
    let contributions = [];
    let contributionCount = 0;

    if (story) {
      contributions = getStoryContributions(story.id);
      contributionCount = contributions.length;
    }

    // Build response
    return NextResponse.json({
      room: {
        id: room.id,
        gameMode: room.game_mode,
        theme: room.theme,
        maxPlayers: room.max_players,
        createdAt: room.created_at,
        expiresAt: room.expires_at,
        isActive: room.is_active === 1,
      },
      players: players.map(p => ({
        id: p.id,
        nickname: p.nickname,
        color: p.color,
        joinedAt: p.joined_at,
        isActive: p.is_active === 1,
      })),
      story: story
        ? {
            id: story.id,
            startedAt: story.started_at,
            completedAt: story.completed_at,
            isComplete: story.is_complete === 1,
            contributionCount,
          }
        : null,
      stats: {
        playerCount: players.length,
        contributionCount,
        isGameStarted: story !== null && contributionCount > 0,
        isGameComplete: story?.is_complete === 1,
      },
    });
  } catch (error) {
    console.error('[API] Error getting room status:', error);
    return NextResponse.json(
      { error: 'Failed to get room status' },
      { status: 500 }
    );
  }
}
