import {
  initDb,
  closeDb,
  createRoom,
  getRoom,
  getActiveRooms,
  deactivateRoom,
  addPlayer,
  getPlayer,
  getActivePlayers,
  isRoomFull,
  createStory,
  getStoryByRoom,
  addContribution,
  getStoryContributions,
  getContributionCount,
  getPlayerContributionCount,
  getAIContributionCount,
  getAvailablePlayerColor,
  isNicknameTaken,
} from '../db';

describe('Database Functions', () => {
  beforeEach(() => {
    // Initialize fresh database for each test
    initDb();
  });

  afterEach(() => {
    // Close database after each test
    closeDb();
  });

  describe('Room Functions', () => {
    it('creates a room with correct defaults', () => {
      const room = createRoom('freeform');

      expect(room).toBeDefined();
      expect(room.id).toHaveLength(10);
      expect(room.game_mode).toBe('freeform');
      expect(room.max_players).toBe(6);
      expect(room.is_active).toBe(1);
      expect(room.theme).toBeNull();
    });

    it('creates a themed room', () => {
      const room = createRoom('themed', 'First Date Gone Wrong');

      expect(room.game_mode).toBe('themed');
      expect(room.theme).toBe('First Date Gone Wrong');
    });

    it('retrieves room by ID', () => {
      const created = createRoom('freeform');
      const retrieved = getRoom(created.id);

      expect(retrieved).toEqual(created);
    });

    it('returns null for non-existent room', () => {
      const room = getRoom('nonexistent');
      expect(room).toBeFalsy(); // SQLite returns undefined, not null
    });

    it('lists active rooms', () => {
      const room1 = createRoom('freeform');
      const room2 = createRoom('themed', 'Heist');

      const activeRooms = getActiveRooms();

      expect(activeRooms).toHaveLength(2);
      expect(activeRooms.map(r => r.id)).toContain(room1.id);
      expect(activeRooms.map(r => r.id)).toContain(room2.id);
    });

    it('deactivates a room', () => {
      const room = createRoom('freeform');
      deactivateRoom(room.id);

      const retrieved = getRoom(room.id);
      expect(retrieved?.is_active).toBe(0);

      const activeRooms = getActiveRooms();
      expect(activeRooms.map(r => r.id)).not.toContain(room.id);
    });
  });

  describe('Player Functions', () => {
    it('adds a player to a room', () => {
      const room = createRoom('freeform');
      const player = addPlayer(room.id, 'Josh', '#EF4444');

      expect(player).toBeDefined();
      expect(player.id).toHaveLength(10);
      expect(player.room_id).toBe(room.id);
      expect(player.nickname).toBe('Josh');
      expect(player.color).toBe('#EF4444');
      expect(player.is_active).toBe(1);
    });

    it('retrieves player by ID', () => {
      const room = createRoom('freeform');
      const created = addPlayer(room.id, 'Emma', '#3B82F6');
      const retrieved = getPlayer(created.id);

      expect(retrieved).toEqual(created);
    });

    it('lists active players in a room', () => {
      const room = createRoom('freeform');
      const player1 = addPlayer(room.id, 'Josh', '#EF4444');
      const player2 = addPlayer(room.id, 'Emma', '#3B82F6');

      const activePlayers = getActivePlayers(room.id);

      expect(activePlayers).toHaveLength(2);
      expect(activePlayers.map(p => p.id)).toContain(player1.id);
      expect(activePlayers.map(p => p.id)).toContain(player2.id);
    });

    it('checks if room is full', () => {
      const room = createRoom('freeform', null, 2); // Max 2 players

      expect(isRoomFull(room.id)).toBe(false);

      addPlayer(room.id, 'Josh', '#EF4444');
      expect(isRoomFull(room.id)).toBe(false);

      addPlayer(room.id, 'Emma', '#3B82F6');
      expect(isRoomFull(room.id)).toBe(true);
    });

    it('checks if nickname is taken', () => {
      const room = createRoom('freeform');
      addPlayer(room.id, 'Josh', '#EF4444');

      expect(isNicknameTaken(room.id, 'Josh')).toBe(true);
      expect(isNicknameTaken(room.id, 'josh')).toBe(true); // Case insensitive
      expect(isNicknameTaken(room.id, 'Emma')).toBe(false);
    });

    it('gets available player color', () => {
      const room = createRoom('freeform');
      const color1 = getAvailablePlayerColor(room.id);
      addPlayer(room.id, 'Josh', color1);

      const color2 = getAvailablePlayerColor(room.id);
      expect(color2).not.toBe(color1);
    });
  });

  describe('Story Functions', () => {
    it('creates a story for a room', () => {
      const room = createRoom('freeform');
      const story = createStory(room.id);

      expect(story).toBeDefined();
      expect(story.id).toHaveLength(10);
      expect(story.room_id).toBe(room.id);
      expect(story.is_complete).toBe(0);
      expect(story.completed_at).toBeNull();
    });

    it('retrieves story by room', () => {
      const room = createRoom('freeform');
      const created = createStory(room.id);
      const retrieved = getStoryByRoom(room.id);

      expect(retrieved).toEqual(created);
    });
  });

  describe('Contribution Functions', () => {
    it('adds a player contribution', () => {
      const room = createRoom('freeform');
      const player = addPlayer(room.id, 'Josh', '#EF4444');
      const story = createStory(room.id);

      const contribution = addContribution(
        story.id,
        'Fernando the horse appeared suddenly.',
        'player',
        player.id
      );

      expect(contribution).toBeDefined();
      expect(contribution.story_id).toBe(story.id);
      expect(contribution.player_id).toBe(player.id);
      expect(contribution.content).toBe('Fernando the horse appeared suddenly.');
      expect(contribution.type).toBe('player');
      expect(contribution.order_num).toBe(0);
    });

    it('adds an AI contribution', () => {
      const room = createRoom('freeform');
      const story = createStory(room.id);

      const contribution = addContribution(
        story.id,
        'But then, everything turned to glitter.',
        'ai',
        undefined,
        'insert'
      );

      expect(contribution.type).toBe('ai');
      expect(contribution.player_id).toBeNull();
      expect(contribution.twist_type).toBe('insert');
    });

    it('orders contributions correctly', () => {
      const room = createRoom('freeform');
      const story = createStory(room.id);
      const player = addPlayer(room.id, 'Josh', '#EF4444');

      const c1 = addContribution(story.id, 'First', 'player', player.id);
      const c2 = addContribution(story.id, 'Second', 'ai');
      const c3 = addContribution(story.id, 'Third', 'player', player.id);

      expect(c1.order_num).toBe(0);
      expect(c2.order_num).toBe(1);
      expect(c3.order_num).toBe(2);
    });

    it('retrieves story contributions with player info', () => {
      const room = createRoom('freeform');
      const story = createStory(room.id);
      const player = addPlayer(room.id, 'Josh', '#EF4444');

      addContribution(story.id, 'First', 'player', player.id);
      addContribution(story.id, 'Second', 'ai');

      const contributions = getStoryContributions(story.id);

      expect(contributions).toHaveLength(2);
      expect(contributions[0].player_nickname).toBe('Josh');
      expect(contributions[0].player_color).toBe('#EF4444');
      expect(contributions[1].player_nickname).toBeNull(); // LEFT JOIN returns null for missing values
    });

    it('counts contributions correctly', () => {
      const room = createRoom('freeform');
      const story = createStory(room.id);
      const player = addPlayer(room.id, 'Josh', '#EF4444');

      addContribution(story.id, 'First', 'player', player.id);
      addContribution(story.id, 'Second', 'ai');
      addContribution(story.id, 'Third', 'player', player.id);

      expect(getContributionCount(story.id)).toBe(3);
      expect(getPlayerContributionCount(story.id)).toBe(2);
      expect(getAIContributionCount(story.id)).toBe(1);
    });
  });
});
