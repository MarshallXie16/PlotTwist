import React from 'react';
import { render, screen } from '@testing-library/react';
import { PlayerList, type Player } from '../PlayerList';

describe('PlayerList', () => {
  const mockPlayers: Player[] = [
    {
      id: 'player-1',
      nickname: 'Alice',
      color: '#EF4444',
      isActive: true,
      isTyping: false,
    },
    {
      id: 'player-2',
      nickname: 'Bob',
      color: '#3B82F6',
      isActive: true,
      isTyping: false,
    },
    {
      id: 'player-3',
      nickname: 'Charlie',
      color: '#10B981',
      isActive: true,
      isTyping: true,
    },
  ];

  it('renders player list with all players', () => {
    render(<PlayerList players={mockPlayers} maxPlayers={6} />);

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Charlie')).toBeInTheDocument();
  });

  it('displays player count correctly', () => {
    render(<PlayerList players={mockPlayers} maxPlayers={6} />);

    expect(screen.getByText('3/6')).toBeInTheDocument();
  });

  it('highlights current player', () => {
    render(<PlayerList players={mockPlayers} currentPlayerId="player-1" />);

    expect(screen.getByText('You')).toBeInTheDocument();
  });

  it('shows typing indicator for typing players', () => {
    render(<PlayerList players={mockPlayers} showTypingIndicators={true} />);

    expect(screen.getByText('typing...')).toBeInTheDocument();
  });

  it('hides typing indicators when disabled', () => {
    render(<PlayerList players={mockPlayers} showTypingIndicators={false} />);

    expect(screen.queryByText('typing...')).not.toBeInTheDocument();
  });

  it('shows remaining spots', () => {
    render(<PlayerList players={mockPlayers} maxPlayers={6} />);

    expect(screen.getByText(/3 spots remaining/)).toBeInTheDocument();
  });

  it('shows single spot remaining correctly', () => {
    render(<PlayerList players={mockPlayers} maxPlayers={4} />);

    expect(screen.getByText(/1 spot remaining/)).toBeInTheDocument();
  });

  it('filters out inactive players', () => {
    const playersWithInactive: Player[] = [
      ...mockPlayers,
      {
        id: 'player-4',
        nickname: 'Inactive',
        color: '#000000',
        isActive: false,
        isTyping: false,
      },
    ];

    render(<PlayerList players={playersWithInactive} maxPlayers={6} />);

    expect(screen.queryByText('Inactive')).not.toBeInTheDocument();
    expect(screen.getByText('3/6')).toBeInTheDocument(); // Still 3 active
  });

  it('shows empty state when no players', () => {
    render(<PlayerList players={[]} maxPlayers={6} />);

    expect(screen.getByText('Waiting for players to join...')).toBeInTheDocument();
  });

  it('renders player color indicators', () => {
    const { container } = render(<PlayerList players={mockPlayers} />);

    const colorIndicators = container.querySelectorAll('[aria-label*="color"]');
    expect(colorIndicators).toHaveLength(3);
  });
});
