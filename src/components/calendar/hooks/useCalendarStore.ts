import { useCallback, useMemo } from 'react';
import { useEntitiesByDomain, useHassStore } from '@/hass';
import type {
  CalendarPrefs,
  CalendarStore,
  ResolvedCalendar,
  UseCalendarStoreReturn,
} from '../types/calendar.types';

// ─── Constants ────────────────────────────────────────────────────────────────

const HA_STORE_KEY = 'ha-home/calendar-prefs';
const DEFAULT_STORE: CalendarStore = { prefs: {} };

const AUTO_COLORS = [
  '#60a5fa',
  '#34d399',
  '#f472b6',
  '#a78bfa',
  '#fb923c',
  '#38bdf8',
  '#4ade80',
  '#e879f9',
  '#facc15',
  '#06b6d4',
  '#f87171',
  '#84cc16',
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  return hash;
}

function autoColor(entityId: string): string {
  return AUTO_COLORS[hashString(entityId) % AUTO_COLORS.length];
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCalendarStore(): UseCalendarStoreReturn {
  const calendarEntities = useEntitiesByDomain('calendar');
  const {
    data: store,
    isLoading,
    setData,
  } = useHassStore<CalendarStore>(HA_STORE_KEY, DEFAULT_STORE);

  // ── Write ─────────────────────────────────────────────────────────────────

  const setPref = useCallback(
    async (entityId: string, patch: Partial<CalendarPrefs>): Promise<void> => {
      await setData({
        prefs: {
          ...store.prefs,
          [entityId]: { ...store.prefs[entityId], ...patch },
        },
      });
    },
    [setData, store.prefs]
  );

  const setColor = useCallback(
    async (entityId: string, color: string): Promise<void> => {
      await setPref(entityId, { color });
    },
    [setPref]
  );

  const setHidden = useCallback(
    async (entityId: string, hidden: boolean): Promise<void> => {
      await setPref(entityId, { hidden });
    },
    [setPref]
  );

  // ── Resolve entities → ResolvedCalendar ───────────────────────────────────

  const allCalendars: ResolvedCalendar[] = useMemo(
    () =>
      calendarEntities.map(entity => {
        const prefs = store.prefs[entity.entity_id] ?? {};
        return {
          entityId: entity.entity_id,
          name: entity.attributes.friendly_name ?? entity.entity_id.replace('calendar.', ''),
          color: prefs.color ?? autoColor(entity.entity_id),
          hidden: prefs.hidden ?? false,
        };
      }),
    [calendarEntities, store]
  );

  const calendars = useMemo(() => allCalendars.filter(c => !c.hidden), [allCalendars]);

  return { calendars, allCalendars, isLoading, setColor, setHidden };
}
