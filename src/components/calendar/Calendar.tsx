import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useCalendarEvents, type UseCalendarEventsOptions } from './hooks/useCalendarEvents';
import { CalendarSettings } from './CalendarSettings';
import type { CalendarDay, CalendarEvent } from './types/calendar.types';

// ─── Locale ───────────────────────────────────────────────────────────────────

const WEEKDAY_SHORT = ['Sön', 'Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör'];
const MONTH_NAMES = [
  'Januari',
  'Februari',
  'Mars',
  'April',
  'Maj',
  'Juni',
  'Juli',
  'Augusti',
  'September',
  'Oktober',
  'November',
  'December',
];

function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getWeekNumber(date: Date): number {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  return (
    1 +
    Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7)
  );
}

function isMonday(date: Date): boolean {
  return date.getDay() === 1;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });
}

function formatShortDate(date: Date): string {
  return `${date.getDate()}/${date.getMonth() + 1}`;
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface CalendarProps extends UseCalendarEventsOptions {}

// ─── MonthHeader — sticky at top ──────────────────────────────────────────────

function MonthHeader({ date }: { date: Date }) {
  return (
    <div className='sticky top-0 z-30 flex items-center justify-center bg-slate-950/96 backdrop-blur-sm border-b border-slate-800/60 py-2'>
      <span className='text-[11px] font-bold tracking-widest uppercase text-slate-300'>
        {MONTH_NAMES[date.getMonth()]} {date.getFullYear()}
      </span>
    </div>
  );
}

// ─── WeekHeader — sticky below month ─────────────────────────────────────────

function WeekHeader({ weekNumber }: { weekNumber: number }) {
  return (
    <div className='sticky top-[33px] z-20 flex items-center gap-2 px-2 py-[3px] bg-slate-950/90 backdrop-blur-sm'>
      <span className='text-[9px] font-bold tracking-widest text-slate-600 uppercase'>
        v.{weekNumber}
      </span>
      <div className='flex-1 h-px bg-slate-800/40' />
    </div>
  );
}

// ─── EventRow ─────────────────────────────────────────────────────────────────

function EventRow({ event, isPastDay }: { event: CalendarEvent; isPastDay: boolean }) {
  const past = isPastDay || event.isPast;

  return (
    <div
      className={`relative flex items-start py-1 pl-3 pr-1 rounded-md transition-colors
        ${past ? 'opacity-35' : 'hover:bg-slate-800/40'}`}
    >
      {/* Left color bar */}
      <div
        className='absolute left-0 top-[3px] bottom-[3px] w-[2px] rounded-full'
        style={{ backgroundColor: event.calendarColor }}
      />

      <div className='flex-1 min-w-0'>
        <span className='block text-[10px] text-slate-500 font-mono leading-none mb-[2px]'>
          {event.isAllDay
            ? event.isMultiDay
              ? `Heldag → ${formatShortDate(event.endDate)}`
              : 'Heldag'
            : formatTime(event.startDate) +
              (event.isMultiDay ? ` → ${formatShortDate(event.endDate)}` : '')}
        </span>
        <p className='text-[11px] font-medium text-slate-200 truncate leading-snug'>
          {event.title}
        </p>
        {event.location && (
          <p className='text-[10px] text-slate-500 truncate leading-none mt-[1px]'>
            {event.location}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Multi-day bar types ──────────────────────────────────────────────────────

interface ActiveBar {
  event: CalendarEvent;
  column: number;
}

/**
 * Compute bar assignments for every day in one pure top-down pass.
 * Returns a Map<dateKey, ActiveBar[]> with the bars visible on each day.
 *
 * This replaces the old useEffect/callback approach which caused
 * incremental render bugs — bars only appeared one-at-a-time across
 * re-renders because useEffect propagated state upward with a one-render lag.
 */
function computeBarsPerDay(days: CalendarDay[]): Map<string, ActiveBar[]> {
  const result = new Map<string, ActiveBar[]>();
  // Bars carried forward from the previous day
  let active: ActiveBar[] = [];

  for (const day of days) {
    const { dateKey, multiDayStarts } = day;

    // Drop bars whose event has ended before this day
    active = active.filter(b => toDateKey(b.event.endDate) >= dateKey);

    // Assign columns to new starters (find lowest unused column)
    const usedCols = new Set(active.map(b => b.column));
    for (const event of multiDayStarts) {
      let col = 0;
      while (usedCols.has(col)) col++;
      usedCols.add(col);
      active.push({ event, column: col });
    }

    result.set(dateKey, [...active]);
  }

  return result;
}

// ─── DayBlock ─────────────────────────────────────────────────────────────────

function DayBlock({ day, bars }: { day: CalendarDay; bars: ActiveBar[] }) {
  const { date, isToday, isPast, isWeekend, events } = day;
  const dateKey = day.dateKey;

  const BAR_W = 3;
  const BAR_GAP = 2;
  const maxCol = bars.length > 0 ? Math.max(...bars.map(b => b.column)) : -1;
  const barsWidth = bars.length > 0 ? (maxCol + 1) * (BAR_W + BAR_GAP) + BAR_GAP : 0;

  return (
    <div className='flex items-stretch min-h-[44px]'>
      {/* ── Date column ──────────────────────────────────────────────────── */}
      <div
        className={`shrink-0 w-10 flex flex-col items-center justify-start pt-2 border-r
          ${isToday ? 'border-blue-500/30 bg-blue-500/5' : 'border-slate-800/40'}`}
      >
        <span
          className={`text-[9px] font-semibold uppercase leading-none mb-0.5
            ${isToday ? 'text-blue-400' : isWeekend ? 'text-slate-500' : 'text-slate-600'}`}
        >
          {WEEKDAY_SHORT[date.getDay()]}
        </span>
        <span
          className={`text-[15px] font-bold leading-none
            ${isToday ? 'text-blue-300' : isPast ? 'text-slate-700' : isWeekend ? 'text-slate-400' : 'text-slate-300'}`}
        >
          {date.getDate()}
        </span>
      </div>

      {/* ── Events ───────────────────────────────────────────────────────── */}
      <div className='flex-1 min-w-0 py-1.5 px-1'>
        {events.length === 0 ? (
          <p className='text-[10px] text-slate-800 py-0.5 px-2'>—</p>
        ) : (
          <div className='flex flex-col gap-[2px]'>
            {events.map(event => (
              <EventRow key={event.id} event={event} isPastDay={isPast} />
            ))}
          </div>
        )}
      </div>

      {/* ── Multi-day right bars ─────────────────────────────────────────── */}
      {bars.length > 0 && (
        <div className='shrink-0 relative' style={{ width: barsWidth }}>
          {bars.map(({ event, column }) => {
            const isStart = toDateKey(event.startDate) === dateKey;
            const isEnd = toDateKey(event.endDate) === dateKey;
            return (
              <div
                key={event.id}
                className='absolute top-0 bottom-0'
                style={{
                  right: column * (BAR_W + BAR_GAP) + BAR_GAP,
                  width: BAR_W,
                  backgroundColor: `${event.calendarColor}60`,
                  borderTop: isStart ? `2px solid ${event.calendarColor}` : undefined,
                  borderBottom: isEnd ? `2px solid ${event.calendarColor}` : undefined,
                  borderRadius:
                    isStart && isEnd
                      ? '2px'
                      : isStart
                        ? '2px 2px 0 0'
                        : isEnd
                          ? '0 0 2px 2px'
                          : undefined,
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Calendar ─────────────────────────────────────────────────────────────────

export function Calendar({
  calendarIds,
  pastDays = 3,
  futureDays = 14,
  pageSize = 14,
}: CalendarProps) {
  const {
    days,
    isLoading,
    error,
    loadMoreFuture,
    isLoadingMore,
    activeCalendars,
    allCalendars,
    refresh,
  } = useCalendarEvents({
    calendarIds,
    pastDays,
    futureDays,
    pageSize,
  });

  const [showSettings, setShowSettings] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomSentinelRef = useRef<HTMLDivElement>(null);

  // Infinite scroll
  useEffect(() => {
    const el = bottomSentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoadingMore) loadMoreFuture();
      },
      { root: scrollRef.current, threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [isLoadingMore, loadMoreFuture]);

  // Compute multi-day bars in one pure top-down pass — no state, no useEffect
  const barsPerDay = useMemo(() => computeBarsPerDay(days), [days]);

  if (isLoading) {
    return (
      <div className='h-full flex items-center justify-center bg-slate-950 rounded-xl'>
        <span className='text-slate-500 text-sm animate-pulse'>Laddar kalender…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className='h-full flex flex-col items-center justify-center gap-3 bg-slate-950 rounded-xl p-4'>
        <p className='text-red-400 text-xs text-center'>{error}</p>
        <button
          onClick={refresh}
          className='text-xs text-slate-400 hover:text-slate-200 border border-slate-700 px-3 py-1 rounded transition-colors'
        >
          Försök igen
        </button>
      </div>
    );
  }

  if (showSettings) {
    return (
      <CalendarSettings
        activeCalendars={allCalendars.filter(c => !calendarIds || calendarIds.includes(c.entityId))}
        onClose={() => setShowSettings(false)}
      />
    );
  }

  let lastMonth = -1;
  let lastWeek = -1;

  return (
    <div className='h-full flex flex-col bg-slate-950 rounded-xl overflow-hidden'>
      {/* ── Scrollable list ──────────────────────────────────────────────── */}
      <div
        ref={scrollRef}
        className='flex-1 overflow-y-auto select-none'
        style={{ scrollbarWidth: 'none' }}
      >
        {days.map((day, _index) => {
          const month = day.date.getMonth();
          const week = getWeekNumber(day.date);
          const showMonth = month !== lastMonth;
          const showWeek = showMonth || isMonday(day.date) || week !== lastWeek;
          lastMonth = month;
          lastWeek = week;

          return (
            <React.Fragment key={day.dateKey}>
              {showMonth && <MonthHeader date={day.date} />}
              {!showMonth && showWeek && <WeekHeader weekNumber={week} />}
              <DayBlock day={day} bars={barsPerDay.get(day.dateKey) ?? []} />
            </React.Fragment>
          );
        })}

        <div ref={bottomSentinelRef} className='py-2 flex items-center justify-center'>
          {isLoadingMore && (
            <span className='text-[10px] text-slate-700 animate-pulse'>Laddar…</span>
          )}
        </div>
      </div>

      {/* ── Bottom toolbar ────────────────────────────────────────────────── */}
      <div className='shrink-0 border-t border-slate-800/60 px-3 py-1.5 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <span className='text-[10px] text-slate-700'>
            {activeCalendars.length} av {allCalendars.length} kalendrar
          </span>
          <button
            onClick={refresh}
            className='text-[10px] text-slate-600 hover:text-slate-300 transition-colors'
            title='Hämta ny data från HA'
          >
            ↻ Uppdatera
          </button>
        </div>
        <button
          onClick={() => setShowSettings(true)}
          className='text-[10px] text-slate-600 hover:text-slate-300 transition-colors px-2 py-1 rounded hover:bg-slate-800'
        >
          ⚙ Inställningar
        </button>
      </div>
    </div>
  );
}
