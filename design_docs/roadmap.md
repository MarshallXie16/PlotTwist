# Plot Twist - Implementation Roadmap

## Overview

**Timeline**: 5-6 weeks from start to beta launch
**Team Size**: 1-2 developers
**Goal**: Validate if AI can be consistently funny with <100 users

**Tech Stack**: Minimal but quality-focused
- TypeScript (type safety from day 1)
- Tests (Jest + RTL - good tests = confidence)
- shadcn/ui (professional UI without bloat)
- SQLite (zero external dependencies)
- No ORM, no Redis, no monitoring tools

**Why this balance?**
- TypeScript + tests: Small upfront cost, huge confidence boost
- SQLite + no external services: Zero setup time
- shadcn/ui: Professional look without heavy UI library
- Net result: ~222 hours to ship, same as original, but with quality foundation

**Risk we're taking**: We're not "production scale ready" but we ARE "ship with confidence" ready.

---

## Phase 1: Foundation (Week 1-2)

### Week 1: Setup & Infrastructure

**Day 1-2: Repository & Dev Environment**
- [ ] Initialize Next.js 14 project with TypeScript
- [ ] Setup Tailwind CSS
- [ ] Initialize shadcn/ui
- [ ] Add initial components (button, input, card)
- [ ] Setup Jest + React Testing Library
- [ ] Configure test environment
- [ ] Setup Git repository + .gitignore
- [ ] Create README with setup instructions
- [ ] Add environment variable template (.env.example)

**Day 3-4: Database & Core Setup**
- [ ] Install better-sqlite3
- [ ] Create database schema (schema.sql)
- [ ] Write simple db.ts wrapper with types
- [ ] Write tests for database operations
- [ ] Test database connection
- [ ] Create sample data script

**Day 5-7: Deployment**
- [ ] Deploy "Hello World" to Vercel
- [ ] Configure environment variables
- [ ] Test production deployment
- [ ] Verify SQLite works in Vercel

**Deliverable**: Working dev environment + production deployment + tests passing

**Success Criteria**:
- ✅ Can run app locally in <2 minutes
- ✅ Push to main deploys automatically
- ✅ Database queries work with type safety
- ✅ Tests pass and can be run in watch mode
- ✅ UI components look professional
- ✅ Zero external dependencies needed

---

### Week 2: Core Infrastructure

**Day 8-9: WebSocket Server**
- [ ] Install Socket.io (server + client)
- [ ] Create WebSocket server in Next.js API route
- [ ] Implement room-based connections with types
- [ ] Write tests for connection/disconnection logic
- [ ] Test connection/disconnection handling
- [ ] Add typing indicators
- [ ] Test with 2 clients locally

**Day 10-11: Additional UI Components**
- [ ] Add more shadcn/ui components (dialog, toast, badge)
- [ ] Create game-specific components (player list, story feed)
- [ ] Write basic component tests
- [ ] Test components in isolation

**Day 12-14: AI Integration + CRITICAL TESTING**
- [ ] Setup Anthropic API client with types
- [ ] Create AI service module
- [ ] Write tests for AI trigger logic (when does AI jump in?)
- [ ] Write prompt templates
  - [ ] Direct story insertion
  - [ ] Environmental twists
- [ ] Implement context building (last N contributions)
- [ ] **CRITICAL: AI Quality Testing (2 days minimum)**
  - [ ] Test 50+ different story scenarios
  - [ ] Collect samples of AI responses
  - [ ] Rate each response: funny/okay/cringe
  - [ ] Target: 70%+ "funny", <20% "cringe"
  - [ ] If not meeting target, iterate on prompts
  - [ ] Test different Claude models (Sonnet vs Haiku)
  - [ ] Build library of 10+ prompt variations
- [ ] Add error handling + fallback
- [ ] Simple in-memory caching for AI responses
- [ ] Write tests for AI service (mocked API)

**Deliverable**: All core infrastructure ready + **AI quality validated** + tests passing

