import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useCalendarEvents, type UseCalendarEventsOptions } from './hooks/useCalendarEvents';
import { CalendarSettings } from './CalendarSettings';
import type { CalendarDay, CalendarEvent } from './types/calendar.types';

// ─── Colours ──────────────────────────────────────────────────────────────────

const BG_BASE = '#181e2e';
const BG_MONTH = '#1f2845';
const BG_WEEK = '#1a2138';
const BG_WEEKEND = 'rgba(255,255,255,0.028)';
const BG_STICKY = 'rgba(22,29,48,0.97)';

// ─── Sticky heights — must match rendered heights exactly ─────────────────────

const MONTH_H = 38; // MonthHeader
const WEEK_H = 26; // WeekHeader

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
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function getWeekNumber(date: Date): number {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const w1 = new Date(d.getFullYear(), 0, 4);
  return (
    1 + Math.round(((d.getTime() - w1.getTime()) / 86400000 - 3 + ((w1.getDay() + 6) % 7)) / 7)
  );
}

function isMonday(d: Date): boolean {
  return d.getDay() === 1;
}

function formatTime(d: Date): string {
  return d.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });
}

function formatShortDate(d: Date): string {
  return `${d.getDate()}/${d.getMonth() + 1}`;
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface CalendarProps extends UseCalendarEventsOptions {}

// ─── MonthHeader ──────────────────────────────────────────────────────────────

function MonthHeader({ date }: { date: Date }) {
  return (
    <div
      className='sticky top-0 z-30 flex items-center justify-center border-b border-slate-600/40'
      style={{ backgroundColor: BG_MONTH, height: MONTH_H }}
    >
      <span className='text-[13px] font-bold tracking-widest uppercase text-slate-200'>
        {MONTH_NAMES[date.getMonth()]} {date.getFullYear()}
      </span>
    </div>
  );
}

// ─── WeekHeader ───────────────────────────────────────────────────────────────

function WeekHeader({ weekNumber, top }: { weekNumber: number; top: number }) {
  return (
    <div
      className='sticky z-20 flex items-center gap-2 px-3 border-b border-slate-700/30'
      style={{ top, backgroundColor: BG_WEEK, height: WEEK_H }}
    >
      <span className='text-[11px] font-bold tracking-widest text-slate-400 uppercase'>
        v.{weekNumber}
      </span>
      <div className='flex-1 h-px bg-slate-600/30' />
    </div>
  );
}

// ─── MultiDayBar types ────────────────────────────────────────────────────────

interface ActiveBar {
  event: CalendarEvent;
  column: number;
}

function computeBarsPerDay(days: CalendarDay[]): Map<string, ActiveBar[]> {
  const result = new Map<string, ActiveBar[]>();
  let active: ActiveBar[] = [];
  for (const day of days) {
    active = active.filter(b => toDateKey(b.event.endDate) >= day.dateKey);
    const used = new Set(active.map(b => b.column));
    for (const event of day.multiDayStarts) {
      let col = 0;
      while (used.has(col)) col++;
      used.add(col);
      active.push({ event, column: col });
    }
    result.set(day.dateKey, [...active]);
  }
  return result;
}

// ─── MultiDayBars — right-edge coloured strips ───────────────────────────────

const BAR_W = 4;
const BAR_GAP = 2;

function MultiDayBars({ bars, dateKey }: { bars: ActiveBar[]; dateKey: string }) {
  if (bars.length === 0) return null;
  const maxCol = Math.max(...bars.map(b => b.column));
  const totalW = (maxCol + 1) * (BAR_W + BAR_GAP) + BAR_GAP;
  return (
    <div className='shrink-0 relative self-stretch' style={{ width: totalW }}>
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
              backgroundColor: `${event.calendarColor}55`,
              borderTop: isStart ? `2px solid ${event.calendarColor}` : undefined,
              borderBottom: isEnd ? `2px solid ${event.calendarColor}` : undefined,
              borderRadius:
                isStart && isEnd ? 2 : isStart ? '2px 2px 0 0' : isEnd ? '0 0 2px 2px' : 0,
            }}
          />
        );
      })}
    </div>
  );
}

// ─── EventRow ─────────────────────────────────────────────────────────────────

