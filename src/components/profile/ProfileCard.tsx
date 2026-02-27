// ProfileCard.tsx - Profilkort-komponent
import { useEffect } from 'react';
import { useHassPersonProfile } from '../../hooks/useHassPersonProfile';
import { Card } from '../ui/card';

interface ProfileCardProps {
  person: string;
  mobile?: string;
  debug?: boolean; // Om du vill visa rådata för felsökning
}

export const ProfileCard = ({ person, mobile, debug = false }: ProfileCardProps) => {
  const profileData = useHassPersonProfile(person, mobile);
  const { /* isHome, batteryLevel, isCharging, isPowerSave, ringMode, */ picture, /* raw, */ unavailable } = profileData;

  // För att se all data i konsolen när den uppdateras (bra för felsökning)
  useEffect(() => {
    if (debug) console.log('ProfileCard data:', profileData); // För att se all data i konsolen
  }, [profileData]);

  if (unavailable) {
    return (
      <div className='h-full w-full rounded-xl bg-teal-900 border border-destructive/30 p-3 flex flex-col items-center justify-center gap-2 overflow-hidden'>
        <span className='text-xs font-semibold text-slate-500 uppercase tracking-wider'>Profilkort</span>
        <p className='text-sm font-semibold text-destructive'>Data Unavailable</p>
      </div>
    );
  }

  return (
    <Card className='h-full w-full rounded-xl p-3 flex flex-col gap-2 overflow-hidden'>
      {/* Profilbild */}
      <img src={picture} alt={`${person}'s profile`} className='w-full h-auto rounded-full' />
    </Card>
  );
};
