import { useRef, useState } from 'react';
import { useCalendarStore } from './hooks/useCalendarStore';
import type { ResolvedCalendar } from './types/calendar.types';

// ─── Color presets ────────────────────────────────────────────────────────────

const COLOR_PRESETS = [
  '#60a5fa',
  '#38bdf8',
  '#34d399',
  '#4ade80',
  '#84cc16',
  '#facc15',
  '#fb923c',
  '#f87171',
  '#f472b6',
  '#e879f9',
  '#a78bfa',
  '#06b6d4',
];

// ─── ColorPicker ──────────────────────────────────────────────────────────────

function ColorPicker({ color, onChange }: { color: string; onChange: (c: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className='flex flex-wrap gap-2 pt-2 pb-1'>
      {COLOR_PRESETS.map(preset => (
        <button
          key={preset}
          onClick={() => onChange(preset)}
          className='w-5 h-5 rounded-full transition-all hover:scale-110 focus:outline-none'
          style={{
            backgroundColor: preset,
            outline: color === preset ? `2px solid ${preset}` : 'none',
            outlineOffset: '2px',
          }}
        />
      ))}
      <button
        onClick={() => inputRef.current?.click()}
        className='w-5 h-5 rounded-full border border-dashed border-slate-500 flex items-center justify-center text-slate-400 hover:border-slate-300 transition-colors text-[10px]'
        title='Annan färg'
      >
        +
        <input
          ref={inputRef}
          type='color'
          value={color}
          onChange={e => onChange(e.target.value)}
          className='sr-only'
        />
      </button>
    </div>
  );
}

// ─── CalendarRow ──────────────────────────────────────────────────────────────

function CalendarRow({
  calendar,
  onColorChange,
  onHiddenChange,
}: {
  calendar: ResolvedCalendar;
  onColorChange: (entityId: string, color: string) => void;
  onHiddenChange: (entityId: string, hidden: boolean) => void;
}) {
  const [colorOpen, setColorOpen] = useState(false);

  return (
    <div
      className={`rounded-lg border transition-colors ${
        calendar.hidden
          ? 'border-slate-800/60 bg-slate-900/20'
          : 'border-slate-700/40 bg-slate-800/30'
      }`}
    >
      <div className='flex items-center gap-3 px-3 py-2.5'>
        <button
          onClick={() => !calendar.hidden && setColorOpen(v => !v)}
          disabled={calendar.hidden}
          className='shrink-0 w-3 h-3 rounded-full transition-transform hover:scale-110 focus:outline-none disabled:opacity-30'
          style={{ backgroundColor: calendar.color }}
          title='Ändra färg'
        />

        <span
          className={`flex-1 text-sm truncate ${calendar.hidden ? 'text-slate-600' : 'text-slate-200'}`}
        >
          {calendar.name}
        </span>

        <button
          onClick={() => {
            onHiddenChange(calendar.entityId, !calendar.hidden);
            setColorOpen(false);
          }}
          className={`shrink-0 text-[10px] px-2 py-0.5 rounded-full border transition-colors ${
            calendar.hidden
              ? 'border-slate-600 text-slate-400 bg-slate-700/30 hover:text-slate-200'
              : 'border-slate-700 text-slate-500 hover:text-slate-300'
          }`}
        >
          {calendar.hidden ? 'visa' : 'dölj'}
        </button>
      </div>

      {colorOpen && !calendar.hidden && (
        <div className='px-3 pb-3 border-t border-slate-700/40'>
          <ColorPicker
            color={calendar.color}
            onChange={color => onColorChange(calendar.entityId, color)}
          />
        </div>
      )}
    </div>
  );
}

// ─── CalendarSettings ─────────────────────────────────────────────────────────

interface CalendarSettingsProps {
  calendarIds?: string[];
  onClose?: () => void;
}

export function CalendarSettings({ calendarIds, onClose }: CalendarSettingsProps) {
  // Read LIVE from store — not from a prop snapshot
  const { allCalendars, setColor, setHidden } = useCalendarStore();

  const relevant = calendarIds
    ? allCalendars.filter(c => calendarIds.includes(c.entityId))
    : allCalendars;

  const visible = relevant.filter(c => !c.hidden);
  const hidden = relevant.filter(c => c.hidden);

  return (
    <div className='flex flex-col h-full bg-slate-950 rounded-xl'>
      <div className='flex items-center justify-between px-4 py-3 border-b border-slate-800 shrink-0'>
        <span className='text-sm font-semibold text-slate-200'>Kalendrar</span>
        {onClose && (
          <button
            onClick={onClose}
            className='w-6 h-6 flex items-center justify-center rounded text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-colors'
          >
            ×
          </button>
        )}
      </div>

      <div className='flex-1 overflow-y-auto p-3 space-y-1.5' style={{ scrollbarWidth: 'none' }}>
        {visible.map(cal => (
          <CalendarRow
            key={cal.entityId}
            calendar={cal}
            onColorChange={setColor}
            onHiddenChange={setHidden}
          />
        ))}

        {hidden.length > 0 && (
          <>
            <p className='text-[10px] uppercase tracking-widest text-slate-600 px-1 pt-3 pb-1'>
              Dolda
            </p>
            {hidden.map(cal => (
              <CalendarRow
                key={cal.entityId}
                calendar={cal}
                onColorChange={setColor}
                onHiddenChange={setHidden}
              />
            ))}
          </>
        )}

        <p className='text-[10px] text-slate-700 text-center pt-4'>Sparas i Home Assistant</p>
      </div>
    </div>
  );
}
