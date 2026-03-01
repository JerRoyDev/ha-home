import { useCallback, useEffect, useMemo, useState } from 'react';
import { useEntitiesByDomain, useHass } from '@/hass';
import type {
  CalendarPrefs,
  CalendarStore,
  ResolvedCalendar,
  UseCalendarStoreReturn,
} from '../types/calendar.types';

const HA_STORE_KEY = 'ha-home/calendar-prefs';

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

export function useCalendarStore(): UseCalendarStoreReturn {
  const { sendMessage } = useHass();
  const calendarEntities = useEntitiesByDomain('calendar');

  const [store, setStore] = useState<CalendarStore>({ prefs: {} });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    sendMessage<{ value: CalendarStore | null }>({
      type: 'frontend/get_user_data',
      key: HA_STORE_KEY,
    })
      .then(res => {
        if (!cancelled) setStore(res.value ?? { prefs: {} });
      })
      .catch(() => {
        /* no saved data yet */
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [sendMessage]);

  const persist = useCallback(
    async (updated: CalendarStore) => {
      setStore(updated);
      await sendMessage({ type: 'frontend/set_user_data', key: HA_STORE_KEY, value: updated });
    },
    [sendMessage]
  );

  const setPref = useCallback(
    async (entityId: string, patch: Partial<CalendarPrefs>) => {
      await persist({
        prefs: { ...store.prefs, [entityId]: { ...store.prefs[entityId], ...patch } },
      });
    },
    [store, persist]
  );

  const setColor = useCallback(
    (entityId: string, color: string) => setPref(entityId, { color }),
    [setPref]
  );

  const setHidden = useCallback(
    (entityId: string, hidden: boolean) => setPref(entityId, { hidden }),
    [setPref]
  );

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
