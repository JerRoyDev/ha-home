// PhoneStatusBar.tsx - Visar statusfält för mobilprofil
import React from 'react';
import { BatteryCharging, BatteryFull, BatteryMedium, BatteryLow, Volume2, VolumeX, Vibrate, Leaf } from 'lucide-react';

interface PhoneStatusBarProps {
  batteryLevel: number;
  isCharging: boolean;
  isPowerSave: boolean;
  ringMode: 'normal' | 'silent' | 'vibrate';
  size?: 'compact' | 'expanded';
}

const PhoneStatusBar: React.FC<PhoneStatusBarProps> = ({ batteryLevel, isCharging, isPowerSave, ringMode, size = 'compact' }) => {
  const isCompact = size === 'compact';
  const iconSize = isCompact ? 13 : 18;

  let BatteryIcon = BatteryFull;
  let batteryColor = 'text-success';
  if (isCharging) {
    BatteryIcon = BatteryCharging;
    batteryColor = 'text-warning';
  } else if (batteryLevel <= 20) {
    BatteryIcon = BatteryLow;
    batteryColor = 'text-destructive';
  } else if (batteryLevel <= 60) {
    BatteryIcon = BatteryMedium;
    batteryColor = 'text-warning';
  }

  const RingIcon = ringMode === 'silent' ? VolumeX : ringMode === 'vibrate' ? Vibrate : Volume2;

  return (
    <div className='relative w-full'>
      {/* Notch */}
      <div className={`absolute w-full h-full bg-black ${isCompact ? 'w-16 h-1.5 rounded-b-sm' : 'w-24 h-6 rounded-b-xl'}`} />
      <div
        className={`flex items-center justify-between w-full ${isCompact ? 'px-1 py-0' : 'px-4 py-1'} text-[11px] font-semibold relative z-10`}
      >
        <RingIcon size={iconSize} className='text-muted-foreground' />
        <div className='flex items-center gap-1'>
          {isPowerSave && <Leaf size={iconSize} className='text-success' />}
          {!isCompact && <BatteryIcon size={iconSize} className={batteryColor + ' -rotate-90'} />}
          <span className={`font-semibold ${batteryColor} ${isCompact ? 'text-[12px]' : 'text-[16px]'}`}>{batteryLevel}%</span>
        </div>
      </div>
    </div>
  );
};

export default PhoneStatusBar;
