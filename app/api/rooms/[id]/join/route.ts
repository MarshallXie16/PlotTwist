import { NextRequest, NextResponse } from 'next/server';
import {
  initDb,
  getRoom,
  addPlayer,
  isRoomFull,
  isNicknameTaken,
  getAvailablePlayerColor,
} from '@/lib/db';

// Initialize database
initDb();

/**
 * POST /api/rooms/[id]/join
 * Join an existing room
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: roomId } = await params;
    const body = await request.json();
    const { nickname } = body;

    // Validate input
    if (!nickname || typeof nickname !== 'string' || nickname.trim().length === 0) {
      return NextResponse.json(
        { error: 'Nickname is required' },
        { status: 400 }
      );
    }

    // Check if room exists and is active
    const room = getRoom(roomId);
    if (!room || !room.is_active) {
      return NextResponse.json(
        { error: 'Room not found or inactive' },
        { status: 404 }
      );
    }

    // Check if room is full
    if (isRoomFull(roomId)) {
      return NextResponse.json(
        { error: 'Room is full' },
        { status: 400 }
      );
    }

    // Check if nickname is already taken
    if (isNicknameTaken(roomId, nickname.trim())) {
      return NextResponse.json(
        { error: 'Nickname already taken in this room' },
        { status: 400 }
      );
    }

    // Add player to room
    const playerColor = getAvailablePlayerColor(roomId);
    const player = addPlayer(roomId, nickname.trim(), playerColor);

    console.log(`[API] Player ${player.nickname} joined room ${roomId}`);

    return NextResponse.json({
      playerId: player.id,
      playerColor: player.color,
      room: {
        id: room.id,
        gameMode: room.game_mode,
        theme: room.theme,
        maxPlayers: room.max_players,
      },
    });
  } catch (error) {
    console.error('[API] Error joining room:', error);
    return NextResponse.json(
      { error: 'Failed to join room' },
      { status: 500 }
    );
  }
}
