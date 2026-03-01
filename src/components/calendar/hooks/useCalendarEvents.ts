import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useHass } from '@/hass';
import { useCalendarStore } from './useCalendarStore';
import type {
  CalendarDay,
  CalendarEvent,
  HassCalendarEventRaw,
  ResolvedCalendar,
  UseCalendarEventsReturn,
} from '../types/calendar.types';

// ─── Date helpers (timezone-safe) ────────────────────────────────────────────
//
// HA's call_service calendar.get_events returns start/end as plain strings:
//   - All-day events:  "2026-03-02"           (YYYY-MM-DD, no time)
//   - Timed events:    "2026-03-04T17:00:00+01:00"  (ISO with offset)
//
// IMPORTANT: new Date("2026-03-02") parses as UTC midnight, which in Sweden
// (UTC+1/+2) shifts to the previous day at 23:00. We must detect date-only
// strings and parse them in LOCAL time.

const DATE_ONLY_RE = /^\d{4}-\d{2}-\d{2}$/;

function isDateOnlyString(str: string): boolean {
  return DATE_ONLY_RE.test(str);
}

/** Parse a YYYY-MM-DD string into local midnight (avoids UTC shift) */
function parseDateOnly(str: string): Date {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d, 0, 0, 0, 0);
}

/**
 * Parse a HA date string — either plain date "2026-03-02" or
 * full ISO "2026-03-04T17:00:00+01:00".
 */
function parseHassDateString(str: string): Date {
  if (!str) return new Date(NaN);
  return isDateOnlyString(str) ? parseDateOnly(str) : new Date(str);
}

function isValidDate(d: Date): boolean {
  return !isNaN(d.getTime());
}

/** All-day events have a date-only string (no "T" in the string) */
function isAllDayEvent(raw: HassCalendarEventRaw): boolean {
  return isDateOnlyString(raw.start);
}

/**
 * HA all-day event end dates are EXCLUSIVE (e.g. "sportlov" March 2-6 has end = March 7).
 * Subtract 1ms to get the last actual day.
 */
function normalizeAllDayEnd(end: Date): Date {
  return new Date(end.getTime() - 1);
}

/** Local-time YYYY-MM-DD key */
function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function localStartOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
}

