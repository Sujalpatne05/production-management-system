import { useEffect, useRef, useCallback } from 'react';

interface UseRealTimeUpdatesOptions {
  interval?: number;
  onUpdate?: () => void;
  enabled?: boolean;
}

export const useRealTimeUpdates = ({
  interval = 30000,
  onUpdate,
  enabled = true,
}: UseRealTimeUpdatesOptions) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startPolling = useCallback(() => {
    if (!enabled) return;

    intervalRef.current = setInterval(() => {
      onUpdate?.();
    }, interval);
  }, [interval, onUpdate, enabled]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (enabled) {
      startPolling();
    }
    return () => stopPolling();
  }, [enabled, startPolling, stopPolling]);

  return { startPolling, stopPolling };
};
