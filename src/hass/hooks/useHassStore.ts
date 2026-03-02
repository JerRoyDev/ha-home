import { useCallback, useEffect, useState } from 'react';
import { useHass } from './useHass';

// ─── Per-key module-level singletons ─────────────────────────────────────────

interface StoreSlot<T> {
  data: T;
  loaded: boolean;
  subscribers: Set<(data: T) => void>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const slots = new Map<string, StoreSlot<any>>();

function getSlot<T>(key: string, defaultValue: T): StoreSlot<T> {
  if (!slots.has(key)) {
    slots.set(key, { data: defaultValue, loaded: false, subscribers: new Set() });
  }
  return slots.get(key) as StoreSlot<T>;
}

function notifyAll<T>(slot: StoreSlot<T>, updated: T) {
  slot.data = updated;
  slot.loaded = true;
  slot.subscribers.forEach(fn => fn(updated));
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UseHassStoreReturn<T> {
  /** Current persisted data (or defaultValue while loading). */
  data: T;
  /** True until the first successful read from HA. */
  isLoading: boolean;
  /** Optimistically updates local state, then persists to HA. */
  setData: (value: T) => Promise<void>;
  /** Merge a partial update into the current data object. */
  patchData: (patch: Partial<T>) => Promise<void>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Generic persistent key/value store backed by `frontend/get_user_data`
 * and `frontend/set_user_data`.
 *
 * - Data is cached at module level — multiple hook instances sharing the
 *   same key all read/write the same slot and receive live updates.
 * - Fetch is deferred until the HA WebSocket connection is established.
 *
 * @example
 * ```ts
 * const { data, patchData, isLoading } = useHassStore('my-app/settings', { theme: 'dark' });
 * await patchData({ theme: 'light' });
 * ```
 */
export function useHassStore<T>(key: string, defaultValue: T): UseHassStoreReturn<T> {
  const { sendMessage, connectionStatus } = useHass();

  const slot = getSlot<T>(key, defaultValue);

  const [data, setDataLocal] = useState<T>(slot.data);
  const [isLoading, setIsLoading] = useState(!slot.loaded);

  // Subscribe to store changes from any hook instance sharing the same key
  useEffect(() => {
    slot.subscribers.add(setDataLocal);
    return () => {
      slot.subscribers.delete(setDataLocal);
    };
  }, [slot]);

  // Load from HA — only when connected, skip if already loaded for this key
  useEffect(() => {
    if (connectionStatus !== 'connected') return;
    if (slot.loaded) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    console.log(`[HassStore:${key}] Loading...`);

    sendMessage<{ value: T | null }>({ type: 'frontend/get_user_data', key })
      .then(res => {
        console.log(`[HassStore:${key}] Loaded:`, JSON.stringify(res.value));
        if (!cancelled) notifyAll(slot, res.value ?? defaultValue);
      })
      .catch(err => {
        console.error(`[HassStore:${key}] Load failed:`, err);
        if (!cancelled) notifyAll(slot, defaultValue);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // defaultValue is intentionally excluded — it's only used as fallback on first load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectionStatus, sendMessage, key, slot]);

  // ── Write ─────────────────────────────────────────────────────────────────

  const setData = useCallback(
    async (value: T): Promise<void> => {
      console.log(`[HassStore:${key}] Saving:`, JSON.stringify(value));
      notifyAll(slot, value);
      try {
        await sendMessage({ type: 'frontend/set_user_data', key, value });
        console.log(`[HassStore:${key}] Save confirmed`);
      } catch (err) {
        console.error(`[HassStore:${key}] Save failed:`, err);
      }
    },
    [key, sendMessage, slot]
  );

  const patchData = useCallback(
    async (patch: Partial<T>): Promise<void> => {
      await setData({ ...slot.data, ...patch });
    },
    [setData, slot]
  );

  return { data, isLoading, setData, patchData };
}
