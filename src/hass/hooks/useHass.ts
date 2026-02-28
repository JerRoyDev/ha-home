import { useContext } from 'react';
import { HassContext } from '../providers/HassContext';
import type { HassContextValue } from '../types/hass.types';

/**
 * Primary hook for accessing the Home Assistant context.
 *
 * Must be used within a `<HassProvider>`.
 *
 * @example
 * ```tsx
 * const { entities, callService, connectionStatus } = useHass();
 * ```
 */
export function useHass(): HassContextValue {
  const ctx = useContext(HassContext);
  if (!ctx) {
    throw new Error('`useHass` must be used inside a `<HassProvider>`. ' + 'Wrap your component tree with `<HassProvider auth={...}>`.');
  }
  return ctx;
}
