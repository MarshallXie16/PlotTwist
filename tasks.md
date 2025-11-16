# Plot Twist - Task List

**Last Updated**: 2025-11-16
**Current Sprint**: Week 1 - Foundation & Setup
**Goal**: Initialize project, setup dev environment, deploy hello world

---

## Current Sprint Tasks

### Week 1: Foundation (In Progress)

#### 1. **[IN PROGRESS]** Repository & Project Initialization
- [x] Create .claude directory structure
- [x] Move CLAUDE.md to .claude/
- [x] Create memory.md
- [x] Create tasks.md
- [ ] Initialize Next.js 14 project with TypeScript
- [ ] Configure TypeScript (strict mode, path aliases)
- [ ] Setup .gitignore (node_modules, .env, .next, etc.)
- [ ] Create README.md with setup instructions
- [ ] Create .env.example template

**Goal**: Clean project structure with TypeScript foundation
**Acceptance**: `npm run dev` starts development server

---

#### 2. **[TODO]** Styling & UI Foundation
- [ ] Install Tailwind CSS
- [ ] Configure Tailwind with design tokens from product_design.md
  - [ ] Add custom colors (brand purple, player colors, AI purple)
  - [ ] Add custom spacing, typography, shadows
  - [ ] Configure dark mode (default)
- [ ] Initialize shadcn/ui
- [ ] Add core UI components:
  - [ ] Button (primary, secondary, ghost variants)
  - [ ] Input / Textarea
  - [ ] Card
  - [ ] Dialog (modal)
  - [ ] Toast (notifications)
  - [ ] Badge (player indicators)

**Goal**: Professional UI system ready to use
**Acceptance**: All components render correctly in isolation

---

#### 3. **[TODO]** Testing Framework Setup
- [ ] Install Jest
- [ ] Install React Testing Library + jest-dom
- [ ] Install ts-jest for TypeScript support
- [ ] Configure jest.config.js
- [ ] Create test setup file (setupTests.ts)
- [ ] Write sample test to verify setup
- [ ] Add npm scripts: `test`, `test:watch`, `test:coverage`

**Goal**: Testing infrastructure ready
**Acceptance**: Sample test passes, can run tests in watch mode

---

#### 4. **[TODO]** Database Setup (SQLite)
- [ ] Install better-sqlite3
- [ ] Create `schema.sql` with all tables:
  - [ ] rooms table
  - [ ] players table
  - [ ] stories table
  - [ ] contributions table
- [ ] Create `lib/db.ts` wrapper with typed functions:
  - [ ] initDb() - Initialize database
  - [ ] createRoom()
  - [ ] getRoom()
  - [ ] addPlayer()
  - [ ] addContribution()
  - [ ] getStoryContributions()
- [ ] Write unit tests for database functions
- [ ] Create sample data script for testing

**Goal**: Database layer ready with type safety
**Acceptance**: Can create room, add players, add contributions

---

#### 5. **[TODO]** Initial Deployment
- [ ] Create Vercel account (if needed)
- [ ] Connect GitHub repository to Vercel
- [ ] Add environment variables in Vercel dashboard
- [ ] Deploy "Hello World" Next.js app
- [ ] Verify production build works
- [ ] Test SQLite works in Vercel environment

**Goal**: CI/CD pipeline working
**Acceptance**: Push to branch auto-deploys, production URL works

---

## Week 2: Core Infrastructure (Upcoming)

### 6. **[TODO]** WebSocket Server Setup
- [ ] Install socket.io + socket.io-client
- [ ] Create WebSocket server in API route
- [ ] Implement room-based connections
- [ ] Handle connection/disconnection
- [ ] Add typing indicators
- [ ] Write tests for socket connection logic
- [ ] Test with 2 clients locally

**Dependencies**: Database setup complete
**Acceptance**: Two clients can connect and exchange messages

---

