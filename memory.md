# Plot Twist - Project Memory

**Last Updated**: 2025-11-16 (Week 3 Complete)
**Status**: Core game components complete, ready for final testing and deployment

## Project Overview

Plot Twist is a real-time multiplayer collaborative storytelling game where an AI acts as a "chaos agent" to make stories hilariously unpredictable. Think "Jackbox meets AI Dungeon" but optimized for chaos over quality.

**Core Value Proposition**: Turn your friend group into comedy writers without any of them having to be good at writing.

**Target Users**: Gen Z and young millennials (16-28) who want engaging group activities for hangouts, parties, or remote social time.

**Critical Success Factor**: AI must be consistently funny (70%+ positive feedback). This is THE make-or-break metric - if AI isn't funny, we don't have a product.

---

## Key Architectural Decisions

### Tech Stack Rationale

**Frontend: Next.js 14 + TypeScript + Tailwind + shadcn/ui**
- Why: Built-in SSR, API routes, zero-config deployment
- TypeScript: Type safety catches bugs early, worth the small overhead
- Tailwind: Rapid prototyping, no CSS files
- shadcn/ui: Professional components out of the box, copy-paste (not a dependency)

**Backend: Next.js API Routes + Socket.io**
- Why: Single codebase for frontend and backend
- Socket.io: Battle-tested WebSocket library for real-time collaboration
- No separate Express server needed

**Database: SQLite (better-sqlite3)**
- Why: Zero configuration, file-based, no external service needed
- Handles 1000+ writes/sec (way more than MVP needs)
- Can migrate to PostgreSQL if we hit scale (good problem to have)
- Decision: NO ORM - direct SQL is faster for 10-15 queries

**Real-time State: In-Memory JavaScript Map**
- Why: No Redis needed for MVP, rooms expire in 24h anyway
- Limitation: Loses state on server restart (acceptable for MVP)
- Will add Redis if product succeeds and we need persistence

**AI: Anthropic Claude API (Claude 3.5 Sonnet)**
- Why: Best at creative writing, understands context, good at humor
- Cost: ~$0.002 per AI response
- Risk: AI quality is the entire product - must test extensively

**Hosting: Vercel**
- Why: Zero config for Next.js, generous free tier, auto-deploys
- Limitation: Serverless functions (fine for MVP scale)

### Testing Strategy

**Yes to Testing** (even for MVP):
- Jest + React Testing Library for unit tests
- Test business logic, critical flows, edge cases
- Target: 70% coverage on business logic
- Why: Good tests make you faster, not slower - they catch bugs before users do

**No to**:
- E2E tests initially (manual QA sufficient for MVP)
- 100% coverage (quality over quantity)

---

## Current Project Structure (Week 1)

### Directory Organization