**Success Criteria**:
- ✅ WebSocket connects/disconnects reliably
- ✅ UI components work and look professional
- ✅ **AI generates funny/relevant responses 70%+ of the time**
- ✅ Can handle 10 concurrent WebSocket connections
- ✅ Have fallback chaos events if AI fails
- ✅ 70%+ test coverage on business logic

**⚠️ CRITICAL DECISION POINT**: If AI quality is consistently below 60% funny after 2 days of testing, schedule team meeting to discuss:
- Option A: Invest 2-3 more weeks in prompt engineering
- Option B: Pivot to pre-written chaos events (removes AI uniqueness)
- Option C: No-go on project

---

## Phase 2: Core MVP Features (Week 3-5)

### Week 3: Room System

**Day 15-16: Room Creation**
- [ ] Create `/` landing page
- [ ] Build "Create Room" flow
  - [ ] Nickname input (with validation)
  - [ ] Game mode selector (freeform/themed)
  - [ ] Theme dropdown (if themed selected)
- [ ] Generate unique room IDs
- [ ] Create room in database
- [ ] Generate shareable link
- [ ] Show QR code for in-person sharing
- [ ] Style room creation page

**Day 17-18: Joining Rooms**
- [ ] Create `/room/[id]` page
- [ ] Handle room join via link
- [ ] Validate room exists and is active
- [ ] Validate room not full
- [ ] Save player to database
- [ ] Connect player to WebSocket room
- [ ] Show "Waiting for players" state
- [ ] Display player list (real-time updates)