### 7. **[TODO]** Anthropic AI Integration + CRITICAL TESTING
- [ ] Create Anthropic account
- [ ] Get API key
- [ ] Install @anthropic-ai/sdk
- [ ] Create `lib/ai.ts` service module
- [ ] Implement prompt templates:
  - [ ] Direct story insertion prompt
  - [ ] Environmental twist prompt
- [ ] Implement context building (last N contributions)
- [ ] Add error handling + fallback logic
- [ ] Write tests for AI trigger logic
- [ ] **CRITICAL: AI Quality Testing (2 days)**:
  - [ ] Test 50+ different story scenarios
  - [ ] Collect samples of AI responses
  - [ ] Rate each: funny / okay / cringe
  - [ ] Target: 70%+ "funny", <20% "cringe"
  - [ ] If not meeting target, iterate on prompts
  - [ ] Test different models (Sonnet vs Haiku)
  - [ ] Build library of 10+ prompt variations
  - [ ] Document what works and what doesn't

**Dependencies**: None (can work in parallel)
**Acceptance**: AI generates relevant, funny responses 70%+ of the time
**CRITICAL DECISION POINT**: If AI quality <60% after 2 days, schedule meeting to discuss pivot options

---

### 8. **[TODO]** Additional UI Components
- [ ] Create PlayerList component
- [ ] Create StoryFeed component
- [ ] Create ContributionInput component
- [ ] Create WaitingRoom component
- [ ] Write component tests
- [ ] Test components in Storybook or isolation

**Dependencies**: Styling & UI foundation complete
**Acceptance**: All game components render correctly

---

## Week 3: Room System (Upcoming)

### 9. **[TODO]** Room Creation Flow
- [ ] Create landing page (`app/page.tsx`)
- [ ] Build "Create Room" modal/form
- [ ] Implement nickname validation
- [ ] Implement game mode selector
- [ ] Implement theme dropdown (for themed mode)
- [ ] Generate unique room IDs (use nanoid or similar)
- [ ] Create API route: `POST /api/rooms`
- [ ] Save room to database
- [ ] Generate shareable link
- [ ] Show QR code for in-person sharing
- [ ] Write tests for room creation logic
- [ ] Style room creation page

**Acceptance**: Can create room and get shareable link

---

### 10. **[TODO]** Joining Rooms
- [ ] Create room page (`app/room/[id]/page.tsx`)
- [ ] Implement join flow (nickname prompt)
- [ ] Validate room exists and is active
- [ ] Validate room not full (max 6 players)
- [ ] Create API route: `POST /api/rooms/[id]/join`
- [ ] Save player to database
- [ ] Connect player to WebSocket room
- [ ] Show "Waiting for players" state
- [ ] Display real-time player list
- [ ] Write tests for join logic

**Acceptance**: Can join room via link, see other players

---

