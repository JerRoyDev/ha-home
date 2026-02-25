// ProfileCard.tsx - Visar kompakt profilkort för person
import React, { useState } from 'react';
import { Home, MapPin, AlertCircle } from 'lucide-react';
import PhoneFrame from './PhoneFrame';
import ProfileModal from './ProfileModal';
import PhoneStatusBar from './PhoneStatusBar';
import { useHassPersonProfile } from '../../hooks/useHassPersonProfile';

interface ProfileCardProps {
  person: string;
  mobile: string;
  debug?: boolean;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ person, mobile, debug }) => {
  // 1. Hämta datan rent och snyggt
  const data = useHassPersonProfile(person, mobile);

  const { isHome, batteryLevel, isCharging, isPowerSave, ringMode, picture, raw, unavailable } = data;

  // Modal state
  const [open, setOpen] = useState(false);

  if (debug) {
    console.log(`[ProfileCard Debug] ${person}:`, data);
  }

  return (
    <>
      <PhoneFrame size='compact' onClick={() => setOpen(true)}>
        {/* All data är redan färdigberäknad från hooken */}
        <PhoneStatusBar batteryLevel={batteryLevel} isCharging={isCharging} isPowerSave={isPowerSave} ringMode={ringMode} size='compact' />

        <div className='flex-1 flex flex-col items-center justify-center gap-2 px-3'>
          <div className='relative'>
            <div
              className={`w-20 h-20 rounded-full overflow-hidden border-2 shadow-lg transition-colors ${
                unavailable ? 'border-destructive/50 grayscale' : 'border-phone-highlight/30'
              }`}
            >
              <img src={picture} alt={person} className='w-full h-full object-cover' />
            </div>

            <div
              className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-phone-screen flex items-center justify-center shadow-sm ${
                unavailable ? 'bg-destructive' : isHome ? 'bg-success' : 'bg-muted'
              }`}
            >
              {unavailable ? (
                <AlertCircle size={12} className='text-white' />
              ) : isHome ? (
                <Home size={12} className='text-success-foreground' />
              ) : (
                <MapPin size={12} className='text-muted-foreground' />
              )}
            </div>
          </div>

          <div className='text-center'>
            <p className={`text-sm font-semibold ${unavailable ? 'text-muted-foreground' : 'text-card-foreground'}`}>{person}</p>
            {/* Tidsstämpel via raw-objektet ifall debug är igång */}
            {debug && raw.person?.last_updated && (
              <span className='text-[10px] text-muted-foreground block mt-1'>{new Date(raw.person.last_updated).toLocaleTimeString()}</span>
            )}
          </div>
        </div>
      </PhoneFrame>

      <ProfileModal data={data} open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default ProfileCard;
