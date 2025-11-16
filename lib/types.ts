// Plot Twist Type Definitions

export interface Room {
  id: string;
  created_at: number;
  expires_at: number;
  is_active: number;
  max_players: number;
  game_mode: 'freeform' | 'themed';
  theme: string | null;
}

export interface Player {
  id: string;
  room_id: string;
  nickname: string;
  color: string;
  joined_at: number;
  is_active: number;
}

export interface Story {
  id: string;
  room_id: string;
  started_at: number;
  completed_at: number | null;
  is_complete: number;
}

export interface Contribution {
  id: string;
  story_id: string;
  player_id: string | null;
  content: string;
  type: 'player' | 'ai';
  order_num: number;
  created_at: number;
  twist_type: 'insert' | 'twist' | null;
}

// Contribution with player details joined
export interface ContributionWithPlayer extends Contribution {
  player_nickname?: string;
  player_color?: string;
}

// Room with players
export interface RoomWithPlayers extends Room {
  players: Player[];
}

// Player colors (from design system)
export const PLAYER_COLORS = [
  '#EF4444', // Red
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Amber
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#14B8A6', // Teal
  '#F97316', // Orange
] as const;

export type PlayerColor = typeof PLAYER_COLORS[number];
