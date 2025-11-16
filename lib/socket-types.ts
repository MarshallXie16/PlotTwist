// Socket.io Event Type Definitions

export interface ServerToClientEvents {
  // Room events
  'room:updated': (data: { roomId: string; playerCount: number }) => void;
  'room:player-joined': (data: { playerId: string; nickname: string; color: string }) => void;
  'room:player-left': (data: { playerId: string }) => void;

  // Story events
  'story:new-contribution': (data: {
    contributionId: string;
    content: string;
    type: 'player' | 'ai';
    playerNickname?: string;
    playerColor?: string;
    orderNum: number;
  }) => void;
  'story:completed': (data: { storyId: string; completedAt: number }) => void;

  // Typing indicators
  'player:typing': (data: { playerId: string; nickname: string; isTyping: boolean }) => void;

  // Game state
  'game:turn-change': (data: { currentPlayerId: string; turnEndsAt: number }) => void;
  'game:ai-thinking': (data: { isThinking: boolean }) => void;

  // Errors
  'error': (data: { message: string; code?: string }) => void;
}

export interface ClientToServerEvents {
  // Room management
  'room:join': (data: { roomId: string; playerId: string }, callback: (response: { success: boolean; error?: string }) => void) => void;
  'room:leave': (data: { roomId: string; playerId: string }) => void;

  // Contributions
  'contribution:submit': (data: {
    roomId: string;
    playerId: string;
    content: string;
  }, callback: (response: { success: boolean; contributionId?: string; error?: string }) => void) => void;

  // Typing indicators
  'typing:start': (data: { roomId: string; playerId: string }) => void;
  'typing:stop': (data: { roomId: string; playerId: string }) => void;

  // Game actions
  'game:request-ai-twist': (data: { roomId: string }) => void;
  'game:end-story': (data: { roomId: string; storyId: string }) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  playerId?: string;
  roomId?: string;
  nickname?: string;
}
