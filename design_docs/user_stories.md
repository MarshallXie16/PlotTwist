# Plot Twist - User Stories

## Overview

These user stories represent the core MVP features that must work flawlessly. Each story is written from the user's perspective and includes specific acceptance criteria that can be tested.

**Story Format**:
```
As a [user type]
I want to [action]
So that [benefit]

Acceptance Criteria:
- [ ] Specific testable requirement
- [ ] Another requirement
```

---

## Epic 1: Onboarding & Room Creation

### Story 1.1: First-Time Visitor Landing

**As a** first-time visitor
**I want to** immediately understand what Plot Twist is
**So that** I can decide if I want to try it

**Acceptance Criteria**:
- [ ] Landing page loads in <3 seconds
- [ ] Hero section clearly explains the concept in <10 words
- [ ] One primary CTA button ("Create Room") is prominently displayed
- [ ] Optional "How It Works" section explains in 3 bullet points
- [ ] No account creation required to get started
- [ ] Mobile-responsive design works on phones
- [ ] Page includes example story snippet to show what chaos looks like

**Test Cases**:
1. Open landing page → Should see hero + CTA
2. Read hero → Should understand "collaborative story game"
3. Click "How It Works" → Should see 3 simple steps
4. Resize to mobile → Should still be readable and usable

---

### Story 1.2: Create New Room

**As a** user who wants to start a game
**I want to** create a room with minimal friction
**So that** I can invite friends and start playing quickly

**Acceptance Criteria**:
- [ ] Click "Create Room" opens a modal/page
- [ ] Nickname input is focused automatically
- [ ] Nickname is limited to 20 characters
- [ ] Game mode selector shows "Freeform" (default) and "Themed"
- [ ] If "Themed" selected, dropdown shows 5 theme options
- [ ] Room is created in <1 second
- [ ] Room ID is generated (unique, short, shareable)
- [ ] After creation, automatically navigates to room page
- [ ] No errors if user presses "Create" rapidly (prevent duplicates)

**Test Cases**:
1. Click "Create Room" → Modal opens
2. Enter nickname "Josh" → Accepts
3. Enter 21-character nickname → Truncates or shows error
4. Select "Freeform" → Room created without theme
5. Select "Themed" → "First Date Gone Wrong" → Room created with theme
6. Create room → Room ID generated → Can navigate to /room/[id]

**Edge Cases**:
- Empty nickname → Show error: "pick a nickname"
- Special characters in nickname → Sanitize (allow letters, numbers, spaces)
- Network error during creation → Show error: "couldn't create room, try again?"

---

### Story 1.3: Share Room Link

**As a** room creator
**I want to** easily share the room link with friends
**So that** they can join my game

**Acceptance Criteria**:
- [ ] Room link is displayed prominently after creation
- [ ] Link is copyable with one click
- [ ] Copy action shows success feedback ("link copied!")
- [ ] QR code is generated for in-person sharing
- [ ] QR code links directly to the room
- [ ] Link is short and shareable (e.g., plottwist.gg/r/abc123)
- [ ] Works on mobile (share button uses native share sheet)

**Test Cases**:
1. Create room → See share link
2. Click "Copy Link" → Link copied to clipboard
3. Paste link in new tab → Should open room directly
4. Scan QR code → Opens room on phone
5. Click share button on mobile → Native share sheet appears

---

## Epic 2: Joining Rooms

### Story 2.1: Join Room via Link

**As a** player with a room link
**I want to** join the room easily
**So that** I can play with my friends

**Acceptance Criteria**:
- [ ] Clicking room link opens room page
- [ ] Nickname input prompt appears
- [ ] Nickname is pre-filled if user has a session
- [ ] Can change nickname before joining
- [ ] Joining takes <2 seconds
- [ ] If room is full, show clear error message
- [ ] If room doesn't exist, show "room not found" message
- [ ] If room expired, show "room expired" message

