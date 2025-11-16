# Plot Twist - Technical Requirements

## ⚠️ MVP-First Approach

**This is a MINIMAL tech stack designed to validate the core idea (is AI funny?) in 2-3 weeks.**

We're intentionally choosing simple, boring technology over scalable architecture:
- SQLite (not PostgreSQL)
- Direct SQL (no ORM)
- In-memory state (no Redis)
- JavaScript (not TypeScript)
- No monitoring, no tests, no CI/CD

**Why?** Because 90% of MVPs fail. Don't build for scale until you validate people want this.

If the idea works, we'll migrate to production stack. That's a GOOD problem to have.

---

## Technology Stack

### Frontend
**Framework**: Next.js 14+ (App Router) with TypeScript
- **Why**: Built-in SSR, API routes in same codebase, easy deployment
- **Language**: TypeScript (type safety worth the small overhead)
- **Styling**: Tailwind CSS (rapid prototyping, no CSS files)
- **UI Library**: shadcn/ui (copy-paste components, looks professional out of box)
- **State Management**: React useState + Context (no external library needed)
- **Real-time**: Socket.io-client

### Backend
**Runtime**: Node.js 20+ with TypeScript
- **Framework**: Next.js API routes (no separate Express server needed)
- **Real-time**: Socket.io (WebSocket server)
- **Why**: Same type safety on backend, catches errors at compile time

### Database
**Primary**: SQLite (better-sqlite3)
- **Why**: Zero configuration, file-based, no external service needed
- **Location**: Single `.db` file in project
- **Migrations**: Simple SQL `CREATE TABLE` statements
- **No ORM**: Direct SQL queries (faster for MVP, less abstraction)

**Session Storage**: In-memory JavaScript Map
- **Why**: No Redis needed for MVP, rooms expire in 24h anyway
- **Limitation**: Loses state on server restart (acceptable for MVP)

### AI Integration
**Provider**: Anthropic Claude API (Claude 3.5 Sonnet)
- **Why**: Best at creative writing, understands context
- **Rate Limiting**: Simple counter in memory

### Authentication
**For MVP**: Anonymous sessions only
- **Session Management**: JWT tokens in httpOnly cookies
- **Why**: No login flow = fastest time to first game

### Hosting & Infrastructure
**Application Hosting**: Vercel (free tier)
- **Why**: Zero config for Next.js, generous free tier
- **Limitation**: Serverless functions (fine for MVP scale)

**Database Hosting**: SQLite file committed to repo or mounted volume
- **For MVP**: Can commit small SQLite file (<10MB) to git
- **Alternative**: Mount persistent volume on Vercel (if needed)

### What We're NOT Using (to keep MVP simple)
- ❌ PostgreSQL / Supabase (overkill for MVP)
- ❌ Prisma ORM (adds complexity, direct SQL is fine)
- ❌ Redis / Upstash (in-memory is fine for 24h rooms)
- ❌ Sentry (console.log + Vercel logs for MVP)
- ❌ Complex CI/CD pipelines (Vercel auto-deploy is enough)

### What We ARE Using (even though it's "extra")
- ✅ **TypeScript** - Type safety catches bugs early, worth the small overhead
- ✅ **Unit Tests** - Good tests make you faster, not slower (Jest + React Testing Library)
- ✅ **shadcn/ui** - Pre-built components that look professional (copy-paste, not a dependency)

---

## Testing Strategy

### Why We're Testing (Even for MVP)

Good tests make you **faster**, not slower:
- Catch bugs before users do
- Refactor with confidence
- Document how code should work
- Type safety + tests = solid foundation

### Test Setup

**Testing Framework**: Jest + React Testing Library  
**What to test**: Business logic, critical user flows, edge cases  
**What NOT to test**: Styling, third-party libraries, obvious code

```bash
# Install testing dependencies
npm install -D jest @testing-library/react @testing-library/jest-dom ts-jest @types/jest
```

### Example Test

