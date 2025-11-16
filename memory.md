# Plot Twist - Project Memory

**Last Updated**: 2025-11-16

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

## Core Components & Responsibilities

### Frontend Structure

```
app/
├── page.tsx                 # Landing page (hero, CTA, "How It Works")
├── room/[id]/page.tsx       # Room page (waiting room → game → recap)
├── api/                     # API routes
│   ├── rooms/route.ts       # POST /api/rooms (create room)
│   ├── rooms/[id]/route.ts  # GET /api/rooms/:id (room details)
│   └── socket/route.ts      # Socket.io server
└── layout.tsx               # Root layout with design tokens

components/
├── ui/                      # shadcn/ui components (button, input, card, etc.)
├── room/                    # Room-specific components
│   ├── PlayerList.tsx       # Sidebar showing players
│   ├── StoryFeed.tsx        # Main story display
│   ├── ContributionInput.tsx # Player turn input
│   └── WaitingRoom.tsx      # Pre-game waiting state
└── shared/                  # Reusable components
    ├── Toast.tsx            # Notifications
    └── LoadingSpinner.tsx   # Loading states

lib/
├── db.ts                    # SQLite wrapper with typed queries
├── socket.ts                # Socket.io server logic
├── ai.ts                    # Claude API integration
├── utils.ts                 # Helper functions
└── types.ts                 # TypeScript type definitions
```

### Database Schema

**Tables**:
- `rooms`: Room metadata, expiration, game mode, theme
- `players`: Player info, room association, nickname, color, active status
- `stories`: Story metadata per room, completion status
- `contributions`: Individual story contributions (player or AI), ordered

**Indexes**:
- `idx_rooms_active`: Fast lookup of active, non-expired rooms
- `idx_players_room`: Fast lookup of players in a room
- `idx_contributions_story`: Fast ordered retrieval of story contributions

### WebSocket Events

**Client → Server**:
- `player:join` - Player connects to room
- `player:write` - Submit story contribution
- `player:disconnect` - Player leaves

**Server → Client**:
- `story:update` - New contribution added (broadcast to all in room)
- `player:joined` - New player joined room
- `player:left` - Player left room
- `ai:thinking` - AI is generating response
- `next:turn` - Whose turn is it now

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
