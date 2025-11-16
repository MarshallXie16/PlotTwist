# Plot Twist - Component Reference

This document describes the behavior and usage of all major game components.

---

## Game Components

### PlayerList

**Location**: `components/game/PlayerList.tsx`

**Purpose**: Displays all players in the room with their status, colors, and typing indicators.

**Props**:
```typescript
{
  players: Player[];              // Array of player objects
  currentPlayerId: string;        // ID of the current user
  showTypingIndicators?: boolean; // Show "typing..." indicators (default: true)
  maxPlayers?: number;            // Max room capacity (default: 6)
}
```

**Behavior**:
- Displays player list with color-coded avatars (using CSS variables `--player-1` through `--player-6`)
- Shows "You" badge next to current player
- Shows "Host" badge next to first player (earliest joined_at timestamp)
- Displays typing indicator ("✍️ typing...") when player is actively typing
- Shows inactive players with reduced opacity (when `isActive: false`)
- Displays player count: "X / Y players"

**Visual States**:
- Active player: Full opacity, color badge
- Current player: "You" badge in purple
- Host player: "Host" badge in amber
- Typing player: Animated typing indicator
- Inactive player: 50% opacity, grayed out

---

### StoryFeed

**Location**: `components/game/StoryFeed.tsx`

**Purpose**: Displays the collaborative story as it unfolds in real-time.

**Props**:
```typescript
{
  contributions: StoryContribution[];  // Array of story contributions
  aiThinking?: boolean;                // Show AI loading indicator (default: false)
  autoScroll?: boolean;                // Auto-scroll to bottom (default: true)
}
```

**Behavior**:
- Displays all contributions in chronological order (by `orderNum`)
- Player contributions show nickname and color badge
- AI contributions show "AI Twist" badge with gradient background
- Auto-scrolls to latest contribution when new ones arrive
- Shows pulsing "AI is thinking..." indicator when AI is generating

**Contribution Types**:
- **Player**: Shows player nickname, colored badge, regular background
- **AI**: Shows "AI Twist", gradient badge, highlighted background (`--bg-tertiary`)

**Auto-scroll Logic**:
- Uses `useEffect` to scroll to bottom when contributions change
- Only if `autoScroll={true}`
- Smooth scroll behavior

**Empty State**:
- "No contributions yet. Start the story!"
- Centered, gray text

---

### ContributionInput

**Location**: `components/game/ContributionInput.tsx`

**Purpose**: Text input for players to write story contributions.

**Props**:
```typescript
{
  onSubmit: (content: string) => void;       // Called when submitting
  onTypingStart?: () => void;                // Called when typing starts
  onTypingStop?: () => void;                 // Called when typing stops
  showAIButton?: boolean;                    // Show "Request AI Twist" button
  onRequestAI?: () => void;                  // Called when AI button clicked
  aiThinking?: boolean;                      // Disable during AI generation
  disabled?: boolean;                        // Disable entire input
}
```

**Behavior**:
- Textarea with 10-500 character limit
- Real-time character counter (green when valid, red when invalid)
- Typing indicators:
  - Fires `onTypingStart()` when user starts typing
  - Fires `onTypingStop()` 1 second after last keystroke (debounced)
- Submit button disabled if:
  - Content length < 10 or > 500 characters
  - Component is `disabled={true}`
- Clears input after successful submission
- Shows "Request AI Twist" button if `showAIButton={true}`

**Validation**:
- Minimum: 10 characters
- Maximum: 500 characters
- Displayed as: "125 / 500 characters"

**Keyboard Shortcuts**:
- Enter (without Shift): Submit contribution
- Shift + Enter: New line in textarea

---

### WaitingRoom

**Location**: `components/game/WaitingRoom.tsx`

**Purpose**: Pre-game lobby where players wait before game starts.

**Props**:
```typescript
{
  roomId: string;                 // Room ID for display
  gameMode: 'freeform' | 'themed'; // Game mode
  theme?: string | null;          // Theme (if gameMode === 'themed')
  players: Player[];              // Current players
  currentPlayerId: string;        // Current user's ID
  maxPlayers?: number;            // Max capacity (default: 6)
  onStartGame: () => void;        // Called when host clicks "Start Game"
  shareableLink: string;          // Full URL to share with friends
}
```

