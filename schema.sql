-- Plot Twist Database Schema
-- SQLite database for MVP

-- Rooms table: stores game room metadata
CREATE TABLE IF NOT EXISTS rooms (
  id TEXT PRIMARY KEY,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  is_active INTEGER DEFAULT 1,
  max_players INTEGER DEFAULT 6,
  game_mode TEXT DEFAULT 'freeform',
  theme TEXT,
  CHECK (is_active IN (0, 1)),
  CHECK (max_players > 0 AND max_players <= 8),
  CHECK (game_mode IN ('freeform', 'themed'))
);

-- Index for finding active, non-expired rooms
CREATE INDEX IF NOT EXISTS idx_rooms_active
ON rooms(is_active, expires_at);

-- Players table: stores player information
CREATE TABLE IF NOT EXISTS players (
  id TEXT PRIMARY KEY,
  room_id TEXT NOT NULL,
  nickname TEXT NOT NULL,
  color TEXT NOT NULL,
  joined_at INTEGER NOT NULL,
  is_active INTEGER DEFAULT 1,
  CHECK (is_active IN (0, 1)),
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

-- Index for finding players in a room
CREATE INDEX IF NOT EXISTS idx_players_room
ON players(room_id, is_active);

-- Stories table: stores story metadata per room
CREATE TABLE IF NOT EXISTS stories (
  id TEXT PRIMARY KEY,
  room_id TEXT UNIQUE NOT NULL,
  started_at INTEGER NOT NULL,
  completed_at INTEGER,
  is_complete INTEGER DEFAULT 0,
  CHECK (is_complete IN (0, 1)),
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

-- Index for finding stories by room
CREATE INDEX IF NOT EXISTS idx_stories_room
ON stories(room_id, is_complete);

-- Contributions table: stores individual story contributions
CREATE TABLE IF NOT EXISTS contributions (
  id TEXT PRIMARY KEY,
  story_id TEXT NOT NULL,
  player_id TEXT,
  content TEXT NOT NULL,
  type TEXT NOT NULL,
  order_num INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  twist_type TEXT,
  CHECK (type IN ('player', 'ai')),
  CHECK (twist_type IS NULL OR twist_type IN ('insert', 'twist')),
  FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE,
  FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE SET NULL
);

-- Index for ordering contributions in a story
CREATE INDEX IF NOT EXISTS idx_contributions_story
ON contributions(story_id, order_num);

-- Index for finding contributions by time
CREATE INDEX IF NOT EXISTS idx_contributions_time
ON contributions(created_at);
