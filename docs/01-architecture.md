# Plot Twist - Architecture Overview

## System Architecture

Plot Twist is a real-time multiplayer collaborative storytelling game with AI intervention.

### High-Level Architecture

```
┌─────────────┐
│   Browser   │ ◄──── HTTP/WebSocket ───► ┌──────────────┐
│  (Next.js)  │                            │  Next.js     │
│             │                            │  Server      │
└─────────────┘                            └──────────────┘
                                                  │
                                                  ├──► SQLite Database
                                                  │    (plottwist.db)
                                                  │
                                                  └──► Claude API
                                                       (AI Twists)
```

### Technology Stack

**Frontend**:
- Next.js 14 (App Router)
- React 18 with TypeScript
- Tailwind CSS v4
- shadcn/ui components
- Socket.io Client

**Backend**:
- Next.js API Routes
- Custom Node.js server (server.ts)
- Socket.io Server (WebSocket)
- SQLite with better-sqlite3
- Anthropic Claude API

**Testing**:
- Jest
- React Testing Library
- 76 tests (57 passing core logic)

---

## Directory Structure

```
PlotTwist/
├── app/                      # Next.js App Router
│   ├── api/                  # API Routes
│   │   └── rooms/            # Room CRUD endpoints
│   ├── room/[id]/            # Game room page
│   ├── page.tsx              # Landing page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Design system tokens
│
├── components/
│   ├── ui/                   # shadcn/ui base components (8)
│   └── game/                 # Game-specific components (5)
│       ├── PlayerList.tsx
│       ├── StoryFeed.tsx
│       ├── ContributionInput.tsx
│       ├── WaitingRoom.tsx
│       └── StoryRecap.tsx
│
├── hooks/
│   ├── use-toast.ts          # Toast notifications
│   └── use-socket.ts         # WebSocket connection
│
├── lib/
│   ├── db.ts                 # Database layer (30+ functions)
│   ├── types.ts              # TypeScript types
│   ├── socket-server.ts      # Socket.io server
│   ├── socket-types.ts       # WebSocket event types
│   ├── ai-client.ts          # Claude API client
│   ├── ai-service.ts         # AI twist generation
│   └── ai-prompts.ts         # AI prompt templates
│
├── server.ts                 # Custom Node server
├── schema.sql                # Database schema
└── docs/                     # Documentation (this file)
```

---

## Data Flow

### 1. Room Creation Flow

```
User → Landing Page → Enter nickname → Click "Create Room"
  ↓
POST /api/rooms
  ↓
Create room in DB → Create story → Add creator as player
  ↓
Redirect to /room/[id]?playerId=xxx
  ↓
Join WebSocket room → Fetch initial state → Waiting Room
```

### 2. Game Play Flow

```
Host clicks "Start Game"
  ↓
game:start → Server validates → Broadcast game:started
  ↓
All clients → Transition to Playing state
  ↓
Players write contributions
  ↓
contribution:submit → Save to DB → Broadcast to room
  ↓
Check shouldTriggerAI()
  ↓
If yes → Generate AI twist → Broadcast to room
  ↓
Continue until host clicks "End Game"
  ↓
game:end-story → Mark complete → Broadcast story:completed
  ↓
All clients → Transition to Story Recap
```

### 3. Real-Time Updates

```
Player A types → typing:start event → Server → Broadcast to room
  ↓
Player B sees typing indicator

Player A submits → contribution:submit → Server → Save to DB
  ↓
story:new-contribution event → Broadcast to all players
  ↓
All players see new contribution in real-time
```

---

## State Management

### Game States

```
joining → waiting → playing → completed
```

**joining**: Loading state while joining room
**waiting**: Pre-game lobby (WaitingRoom component)
**playing**: Active game (PlayerList, StoryFeed, ContributionInput)
**completed**: Game over (StoryRecap component)

### State Storage

**Client-Side**:
- React component state (players, contributions, gameState)
- WebSocket connection state
- Local player ID and nickname

**Server-Side**:
- SQLite database (persistent):
  - Rooms, players, stories, contributions
- Socket.io rooms (in-memory):
  - Active connections by room
  - Player socket mappings

**No Redis/Session Store**: State is ephemeral by design

---

## Security Considerations

**Input Validation**:
- All user inputs sanitized
- Character limits enforced (10-500 chars)
- Nickname validation (no empty, no duplicates)

**Access Control**:
- Host-only actions (start game, verified by player join time)
- Room validation (exists, active, not full)
- Player validation (exists, in room)

**Rate Limiting**:
- Not yet implemented (MVP)
- Future: 10 rooms/hour, 60 contributions/hour

**SQL Injection**:
- Prevented via parameterized queries

**XSS**:
- React auto-escapes by default

---

## Performance Considerations

**Scalability Limits (Current)**:
- SQLite handles ~100 concurrent users
- No horizontal scaling (single server)
- WebSocket connections limited by Node.js

**Optimization Opportunities**:
- Add Redis for session storage
- Implement connection pooling
- Add database indexes (already done for hot paths)
- CDN for static assets
- Code splitting for client bundle

**Current Performance**:
- API response: <100ms
- WebSocket latency: <50ms
- AI response: 2-5s (external API)
- Database queries: <10ms

---

## Deployment Architecture

**Development**:
```bash
npm run dev  # Starts custom server with hot reload
```

**Production** (Vercel):
- Next.js serverless functions for API routes
- Custom server for WebSocket (separate process)
- SQLite file stored in /tmp (ephemeral)
- Environment variables via Vercel dashboard

**Environment Variables**:
```bash
ANTHROPIC_API_KEY=sk-ant-...  # Claude API
JWT_SECRET=your-secret         # Future use
NODE_ENV=production            # Environment
NEXT_PUBLIC_APP_URL=https://... # App URL
```

---

## Key Design Decisions

1. **SQLite over PostgreSQL**: Zero config, sufficient for MVP scale
2. **No ORM**: Direct SQL is faster and simpler for 10-15 queries
3. **Custom Server**: Required for Socket.io integration
4. **In-Memory State**: Rooms expire after 24h anyway
5. **Mock AI Service**: Allows testing without API costs
6. **TypeScript Strict Mode**: Catch bugs early
7. **No Authentication**: Anonymous sessions for MVP simplicity

---

## Next Steps (Post-MVP)

1. Add Redis for persistent WebSocket state
2. Implement rate limiting
3. Add monitoring (Sentry, Datadog)
4. Migrate to PostgreSQL if scaling beyond 100 users
5. Implement user accounts (optional)
6. Add story history/saving
7. Mobile app (PWA or React Native)
