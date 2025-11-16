import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';
import type { Room, Player, Story, Contribution, ContributionWithPlayer, PLAYER_COLORS } from './types';

// Simple ID generator (replaces nanoid to avoid ESM issues in Jest)
function generateId(length: number = 10): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Database connection
let db: Database.Database | null = null;

/**
 * Get or create database connection
 */
export function getDb(): Database.Database {
  if (!db) {
    const dbPath = process.env.NODE_ENV === 'test'
      ? ':memory:'
      : path.join(process.cwd(), 'plottwist.db');

    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
}

/**
 * Initialize database with schema
 */
export function initDb(): void {
  const db = getDb();
  const schemaPath = path.join(process.cwd(), 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');
  db.exec(schema);
}

/**
 * Close database connection
 */
export function closeDb(): void {
  if (db) {
    db.close();
    db = null;
  }
}

// ========== ROOM FUNCTIONS ==========

/**
 * Create a new room
 */
export function createRoom(
  gameMode: 'freeform' | 'themed',
  theme: string | null = null,
  maxPlayers: number = 6
): Room {
  const db = getDb();
  const id = generateId(10);
  const now = Date.now();
  const expiresAt = now + (24 * 60 * 60 * 1000); // 24 hours

  const stmt = db.prepare(`
    INSERT INTO rooms (id, created_at, expires_at, game_mode, theme, max_players)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  stmt.run(id, now, expiresAt, gameMode, theme, maxPlayers);

  return getRoom(id)!;
}

/**
 * Get room by ID
 */
export function getRoom(roomId: string): Room | null {
  const db = getDb();
  const stmt = db.prepare('SELECT * FROM rooms WHERE id = ?');
  return stmt.get(roomId) as Room | null;
}

/**
 * Get active rooms (not expired)
 */
export function getActiveRooms(): Room[] {
  const db = getDb();
  const now = Date.now();
  const stmt = db.prepare(`
    SELECT * FROM rooms
    WHERE is_active = 1 AND expires_at > ?
    ORDER BY created_at DESC
  `);
  return stmt.all(now) as Room[];
}

/**
 * Mark room as inactive
 */
export function deactivateRoom(roomId: string): void {
  const db = getDb();
  const stmt = db.prepare('UPDATE rooms SET is_active = 0 WHERE id = ?');
  stmt.run(roomId);
}

/**
 * Cleanup expired rooms
 */
export function cleanupExpiredRooms(): number {
  const db = getDb();
  const now = Date.now();
  const stmt = db.prepare(`
    UPDATE rooms
    SET is_active = 0
    WHERE expires_at < ? AND is_active = 1
  `);
  const result = stmt.run(now);
  return result.changes;
}

// ========== PLAYER FUNCTIONS ==========

/**
 * Add player to room
 */
export function addPlayer(
  roomId: string,
  nickname: string,
  color: string
): Player {
  const db = getDb();
  const id = generateId(10);
  const now = Date.now();

  const stmt = db.prepare(`
    INSERT INTO players (id, room_id, nickname, color, joined_at)
    VALUES (?, ?, ?, ?, ?)
  `);

  stmt.run(id, roomId, nickname, color, now);

  return getPlayer(id)!;
}

/**
 * Get player by ID
 */
export function getPlayer(playerId: string): Player | null {
  const db = getDb();
  const stmt = db.prepare('SELECT * FROM players WHERE id = ?');
  return stmt.get(playerId) as Player | null;
}

/**
 * Get all active players in a room
 */
export function getActivePlayers(roomId: string): Player[] {
  const db = getDb();
  const stmt = db.prepare(`
    SELECT * FROM players
    WHERE room_id = ? AND is_active = 1
    ORDER BY joined_at ASC
  `);
  return stmt.all(roomId) as Player[];
}

/**
 * Mark player as inactive
 */
export function deactivatePlayer(playerId: string): void {
  const db = getDb();
  const stmt = db.prepare('UPDATE players SET is_active = 0 WHERE id = ?');
  stmt.run(playerId);
}

/**
 * Check if room is full
 */
export function isRoomFull(roomId: string): boolean {
  const room = getRoom(roomId);
  if (!room) return true;

  const activePlayers = getActivePlayers(roomId);
  return activePlayers.length >= room.max_players;
}

// ========== STORY FUNCTIONS ==========

/**
 * Create a new story for a room
 */
export function createStory(roomId: string): Story {
  const db = getDb();
  const id = generateId(10);
  const now = Date.now();

  const stmt = db.prepare(`
    INSERT INTO stories (id, room_id, started_at)
    VALUES (?, ?, ?)
  `);

  stmt.run(id, roomId, now);

  return getStory(id)!;
}

/**
 * Get story by ID
 */
export function getStory(storyId: string): Story | null {
  const db = getDb();
  const stmt = db.prepare('SELECT * FROM stories WHERE id = ?');
  return stmt.get(storyId) as Story | null;
}

/**
 * Get story by room ID
 */
export function getStoryByRoom(roomId: string): Story | null {
  const db = getDb();
  const stmt = db.prepare('SELECT * FROM stories WHERE room_id = ?');
  return stmt.get(roomId) as Story | null;
}

/**
 * Complete a story
 */
export function completeStory(storyId: string): void {
  const db = getDb();
  const now = Date.now();
  const stmt = db.prepare(`
    UPDATE stories
    SET is_complete = 1, completed_at = ?
    WHERE id = ?
  `);
  stmt.run(now, storyId);
}

// ========== CONTRIBUTION FUNCTIONS ==========

/**
 * Add a contribution to a story
 */
export function addContribution(
  storyId: string,
  content: string,
  type: 'player' | 'ai',
  playerId?: string,
  twistType?: 'insert' | 'twist'
): Contribution {
  const db = getDb();
  const id = generateId(10);
  const now = Date.now();

  // Get next order number
  const orderStmt = db.prepare(`
    SELECT COALESCE(MAX(order_num), -1) + 1 as next_order
    FROM contributions WHERE story_id = ?
  `);
  const { next_order } = orderStmt.get(storyId) as { next_order: number };

  const stmt = db.prepare(`
    INSERT INTO contributions (id, story_id, player_id, content, type, order_num, created_at, twist_type)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    id,
    storyId,
    playerId || null,
    content,
    type,
    next_order,
    now,
    twistType || null
  );

  return getContribution(id)!;
}

/**
 * Get contribution by ID
 */
export function getContribution(contributionId: string): Contribution | null {
  const db = getDb();
  const stmt = db.prepare('SELECT * FROM contributions WHERE id = ?');
  return stmt.get(contributionId) as Contribution | null;
}

/**
 * Get all contributions for a story (ordered)
 */
export function getStoryContributions(storyId: string): ContributionWithPlayer[] {
  const db = getDb();
  const stmt = db.prepare(`
    SELECT
      c.*,
      p.nickname as player_nickname,
      p.color as player_color
    FROM contributions c
    LEFT JOIN players p ON c.player_id = p.id
    WHERE c.story_id = ?
    ORDER BY c.order_num ASC
  `);
  return stmt.all(storyId) as ContributionWithPlayer[];
}

/**
 * Get contribution count for a story
 */
export function getContributionCount(storyId: string): number {
  const db = getDb();
  const stmt = db.prepare(`
    SELECT COUNT(*) as count FROM contributions WHERE story_id = ?
  `);
  const { count } = stmt.get(storyId) as { count: number };
  return count;
}

/**
 * Get player contribution count for a story
 */
export function getPlayerContributionCount(storyId: string): number {
  const db = getDb();
  const stmt = db.prepare(`
    SELECT COUNT(*) as count
    FROM contributions
    WHERE story_id = ? AND type = 'player'
  `);
  const { count } = stmt.get(storyId) as { count: number };
  return count;
}

/**
 * Get AI contribution count for a story
 */
export function getAIContributionCount(storyId: string): number {
  const db = getDb();
  const stmt = db.prepare(`
    SELECT COUNT(*) as count
    FROM contributions
    WHERE story_id = ? AND type = 'ai'
  `);
  const { count } = stmt.get(storyId) as { count: number };
  return count;
}

// ========== HELPER FUNCTIONS ==========

/**
 * Get a player color that's not already in use
 */
export function getAvailablePlayerColor(roomId: string): string {
  const activePlayers = getActivePlayers(roomId);
  const usedColors = new Set(activePlayers.map(p => p.color));

  const PLAYER_COLORS = [
    '#EF4444', // Red
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Amber
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#14B8A6', // Teal
    '#F97316', // Orange
  ];

  for (const color of PLAYER_COLORS) {
    if (!usedColors.has(color)) {
      return color;
    }
  }

  // If all colors are used, return a random one
  return PLAYER_COLORS[Math.floor(Math.random() * PLAYER_COLORS.length)];
}

/**
 * Check if a nickname is already taken in a room
 */
export function isNicknameTaken(roomId: string, nickname: string): boolean {
  const activePlayers = getActivePlayers(roomId);
  return activePlayers.some(p => p.nickname.toLowerCase() === nickname.toLowerCase());
}