```typescript
// lib/__tests__/room.test.ts
describe('createRoom', () => {
  it('generates unique room ID', () => {
    const room1 = createRoom('freeform', null);
    const room2 = createRoom('freeform', null);
    expect(room1.id).not.toBe(room2.id);
  });

  it('sets expiration to 24 hours', () => {
    const room = createRoom('freeform', null);
    const expectedExpiry = Date.now() + (24 * 60 * 60 * 1000);
    expect(room.expiresAt).toBeCloseTo(expectedExpiry, -3);
  });
});
```

### What to Test

**Priority 1 - Core Business Logic** (90%+ coverage):
- Room creation and validation
- Player joining logic (max players, duplicate nicknames)
- Turn order calculation
- Story contribution validation
- AI trigger logic (when does AI jump in?)

**Priority 2 - Critical User Flows** (70%+ coverage):
- Complete game flow (create → join → play → complete)
- AI contribution generation (mock API)
- WebSocket connection handling
- Session management

**Priority 3 - Edge Cases** (50%+ coverage):
- Room expiration
- Player disconnection
- Invalid inputs
- Rate limiting

**Don't Test**:
- ❌ Tailwind classes (styling)
- ❌ Third-party library internals
- ❌ Simple getters/setters
- ❌ Database queries (test the logic, not SQLite)

### Test Coverage Goal

**Target**: 70% overall coverage
- Quality over quantity - 10 good tests > 50 meaningless tests

---

## UI Library: shadcn/ui

### Why This Makes Things Prettier

shadcn/ui gives you **professional-looking components** without the bulk of a full UI library.

**What it is**: Copy-paste React components built on Radix UI + Tailwind  
**What it's not**: A dependency you install (you own the code)