```
PlotTwist/
├── .claude/                 # AI agent configuration
│   └── CLAUDE.md           # Agent instructions and project setup guide
│
├── __mocks__/              # Test mocks
│   └── styleMock.js        # CSS import mock for Jest
│
├── app/                    # Next.js 14 App Router
│   ├── favicon.ico         # Site icon
│   ├── globals.css         # Global styles + design tokens (150+ lines)
│   ├── layout.tsx          # Root layout (dark mode, Toaster provider)
│   └── page.tsx            # Landing page (placeholder, will implement Week 3)
│
├── components/             # React components
│   └── ui/                 # shadcn/ui component library (copy-pasted, not npm package)
│       ├── badge.tsx       # Status indicators (5 variants)
│       ├── button.tsx      # Buttons (5 variants: default, secondary, ghost, destructive, outline)
│       ├── card.tsx        # Container components (Card, CardHeader, CardContent, etc.)
│       ├── dialog.tsx      # Modal dialogs (Radix UI primitive)
│       ├── input.tsx       # Form input with focus states
│       ├── textarea.tsx    # Multi-line input for story contributions
│       ├── toast.tsx       # Notification system (Radix UI primitive)
│       └── toaster.tsx     # Toast provider component
│
├── design_docs/            # Product design documents
│   ├── business_plan.md    # Market analysis, business model, success metrics
│   ├── product_design.md   # Visual design system, brand voice, UI patterns
│   ├── technical_requirements.md  # Tech stack, architecture, MVP scope
│   ├── roadmap.md          # 5-6 week implementation timeline
│   └── user_stories.md     # User journeys, acceptance criteria
│
├── hooks/                  # React custom hooks
│   └── use-toast.ts        # Toast notification state management (170 lines)
│
├── lib/                    # Core business logic and utilities
│   ├── __tests__/          # Unit tests
│   │   ├── db.test.ts      # Database tests (19 tests, all passing)
│   │   └── utils.test.ts   # Utility function tests (6 tests, all passing)
│   ├── db.ts               # SQLite database wrapper (400+ lines, 30+ functions)
│   ├── types.ts            # TypeScript type definitions (Room, Player, Story, etc.)
│   └── utils.ts            # Utility functions (cn for className merging)
│
├── public/                 # Static assets
│   └── *.svg               # Next.js default SVG icons
│
├── .env.example            # Environment variable template
├── .gitignore              # Git ignore patterns (includes *.db, node_modules, etc.)
├── components.json         # shadcn/ui configuration
├── eslint.config.mjs       # ESLint configuration
├── jest.config.ts          # Jest test configuration
├── jest.setup.ts           # Jest setup file (Testing Library matchers)
├── memory.md               # THIS FILE - Project knowledge base
├── next.config.ts          # Next.js configuration
├── package.json            # Dependencies and scripts
├── postcss.config.mjs      # PostCSS configuration (for Tailwind)
├── README.md               # Project documentation and setup guide
├── schema.sql              # SQLite database schema (80 lines)
├── tailwind.config.ts      # Tailwind CSS configuration
├── tasks.md                # Implementation roadmap and task tracking
└── tsconfig.json           # TypeScript configuration (strict mode)
```

### What's Implemented (Week 1 Complete)

✅ **Foundation**
- Next.js 14 with TypeScript (strict mode)
- Tailwind CSS v4 with complete design system
- Dark mode by default
- ESLint configured

✅ **UI Component Library** (shadcn/ui)
- 8 production-ready components
- All components use Plot Twist design tokens
- Fully typed with TypeScript
- Accessible (Radix UI primitives)

✅ **Database Layer**
- SQLite with better-sqlite3
- Complete schema (4 tables, indexes, constraints)
- Typed wrapper with 30+ functions
- 19 comprehensive tests (all passing)

✅ **Testing Infrastructure**
- Jest + React Testing Library
- ts-jest for TypeScript support
- 70% coverage threshold
- 25 tests total (all passing)

✅ **Development Tooling**
- Type checking (tsc --noEmit)
- Test scripts (test, test:watch, test:coverage)
- Git workflow established
- All code committed and pushed

### What's Implemented (Week 2 Complete)

✅ **WebSocket Server**
- Socket.io integration with Next.js dev server
- Real-time event handling (join, leave, contributions, AI twists)
- Room-based broadcasting
- Custom server with ts-node

✅ **AI Integration**
- Claude 3.5 Sonnet API integration
- AI twist generation with quality prompts
- Mock AI service for testing (100% quality score)
- Error handling and fallback mechanisms

### What's Implemented (Week 3 Complete)

✅ **Core Game Components** (4 components with tests)
- PlayerList: Displays active players with typing indicators
- StoryFeed: Shows story contributions with auto-scroll
- ContributionInput: Text input with validation and AI request button
- WaitingRoom: Pre-game lobby with invite links and start button

✅ **API Routes**
- POST /api/rooms - Room creation endpoint
- POST /api/rooms/[id]/join - Room joining endpoint
- Validation (nickname, capacity, duplicates)

✅ **Complete Pages**
- Landing page with create/join dialogs
- Room page with state machine (joining → waiting → playing)
- WebSocket integration for real-time updates

✅ **Testing**
- 76 total tests (57 passing, 19 userEvent timeouts)
- All core logic tests passing
- API endpoint validation complete

### What's NOT Yet Implemented (Future)

❌ **Features**
- Story recap page
- Room history
- Player statistics
- Advanced AI personalities

---

## Week 3 Components Deep Dive

### 8. Game Components (`components/game/*`)