**Test Cases**:
1. Open room link (first time) → Prompt for nickname
2. Enter nickname "Emma" → Successfully joins
3. Try to join full room → Error: "room is full (6/6 players)"
4. Try to join expired room → Error: "this room expired"
5. Try invalid room ID → Error: "room not found"
6. Rejoin same room later → Nickname remembered

**Edge Cases**:
- Room fills up while joining → Show error gracefully
- Network error during join → Retry mechanism or clear error
- Same player joins twice (different tabs) → Allow but track as same session

---

### Story 2.2: Waiting Room

**As a** player who joined a room
**I want to** see other players joining
**So that** I know when we can start

**Acceptance Criteria**:
- [ ] Waiting screen shows "waiting for players to join"
- [ ] Shows list of current players (nickname + color badge)
- [ ] Updates in real-time when players join
- [ ] Shows player count: "3/6 players"
- [ ] Copy link button available during wait
- [ ] Shows "game starting..." when 2+ players ready
- [ ] Auto-transitions to game when starting
- [ ] Shows who's the host (first player) with indicator

**Test Cases**:
1. Join as first player → See "waiting for players"
2. Second player joins → See player appear in list immediately
3. Six players join → See "6/6 players" and room full
4. Player disconnects → See them marked as "inactive" or removed
5. Host leaves → New host is assigned (next player)

---

## Epic 3: Playing the Game

### Story 3.1: Player Turn

**As a** player whose turn it is
**I want to** write my contribution easily
**So that** I can advance the story

**Acceptance Criteria**:
- [ ] Turn indicator clearly shows "Your turn!"
- [ ] Text input is automatically focused
- [ ] Can write 1-500 characters
- [ ] Character counter shows remaining characters
- [ ] Submit button is disabled if <10 characters
- [ ] Submit button is enabled if 10-500 characters
- [ ] Pressing Enter submits (or Shift+Enter for new line)
- [ ] Contribution appears in story immediately after submit
- [ ] Input clears after successful submit
- [ ] Shows success feedback ("sent!")
- [ ] Next player's turn starts automatically

**Test Cases**:
1. My turn starts → Input focused automatically
2. Type "fernando the horse" (20 chars) → Counter shows "480"
3. Type 5 characters → Submit button disabled
4. Type 15 characters → Submit button enabled
5. Click submit → Contribution appears, input clears
6. Press Enter → Same as clicking submit
7. Type 501 characters → Can't type more (blocked at 500)

**Edge Cases**:
- Submit while offline → Show error, retry when reconnected
- Submit duplicate (button clicked twice) → Prevent duplicate saves
- Contribution has HTML/scripts → Sanitize before displaying

---

### Story 3.2: Waiting for Turn

**As a** player waiting for my turn
**I want to** see the story unfold in real-time
**So that** I can follow along and prepare my contribution

**Acceptance Criteria**:
- [ ] Story feed shows all contributions so far
- [ ] New contributions appear with smooth animation
- [ ] Auto-scrolls to show latest contribution
- [ ] Shows which player wrote each contribution (nickname + color)
- [ ] Shows relative timestamps ("just now", "2m ago")
- [ ] Shows typing indicator for active player ("emma is typing...")
- [ ] Shows turn order indicator ("up next: josh")
- [ ] Can scroll up to see earlier story parts
- [ ] Scrolling up doesn't interrupt new contributions appearing

**Test Cases**:
1. Wait during another player's turn → See typing indicator
2. Player submits → See contribution appear with animation
3. Scroll up to read earlier → New contribution still appears at bottom
4. Multiple contributions in quick succession → All appear smoothly
5. Long contribution → Displays without breaking layout

---

### Story 3.3: AI Contribution

**As a** player experiencing an AI turn
**I want to** be surprised by the AI's chaos
**So that** the game stays unpredictable and fun

**Acceptance Criteria**:
- [ ] AI intervenes every 2-3 player turns (random variance)
- [ ] Shows "AI is thinking..." indicator
- [ ] Typing dots animation plays
- [ ] AI contribution appears after 2-5 seconds
- [ ] AI contribution has distinct visual style (purple glow/gradient)
- [ ] Labeled as "AI" not a player name
- [ ] AI contribution types:
  - [ ] 70% chance: Direct story insertion (adds to narrative)
  - [ ] 30% chance: Environmental twist (changes setting/introduces element)
