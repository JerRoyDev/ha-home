import React from 'react';
import { Home, MapPin, Wifi, Clock, BatteryCharging, Leaf, Smartphone } from 'lucide-react';
import PhoneFrame from './PhoneFrame';
import PhoneStatusBar from './PhoneStatusBar';
import type { HassProfileData } from '@/hooks/useHassPersonProfile';

interface ProfileModalProps {
  data: HassProfileData;
  open: boolean;
  onClose: () => void;
}

const InfoRow: React.FC<{ icon: React.ReactNode; label: string; value: string; accent?: boolean }> = ({ icon, label, value, accent }) => (
  <div className='flex items-center gap-3 py-2.5 px-3 rounded-lg bg-phone-frame/50'>
    <div className={`${accent ? 'text-primary' : 'text-muted-foreground'}`}>{icon}</div>
    <div className='flex-1 min-w-0'>
      <p className='text-[10px] text-muted-foreground uppercase tracking-wider'>{label}</p>
      <p className={`text-sm font-medium truncate ${accent ? 'text-primary' : 'text-card-foreground'}`}>{value}</p>
    </div>
  </div>
);

const ProfileModal: React.FC<ProfileModalProps> = ({ data, open, onClose }) => {
  if (!open) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center' onClick={onClose}>
      {/* Backdrop */}
      <div className='absolute inset-0 bg-background/80 backdrop-blur-sm' />

      {/* Phone modal */}
      <div className='relative animate-slide-up' onClick={e => e.stopPropagation()}>
        <PhoneFrame size='expanded'>
          <PhoneStatusBar
            batteryLevel={data.batteryLevel}
            isCharging={data.isCharging}
            isPowerSave={data.isPowerSave}
            ringMode={data.ringMode}
            size='expanded'
          />

          {/* Scrollable content */}
          <div className='flex-1 overflow-y-auto px-5 py-3 space-y-4 scrollbar-none'>
            {/* Header with avatar */}
            <div className='flex flex-col items-center gap-3 pt-2 pb-4'>
              <div className='relative'>
                <div className='w-24 h-24 rounded-full overflow-hidden border-3 border-phone-highlight/40 shadow-xl'>
                  <img src={data.personAvatar} alt={data.person} className='w-full h-full object-cover' />
                </div>
                <div
                  className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-full border-2 border-phone-screen flex items-center justify-center ${data.isHome ? 'bg-success' : 'bg-muted'}`}
                >
                  {data.isHome ? (
                    <Home size={14} className='text-success-foreground' />
                  ) : (
                    <MapPin size={14} className='text-muted-foreground' />
                  )}
                </div>
              </div>
              <div className='text-center'>
                <h2 className='text-xl font-bold text-card-foreground'>{data.person}</h2>
                <p className={`text-sm font-medium ${data.isHome ? 'text-success' : 'text-muted-foreground'}`}>
                  {data.isHome ? 'Hemma' : 'Borta'}
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className='h-px bg-border' />

            {/* Info section */}
            <div className='space-y-2'>
              <p className='text-[11px] font-semibold text-muted-foreground uppercase tracking-widest px-1'>Enhetsinformation</p>

              <InfoRow icon={<Smartphone size={16} />} label='Enhet' value={`${data.person}s telefon`} />
              <InfoRow
                icon={<BatteryCharging size={16} />}
                label='Batteri'
                value={`${data.batteryLevel}%${data.isCharging ? ' · Laddar' : ''}`}
                accent={data.isCharging}
              />
              {data.isPowerSave && <InfoRow icon={<Leaf size={16} />} label='Energisparläge' value='Aktivt' accent />}
              {data.location && <InfoRow icon={<MapPin size={16} />} label='Plats' value={data.location} />}
              {data.wifiNetwork && <InfoRow icon={<Wifi size={16} />} label='Wi-Fi' value={data.wifiNetwork} />}
              {data.lastSeen && <InfoRow icon={<Clock size={16} />} label='Senast sedd' value={data.lastSeen} />}
            </div>

            {/* Status badges */}
            <div className='flex flex-wrap gap-2 pt-2'>
              {data.isHome && (
                <span className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success/15 text-success text-xs font-medium'>
                  <Home size={12} /> Hemma
                </span>
              )}
              {data.isCharging && (
                <span className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-warning/15 text-warning text-xs font-medium'>
                  <BatteryCharging size={12} /> Laddar
                </span>
              )}
              {data.isPowerSave && (
                <span className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success/15 text-success text-xs font-medium'>
                  <Leaf size={12} /> Energispar
                </span>
              )}
            </div>
          </div>
        </PhoneFrame>

        {/* Close hint */}
        <p className='text-center text-muted-foreground text-xs mt-4'>Tryck utanför för att stänga</p>
      </div>
    </div>
  );
};

export default ProfileModal;