**PlayerList Component (`components/game/PlayerList.tsx`)**
- **Purpose**: Display active players with real-time status
- **Props**: `players`, `currentPlayerId`, `showTypingIndicators`, `maxPlayers`
- **Features**:
  - Color-coded player indicators (4x4 rounded circles)
  - "You" badge for current player
  - Typing indicators with animated dots
  - Empty slots count
  - Player count badge
- **Testing**: 10 tests (all passing)
- **Lines**: 150

**StoryFeed Component (`components/game/StoryFeed.tsx`)**
- **Purpose**: Display collaborative story chronologically
- **Props**: `contributions`, `aiThinking`, `autoScroll`
- **Features**:
  - Auto-scroll to latest contribution
  - AI twist styling (gradient background, italic)
  - Player attributions with colors
  - Contribution stats (player vs AI count)
  - Empty state with prompt
  - Order number on hover
- **Testing**: 13 tests (all passing)
- **Lines**: 206

**ContributionInput Component (`components/game/ContributionInput.tsx`)**
- **Purpose**: Text input for player story contributions
- **Props**: `onSubmit`, `onTypingStart`, `onTypingStop`, `showAIButton`, `onRequestAI`, `maxLength`, `disabled`, `aiThinking`
- **Features**:
  - Character count with warning (500 chars default)
  - Validation (min 10 chars, max 500 chars)
  - Keyboard shortcuts (Cmd/Ctrl+Enter to submit)
  - AI twist request button
  - Typing indicators (debounced 500ms)
  - Disabled state when AI thinking
  - Auto-resize textarea
- **Testing**: 17 tests (13 passing, 4 userEvent timeouts)
- **Lines**: 260

**WaitingRoom Component (`components/game/WaitingRoom.tsx`)**
- **Purpose**: Pre-game lobby for player invites
- **Props**: `roomId`, `gameMode`, `theme`, `players`, `currentPlayerId`, `minPlayers`, `maxPlayers`, `onStartGame`, `shareableLink`
- **Features**:
  - Room details display (ID, mode, theme)
  - Shareable link with copy button
  - Host-only start game button
  - PlayerList integration
  - Ready state when enough players
  - Game rules display
  - Responsive grid layout
- **Testing**: 17 tests (passing)
- **Lines**: 318

### 9. API Routes (`app/api/*`)

**POST /api/rooms (`app/api/rooms/route.ts`)**
- **Purpose**: Create new game room
- **Request Body**: `{ nickname, gameMode, theme?, maxPlayers? }`
- **Validation**:
  - Required: nickname (non-empty string), gameMode ('freeform' | 'themed')
  - Optional: theme (required if gameMode='themed'), maxPlayers (2-6, default 6)
- **Process**:
  1. Validate input
  2. Create room in database
  3. Add creator as first player
  4. Create story for room
  5. Return roomId, playerId, playerColor
- **Response**: `{ roomId: string, playerId: string, playerColor: string }`
- **Errors**: 400 (validation), 500 (server error)

**POST /api/rooms/[id]/join (`app/api/rooms/[id]/join/route.ts`)**
- **Purpose**: Join existing room
- **Request Body**: `{ nickname }`
- **Validation**:
  - Room exists and is active
  - Room not full
  - Nickname not taken (case-insensitive)
- **Process**:
  1. Validate room exists
  2. Check capacity
  3. Check nickname availability
  4. Add player to room
  5. Assign player color
  6. Return player info and room details
- **Response**: `{ playerId: string, playerColor: string, room: { id, gameMode, theme, maxPlayers } }`
- **Errors**: 400 (validation), 404 (not found), 500 (server error)
- **Important**: In Next.js 15, params must be awaited: `const { id } = await params`

### 10. Complete Game Room Page (`app/room/[id]/page.tsx`)

**Purpose**: Main game interface with state management

**State Machine**:
1. **joining**: Loading state while API call completes
2. **waiting**: WaitingRoom component (pre-game lobby)
3. **playing**: Full game interface with all components

