'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';

interface ContributionInputProps {
  onSubmit: (content: string) => void | Promise<void>;
  onTypingStart?: () => void;
  onTypingStop?: () => void;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
  showAIButton?: boolean;
  onRequestAI?: () => void;
  aiThinking?: boolean;
}

/**
 * ContributionInput Component
 *
 * Text input for players to contribute to the story with:
 * - Auto-growing textarea
 * - Character count
 * - Typing indicators (callbacks)
 * - Submit validation
 * - AI twist request button
 * - Keyboard shortcuts (Cmd/Ctrl+Enter to submit)
 *
 * @example
 * <ContributionInput
 *   onSubmit={handleSubmit}
 *   onTypingStart={() => socket.emit('typing:start')}
 *   onTypingStop={() => socket.emit('typing:stop')}
 *   showAIButton={true}
 *   onRequestAI={handleAIRequest}
 * />
 */
export function ContributionInput({
  onSubmit,
  onTypingStart,
  onTypingStop,
  disabled = false,
  placeholder = 'Continue the story...',
  maxLength = 500,
  showAIButton = true,
  onRequestAI,
  aiThinking = false,
}: ContributionInputProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (isTypingRef.current && onTypingStop) {
        onTypingStop();
      }
    };
  }, [onTypingStop]);

  /**
   * Handle typing indicators
   */
  const handleTyping = useCallback(() => {
    // Start typing indicator
    if (!isTypingRef.current && onTypingStart) {
      onTypingStart();
      isTypingRef.current = true;
    }

    // Reset the typing stop timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      if (isTypingRef.current && onTypingStop) {
        onTypingStop();
        isTypingRef.current = false;
      }
    }, 2000);
  }, [onTypingStart, onTypingStop]);

  /**
   * Handle content change
   */
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;

    // Enforce max length
    if (newContent.length <= maxLength) {
      setContent(newContent);
      handleTyping();
    }
  };

  /**
   * Handle submit
   */
  const handleSubmit = async () => {
    const trimmed = content.trim();

    // Validate
    if (!trimmed || trimmed.length === 0) {
      return;
    }

    if (isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);

      // Stop typing indicator
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (isTypingRef.current && onTypingStop) {
        onTypingStop();
        isTypingRef.current = false;
      }

      // Submit
      await onSubmit(trimmed);

      // Clear input on success
      setContent('');

      // Focus back on textarea
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    } catch (error) {
      console.error('Error submitting contribution:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle keyboard shortcuts
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Cmd/Ctrl + Enter to submit
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const characterCount = content.length;
  const isValid = content.trim().length > 0;
  const isNearLimit = characterCount > maxLength * 0.8;

  return (
    <Card className="p-4">
      <div className="space-y-3">
        {/* Textarea */}
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || isSubmitting}
          className={`
            min-h-[100px] max-h-[300px] resize-none
            text-base leading-relaxed
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          maxLength={maxLength}
        />

        {/* Footer */}
        <div className="flex items-center justify-between gap-3">
          {/* Character Count */}
          <div className="flex items-center gap-3">
            <span
              className={`
                text-sm
                ${
                  isNearLimit
                    ? 'text-[var(--color-warning)] font-medium'
                    : 'text-[var(--text-tertiary)]'
                }
              `}
            >
              {characterCount}/{maxLength}
            </span>

            {/* Keyboard Hint */}
            <span className="hidden sm:block text-xs text-[var(--text-tertiary)]">
              <kbd className="px-1.5 py-0.5 text-xs bg-[var(--bg-tertiary)] rounded border border-[var(--border)]">
                {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}
              </kbd>{' '}
              +{' '}
              <kbd className="px-1.5 py-0.5 text-xs bg-[var(--bg-tertiary)] rounded border border-[var(--border)]">
                Enter
              </kbd>{' '}
              to submit
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* AI Twist Button */}
            {showAIButton && onRequestAI && (
              <Button
                onClick={onRequestAI}
                disabled={disabled || aiThinking}
                variant="secondary"
                size="sm"
                className="gap-2"
              >
                {aiThinking ? (
                  <>
                    <div className="flex gap-0.5">
                      <span className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:0ms]" />
                      <span className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:300ms]" />
                    </div>
                    AI Thinking
                  </>
                ) : (
                  <>
                    ✨ Request AI Twist
                  </>
                )}
              </Button>
            )}

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={!isValid || disabled || isSubmitting}
              size="default"
              className="gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  Send
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
