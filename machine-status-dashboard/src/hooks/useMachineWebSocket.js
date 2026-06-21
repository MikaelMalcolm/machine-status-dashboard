import { useCallback, useEffect, useRef, useState } from 'react';
import { MAX_HISTORY, parseMachineReading } from '../config';

/**
 * Custom hook: manages a WebSocket connection and rolling history of readings.
 *
 * Why a custom hook?
 * - Keeps connection logic out of UI components
 * - Reusable if you add more pages later
 * - `useEffect` + cleanup is the standard React pattern for subscriptions
 *
 * @param {string} wsUrl - Full WebSocket URL (e.g. ws://localhost:8080)
 */
export function useMachineWebSocket(wsUrl) {
  const [latestReading, setLatestReading] = useState(null);
  const [history, setHistory] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [error, setError] = useState(null);

  // Refs survive re-renders without triggering them — good for socket instances
  // and timers that shouldn't reset when unrelated state changes.
  const socketRef = useRef(null);
  const reconnectTimerRef = useRef(null);
  const mountedRef = useRef(true);

  const clearReconnectTimer = useCallback(() => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
  }, []);

  const connect = useCallback(() => {
    clearReconnectTimer();

    // Close any existing socket before opening a new one (e.g. URL changed).
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }

    if (!wsUrl) {
      setConnectionStatus('disconnected');
      setError('WebSocket URL is empty.');
      return;
    }

    setConnectionStatus('connecting');
    setError(null);

    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      if (!mountedRef.current) return;
      setConnectionStatus('connected');
      setError(null);
    };

    socket.onmessage = (event) => {
      if (!mountedRef.current) return;

      try {
        const raw = JSON.parse(event.data);
        const reading = parseMachineReading(raw);

        if (!reading) {
          setError('Received JSON but it did not match the expected machine shape.');
          return;
        }

        setLatestReading(reading);
        setHistory((prev) => {
          const next = [...prev, reading];
          // Keep only the most recent N points so charts stay readable & fast.
          return next.length > MAX_HISTORY ? next.slice(-MAX_HISTORY) : next;
        });
      } catch {
        setError('Could not parse message as JSON.');
      }
    };

    socket.onerror = () => {
      if (!mountedRef.current) return;
      setError('WebSocket error — is the server running?');
    };

    socket.onclose = () => {
      if (!mountedRef.current) return;
      setConnectionStatus('disconnected');

      // Auto-reconnect after 3 seconds (common pattern for dashboards).
      reconnectTimerRef.current = setTimeout(() => {
        if (mountedRef.current) connect();
      }, 3000);
    };
  }, [wsUrl, clearReconnectTimer]);

  useEffect(() => {
    mountedRef.current = true;
    connect();

    // Cleanup runs when the component unmounts OR when wsUrl changes.
    return () => {
      mountedRef.current = false;
      clearReconnectTimer();
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [connect, clearReconnectTimer]);

  /** Manually disconnect (stops auto-reconnect until you call reconnect). */
  const disconnect = useCallback(() => {
    clearReconnectTimer();
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    setConnectionStatus('disconnected');
  }, [clearReconnectTimer]);

  /** Clear history — handy while experimenting with the mock server. */
  const clearHistory = useCallback(() => {
    setHistory([]);
    setLatestReading(null);
  }, []);

  return {
    latestReading,
    history,
    connectionStatus,
    error,
    reconnect: connect,
    disconnect,
    clearHistory,
  };
}