function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function generateDayRange(from: Date, to: Date): Date[] {
  const days: Date[] = [];
  const cur = localStartOfDay(from);
  const end = localStartOfDay(to);
  while (cur <= end) {
    days.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return days;
}

function makeEventId(entityId: string, summary: string, start: string): string {
  return `${entityId}__${summary}__${start}`;
}

// ─── HA API ───────────────────────────────────────────────────────────────────

type SendMessage = <T = unknown>(msg: Record<string, unknown>) => Promise<T>;

interface ServiceResponse {
  response: Record<string, { events: HassCalendarEventRaw[] }>;
}

async function fetchEventsFromHA(
  sendMessage: SendMessage,
  calendars: ResolvedCalendar[],
  from: Date,
  to: Date
): Promise<Map<string, HassCalendarEventRaw[]>> {
  if (calendars.length === 0) return new Map();

  // HA end is exclusive — add 1 day so we capture the full last day
  const startISO = from.toISOString();
  const endISO = addDays(to, 1).toISOString();

  const res = await sendMessage<ServiceResponse>({
    type: 'call_service',
    domain: 'calendar',
    service: 'get_events',
    service_data: { start_date_time: startISO, end_date_time: endISO },
    target: { entity_id: calendars.map(c => c.entityId) },
    return_response: true,
  });

  const result = new Map<string, HassCalendarEventRaw[]>();
  for (const cal of calendars) {
    result.set(cal.entityId, res.response?.[cal.entityId]?.events ?? []);
  }
  return result;
}

// ─── Normalize raw HA events → CalendarEvent[] ────────────────────────────────

function normalizeEvents(
  rawByCalendar: Map<string, HassCalendarEventRaw[]>,
  calendars: ResolvedCalendar[]
): Map<string, CalendarEvent[]> {
  const byDate = new Map<string, CalendarEvent[]>();

  for (const calendar of calendars) {
    const rawEvents = rawByCalendar.get(calendar.entityId) ?? [];
    console.log(`[Cal] normalizeEvents: ${calendar.entityId} → ${rawEvents.length} raw events`);

    for (const raw of rawEvents) {
      console.log('[Cal] raw event:', raw.summary, 'start:', raw.start, 'end:', raw.end);
      const isAllDay = isAllDayEvent(raw);
      const startDate = parseHassDateString(raw.start);
      const endDateRaw = parseHassDateString(raw.end);

      if (!isValidDate(startDate) || !isValidDate(endDateRaw)) continue;

      // Normalize all-day end (exclusive → inclusive)
      const endDate = isAllDay ? normalizeAllDayEnd(endDateRaw) : endDateRaw;

      const startKey = toDateKey(startDate);
      const endKey = toDateKey(endDate);
      const isMultiDay = startKey !== endKey;

      const event: CalendarEvent = {
        id: raw.uid ?? makeEventId(calendar.entityId, raw.summary, startDate.toISOString()),
        title: raw.summary,
        description: raw.description,
        location: raw.location,
        startDate,
        endDate,
        isAllDay,
        isMultiDay,
        calendarEntityId: calendar.entityId,
        calendarColor: calendar.color,
        calendarName: calendar.name,
        isPast: endDate < new Date(),
      };

      // Place on every day the event spans
      const spanDays = generateDayRange(localStartOfDay(startDate), localStartOfDay(endDate));
      for (const day of spanDays) {
        const key = toDateKey(day);
        if (!byDate.has(key)) byDate.set(key, []);
        byDate.get(key)!.push(event);
      }
    }
  }

  return byDate;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export interface UseCalendarEventsOptions {
  /**
   * Limit to these entity IDs. Must be full entity IDs, e.g. "calendar.alice".
   * Omit to show all non-hidden calendars.
   */
  calendarIds?: string[];
  pastDays?: number;
  futureDays?: number;
  pageSize?: number;
}

export function useCalendarEvents({
  calendarIds,
  pastDays = 3,
  futureDays = 14,
  pageSize = 14,
}: UseCalendarEventsOptions = {}): UseCalendarEventsReturn {
  const { sendMessage } = useHass();
  const { calendars: storeCalendars, allCalendars, isLoading: storeLoading } = useCalendarStore();

  // ── Active calendars: store non-hidden, optionally filtered by prop ───────
  const activeCalendars = useMemo(() => {
    if (!calendarIds) return storeCalendars;
    return storeCalendars.filter(c => calendarIds.includes(c.entityId));
  }, [storeCalendars, calendarIds]);

  // Stable string key so we can detect actual list changes in effects
  const activeIdsKey = useMemo(
    () =>
      activeCalendars
        .map(c => c.entityId)
        .sort()
        .join(','),
    [activeCalendars]
  );

  const now = useMemo(() => localStartOfDay(new Date()), []);
  const [windowStart, setWindowStart] = useState(() => addDays(now, -pastDays));
  const [windowEnd, setWindowEnd] = useState(() => addDays(now, futureDays));

  // ── Event cache ────────────────────────────────────────────────────────────
  const [eventsByDate, setEventsByDate] = useState<Map<string, CalendarEvent[]>>(new Map());

  // Tracks fetched ranges so we don't re-fetch unnecessarily.
  // Cleared on refresh() so data can be re-fetched.
  const fetchedRanges = useRef<Array<{ from: string; to: string }>>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Core fetch ────────────────────────────────────────────────────────────
  const doFetch = useCallback(
    async (from: Date, to: Date, isInitial: boolean) => {
      console.log('[Cal] doFetch called', {
        storeLoading,
        activeCalendarsCount: activeCalendars.length,
        activeIds: activeCalendars.map(c => c.entityId),
        from: from.toISOString(),
        to: to.toISOString(),
        isInitial,
      });
      if (storeLoading || activeCalendars.length === 0) {
        console.warn(
          '[Cal] doFetch aborted — storeLoading:',
          storeLoading,
          '| activeCalendars:',
          activeCalendars.length
        );
        return;
      }

      const fromKey = toDateKey(from);
      const toKey = toDateKey(to);

      const alreadyFetched = fetchedRanges.current.some(r => r.from <= fromKey && r.to >= toKey);
      if (alreadyFetched) return;

      isInitial ? setIsLoading(true) : setIsLoadingMore(true);
      setError(null);

      try {
        const raw = await fetchEventsFromHA(sendMessage, activeCalendars, from, to);
        console.log(
          '[Cal] Raw events from HA:',
          Object.fromEntries([...raw.entries()].map(([k, v]) => [k, v.length + ' events']))
        );
        const newByDate = normalizeEvents(raw, activeCalendars);
        console.log(
          '[Cal] Normalized events by date:',
          Object.fromEntries(
            [...newByDate.entries()]
              .filter(([, v]) => v.length > 0)
              .map(([k, v]) => [k, v.map(e => e.title)])
          )
        );

        setEventsByDate(prev => {
          const merged = new Map(prev);
          for (const [key, events] of newByDate) {
            const existing = merged.get(key) ?? [];
            const existingIds = new Set(existing.map(e => e.id));
            merged.set(key, [...existing, ...events.filter(e => !existingIds.has(e.id))]);
          }
          return merged;
        });

        fetchedRanges.current.push({ from: fromKey, to: toKey });
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : ((err as { message?: string })?.message ?? 'Kunde inte hämta kalender');
        setError(msg);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeIdsKey, storeLoading, sendMessage]
  );

  // ── Refresh: clears cache and re-fetches current window ──────────────────
  const refresh = useCallback(() => {
    fetchedRanges.current = [];
    setEventsByDate(new Map());
    setIsLoading(true);
    doFetch(windowStart, windowEnd, true);
  }, [doFetch, windowStart, windowEnd]);

  // ── Initial / re-fetch when calendar list changes ─────────────────────────
  useEffect(() => {
    console.log('[Cal] Initial fetch effect triggered', {
      storeLoading,
      activeIdsKey,
      activeCount: activeCalendars.length,
    });
    if (!storeLoading && activeCalendars.length > 0) {
      doFetch(windowStart, windowEnd, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeLoading, activeIdsKey]);

  // ── Re-color cached events when user changes a color ─────────────────────
  // Use a color map so we can detect actual color changes without
  // triggering on every render.
  const colorMapKey = useMemo(
    () => activeCalendars.map(c => `${c.entityId}:${c.color}`).join('|'),
    [activeCalendars]
  );

  useEffect(() => {
    setEventsByDate(prev => {
      // Only remap if the map is non-empty
      if (prev.size === 0) return prev;
      const colorById = new Map(activeCalendars.map(c => [c.entityId, c]));
      const next = new Map<string, CalendarEvent[]>();
      for (const [key, events] of prev) {
        next.set(
          key,
          events.map(e => {
            const cal = colorById.get(e.calendarEntityId);
            if (!cal) return e;
            if (cal.color === e.calendarColor && cal.name === e.calendarName) return e;
            return { ...e, calendarColor: cal.color, calendarName: cal.name };
          })
        );
      }
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorMapKey]);

  // ── Pagination ────────────────────────────────────────────────────────────
  const loadMoreFuture = useCallback(() => {
    const newEnd = addDays(windowEnd, pageSize);
    setWindowEnd(newEnd);
    doFetch(addDays(windowEnd, 1), newEnd, false);
  }, [windowEnd, pageSize, doFetch]);

  const loadMorePast = useCallback(() => {
    const newStart = addDays(windowStart, -pageSize);
    setWindowStart(newStart);
    doFetch(newStart, addDays(windowStart, -1), false);
  }, [windowStart, pageSize, doFetch]);

  // ── Build CalendarDay[] ───────────────────────────────────────────────────
  const days: CalendarDay[] = useMemo(() => {
    const today = localStartOfDay(new Date());
    const todayKey = toDateKey(today);
    const visibleIds = new Set(activeCalendars.map(c => c.entityId));

    return generateDayRange(windowStart, windowEnd).map(date => {
      const key = toDateKey(date);
      const dow = date.getDay();

      // Filter to only currently-visible calendars
      // (handles calendars hidden after events were cached)
      const allOnDay = (eventsByDate.get(key) ?? []).filter(e =>
        visibleIds.has(e.calendarEntityId)
      );

      const multiDayStarts = allOnDay.filter(e => e.isMultiDay && toDateKey(e.startDate) === key);
      const multiDayActive = allOnDay.filter(
        e => e.isMultiDay && toDateKey(e.startDate) !== key && toDateKey(e.endDate) >= key
      );

      const events = allOnDay
        .filter(e => !e.isMultiDay || toDateKey(e.startDate) === key)
        .sort((a, b) => {
          // All-day and multi-day first, then by start time
          const aFirst = a.isAllDay || a.isMultiDay;
          const bFirst = b.isAllDay || b.isMultiDay;
          if (aFirst && !bFirst) return -1;
          if (!aFirst && bFirst) return 1;
          return a.startDate.getTime() - b.startDate.getTime();
        });

      return {
        date,
        dateKey: key,
        isToday: key === todayKey,
        isWeekend: dow === 0 || dow === 6,
        isPast: date < today,
        events,
        multiDayStarts,
        multiDayActive,
      };
    });
  }, [windowStart, windowEnd, eventsByDate, activeCalendars]);

  return {
    days,
    isLoading: isLoading || storeLoading,
    error,
    loadMoreFuture,
    loadMorePast,
    isLoadingMore,
    activeCalendars,
    allCalendars,
    refresh,
  };
}
