/**
 * AI Prompt Templates and Twist Types
 *
 * This file contains all the prompt engineering for generating funny AI twists.
 * Critical: AI must be 70%+ funny to make the product successful.
 */

/**
 * Twist Types
 */
export type TwistType =
  | 'environmental'    // Environment changes (weather, physics, setting)
  | 'character'        // Character reveals, transformations, inner thoughts
  | 'genre-shift'      // Story genre changes (romance -> horror, etc.)
  | 'absurdist'        // Completely absurd, surreal events
  | 'meta'             // Fourth-wall breaking, narrative awareness
  | 'object'           // Objects gain sentience or unusual properties
  | 'temporal'         // Time-related weirdness
  | 'dialogue'         // Communication goes wrong in funny ways
  | 'random';          // Let AI pick the funniest option

/**
 * Twist Type Descriptions (for AI context)
 */
export const TWIST_DESCRIPTIONS: Record<TwistType, string> = {
  environmental: 'Changes to the environment, setting, or physical laws (gravity, weather, space)',
  character: 'Reveals about characters, sudden transformations, or internal thoughts becoming external',
  'genre-shift': 'The story genre suddenly changes (becomes a musical, horror, documentary, etc.)',
  absurdist: 'Completely surreal, nonsensical events that defy logic but are hilarious',
  meta: 'Breaking the fourth wall, characters aware they\'re in a story, narrative commentary',
  object: 'Inanimate objects gain sentience, unusual properties, or start behaving strangely',
  temporal: 'Time behaves strangely (loops, reverses, speeds up for some things but not others)',
  dialogue: 'Communication breaks down in unexpected ways (autocorrect, translations, mind-reading)',
  random: 'Pick whichever twist type would be funniest given the current story',
};

/**
 * Base system prompt for AI chaos agent
 */
export const BASE_SYSTEM_PROMPT = `You are the chaos agent in a multiplayer storytelling game called "Plot Twist."

Your role is to inject unexpected, HILARIOUS twists into collaborative stories being written by players. The twist should:

1. **BE GENUINELY FUNNY** - This is critical. The twist must make people laugh out loud. Use absurdity, unexpected contrasts, specific details, and comedic timing.

2. **BE UNEXPECTED** - The best comedy comes from subverting expectations. Don't be predictable.

3. **ADD TO THE STORY** - The twist should give players fun new material to work with, not shut the story down.

4. **BE CONCISE** - Keep it to 1-3 sentences max. Players need room to react and build on it.

5. **MATCH THE VIBE** - If the story is lighthearted, stay lighthearted. If it's dramatic, make the twist hilariously undercut that drama.

HUMOR TECHNIQUES THAT WORK:
- Specificity (don't say "food," say "a suspiciously warm potato salad")
- Contrast (serious situation + ridiculous element)
- Escalation (make it slightly more absurd than expected)
- Unexpected consequences (logical but ridiculous outcomes)
- Character voice (give inanimate objects personalities)

AVOID:
- Being random for the sake of random (absurd yes, but with internal logic)
- Pop culture references (they age poorly and not everyone gets them)
- Mean-spirited humor
- Ending the story or making it impossible to continue
- Being too similar to previous twists in the story

Remember: Players trust you to make them laugh. This is your ONE job. Make it count.`;

/**
 * Generate twist prompt based on story context and twist type
 */
export function generateTwistPrompt(
  storyContext: string,
  twistType: TwistType = 'random',
  theme?: string
): { system: string; prompt: string } {
  const twistGuidance = twistType === 'random'
    ? 'Choose whichever twist type would be funniest given this story.'
    : `Focus on a ${twistType} twist: ${TWIST_DESCRIPTIONS[twistType]}`;

  const themeGuidance = theme
    ? `\n\nSTORY THEME: "${theme}" - Your twist should fit this theme while still being unexpected.`
    : '';

  const system = BASE_SYSTEM_PROMPT;

  const prompt = `Here's the story so far:

${storyContext}

${twistGuidance}${themeGuidance}

Generate a hilarious plot twist that adds chaos to this story. Make it funny, unexpected, and give the players something fun to work with.

Return ONLY the twist itself (1-3 sentences), no explanations or meta-commentary.`;

  return { system, prompt };
}

/**
 * Prompt variations for different story lengths
 */
