# Plot Twist - WebSocket Events Reference

This document describes all real-time WebSocket events using Socket.io.

---

## Connection

**Endpoint**: `ws://localhost:3000/socket.io` (development)

**Client Library**: Socket.io Client v4

**Transport**: WebSocket (fallback to polling)

**Hook**: `hooks/use-socket.ts` provides typed client interface

---

## Client-to-Server Events

Events sent from the client to the server.

### room:join

**Purpose**: Join a game room via WebSocket.

**Payload**:
```typescript
{
  roomId: string;      // Room ID (e.g., "ABC12345")
  playerId: string;    // Player UUID
}
```

**Callback Response**:
```typescript
{
  success: boolean;
  error?: string;      // Present if success === false
}
```

**Server Behavior**:
1. Validates room exists and is active
2. Checks if room is full
3. Validates player exists and belongs to room
4. Joins player to Socket.io room
5. Stores player data in socket (`socket.data`)
6. Broadcasts `room:player-joined` to other players
7. Emits `room:updated` with new player count

**Error Cases**:
- Room not found or inactive → `{ success: false, error: 'Room not found or inactive' }`
- Room is full → `{ success: false, error: 'Room is full' }`
- Player not found → `{ success: false, error: 'Player not found or not in this room' }`

**Usage**:
```typescript
const { joinRoom } = useSocket();
const result = await joinRoom(roomId, playerId);
if (!result.success) {
  console.error(result.error);
}
```

---

### room:leave

**Purpose**: Leave a game room.

**Payload**:
```typescript
{
  roomId: string;
  playerId: string;
}
```

**No Callback** (fire-and-forget)

**Server Behavior**:
1. Removes player from Socket.io room
2. Broadcasts `room:player-left` to other players
3. Emits `room:updated` with new player count
4. Clears socket data

**Usage**:
```typescript
const { leaveRoom } = useSocket();
leaveRoom(roomId, playerId);
```

---

### contribution:submit

**Purpose**: Submit a story contribution.

**Payload**:
```typescript
{
  roomId: string;
  playerId: string;
  content: string;     // 10-500 characters
}
```

**Callback Response**:
```typescript
{
  success: boolean;
  contributionId?: string;  // UUID of created contribution
  error?: string;
}
```

**Server Behavior**:
1. Validates player exists and belongs to room
2. Gets active story for room
3. Saves contribution to database
4. Broadcasts `story:new-contribution` to all players in room
5. **Checks if AI should intervene** (automatic):
   - If 2 player contributions since last AI: 70% chance
   - If 3+ player contributions since last AI: 100% chance
   - Triggers `game:ai-thinking` and AI generation asynchronously

**Error Cases**:
- Invalid player/room → `{ success: false, error: 'Invalid player or room' }`
- No active story → `{ success: false, error: 'No active story in this room' }`

**AI Auto-Trigger Logic**:
```typescript
function shouldTriggerAI(storyId: string): boolean {
  const playerCount = getPlayerContributionCount(storyId);
  const aiCount = getAIContributionCount(storyId);
  const contributionsSinceAI = playerCount - aiCount;

  if (contributionsSinceAI === 0) return false;
  if (contributionsSinceAI >= 3) return true;
  if (contributionsSinceAI === 2) return Math.random() < 0.7;
  return false;
}
```

**Usage**:
```typescript
const { submitContribution } = useSocket();
const result = await submitContribution(roomId, playerId, content);
if (result.success) {
  console.log('Contribution saved:', result.contributionId);
}
```

---

### typing:start

**Purpose**: Notify others that player started typing.

**Payload**:
```typescript
{
  roomId: string;
  playerId: string;
}
```

**No Callback** (fire-and-forget)

**Server Behavior**:
1. Validates player exists
2. Broadcasts `player:typing` with `isTyping: true` to **other** players (not sender)

**Usage**:
```typescript
const { startTyping } = useSocket();
startTyping(roomId, playerId);
```

---

### typing:stop

**Purpose**: Notify others that player stopped typing.

**Payload**:
```typescript
{
  roomId: string;
  playerId: string;
}
```