function EventRow({ event, isPastDay }: { event: CalendarEvent; isPastDay: boolean }) {
  const past = isPastDay || event.isPast;
  const isAllDayLike = event.isAllDay || event.isMultiDay;

  let timeLabel: string;
  if (event.isAllDay) {
    timeLabel = event.isMultiDay ? `Heldag → ${formatShortDate(event.endDate)}` : 'Heldag';
  } else if (event.isMultiDay) {
    timeLabel = `${formatTime(event.startDate)} → ${formatShortDate(event.endDate)}`;
  } else {
    timeLabel = `${formatTime(event.startDate)} – ${formatTime(event.endDate)}`;
  }

  return (
    <div
      className={`relative flex items-start py-[5px] pl-3 pr-2 rounded-md transition-all
        ${past ? 'opacity-35' : 'hover:brightness-110'}`}
      style={isAllDayLike ? { backgroundColor: `${event.calendarColor}18` } : undefined}
    >
      <div
        className='absolute left-0 top-1 bottom-1 w-[3px] rounded-full'
        style={{ backgroundColor: event.calendarColor }}
      />
      <div className='flex-1 min-w-0'>
        <div className='flex items-center justify-between gap-1 mb-[2px]'>
          <span className='text-[11px] text-slate-400 font-mono leading-none'>{timeLabel}</span>
          <span
            className='shrink-0 text-[10px] font-medium truncate max-w-[72px] opacity-55'
            style={{ color: event.calendarColor }}
          >
            {event.calendarName}
          </span>
        </div>
        <p className='text-[13px] font-semibold text-slate-100 truncate leading-snug'>
          {event.title}
        </p>
        {event.location && (
          <p className='text-[11px] text-slate-500 truncate leading-none mt-0.5'>
            {event.location}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── DayBlock ─────────────────────────────────────────────────────────────────

function DayBlock({
  day,
  bars,
  todayRef,
}: {
  day: CalendarDay;
  bars: ActiveBar[];
  todayRef?: React.RefObject<HTMLDivElement | null>;
}) {
  const { date, isToday, isPast, isWeekend, events } = day;

  return (
    <div
      ref={todayRef}
      className='flex items-stretch min-h-[52px] border-b border-slate-600/20'
      style={{ backgroundColor: isWeekend ? BG_WEEKEND : undefined }}
    >
      {/* Date column */}
      <div
        className={`shrink-0 flex flex-col items-center justify-start pt-2 border-r
          ${isToday ? 'border-blue-500/40 bg-blue-500/5' : 'border-slate-700/40'}`}
        style={{ width: 52 }}
      >
        <span
          className={`text-[11px] font-semibold uppercase leading-none mb-1
          ${isToday ? 'text-blue-400' : isWeekend ? 'text-slate-400' : 'text-slate-500'}`}
        >
          {WEEKDAY_SHORT[date.getDay()]}
        </span>
        <span
          className={`text-[18px] font-bold leading-none
          ${isToday ? 'text-blue-300' : isPast ? 'text-slate-700' : isWeekend ? 'text-slate-300' : 'text-slate-200'}`}
        >
          {date.getDate()}
        </span>
      </div>

      {/* Events */}
      <div className='flex-1 min-w-0 py-1.5 px-2'>
        {events.length === 0 ? (
          <p className='text-[11px] text-slate-800 py-1 px-1'>—</p>
        ) : (
          <div className='flex flex-col gap-[3px]'>
            {events.map(e => (
              <EventRow key={e.id} event={e} isPastDay={isPast} />
            ))}
          </div>
        )}
      </div>

      {/* Right-edge colour bars */}
      <MultiDayBars bars={bars} dateKey={day.dateKey} />
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
  const { days, isLoading, error, loadMoreFuture, isLoadingMore, refresh } = useCalendarEvents({
    calendarIds,
    pastDays,
    futureDays,
    pageSize,
  });

  const [showSettings, setShowSettings] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomSentinelRef = useRef<HTMLDivElement>(null);
  const todayRef = useRef<HTMLDivElement>(null);

  // Scroll today into view on first load, compensating for sticky headers
  const hasScrolledToToday = useRef(false);
  useEffect(() => {
    if (hasScrolledToToday.current) return;
    if (!todayRef.current || !scrollRef.current) return;

    const container = scrollRef.current;
    const todayEl = todayRef.current;

    // offsetTop relative to the scroll container
    const offsetTop = todayEl.offsetTop;
    // Sticky headers above: month (always) + week (always below month)
    const stickyOffset = MONTH_H + WEEK_H;

    container.scrollTop = offsetTop - stickyOffset;
    hasScrolledToToday.current = true;
  }, [days]);

  useEffect(() => {
    const el = bottomSentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !isLoadingMore) loadMoreFuture();
      },
      { root: scrollRef.current, threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [isLoadingMore, loadMoreFuture]);

  const barsPerDay = useMemo(() => computeBarsPerDay(days), [days]);

  if (isLoading)
    return (
      <div
        className='h-full flex items-center justify-center rounded-xl'
        style={{ backgroundColor: BG_BASE }}
      >
        <span className='text-slate-400 text-sm animate-pulse'>Laddar kalender…</span>
      </div>
    );

  if (error)
    return (
      <div
        className='h-full flex flex-col items-center justify-center gap-3 rounded-xl p-4'
        style={{ backgroundColor: BG_BASE }}
      >
        <p className='text-red-400 text-sm text-center'>{error}</p>
        <button
          onClick={refresh}
          className='text-sm text-slate-400 hover:text-slate-200 border border-slate-600 px-3 py-1 rounded'
        >
          Försök igen
        </button>
      </div>
    );

  if (showSettings)
    return <CalendarSettings calendarIds={calendarIds} onClose={() => setShowSettings(false)} />;

  // Build render list.
  //
  // Multi-day events: the sticky title must only appear AFTER the start day
  // has scrolled out of view, and must disappear when the end day scrolls out.
  //
  // We achieve this by wrapping the continuation days (day after start -> end)
  // in a single <div>. The sticky title lives as the FIRST child of that wrapper.
  // CSS sticky keeps it visible while the wrapper is on screen and lets it
  // scroll away naturally when the wrapper bottom passes the viewport top.

  let lastMonth = -1;
  let lastWeek = -1;
  let monthActive = false;
  let weekActive = false;

  interface DayEntry {
    day: CalendarDay;
    bars: ActiveBar[];
    showMonth: boolean;
    showWeek: boolean;
    weekTop: number;
    titleTop: number;
    week: number;
  }

  const entries: DayEntry[] = days.map(day => {
    const month = day.date.getMonth();
    const week = getWeekNumber(day.date);
    const showMonth = month !== lastMonth;
    const showWeek = showMonth || isMonday(day.date) || week !== lastWeek;
    if (showMonth) {
      monthActive = true;
      weekActive = false;
    }
    if (showWeek) {
      weekActive = true;
    }
    lastMonth = month;
    lastWeek = week;
    const weekTop = monthActive ? MONTH_H : 0;
    const titleTop = monthActive
      ? weekActive
        ? MONTH_H + WEEK_H
        : MONTH_H
      : weekActive
        ? WEEK_H
        : 0;
    return {
      day,
      bars: barsPerDay.get(day.dateKey) ?? [],
      showMonth,
      showWeek,
      weekTop,
      titleTop,
      week,
    };
  });

  const dateKeyToIndex = new Map(entries.map((e, i) => [e.day.dateKey, i]));

  // Collect wrapper spans: one per multi-day event, fromIdx = startIdx+1, toIdx = endIdx
  const wrappers: Array<{
    fromIdx: number;
    toIdx: number;
    color: string;
    title: string;
    titleTop: number;
  }> = [];
  const seenEvents = new Set<string>();
  for (const { bars, titleTop } of entries) {
    for (const bar of bars) {
      if (seenEvents.has(bar.event.id)) continue;
      seenEvents.add(bar.event.id);
      const startIdx = dateKeyToIndex.get(toDateKey(bar.event.startDate));
      const endIdx = dateKeyToIndex.get(toDateKey(bar.event.endDate));
      if (startIdx === undefined || endIdx === undefined || endIdx <= startIdx) continue;
      wrappers.push({
        fromIdx: startIdx + 1,
        toIdx: endIdx,
        color: bar.event.calendarColor,
        title: bar.event.title,
        titleTop,
      });
    }
  }

  // Index wrappers by their start/end
  const wrapperStarts = new Map<number, (typeof wrappers)[0][]>();
  const wrapperEnds = new Map<number, (typeof wrappers)[0][]>();
  for (const w of wrappers) {
    if (!wrapperStarts.has(w.fromIdx)) wrapperStarts.set(w.fromIdx, []);
    wrapperStarts.get(w.fromIdx)!.push(w);
    if (!wrapperEnds.has(w.toIdx)) wrapperEnds.set(w.toIdx, []);
    wrapperEnds.get(w.toIdx)!.push(w);
  }

  type WrapBuf = { wrapper: (typeof wrappers)[0]; children: React.ReactNode[] };
  const openWrappers: WrapBuf[] = [];
  const rendered: React.ReactNode[] = [];

  const pushNode = (node: React.ReactNode) => {
    if (openWrappers.length > 0) {
      openWrappers[openWrappers.length - 1].children.push(node);
    } else {
      rendered.push(node);
    }
  };

  for (let i = 0; i < entries.length; i++) {
    const { day, bars, showMonth, showWeek, weekTop, /* titleTop, */ week } = entries[i];

    // Open wrappers starting here — add sticky title as first child
    for (const w of wrapperStarts.get(i) ?? []) {
      const buf: WrapBuf = {
        wrapper: w,
        children: [
          <div
            key='sticky-title'
            className='sticky z-10 px-1 py-[2px]'
            style={{ top: w.titleTop, backgroundColor: BG_STICKY }}
          >
            <div
              className='flex items-center gap-2 px-2 py-[4px] rounded text-[12px] font-medium'
              style={{
                backgroundColor: `${w.color}18`,
                borderLeft: `3px solid ${w.color}`,
                color: w.color,
              }}
            >
              <span className='flex-1 truncate opacity-85'>{w.title}</span>
            </div>
          </div>,
        ],
      };
      openWrappers.push(buf);
    }

    // Headers
    if (showMonth) pushNode(<MonthHeader key={`m-${day.dateKey}`} date={day.date} />);
    if (!showMonth && showWeek)
      pushNode(<WeekHeader key={`w-${day.dateKey}`} weekNumber={week} top={weekTop} />);
    // Day
    pushNode(
      <DayBlock
        key={day.dateKey}
        day={day}
        bars={bars}
        todayRef={day.isToday ? todayRef : undefined}
      />
    );

    // Close wrappers ending here
    for (const w of wrapperEnds.get(i) ?? []) {
      const idx = openWrappers.findIndex(b => b.wrapper === w);
      if (idx === -1) continue;
      const [buf] = openWrappers.splice(idx, 1);
      pushNode(<div key={`wrap-${w.fromIdx}-${w.toIdx}`}>{buf.children}</div>);
    }
  }

  // Flush any unclosed wrappers (event extends beyond loaded window)
  for (const buf of openWrappers) {
    rendered.push(<div key={`wrap-open-${buf.wrapper.fromIdx}`}>{buf.children}</div>);
  }

  return (
    <div
      className='h-full flex flex-col rounded-xl overflow-hidden'
      style={{ backgroundColor: BG_BASE }}
    >
      <div
        ref={scrollRef}
        className='flex-1 overflow-y-auto select-none'
        style={{ scrollbarWidth: 'none' }}
      >
        {rendered}
        <div ref={bottomSentinelRef} className='py-3 flex items-center justify-center'>
          {isLoadingMore && (
            <span className='text-[11px] text-slate-600 animate-pulse'>Laddar…</span>
          )}
        </div>
      </div>

      <div
        className='shrink-0 border-t border-slate-700/40 px-3 py-2 flex items-center justify-between'
        style={{ backgroundColor: BG_BASE }}
      >
        <button
          onClick={refresh}
          className='text-[11px] text-slate-500 hover:text-slate-200 transition-colors'
          title='Hämta ny data från HA'
        >
          ↻ Uppdatera
        </button>
        <button
          onClick={() => setShowSettings(true)}
          className='text-[11px] text-slate-500 hover:text-slate-200 transition-colors px-2 py-1 rounded hover:bg-slate-700/50'
        >
          ⚙ Inställningar
        </button>
      </div>
    </div>
  );
}
