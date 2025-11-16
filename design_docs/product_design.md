# Plot Twist - Product Design

## Brand Personality

### Brand Archetype: **The Jester** (with a touch of The Rebel)

We're the friend who makes everything more fun, who turns awkward silences into inside jokes, who reminds you that being weird is better than being boring.

### Voice & Tone

**Casual AF** - We talk like your group chat, not a corporate memo
- ✅ "let's make some chaos"
- ❌ "Let us facilitate your creative storytelling experience"

**No Gatekeeping** - Everyone's invited, no skill required
- ✅ "you can't be bad at this, that's the whole point"
- ❌ "Develop your narrative skills"

**Self-Aware** - We know this is ridiculous
- ✅ "yeah the AI is unhinged, that's why you're here"
- ❌ "Our sophisticated AI technology"

**Encouraging Chaos** - We celebrate the mess
- ✅ "fernando the horse is now the main character and we love that for him"
- ❌ "Please stay on topic"

### Emotional Goals

**We want users to feel:**
1. **Instant Belonging** - "I can do this"
2. **Permission to Be Weird** - "The weirder, the better"
3. **Laughter** - Genuine, unexpected, shared
4. **Excitement** - "I can't wait to see what happens next"
5. **Connection** - "This is an inside joke with my friends now"

**We DON'T want users to feel:**
- Judged for their writing
- Pressured to be clever
- Confused about what to do
- Like they're doing it wrong

---

## Visual Design System

### Core Design Tokens

```css
/* Core Design Tokens */
:root {
  /* Brand Colors - Vibrant, playful, slightly chaotic */
  --brand-primary: #8B5CF6;      /* Purple - main actions, AI */
  --brand-secondary: #F59E0B;    /* Amber - highlights, accents */
  --brand-accent: #EC4899;       /* Pink - special moments, premium */
  
  /* Player Colors - Each player gets a vibrant color */
  --player-1: #EF4444;   /* Red */
  --player-2: #3B82F6;   /* Blue */
  --player-3: #10B981;   /* Green */
  --player-4: #F59E0B;   /* Amber */
  --player-5: #8B5CF6;   /* Purple */
  --player-6: #EC4899;   /* Pink */
  --player-7: #14B8A6;   /* Teal */
  --player-8: #F97316;   /* Orange */
  
  /* AI Color */
  --ai-color: #8B5CF6;   /* Purple gradient overlay */
  
  /* Semantic Colors */
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
  --color-info: #3B82F6;
  
  /* Neutral Palette - Dark mode first (Gen Z prefers dark) */
  --gray-50: #FAFAFA;
  --gray-100: #F4F4F5;
  --gray-200: #E4E4E7;
  --gray-300: #D4D4D8;
  --gray-400: #A1A1AA;
  --gray-500: #71717A;
  --gray-600: #52525B;
  --gray-700: #3F3F46;
  --gray-800: #27272A;
  --gray-900: #18181B;
  --gray-950: #09090B;
  
  /* Background Colors */
  --bg-primary: #09090B;      /* Main background */
  --bg-secondary: #18181B;    /* Cards, panels */
  --bg-tertiary: #27272A;     /* Hover states */
  --bg-input: #18181B;        /* Form inputs */
  
  /* Text Colors */
  --text-primary: #FAFAFA;
  --text-secondary: #A1A1AA;
  --text-tertiary: #71717A;
  --text-inverse: #09090B;
  
  /* Border Colors */
  --border-primary: #27272A;
  --border-secondary: #3F3F46;
  --border-focus: #8B5CF6;
  
  /* Typography */
  --font-display: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
  
  /* Type Scale */
  --text-xs: 0.75rem;      /* 12px */
  --text-sm: 0.875rem;     /* 14px */
  --text-base: 1rem;       /* 16px */
  --text-lg: 1.125rem;     /* 18px */
  --text-xl: 1.25rem;      /* 20px */
  --text-2xl: 1.5rem;      /* 24px */
  --text-3xl: 1.875rem;    /* 30px */
  --text-4xl: 2.25rem;     /* 36px */
  --text-5xl: 3rem;        /* 48px */
  
  /* Font Weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  
  /* Line Heights */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;
  
  /* Spacing Scale */
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  
  /* Layout */
  --radius-sm: 0.375rem;   /* 6px - subtle roundness */
  --radius-md: 0.5rem;     /* 8px - default */
  --radius-lg: 0.75rem;    /* 12px - cards */
  --radius-xl: 1rem;       /* 16px - modals */
  --radius-full: 9999px;   /* Fully rounded */
  
  /* Shadows - Subtle, modern */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.15);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.2);
  
  /* Glow effects for AI */
  --glow-purple: 0 0 20px rgba(139, 92, 246, 0.4);
  --glow-pink: 0 0 20px rgba(236, 72, 153, 0.4);
  
  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 200ms ease;
  --transition-slow: 300ms ease;
  
  /* Z-index Scale */
  --z-base: 1;
  --z-dropdown: 10;
  --z-sticky: 100;
  --z-modal: 1000;
  --z-toast: 10000;
}
```