### 11. **[TODO]** Room Management
- [ ] Implement player disconnect handling
- [ ] Mark players as inactive (don't delete)
- [ ] Auto-start game when 2+ players
- [ ] Room expiration logic (24 hours)
- [ ] Create cleanup cron job (Vercel cron)
- [ ] Host controls:
  - [ ] Kick player
  - [ ] End game
  - [ ] Copy invite link
- [ ] Edge cases:
  - [ ] Last player leaves → room inactive
  - [ ] Player rejoins with same session
  - [ ] Room full error handling
- [ ] Write tests for edge cases

**Acceptance**: Room lifecycle works correctly, no memory leaks

---

## Week 4: Story Collaboration Engine (Upcoming)

### 12. **[TODO]** Player Turn System
- [ ] Implement turn order (round-robin)
- [ ] Show turn indicator ("Josh, you're up!")
- [ ] Enable input only for active player
- [ ] Character counter (max 500)
- [ ] Submit button (disabled until >10 chars)
- [ ] Prevent duplicate submissions
- [ ] Show typing indicator to others
- [ ] Write tests for turn logic

**Acceptance**: Players take turns smoothly

---

### 13. **[TODO]** Story Display
- [ ] Create story feed component
- [ ] Display contributions in order
- [ ] Player name + color coding
- [ ] Timestamp (relative: "2m ago")
- [ ] Auto-scroll to latest
- [ ] Smooth animations for new contributions
- [ ] Handle long contributions (expand/collapse)
- [ ] Write tests for story rendering

**Acceptance**: Story updates in real-time for all players

---

### 14. **[TODO]** AI Integration (In-Game)
- [ ] Determine when AI should contribute
  - [ ] After every 2-3 player turns
  - [ ] Random variation
- [ ] Show "AI is thinking..." state
- [ ] Call AI API with story context
- [ ] Determine AI response type (70% insert, 30% twist)
- [ ] Save AI contribution to database
- [ ] Display with special styling (purple glow)
- [ ] Handle AI errors gracefully:
  - [ ] Retry logic (max 2 attempts)
  - [ ] Skip AI turn if fails
  - [ ] Log errors
- [ ] Write tests for AI intervention logic

**Acceptance**: AI contributes at right times with funny, relevant responses

---

## Week 5: Polish & Game Modes (Upcoming)

### 15. **[TODO]** Game Modes
- [ ] Implement "Freeform" mode (no prompt)
- [ ] Implement "Themed" mode with 5 themes:
  - [ ] "First Date Gone Wrong"
  - [ ] "Heist"
  - [ ] "Group Chat Drama"
  - [ ] "School Trip"
  - [ ] "Birthday Party"
- [ ] Show theme prompt at start
- [ ] Make AI aware of theme context
- [ ] Write tests for game mode logic

**Acceptance**: Both modes work, AI respects theme

---

### 16. **[TODO]** Story Completion
- [ ] Detect story completion:
  - [ ] Host can end manually
  - [ ] Auto-end after 30 minutes
  - [ ] Auto-end after 50 contributions
- [ ] Story recap screen:
  - [ ] Full story display
  - [ ] Player stats (contribution count)
  - [ ] Highlight best moments
  - [ ] Share button
- [ ] "Play Again" button (creates new room)
- [ ] Write tests for completion logic

**Acceptance**: Stories end gracefully, recap looks good

---

### 17. **[TODO]** UX Improvements
- [ ] Add empty states:
  - [ ] No story yet
  - [ ] Waiting for players
  - [ ] Room expired
- [ ] Error handling UI:
  - [ ] Connection lost
  - [ ] Room not found
  - [ ] Rate limit hit
- [ ] Loading states:
  - [ ] Creating room
  - [ ] Joining room
  - [ ] AI thinking
- [ ] Toast notifications:
  - [ ] Player joined
  - [ ] Player left
  - [ ] Story ended
- [ ] Keyboard shortcuts:
  - [ ] Enter to submit
  - [ ] Esc to clear

**Acceptance**: All states handled gracefully, no confusion

---

## Week 6: Testing & Bug Fixes (Upcoming)

### 18. **[TODO]** End-to-End Testing
- [ ] Manual testing checklist:
  - [ ] Create → Join → Play → Complete
  - [ ] Test with 6 players simultaneously
  - [ ] Test AI intervention patterns
  - [ ] Test all game modes
  - [ ] Test error scenarios
- [ ] Mobile testing (iOS Safari, Android Chrome)
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Load testing:
  - [ ] 10 concurrent rooms
  - [ ] 50 players total
  - [ ] AI API stress test

**Acceptance**: No critical bugs, all flows work

---

### 19. **[TODO]** Performance Optimization
- [ ] Measure page load times
- [ ] Target: <3s on 3G, <1s on 4G
- [ ] Optimize bundle size:
  - [ ] Code splitting
  - [ ] Lazy load components
- [ ] Database query optimization:
  - [ ] Add indexes for hot paths
  - [ ] Reduce N+1 queries
- [ ] WebSocket optimization:
  - [ ] Reduce message size
  - [ ] Batch updates when possible

**Acceptance**: Performance targets met

---

### 20. **[TODO]** Security Review
- [ ] Input validation everywhere
- [ ] Rate limiting:
  - [ ] 10 room creations/hour per IP
  - [ ] 60 contributions/hour per player
- [ ] SQL injection prevention (verify parameterized queries)
- [ ] XSS prevention (verify React auto-escaping)
- [ ] Environment variables secured
- [ ] Basic profanity filter (optional)

**Acceptance**: Basic security in place

---

## Backlog (Post-MVP)

### Premium Features (V1.1)
- [ ] User accounts (optional)
- [ ] Story history/saving
- [ ] Payment integration (Stripe)
- [ ] Subscription management
- [ ] Feature gating (free vs premium)
- [ ] Analytics (PostHog or Mixpanel)
- [ ] Viral features (share to Twitter/Discord)

### Retention Features (V1.2)
- [ ] Custom AI personalities
- [ ] Story history for logged-in users
- [ ] Player profiles with stats
- [ ] Emoji reactions on contributions
- [ ] Custom themes (user-submitted)

### Scale & Infrastructure (V2.0)
- [ ] Migrate to PostgreSQL
- [ ] Add Redis for session persistence
- [ ] WebSocket horizontal scaling
- [ ] Monitoring (Sentry, Datadog)
- [ ] Email notifications
- [ ] Referral rewards program

### Platform Expansion (V2.0+)
- [ ] Voice chat integration
- [ ] AI-generated story illustrations
- [ ] Mobile apps (React Native or PWA)
- [ ] Story replays with "dramatic reading"
- [ ] Tournaments/leagues
- [ ] Creator tools (custom game modes)

---

## Known Issues / Technical Debt

### Current
- None yet (project just starting)

### Accepted for MVP
1. No automated backups (SQLite file is backup)
2. No database migrations (just run schema.sql)
3. No monitoring infrastructure (Vercel logs only)
4. No staging environment (production is staging)
5. In-memory state lost on deploy (acceptable)

---

## Dependencies & Blockers

| Task | Depends On | Blocked By |
|------|------------|------------|
| Task 6 (WebSocket) | Task 4 (Database) | - |
| Task 7 (AI) | None (parallel) | - |
| Task 8 (UI Components) | Task 2 (Styling) | - |
| Task 9 (Room Creation) | Tasks 2, 4 | - |
| Task 10 (Joining) | Task 9 | - |
| Task 11 (Room Mgmt) | Task 10 | - |
| Task 12 (Turns) | Tasks 6, 10 | - |
| Task 13 (Story Display) | Task 12 | - |
| Task 14 (AI In-Game) | Tasks 7, 13 | - |

---

## Sprint Planning

### Current Sprint: Week 1 (Nov 16-22)
**Focus**: Foundation & Setup
**Tasks**: 1-5
**Goal**: Working dev environment, deployed hello world

### Next Sprint: Week 2 (Nov 23-29)
**Focus**: Core Infrastructure
**Tasks**: 6-8
**Goal**: WebSocket working, AI quality validated

### Sprint 3: Week 3 (Nov 30-Dec 6)
**Focus**: Room System
**Tasks**: 9-11
**Goal**: Can create and join rooms

---

## Task Status Legend

- **[TODO]**: Not started
- **[IN PROGRESS]**: Currently working on
- **[BLOCKED]**: Waiting on dependency
- **[DONE]**: Completed and verified
- **[DEFERRED]**: Postponed to later sprint

---

## Notes

- Keep this file updated after each work session
- Mark tasks as done when fully complete (code + tests + deployed)
- Add new tasks as they're discovered during implementation
- Review and reprioritize weekly based on learnings

**Current Focus**: Initialize Next.js project and get basic structure in place. First goal is to have a deployable "hello world" with TypeScript, Tailwind, and testing framework ready.

---

**Last Sprint Review**: N/A (first sprint)
**Next Sprint Planning**: Week of Nov 23
