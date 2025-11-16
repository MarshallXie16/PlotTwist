import { getAIClient } from './ai-client';
import {
  generateContextualTwistPrompt,
  generateOpeningTwistPrompt,
  getRandomFallbackTwist,
  type TwistType,
} from './ai-prompts';
import type { ContributionWithPlayer } from './types';

/**
 * AI Service Configuration
 */
export interface AIServiceConfig {
  useMock?: boolean;
  mockDelay?: number;
  maxRetries?: number;
}

/**
 * Twist Generation Request
 */
export interface GenerateTwistRequest {
  contributions: ContributionWithPlayer[];
  twistType?: TwistType;
  theme?: string;
}

/**
 * Twist Generation Response
 */
export interface GenerateTwistResponse {
  twist: string;
  twistType: TwistType;
  usedFallback: boolean;
  metadata: {
    responseTime: number;
    tokenUsage?: {
      input: number;
      output: number;
    };
    retryCount: number;
  };
}

/**
 * AI Service for generating plot twists
 */
export class AIService {
  private config: AIServiceConfig;

  constructor(config: AIServiceConfig = {}) {
    this.config = {
      useMock: config.useMock ?? true,
      mockDelay: config.mockDelay ?? 1000,
      maxRetries: config.maxRetries ?? 3,
    };
  }

  /**
   * Generate a plot twist based on story context
   */
  async generateTwist(request: GenerateTwistRequest): Promise<GenerateTwistResponse> {
    const startTime = Date.now();
    let retryCount = 0;
    let usedFallback = false;

    try {
      // Get AI client
      const client = getAIClient({
        useMock: this.config.useMock,
        mockDelay: this.config.mockDelay,
      });

      // Generate prompt based on story length
      const { system, prompt } = this.buildPrompt(request);

      // Try to get AI response with retries
      let twist: string | null = null;
      let tokenUsage: { input: number; output: number } | undefined;

      while (retryCount < (this.config.maxRetries || 3) && !twist) {
        try {
          const response = await client.sendMessage({
            system,
            messages: [{ role: 'user', content: prompt }],
            maxTokens: 300,
            temperature: 1.0, // High temperature for creative, varied responses
          });

          twist = response.content.trim();
          tokenUsage = {
            input: response.usage.inputTokens,
            output: response.usage.outputTokens,
          };

          // Validate twist quality
          if (!this.isValidTwist(twist)) {
            console.warn('[AI Service] Generated twist failed validation, retrying...');
            twist = null;
            retryCount++;
            continue;
          }
        } catch (error) {
          retryCount++;
          console.error(`[AI Service] Error generating twist (attempt ${retryCount}):`, error);

          if (retryCount >= (this.config.maxRetries || 3)) {
            throw error;
          }

          // Wait before retry (exponential backoff)
          await new Promise((resolve) => setTimeout(resolve, 1000 * retryCount));
        }
      }

      // If we still don't have a twist, use fallback
      if (!twist) {
        twist = getRandomFallbackTwist();
        usedFallback = true;
        console.warn('[AI Service] Using fallback twist after retries exhausted');
      }

      const responseTime = Date.now() - startTime;

      return {
        twist,
        twistType: request.twistType || 'random',
        usedFallback,
        metadata: {
          responseTime,
          tokenUsage,
          retryCount,
        },
      };
    } catch (error) {
      // Final fallback
      console.error('[AI Service] Critical error, using fallback:', error);

      return {
        twist: getRandomFallbackTwist(),
        twistType: request.twistType || 'random',
        usedFallback: true,
        metadata: {
          responseTime: Date.now() - startTime,
          retryCount,
        },
      };
    }
  }

  /**
   * Build prompt based on story context
   */
  private buildPrompt(request: GenerateTwistRequest): { system: string; prompt: string } {
    const { contributions, twistType = 'random', theme } = request;

    // Special case: opening twist
    if (contributions.length === 1) {
      return generateOpeningTwistPrompt(contributions[0].content, theme);
    }

    // Normal case: contextual twist
    return generateContextualTwistPrompt(contributions, twistType, theme);
  }

  /**
   * Validate that generated twist meets quality standards
   */
  private isValidTwist(twist: string): boolean {
    // Must have content
    if (!twist || twist.trim().length === 0) {
      return false;
    }

    // Must be reasonable length (20-500 chars)
    if (twist.length < 20 || twist.length > 500) {
      return false;
    }

    // Must not contain meta-commentary markers
    const metaMarkers = [
      'here is',
      'here\'s a',
      'this twist',
      'i suggest',
      'how about',
      'you could',
      'the twist is',
    ];

    const lowerTwist = twist.toLowerCase();
    if (metaMarkers.some((marker) => lowerTwist.startsWith(marker))) {
      return false;
    }

    // Must not be just an explanation
    if (twist.includes('because') && twist.includes('would be funny')) {
      return false;
    }

    return true;
  }

  /**
   * Test twist generation with multiple scenarios
   */
  async testTwistGeneration(scenarios: Array<{ context: string; theme?: string }>): Promise<{
    results: Array<{
      scenario: string;
      twist: string;
      responseTime: number;
      usedFallback: boolean;
    }>;
    summary: {
      totalTests: number;
      averageResponseTime: number;
      fallbackCount: number;
      successRate: number;
    };
  }> {
    const results = [];
    let totalResponseTime = 0;
    let fallbackCount = 0;

    for (const scenario of scenarios) {
      const contributions: ContributionWithPlayer[] = [
        {
          id: 'test',
          story_id: 'test',
          content: scenario.context,
          type: 'player',
          player_id: 'test',
          order_num: 1,
          created_at: Date.now(),
          twist_type: null,
          player_nickname: 'TestPlayer',
          player_color: '#EF4444',
        },
      ];

      const response = await this.generateTwist({
        contributions,
        theme: scenario.theme,
      });

      results.push({
        scenario: scenario.context,
        twist: response.twist,
        responseTime: response.metadata.responseTime,
        usedFallback: response.usedFallback,
      });

      totalResponseTime += response.metadata.responseTime;
      if (response.usedFallback) {
        fallbackCount++;
      }
    }

    return {
      results,
      summary: {
        totalTests: scenarios.length,
        averageResponseTime: totalResponseTime / scenarios.length,
        fallbackCount,
        successRate: ((scenarios.length - fallbackCount) / scenarios.length) * 100,
      },
    };
  }
}

/**
 * Singleton instance
 */
let aiServiceInstance: AIService | null = null;

/**
 * Get or create AI service instance
 */
export function getAIService(config?: AIServiceConfig): AIService {
  if (!aiServiceInstance) {
    aiServiceInstance = new AIService(config);
  }
  return aiServiceInstance;
}

/**
 * Reset AI service (useful for testing)
 */
export function resetAIService(): void {
  aiServiceInstance = null;
}
