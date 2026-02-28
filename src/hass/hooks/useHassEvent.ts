import { useEffect, useRef } from 'react';
import { useHass } from './useHass';

/**
 * Subscribe to a Home Assistant event bus event type.
 * The subscription is automatically cleaned up when the component unmounts.
 * Will re-subscribe if `eventType` changes.
 *
 * @example
 * ```tsx
 * useHassEvent("state_changed", (event) => {
 *   console.log("State changed:", event);
 * });
 * ```
 */
export function useHassEvent(eventType: string, callback: (event: unknown) => void): void {
  const { subscribeToEvent, connectionStatus } = useHass();
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (connectionStatus !== 'connected') return;

    let unsubscribe: (() => void) | null = null;
    let cancelled = false;

    subscribeToEvent(eventType, event => {
      callbackRef.current(event);
    }).then(unsub => {
      if (cancelled) {
        unsub();
      } else {
        unsubscribe = unsub;
      }
    });

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [eventType, connectionStatus, subscribeToEvent]);
}