- [ ] AI response matches the story's tone (silly → sillier, dramatic → more dramatic)
- [ ] AI contribution is 1-3 sentences
- [ ] If AI fails, skip the turn and continue (no game-breaking error)

**Test Cases**:
1. After 2 player turns → AI turn triggers
2. See "AI is thinking..." → Typing animation
3. AI responds in ~3 seconds → Response appears with glow
4. AI direct insert: "fernando suddenly coughs up glitter" → Fits story
5. AI twist: "suddenly everyone's underwater for some reason" → Changes environment
6. Story is silly → AI continues silliness
7. API fails → Game continues without AI turn

**Edge Cases**:
- AI response too long → Truncate to 3 sentences max
- AI response inappropriate → Filter/regenerate (very rare with Claude)
- AI slow (>10s) → Skip turn to keep game flowing

---

### Story 3.4: Real-Time Collaboration

**As a** player in a multi-player room
**I want to** feel like I'm playing with real people
**So that** the experience feels social and engaging

**Acceptance Criteria**:
- [ ] See all players' avatars/badges in sidebar
- [ ] Active player has indicator (pulsing border)
- [ ] Disconnected players show as "inactive" (grayed out)
- [ ] Reconnected players restore to "active"
- [ ] Toast notification when player joins: "emma joined!"
- [ ] Toast notification when player leaves: "josh left"
- [ ] All story updates happen simultaneously for all players (<100ms delay)
- [ ] No player sees different story order
- [ ] WebSocket reconnects automatically if connection drops

**Test Cases**:
1. Three players in room → All see same story at same time
2. One player writes → All see it within 100ms
3. Player closes tab → Others see "josh left" notification
4. Player rejoins → Others see "josh joined!" notification
5. Internet drops briefly → Auto-reconnects without breaking game
6. Host leaves → New host assigned, game continues

---

## Epic 4: Story Completion

### Story 4.1: Ending the Story

**As a** player or host
**I want to** end the story when it feels complete
**So that** we can see the full chaos we created

**Acceptance Criteria**:
- [ ] Host can click "End Game" button at any time
- [ ] Confirmation prompt: "end the story now?"
- [ ] After confirming, game transitions to recap screen
- [ ] Auto-end after 30 minutes of play
- [ ] Auto-end after 50 contributions (story getting too long)
- [ ] All players see recap screen simultaneously
- [ ] Can't add more contributions after game ends

**Test Cases**:
1. Host clicks "End Game" → Confirmation appears
2. Host confirms → All players see recap screen
3. Play for 30 minutes → Auto-ends with notification
4. Write 50 contributions → Auto-ends with "epic story!" message
5. Non-host player → Doesn't see "End Game" button

---

### Story 4.2: Story Recap

**As a** player viewing the completed story
**I want to** see our creation in a satisfying format
**So that** I can appreciate the chaos and share it

**Acceptance Criteria**:
- [ ] Recap screen shows full story in clean format
- [ ] Each contribution labeled with player name/AI
- [ ] Player colors maintained for visual distinction
- [ ] Shows story stats:
  - [ ] Total contributions
  - [ ] Number of players
  - [ ] AI interventions
  - [ ] Game duration
- [ ] Highlight "best moments" (AI contributions with most impact)
- [ ] Screenshot-optimized view (good for sharing)
- [ ] "Share" button generates shareable link
- [ ] "Play Again" button creates new room
- [ ] "Copy Story" button copies full text to clipboard

**Test Cases**:
1. Story ends → Recap screen appears
2. See full story with all contributions
3. Stats show correct numbers
4. Click "Share" → Shareable link generated
5. Click "Copy Story" → Full text copied
6. Click "Play Again" → New room created with same players
7. Screenshot recap → Looks good (no UI clutter)

