import { NextRequest, NextResponse } from 'next/server';
import { initDb, createRoom, addPlayer, createStory, getAvailablePlayerColor } from '@/lib/db';

// Initialize database
initDb();

/**
 * POST /api/rooms
 * Create a new room and add the creator as the first player
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nickname, gameMode, theme, maxPlayers } = body;

    // Validate input
    if (!nickname || typeof nickname !== 'string' || nickname.trim().length === 0) {
      return NextResponse.json(
        { error: 'Nickname is required' },
        { status: 400 }
      );
    }

    if (!gameMode || !['freeform', 'themed'].includes(gameMode)) {
      return NextResponse.json(
        { error: 'Invalid game mode' },
        { status: 400 }
      );
    }

    if (gameMode === 'themed' && (!theme || typeof theme !== 'string')) {
      return NextResponse.json(
        { error: 'Theme is required for themed mode' },
        { status: 400 }
      );
    }

    const validMaxPlayers = maxPlayers && Number.isInteger(maxPlayers) && maxPlayers >= 2 && maxPlayers <= 8
      ? maxPlayers
      : 6;

    // Create room
    const room = createRoom(
      gameMode,
      gameMode === 'themed' ? theme : null,
      validMaxPlayers
    );

    // Add creator as first player
    const playerColor = getAvailablePlayerColor(room.id);
    const player = addPlayer(room.id, nickname.trim(), playerColor);

    // Create story for the room
    createStory(room.id);

    console.log(`[API] Room created: ${room.id} by ${player.nickname}`);

    return NextResponse.json({
      roomId: room.id,
      playerId: player.id,
      playerColor: player.color,
    });
  } catch (error) {
    console.error('[API] Error creating room:', error);
    return NextResponse.json(
      { error: 'Failed to create room' },
      { status: 500 }
    );
  }
}