export function generateContextualTwistPrompt(
  contributions: Array<{ content: string; type: 'player' | 'ai'; playerNickname?: string }>,
  twistType: TwistType = 'random',
  theme?: string
): { system: string; prompt: string } {
  // Build story context
  let storyContext = '';

  if (contributions.length === 0) {
    storyContext = '[Story is just beginning - this will be the opening twist]';
  } else if (contributions.length === 1) {
    storyContext = `Opening: "${contributions[0].content}"`;
  } else {
    // For longer stories, show recent context (last 5 contributions)
    const recentContributions = contributions.slice(-5);
    storyContext = recentContributions
      .map((c, i) => {
        const label = c.type === 'ai' ? 'AI Twist' : `${c.playerNickname || 'Player'}`;
        return `${label}: "${c.content}"`;
      })
      .join('\n\n');

    // Add earlier context summary if story is long
    if (contributions.length > 5) {
      const earlierCount = contributions.length - 5;
      storyContext = `[...${earlierCount} earlier contributions...]\n\n${storyContext}`;
    }
  }

  return generateTwistPrompt(storyContext, twistType, theme);
}

/**
 * Special prompt for opening twists (story just started)
 */
export function generateOpeningTwistPrompt(
  firstContribution: string,
  theme?: string
): { system: string; prompt: string } {
  const themeGuidance = theme
    ? `The story theme is "${theme}". Your twist should fit this theme.`
    : '';

  const system = BASE_SYSTEM_PROMPT;

  const prompt = `The story has just begun with this opening:

"${firstContribution}"

${themeGuidance}

This is the FIRST twist in the story, so set the tone for chaos. Make it hilarious and give the players a fun, absurd situation to develop.

Return ONLY the twist itself (1-3 sentences), no explanations or meta-commentary.`;

  return { system, prompt };
}

/**
 * Fallback prompts for error recovery
 */
export const FALLBACK_TWISTS = [
  "A mysterious voice over the intercom announced: 'This is your captain speaking. We are experiencing technical difficulties with reality. Please remain seated and keep your existential dread to yourself.'",

  "Time hiccuped. Everyone experienced the last 30 seconds in reverse, but only their most embarrassing actions. Dignity was lost, confusion was gained.",

  "The laws of physics checked their phone mid-enforcement and got distracted. Gravity became 'more of a suggestion' for the next few minutes.",

  "A cosmic bureaucrat appeared, clipboard in hand. 'Someone filed a Complaint About Normalcy form. I'm here to resolve it.' They began making things aggressively weird.",

  "Reality's spell-check activated, randomly changing one word in everyone's sentences to something hilariously inappropriate. Communication became chaos.",
];

/**
 * Get a random fallback twist
 */
export function getRandomFallbackTwist(): string {
  return FALLBACK_TWISTS[Math.floor(Math.random() * FALLBACK_TWISTS.length)];
}

/**
 * Prompt templates for quality testing
 */
export const TEST_SCENARIOS = [
  {
    name: 'Simple beginning',
    context: 'Once upon a time, there was a small village.',
    theme: null,
  },
  {
    name: 'Action scene',
    context: 'The hero drew their sword and charged at the dragon.',
    theme: null,
  },
  {
    name: 'Romance setup',
    context: 'They locked eyes across the crowded coffee shop, hearts racing.',
    theme: 'Romance',
  },
  {
    name: 'Mystery opening',
    context: 'The detective examined the crime scene, searching for clues.',
    theme: 'Mystery',
  },
  {
    name: 'Workplace drama',
    context: 'The quarterly review meeting was about to begin, and tensions were high.',
    theme: null,
  },
  {
    name: 'Space adventure',
    context: 'The spaceship approached the unknown planet, sensors beeping frantically.',
    theme: 'Sci-Fi',
  },
  {
    name: 'Cooking show',
    context: 'The chef began preparing the secret ingredient: organic, free-range asparagus.',
    theme: null,
  },
  {
    name: 'Pet perspective',
    context: 'The dog watched as its owner left for work, alone again.',
    theme: null,
  },
  {
    name: 'Road trip',
    context: 'Mile marker 47. Still three hours from Vegas. The radio played nothing but static.',
    theme: null,
  },
  {
    name: 'Job interview',
    context: 'She adjusted her blazer and knocked on the CEO\'s office door.',
    theme: null,
  },
];