---

### Story 4.3: Share Story

**As a** player who just completed a story
**I want to** easily share the funny moments
**So that** my other friends want to play too

**Acceptance Criteria**:
- [ ] Share button generates unique story link
- [ ] Link opens a public view of the completed story (read-only)
- [ ] Public view is optimized for social media sharing
- [ ] Open Graph tags populate correctly (title, description, preview)
- [ ] Twitter Card shows story preview
- [ ] "Play Your Own" CTA button on shared view
- [ ] Shared stories expire after 7 days (privacy)
- [ ] Can share on Twitter, Discord, copy link

**Test Cases**:
1. Click "Share" → Link generated
2. Open link in new tab → See story (read-only)
3. Share on Twitter → Preview card appears correctly
4. Click "Play Your Own" → Goes to landing page
5. Wait 7 days → Shared link expires

---

## Epic 5: Premium Features (Post-MVP)

### Story 5.1: Upgrade to Premium

**As a** free user hitting limits
**I want to** upgrade to premium
**So that** I can play unlimited games

**Acceptance Criteria**:
- [ ] Free tier limit notification: "you've played 3 games today"
- [ ] "Upgrade" CTA appears in notification
- [ ] Clicking upgrade opens pricing page
- [ ] Shows benefits clearly: unlimited games, more players, advanced features
- [ ] Checkout flow with Stripe
- [ ] Payment processes in <10 seconds
- [ ] Immediately unlock premium features after payment
- [ ] Confirmation email sent

**Test Cases**:
1. Play 3 games → See limit notification
2. Click "Upgrade" → Pricing page loads
3. Select monthly plan → Checkout opens
4. Complete payment → Premium unlocked immediately
5. Create 4th game → No limit, works normally

---

## Epic 6: Edge Cases & Error Handling

### Story 6.1: Connection Lost

**As a** player who loses connection
**I want to** automatically reconnect
**So that** I don't lose my game progress

**Acceptance Criteria**:
- [ ] WebSocket detects disconnect within 5 seconds
- [ ] Shows "connection lost, reconnecting..." banner
- [ ] Auto-reconnects within 10 seconds
- [ ] Restores player to same room and story state
- [ ] Catches up on missed contributions (syncs story)
- [ ] If can't reconnect after 30 seconds, show manual refresh option
- [ ] Player marked as inactive during disconnect (others see)
- [ ] Player marked as active upon reconnect

**Test Cases**:
1. Disable WiFi mid-game → See "connection lost" banner
2. Re-enable WiFi → Auto-reconnects within 10s
3. Sync missed contributions → Story up to date
4. Can continue playing normally
5. Connection lost for >30s → "Refresh to reconnect" button appears

---

### Story 6.2: Room Expired

**As a** player trying to rejoin an old room
**I want to** see a clear message
**So that** I understand why I can't join

**Acceptance Criteria**:
- [ ] Rooms expire after 24 hours
- [ ] Expired room link shows "this room expired" page
- [ ] Page explains rooms last 24 hours
- [ ] "Create New Room" CTA on expired page
- [ ] Expired rooms don't appear in any lists
- [ ] Expired room data is archived (not deleted immediately)

**Test Cases**:
1. Create room, wait 24h → Room expires
2. Try to join expired room link → See expired message
3. Click "Create New Room" → New room created
4. Database cleanup runs → Old expired rooms archived

---

### Story 6.3: Rate Limiting

**As a** system preventing abuse
**I want to** rate limit excessive requests
**So that** the service stays available for everyone

**Acceptance Criteria**:
- [ ] Limit: 10 room creations per hour per IP
- [ ] Limit: 60 contributions per hour per player
- [ ] When limit hit, show clear message
- [ ] Message includes time until reset
- [ ] Rate limit doesn't affect legitimate use
- [ ] Premium users have higher limits (or no limits)

**Test Cases**:
1. Create 11 rooms in 1 hour → 11th shows rate limit error
2. Write 61 contributions in 1 hour → 61st shows rate limit
3. Wait 1 hour → Can create rooms again
4. Premium user → No rate limit applied