### Benefits
- ✅ Looks great out of the box (designer-quality)
- ✅ Fully customizable (it's YOUR code)
- ✅ Accessible by default (Radix UI primitives)
- ✅ TypeScript support built-in
- ✅ No bundle bloat (only copy what you need)

### Setup

```bash
# Initialize
npx shadcn-ui@latest init

# Add components as needed
npx shadcn-ui@latest add button input card dialog toast badge
```

Components get copied to `components/ui/` directory.

### Components We'll Use

- **Button** - Primary, secondary, ghost variants with hover states
- **Input / Textarea** - Form inputs with focus states and error handling
- **Card** - Container for story contributions and player lists
- **Dialog** - Modals for room creation, confirmations
- **Toast** - Beautiful notifications for player joins, errors
- **Badge** - Player color indicators

### Before/After

**Without shadcn/ui**:
```tsx
<button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
  Create Room
</button>
```

**With shadcn/ui**:
```tsx
<Button>Create Room</Button>
```

Both render the same, but shadcn/ui handles:
- Focus states
- Disabled states
- Loading states
- Accessibility (keyboard nav, screen readers)
- Consistent design system

**Result**: Professional UI with less code.


### MVP Philosophy
**Ship fast → Validate AI quality → Scale if it works**

If the game is fun and AI works, THEN add:
- PostgreSQL (when SQLite hits limits ~1000 concurrent users)
- Proper caching (when performance matters)
- Monitoring (when users are paying)
- Tests (when code is proven valuable)

---

## System Architecture

### Architecture Pattern: Simple Monolith with WebSockets

```
┌─────────────────────────────────────────────────┐
│              Vercel Deployment                  │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │      Next.js Application                  │ │
│  │                                           │ │
│  │  ┌──────────┐  ┌──────────┐  ┌─────────┐│ │
│  │  │  Pages   │  │   API    │  │ Socket  ││ │
│  │  │(Frontend)│  │  Routes  │  │  Server ││ │
│  │  └──────────┘  └──────────┘  └─────────┘│ │
│  │                                           │ │
│  └───────────────┬───────────────┬───────────┘ │
│                  │               │             │
└──────────────────┼───────────────┼─────────────┘
                   │               │
                   │               ▼
                   │        ┌──────────────┐
                   │        │  In-Memory   │
                   │        │   Storage    │
                   │        │              │
                   │        │ • Sessions   │
                   │        │ • Room State │
                   │        │ • Rate Limit │
                   │        └──────────────┘
                   │
                   ▼
            ┌─────────────────┐
            │  SQLite File    │
            │  (rooms.db)     │
            │                 │
            │ • Rooms         │
            │ • Stories       │
            │ • Players       │
            │ • Contributions │
            └─────────────────┘
            
┌──────────────────┐
│  Claude API      │
│  (Anthropic)     │
│                  │
│ • Story Twists   │
│ • AI Responses   │
└──────────────────┘
```

**Key Simplifications**:
- Single Next.js app (no separate backend)
- SQLite file for persistence (no external database)
- In-memory for sessions (no Redis)
- Deploys as single unit to Vercel

**Acceptable Tradeoffs**:
- Loses in-memory state on deploy (rooms need to reconnect)
- SQLite limits to ~1000 concurrent writes (fine for MVP)
- No horizontal scaling (Vercel handles vertical)

### API Design Philosophy

**RESTful for Simple Operations**:
- `POST /api/rooms` - Create new room
- `GET /api/rooms/[roomId]` - Get room details  
- `POST /api/rooms/[roomId]/join` - Join room

**WebSocket for Real-time**:
- `player:join` - Player joins room
- `player:write` - Submit contribution
- `story:update` - Broadcast update
- `ai:response` - AI contribution

**Why This Split**: REST for data, WebSocket for real-time updates

---

## Database Schema

**Simple SQLite Schema** (no ORM, just SQL)

```sql
-- rooms.sql

CREATE TABLE IF NOT EXISTS rooms (
  id TEXT PRIMARY KEY,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  is_active INTEGER DEFAULT 1,
  max_players INTEGER DEFAULT 6,
  game_mode TEXT DEFAULT 'freeform',
  theme TEXT
);

CREATE INDEX idx_rooms_active ON rooms(is_active, expires_at);

CREATE TABLE IF NOT EXISTS players (
  id TEXT PRIMARY KEY,
  room_id TEXT NOT NULL,
  nickname TEXT NOT NULL,
  color TEXT NOT NULL,
  joined_at INTEGER NOT NULL,
  is_active INTEGER DEFAULT 1,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

CREATE INDEX idx_players_room ON players(room_id, is_active);

CREATE TABLE IF NOT EXISTS stories (
  id TEXT PRIMARY KEY,
  room_id TEXT UNIQUE NOT NULL,
  started_at INTEGER NOT NULL,
  completed_at INTEGER,
  is_complete INTEGER DEFAULT 0,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

CREATE INDEX idx_stories_room ON stories(room_id, is_complete);

CREATE TABLE IF NOT EXISTS contributions (
  id TEXT PRIMARY KEY,
  story_id TEXT NOT NULL,
  player_id TEXT,
  content TEXT NOT NULL,
  type TEXT NOT NULL,
  order_num INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  twist_type TEXT,
  FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE,
  FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE SET NULL
);

CREATE INDEX idx_contributions_story ON contributions(story_id, order_num);
CREATE INDEX idx_contributions_time ON contributions(created_at);
```

### Database Interaction (No ORM)

```javascript
// db.js - Simple database wrapper
const Database = require('better-sqlite3');
const db = new Database('rooms.db');

// Initialize schema
const initDb = () => {
  // Run the CREATE TABLE statements above
  db.exec(fs.readFileSync('schema.sql', 'utf8'));
};

// Example queries
const createRoom = (roomId, gameMode, theme) => {
  const stmt = db.prepare(`
    INSERT INTO rooms (id, created_at, expires_at, game_mode, theme)
    VALUES (?, ?, ?, ?, ?)
  `);
  
  const now = Date.now();
  const expiresAt = now + (24 * 60 * 60 * 1000); // 24 hours
  
  return stmt.run(roomId, now, expiresAt, gameMode, theme);
};

const getRoom = (roomId) => {
  return db.prepare('SELECT * FROM rooms WHERE id = ?').get(roomId);
};

const addContribution = (storyId, playerId, content, type, order) => {
  return db.prepare(`
    INSERT INTO contributions (id, story_id, player_id, content, type, order_num, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    generateId(),
    storyId,
    playerId,
    content,
    type,
    order,
    Date.now()
  );
};