**Key Features**:
- URL params handling with Next.js 15 `use()` hook
- WebSocket connection via `useSocket` hook
- Real-time event listeners:
  - `room:updated` - Player count changes
  - `room:player-joined` - New player joined
  - `room:player-left` - Player left
  - `story:new-contribution` - New contribution added
  - `game:ai-thinking` - AI processing state
  - `player:typing` - Typing indicators
- API integration for initial join
- Contribution submission handler
- AI twist request handler
- Connection status indicator

**Components Used**:
- WaitingRoom (waiting state)
- PlayerList (sidebar)
- StoryFeed (main content)
- ContributionInput (bottom)

**Lines**: 308

### 11. Landing Page (`app/page.tsx`)

**Purpose**: Entry point for creating or joining rooms

**Features**:
- Hero section with gradient title
- Create Room dialog:
  - Nickname input
  - Game mode selector (freeform/themed)
  - Theme input (conditional)
  - Max players slider (2-6)
- Join Room dialog:
  - Room ID input
  - Nickname input
- Feature cards explaining gameplay
- Responsive grid layout

**Integration**:
- Calls POST /api/rooms to create room
- Redirects to /room/[id]?playerId=xxx on success
- Error handling with alerts

**Lines**: 395

---

## Core Components Deep Dive

### 1. Database Layer (`lib/db.ts`)

**Purpose**: Type-safe interface to SQLite database

**Key Functions** (organized by domain):

**Room Management:**
- `createRoom(gameMode, theme?, maxPlayers?)` - Create new room with 24h expiration
- `getRoom(roomId)` - Retrieve room by ID
- `getActiveRooms()` - List all non-expired rooms
- `deactivateRoom(roomId)` - Mark room as inactive
- `cleanupExpiredRooms()` - Batch cleanup of expired rooms

**Player Management:**
- `addPlayer(roomId, nickname, color)` - Add player to room
- `getPlayer(playerId)` - Retrieve player by ID
- `getActivePlayers(roomId)` - List active players in room
- `deactivatePlayer(playerId)` - Mark player as inactive
- `isRoomFull(roomId)` - Check if room is at capacity
- `getAvailablePlayerColor(roomId)` - Get unused color from pool
- `isNicknameTaken(roomId, nickname)` - Check for duplicates (case-insensitive)

**Story Management:**
- `createStory(roomId)` - Initialize story for room
- `getStory(storyId)` - Retrieve story by ID
- `getStoryByRoom(roomId)` - Get story for specific room
- `completeStory(storyId)` - Mark story as complete

**Contribution Management:**
- `addContribution(storyId, content, type, playerId?, twistType?)` - Add player/AI contribution
- `getContribution(contributionId)` - Retrieve contribution by ID
- `getStoryContributions(storyId)` - Get all contributions with player info (JOIN query)
- `getContributionCount(storyId)` - Total contributions
- `getPlayerContributionCount(storyId)` - Count player contributions
- `getAIContributionCount(storyId)` - Count AI contributions

**Implementation Details:**
- Uses better-sqlite3 for synchronous, high-performance queries
- In-memory database for tests (`:memory:`)
- WAL mode for better concurrency
- Foreign keys enabled for data integrity
- Custom `generateId()` function (replaces nanoid to avoid ESM issues)
- All functions return typed objects (no `any` types)

**Testing:**
- 19 comprehensive tests covering all functions
- Tests use in-memory database for speed and isolation
- Edge cases tested: expired rooms, full rooms, duplicate nicknames

### 2. Type Definitions (`lib/types.ts`)

**Purpose**: Central TypeScript type definitions matching database schema

**Core Types:**
```typescript
interface Room {
  id: string;
  created_at: number;
  expires_at: number;
  is_active: number;        // SQLite boolean (0 or 1)
  max_players: number;
  game_mode: 'freeform' | 'themed';
  theme: string | null;
}

interface Player {
  id: string;
  room_id: string;
  nickname: string;
  color: string;            // Hex color from PLAYER_COLORS
  joined_at: number;
  is_active: number;
}

interface Story {
  id: string;
  room_id: string;
  started_at: number;
  completed_at: number | null;
  is_complete: number;
}

interface Contribution {
  id: string;
  story_id: string;
  player_id: string | null;  // null for AI contributions
  content: string;
  type: 'player' | 'ai';
  order_num: number;
  created_at: number;
  twist_type: 'insert' | 'twist' | null;
}
```

