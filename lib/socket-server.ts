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
  completeStory,
} from './db';
import { getAIService } from './ai-service';
import type { TwistType } from './ai-prompts';
import { getPlayerContributionCount, getAIContributionCount } from './db';

// Singleton pattern for Socket.io server
let io: SocketIOServer<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
> | null = null;

/**
 * Check if AI should intervene based on contribution counts
 * Triggers after 2-3 player contributions (with randomness)
 */
function shouldTriggerAI(storyId: string): boolean {
  const playerCount = getPlayerContributionCount(storyId);
  const aiCount = getAIContributionCount(storyId);

  // Count player contributions since last AI contribution
  const contributionsSinceAI = playerCount - aiCount;

  // Don't trigger on first contribution
  if (contributionsSinceAI === 0) return false;

  // Trigger after 2-3 player turns (70% chance at 2, 100% at 3+)
  if (contributionsSinceAI >= 3) return true;
  if (contributionsSinceAI === 2) return Math.random() < 0.7;

  return false;
}

/**
 * Trigger AI intervention for a room
 */
async function triggerAIIntervention(
  roomId: string,
  ioInstance: SocketIOServer
): Promise<void> {
  try {
    // Get room and story
    const room = getRoom(roomId);
    if (!room) {
      console.error('[AI] Room not found:', roomId);
      return;
    }

    const story = getStoryByRoom(roomId);
    if (!story) {
      console.error('[AI] No story found for room:', roomId);
      return;
    }

    // Notify all players that AI is thinking
    ioInstance.to(roomId).emit('game:ai-thinking', { isThinking: true });

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
    ioInstance.to(roomId).emit('game:ai-thinking', { isThinking: false });

    // Broadcast the twist to all players
    ioInstance.to(roomId).emit('story:new-contribution', {
      contributionId: aiContribution.id,
      content: aiContribution.content,
      type: 'ai',
      orderNum: aiContribution.order_num,
    });

    console.log(`[AI] Auto-generated twist for room ${roomId}: "${response.twist.substring(0, 50)}..."`);
  } catch (error) {
    console.error('[AI] Error generating automatic twist:', error);
    // Clear thinking state on error
    ioInstance.to(roomId).emit('game:ai-thinking', { isThinking: false });
  }
}

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

    /**
     * Start the game
     */
    socket.on('game:start', async ({ roomId, playerId }, callback) => {
      try {
        // Validate room exists
        const room = getRoom(roomId);
        if (!room || !room.is_active) {
          callback({ success: false, error: 'Room not found or inactive' });
          return;
        }

        // Get active players
        const activePlayers = getActivePlayers(roomId);

        // Check minimum players (2)
        if (activePlayers.length < 2) {
          callback({ success: false, error: 'Need at least 2 players to start' });
          return;
        }

        // Verify player is the host (first player)
        const hostPlayer = activePlayers.sort((a, b) => a.joined_at - b.joined_at)[0];
        if (hostPlayer.id !== playerId) {
          callback({ success: false, error: 'Only the host can start the game' });
          return;
        }

        // Broadcast game started to all players
        const startedAt = Date.now();
        io?.to(roomId).emit('game:started', {
          roomId,
          startedAt,
        });

        console.log(`[Game] Game started in room ${roomId} with ${activePlayers.length} players`);
        callback({ success: true });
      } catch (error) {
        console.error('[Socket.io] Error starting game:', error);
        callback({ success: false, error: 'Failed to start game' });
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

        // Check if AI should intervene (async, don't await)
        if (io && shouldTriggerAI(story.id)) {
          console.log(`[AI] Triggering automatic intervention for room ${roomId}`);
          // Run AI intervention asynchronously (don't block the response)
          triggerAIIntervention(roomId, io).catch((err) => {
            console.error('[AI] Error in automatic intervention:', err);
          });
        }
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

    /**
     * End the current story
     */
    socket.on('game:end-story', async ({ roomId, storyId }) => {
      try {
        // Validate room and story
        const room = getRoom(roomId);
        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        const story = getStoryByRoom(roomId);
        if (!story || story.id !== storyId) {
          socket.emit('error', { message: 'Story not found' });
          return;
        }

        // Mark story as complete
        completeStory(storyId);
        const completedAt = Date.now();

        // Broadcast to all players
        io?.to(roomId).emit('story:completed', {
          storyId,
          completedAt,
        });

        console.log(`[Game] Story ${storyId} completed in room ${roomId}`);
      } catch (error) {
        console.error('[Socket.io] Error ending story:', error);
        socket.emit('error', { message: 'Failed to end story' });
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