module.exports = { db, initDb, createRoom, getRoom, addContribution };
```

### Why No ORM for MVP?

**Pros**:
- ✅ Faster to write (no learning Prisma)
- ✅ No build step, no codegen
- ✅ Direct control over queries
- ✅ Easier to debug (just SQL)
- ✅ Smaller bundle size

**Cons**:
- ❌ No type safety (acceptable for MVP)
- ❌ No automatic migrations (just run SQL file)
- ❌ Manual query writing (fine for ~10 queries)

**When to add ORM**: If MVP succeeds and codebase grows past 20+ queries

---

## Core Features Technical Specification

### Feature 1: Real-time Story Collaboration

#### Endpoints

**REST: Create Room**
```typescript
POST /api/rooms
Body: {
  gameMode: "freeform" | "themed",
  theme?: string, // if themed
  maxPlayers?: number // default 6
}
Response: {
  roomId: string,
  joinUrl: string,
  expiresAt: string
}
```

**REST: Join Room**
```typescript
POST /api/rooms/:roomId/join
Body: {
  nickname: string
}
Response: {
  playerId: string,
  room: Room,
  players: Player[],
  story: Contribution[]
}
```

**WebSocket: Story Contribution**
```typescript
// Client sends
{
  event: "player:write",
  data: {
    roomId: string,
    playerId: string,
    content: string
  }
}

// Server broadcasts to all in room
{
  event: "story:update",
  data: {
    contribution: Contribution,
    nextPlayer?: Player // who goes next
  }
}
```

#### Data Models
See Database Schema above.

#### Business Logic

**Turn Order**:
```typescript
// Pseudocode
1. Player writes contribution
2. Save to database with incremented order
3. Broadcast to all players in room
4. Check if AI should intervene (every 2-3 player turns)
5. If AI turn:
   - Send "ai:thinking" event
   - Call AI API with full story context
   - Save AI contribution
   - Broadcast "story:update"
6. Determine next player (round-robin)
7. Broadcast "next:turn" event
```

**AI Intervention Logic**:
```typescript
function shouldAIIntervene(contributionCount: number): boolean {
  // AI goes after every 2-3 player contributions
  const playerTurns = contributionCount - aiTurnCount;
  const threshold = Math.floor(Math.random() * 2) + 2; // Random 2-3
  return playerTurns >= threshold;
}

function getAIResponseType(): "insert" | "twist" {
  // 70% direct insert, 30% environmental twist
  return Math.random() < 0.7 ? "insert" : "twist";
}
```

#### Third-party Integrations

**Claude API Integration**:
```typescript
import Anthropic from "@anthropic-ai/sdk";

async function generateAIContribution(
  story: Contribution[],
  type: "insert" | "twist"
): Promise<string> {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const storyText = story.map(c => c.content).join("\n\n");
  
  const systemPrompt = type === "insert" 
    ? "You're a chaotic friend jumping into a story. Write 1-2 sentences that fit naturally but add something unexpected. Match the tone (silly, dramatic, etc). Use casual language."
    : "Introduce a twist that changes the setting, brings in a new element, or reveals something surprising. One sentence. Be specific and visual.";

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 150,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: `Current story:\n${storyText}\n\nAdd your contribution:`
      }
    ]
  });

  return message.content[0].text;
}
```

---

### Feature 2: Room Management

#### Endpoints

**REST: Get Room Status**
```typescript
GET /api/rooms/:roomId
Response: {
  room: Room,
  players: Player[],
  storyLength: number,
  isJoinable: boolean
}
```

**WebSocket: Player Join/Leave**
```typescript
// Client connects
socket.on("connect", () => {
  socket.emit("player:join", { roomId, playerId });
});

// Server broadcasts
socket.to(roomId).emit("player:joined", {
  player: Player
});

