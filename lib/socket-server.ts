import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import type {
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
} from './socket-types';
import {
  getRoom,
  getPlayer,
  getActivePlayers,
  addContribution,
  getStoryByRoom,
  isRoomFull,
  getStoryContributions,
} from './db';
import { getAIService } from './ai-service';
import type { TwistType } from './ai-prompts';

// Singleton pattern for Socket.io server
let io: SocketIOServer<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
> | null = null;

/**
 * Initialize Socket.io server
 */
export function initSocketServer(httpServer: HTTPServer): SocketIOServer {
  if (io) {
    return io;
  }

  io = new SocketIOServer<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(httpServer, {
    cors: {
      origin: process.env.NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_APP_URL
        : 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  // Connection handler
  io.on('connection', (socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);

    // ========== ROOM MANAGEMENT ==========

    /**
     * Join a room
     */
    socket.on('room:join', async ({ roomId, playerId }, callback) => {
      try {
        // Validate room exists and is active
        const room = getRoom(roomId);
        if (!room || !room.is_active) {
          callback({ success: false, error: 'Room not found or inactive' });
          return;
        }

        // Check if room is full
        if (isRoomFull(roomId)) {
          callback({ success: false, error: 'Room is full' });
          return;
        }

        // Validate player exists
        const player = getPlayer(playerId);
        if (!player || player.room_id !== roomId) {
          callback({ success: false, error: 'Player not found or not in this room' });
          return;
        }

        // Join Socket.io room
        await socket.join(roomId);

        // Store player data in socket
        socket.data.playerId = playerId;
        socket.data.roomId = roomId;
        socket.data.nickname = player.nickname;

        // Notify other players
        socket.to(roomId).emit('room:player-joined', {
          playerId: player.id,
          nickname: player.nickname,
          color: player.color,
        });

        // Send current player count
        const activePlayers = getActivePlayers(roomId);
        io?.to(roomId).emit('room:updated', {
          roomId,
          playerCount: activePlayers.length,
        });

        callback({ success: true });
      } catch (error) {
        console.error('[Socket.io] Error joining room:', error);
        callback({ success: false, error: 'Failed to join room' });
      }
    });

    /**
     * Leave a room
     */
    socket.on('room:leave', async ({ roomId, playerId }) => {
      try {
        await socket.leave(roomId);

        // Notify other players
        socket.to(roomId).emit('room:player-left', { playerId });

        // Update player count
        const activePlayers = getActivePlayers(roomId);
        io?.to(roomId).emit('room:updated', {
          roomId,
          playerCount: activePlayers.length,
        });

        // Clear socket data
        socket.data.playerId = undefined;
        socket.data.roomId = undefined;
        socket.data.nickname = undefined;
      } catch (error) {
        console.error('[Socket.io] Error leaving room:', error);
      }
    });

    // ========== CONTRIBUTIONS ==========

    /**
     * Submit a contribution
     */
    socket.on('contribution:submit', async ({ roomId, playerId, content }, callback) => {
      try {
        // Validate player
        const player = getPlayer(playerId);
        if (!player || player.room_id !== roomId) {
          callback({ success: false, error: 'Invalid player or room' });
          return;
        }

        // Get or create story
        let story = getStoryByRoom(roomId);
        if (!story) {
          callback({ success: false, error: 'No active story in this room' });
          return;
        }

        // Add contribution
        const contribution = addContribution(
          story.id,
          content,
          'player',
          playerId
        );

        // Broadcast to all players in room
        io?.to(roomId).emit('story:new-contribution', {
          contributionId: contribution.id,
          content: contribution.content,
          type: 'player',
          playerNickname: player.nickname,
          playerColor: player.color,
          orderNum: contribution.order_num,
        });

        callback({ success: true, contributionId: contribution.id });
      } catch (error) {
        console.error('[Socket.io] Error submitting contribution:', error);
        callback({ success: false, error: 'Failed to submit contribution' });
      }
    });

    // ========== TYPING INDICATORS ==========

    /**
     * Player started typing
     */
    socket.on('typing:start', ({ roomId, playerId }) => {
      const player = getPlayer(playerId);
      if (player) {
        socket.to(roomId).emit('player:typing', {
          playerId,
          nickname: player.nickname,
          isTyping: true,
        });
      }
    });

    /**
     * Player stopped typing
     */
    socket.on('typing:stop', ({ roomId, playerId }) => {
      const player = getPlayer(playerId);
      if (player) {
        socket.to(roomId).emit('player:typing', {
          playerId,
          nickname: player.nickname,
          isTyping: false,
        });
      }
    });

    // ========== AI TWISTS ==========

    /**
     * Request an AI-generated twist
     */
    socket.on('game:request-ai-twist', async ({ roomId }) => {
      try {
        // Get room and story
        const room = getRoom(roomId);
        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        const story = getStoryByRoom(roomId);
        if (!story) {
          socket.emit('error', { message: 'No active story in this room' });
          return;
        }

        // Notify all players that AI is thinking
        io?.to(roomId).emit('game:ai-thinking', { isThinking: true });

        // Get story contributions for context
        const contributions = getStoryContributions(story.id);

        // Generate AI twist
        const aiService = getAIService({ useMock: !process.env.ANTHROPIC_API_KEY });
        const response = await aiService.generateTwist({
          contributions,
          theme: room.theme || undefined,
        });

        // Add AI contribution to story
        const aiContribution = addContribution(
          story.id,
          response.twist,
          'ai',
          undefined,
          'twist' // AI contributions are always "twists"
        );

        // Notify AI is done thinking
        io?.to(roomId).emit('game:ai-thinking', { isThinking: false });

        // Broadcast the twist to all players
        io?.to(roomId).emit('story:new-contribution', {
          contributionId: aiContribution.id,
          content: aiContribution.content,
          type: 'ai',
          orderNum: aiContribution.order_num,
        });

        console.log(`[AI Service] Generated twist for room ${roomId}: "${response.twist.substring(0, 50)}..."`);
      } catch (error) {
        console.error('[Socket.io] Error generating AI twist:', error);
        io?.to(roomId).emit('game:ai-thinking', { isThinking: false });
        socket.emit('error', { message: 'Failed to generate AI twist' });
      }
    });

    // ========== DISCONNECTION ==========

    /**
     * Handle disconnection
     */
    socket.on('disconnect', () => {
      console.log(`[Socket.io] Client disconnected: ${socket.id}`);

      // If player was in a room, notify others
      if (socket.data.roomId && socket.data.playerId) {
        socket.to(socket.data.roomId).emit('room:player-left', {
          playerId: socket.data.playerId,
        });

        // Update player count
        const activePlayers = getActivePlayers(socket.data.roomId);
        io?.to(socket.data.roomId).emit('room:updated', {
          roomId: socket.data.roomId,
          playerCount: activePlayers.length,
        });
      }
    });
  });

  return io;
}

/**
 * Get the Socket.io server instance
 */
export function getSocketServer(): SocketIOServer | null {
  return io;
}
