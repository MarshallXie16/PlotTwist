import Anthropic from '@anthropic-ai/sdk';

/**
 * AI Client Configuration
 */
export interface AIClientConfig {
  apiKey?: string;
  useMock?: boolean;
  mockDelay?: number;
}

/**
 * Message Request
 */
export interface MessageRequest {
  system?: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  maxTokens?: number;
  temperature?: number;
}

/**
 * Message Response
 */
export interface MessageResponse {
  content: string;
  stopReason: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
  };
}

/**
 * Mock responses for testing (funny twist examples)
 */
const MOCK_RESPONSES = [
  // Environmental twists
  "Suddenly, gravity reversed itself, but only for objects that start with the letter 'P'. Pizza slices, pencils, and particularly surprised pigeons began floating toward the ceiling.",

  "At that exact moment, all the furniture in the room developed strong opinions about interior design and started rearranging itself while passive-aggressively judging everyone's decorating choices.",

  "Without warning, the room filled with a thick fog that smelled suspiciously like grandma's perfume mixed with old cheese. The fog also narrated everything happening in a sports commentator voice.",

  // Character-based twists
  "Plot twist: The protagonist was actually three raccoons in a trench coat the entire time. The raccoons are now arguing about who gets to control the left arm.",

  "Just then, everyone's inner monologue became audible to everyone else, but translated through Google Translate five times and spoken by a confused parrot.",

  "A time traveler from 10 minutes in the future burst through the door, out of breath, just to say 'Whatever you're about to do, do it, it's hilarious' before disappearing again.",

  // Genre shifts
  "The lights dimmed and a spotlight appeared from nowhere. The situation had inexplicably become a musical number. Everyone knew all the words and choreography but had no idea why.",

  "Reality glitched like a video game, and suddenly everyone had health bars floating above their heads. Someone's anxiety was dealing critical damage.",

  // Absurdist twists
  "A government official in a suit appeared holding a clipboard. 'Excuse me, do you have a permit for this narrative?' They started writing citations for unlicensed plot development.",

  "The universe's autocorrect feature activated, changing one random word in everything everyone said to 'banana.' Communication became simultaneously important and banana.",

  "Someone sneezed, and due to a rare atmospheric condition, the sneeze achieved sentience and started apologizing profusely for existing.",

  "The fourth wall cracked like glass, and the characters could suddenly see the audience/readers. They started taking suggestions and seemed really self-conscious about it.",

  // Meta and weird
  "A wild narrator appeared! But this narrator was clearly reading the wrong script and started describing a completely different story about competitive yogurt tasting.",

  "Time started running backwards, but only for embarrassing moments. Everyone had to relive their most cringe-worthy experiences in reverse while moving forward normally.",

  "An interdimensional customer service representative materialized. 'Hi, you've reached Universe Support. Your reality is experiencing technical difficulties. Have you tried turning it off and on again?'",
];

/**
 * Get a random mock response
 */
function getRandomMockResponse(): string {
  return MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
}

/**
 * AI Client for interacting with Claude API
 */
export class AIClient {
  private client: Anthropic | null = null;
  private useMock: boolean;
  private mockDelay: number;

  constructor(config: AIClientConfig = {}) {
    this.useMock = config.useMock ?? !config.apiKey;
    this.mockDelay = config.mockDelay ?? 1000;

    if (!this.useMock) {
      const apiKey = config.apiKey || process.env.ANTHROPIC_API_KEY;
      if (!apiKey) {
        throw new Error('ANTHROPIC_API_KEY is required when not using mock mode');
      }
      this.client = new Anthropic({ apiKey });
    }
  }

  /**
   * Send a message to Claude and get a response
   */
  async sendMessage(request: MessageRequest): Promise<MessageResponse> {
    // Use mock in test/development mode
    if (this.useMock) {
      return this.mockSendMessage(request);
    }

    // Real API call
    if (!this.client) {
      throw new Error('AI client not initialized');
    }

    const response = await this.client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: request.maxTokens || 300,
      temperature: request.temperature || 1.0,
      system: request.system,
      messages: request.messages,
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude API');
    }

    return {
      content: content.text,
      stopReason: response.stop_reason || 'end_turn',
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
      },
    };
  }

  /**
   * Mock implementation for testing
   */
  private async mockSendMessage(request: MessageRequest): Promise<MessageResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, this.mockDelay));

    // Get random mock response
    const content = getRandomMockResponse();

    console.log('[AI Client] Mock response generated');
    console.log('[AI Client] System:', request.system?.substring(0, 100) + '...');
    console.log('[AI Client] User:', request.messages[request.messages.length - 1]?.content.substring(0, 100) + '...');
    console.log('[AI Client] Response:', content.substring(0, 100) + '...');

    return {
      content,
      stopReason: 'end_turn',
      usage: {
        inputTokens: 150,
        outputTokens: 100,
      },
    };
  }

  /**
   * Check if client is in mock mode
   */
  isMockMode(): boolean {
    return this.useMock;
  }
}

/**
 * Singleton instance
 */
let aiClientInstance: AIClient | null = null;

/**
 * Get or create AI client instance
 */
export function getAIClient(config?: AIClientConfig): AIClient {
  if (!aiClientInstance) {
    aiClientInstance = new AIClient(config);
  }
  return aiClientInstance;
}

/**
 * Reset AI client (useful for testing)
 */
export function resetAIClient(): void {
  aiClientInstance = null;
}
