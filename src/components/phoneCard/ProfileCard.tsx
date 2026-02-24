import React, { useState } from 'react';
// @ts-ignore
import { useEntity } from '@hakit/core';
import { Home, MapPin } from 'lucide-react';

import PhoneFrame from './PhoneFrame';

import ProfileModal from './ProfileModal';
import PhoneStatusBar from './PhoneStatusBar';

export interface ProfileData {
  person: string;
  avatarUrl: string;
  isHome: boolean;
  batteryLevel: number;
  isCharging: boolean;
  isPowerSave: boolean;
  ringMode: 'normal' | 'silent' | 'vibrate';
  location?: string;
  wifiNetwork?: string;
  lastSeen?: string;
}

interface ProfileCardProps {
  person: string;
  avatarUrl: string;
  mobile: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ person, avatarUrl, mobile }) => {
  // Hämta data från Home Assistant
  const battery = useEntity(`sensor.${mobile}_battery_level`, { returnNullIfNotFound: true });
  const batteryState = useEntity(`sensor.${mobile}_battery_state`, { returnNullIfNotFound: true });
  const powerSave = useEntity(`binary_sensor.${mobile}_power_save`, { returnNullIfNotFound: true });
  const ringModeEntity = useEntity(`sensor.${mobile}_ringer_mode`, { returnNullIfNotFound: true });
  const personEntity = useEntity(`person.${person.toLowerCase()}`, { returnNullIfNotFound: true });

  // Bygg ProfileData-objekt
  const isHome = personEntity?.state?.toLowerCase() === 'home';
  const isCharging = ['charging', 'plugged_in'].includes(batteryState?.state?.toLowerCase() || '');
  const isPowerSave = powerSave?.state === 'on';
  const batteryLevel = Number(battery?.state) || 0;
  let ringMode: 'normal' | 'silent' | 'vibrate' = 'normal';
  const ringRaw = ringModeEntity?.state?.toLowerCase();
  if (ringRaw === 'silent') ringMode = 'silent';
  else if (ringRaw === 'vibrate') ringMode = 'vibrate';

  const data: ProfileData = {
    person,
    avatarUrl,
    isHome,
    batteryLevel,
    isCharging,
    isPowerSave,
    ringMode,
  };

  // Modal state (placeholder, kan byggas ut)
  const [open, setOpen] = useState(false);

  return (
    <>
      <PhoneFrame size='compact' onClick={() => setOpen(true)}>
        <PhoneStatusBar
          batteryLevel={data.batteryLevel}
          isCharging={data.isCharging}
          isPowerSave={data.isPowerSave}
          ringMode={data.ringMode}
          size='compact'
        />
        {/* Main content */}
        <div className='flex-1 flex flex-col items-center justify-center gap-2 px-3'>
          {/* Avatar */}
          <div className='relative'>
            <div className='w-20 h-20 rounded-full overflow-hidden border-2 border-phone-highlight/30 shadow-lg'>
              <img src={data.avatarUrl} alt={data.person} className='w-full h-full object-cover' />
            </div>
            {/* Status dot */}
            <div
              className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-phone-screen flex items-center justify-center ${data.isHome ? 'bg-success' : 'bg-muted'}`}
            >
              {data.isHome ? (
                <Home size={12} className='text-success-foreground' />
              ) : (
                <MapPin size={12} className='text-muted-foreground' />
              )}
            </div>
          </div>
          {/* Name & status */}
          <div className='text-center'>
            <p className='text-sm font-semibold text-card-foreground'>{data.person}</p>
            {/* Visa inte hemma/borta i compact vy */}
            {/* {data.isHome ? 'Hemma' : 'Borta'} visas endast i expanded */}
          </div>
        </div>
      </PhoneFrame>
      <ProfileModal data={data} open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default ProfileCard;