---

## Story Priority Matrix

### Must Have (MVP Blockers)
- [x] Story 1.2: Create New Room
- [x] Story 1.3: Share Room Link
- [x] Story 2.1: Join Room via Link
- [x] Story 2.2: Waiting Room
- [x] Story 3.1: Player Turn
- [x] Story 3.2: Waiting for Turn
- [x] Story 3.3: AI Contribution
- [x] Story 3.4: Real-Time Collaboration
- [x] Story 4.1: Ending the Story
- [x] Story 4.2: Story Recap

### Should Have (Important but not blockers)
- [ ] Story 1.1: First-Time Visitor Landing
- [ ] Story 4.3: Share Story
- [ ] Story 6.1: Connection Lost
- [ ] Story 6.2: Room Expired

### Nice to Have (Post-MVP)
- [ ] Story 5.1: Upgrade to Premium
- [ ] Story 6.3: Rate Limiting (basic version for MVP)

---

## Testing Checklist

### Manual Test Scenarios

**Happy Path**:
1. ✅ Create room → Join with friend → Play game → AI contributes → Complete story → Share
2. ✅ Mobile: Full game flow on iPhone Safari
3. ✅ 6 players: Full room playing simultaneously

**Error Paths**:
1. ✅ Create room with invalid nickname → See error
2. ✅ Join full room → See "room full" error
3. ✅ Connection drops mid-game → Auto-reconnects
4. ✅ AI API fails → Game continues without AI turn
5. ✅ Room expires → Clear message shown

**Edge Cases**:
1. ✅ Only 1 player in room → Can't start game
2. ✅ Player leaves mid-turn → Turn skips to next player
3. ✅ Spam submit button → No duplicate contributions
4. ✅ Very long contribution (500 chars) → Displays correctly
5. ✅ Special characters in nickname → Sanitized properly

---

## Acceptance Criteria Summary

For MVP to be considered complete:

**Functional**:
- ✅ User can create a room in <60 seconds
- ✅ 2-6 players can join and play simultaneously
- ✅ Players can write contributions (10-500 chars)
- ✅ AI contributes every 2-3 turns with relevant responses
- ✅ Story displays in real-time for all players
- ✅ Game can be completed and recap shown
- ✅ No critical bugs in core flow

**Performance**:
- ✅ Page load <3s on 3G
- ✅ WebSocket latency <100ms
- ✅ AI response time <5s
- ✅ Can handle 10 concurrent rooms (50 players)

**Quality**:
- ✅ Works on Chrome, Safari, Firefox
- ✅ Mobile-responsive (works on phones)
- ✅ No console errors in happy path
- ✅ Error messages are clear and actionable

**User Experience**:
- ✅ 60%+ of users complete their first game
- ✅ 40%+ return to play again
- ✅ Qualitative feedback is positive ("this is fun!")

---

## Definition of Done

A user story is "Done" when:

1. ✅ All acceptance criteria met
2. ✅ Code reviewed and merged
3. ✅ Tested on Chrome + Safari + Firefox
4. ✅ Tested on mobile (iOS Safari, Android Chrome)
5. ✅ No console errors
6. ✅ Deployed to production
7. ✅ Smoke tested in production
8. ✅ Product owner approved (plays the game and it works)

---

## User Feedback Integration

After launch, continuously validate these stories with real user data:

**Metrics to Watch**:
- Time to first game (should be <2 minutes)
- Completion rate (target: >60%)
- Return rate (target: >40%)
- AI satisfaction (qualitative feedback)
- Error rate (target: <5%)

**Iterate Based On**:
- User feedback in Discord
- Analytics funnels (where do users drop off?)
- Support tickets (what confuses people?)
- Session recordings (how do people actually use it?)

---

These user stories ensure we build exactly what users need - nothing more, nothing less. The focus is on delivering a delightful core experience that makes people laugh and want to play again. 🎲✨
