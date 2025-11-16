# Plot Twist - API Reference

This document describes all REST API endpoints and their behavior.

---

## Base URL

**Development**: `http://localhost:3000`
**Production**: `https://[your-domain]` (set via `NEXT_PUBLIC_APP_URL`)

All API routes are under `/api/` prefix.

---

## Endpoints

### POST /api/rooms

**Purpose**: Create a new game room.

**Request Body**:
```json
{
  "nickname": "Alice",                    // Required, 1-20 chars
  "gameMode": "freeform",                 // Required, "freeform" | "themed"
  "theme": "Space Adventure",             // Optional, required if gameMode is "themed"
  "maxPlayers": 6                         // Optional, 2-6, default: 6
}
```

**Response** (201 Created):
```json
{
  "roomId": "ABC12345",                   // 8-char uppercase room code
  "playerId": "550e8400-e29b-41d4-a716-...", // UUID
  "room": {
    "id": "ABC12345",
    "gameMode": "freeform",
    "theme": null,
    "maxPlayers": 6,
    "is_active": true,
    "created_at": 1699564800000
  },
  "player": {
    "id": "550e8400-e29b-41d4-a716-...",
    "nickname": "Alice",
    "color": "#EF4444",                   // Auto-assigned from available colors
    "room_id": "ABC12345",
    "is_active": true,
    "joined_at": 1699564800000
  }
}
```

**Response** (400 Bad Request):
```json
{
  "error": "Nickname is required"
}
```

**Validation Rules**:
- `nickname`: Required, 1-20 characters, trimmed
- `gameMode`: Required, must be "freeform" or "themed"
- `theme`: Required if `gameMode === "themed"`, max 100 chars
- `maxPlayers`: Optional, must be 2-6, defaults to 6

**Side Effects**:
1. Creates room in database
2. Creates story associated with room
3. Adds creator as first player (becomes host)
4. Assigns random available color to player
5. Returns room + player data for immediate redirect

**Implementation**: `app/api/rooms/route.ts`

---

### POST /api/rooms/[id]/join

**Purpose**: Join an existing game room.

**URL Parameters**:
- `id`: Room ID (8-char uppercase code)

**Request Body**:
```json
{
  "nickname": "Bob"                       // Required, 1-20 chars
}
```

**Response** (200 OK):
```json
{
  "playerId": "660e8400-e29b-41d4-a716-...", // UUID
  "room": {
    "gameMode": "freeform",
    "theme": null,
    "maxPlayers": 6
  }
}
```

**Response** (400 Bad Request):
```json
{
  "error": "Nickname is required"
}
```

**Response** (404 Not Found):
```json
{
  "error": "Room not found"
}
```

**Response** (409 Conflict):
```json
{
  "error": "Room is full"
}
// or
{
  "error": "Nickname 'Bob' is already taken in this room"
}
```

**Validation Rules**:
- Room must exist and be active
- Room must not be full (`playerCount < maxPlayers`)
- Nickname must be unique within the room
- Nickname: 1-20 characters, trimmed

**Side Effects**:
1. Validates room exists and has space
2. Checks nickname uniqueness in room
3. Adds player to room with auto-assigned color
4. Returns player ID and room settings

**Implementation**: `app/api/rooms/[id]/join/route.ts`

---

### GET /api/rooms/[id]

**Purpose**: Fetch current room state (players, story, contributions).

**URL Parameters**:
- `id`: Room ID (8-char uppercase code)

**Response** (200 OK):
```json
{
  "room": {
    "id": "ABC12345",
    "gameMode": "freeform",
    "theme": null,
    "maxPlayers": 6,
    "is_active": true,
    "created_at": 1699564800000
  },
  "players": [
    {
      "id": "550e8400-e29b-41d4-a716-...",
      "nickname": "Alice",
      "color": "#EF4444",
      "isActive": true,
      "room_id": "ABC12345",
      "joined_at": 1699564800000
    },
    {
      "id": "660e8400-e29b-41d4-a716-...",
      "nickname": "Bob",
      "color": "#3B82F6",
      "isActive": true,
      "room_id": "ABC12345",
      "joined_at": 1699564801000
    }
  ],
  "story": {
    "id": "770e8400-e29b-41d4-a716-...",
    "room_id": "ABC12345",
    "isComplete": false,
    "created_at": 1699564800000,
    "completed_at": null
  },
  "contributions": [
    {
      "id": "880e8400-e29b-41d4-a716-...",
      "content": "Once upon a time...",
      "type": "player",
      "orderNum": 1,
      "playerNickname": "Alice",
      "playerColor": "#EF4444"
    }
  ],
  "stats": {
    "contributionCount": 1,
    "playerCount": 2,
    "isGameStarted": true
  }
}
```

**Response** (404 Not Found):
```json
{
  "error": "Room not found"
}
```

**Use Cases**:
- Initial page load: Fetch current room state
- Late joiners: See existing story and players
- Reconnection: Restore state after disconnect

**Stats Calculation**:
- `contributionCount`: Total contributions in story
- `playerCount`: Active players in room
- `isGameStarted`: `true` if any contributions exist

