import { usePersonStatus } from '@/hooks/usePersonStatus';
import type { PersonConfig } from '@/config/people';
import { Card } from '../ui/card';
import { VolumeX, Vibrate, Footprints, Leaf, BatteryCharging } from 'lucide-react';

interface ProfileCardProps {
  config: PersonConfig;
  debug?: boolean;
}

// Tar emot entityId direkt från config

export function ProfileCard({ config, debug }: ProfileCardProps) {
  // Skapa entityIds-objekt för hooken
  const entityIds = {
    personEntityId: config.personEntityId,
    trackerEntityId: config.trackerEntityId,
    batteryEntityId: config.batteryEntityId,
    powerSaveEntityId: config.powerSaveEntityId,
    ringerModeEntityId: config.ringerModeEntityId,
    wifiEntityId: config.wifiEntityId,
    detectedActivityEntityId: config.detectedActivityEntityId,
    audioModeEntityId: config.audioModeEntityId,
    batteryStateEntityId: config.batteryStateEntityId,
  };
  const status = usePersonStatus(entityIds);

  // Logga status för felsökning
  if (debug && import.meta.env.DEV) {
    console.log(`ProfileCard for ${config.displayName}:`, status);
  }

  return (
    <Card className='w-full h-full flex flex-col items-center justify-center rounded-xl p-2 gap-2 overflow-hidden relative'>
      {/* Ikoner uppe till vänster */}
      <div className='absolute top-2 left-2 flex flex-row items-center gap-1 z-10'>
        {status.ringerMode === 'silent' && <VolumeX size={20} className='text-slate-400' />}
        {status.ringerMode === 'vibrate' && <Vibrate size={20} className='text-slate-400' />}
        {status.detectedActivity && status.detectedActivity !== 'still' && <Footprints size={20} className='text-slate-400' />}
      </div>

      {/* Stor avatar och namn */}
      <div className='flex flex-col items-center justify-center w-full pt-2'>
        <Avatar name={config.displayName} picture={status.entityPicture} size={96} />
        <span className='mt-2 text-lg font-semibold text-slate-100 text-center leading-tight'>{config.displayName}</span>
      </div>

      {/* Power save indikator, charging och batterinivå uppe till höger */}
      <div className='absolute top-2 right-2 flex flex-row items-center gap-1 z-10'>
        {status.isPowerSave && <Leaf size={15} className='text-green-500' />}
        {status.isCharging && <BatteryCharging size={15} className='text-yellow-400' />}
        {typeof status.batteryLevel === 'number' && <span className='text-xs text-slate-400 tabular-nums'>{status.batteryLevel}%</span>}
      </div>
    </Card>
  );
}

// ── Sub-komponenter ───────────────────────────────────────────────────────────

function Avatar({ name, picture, size = 56 }: { name: string; picture?: string | null; size?: number }) {
  const initials = name.slice(0, 2).toUpperCase();
  let imgSrc = picture ?? undefined;
  if (imgSrc && imgSrc.startsWith('/api/')) {
    imgSrc = `${import.meta.env.VITE_HASS_URL}${imgSrc}`;
  }
  return (
    <div className='relative shrink-0' style={{ width: size, height: size }}>
      {imgSrc ? (
        <img src={imgSrc} alt={name} className='w-full h-full rounded-full object-cover border-2 border-slate-700' />
      ) : (
        <div className='w-full h-full rounded-full bg-slate-700 flex items-center justify-center text-2xl font-bold text-slate-200'>
          {initials}
        </div>
      )}
    </div>
  );
}
