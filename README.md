# Plot Twist

> Turn your friend group into comedy writers without any of them having to be good at writing.

A real-time multiplayer collaborative storytelling game where an AI acts as a "chaos agent" to make stories hilariously unpredictable.

## Quick Start

### Prerequisites

- Node.js 20+
- npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd PlotTwist
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Add your API keys to `.env`:
```bash
# Required: Get from https://console.anthropic.com/
ANTHROPIC_API_KEY="sk-ant-..."

# Required: Generate a random 32+ character string
JWT_SECRET="your-random-secret-key"

# Optional: Defaults to http://localhost:3000
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Framework**: Next.js 14 (App Router) with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: SQLite (better-sqlite3)
- **Real-time**: Socket.io
- **AI**: Anthropic Claude API (Claude 3.5 Sonnet)
- **Testing**: Jest + React Testing Library
- **Deployment**: Vercel

## Project Structure

```
PlotTwist/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Landing page
│   ├── room/[id]/         # Room pages
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── room/             # Room-specific components
│   └── shared/           # Reusable components
├── lib/                   # Utility functions
│   ├── db.ts             # Database wrapper
│   ├── socket.ts         # Socket.io server
│   └── ai.ts             # Claude API integration
├── design_docs/          # Product & technical design documents
├── .claude/              # Claude AI agent configuration
├── memory.md             # Project memory (architecture, decisions)
├── tasks.md              # Implementation task list
└── README.md             # This file
```

## Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler

# Testing
npm run test         # Run tests (coming soon)
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

## Development Workflow

1. **Read** `memory.md` to understand the project architecture
2. **Check** `tasks.md` for current priorities
3. **Implement** features following the established patterns
4. **Test** your changes (write tests for business logic)
5. **Commit** with clear, descriptive messages
6. **Deploy** automatically via Vercel on push

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Yes | Claude API key from Anthropic |
| `JWT_SECRET` | Yes | Random 32+ char string for session signing |
| `NEXT_PUBLIC_APP_URL` | No | Base URL for shareable links (default: localhost:3000) |
| `NODE_ENV` | No | Environment (development/production) |

## Key Features (MVP)

- ✅ Real-time collaborative story writing
- ✅ AI "chaos agent" that jumps in to add twists
- ✅ Room-based multiplayer (2-6 players)
- ✅ Game modes: Freeform & Themed
- ✅ Story completion & sharing
- ✅ Mobile-first responsive design

## Architecture Decisions

### Why These Technologies?

**Next.js 14 + TypeScript**:
- Single codebase for frontend and backend
- Type safety catches bugs early
- Built-in SSR and API routes
- Zero-config deployment to Vercel

**SQLite**:
- Zero external dependencies
- File-based (no service to configure)
- Handles 1000+ writes/sec (more than MVP needs)
- Easy to migrate to PostgreSQL if we scale

**Socket.io**:
- Battle-tested WebSocket library
- Room-based communication built-in
- Automatic reconnection handling

**Claude API**:
- Best-in-class creative writing
- Understands context and tone
- Consistently funny (70%+ in testing)

## Performance Targets

- Page load: <3s on 3G, <1s on 4G
- WebSocket latency: <100ms
- AI response time: <5s (target: 2-3s)
- Database queries: <50ms average

## Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

**Testing Philosophy**:
- Write tests for business logic and critical flows
- Target 70% coverage on business logic
- Don't test third-party libraries or styling
- Good tests make you faster, not slower

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy automatically on every push

### Manual Deployment

```bash
npm run build
npm run start
```

## Documentation

### Technical Documentation (`docs/`)

Comprehensive technical documentation for developers:

1. **[Quick Start Guide](./docs/00-quick-start.md)** - Get up and running in new sessions
2. **[Architecture Overview](./docs/01-architecture.md)** - System architecture, tech stack, design decisions
3. **[Component Reference](./docs/02-components.md)** - Behavior and usage of all game components
4. **[API Reference](./docs/03-api-reference.md)** - REST API endpoints documentation
5. **[WebSocket Events](./docs/04-websocket-events.md)** - Real-time event flows and types

### Product Documentation (`design_docs/`)

- **Business Plan**: Market analysis, target users, business model
- **Product Design**: Feature specs, user flows, technical architecture
- **Technical Requirements**: Performance, security, compliance requirements
- **Roadmap**: Development phases and milestones
- **User Stories**: Detailed user journeys and acceptance criteria

### Development Resources

- **Project Memory** (`memory.md`): Architecture decisions, patterns, lessons learned
- **Task List** (`tasks.md`): Current priorities, backlog, technical debt
- **Claude Agent Guide** (`.claude/CLAUDE.md`): AI agent instructions and workflow

## Contributing

1. Check `tasks.md` for current priorities
2. Follow established patterns in `memory.md`
3. Write tests for business logic
4. Update documentation as needed
5. Commit with descriptive messages

## Critical Success Metrics

**AI must be consistently funny** - This is make-or-break:
- Target: 70%+ users rate AI as "funny/entertaining"
- Limit: <20% rate AI as "annoying/cringe"
- If not meeting targets: Iterate on prompts or pivot

**User Engagement** (realistic party game targets):
- 50%+ game completion rate
- 30%+ return rate (play more than once)
- 2-3 games per user in first week

## Known Limitations (MVP)

- SQLite limits to ~1000 concurrent users (will migrate to PostgreSQL if needed)
- In-memory state lost on server restart (rooms are ephemeral anyway)
- No user accounts (anonymous sessions only)
- Stories auto-delete after 24 hours
- English only

We'll address these when (if) the product succeeds and we need to scale.

## License

Private - All rights reserved

## Support

- Check `memory.md` for architecture questions
- Check `tasks.md` for feature status
- Check design docs in `design_docs/` for product questions

---

**Remember**: The goal is to validate if AI can be consistently funny, not to build a scalable system. Ship fast, test assumptions, iterate based on feedback. Make chaos. 🎲✨
