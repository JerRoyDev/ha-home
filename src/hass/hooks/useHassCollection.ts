import { useEffect, useRef, useState } from 'react';
import { getCollection, type Connection } from 'home-assistant-js-websocket';
import { useHass } from './useHass';

type UnsubscribeFunc = () => void;
type Store<T> = {
  setState: (update: T | ((state: T) => T)) => void;
  action: (fn: (state: T, event: unknown) => T | null) => (event: unknown) => void;
};

/**
 * Hook that wraps `getCollection` from home-assistant-js-websocket.
 * Automatically handles subscriptions, reconnects, and cleanup.
 *
 * @example
 * ```tsx
 * const panels = useHassCollection(
 *   "_pnl",
 *   (conn) => conn.sendMessagePromise({ type: "get_panels" }),
 *   (conn, store) =>
 *     conn.subscribeEvents(store.action((state, ev: any) => ({
 *       ...state,
 *       panels: [...(state as any).panels, ev.data.panel],
 *     })), "panel_registered")
 * );
 * ```
 */
export function useHassCollection<T>(
  key: string,
  fetchCollection: (conn: Connection) => Promise<T>,
  subscribeUpdates: (conn: Connection, store: Store<T>) => Promise<UnsubscribeFunc>
): T | undefined {
  const { connection } = useHass();
  const [state, setState] = useState<T | undefined>(undefined);
  const unsubRef = useRef<UnsubscribeFunc | null>(null);

  useEffect(() => {
    if (!connection) return;

    const coll = getCollection<T>(connection, key, fetchCollection, subscribeUpdates as never);

    setState(coll.state);
    const unsub = coll.subscribe(s => setState(s));
    unsubRef.current = unsub;

    return () => {
      unsub();
      unsubRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connection, key]);

  return state;
}