**Day 19-21: Room Management**
- [ ] Implement player disconnect handling
- [ ] Mark players as inactive (don't remove immediately)
- [ ] Auto-start game when 2+ players
- [ ] Room expiration logic (24 hours)
- [ ] Cron job for cleanup (Vercel cron)
- [ ] Host controls:
  - [ ] Kick player
  - [ ] End game
  - [ ] Copy invite link
- [ ] Edge cases:
  - [ ] Last player leaves → room becomes inactive
  - [ ] Player rejoins with same session
  - [ ] Room full error handling

**Deliverable**: Fully functional room system

**Success Criteria**:
- ✅ Can create and join rooms via link
- ✅ Players see each other in real-time
- ✅ Room states update correctly
- ✅ No memory leaks from abandoned rooms

---

### Week 4: Story Collaboration Engine

**Day 22-23: Player Turns**
- [ ] Implement turn order system (round-robin)
- [ ] Show turn indicator ("Josh, you're up!")
- [ ] Enable input only for active player
- [ ] Character counter (max 500)
- [ ] Submit button (disabled until >10 chars)
- [ ] Prevent duplicate submissions
- [ ] Show typing indicator to other players

**Day 24-25: Story Display**
- [ ] Create story feed component
- [ ] Display contributions in order
- [ ] Player name + color coding
- [ ] Timestamp (relative: "2m ago")
- [ ] Auto-scroll to latest
- [ ] Smooth animations for new contributions
- [ ] Handle long contributions (expand/collapse)

**Day 26-28: AI Integration**
- [ ] Determine when AI should contribute
  - [ ] After every 2-3 player turns
  - [ ] Random variation for unpredictability
- [ ] Show "AI is thinking..." state
- [ ] Call AI API with story context
- [ ] Determine AI response type (insert vs. twist)
  - [ ] 70% direct insertion
  - [ ] 30% environmental twist
- [ ] Save AI contribution to database
- [ ] Display with special styling (purple glow)
- [ ] Handle AI errors gracefully
  - [ ] Retry logic (max 2 attempts)
  - [ ] Skip AI turn if fails
  - [ ] Log errors to Sentry

**Deliverable**: Full story collaboration loop working

**Success Criteria**:
- ✅ Players can write and submit contributions
- ✅ Story updates in real-time for all players
- ✅ AI contributes at appropriate times
- ✅ AI contributions feel natural and funny
- ✅ No lag between submissions

---

### Week 5: Polish & Game Modes

**Day 29-30: Game Modes**
- [ ] Implement "Freeform" mode
  - [ ] No starting prompt
  - [ ] First player starts however they want
- [ ] Implement "Themed" mode
  - [ ] Create 5 starting themes:
    - [ ] "First Date Gone Wrong"
    - [ ] "Heist"
    - [ ] "Group Chat Drama"
    - [ ] "School Trip"
    - [ ] "Birthday Party"
  - [ ] Show theme prompt at start
  - [ ] AI aware of theme context

**Day 31-33: Story Completion**
- [ ] Detect story completion
  - [ ] Host can end manually
  - [ ] Auto-end after 30 minutes
  - [ ] Auto-end after 50 contributions
- [ ] Story recap screen
  - [ ] Full story display
  - [ ] Player stats (contributions count)
  - [ ] Highlight best moments
  - [ ] Share button (screenshot-ready view)
- [ ] "Play Again" button (create new room)

**Day 34-35: UX Improvements**
- [ ] Add empty states
  - [ ] No story yet
  - [ ] Waiting for players
  - [ ] Room expired
- [ ] Error handling UI
  - [ ] Connection lost
  - [ ] Room not found
  - [ ] Rate limit hit
- [ ] Loading states
  - [ ] Creating room
  - [ ] Joining room
  - [ ] AI thinking
- [ ] Toast notifications
  - [ ] Player joined
  - [ ] Player left
  - [ ] Story ended
- [ ] Keyboard shortcuts
  - [ ] Enter to submit
  - [ ] Esc to clear

**Deliverable**: Polished MVP experience

**Success Criteria**:
- ✅ Game feels complete end-to-end
- ✅ No confusing states
- ✅ Smooth, delightful interactions
- ✅ Mobile experience is great

---

## Phase 3: Alpha Testing (Week 6)

### Week 6: Internal Testing & Bug Fixes

**Day 36-37: End-to-End Testing**
- [ ] Manual testing checklist
  - [ ] Create room → Join → Play → Complete
  - [ ] Test with 6 players simultaneously
  - [ ] Test AI intervention patterns
  - [ ] Test all game modes
  - [ ] Test error scenarios
- [ ] Mobile testing (iOS Safari, Android Chrome)
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Load testing
  - [ ] 10 concurrent rooms
  - [ ] 50 players total
  - [ ] AI API stress test

**Day 38-39: Performance Optimization**
- [ ] Measure page load times
  - [ ] Target: <3s on 3G
  - [ ] Target: <1s on 4G
- [ ] Optimize bundle size
  - [ ] Code splitting
  - [ ] Lazy load components
- [ ] Database query optimization
  - [ ] Add indexes for hot paths
  - [ ] Reduce N+1 queries
- [ ] WebSocket optimization
  - [ ] Reduce message size
  - [ ] Batch updates when possible
- [ ] API response time monitoring
  - [ ] Target: <500ms for REST
  - [ ] Target: <100ms for WebSocket

**Day 40-41: Security Review**
- [ ] Input validation everywhere
- [ ] Rate limiting implemented
  - [ ] 10 room creations per hour per IP
  - [ ] 60 contributions per hour per player
  - [ ] 100 API calls per minute per room
- [ ] Basic profanity filter (optional)
- [ ] SQL injection prevention (Prisma handles)
- [ ] XSS prevention (React handles)
- [ ] CSRF tokens for state-changing requests
- [ ] Environment variables secured

**Day 42: Deployment & Monitoring**
- [ ] Deploy to production
- [ ] Verify all services running
- [ ] Setup monitoring dashboards
  - [ ] Error rate
  - [ ] API response times
  - [ ] WebSocket connection count
  - [ ] Database query times
- [ ] Setup alerts
  - [ ] Error rate >5%
  - [ ] API response time >1s
  - [ ] Server down
- [ ] Create runbook for common issues

**Deliverable**: Production-ready alpha version

**Success Criteria**:
- ✅ No critical bugs
- ✅ Performance targets met
- ✅ Security basics covered
- ✅ Monitoring in place
- ✅ 5 internal users can play without issues

**Internal Alpha Test Plan**:
- **Participants**: 10-15 friends/family
- **Duration**: 3 days
- **Goals**:
  - Find bugs
  - Validate AI is funny
  - Test completion rate
  - Get qualitative feedback

---

## Phase 4: Beta Launch (Week 7-8)

### Week 7: Beta Preparation

**Day 43-44: Analytics Implementation**
- [ ] Setup PostHog or Mixpanel
- [ ] Track key events:
  - [ ] Room created
  - [ ] Player joined
  - [ ] Contribution submitted
  - [ ] AI contribution shown
  - [ ] Story completed
  - [ ] Story shared
  - [ ] Player returned (new room, same session)
- [ ] Track error events
- [ ] Setup funnels:
  - [ ] Landing → Create → Play → Complete
  - [ ] Landing → Join → Play → Complete
- [ ] Setup retention cohorts

**Day 45-46: Payment Integration (Premium Tier)**
- [ ] Choose payment provider (Stripe)
- [ ] Create Stripe account
- [ ] Setup products:
  - [ ] Monthly: $4.99
  - [ ] Annual: $39 (20% off)
- [ ] Implement checkout flow
- [ ] Create subscription management page
  - [ ] View current plan
  - [ ] Cancel subscription
  - [ ] Update payment method
- [ ] Implement feature gating
  - [ ] Daily game limit for free tier
  - [ ] Player limit for free tier
- [ ] Test payment flow end-to-end
- [ ] Setup webhooks for subscription events

**Day 47-49: Viral Features**
- [ ] Story sharing
  - [ ] Generate shareable link
  - [ ] Create screenshot-ready view
  - [ ] Add "Share on Twitter" button
  - [ ] Add "Share on Discord" button
- [ ] Referral mechanism
  - [ ] Track where users came from
  - [ ] Give credit to referrer (future: rewards)
- [ ] Social preview cards
  - [ ] OG meta tags
  - [ ] Twitter card tags
  - [ ] Dynamic preview images

**Deliverable**: Beta-ready product with analytics and monetization

---

### Week 8: Beta Launch & Feedback

**Day 50-51: Soft Launch**
- [ ] Announce to alpha testers
- [ ] Post in 3-5 Discord communities
  - [ ] r/PartyGames
  - [ ] r/Jackbox
  - [ ] Creative writing servers
- [ ] Create launch materials
  - [ ] 1-minute demo video
  - [ ] Screenshots of best moments
  - [ ] "How to Play" guide
- [ ] Setup feedback mechanism
  - [ ] In-app feedback button
  - [ ] Discord server for community
  - [ ] Email for critical issues

**Day 52-54: Monitor & Iterate**
- [ ] Daily metrics check:
  - [ ] New users
  - [ ] Active rooms
  - [ ] Completion rate
  - [ ] Return rate
  - [ ] Error rate
- [ ] Respond to feedback
- [ ] Fix critical bugs within 4 hours
- [ ] Fix minor bugs within 24 hours
- [ ] Document common issues

**Day 55-56: Marketing Push**
- [ ] Post on ProductHunt
- [ ] Post on HackerNews (Show HN)
- [ ] Post TikTok examples
  - [ ] Record 3-5 funny story moments
  - [ ] Use trending sounds
  - [ ] Clear CTA to try it
- [ ] Reach out to gaming/party game influencers
- [ ] Post in Gen Z humor subreddits

**Deliverable**: 100+ users, paying customers, validated assumptions

**Success Criteria**:
- ✅ 100+ total users
- ✅ 50+ weekly active users
- ✅ 60%+ game completion rate
- ✅ 40%+ return rate (play more than once)
- ✅ 5+ paying subscribers
- ✅ <5% error rate
- ✅ Positive sentiment (qualitative feedback)

---

## Post-MVP Vision & Roadmap

### V1.1 (Month 2-3): Retention Features

**User-Requested Features** (prioritize based on feedback):
- [ ] Story history (save your games)
- [ ] Custom AI personalities
  - [ ] "Unhinged" mode
  - [ ] "Wholesome" mode
  - [ ] "Horror" mode
- [ ] Player profiles (optional accounts)
  - [ ] Avatar selection
  - [ ] Stats (games played, best contributions)
- [ ] Emoji reactions on contributions
- [ ] Vote to skip AI turn
- [ ] Custom themes (user-submitted)

**Estimated Timeline**: 4 weeks

---

### V1.2 (Month 4-5): Performance & Scale

**Infrastructure Improvements**:
- [ ] Redis caching layer
- [ ] Database read replicas
- [ ] AI request queuing
- [ ] WebSocket horizontal scaling
- [ ] CDN for static assets
- [ ] Image optimization

**Business Improvements**:
- [ ] Email notifications (game invites, reminders)
- [ ] Referral rewards program
- [ ] Annual subscription discount
- [ ] Gift subscriptions

**Estimated Timeline**: 3 weeks

---

### V2.0 (Month 6-9): Platform Expansion

**Major Features**:
- [ ] Voice chat integration (Agora, Daily.co)
- [ ] Story illustrations (AI-generated images)
- [ ] Mobile apps (React Native or PWA)
- [ ] Story replays with "dramatic reading" mode
- [ ] Tournaments/leagues
- [ ] Creator tools (custom game modes)
- [ ] API for third-party integrations

**New Business Lines**:
- [ ] Team/corporate plan (icebreakers, team building)
- [ ] Educational plan (creative writing classes)
- [ ] Enterprise API

**Estimated Timeline**: 12-16 weeks

---

## Success Metrics Tracking

### Leading Indicators (Track Weekly)

**Acquisition**:
- New users (target: 200-400/week by Month 2)
- Traffic sources breakdown
- Referral rate (K-factor - target: >0.5, stretch: 0.8)

**Activation**:
- % who create a room (target: >30%)
- % who join a room (target: >60%)
- % who complete first game (target: >50%)

**Engagement** (adjusted for binge-and-churn pattern):
- Games per user in first week (target: 2-3)
- Average game length (target: 15 min)
- Contributions per user
- **AI Quality Score** (target: 70%+ "funny" feedback)

**Retention** (realistic party game targets):
- D1 retention: target >40%
- D7 retention: target >30% (industry baseline: 20%)
- D30 retention: expect <15% (binge-and-churn pattern)
- Weekly active users
- Monthly active users

**Revenue** (Month 3+):
- Free to paid conversion rate (target: 2-3%)
- MRR (target: $125-250)
- One-time pack purchases vs subscriptions (track ratio)
- Churn rate (monthly subscriptions)
- LTV (target: $15-20)

### Lagging Indicators (Track Monthly)

- NPS score (target: >30)
- Customer satisfaction (CSAT)
- AI quality feedback (% positive vs negative)
- Word-of-mouth growth (K-factor trend)
- Organic vs. paid traffic mix

### Critical Quality Metrics (Make-or-Break)

**AI Quality** (track religiously):
- % of users who rate AI as "funny/entertaining" (target: >70%)
- % of users who rate AI as "annoying/cringe" (limit: <20%)
- Average AI response time (target: <5s)
- AI failure rate (API errors) (limit: <5%)

If AI quality metrics consistently miss targets for 2+ weeks:
- ⚠️ Schedule emergency review
- Consider 2-3 week sprint on prompt engineering
- Or pivot to pre-written chaos events

---

## Resource Allocation

### Week-by-Week Breakdown

| Week | Focus | Dev Time | Priority | Notes |
|------|-------|----------|----------|-------|
| 1 | Infrastructure | 30h | Setup | TS + tests + shadcn setup |
| 2 | Core Components | 35h | Building Blocks | AI testing is critical |
| 3 | Room System | 32h | Core Feature | Writing tests as we go |
| 4 | Story Engine | 38h | Core Feature | Most complex + tests |
| 5 | Polish | 32h | UX | Make it feel good |
| 6 | Testing | 20h | Quality | Fill test gaps, manual QA |
| 7 | Beta Prep | 20h | Launch Prep | Analytics + payment |
| 8 | Launch | 15h | Marketing | Mostly non-dev work |

**Total**: ~222 developer hours (5-6 weeks of full-time work)

**With TypeScript + Tests**:
- +5-10% time during development (type definitions, writing tests)
- -30% time on debugging (caught by types + tests)
- Net effect: About the same time, but MUCH higher confidence

**Risk**: None - tests and types make you faster once you get rolling.

---

## Risk Mitigation

### Technical Risks

**Risk**: AI is too slow or expensive
- **Mitigation**: Optimize prompts, use caching, have fallback responses
- **Trigger**: If cost >$0.50/user/month or latency >3s

**Risk**: WebSocket doesn't scale
- **Mitigation**: Implement Redis adapter early, load test regularly
- **Trigger**: If >5,000 concurrent connections needed

**Risk**: Database bottleneck
- **Mitigation**: Proper indexing, connection pooling, read replicas
- **Trigger**: If query time >500ms average

### Product Risks

**Risk**: AI isn't funny consistently
- **Mitigation**: A/B test prompts, collect user feedback, iterate quickly
- **Trigger**: If <60% of users complete first game

**Risk**: Low retention
- **Mitigation**: Focus on social features, add themes regularly, build community
- **Trigger**: If <30% return for second game

**Risk**: Slow growth
- **Mitigation**: Double down on viral features, content marketing, influencer outreach
- **Trigger**: If <50 new users/week by Month 2

---

## Go/No-Go Decision Points

### After Alpha (Week 6)

**✅ GO if**:
- 5+ alpha testers complete games
- 80%+ positive feedback
- <10 critical bugs
- Core loop is addictive

**❌ NO-GO if**:
- AI is consistently bad
- Major technical blockers
- Negative sentiment

---

### After Beta Month 1 (Week 12)

**✅ GO (continue) if**:
- 100+ total users
- 40%+ return rate
- 5+ paying customers
- Positive unit economics

**🔄 PIVOT if**:
- Growth stalling (<10 new users/week)
- Low engagement (<20% completion rate)
- High costs (>$1/user/month)

**❌ SHUT DOWN if**:
- Can't achieve product-market fit
- Better opportunity identified
- Unsustainable costs

---

## Communication Plan

### Internal Updates (for team)
- **Daily**: Slack standup (what shipped, blockers)
- **Weekly**: Metrics review (dashboard walkthrough)
- **Bi-weekly**: Sprint planning (next priorities)

### External Updates (for users)
- **Weekly**: Product updates (new features, bug fixes)
- **Monthly**: Roadmap transparency (what's coming)
- **On major releases**: Email announcement + blog post

### Community Building
- **Discord server**: Day 1
- **Twitter account**: Day 1
- **ProductHunt launch**: Week 8
- **TikTok content**: Week 8+

---

## Final Pre-Launch Checklist

### Week 8, Day 50 (Before Beta Launch)

**Technical**:
- [ ] All environment variables set in production
- [ ] Database backups configured
- [ ] Error monitoring working (Sentry)
- [ ] Analytics working (PostHog/Mixpanel)
- [ ] Payment system tested
- [ ] Load tested (50 concurrent users)
- [ ] Security review completed
- [ ] SSL certificates valid
- [ ] Domain configured
- [ ] Email sending works (if applicable)

**Product**:
- [ ] All core features working
- [ ] Mobile responsive
- [ ] Cross-browser tested
- [ ] Empty states designed
- [ ] Error states handled
- [ ] Loading states smooth
- [ ] Help/FAQ page created
- [ ] Terms of Service + Privacy Policy

**Marketing**:
- [ ] Landing page optimized
- [ ] Social media accounts created
- [ ] Demo video recorded
- [ ] Screenshots captured
- [ ] Press kit prepared
- [ ] Launch post drafted
- [ ] Email announcement ready

**Support**:
- [ ] Feedback mechanism in place
- [ ] Discord/community setup
- [ ] Support email setup
- [ ] FAQ documented
- [ ] Known issues documented

---

## The Path Forward

This roadmap is aggressive but achievable with focus. The key is to:

1. **Ship fast** - 8 weeks is ambitious but forces prioritization
2. **Test assumptions** - Every week should validate something
3. **Iterate quickly** - User feedback drives the roadmap
4. **Stay focused** - Resist feature creep before validating core loop
5. **Have fun** - If you're not laughing while building it, something's wrong

Let's make some chaos. 🎲✨