### Design Philosophy

**1. Dark Mode First**
- Gen Z prefers dark mode (80%+ usage)
- Better for late-night gaming sessions
- Makes colors pop more
- Light mode available but not the default

**2. High Contrast**
- Easy to read in any lighting
- Clear visual hierarchy
- Accessibility-first approach

**3. Playful Without Being Childish**
- Rounded corners but not too round
- Vibrant colors but not neon
- Fun animations but not distracting

**4. Mobile-First, Always**
- Touch targets min 44px
- Readable at arm's length
- Thumb-friendly layouts
- Fast, lightweight

---

## Component Patterns

### Primary Button (Filled)

```css
.btn-primary {
  background: linear-gradient(135deg, var(--brand-primary), var(--brand-accent));
  color: var(--text-inverse);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
  font-weight: var(--font-semibold);
  font-size: var(--text-base);
  border: none;
  cursor: pointer;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
  box-shadow: var(--shadow-md);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}
```

**Usage**:
- Main CTAs: "Create Room", "Join Game", "Send"
- Destructive actions: "End Game"

---

### Secondary Button (Outlined)

```css
.btn-secondary {
  background: transparent;
  color: var(--brand-primary);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
  font-weight: var(--font-semibold);
  font-size: var(--text-base);
  border: 2px solid var(--brand-primary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-secondary:hover {
  background: var(--brand-primary);
  color: var(--text-inverse);
}
```

**Usage**:
- Secondary actions: "Cancel", "Settings", "Skip"
- Alternative options

---

### Form Inputs

```css
/* Default State */
.input {
  background: var(--bg-input);
  color: var(--text-primary);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  border: 2px solid var(--border-primary);
  font-size: var(--text-base);
  transition: all var(--transition-fast);
  width: 100%;
}

/* Focus State */
.input:focus {
  outline: none;
  border-color: var(--border-focus);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

/* Error State */
.input.error {
  border-color: var(--color-error);
}

.input.error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

/* Disabled State */
.input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

**Text Area** (for story contributions):
```css
.textarea {
  /* Same as .input */
  min-height: 100px;
  resize: vertical;
  font-family: var(--font-body);
  line-height: var(--leading-relaxed);
}
```

---

### Card Layouts

```css
.card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base);
}

.card:hover {
  border-color: var(--border-secondary);
  box-shadow: var(--shadow-lg);
}

/* Player Card - shows who's in the room */
.player-card {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  border-left: 4px solid var(--player-color); /* Dynamic based on player */
}

/* Story Contribution Card */
.contribution-card {
  background: var(--bg-secondary);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  border-left: 4px solid var(--player-color);
  margin-bottom: var(--space-4);
  animation: slideIn 300ms ease-out;
}