**No Callback** (fire-and-forget)

**Server Behavior**:
1. Validates player exists
2. Broadcasts `player:typing` with `isTyping: false` to **other** players

**Usage**:
```typescript
const { stopTyping } = useSocket();
stopTyping(roomId, playerId);
```

**Debouncing**: The client debounces `typing:stop` by 1 second (fires 1 second after last keystroke).

---

### game:start

**Purpose**: Start the game (host only).

**Payload**:
```typescript
{
  roomId: string;
  playerId: string;    // Must be host (first player)
}
```

**Callback Response**:
```typescript
{
  success: boolean;
  error?: string;
}
```

**Server Behavior**:
1. Validates room exists and is active
2. Gets active players
3. **Checks minimum 2 players** required
4. **Validates player is host** (earliest `joined_at` timestamp)
5. Broadcasts `game:started` to all players in room

**Error Cases**:
- Room not found → `{ success: false, error: 'Room not found or inactive' }`
- < 2 players → `{ success: false, error: 'Need at least 2 players to start' }`
- Not host → `{ success: false, error: 'Only the host can start the game' }`

**Host Determination**:
```typescript
const activePlayers = getActivePlayers(roomId);
const hostPlayer = activePlayers.sort((a, b) => a.joined_at - b.joined_at)[0];
if (hostPlayer.id !== playerId) {
  // Not host!
}
```

**Usage**:
```typescript
const { startGame } = useSocket();
const result = await startGame(roomId, playerId);
if (!result.success) {
  alert(result.error);
}
```

---

### game:request-ai-twist

**Purpose**: Manually request an AI-generated twist.

**Payload**:
```typescript
{
  roomId: string;
}
```

**No Callback** (fire-and-forget)

**Server Behavior**:
1. Validates room and story exist
2. Emits `game:ai-thinking` with `isThinking: true`
3. Fetches existing contributions for context
4. Calls Claude API to generate twist
5. Saves AI contribution to database
6. Emits `game:ai-thinking` with `isThinking: false`
7. Broadcasts `story:new-contribution` with AI twist

**AI Service**:
- Uses `lib/ai-service.ts`
- Mock mode if `ANTHROPIC_API_KEY` not set
- Takes 2-5 seconds for real API call

**Error Handling**:
- On error: Emits `game:ai-thinking` false and `error` event

**Usage**:
```typescript
const { requestAITwist } = useSocket();
requestAITwist(roomId);
```

---

### game:end-story

**Purpose**: End the current story.

**Payload**:
```typescript
{
  roomId: string;
  storyId: string;
}
```

**No Callback** (fire-and-forget)

**Server Behavior**:
1. Validates room and story exist
2. Marks story as complete in database (`is_complete = true`, `completed_at = NOW()`)
3. Broadcasts `story:completed` to all players

**Error Handling**:
- Emits `error` event to sender if validation fails

**Usage**:
```typescript
const { endStory } = useSocket();
endStory(roomId, storyId);
```

---

## Server-to-Client Events

Events sent from the server to clients.

### room:updated

**Purpose**: Room player count changed.

**Payload**:
```typescript
{
  roomId: string;
  playerCount: number;   // Current active player count
}
```

**Triggered By**:
- Player joins room (`room:join`)
- Player leaves room (`room:leave` or disconnect)

**Client Behavior**:
- Update UI with new player count (optional, PlayerList shows count from `players` array)

---

### room:player-joined

**Purpose**: New player joined the room.

**Payload**:
```typescript
{
  playerId: string;
  nickname: string;
  color: string;         // Hex color (e.g., "#EF4444")
}
```

**Triggered By**:
- Successful `room:join` event

**Broadcast**: Sent to **other players only** (not the joining player)

**Client Behavior**:
1. Add player to `players` array
2. Show toast notification: "Alice joined the room"

**Implementation**:
```typescript
socket.on('room:player-joined', ({ playerId, nickname, color }) => {
  setPlayers((prev) => {
    if (prev.some((p) => p.id === playerId)) return prev; // Duplicate check
    return [...prev, { id: playerId, nickname, color, isActive: true, isTyping: false }];
  });
  toast({ title: 'Player joined', description: `${nickname} joined the room` });
});
```

