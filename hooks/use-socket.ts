'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import type { ServerToClientEvents, ClientToServerEvents } from '@/lib/socket-types';

type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

interface UseSocketOptions {
  autoConnect?: boolean;
}

interface UseSocketReturn {
  socket: TypedSocket | null;
  isConnected: boolean;
  joinRoom: (roomId: string, playerId: string) => Promise<{ success: boolean; error?: string }>;
  leaveRoom: (roomId: string, playerId: string) => void;
  submitContribution: (
    roomId: string,
    playerId: string,
    content: string
  ) => Promise<{ success: boolean; contributionId?: string; error?: string }>;
  startTyping: (roomId: string, playerId: string) => void;
  stopTyping: (roomId: string, playerId: string) => void;
}

/**
 * Hook for managing Socket.io connection and events
 */
export function useSocket({ autoConnect = true }: UseSocketOptions = {}): UseSocketReturn {
  const [socket, setSocket] = useState<TypedSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<TypedSocket | null>(null);

  // Initialize socket connection
  useEffect(() => {
    if (!autoConnect) return;

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000';
    const newSocket: TypedSocket = io(socketUrl, {
      autoConnect: true,
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    // Connection event handlers
    newSocket.on('connect', () => {
      console.log('[Socket.io] Connected');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('[Socket.io] Disconnected');
      setIsConnected(false);
    });

    newSocket.on('error', ({ message, code }) => {
      console.error('[Socket.io] Error:', message, code);
    });

    // Cleanup on unmount
    return () => {
      newSocket.close();
      socketRef.current = null;
    };
  }, [autoConnect]);

  /**
   * Join a room
   */
  const joinRoom = useCallback(
    (roomId: string, playerId: string): Promise<{ success: boolean; error?: string }> => {
      return new Promise((resolve) => {
        if (!socketRef.current) {
          resolve({ success: false, error: 'Socket not connected' });
          return;
        }

        socketRef.current.emit('room:join', { roomId, playerId }, (response) => {
          resolve(response);
        });
      });
    },
    []
  );

  /**
   * Leave a room
   */
  const leaveRoom = useCallback((roomId: string, playerId: string) => {
    if (!socketRef.current) return;
    socketRef.current.emit('room:leave', { roomId, playerId });
  }, []);

  /**
   * Submit a contribution
   */
  const submitContribution = useCallback(
    (
      roomId: string,
      playerId: string,
      content: string
    ): Promise<{ success: boolean; contributionId?: string; error?: string }> => {
      return new Promise((resolve) => {
        if (!socketRef.current) {
          resolve({ success: false, error: 'Socket not connected' });
          return;
        }

        socketRef.current.emit(
          'contribution:submit',
          { roomId, playerId, content },
          (response) => {
            resolve(response);
          }
        );
      });
    },
    []
  );

  /**
   * Start typing indicator
   */
  const startTyping = useCallback((roomId: string, playerId: string) => {
    if (!socketRef.current) return;
    socketRef.current.emit('typing:start', { roomId, playerId });
  }, []);

  /**
   * Stop typing indicator
   */
  const stopTyping = useCallback((roomId: string, playerId: string) => {
    if (!socketRef.current) return;
    socketRef.current.emit('typing:stop', { roomId, playerId });
  }, []);

  return {
    socket,
    isConnected,
    joinRoom,
    leaveRoom,
    submitContribution,
    startTyping,
    stopTyping,
  };
}
