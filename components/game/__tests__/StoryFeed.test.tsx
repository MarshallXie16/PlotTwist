import React from 'react';
import { render, screen } from '@testing-library/react';
import { StoryFeed, type StoryContribution } from '../StoryFeed';

describe('StoryFeed', () => {
  const mockContributions: StoryContribution[] = [
    {
      id: 'contrib-1',
      content: 'Once upon a time, there was a village.',
      type: 'player',
      playerNickname: 'Alice',
      playerColor: '#EF4444',
      orderNum: 1,
      createdAt: Date.now(),
    },
    {
      id: 'contrib-2',
      content: 'The hero set out on a journey.',
      type: 'player',
      playerNickname: 'Bob',
      playerColor: '#3B82F6',
      orderNum: 2,
      createdAt: Date.now(),
    },
    {
      id: 'contrib-3',
      content: 'Suddenly, gravity reversed itself!',
      type: 'ai',
      orderNum: 3,
      createdAt: Date.now(),
    },
  ];

  it('renders all contributions in order', () => {
    render(<StoryFeed contributions={mockContributions} />);

    expect(screen.getByText('Once upon a time, there was a village.')).toBeInTheDocument();
    expect(screen.getByText('The hero set out on a journey.')).toBeInTheDocument();
    expect(screen.getByText('Suddenly, gravity reversed itself!')).toBeInTheDocument();
  });

  it('shows contribution count', () => {
    render(<StoryFeed contributions={mockContributions} />);

    expect(screen.getByText('3 contributions')).toBeInTheDocument();
  });

  it('shows singular contribution label', () => {
    render(<StoryFeed contributions={[mockContributions[0]]} />);

    expect(screen.getByText('1 contribution')).toBeInTheDocument();
  });

  it('displays player attributions with colors', () => {
    render(<StoryFeed contributions={mockContributions} />);

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('displays AI twist attribution', () => {
    render(<StoryFeed contributions={mockContributions} />);

    expect(screen.getByText('✨ AI Twist')).toBeInTheDocument();
  });

  it('marks first contribution as opening', () => {
    render(<StoryFeed contributions={mockContributions} />);

    expect(screen.getByText('Opening')).toBeInTheDocument();
  });

  it('shows AI thinking indicator', () => {
    render(<StoryFeed contributions={mockContributions} aiThinking={true} />);

    expect(screen.getByText('AI is crafting chaos...')).toBeInTheDocument();
  });

  it('hides AI thinking when not active', () => {
    render(<StoryFeed contributions={mockContributions} aiThinking={false} />);

    expect(screen.queryByText('AI is crafting chaos...')).not.toBeInTheDocument();
  });

  it('shows empty state when no contributions', () => {
    render(<StoryFeed contributions={[]} />);

    expect(screen.getByText('Your story begins here...')).toBeInTheDocument();
    expect(screen.getByText('Write the first line to get started!')).toBeInTheDocument();
  });

  it('displays contribution stats in footer', () => {
    render(<StoryFeed contributions={mockContributions} />);

    expect(screen.getByText('2 player contributions')).toBeInTheDocument();
    expect(screen.getByText('1 AI twists')).toBeInTheDocument();
  });

  it('sorts contributions by order number', () => {
    const unorderedContributions = [
      { ...mockContributions[2], orderNum: 3 },
      { ...mockContributions[0], orderNum: 1 },
      { ...mockContributions[1], orderNum: 2 },
    ];

    const { container } = render(<StoryFeed contributions={unorderedContributions} />);

    const contributionElements = container.querySelectorAll('[class*="group relative"]');
    expect(contributionElements).toHaveLength(3);

    // First should be orderNum 1
    expect(contributionElements[0].textContent).toContain('Once upon a time');
  });

  it('applies special styling to AI contributions', () => {
    const { container } = render(<StoryFeed contributions={mockContributions} />);

    const aiContribution = screen.getByText('Suddenly, gravity reversed itself!');
    expect(aiContribution.closest('[class*="gradient"]')).toBeInTheDocument();
  });
});