---

### room:player-left

**Purpose**: Player left the room.

**Payload**:
```typescript
{
  playerId: string;
}
```

**Triggered By**:
- `room:leave` event
- Socket disconnect

**Broadcast**: Sent to all remaining players

**Client Behavior**:
1. Mark player as inactive (`isActive: false`)
2. Show toast notification: "Alice left the room"

**Implementation**:
```typescript
socket.on('room:player-left', ({ playerId }) => {
  setPlayers((prev) =>
    prev.map((p) => p.id === playerId ? { ...p, isActive: false } : p)
  );
  toast({
    title: 'Player left',
    description: `${leftPlayer.nickname} left the room`,
    variant: 'destructive'
  });
});
```

---

### story:new-contribution

**Purpose**: New story contribution added.

**Payload**:
```typescript
{
  contributionId: string;
  content: string;             // The contribution text
  type: 'player' | 'ai';
  playerNickname?: string;     // Present if type === 'player'
  playerColor?: string;        // Present if type === 'player'
  orderNum: number;            // Sequential order (1, 2, 3, ...)
}
```

**Triggered By**:
- `contribution:submit` (player contribution)
- Automatic AI intervention
- `game:request-ai-twist` (manual AI twist)

**Broadcast**: Sent to **all players in room** (including sender)

**Client Behavior**:
1. Add contribution to `contributions` array
2. Auto-scroll StoryFeed to bottom

**Implementation**:
```typescript
socket.on('story:new-contribution', (data) => {
  setContributions((prev) => [
    ...prev,
    {
      id: data.contributionId,
      content: data.content,
      type: data.type,
      playerNickname: data.playerNickname,
      playerColor: data.playerColor,
      orderNum: data.orderNum,
    },
  ]);
});
```

---

### game:started

**Purpose**: Game has started.

**Payload**:
```typescript
{
  roomId: string;
  startedAt: number;    // Unix timestamp (ms)
}
```

**Triggered By**:
- `game:start` event (host starts game)

**Broadcast**: Sent to **all players in room**

**Client Behavior**:
1. Transition game state from `waiting` to `playing`
2. Show toast: "Game started! Let the chaos begin!"
3. Render game UI (PlayerList, StoryFeed, ContributionInput)

**Implementation**:
```typescript
socket.on('game:started', () => {
  toast({
    title: 'Game started!',
    description: 'Let the chaos begin! Start writing your story.',
  });
  setGameState('playing');
});
```

---

### story:completed

**Purpose**: Story has been completed.

**Payload**:
```typescript
{
  storyId: string;
  completedAt: number;   // Unix timestamp (ms)
}
```

**Triggered By**:
- `game:end-story` event

**Broadcast**: Sent to **all players in room**

**Client Behavior**:
1. Transition game state from `playing` to `completed`
2. Show toast: "Story completed! 🎉"
3. Render StoryRecap component

**Implementation**:
```typescript
socket.on('story:completed', ({ storyId }) => {
  toast({
    title: 'Story completed! 🎉',
    description: 'Check out your masterpiece!',
  });
  setGameState('completed');
});
```

---

### player:typing

**Purpose**: Player typing status changed.

**Payload**:
```typescript
{
  playerId: string;
  nickname: string;
  isTyping: boolean;    // true = started, false = stopped
}
```

**Triggered By**:
- `typing:start` event
- `typing:stop` event

**Broadcast**: Sent to **other players only** (not the typing player)

**Client Behavior**:
1. Update player's `isTyping` state in UI
2. PlayerList shows "✍️ typing..." indicator

**Implementation**:
```typescript
socket.on('player:typing', ({ playerId, isTyping }) => {
  setPlayers((prev) =>
    prev.map((p) => p.id === playerId ? { ...p, isTyping } : p)
  );
});
```

---

### game:ai-thinking

**Purpose**: AI is generating a twist (loading state).