.contribution-card.ai {
  border-left: 4px solid var(--ai-color);
  background: linear-gradient(135deg, 
    rgba(139, 92, 246, 0.1), 
    rgba(236, 72, 153, 0.05)
  );
  box-shadow: var(--glow-purple);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

### Navigation Patterns

```css
/* Top Nav */
.nav {
  position: sticky;
  top: 0;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-primary);
  padding: var(--space-4) var(--space-6);
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: var(--z-sticky);
  backdrop-filter: blur(10px);
}

.logo {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  background: linear-gradient(135deg, var(--brand-primary), var(--brand-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

---

### Empty States

```css
.empty-state {
  text-align: center;
  padding: var(--space-16) var(--space-8);
  color: var(--text-secondary);
}

.empty-state-icon {
  font-size: var(--text-5xl);
  margin-bottom: var(--space-4);
  opacity: 0.3;
}

.empty-state-title {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: var(--space-2);
}

.empty-state-description {
  font-size: var(--text-base);
  color: var(--text-secondary);
  margin-bottom: var(--space-6);
}
```

**Example**:
```html
<div class="empty-state">
  <div class="empty-state-icon">📝</div>
  <h3 class="empty-state-title">no one's said anything yet</h3>
  <p class="empty-state-description">be the brave one. start the chaos.</p>
  <button class="btn-primary">Write First Sentence</button>
</div>
```

---

### Loading States

```css
/* Spinner */
.spinner {
  border: 3px solid var(--border-primary);
  border-top-color: var(--brand-primary);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* AI Thinking Animation */
.ai-thinking {
  display: inline-flex;
  gap: var(--space-2);
}

.ai-thinking-dot {
  width: 8px;
  height: 8px;
  background: var(--brand-primary);
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}

.ai-thinking-dot:nth-child(1) { animation-delay: -0.32s; }
.ai-thinking-dot:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}
```

---

### Error Messages

```css
.error-message {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid var(--color-error);
  border-radius: var(--radius-md);
  color: var(--color-error);
  font-size: var(--text-sm);
}

.success-message {
  /* Same structure */
  background: rgba(16, 185, 129, 0.1);
  border-color: var(--color-success);
  color: var(--color-success);
}
```

**Copy Guidelines**:
- ❌ "An error occurred"
- ✅ "couldn't connect to the room. try refreshing?"

- ❌ "Invalid input"
- ✅ "nickname too long (keep it under 20 characters)"

---

### Toast Notifications

```css
.toast {
  position: fixed;
  bottom: var(--space-6);
  right: var(--space-6);
  background: var(--bg-secondary);
  border: 1px solid var(--border-secondary);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  box-shadow: var(--shadow-xl);
  z-index: var(--z-toast);
  animation: slideUp 300ms ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## Key User Flows

### Flow 1: Onboarding (Signup → Setup → First Value)

**Goal**: Get user into their first game in <60 seconds

```
Landing Page
├─ Hero: "turn your friends into comedy writers"
├─ CTA: "Create Room" (big, obvious)
└─ Secondary: "How It Works" (3 bullet points)
         ↓
Create Room Modal
├─ "pick a nickname" (20 char limit)
├─ Optional: Select game mode dropdown
│   ├─ Freeform (default)
│   └─ Themed (5 options)
├─ CTA: "Create Room"
└─ Copy: "your friends can join with a link"
         ↓
Room Created
├─ "nice! now invite your friends"
├─ Share link (big, copyable)
├─ QR code (for in-person)
├─ Waiting state: "waiting for players..."
└─ Player list (shows as they join)
         ↓
Game Starts (2+ players)
├─ "alright let's do this"
├─ Starting prompt (if themed)
├─ Turn indicator: "(your name), you're up first"
└─ Input box: "write 1-3 sentences to start the story"
         ↓
First Contribution
├─ See your text appear in story
├─ Next player's turn
└─ AI: "ok i'm about to make this interesting..."
         ↓
AI Contributes
├─ Purple glow animation
├─ AI text appears
└─ Hook: "wait what just happened"
         ↓
First Value Delivered ✨
└─ User is laughing, wants to keep playing
```

**Design Notes**:
- **No account required** for first game
- **Progressive disclosure**: Don't show advanced options
- **Immediate feedback**: Show changes instantly
- **Social proof**: "Josh joined!" notifications

---

### Flow 2: Core Action (Playing the Game)

**Goal**: Smooth, addictive loop

```
Your Turn
├─ Notification: "(your name)'s turn!"
├─ Input focus automatically
├─ Character counter: "2/500"
└─ Timer (optional): Subtle countdown
         ↓
Writing
├─ See others typing indicator: "emma is typing..."
├─ Preview of your text
└─ Submit button becomes prominent when >10 chars
         ↓
Submit
├─ Instant feedback: "sent!"
├─ Your contribution appears
├─ Smooth scroll to your text
└─ Next turn starts
         ↓
Waiting
├─ See story grow in real-time
├─ React with emoji (optional)
└─ AI turn indicator: "AI is cooking something up..."
         ↓
AI Turn
├─ Purple glow builds
├─ Typing animation
├─ AI text reveals word-by-word (for drama)
└─ Reaction: Everyone sees it at once
         ↓
Loop Continues
└─ Repeat until story ends naturally or time limit
```

**Interaction Patterns**:
- **Auto-scroll**: Always show latest contribution
- **Typing indicators**: See who's writing
- **Emoji reactions**: Quick way to respond
- **Easy exit**: Leave button always visible

---

### Flow 3: Settings & Room Management

```
Room Settings (Host Only)
├─ Kick player (if needed)
├─ End game
├─ Change AI frequency
│   ├─ Low (every 4-5 turns)
│   ├─ Medium (every 2-3 turns) ← default
│   └─ High (every 1-2 turns)
└─ Export story (premium)
```

---

## Responsive Design Strategy

### Mobile First (640px and below)

**Priority**: Single column, thumb-friendly

```
Layout:
├─ Story: Full width, vertical scroll
├─ Player list: Horizontal scroll at top
├─ Input: Fixed at bottom (like messaging app)
└─ Nav: Hamburger menu
```

**Touch Targets**:
- Min 44px height
- Adequate spacing (12px minimum)
- Swipe gestures:
  - Swipe up on input = expand to full screen
  - Pull to refresh = check for new players

---

### Tablet (768px - 1023px)

```
Layout:
├─ Story: 70% width, centered
├─ Player list: Sidebar (30%)
└─ Input: Bottom, full width
```

---

### Desktop (1024px+)

```
Layout:
├─ Story: Center column (max 800px)
├─ Player list: Right sidebar (250px)
├─ Room info: Left sidebar (optional)
└─ Input: Bottom of story column
```

**Keyboard Shortcuts**:
- Enter = Submit
- Esc = Clear input
- Ctrl+/ = Show shortcuts

---

## Animation Principles

### When to Animate

✅ **DO animate**:
- New contributions appearing
- AI thinking → response
- Players joining/leaving
- State changes (turn indicator)
- Success/error messages

❌ **DON'T animate**:
- Page loads (too slow)
- Every hover state (distracting)
- Scrolling (jarring)

### Animation Guidelines

**Fast**: 150-200ms
- Button hovers
- Focus states

**Medium**: 300ms
- Card appears
- Modal opens

**Slow**: 500ms+
- AI dramatic reveals
- Page transitions

**Easing**: Use `ease-out` for most (feels snappy)

---

## Accessibility

### Keyboard Navigation
- Tab through all interactive elements
- Focus visible indicators
- Esc to close modals

### Screen Readers
- Semantic HTML
- ARIA labels where needed
- Live regions for story updates

### Color Contrast
- Text: Minimum 4.5:1 contrast
- Buttons: 3:1 contrast
- Never rely on color alone

### Motion
- Respect `prefers-reduced-motion`
- Provide option to disable animations

---

## Copy & Microcopy Guidelines

### Tone Examples

**Loading States**:
- ❌ "Processing your request"
- ✅ "cooking up some chaos..."

**Empty States**:
- ❌ "No content available"
- ✅ "nothing here yet. be the first!"

**Errors**:
- ❌ "Connection failed"
- ✅ "lost connection. refresh?"

**Success**:
- ❌ "Action completed successfully"
- ✅ "nice! ✨"

**Buttons**:
- ❌ "Submit Form"
- ✅ "let's go"

**Prompts**:
- ❌ "Please enter your contribution"
- ✅ "what happens next?"

### Writing Rules

1. **Lowercase default** (except proper nouns, start of sentences)
2. **Short & punchy** (aim for <8 words)
3. **Active voice** ("write" not "please write")
4. **Assume competence** (don't over-explain)
5. **Use "you"** (direct, personal)
6. **Avoid jargon** (unless it's funny)

---

## Brand Applications

### Logo Usage
```
Plot Twist
```
- Wordmark only (no icon)
- Always with gradient
- Never stretched or rotated

### Social Media Assets
- **Preview cards**: Dark bg, gradient text, example story snippet
- **Profile icons**: Simple PT monogram with gradient

### Marketing Angles
- "Tinder for stories" (quick, chaotic, addictive)
- "Jackbox but infinite"
- "Your group chat but a game"
- "You can't be bad at this"

---

## Design System Implementation Notes

### Using Tailwind CSS

Map design tokens to Tailwind config:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#8B5CF6',
          secondary: '#F59E0B',
          accent: '#EC4899',
        },
        player: {
          1: '#EF4444',
          2: '#3B82F6',
          // ... etc
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    }
  }
}
```

### Component Library

Build with **Radix UI + Tailwind**:
- Accessible by default
- Unstyled primitives
- Easy to customize

**Core components to build**:
1. Button (primary, secondary, ghost)
2. Input / TextArea
3. Card
4. Modal / Dialog
5. Toast
6. Avatar (for players)
7. Badge (for status)

---

## Future Design Considerations

**V1.1**:
- Story illustrations (AI-generated thumbnails)
- Custom room themes (backgrounds, colors)
- Achievement badges

**V2.0**:
- Video chat integration
- Animated reactions
- Story replays with "cinematics"

But for MVP: **Keep it simple, keep it fast, keep it fun.**
