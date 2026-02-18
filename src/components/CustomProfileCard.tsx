import React from 'react';
import { useEntity } from '@hakit/core';
import type { EntityName } from '@hakit/core';
import { Home, MapPin, Leaf, BatteryCharging, Battery, Volume2, VolumeX, Vibrate } from 'lucide-react';
import { Card } from './ui/card';

interface CompactProfileCardProps {
  name: string;
  avatarUrl: string;
  mobile: string;
}

const CompactProfileCard: React.FC<CompactProfileCardProps> = ({ name, avatarUrl, mobile }) => {
  const battery = useEntity(`sensor.${mobile}_battery_level`, { returnNullIfNotFound: true });
  const batteryState = useEntity(`sensor.${mobile}_battery_state`, { returnNullIfNotFound: true });
  const location = useEntity(`sensor.${mobile}_geocoded_location`, { returnNullIfNotFound: true });
  const powerSave = useEntity(`binary_sensor.${mobile}_power_save`, { returnNullIfNotFound: true });
  const ringMode = useEntity(`sensor.${mobile}_ringer_mode`, { returnNullIfNotFound: true });

  // Logik
  const isHome = location?.state?.toLowerCase() === 'home';
  const isCharging = ['charging', 'plugged_in'].includes(batteryState?.state?.toLowerCase() || '');
  const isPowerSave = powerSave?.state === 'on';

  // Ring mode icon picker
  const getRingIcon = () => {
    const s = ringMode?.state?.toLowerCase();
    if (s === 'silent') return <VolumeX size={14} className='text-red-400' />;
    if (s === 'vibrate') return <Vibrate size={14} className='text-orange-400' />;
    return <Volume2 size={14} className='text-gray-400' />;
  };

  return (
    <Card className='flex flex-row gap-3 p-4 '>
      {/* Avatar */}
      <div className='relative shrink-0'>
        <img src={avatarUrl} className='w-12 h-12 rounded-2xl object-cover' />
        {isPowerSave && (
          <div className='absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5 border-2 border-[var(--card-bg)]'>
            <Leaf size={10} color='white' fill='white' />
          </div>
        )}
      </div>

      {/* Info - använder flex för vertikal alignment */}
      <div className='flex flex-col min-w-0'>
        <span className='font-bold truncate'>{name}</span>

        <div className='flex items-center gap-2 mt-0.5'>
          {/* Platsikon med vår CSS-färgvariabel via Tailwind-klasser vi skapat */}
          <span className={isHome ? 'text-primary' : 'text-muted'}>{isHome ? <Home size={16} /> : <MapPin size={16} />}</span>

          <div className='flex items-center gap-1'>
            <Battery size={16} className={isCharging ? 'text-warning' : 'text-success'} />
            <span className='text-xs font-medium text-muted'>{battery?.state}%</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CompactProfileCard;