**Payload**:
```typescript
{
  isThinking: boolean;   // true = started, false = completed
}
```

**Triggered By**:
- Automatic AI intervention (before/after twist generation)
- `game:request-ai-twist` (before/after twist generation)

**Broadcast**: Sent to **all players in room**

**Client Behavior**:
1. Show loading indicator in StoryFeed: "AI is thinking..."
2. Disable ContributionInput and AI request button

**Implementation**:
```typescript
socket.on('game:ai-thinking', ({ isThinking }) => {
  setAIThinking(isThinking);
});
```

**Visual States**:
- `isThinking: true` → Show pulsing indicator
- `isThinking: false` → Hide indicator

---

### game:turn-change

**Purpose**: Turn-based mode (not implemented in MVP).

**Payload**:
```typescript
{
  currentPlayerId: string;
  turnEndsAt: number;    // Unix timestamp (ms)
}
```

**Status**: Defined in types but not implemented. Reserved for future turn-based mode.

---

### error

**Purpose**: Server error occurred.

**Payload**:
```typescript
{
  message: string;       // Human-readable error
  code?: string;         // Optional error code
}
```

**Triggered By**:
- AI twist generation failure
- Invalid requests
- Server errors

**Client Behavior**:
- Log to console (not shown to user by default)
- Can add toast notification for critical errors

**Implementation**:
```typescript
socket.on('error', (data) => {
  console.error('[Socket] Error:', data.message);
});
```

---

## Event Flow Diagrams

### Room Join Flow

```
Client                          Server                          Other Clients
  |                               |                                    |
  |----room:join----------------->|                                    |
  |                               |---Validate room & player           |
  |                               |---Join Socket.io room              |
  |<---callback({success:true})---|                                    |
  |                               |----room:player-joined------------->|
  |                               |----room:updated------------------->|
```

### Contribution Flow (with AI Auto-Trigger)

```
Client                          Server                          Other Clients
  |                               |                                    |
  |---contribution:submit-------->|                                    |
  |                               |---Save to DB                       |
  |<--callback({success:true})---|                                    |
  |                               |----story:new-contribution--------->|
  |<--story:new-contribution------|                                    |
  |                               |                                    |
  |                               |---shouldTriggerAI() === true       |
  |                               |----game:ai-thinking(true)--------->|
  |<--game:ai-thinking(true)------|                                    |
  |                               |---Call Claude API (2-5s)           |
  |                               |---Save AI contribution             |
  |                               |----game:ai-thinking(false)-------->|
  |<--game:ai-thinking(false)-----|                                    |
  |                               |----story:new-contribution--------->|
  |<--story:new-contribution------|                                    |
```

### Game Start Flow

```
Host Client                     Server                          Other Clients
  |                               |                                    |
  |---game:start----------------->|                                    |
  |                               |---Validate host & min players      |
  |<--callback({success:true})---|                                    |
  |                               |----game:started------------------->|
  |<--game:started----------------|                                    |
  |                               |                                    |
  | [State: waiting → playing]    |     [State: waiting → playing]     |
```

### Game End Flow

```
Client                          Server                          Other Clients
  |                               |                                    |
  |---game:end-story------------->|                                    |
  |                               |---Mark story complete (DB)         |
  |                               |----story:completed---------------->|
  |<--story:completed-------------|                                    |
  |                               |                                    |
  | [State: playing → completed]  |     [State: playing → completed]   |
```

---

## Connection Management

### Initial Connection

```typescript
const socket = io({
  path: '/socket.io',
  transports: ['websocket', 'polling'],
});

socket.on('connect', () => {
  console.log('Connected:', socket.id);
  setIsConnected(true);
});

socket.on('disconnect', () => {
  console.log('Disconnected');
  setIsConnected(false);
});
```

### Cleanup on Unmount

```typescript
useEffect(() => {
  const socket = io();
  // ... setup

  return () => {
    socket.disconnect();
  };
}, []);
```

---

## Type Definitions

All event types are defined in `lib/socket-types.ts`:

```typescript
export interface ServerToClientEvents {
  'room:updated': (data: { roomId: string; playerCount: number }) => void;
  'room:player-joined': (data: { playerId: string; nickname: string; color: string }) => void;
  'room:player-left': (data: { playerId: string }) => void;
  'story:new-contribution': (data: {
    contributionId: string;
    content: string;
    type: 'player' | 'ai';
    playerNickname?: string;
    playerColor?: string;
    orderNum: number;
  }) => void;
  'story:completed': (data: { storyId: string; completedAt: number }) => void;
  'player:typing': (data: { playerId: string; nickname: string; isTyping: boolean }) => void;
  'game:started': (data: { roomId: string; startedAt: number }) => void;
  'game:turn-change': (data: { currentPlayerId: string; turnEndsAt: number }) => void;
  'game:ai-thinking': (data: { isThinking: boolean }) => void;
  'error': (data: { message: string; code?: string }) => void;
}

export interface ClientToServerEvents {
  'room:join': (data: { roomId: string; playerId: string },
    callback: (response: { success: boolean; error?: string }) => void) => void;
  'room:leave': (data: { roomId: string; playerId: string }) => void;
  'contribution:submit': (data: {
    roomId: string;
    playerId: string;
    content: string;
  }, callback: (response: { success: boolean; contributionId?: string; error?: string }) => void) => void;
  'typing:start': (data: { roomId: string; playerId: string }) => void;
  'typing:stop': (data: { roomId: string; playerId: string }) => void;
  'game:start': (data: { roomId: string; playerId: string },
    callback: (response: { success: boolean; error?: string }) => void) => void;
  'game:request-ai-twist': (data: { roomId: string }) => void;
  'game:end-story': (data: { roomId: string; storyId: string }) => void;
}
```

---

## Server Implementation

**Location**: `lib/socket-server.ts`

**Initialization**: Called from `server.ts`:
```typescript
import { initSocketServer } from './lib/socket-server';
const io = initSocketServer(httpServer);
```

**Socket Data**: Each socket stores player context:
```typescript
export interface SocketData {
  playerId?: string;
  roomId?: string;
  nickname?: string;
}
```

**Accessing**: `socket.data.playerId`, `socket.data.roomId`, `socket.data.nickname`

---

## Client Hook Usage

**Location**: `hooks/use-socket.ts`

**Full Example**:
```typescript
function GameRoom() {
  const {
    socket,
    isConnected,
    joinRoom,
    leaveRoom,
    submitContribution,
    startTyping,
    stopTyping,
    startGame,
    requestAITwist,
    endStory,
  } = useSocket();

  useEffect(() => {
    if (!socket || !isConnected) return;

    // Join room
    joinRoom(roomId, playerId);

    // Listen to events
    socket.on('room:player-joined', (data) => {
      // Handle player joined
    });

    socket.on('story:new-contribution', (data) => {
      // Handle new contribution
    });

    // Cleanup
    return () => {
      socket.off('room:player-joined');
      socket.off('story:new-contribution');
    };
  }, [socket, isConnected]);

  return (
    // UI
  );
}
```

---

## Testing WebSocket Events

Use Socket.io client in tests or browser console:

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('Connected:', socket.id);

  // Join room
  socket.emit('room:join', { roomId: 'ABC12345', playerId: 'uuid' }, (response) => {
    console.log('Join response:', response);
  });

  // Submit contribution
  socket.emit('contribution:submit', {
    roomId: 'ABC12345',
    playerId: 'uuid',
    content: 'Once upon a time...'
  }, (response) => {
    console.log('Contribution response:', response);
  });
});

socket.on('story:new-contribution', (data) => {
  console.log('New contribution:', data);
});
```

---

## Performance Considerations

**Broadcast Efficiency**:
- Uses Socket.io rooms for targeted broadcasts
- Only sends events to players in the same room
- `socket.to(roomId).emit()` excludes sender

**Connection Scaling**:
- Current: Single Node.js server, ~1000 concurrent connections
- Future: Redis adapter for horizontal scaling

**Latency**:
- WebSocket: <50ms for local events
- AI twists: 2-5s (external API call)