// Handle disconnects
socket.on("disconnect", () => {
  markPlayerInactive(playerId);
  socket.to(roomId).emit("player:left", { playerId });
});
```

#### Business Logic

**Room Capacity**:
```typescript
function canJoinRoom(room: Room): boolean {
  const activePlayers = room.players.filter(p => p.isActive).length;
  return activePlayers < room.maxPlayers && room.isActive;
}
```

**Room Cleanup**:
```typescript
// Cron job runs every hour
async function cleanupExpiredRooms() {
  const now = new Date();
  await prisma.room.updateMany({
    where: {
      expiresAt: { lt: now },
      isActive: true
    },
    data: {
      isActive: false
    }
  });
}
```

---

### Feature 3: Story Display & History

#### Endpoints

**REST: Get Story**
```typescript
GET /api/stories/:roomId
Response: {
  story: Story,
  contributions: Contribution[] // with player info
}
```

#### Business Logic

**Story Formatting**:
```typescript
function formatStoryForDisplay(contributions: Contribution[]): FormattedContribution[] {
  return contributions
    .sort((a, b) => a.order - b.order)
    .map(c => ({
      id: c.id,
      content: c.content,
      author: c.playerId ? getPlayerNickname(c.playerId) : "AI",
      type: c.type,
      color: c.playerId ? getPlayerColor(c.playerId) : "#8B5CF6",
      timestamp: c.createdAt
    }));
}
```

---

## Security & Compliance

### Authentication Flow (MVP - Anonymous)

```typescript
// 1. User visits site
// 2. Generate anonymous session token
const sessionToken = jwt.sign(
  { sessionId: cuid(), createdAt: Date.now() },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);

// 3. Set httpOnly cookie
res.setHeader(
  "Set-Cookie",
  `session=${sessionToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=604800`
);

// 4. Verify on subsequent requests
function verifySession(req: Request): Session {
  const token = req.cookies.session;
  if (!token) throw new Error("No session");
  return jwt.verify(token, process.env.JWT_SECRET);
}
```

### Basic Security Checklist

#### Input Validation
- ✅ Sanitize all user inputs (nicknames, story contributions)
- ✅ Max length limits: nickname (20 chars), contribution (500 chars)
- ✅ Strip HTML/script tags from inputs
- ✅ Basic profanity filter (optional for MVP)

```typescript
import DOMPurify from "isomorphic-dompurify";

function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [] 
  }).slice(0, 500);
}
```

#### Rate Limiting
```typescript
// Using Upstash Redis
import { Ratelimit } from "@upstash/ratelimit";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "1 m"), // 10 requests per minute
});

async function rateLimitCheck(identifier: string): Promise<boolean> {
  const { success } = await ratelimit.limit(identifier);
  return success;
}
```

#### HTTPS & CORS
- ✅ Force HTTPS in production (Vercel does this automatically)
- ✅ Strict CORS policy: Only allow your domain
```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

#### SQL Injection Prevention
- ✅ Use Prisma (parameterized queries by default)
- ✅ Never use raw SQL with user inputs

#### XSS Prevention
- ✅ Use React (auto-escapes by default)
- ✅ Never use `dangerouslySetInnerHTML` with user content
- ✅ Content Security Policy headers

```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  }
];
```

### What We're NOT Doing for MVP
- ❌ Content moderation (beyond basic profanity filter)
- ❌ GDPR compliance (no personal data collected)
- ❌ PCI compliance (no payments in MVP)
- ❌ Penetration testing
- ❌ SOC 2 compliance

---

## Scaling Considerations

### MVP Reality Check

**We're NOT building for scale.** We're building to validate if AI can be funny.

**Current MVP handles**:
- ~100 concurrent users
- ~20 active games simultaneously
- SQLite handles ~1000 writes/second (way more than needed)

