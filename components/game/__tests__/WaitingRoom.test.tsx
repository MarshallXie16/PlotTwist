import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WaitingRoom } from '../WaitingRoom';
import type { Player } from '../PlayerList';

// Mock navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockResolvedValue(undefined),
  },
});

// Mock window.location
delete (window as any).location;
window.location = { origin: 'https://plottwist.app' } as Location;

describe('WaitingRoom', () => {
  const mockPlayers: Player[] = [
    {
      id: 'player-1',
      nickname: 'Alice',
      color: '#EF4444',
      isActive: true,
    },
    {
      id: 'player-2',
      nickname: 'Bob',
      color: '#3B82F6',
      isActive: true,
    },
  ];

  const defaultProps = {
    roomId: 'test-room-123',
    gameMode: 'freeform' as const,
    players: mockPlayers,
    currentPlayerId: 'player-1',
    minPlayers: 2,
    maxPlayers: 6,
  };

  it('renders waiting room header', () => {
    render(<WaitingRoom {...defaultProps} />);

    expect(screen.getByText('Waiting Room')).toBeInTheDocument();
    expect(
      screen.getByText('Invite your friends to join the chaos!')
    ).toBeInTheDocument();
  });

  it('displays room ID', () => {
    render(<WaitingRoom {...defaultProps} />);

    expect(screen.getByText('test-room-123')).toBeInTheDocument();
  });

  it('displays game mode', () => {
    render(<WaitingRoom {...defaultProps} />);

    expect(screen.getByText('freeform')).toBeInTheDocument();
  });

  it('displays theme when in themed mode', () => {
    render(
      <WaitingRoom
        {...defaultProps}
        gameMode="themed"
        theme="Horror"
      />
    );

    expect(screen.getByText('Horror')).toBeInTheDocument();
  });

  it('does not show theme in freeform mode', () => {
    render(<WaitingRoom {...defaultProps} gameMode="freeform" />);

    expect(screen.queryByText(/theme/i)).not.toBeInTheDocument();
  });

  it('generates shareable link with room ID', () => {
    render(<WaitingRoom {...defaultProps} />);

    const linkInput = screen.getByDisplayValue(
      'https://plottwist.app/room/test-room-123'
    );
    expect(linkInput).toBeInTheDocument();
  });

  it('uses provided shareable link if available', () => {
    render(
      <WaitingRoom
        {...defaultProps}
        shareableLink="https://custom.link/room/test"
      />
    );

    expect(
      screen.getByDisplayValue('https://custom.link/room/test')
    ).toBeInTheDocument();
  });

  it('copies link to clipboard when copy button clicked', async () => {
    const user = userEvent.setup();
    const mockWriteText = navigator.clipboard.writeText as jest.Mock;

    render(<WaitingRoom {...defaultProps} />);

    const copyButton = screen.getByRole('button', { name: /copy/i });
    await user.click(copyButton);

    expect(mockWriteText).toHaveBeenCalledWith(
      'https://plottwist.app/room/test-room-123'
    );
  });

  it('shows copied confirmation after copying', async () => {
    const user = userEvent.setup();
    jest.useFakeTimers();

    render(<WaitingRoom {...defaultProps} />);

    const copyButton = screen.getByRole('button', { name: /copy/i });
    await user.click(copyButton);

    expect(screen.getByText('Copied!')).toBeInTheDocument();

    // Should reset after timeout
    jest.advanceTimersByTime(2000);
    await waitFor(() => {
      expect(screen.queryByText('Copied!')).not.toBeInTheDocument();
    });

    jest.useRealTimers();
  });

  it('calls onCopyLink callback', async () => {
    const user = userEvent.setup();
    const mockOnCopyLink = jest.fn();

    render(<WaitingRoom {...defaultProps} onCopyLink={mockOnCopyLink} />);

    const copyButton = screen.getByRole('button', { name: /copy/i });
    await user.click(copyButton);

    expect(mockOnCopyLink).toHaveBeenCalled();
  });

  it('shows "ready to start" when enough players', () => {
    render(<WaitingRoom {...defaultProps} />);

    expect(screen.getByText('Ready to start!')).toBeInTheDocument();
  });

  it('shows waiting message when not enough players', () => {
    render(
      <WaitingRoom
        {...defaultProps}
        players={[mockPlayers[0]]}
        minPlayers={2}
      />
    );

    expect(screen.getByText('Waiting for players...')).toBeInTheDocument();
    expect(screen.getByText(/Need at least 2 players to start/)).toBeInTheDocument();
  });

  it('shows start button for host when ready', () => {
    render(<WaitingRoom {...defaultProps} currentPlayerId="player-1" />);

    const startButton = screen.getByRole('button', { name: /start game/i });
    expect(startButton).toBeInTheDocument();
    expect(startButton).not.toBeDisabled();
  });

  it('shows waiting message for non-host players', () => {
    render(<WaitingRoom {...defaultProps} currentPlayerId="player-2" />);

    expect(
      screen.getByText('Waiting for host to start the game...')
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /start game/i })
    ).not.toBeInTheDocument();
  });

  it('calls onStartGame when start button clicked', async () => {
    const user = userEvent.setup();
    const mockOnStartGame = jest.fn();

    render(
      <WaitingRoom
        {...defaultProps}
        currentPlayerId="player-1"
        onStartGame={mockOnStartGame}
      />
    );

    const startButton = screen.getByRole('button', { name: /start game/i });
    await user.click(startButton);

    expect(mockOnStartGame).toHaveBeenCalled();
  });

  it('displays player list', () => {
    render(<WaitingRoom {...defaultProps} />);

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('shows game rules', () => {
    render(<WaitingRoom {...defaultProps} />);

    expect(screen.getByText('How to Play')).toBeInTheDocument();
    expect(
      screen.getByText(/Take turns adding to the collaborative story/)
    ).toBeInTheDocument();
  });

  it('shows invite instructions', () => {
    render(<WaitingRoom {...defaultProps} />);

    expect(screen.getByText(/How to invite:/)).toBeInTheDocument();
  });
});
