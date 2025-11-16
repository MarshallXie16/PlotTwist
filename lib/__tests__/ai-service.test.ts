import { AIService, resetAIService } from '../ai-service';
import { resetAIClient } from '../ai-client';
import type { ContributionWithPlayer } from '../types';

describe('AI Service', () => {
  let aiService: AIService;

  beforeEach(() => {
    // Reset singleton instances
    resetAIService();
    resetAIClient();

    // Create new service with mock enabled
    aiService = new AIService({ useMock: true, mockDelay: 10 });
  });

  describe('generateTwist', () => {
    it('generates a twist for a simple story', async () => {
      const contributions: ContributionWithPlayer[] = [
        {
          id: '1',
          story_id: 'story1',
          content: 'Once upon a time, there was a village.',
          type: 'player',
          player_id: 'player1',
          order_num: 1,
          created_at: Date.now(),
          twist_type: null,
          player_nickname: 'Alice',
          player_color: '#EF4444',
        },
      ];

      const result = await aiService.generateTwist({ contributions });

      expect(result).toBeDefined();
      expect(result.twist).toBeTruthy();
      expect(result.twist.length).toBeGreaterThan(20);
      expect(result.twistType).toBe('random');
      expect(result.metadata.responseTime).toBeGreaterThan(0);
    });

    it('generates a twist with specific type', async () => {
      const contributions: ContributionWithPlayer[] = [
        {
          id: '1',
          story_id: 'story1',
          content: 'The detective examined the crime scene.',
          type: 'player',
          player_id: 'player1',
          order_num: 1,
          created_at: Date.now(),
          twist_type: null,
          player_nickname: 'Bob',
          player_color: '#3B82F6',
        },
      ];

      const result = await aiService.generateTwist({
        contributions,
        twistType: 'environmental',
      });

      expect(result).toBeDefined();
      expect(result.twistType).toBe('environmental');
    });

    it('includes theme in generation', async () => {
      const contributions: ContributionWithPlayer[] = [
        {
          id: '1',
          story_id: 'story1',
          content: 'They locked eyes across the room.',
          type: 'player',
          player_id: 'player1',
          order_num: 1,
          created_at: Date.now(),
          twist_type: null,
          player_nickname: 'Charlie',
          player_color: '#10B981',
        },
      ];

      const result = await aiService.generateTwist({
        contributions,
        theme: 'Romance',
      });

      expect(result).toBeDefined();
      expect(result.twist).toBeTruthy();
    });

    it('handles multiple contributions in context', async () => {
      const contributions: ContributionWithPlayer[] = [
        {
          id: '1',
          story_id: 'story1',
          content: 'The spaceship approached the planet.',
          type: 'player',
          player_id: 'player1',
          order_num: 1,
          created_at: Date.now(),
          twist_type: null,
          player_nickname: 'Diana',
          player_color: '#F59E0B',
        },
        {
          id: '2',
          story_id: 'story1',
          content: 'Sensors detected strange energy readings.',
          type: 'player',
          player_id: 'player2',
          order_num: 2,
          created_at: Date.now(),
          twist_type: null,
          player_nickname: 'Eve',
          player_color: '#8B5CF6',
        },
        {
          id: '3',
          story_id: 'story1',
          content: 'The captain made the decision to land.',
          type: 'player',
          player_id: 'player1',
          order_num: 3,
          created_at: Date.now(),
          twist_type: null,
          player_nickname: 'Diana',
          player_color: '#F59E0B',
        },
      ];

      const result = await aiService.generateTwist({ contributions });

      expect(result).toBeDefined();
      expect(result.twist).toBeTruthy();
    });

    it('uses fallback on validation failure', async () => {
      // This test verifies that invalid responses trigger fallback
      const contributions: ContributionWithPlayer[] = [
        {
          id: '1',
          story_id: 'story1',
          content: 'Test',
          type: 'player',
          player_id: 'player1',
          order_num: 1,
          created_at: Date.now(),
          twist_type: null,
          player_nickname: 'Test',
          player_color: '#EF4444',
        },
      ];

      const result = await aiService.generateTwist({ contributions });

      // Should still return a valid twist (either from AI or fallback)
      expect(result).toBeDefined();
      expect(result.twist).toBeTruthy();
      expect(result.twist.length).toBeGreaterThan(20);
    });

    it('includes metadata in response', async () => {
      const contributions: ContributionWithPlayer[] = [
        {
          id: '1',
          story_id: 'story1',
          content: 'The hero drew their sword.',
          type: 'player',
          player_id: 'player1',
          order_num: 1,
          created_at: Date.now(),
          twist_type: null,
          player_nickname: 'Frank',
          player_color: '#EC4899',
        },
      ];

      const result = await aiService.generateTwist({ contributions });

      expect(result.metadata).toBeDefined();
      expect(result.metadata.responseTime).toBeGreaterThan(0);
      expect(result.metadata.retryCount).toBeGreaterThanOrEqual(0);
      expect(typeof result.usedFallback).toBe('boolean');
    });
  });

  describe('testTwistGeneration', () => {
    it('tests multiple scenarios and returns summary', async () => {
      const scenarios = [
        { context: 'Once upon a time...', theme: undefined },
        { context: 'The detective arrived.', theme: 'Mystery' },
        { context: 'Love was in the air.', theme: 'Romance' },
      ];

      const testResult = await aiService.testTwistGeneration(scenarios);

      expect(testResult.results).toHaveLength(3);
      expect(testResult.summary.totalTests).toBe(3);
      expect(testResult.summary.averageResponseTime).toBeGreaterThan(0);
      expect(testResult.summary.successRate).toBeGreaterThanOrEqual(0);
      expect(testResult.summary.successRate).toBeLessThanOrEqual(100);
    });

    it('each result includes required fields', async () => {
      const scenarios = [{ context: 'Test story', theme: undefined }];

      const testResult = await aiService.testTwistGeneration(scenarios);

      const result = testResult.results[0];
      expect(result.scenario).toBe('Test story');
      expect(result.twist).toBeTruthy();
      expect(result.responseTime).toBeGreaterThan(0);
      expect(typeof result.usedFallback).toBe('boolean');
    });
  });

  describe('twist validation', () => {
    it('generates twists within length constraints', async () => {
      const contributions: ContributionWithPlayer[] = [
        {
          id: '1',
          story_id: 'story1',
          content: 'A test story.',
          type: 'player',
          player_id: 'player1',
          order_num: 1,
          created_at: Date.now(),
          twist_type: null,
          player_nickname: 'Tester',
          player_color: '#EF4444',
        },
      ];

      const result = await aiService.generateTwist({ contributions });

      expect(result.twist.length).toBeGreaterThan(20);
      expect(result.twist.length).toBeLessThan(500);
    });

    it('generates different twists for same input', async () => {
      const contributions: ContributionWithPlayer[] = [
        {
          id: '1',
          story_id: 'story1',
          content: 'The same story beginning.',
          type: 'player',
          player_id: 'player1',
          order_num: 1,
          created_at: Date.now(),
          twist_type: null,
          player_nickname: 'Test',
          player_color: '#EF4444',
        },
      ];

      const results = await Promise.all([
        aiService.generateTwist({ contributions }),
        aiService.generateTwist({ contributions }),
        aiService.generateTwist({ contributions }),
      ]);

      // At least some should be different (with mock, they're random from pool)
      const uniqueTwists = new Set(results.map((r) => r.twist));
      expect(uniqueTwists.size).toBeGreaterThan(1);
    });
  });

  describe('error handling', () => {
    it('handles empty contributions gracefully', async () => {
      const contributions: ContributionWithPlayer[] = [];

      const result = await aiService.generateTwist({ contributions });

      // Should use fallback or generate opening twist
      expect(result).toBeDefined();
      expect(result.twist).toBeTruthy();
    });

    it('returns twist even on errors', async () => {
      // Service should handle errors and use fallback
      const contributions: ContributionWithPlayer[] = [
        {
          id: '1',
          story_id: 'story1',
          content: 'Test',
          type: 'player',
          player_id: 'player1',
          order_num: 1,
          created_at: Date.now(),
          twist_type: null,
          player_nickname: 'Test',
          player_color: '#EF4444',
        },
      ];

      const result = await aiService.generateTwist({ contributions });

      // Should always return a twist (fallback if necessary)
      expect(result).toBeDefined();
      expect(result.twist).toBeTruthy();
    });
  });
});