**When you ACTUALLY need to scale** (if you're lucky):

### Bottleneck 1: SQLite Write Limits
**Happens at**: ~1000 concurrent writes/second OR ~100MB database size
**Solution**: Migrate to PostgreSQL
- Export SQLite data
- Import to Postgres
- Update connection string
- No code changes needed (queries are the same)

### Bottleneck 2: In-Memory State Loss
**Happens at**: Server restarts causing rooms to disconnect
**Solution**: Add Redis for session persistence
- 1 day of work
- Keeps rooms alive during deploys
- Still using simple data structures

### Bottleneck 3: WebSocket Connections
**Happens at**: ~10,000 concurrent connections
**Solution**: Add Redis Pub/Sub for multi-server WebSocket
- Socket.io has built-in Redis adapter
- 1-2 days of work

### Bottleneck 4: AI API Costs
**Happens at**: Costs >$0.50/user/month
**Solution**: Optimize prompts, add caching
- Reduce context sent to Claude
- Cache similar responses
- Use cheaper model for simple inserts

### What to Do When You Hit These Limits

**DON'T PREMATURELY OPTIMIZE.**

If you hit these bottlenecks, that means:
- ✅ AI quality is good (people keep playing)
- ✅ People are paying
- ✅ You have a real business

**THEN** invest 1-2 weeks to migrate to production stack:
- PostgreSQL (Supabase or Railway)
- Redis (Upstash)
- Proper monitoring (Sentry)
- Horizontal scaling

But for MVP? **Ship with SQLite and in-memory state.** You'll know within 2 weeks if you need to scale.

---

## Development Environment Setup

### Prerequisites
- Node.js 20+
- That's it! No external services needed.

### Quick Start
```bash
# Clone repo
git clone https://github.com/yourorg/plot-twist
cd plot-twist

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Add: ANTHROPIC_API_KEY=sk-ant-...
#      JWT_SECRET=your-random-32-char-string

# Initialize database
node scripts/init-db.js

# Start development server
npm run dev
```

### Environment Variables
```bash
# .env
ANTHROPIC_API_KEY="sk-ant-..."
JWT_SECRET="your-secret-key-min-32-chars"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**That's it!** No database setup, no Redis, no external services. Just install and run.

### Project Structure
```
plot-twist/
├── app/                # Next.js app directory
│   ├── page.js        # Landing page
│   ├── room/[id]/     # Room pages
│   └── api/           # API routes
├── lib/
│   ├── db.js          # SQLite wrapper
│   ├── socket.js      # Socket.io server
│   └── ai.js          # Claude API calls
├── rooms.db           # SQLite database file
├── schema.sql         # Database schema
└── package.json
```

---

## Testing Strategy

### Unit Tests
- Test AI prompt generation
- Test story formatting logic
- Test turn order calculation
- **Goal**: 60% code coverage

### Integration Tests
- Test full story flow (player join → write → AI responds)
- Test room creation and joining
- Test WebSocket connection handling
- **Goal**: Cover all critical paths

### E2E Tests (Playwright)
- Test complete game flow
- Test multi-player scenarios
- Test AI integration
- **Goal**: Cover happy path + 3 error scenarios

### Load Testing (before launch)
- Simulate 100 concurrent games
- Test AI API failure scenarios
- Test database under load
- **Goal**: Validate can handle 2x expected peak traffic

---

## Deployment

### Dead Simple Deployment

**Step 1**: Push to GitHub
```bash
git push origin main
```

**Step 2**: Connect to Vercel
- Go to vercel.com
- Import your GitHub repo
- Add environment variables (ANTHROPIC_API_KEY, JWT_SECRET)
- Click deploy

**Step 3**: There is no step 3. You're done.

Vercel automatically:
- Builds your Next.js app
- Deploys to production
- Gives you a URL
- Auto-deploys on every push to main

### Environment Variables in Vercel

Set these in Vercel dashboard:
```
ANTHROPIC_API_KEY=sk-ant-...
JWT_SECRET=your-random-32-char-string
```

### Database Persistence

**Option A**: SQLite file in repo (simplest)
- Commit `rooms.db` to git
- Limitation: Resets on deploy (acceptable for MVP)

**Option B**: Vercel Blob Storage (if needed)
- Mount persistent volume
- Survives deploys
- $0.15/GB/month

For MVP, Option A is fine. Rooms last 24h anyway.

### Pre-Launch Checklist

- [ ] Environment variables set in Vercel
- [ ] Test: Can create and join room
- [ ] Test: AI responds
- [ ] Test: Story completes
- [ ] Domain pointed (optional)

### That's It

No CI/CD pipeline, no deployment scripts, no DevOps complexity. Just push code and it deploys.

**If you need more later** (staging environment, preview deploys, etc), Vercel has it built-in.

---

## API Rate Limits & Quotas

### Anthropic Claude
- **Tier 1**: 4,000 RPM, 400,000 TPM
- **Cost**: $3 per 1M input tokens, $15 per 1M output tokens
- **Estimated usage**: 150 tokens per AI response
- **Expected cost**: ~$0.002 per AI response

### Vercel Free Tier Limits
- 100 GB bandwidth/month
- 100 hours serverless function execution
- **When to upgrade**: >10K monthly active users

### Supabase Free Tier Limits
- 500 MB database
- 2 GB bandwidth
- 1 GB file storage
- **When to upgrade**: >50K stories in database

---

## MVP Philosophy: Why This Stack?

### The Goal
**Validate if AI can be consistently funny in 2-3 weeks, not build a scalable system.**

### Why We're Keeping It Simple

**SQLite instead of PostgreSQL**:
- ✅ Zero setup (just a file)
- ✅ No external service to configure
- ✅ Handles 1000+ writes/sec (way more than MVP needs)
- ✅ Easy to dump/migrate if it works
- ⏱️ **Saves**: 4-6 hours of Supabase setup + learning

**No Prisma ORM**:
- ✅ Direct SQL is faster to write for 10-15 queries
- ✅ No build step, no codegen
- ✅ One less thing to learn
- ⏱️ **Saves**: 3-4 hours of Prisma setup + learning

**In-Memory State instead of Redis**:
- ✅ Rooms last 24h anyway (losing state on restart is fine)
- ✅ Zero configuration
- ✅ JavaScript Map is plenty fast
- ⏱️ **Saves**: 2-3 hours of Upstash setup

**No Sentry**:
- ✅ Console.log is fine for <100 users
- ✅ Vercel logs show errors
- ✅ Can add later if it works
- ⏱️ **Saves**: 1-2 hours

**No TypeScript**:
- ✅ JavaScript is faster to write
- ✅ Type errors are not the biggest risk here
- ✅ Can migrate to TS if MVP succeeds
- ⏱️ **Saves**: 10% slower coding speed

**No Tests**:
- ✅ Manual QA is fine for MVP
- ✅ Tests are valuable for proven code, not experiments
- ✅ Add tests if users are paying
- ⏱️ **Saves**: 10-20 hours

### Total Time Saved
**~20-25 hours** of setup, configuration, and learning time.

That's 3-4 days of work you can spend on:
- Making AI funnier
- Testing with real users
- Iterating on UX
- Actually validating the idea

### When to Add Complexity

**Add Postgres when**: SQLite can't handle write volume (>1000 concurrent users)
**Add Redis when**: Need rooms to survive deploys (validated product)
**Add Monitoring when**: Have paying customers to support
**Add Tests when**: Have revenue and need to move fast without breaking things
**Add TypeScript when**: Team grows beyond 1-2 devs

### The Truth

If your biggest problem is "SQLite can't scale" or "no TypeScript", that's a GREAT problem to have. It means the idea works and people are using it.

Don't solve problems you don't have yet.

---

## Future Technical Debt We're Accepting

These are intentional shortcuts to ship MVP faster:

1. **No automated backups** - SQLite file is the backup (can commit to git)
2. **No database migrations** - Just run schema.sql
3. **No logging infrastructure** - Console.log + Vercel logs
4. **No monitoring/alerts** - Check manually
5. **No load balancer** - Vercel handles it
6. **No database sharding** - Won't need until 100K+ users
7. **No automated testing** - Manual QA
8. **No staging environment** - Production is staging for MVP

We'll address these when (if) the product succeeds.