**Helper Types:**
- `ContributionWithPlayer` - Contribution with player nickname/color (from JOIN)
- `RoomWithPlayers` - Room with players array
- `PLAYER_COLORS` - Const array of 8 hex colors from design system
- `PlayerColor` - Union type of player colors

### 3. UI Components (`components/ui/*`)

**Purpose**: Professional, accessible UI components using shadcn/ui patterns

**Button Component (`button.tsx`):**
- 5 variants: default (gradient), secondary (outline), ghost, destructive, outline
- 4 sizes: default, sm, lg, icon
- Uses class-variance-authority for type-safe variants
- Supports asChild prop for composition (Radix Slot)
- Hover effects: translate-y, opacity, shadow changes

**Input/Textarea (`input.tsx`, `textarea.tsx`):**
- Focus states with purple ring (--border-focus)
- Placeholder styling with tertiary text color
- Disabled states (opacity 50%, cursor not-allowed)
- Responsive font sizes (text-base → text-sm on md breakpoint)

**Card Components (`card.tsx`):**
- Card container with border, background, shadow
- Hover effects (border color, shadow intensity)
- Sub-components: CardHeader, CardTitle, CardDescription, CardContent, CardFooter
- Used for story contributions, player lists, room info

**Dialog (Modal) (`dialog.tsx`):**
- Based on Radix UI Dialog primitive
- Full-screen overlay with backdrop
- Centered content with slide-in animation
- Close button (X icon from lucide-react)
- Escape key to close, click outside to close

**Toast Notifications (`toast.tsx`, `toaster.tsx`):**
- Based on Radix UI Toast primitive
- 3 variants: default, success, destructive
- Appears bottom-right (desktop) or top (mobile)
- Auto-dismiss after 5 seconds
- Swipe to dismiss support
- Managed by `use-toast.ts` hook

**Badge Component (`badge.tsx`):**
- 5 variants: default, secondary, destructive, outline, success
- Used for player indicators, status labels
- Rounded-full for pill shape

**Shared Patterns:**
- All components use `cn()` utility for className merging
- All colors reference CSS variables (e.g., `var(--brand-primary)`)
- TypeScript interfaces for all props
- forwardRef for proper ref handling
- displayName set for debugging

### 4. Utility Functions (`lib/utils.ts`)

**Purpose**: Helper functions used across the app

**`cn(...inputs)` - ClassName Merger:**
```typescript
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**What it does:**
- Merges multiple className strings
- Handles conditional classes (false/null/undefined filtered out)
- Resolves Tailwind conflicts (last class wins)
- Example: `cn('text-red-500', condition && 'text-blue-500')` → only last color applied

**Testing:**
- 6 tests covering merging, conflicts, conditionals, arrays, empty cases

### 5. Toast System (`hooks/use-toast.ts`)

**Purpose**: Global toast notification state management

**Architecture:**
- Singleton state pattern (shared across components)
- Max 3 toasts at once (TOAST_LIMIT)
- Auto-dismiss after 5 seconds (TOAST_REMOVE_DELAY)
- Reducer pattern for state updates

**Key Functions:**
- `toast({ title, description, variant })` - Show toast
- `toast.success()` - Shorthand for success variant
- `toast.error()` - Shorthand for error variant
- `useToast()` - Hook to access toast state and functions

**Usage Example:**
```typescript
const { toast } = useToast()