**Implementation**: `app/api/rooms/[id]/route.ts`

---

## Data Models

### Room
```typescript
{
  id: string;              // 8-char uppercase (e.g., "ABC12345")
  game_mode: 'freeform' | 'themed';
  theme: string | null;
  max_players: number;     // 2-6
  is_active: boolean;      // false when game ends or room expires
  created_at: number;      // Unix timestamp (ms)
}
```

### Player
```typescript
{
  id: string;              // UUID v4
  room_id: string;         // Foreign key to rooms
  nickname: string;        // 1-20 chars
  color: string;           // Hex color (e.g., "#EF4444")
  is_active: boolean;      // false when player leaves
  joined_at: number;       // Unix timestamp (ms)
}
```

### Story
```typescript
{
  id: string;              // UUID v4
  room_id: string;         // Foreign key to rooms (unique)
  is_complete: boolean;    // true when game ends
  created_at: number;      // Unix timestamp (ms)
  completed_at: number | null; // Unix timestamp (ms) when completed
}
```

### Contribution
```typescript
{
  id: string;              // UUID v4
  story_id: string;        // Foreign key to stories
  content: string;         // 10-500 chars
  type: 'player' | 'ai';
  player_id: string | null; // NULL for AI contributions
  twist_type: string | null; // 'twist' for AI, null for players
  order_num: number;       // Sequential, starts at 1
  created_at: number;      // Unix timestamp (ms)
}
```

---

## Player Colors

Available colors (auto-assigned in order):
```typescript
const PLAYER_COLORS = [
  '#EF4444', // Red    (--player-1)
  '#3B82F6', // Blue   (--player-2)
  '#10B981', // Green  (--player-3)
  '#F59E0B', // Amber  (--player-4)
  '#8B5CF6', // Purple (--player-5)
  '#EC4899', // Pink   (--player-6)
];
```

Players receive the first available color that is not currently used in the room.

---

## Error Handling

All endpoints return consistent error format:

```json
{
  "error": "Human-readable error message"
}
```

**HTTP Status Codes**:
- `200 OK`: Successful GET request
- `201 Created`: Successful POST (room creation)
- `400 Bad Request`: Validation error (missing/invalid fields)
- `404 Not Found`: Room doesn't exist or is inactive
- `409 Conflict`: Room full or nickname taken
- `500 Internal Server Error`: Server error (logged)

---

## Database Layer

All endpoints use functions from `lib/db.ts`. Key functions:

**Room Functions**:
- `createRoom(gameMode, theme?, maxPlayers?)` → Room
- `getRoom(roomId)` → Room | null
- `isRoomFull(roomId)` → boolean

**Player Functions**:
- `addPlayer(roomId, nickname, color)` → Player
- `getActivePlayers(roomId)` → Player[]
- `isNicknameTaken(roomId, nickname)` → boolean
- `getAvailablePlayerColor(roomId)` → string

**Story Functions**:
- `createStory(roomId)` → Story
- `getStoryByRoom(roomId)` → Story | null

**Contribution Functions**:
- `getStoryContributions(storyId)` → ContributionWithPlayer[]

See `lib/db.ts` for complete function reference.

---

## Security Considerations

**Input Validation**:
- All user inputs are sanitized and validated
- Character limits enforced (nicknames, themes, contributions)
- SQL injection prevented via parameterized queries (better-sqlite3)

**Access Control**:
- No authentication (anonymous sessions for MVP)
- Host validation: First player by `joined_at` timestamp
- Room validation: Must exist and be active
- Player validation: Must exist and belong to room

**Rate Limiting**:
- Not yet implemented (MVP)
- Future: 10 rooms/hour, 60 contributions/hour

**XSS Protection**:
- React auto-escapes all user content by default
- No `dangerouslySetInnerHTML` used

---

## Testing

Test API endpoints using curl:

```bash
# Create room
curl -X POST http://localhost:3000/api/rooms \
  -H "Content-Type: application/json" \
  -d '{"nickname":"Alice","gameMode":"freeform","maxPlayers":6}'

# Join room (replace ABC12345 with actual room ID)
curl -X POST http://localhost:3000/api/rooms/ABC12345/join \
  -H "Content-Type: application/json" \
  -d '{"nickname":"Bob"}'

# Get room state
curl http://localhost:3000/api/rooms/ABC12345
```

---

## Next.js Implementation Notes

**Route Handlers**: All endpoints are Next.js 14+ Route Handlers (Server Components)

**File Locations**:
- POST /api/rooms → `app/api/rooms/route.ts`
- POST /api/rooms/[id]/join → `app/api/rooms/[id]/join/route.ts`
- GET /api/rooms/[id] → `app/api/rooms/[id]/route.ts`

**Dynamic Routes**: Use `await params` in Next.js 15:
```typescript
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // ...
}
```

**Response Helpers**:
```typescript
return Response.json({ data }, { status: 200 });
return Response.json({ error: 'Message' }, { status: 400 });
```