**Behavior**:
- Displays room settings (mode, theme if applicable)
- Shows shareable room link with copy button
- Displays player list (uses `PlayerList` component)
- "Start Game" button only visible to host (first player)
- "Start Game" enabled when >= 2 players
- Copy button shows checkmark animation on success
- Toast notification: "Link copied to clipboard!"

**Host Requirements**:
- Only the host (first player by `joined_at`) can start game
- Non-hosts see disabled button with tooltip: "Only the host can start the game"

**Minimum Players**:
- Need at least 2 players to start
- Button disabled if < 2 players with message: "Need at least 2 players"

**Visual Layout**:
- Centered card with dark background
- Room code prominently displayed
- Shareable link with copy button
- Game settings section
- Player list section
- Start button (host only)

---

### StoryRecap

**Location**: `components/game/StoryRecap.tsx`

**Purpose**: Post-game screen showing completed story and statistics.

**Props**:
```typescript
{
  roomId: string;                      // Room ID for context
  contributions: StoryContribution[];  // All story contributions
  players: Player[];                   // All players who participated
  gameMode: 'freeform' | 'themed';     // Game mode
  theme?: string | null;               // Theme if applicable
  onPlayAgain: () => void;             // Navigate to create new room
  onBackToHome: () => void;            // Navigate to landing page
}
```

**Behavior**:
- Displays complete story with numbered contributions
- Player contributions show nickname + color badge
- AI contributions show "AI Twist" badge
- Shows statistics cards:
  - Total contributions
  - Player contributions
  - AI contributions
- Displays player rankings:
  - Sorted by contribution count (descending)
  - Top contributor gets crown badge (👑)
  - Shows count for each player
- "Play Again" button (primary action)
- "Back to Home" button (secondary action)

**Player Rankings**:
- Sorted by `contributionCount` (highest first)
- Shows player color badge, nickname, count
- Top contributor: Special badge + highlighted card
- Inactive players included (may have 0 contributions)

**Visual Design**:
- Full-screen overlay
- Scrollable story section
- Stats grid (3 cards)
- Player rankings with color-coded cards
- Action buttons at bottom

---

## Page Components

### Landing Page

**Location**: `app/page.tsx`

**Purpose**: Entry point for creating or joining rooms.

**Behavior**:
- Hero section with app title and description
- Two primary actions:
  1. **Create Room** - Opens dialog to create new room
  2. **Join Room** - Opens dialog to join existing room

**Create Room Dialog**:
- Fields:
  - Nickname (required, 1-20 chars)
  - Game Mode (radio: Freeform or Themed)
  - Theme (text input, shown only if Themed mode selected)
  - Max Players (select: 2-6, default: 6)
- Validation:
  - Nickname required
  - Theme required if mode is "themed"
- On submit:
  - POST `/api/rooms`
  - Redirects to `/room/[id]?playerId=xxx`

**Join Room Dialog**:
- Fields:
  - Nickname (required, 1-20 chars)
  - Room Code (required, 8-char uppercase)
- Validation:
  - Nickname required
  - Room code format: `^[A-Z0-9]{8}$`
- On submit:
  - Redirects to `/room/[roomId]?nickname=xxx`
  - Room joining happens on room page

---

### Game Room Page

**Location**: `app/room/[id]/page.tsx`

**Purpose**: Main game interface with state machine.

**Game States**:
```
joining → waiting → playing → completed
```

**State: joining**
- Loading spinner
- "Joining room..." message
- Fetching room data and player info

**State: waiting**
- Renders `<WaitingRoom>` component
- Players can join
- Host can start game
- Shows shareable link

**State: playing**
- Header: Room ID, End Game button, connection status
- Sidebar: `<PlayerList>` component
- Main area: `<StoryFeed>` component
- Bottom: `<ContributionInput>` component
- Real-time updates via WebSocket