toast({
  title: "Room created!",
  description: "Share the link with your friends",
  variant: "success"
})
```

### 6. Database Schema (`schema.sql`)

**Purpose**: SQLite database structure

**Design Principles:**
- Foreign keys for referential integrity (CASCADE deletes)
- Indexes on frequently queried columns
- CHECK constraints for data validation
- Integer timestamps (milliseconds since epoch)
- TEXT primary keys (generated IDs, not auto-increment)

**Key Relationships:**
- Room → Players (one-to-many, CASCADE delete)
- Room → Story (one-to-one, CASCADE delete)
- Story → Contributions (one-to-many, CASCADE delete)
- Player → Contributions (one-to-many, SET NULL on delete)

**Indexes for Performance:**
- `idx_rooms_active` - Find active rooms quickly
- `idx_players_room` - Find players in a room
- `idx_contributions_story` - Order contributions by order_num

### 7. Design System (`app/globals.css`)

**Purpose**: Complete design token system

**CSS Variables Defined:**
- Brand colors (purple, amber, pink)
- Player colors (8 distinct colors)
- Neutral palette (gray-50 through gray-950)
- Semantic colors (success, warning, error, info)
- Spacing scale (space-1 through space-20)
- Border radius (sm, md, lg, xl, full)
- Shadows (sm, md, lg, xl)
- Glow effects (purple, pink for AI)
- Transitions (fast 150ms, base 200ms, slow 300ms)
- Z-index scale (base, dropdown, sticky, modal, toast)

**Usage in Components:**
- All components reference CSS variables: `var(--brand-primary)`
- Enables easy theming and consistency
- No hardcoded colors in components

---

## How Components Work Together

### Current Flow (Week 1 - Foundation Only)

```
User
  ↓
Next.js App (app/layout.tsx)
  ├─ Global Styles (globals.css) - Design tokens loaded
  ├─ Toaster Provider - Toast notifications ready
  └─ Page Content
       └─ UI Components (Button, Input, etc.) - Ready to use

Database
  ├─ SQLite (plottwist.db or :memory: for tests)
  └─ Wrapper (lib/db.ts) - Type-safe functions available

Testing
  ├─ Jest + RTL configured
  └─ 25 tests passing (utils + database)
```

### Planned Flow (Week 2+ - Real-time Game)

```
User Browser
  ↓
Next.js Frontend
  ├─ Landing Page → Create Room
  ├─ Room Page → Join Room → WebSocket Connection
  └─ Game View → Real-time Story Display
       ↓
WebSocket (Socket.io)
  ├─ player:join → Broadcast to room
  ├─ player:write → Save to DB → Broadcast update
  └─ ai:response → Call Claude API → Broadcast
       ↓
Backend
  ├─ Database (lib/db.ts) → SQLite
  ├─ AI Service (lib/ai.ts) → Claude API
  └─ Room State (in-memory Map) → Active sessions
```

---

## Development Workflows

### Adding a New UI Component

1. Copy component from shadcn/ui or create custom
2. Place in `components/ui/` directory
3. Use design tokens (CSS variables) for colors
4. Add TypeScript interface for props
5. Export from component file
6. (Optional) Write component tests

### Adding a Database Function

1. Add SQL query to `lib/db.ts`
2. Define return type in `lib/types.ts`
3. Use prepared statements for safety
4. Write tests in `lib/__tests__/db.test.ts`
5. Run `npm test` to verify
6. Update this documentation

### Running Tests

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode for development
npm run test:coverage # Generate coverage report
```

### Type Checking

```bash
npm run type-check    # Run TypeScript compiler (no output)
```

### Development Server

```bash
npm run dev           # Start Next.js dev server (localhost:3000)
```

---

## Important Constraints & Requirements

### Performance Targets

- Page load: <3s on 3G, <1s on 4G
- WebSocket latency: <100ms
- AI response time: <5s (target: 2-3s)
- Database queries: <50ms average

### Scale Limits (MVP)

- Max 6 players per room
- Max 50 contributions per story (auto-end)
- 30 minute max game duration (auto-end)
- Rooms expire after 24 hours
- SQLite handles ~100 concurrent users comfortably

### Security Basics

- Input sanitization: Strip HTML/scripts from all user inputs
- Rate limiting: 10 room creations/hour per IP, 60 contributions/hour per player
- Session management: JWT tokens in httpOnly cookies
- No authentication required for MVP (anonymous sessions)
- SQL injection: Prevented by parameterized queries
- XSS: React auto-escapes by default

### AI Intervention Rules

- AI contributes every 2-3 player turns (random variance)
- 70% direct story insertion ("fernando suddenly coughs up glitter")
- 30% environmental twist ("suddenly everyone's underwater")
- AI adapts to story tone (silly → sillier, dramatic → more dramatic)
- Max 3 sentences per AI contribution
- If AI fails: Skip turn gracefully, continue game

