// ─── Raw HA API shapes ────────────────────────────────────────────────────────

/**
 * HA's call_service calendar.get_events returns start/end as plain strings:
 *   - All-day:  "2026-03-02"                   (YYYY-MM-DD)
 *   - Timed:    "2026-03-04T17:00:00+01:00"    (ISO with offset)
 */
export interface HassCalendarEventRaw {
  start: string;
  end: string;
  summary: string;
  description?: string;
  location?: string;
  uid?: string;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export interface CalendarPrefs {
  color?: string;
  hidden?: boolean;
}

export interface CalendarStore {
  prefs: Record<string, CalendarPrefs>;
}

// ─── Resolved calendar ────────────────────────────────────────────────────────

export interface ResolvedCalendar {
  entityId: string;
  name: string;
  color: string;
  hidden: boolean;
}

// ─── Normalized event ─────────────────────────────────────────────────────────

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  location?: string;
  /** Local-time Date objects — never UTC-shifted */
  startDate: Date;
  endDate: Date;
  isAllDay: boolean;
  isMultiDay: boolean;
  calendarEntityId: string;
  calendarColor: string;
  calendarName: string;
  isPast: boolean;
}

// ─── Day ──────────────────────────────────────────────────────────────────────

export interface CalendarDay {
  date: Date;
  /** YYYY-MM-DD */
  dateKey: string;
  isToday: boolean;
  isWeekend: boolean;
  isPast: boolean;
  events: CalendarEvent[];
  multiDayStarts: CalendarEvent[];
  multiDayActive: CalendarEvent[];
}

// ─── Hook returns ─────────────────────────────────────────────────────────────

export interface UseCalendarStoreReturn {
  calendars: ResolvedCalendar[];
  allCalendars: ResolvedCalendar[];
  isLoading: boolean;
  setColor: (entityId: string, color: string) => Promise<void>;
  setHidden: (entityId: string, hidden: boolean) => Promise<void>;
}

export interface UseCalendarEventsReturn {
  days: CalendarDay[];
  isLoading: boolean;
  error: string | null;
  loadMoreFuture: () => void;
  loadMorePast: () => void;
  isLoadingMore: boolean;
  /** Only the calendars actually shown (respects calendarIds + hidden) */
  activeCalendars: ResolvedCalendar[];
  /** All calendars in store — for settings UI */
  allCalendars: ResolvedCalendar[];
  /** Force re-fetch all cached data */
  refresh: () => void;
}