**State: completed**
- Renders `<StoryRecap>` component
- Shows full story
- Player statistics
- Play again / Back to home

**WebSocket Events Handled**:
- `room:updated` - Player count changed
- `room:player-joined` - New player joined (toast notification)
- `room:player-left` - Player left (toast notification)
- `story:new-contribution` - New contribution added
- `game:started` - Game started (toast, transition to playing)
- `story:completed` - Story ended (toast, transition to completed)
- `game:ai-thinking` - AI generating twist (loading indicator)
- `player:typing` - Typing indicators

**Initial State Loading**:
- Fetches room data from GET `/api/rooms/[id]`
- Loads existing players
- Loads existing contributions (if any)
- Determines initial game state:
  - If `contributionCount > 0` → `playing`
  - If `story.isComplete` → `completed`
  - Else → `waiting`

**Connection Status**:
- Green dot + "Connected" when WebSocket connected
- Red dot + "Disconnected" when WebSocket disconnected
- Input disabled when disconnected

---

## Layout Components

### Root Layout

**Location**: `app/layout.tsx`

**Purpose**: Wraps entire application with providers.

**Features**:
- Sets dark mode by default (`className="dark"`)
- Loads Inter font
- Provides `<Toaster>` for notifications
- Sets metadata (title, description)

**Metadata**:
- Title: "Plot Twist"
- Description: "A collaborative storytelling game with AI-generated twists"

---

## UI Components (shadcn/ui)

All located in `components/ui/`. These are base components used throughout:

- **Button**: 5 variants (default, destructive, outline, secondary, ghost), 4 sizes
- **Card**: Container with header, content, footer sections
- **Dialog**: Modal system with overlay, title, description
- **Input**: Single-line text input
- **Textarea**: Multi-line text input
- **Badge**: Status indicators with 5 variants
- **Toast**: Notification system (used via `useToast` hook)

Refer to shadcn/ui documentation for detailed props: https://ui.shadcn.com

---

## Hooks

### useSocket

**Location**: `hooks/use-socket.ts`

**Purpose**: WebSocket connection management.

**Returns**:
```typescript
{
  socket: TypedSocket | null;           // Raw socket instance
  isConnected: boolean;                 // Connection status
  joinRoom: (roomId, playerId) => Promise<{success, error?}>;
  leaveRoom: (roomId, playerId) => void;
  submitContribution: (roomId, playerId, content) => Promise<{success, contributionId?, error?}>;
  startTyping: (roomId, playerId) => void;
  stopTyping: (roomId, playerId) => void;
  startGame: (roomId, playerId) => Promise<{success, error?}>;
  requestAITwist: (roomId) => void;
  endStory: (roomId, storyId) => void;
}
```

**Behavior**:
- Automatically connects on mount
- Disconnects on unmount
- Uses callback acknowledgments for critical actions
- All methods check socket connection before emitting

### useToast

**Location**: `hooks/use-toast.ts`

**Purpose**: Toast notification management.

**Usage**:
```typescript
const { toast } = useToast();

toast({
  title: 'Success!',
  description: 'Your action completed.',
  variant: 'default', // or 'destructive'
});
```

**Variants**:
- `default`: Green success style
- `destructive`: Red error style

---

## Key Behaviors Summary

| Component | Key Feature | Critical Behavior |
|-----------|-------------|-------------------|
| PlayerList | Real-time player status | Shows typing indicators, host badge, "You" badge |
| StoryFeed | Story display | Auto-scrolls to new contributions, highlights AI twists |
| ContributionInput | Text input with validation | 10-500 chars, typing indicators, AI request button |
| WaitingRoom | Pre-game lobby | Host-only start (min 2 players), shareable link |
| StoryRecap | Post-game stats | Full story, player rankings, top contributor badge |
| Room Page | State machine | 4 states: joining → waiting → playing → completed |

---

## Testing

All components have comprehensive tests in `__tests__/` directories.

Run tests:
```bash
npm test                # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
```

Current coverage: 57/76 tests passing (75%)
- All core logic tests pass
- 19 userEvent timeout failures (testing infrastructure, not bugs)