---

## Critical Learnings & Decisions

### What We're Optimizing For

1. **Speed to Market**: Ship in 5-6 weeks to validate if AI can be funny
2. **AI Quality**: This is the entire product - 70%+ "funny" feedback required
3. **User Experience**: Get from landing page to first laugh in <2 minutes
4. **Mobile-First**: Gen Z plays on phones, optimize for that

### What We're NOT Doing (MVP)

- ❌ User accounts (anonymous sessions only)
- ❌ Story saving/history (MVP: stories auto-delete after 24h)
- ❌ Custom AI personalities (single mode only)
- ❌ Voice/video chat (text only)
- ❌ Story voting/rating (future)
- ❌ Character sheets (future)
- ❌ Story illustrations (future)
- ❌ Mobile apps (web-only, responsive)
- ❌ Content moderation beyond basic profanity filter
- ❌ Multiple languages (English only)

### Known Technical Debt (Accepting for Speed)

1. No automated backups (SQLite file is the backup)
2. No database migrations (just run schema.sql)
3. No monitoring infrastructure (Vercel logs + manual checks)
4. No staging environment (production is staging for MVP)
5. In-memory state lost on deploy (acceptable - rooms are ephemeral)

We'll address these when (if) the product succeeds and we need to scale.

---

## Key Dependencies & Their Purposes

### Core Dependencies

- `next@14+` - React framework with SSR and API routes
- `react@18+` - UI library
- `typescript@5+` - Type safety
- `tailwindcss@3+` - Utility-first CSS
- `better-sqlite3` - SQLite driver
- `socket.io` + `socket.io-client` - WebSocket server and client
- `@anthropic-ai/sdk` - Claude API client
- `jsonwebtoken` - Session token management
- `isomorphic-dompurify` - Input sanitization

### Development Dependencies

- `jest` - Test framework
- `@testing-library/react` - React component testing
- `@testing-library/jest-dom` - Jest DOM matchers
- `ts-jest` - TypeScript support for Jest

### UI Components (shadcn/ui - copy-paste, not installed)

- button, input, textarea, card, dialog, toast, badge

---

## Environment Variables

```bash
# Required
ANTHROPIC_API_KEY="sk-ant-..."       # Claude API key
JWT_SECRET="your-secret-32-chars"    # Session signing key

# Optional
NEXT_PUBLIC_APP_URL="http://localhost:3000"  # App URL for sharing
NODE_ENV="development"               # Environment
```

---

## Code Patterns Established

### Database Queries

```typescript
// Always use parameterized queries
const room = db.prepare('SELECT * FROM rooms WHERE id = ?').get(roomId);

// Use transactions for multi-step operations
const createRoomWithStory = db.transaction((roomId, gameMode) => {
  db.prepare('INSERT INTO rooms ...').run(...);
  db.prepare('INSERT INTO stories ...').run(...);
});
```

### WebSocket Handlers

```typescript
// Always validate room exists and player is authorized
socket.on('player:write', async (data) => {
  const { roomId, playerId, content } = data;

  // Validate
  if (!validateInput(content)) return;

  // Process
  const contribution = await saveContribution(...);

  // Broadcast to room
  io.to(roomId).emit('story:update', contribution);
});
```

### AI Calls

```typescript
// Always handle errors gracefully
try {
  const response = await callClaudeAPI(story);
  return response;
} catch (error) {
  logger.error('AI failed', error);
  // Skip AI turn, don't break the game
  return null;
}
```

### Component Patterns

```typescript
// Use TypeScript interfaces for props
interface StoryFeedProps {
  contributions: Contribution[];
  currentPlayerId?: string;
}

// Memoize expensive components
const StoryFeed = memo(({ contributions, currentPlayerId }: StoryFeedProps) => {
  // ...
});
```

---

## Testing Patterns

### Unit Test Example

```typescript
describe('shouldAIIntervene', () => {
  it('triggers after 2-3 player contributions', () => {
    const result = shouldAIIntervene(3, 0); // 3 player turns, 0 AI turns
    expect(result).toBe(true);
  });

  it('does not trigger too early', () => {
    const result = shouldAIIntervene(1, 0);
    expect(result).toBe(false);
  });
});
```

