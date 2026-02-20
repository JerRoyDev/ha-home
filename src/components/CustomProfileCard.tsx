import React from 'react';
import { useEntity } from '@hakit/core';
import { Home, MapPin, Leaf, BatteryCharging, BatteryFull, BatteryMedium, BatteryLow, Volume2, VolumeX, Vibrate } from 'lucide-react';
import { Card } from './ui/card';

interface CompactProfileCardProps {
  person: string;
  avatarUrl: string;
  mobile: string;
}

const CompactProfileCard: React.FC<CompactProfileCardProps> = ({ person, avatarUrl, mobile }) => {
  const battery = useEntity(`sensor.${mobile}_battery_level`, { returnNullIfNotFound: true });
  const batteryState = useEntity(`sensor.${mobile}_battery_state`, { returnNullIfNotFound: true });
  // const location = useEntity(`sensor.${mobile}_geocoded_location`, { returnNullIfNotFound: true });
  const powerSave = useEntity(`binary_sensor.${mobile}_power_save`, { returnNullIfNotFound: true });
  const ringMode = useEntity(`sensor.${mobile}_ringer_mode`, { returnNullIfNotFound: true });
  const personEntity = useEntity(`person.${person.toLowerCase()}`, { returnNullIfNotFound: true });

  // Logik
  const isHome = personEntity?.state?.toLowerCase() === 'home';
  const isCharging = ['charging', 'plugged_in'].includes(batteryState?.state?.toLowerCase() || '');
  const isPowerSave = powerSave?.state === 'on';

  // Batteriikon-logik
  const batteryLevel = Number(battery?.state);
  let BatteryIcon = BatteryFull;
  let batteryIconColor = isCharging ? 'text-warning' : 'text-success';
  if (isCharging) {
    BatteryIcon = BatteryCharging;
  } else if (batteryLevel <= 20) {
    BatteryIcon = BatteryLow;
    batteryIconColor = 'text-red-500';
  } else if (batteryLevel <= 60) {
    BatteryIcon = BatteryMedium;
    batteryIconColor = 'text-yellow-500';
  } else {
    BatteryIcon = BatteryFull;
    batteryIconColor = 'text-success';
  }

  // Ring mode icon picker
  const getRingIcon = () => {
    const s = ringMode?.state?.toLowerCase();
    if (s === 'silent') return <VolumeX size={14} className='text-red-400' />;
    if (s === 'vibrate') return <Vibrate size={14} className='text-orange-400' />;
    return <Volume2 size={14} className='text-gray-400' />;
  };

  return (
    <Card className='relative w-32 h-56 rounded-xl shadow-md overflow-hidden bg-gradient-to-br from-background to-muted/20 border-2'>
      {/* Telefon notch */}
      <div className='absolute top-0 left-1/2 -translate-x-1/2 w-3 h-2 bg-background rounded-b-xl z-10 border-x border-b' />

      {/* Statusbar längst upp */}
      <div className='border relative pt-5 px-2 pb-1 bg-background/50 backdrop-blur-sm'>
        <div className='flex items-center justify-between'>
          {/* Vänster - ring mode */}
          <div className='flex items-center'>{getRingIcon()}</div>

          {/* Höger - batteri och power save */}
          <div className='flex items-center gap-0.5'>
            {isPowerSave && <Leaf size={10} className='text-green-500' />}
            <BatteryIcon size={12} className={batteryIconColor} style={{ transform: 'rotate(-90deg)' }} />
            <span className='text-[9px] font-medium text-foreground/80'>{battery?.state || '?'}%</span>
          </div>
        </div>
      </div>

      {/* Huvudinnehåll */}
      <div className='flex flex-col items-center justify-center px-3 py-4 gap-2'>
        {/* Avatar */}
        <div className='relative'>
          <div className={`absolute inset-0 rounded-full blur-sm ${isHome ? 'bg-primary/30' : 'bg-muted/30'}`} />
          <div className={`relative ring-2 ${isHome ? 'ring-primary/50' : 'ring-muted/50'} rounded-full overflow-hidden`}>
            <img src={avatarUrl} alt={person} className='w-16 h-16 object-cover' />
          </div>

          {/* Status badge */}
          <div className={`absolute -bottom-0.5 -right-0.5 p-1 rounded-full shadow-md ${isHome ? 'bg-primary' : 'bg-muted'}`}>
            {isHome ? <Home size={10} className='text-primary-foreground' /> : <MapPin size={10} className='text-muted-foreground' />}
          </div>
        </div>

        {/* Namn och status */}
        <div className='text-center'>
          <h3 className='font-bold text-sm text-foreground truncate max-w-full'>{person}</h3>
          <p className='text-[10px] text-muted-foreground'>{isHome ? 'Hemma' : 'Borta'}</p>
        </div>

        {/* Status badges
        {(isCharging || isPowerSave) && (
          <div className='flex items-center gap-1'>
            {isCharging && (
              <div className='flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-green-500/10 border border-green-500/20'>
                <BatteryCharging size={9} className='text-green-500' />
              </div>
            )}
            {isPowerSave && (
              <div className='flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-green-500/10 border border-green-500/20'>
                <Leaf size={9} className='text-green-500' />
              </div>
            )}
          </div>
        )} */}
      </div>

      {/* Home indicator */}
      <div className='absolute bottom-1.5 left-1/2 -translate-x-1/2 w-20 h-0.5 bg-foreground/20 rounded-full' />
    </Card>
  );
};

export default CompactProfileCard;
