import React, { useState } from 'react';
import { Home, MapPin } from 'lucide-react';
import PhoneFrame from './PhoneFrame';
import ProfileModal from './ProfileModal';
import PhoneStatusBar from './PhoneStatusBar';
import { useHassPersonProfile } from '../../hooks/useHassPersonProfile';

interface ProfileCardProps {
  person: string;
  avatarUrl?: string; // ex:  avatarUrl={`${baseUrl}images/jerry-avatar.jpg`}
  mobile: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ person, avatarUrl, mobile }) => {
  // Hämta data från Home Assistant via customhook
  const data = useHassPersonProfile(person, mobile);

  // Bestäm vilken bild som ska visas: prop > entityPicture > default
  const defaultAvatar = 'public/images/avatar-default.svg';
  const picture = avatarUrl || data.personAvatar || defaultAvatar;

  // Modal state
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
              <img src={picture} alt={data.person} className='w-full h-full object-cover' />
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