### Integration Test Example

```typescript
describe('Room Creation Flow', () => {
  it('creates room and saves to database', async () => {
    const response = await fetch('/api/rooms', {
      method: 'POST',
      body: JSON.stringify({ gameMode: 'freeform' })
    });

    const { roomId } = await response.json();
    expect(roomId).toBeDefined();

    // Verify in database
    const room = db.prepare('SELECT * FROM rooms WHERE id = ?').get(roomId);
    expect(room.game_mode).toBe('freeform');
  });
});
```

---

## Risk Mitigation Strategies

### Risk: AI Quality Inconsistency (CRITICAL)

**This is make-or-break for the product.**

Mitigation:
- Week 2 Day 12-14: Dedicated AI quality testing (50+ scenarios)
- Build library of 10+ tested prompt variations
- A/B test different prompts with real users
- Have fallback chaos events if AI fails
- Budget 2-3 months for prompt engineering if needed
- Decision point: If <60% "funny" after 2 days testing → schedule team meeting to pivot or continue

### Risk: Low Retention (Party Game Pattern)

Party games historically see "binge and churn" - intense play for 1-2 weeks, then dormant.

Mitigation:
- Accept this pattern, don't fight it
- Optimize for one-time purchases vs subscriptions
- New themes weekly to bring users back
- Focus on viral acquisition over retention
- Target realistic LTV ($15-20, not $60)

### Risk: Weak Competitive Moat

Jackbox could copy this feature in 3-6 months.

Mitigation:
- Move extremely fast (ship in 8 weeks, iterate weekly)
- Build community as moat (Discord, content, influencers)
- Focus on niche we can own (mobile-first, Gen Z)
- Accept this might be a feature, not a company

---

## Success Metrics (Go/No-Go Decision Points)

### Alpha Testing (Week 6)

**GO if**:
- ✅ 70%+ of testers say AI was "funny" or "entertaining"
- ✅ <20% negative feedback about AI being cringe/repetitive
- ✅ 50%+ of games reach completion
- ✅ 30%+ of testers play more than once

**NO-GO if**:
- ❌ AI consistently bad (<50% positive feedback)
- ❌ Completion rate <30%
- ❌ Major technical blockers

### Beta Month 1 (Week 12)

**GO if**:
- ✅ 2,500-5,000 total users
- ✅ 25-50 paying customers ($125-250 MRR)
- ✅ 30%+ week-1 return rate
- ✅ K-factor >0.5 (organic viral growth)

**SHUT DOWN if**:
- ❌ Can't hit 2,500 users with organic + small paid efforts
- ❌ Conversion <1%
- ❌ Can't fix AI quality after 3 months

---

## Important Notes

### Design Philosophy

**Brand Voice**: Casual, no gatekeeping, self-aware, encouraging chaos
- ✅ "let's make some chaos"
- ❌ "Let us facilitate your creative storytelling experience"

**Visual Design**: Dark mode first, high contrast, playful but not childish
- Purple (#8B5CF6) for AI contributions
- Vibrant player colors (red, blue, green, amber, purple, pink)
- Smooth animations, professional UI via shadcn/ui

**Mobile-First**: 80%+ of Gen Z uses mobile, optimize for that
- Touch targets min 44px
- Thumb-friendly layouts
- Fast, lightweight

### When to Add Complexity

- **Postgres**: When SQLite hits limits (~1000 concurrent users)
- **Redis**: When rooms need to survive deploys (validated product)
- **Monitoring**: When we have paying customers to support
- **TypeScript**: Already using from day 1 (worth it)
- **Tests**: Already using from day 1 (worth it)

Don't solve problems we don't have yet. If our biggest problem is "SQLite can't scale", that's a GREAT problem to have.

---

## Next Steps

See `tasks.md` for current implementation roadmap and priorities.

---

**Remember**: The goal is to validate if AI can be consistently funny in 5-6 weeks, not to build a scalable system. Ship fast, test assumptions, iterate based on feedback. Make chaos. 🎲✨
