# Plot Twist - Business Plan

## Problem & Market

### What specific problem are we solving?
Social gatherings often fall into repetitive patterns - same party games, same conversations, same energy. Traditional party games either require too much setup (board games), are too physical (charades), or become stale quickly. Meanwhile, collaborative creative activities are gatekept by people who think they "can't write" or aren't "creative enough."

We're solving the awkward moment when someone says "let's do something fun" and everyone just scrolls their phones instead.

### Who experiences this problem most acutely?
- **Primary**: Gen Z and young millennials (16-28) who want engaging group activities
- **Secondary**: Friend groups, college students, casual party hosts
- **Tertiary**: Long-distance friend groups looking for remote hangout activities

### What's the cost of not solving it?
- Boring hangouts → people leave early or don't come at all
- Social anxiety → people default to passive activities (watching movies/shows)
- Missed connections → friends don't bond as deeply
- Creative stagnation → people never discover they're funny/creative

### Market Size (Conservative Estimates)
- **TAM**: 5-10M people globally who would try text-based collaborative party games
- **SAM**: 500K people who might play more than once (based on Jackbox's ~30M players over 10 years, assuming 2-5% would try a text-based variant)
- **SOM**: 25K active users in first 18 months (5% of SAM - aggressive but achievable)

Reality check: Jackbox has sold ~10M copies over a decade with massive marketing and production quality. We're targeting a smaller niche (text-based collaborative storytelling) which is more accessible but also more novelty-driven.

## Solution & Value Proposition

### How do we solve this problem differently?
Plot Twist removes the pressure of "being good at writing" by making chaos the goal. The AI acts as both collaborator and agent of chaos - it's not a teacher or judge, it's the friend who makes everything funnier. Players can't fail because broken, weird stories ARE the success state.

Unlike Jackbox (requires specific setup, limited replay value) or D&D (requires prep, skill, dedicated time), Plot Twist is:
- **Instant**: Open a link, start playing in 30 seconds
- **Accessible**: No writing skill needed, casual AF
- **Infinite**: AI generates endless variety
- **Platform-agnostic**: Works on phones during a car ride or on laptops at a party

### Core value proposition (one sentence)
Turn your friend group into comedy writers without any of them having to be good at writing.

### What are we NOT doing?
- ❌ We're not building a serious creative writing tool
- ❌ We're not teaching people to write better
- ❌ We're not creating long-form novels or publishable content
- ❌ We're not a solo experience - this is multiplayer-first
- ❌ We're not family-friendly by default (content will get chaotic)

## Business Model

### Revenue Model for MVP
**Hybrid Model: Freemium + One-Time Packs**

**Free Tier** (90% of users):
- 3 games per day
- Standard AI chaos level
- Up to 6 players per game
- Basic game modes
- Stories auto-delete after 24 hours

**Option 1 - Monthly Subscription** ($4.99/month):
- Unlimited games
- All features unlocked
- **Risk**: Party games are "binge and churn" - users may play intensely for 1-2 weeks then cancel

**Option 2 - One-Time Theme Packs** ($5-7 per pack):
- 10-15 themed scenarios per pack
- Permanent access to purchased themes
- No recurring charge
- **Hypothesis**: Matches Jackbox's successful one-time purchase model

**Initial Strategy**: Launch with both, see which converts better, then double down.

**Viral Mechanism**: Every free game generates a shareable story link that shows highlights and prompts friends to "play the full version"

### Why This Pricing Works (and the risks)
**Pros**:
- Lower than Jackbox party packs ($15-30)
- One-time packs reduce churn risk
- Monthly option captures engaged users

**Cons** (acknowledging reality):
- Party games typically see low retention (1-2 week bursts, then dormant)
- Free tier might be TOO generous - why pay if you only play occasionally?
- Subscription model historically fails for party games (Houseparty, Bunch, etc.)

**Mitigation**:
- Start with generous free tier to build user base
- Focus on one-time packs as primary revenue (lower churn)
- Monthly subscription for power users only (likely 1-2% of active users)

### Unit Economics Assumptions (Conservative)
**Costs per user/month:**
- Claude API calls: ~$0.20 (assuming **3-4 games/month** in bursts, not 10)
- Hosting/database: ~$0.05
- CDN/bandwidth: ~$0.02
**Total**: ~$0.27/user/month

**Reality Check**: Party games see bursty engagement (users play 3-4 games in one night, then nothing for weeks). Monthly engagement is likely 2-4 games, not 10.

**Revenue scenarios**:

**Scenario A - One-Time Packs** (better margin, but requires new content):
- $6 per pack purchase
- User buys 2 packs per year = $12/year = $1/month amortized
- Gross margin: 73% (acceptable)
- No churn risk once purchased

**Scenario B - Monthly Subscription** (recurring but high churn):
- $4.99/month for power users
- Expected retention: 2-3 months (party game pattern)
- LTV: $10-15 (not $60)
- Gross margin: 95% while active, but churn kills LTV

**Blended Model**:
- 70% of revenue from one-time packs
- 30% from monthly subscriptions (1-2% of users, power users only)
- Target blended LTV: $15-20 per paying user

**CAC target**: $2-5 (must be lower due to reduced LTV)
**Payback period**: 2-4 months
**Realistic conversion**: 2-3% of active users become paying (not 5%)

## Competition & Differentiation

### Direct Competitors

**1. Jackbox Party Packs**
- Strengths: Established brand, high-quality production, variety of games
- Weaknesses: Expensive ($15-30 per pack), limited replay value, requires shared screen setup
- Our advantage: Infinite variety, instant play, mobile-first, lower price

**2. AI Dungeon / Character.AI**
- Strengths: Advanced AI, large user base, storytelling focus
- Weaknesses: Solo experience, serious tone, not designed for parties
- Our advantage: Multiplayer chaos, party-optimized, AI as comedian not narrator

**3. Storytelling card games (Dixit, Once Upon a Time)**
- Strengths: Physical presence, proven gameplay
- Weaknesses: Requires physical cards, limited scenarios, setup time
- Our advantage: Digital, instant, infinite content, AI participation

### Our Key Differentiator
**The AI is a player, not a tool.** Every other platform treats AI as an assistant or narrator. We treat it as the chaotic friend who makes everything funnier. It's not helping you tell a good story - it's helping you tell a hilariously broken one.

### Why We'll Win (and the risks)

**Our Advantages**:
1. **Lower barrier to entry**: No app download, no setup, works on any device
2. **Infinite content**: AI never runs out of twists, unlike fixed card decks or prompts
3. **Timing**: First to market with "AI as chaos agent" concept
4. **Speed**: Can iterate faster than Jackbox (they ship annually, we ship weekly)

**Honest Risk Assessment**:
1. **Weak moat**: Jackbox could add AI to their games in a few sprints. Our only defense is moving fast and building community before they notice us.
2. **Feature, not business**: AI chaos is a feature that could be copied. We need to build brand/community as our real moat.
3. **Free alternatives exist**: Group chats + ChatGPT can approximate this experience. Our value prop is convenience + UI polish.
4. **Make-or-break on AI quality**: If the AI isn't consistently funny (not cringe), we don't have a product. This is our highest technical risk.

**Mitigation Strategy**:
- Ship fast, iterate based on feedback (weekly updates, not annual releases)
- Build community/brand as real moat (Discord, content, influencers)
- Focus on mobile-first UX (Jackbox is TV-first, we're phone-first)
- Double down on themes/content if AI quality plateaus
- Accept we're building a niche product (5-10M TAM, not 300M)

## MVP Scope & Success Criteria

### Core Features for MVP

**1. Real-time Collaborative Story Writing** ⭐ CORE VALUE
- Players join a room via link
- Take turns writing 1-3 sentences
- See everyone's contributions in real-time
- Simple, clean interface (no clutter)

**2. AI Chaos Agent** ⭐ CORE VALUE
- AI jumps in every 2-3 player turns
- Either inserts a story sentence OR changes the environment/introduces elements
- Adaptive to story tone (if players go silly, AI goes sillier)
- No "game master" voice - AI is IN the story

**3. Room System** ⭐ ENABLING FEATURE
- Create a room in 1 click
- Share link to friends
- Up to 6 players in free version
- Room stays active for 24 hours

**4. Game Modes** (Minimal for MVP)
- Freeform (no theme)
- Quick themes (dropdown selection: "First Date Gone Wrong", "Heist", "Group Chat", etc.)

### What We're Explicitly EXCLUDING from MVP
- ❌ User accounts (not required to play)
- ❌ Story saving/history
- ❌ Custom AI personalities
- ❌ Voice/video chat
- ❌ Story voting/rating
- ❌ Character sheets/profiles
- ❌ Story illustrations/images
- ❌ Mobile apps (web-only)
- ❌ Moderation tools (except basic profanity filter)
- ❌ Multiple languages (English only)

### Success Metrics (3 Months Post-Launch) - Conservative Targets

**User Acquisition**:
- 5,000 total users (down from 10K - more realistic)
- 500 weekly active users
- 50-75 daily active users

**Engagement**:
- Average 2-3 games per user in first week (bursty pattern)
- Average game length: 15 minutes
- 50%+ completion rate (games that reach natural ending)
- 30%+ return rate within 7 days (users who play more than once)

**Virality** (adjusted expectations):
- K-factor of 0.5-0.8 (realistic, not 1.2)
- 20%+ of new users come from shared links
- Reality: Most social apps are 0.3-0.5, we need to beat average

**Monetization** (Month 3):
- 25-50 paying customers (not 50 - more conservative)
- $125-250 MRR
- 2-3% conversion rate from free to paid (realistic for party games)

**Quality**:
- <3 second page load
- <500ms AI response time
- 99%+ uptime
- <5% error rate

**AI Quality** (critical new metric):
- <20% of feedback mentions "AI is annoying/cringe"
- 60%+ of users say AI contributions were "funny"
- This is make-or-break - if AI quality is bad, nothing else matters

### First 100 Users Acquisition Strategy

**Week 1-2: Friends & Family Alpha**
- Invite 20 close friends to test
- Host 3-4 game nights via Zoom/Discord where we play together
- Goal: Get to 50 total users, collect feedback on what's confusing

**Week 3-4: Discord/Reddit Beta**
- Post in party game communities (r/PartyGames, r/Jackbox, party planning Discords)
- Post in creative writing communities with angle of "no writing skill needed"
- Post in Gen Z humor communities (r/me_irl style)
- Offer "beta access" to first 100 to join

**Week 5-6: TikTok Seeding**
- Record funny story examples (10-15 second clips of absurd moments)
- Post with caption style: "POV: AI is your chaotic friend"
- Encourage beta users to share their funniest stories
- Goal: 1-2 videos to get 10K+ views

**Week 7-8: College Campus Guerrilla**
- Target 2-3 colleges with strong social scenes
- Post QR codes in dorms, libraries, cafeterias
- Partner with 3-5 student influencers to play at parties
- Goal: Get "cult following" at 1-2 schools

**Ongoing: Viral Loop**
- Every story ends with "Share this chaos" link
- Screenshot-optimized story recaps
- Prompt to invite friends for free game slots

## Risks & Assumptions

### Key Assumptions We're Testing

**Assumption 1: AI can be consistently funny (THE CRITICAL ONE)**
- **Test**: Do 70%+ of users say AI contributions were entertaining?
- **Success criteria**: <20% negative AI feedback, 50%+ completion rate
- **Why critical**: This IS the product. If this fails, everything else is irrelevant.
- **Time to validate**: Week 2-3 of alpha (50+ completed games)
- **If it fails**: Either (a) spend 2-3 months on prompt engineering or (b) pivot to pre-written chaos events

**Assumption 2: People want chaotic collaborative fun over "good" storytelling**
- **Test**: Do players laugh more than they cringe? Do they finish games?
- **Success criteria**: 50%+ game completion rate, 30%+ return rate
- **Why important**: Validates the core concept

**Assumption 3: Users will return despite "binge and churn" pattern**
- **Test**: Do 30%+ of users play again within 7 days?
- **Reality check**: Party games historically see <20% week-1 retention
- **Success criteria**: Beat the 20% baseline (even if we don't hit 40%)

**Assumption 4: Viral sharing drives growth (not paid ads)**
- **Test**: Do players naturally share links/screenshots?
- **Success criteria**: K-factor >0.5 (not 1.2), 20%+ traffic from referrals
- **Reality**: We'll probably need paid acquisition by Month 2

**Assumption 5: Some users will pay for novelty experience**
- **Test**: Do 2-3% of active users convert to paid?
- **Success criteria**: 25-50 paying customers by Month 3
- **Reality**: One-time packs likely convert better than subscriptions

### Biggest Risks to Success

**Risk 1: AI Quality/Consistency** 🔴 CRITICAL - MAKE OR BREAK
- **This is the entire product.** If AI isn't consistently funny, we have nothing.
- AI might not be funny consistently (what's hilarious to one group is cringe to another)
- AI might repeat itself or break immersion
- Getting LLMs to be "controlled chaos" is extremely difficult
- API costs might be 2-3x estimate if we need retries/longer contexts
- **Evidence**: AI Dungeon spent millions on this and still gets criticized for inconsistency
- **Mitigation**: 
  - Extensive A/B testing of prompts with real users in alpha
  - Build library of 50+ prompt variations tested for humor
  - Have "fallback simple chaos mechanics" (pre-written twists) if AI fails
  - **Reality check**: If fallback is needed often, we don't have a viable product
  - Budget 2-3 months just for prompt engineering and AI tuning
  - Accept we might need to pivot if AI quality can't be solved

**Risk 2: Weak Competitive Moat** 🔴 HIGH IMPACT
- Jackbox could copy this feature in 3-6 months
- They have brand, capital, and distribution
- Free alternatives (group chats + ChatGPT) approximate this
- **Mitigation**: 
  - Move extremely fast (ship in 8 weeks, iterate weekly)
  - Build community as moat (Discord, content, influencer partnerships)
  - Focus on niche we can own (mobile-first, Gen Z audience)
  - Acknowledge this might be a feature, not a company

**Risk 3: Low Retention (Party Game Pattern)** 🟡 MEDIUM IMPACT
- Party games are "binge and churn" - intense for 1-2 weeks, then dormant
- Historical data: Users rarely return after initial burst
- Novelty wears off quickly
- **Evidence**: This is why Jackbox sells one-time packs, not subscriptions
- **Mitigation**:
  - Accept this pattern and optimize for it (one-time packs, not monthly)
  - New themes weekly to bring users back
  - Focus on viral acquisition over retention
  - Target lower LTV ($15-20, not $60) with lower CAC ($2-5)

**Risk 4: Overestimated Viral Growth** 🟡 MEDIUM IMPACT
- K-factor of 1.2 would be exceptional (most social apps: 0.3-0.5)
- Depends on stories being funny enough to share (30% maybe, not 100%)
- High friction from share → play conversion
- **Reality**: We'll likely need paid acquisition sooner than planned
- **Mitigation**:
  - Target K-factor of 0.5-0.8 (still good, more realistic)
  - Optimize share mechanics (make screenshots beautiful)
  - Budget for paid acquisition ($2-5 CAC) from Month 2

**Risk 5: Market Timing** 🟢 LOW IMPACT (Short-term)
- Party game market might be saturated
- Gen Z might have moved on from text-based games
- **Mitigation**:
  - Launch quickly to test hypothesis (8 weeks to MVP)
  - Pivot to video chat integration if needed
  - Focus on mobile-first experience (Jackbox is TV-first)

### De-risking Strategy
1. **Month 1**: Validate people actually enjoy the core loop (50+ completed games)
2. **Month 2**: Validate people return for more (40%+ return rate)
3. **Month 3**: Validate people will pay ($250 MRR)
4. **Month 4+**: Scale or pivot based on data

---

## Go/No-Go Decision Points

**After Alpha Testing (Week 6 - 50+ completed games)**

**✅ GO if**:
- 70%+ of testers say AI was "funny" or "entertaining"
- <20% negative feedback about AI being cringe/repetitive
- 50%+ of games reach completion (not abandoned mid-story)
- 30%+ of testers play more than once
- Fewer than 10 critical bugs in core loop

**🔄 PIVOT if**:
- AI quality is inconsistent (50-60% funny) → Invest 2-3 months in prompt engineering OR switch to pre-written chaos events
- Completion rate <40% → Users aren't engaged, concept might not work
- Everyone plays once and never returns → Accept binge-and-churn pattern, optimize for it

**❌ NO-GO if**:
- AI is consistently bad (<50% positive feedback) and can't be fixed
- Completion rate <30% (users actively abandon games)
- Major technical blockers that can't be solved
- Overwhelmingly negative sentiment

---

**After Beta Month 1 (Week 12 - 500+ users)**

**✅ GO (continue building) if**:
- 2,500-5,000 total users
- 25-50 paying customers ($125-250 MRR)
- 30%+ week-1 return rate (beats industry baseline of 20%)
- K-factor >0.5 (organic viral growth happening)
- Unit economics work: CAC <$5, LTV >$15

**🔄 PIVOT if**:
- Growth stalling (<50 new users/week) → Need paid acquisition or new distribution
- Low engagement (<20% return rate) → Binge-and-churn confirmed, switch to one-time packs
- AI costs too high (>$0.50/user) → Optimize prompts or reduce AI frequency

**❌ SHUT DOWN if**:
- Can't hit 2,500 users with organic + small paid efforts
- Conversion <1% (no one willing to pay)
- Unsustainable economics (CAC >$10, LTV <$10)
- Better opportunity identified
- Can't fix AI quality after 3 months of trying

---

**Acceptance Criteria Summary**

This is a **high-risk, potentially high-reward** product with a narrow path to success:

1. **AI must be consistently funny** (70%+ positive feedback) - this is non-negotiable
2. **Accept binge-and-churn pattern** - optimize for it, don't fight it
3. **Achieve K-factor >0.5** - need organic virality, paid acquisition alone won't work at this price point
4. **Hit 2-3% paid conversion** - enough to validate people will pay for novelty
5. **Keep CAC <$5** - higher and unit economics break

**Honest Reality Check**:
- We're building a niche product (5-10M TAM, not 300M)
- AI quality is make-or-break and largely out of our control
- Competitive moat is weak (speed + community + mobile-first focus)
- This might be a feature, not a company
- Success means 25K active users and $5-10K MRR, not unicorn scale

**But worth trying if**:
- You can ship in 8 weeks with minimal investment
- You're okay with "base hit" success (not home run)
- You have a backup plan if it doesn't work
- You enjoy the problem space and building for it
