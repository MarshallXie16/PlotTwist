import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContributionInput } from '../ContributionInput';

// Mock navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

// Mock navigator.platform
Object.defineProperty(navigator, 'platform', {
  value: 'MacIntel',
  writable: true,
});

describe('ContributionInput', () => {
  const mockOnSubmit = jest.fn();
  const mockOnTypingStart = jest.fn();
  const mockOnTypingStop = jest.fn();
  const mockOnRequestAI = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders textarea with placeholder', () => {
    render(
      <ContributionInput
        onSubmit={mockOnSubmit}
        placeholder="Test placeholder"
      />
    );

    expect(screen.getByPlaceholderText('Test placeholder')).toBeInTheDocument();
  });

  it('updates character count as user types', async () => {
    const user = userEvent.setup();
    render(<ContributionInput onSubmit={mockOnSubmit} maxLength={100} />);

    const textarea = screen.getByPlaceholderText('Continue the story...');
    await user.type(textarea, 'Hello');

    expect(screen.getByText('5/100')).toBeInTheDocument();
  });

  it('enforces max length', async () => {
    const user = userEvent.setup();
    render(<ContributionInput onSubmit={mockOnSubmit} maxLength={10} />);

    const textarea = screen.getByPlaceholderText('Continue the story...');
    await user.type(textarea, 'This is a very long text that exceeds the limit');

    // Should only have first 10 characters
    expect(textarea).toHaveValue('This is a ');
  });

  it('calls onTypingStart when user starts typing', async () => {
    const user = userEvent.setup();
    render(
      <ContributionInput
        onSubmit={mockOnSubmit}
        onTypingStart={mockOnTypingStart}
      />
    );

    const textarea = screen.getByPlaceholderText('Continue the story...');
    await user.type(textarea, 'H');

    await waitFor(() => {
      expect(mockOnTypingStart).toHaveBeenCalled();
    });
  });

  it('calls onTypingStop after inactivity', async () => {
    const user = userEvent.setup();
    jest.useFakeTimers();

    render(
      <ContributionInput
        onSubmit={mockOnSubmit}
        onTypingStart={mockOnTypingStart}
        onTypingStop={mockOnTypingStop}
      />
    );

    const textarea = screen.getByPlaceholderText('Continue the story...');
    await user.type(textarea, 'Hello');

    // Fast-forward 2 seconds
    jest.advanceTimersByTime(2000);

    await waitFor(() => {
      expect(mockOnTypingStop).toHaveBeenCalled();
    });

    jest.useRealTimers();
  });

  it('submits content when button clicked', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockResolvedValue(undefined);

    render(<ContributionInput onSubmit={mockOnSubmit} />);

    const textarea = screen.getByPlaceholderText('Continue the story...');
    await user.type(textarea, 'Test contribution');

    const submitButton = screen.getByRole('button', { name: /send/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith('Test contribution');
    });
  });

  it('does not submit empty content', async () => {
    const user = userEvent.setup();
    render(<ContributionInput onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole('button', { name: /send/i });
    await user.click(submitButton);

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('trims whitespace before submitting', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockResolvedValue(undefined);

    render(<ContributionInput onSubmit={mockOnSubmit} />);

    const textarea = screen.getByPlaceholderText('Continue the story...');
    await user.type(textarea, '  Test  ');

    const submitButton = screen.getByRole('button', { name: /send/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith('Test');
    });
  });

  it('clears input after successful submission', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockResolvedValue(undefined);

    render(<ContributionInput onSubmit={mockOnSubmit} />);

    const textarea = screen.getByPlaceholderText(
      'Continue the story...'
    ) as HTMLTextAreaElement;
    await user.type(textarea, 'Test contribution');
    expect(textarea.value).toBe('Test contribution');

    const submitButton = screen.getByRole('button', { name: /send/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(textarea.value).toBe('');
    });
  });

  it('disables submit button when disabled prop is true', () => {
    render(<ContributionInput onSubmit={mockOnSubmit} disabled={true} />);

    const submitButton = screen.getByRole('button', { name: /send/i });
    expect(submitButton).toBeDisabled();
  });

  it('shows AI request button when enabled', () => {
    render(
      <ContributionInput
        onSubmit={mockOnSubmit}
        showAIButton={true}
        onRequestAI={mockOnRequestAI}
      />
    );

    expect(
      screen.getByRole('button', { name: /request ai twist/i })
    ).toBeInTheDocument();
  });

  it('hides AI request button when disabled', () => {
    render(
      <ContributionInput onSubmit={mockOnSubmit} showAIButton={false} />
    );

    expect(
      screen.queryByRole('button', { name: /request ai twist/i })
    ).not.toBeInTheDocument();
  });

  it('calls onRequestAI when AI button clicked', async () => {
    const user = userEvent.setup();
    render(
      <ContributionInput
        onSubmit={mockOnSubmit}
        showAIButton={true}
        onRequestAI={mockOnRequestAI}
      />
    );

    const aiButton = screen.getByRole('button', { name: /request ai twist/i });
    await user.click(aiButton);

    expect(mockOnRequestAI).toHaveBeenCalled();
  });

  it('shows AI thinking state', () => {
    render(
      <ContributionInput
        onSubmit={mockOnSubmit}
        showAIButton={true}
        onRequestAI={mockOnRequestAI}
        aiThinking={true}
      />
    );

    expect(screen.getByText('AI Thinking')).toBeInTheDocument();
  });

  it('disables AI button when thinking', () => {
    render(
      <ContributionInput
        onSubmit={mockOnSubmit}
        showAIButton={true}
        onRequestAI={mockOnRequestAI}
        aiThinking={true}
      />
    );

    const aiButton = screen.getByRole('button', { name: /ai thinking/i });
    expect(aiButton).toBeDisabled();
  });

  it('shows character count warning when near limit', async () => {
    const user = userEvent.setup();
    render(<ContributionInput onSubmit={mockOnSubmit} maxLength={10} />);

    const textarea = screen.getByPlaceholderText('Continue the story...');
    await user.type(textarea, 'Ninechars'); // 9 chars (> 80% of 10)

    const charCount = screen.getByText('9/10');
    expect(charCount).toHaveClass('text-[var(--color-warning)]');
  });

  it('shows keyboard shortcut hint', () => {
    render(<ContributionInput onSubmit={mockOnSubmit} />);

    // Should show Mac command key
    expect(screen.getByText('⌘')).toBeInTheDocument();
  });
});
