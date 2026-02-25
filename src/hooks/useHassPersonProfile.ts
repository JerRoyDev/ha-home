// useHassPersonProfile.ts - Custom hook för att hämta person- och mobilrelaterad data från Home Assistant
import { useMemo } from 'react';
import { useHass } from '../context/HassProvider';
import type { HassEntity } from 'home-assistant-js-websocket';

export interface HassProfileData {
  person: string;
  raw: {
    person?: HassEntity;
    battery?: HassEntity;
    batteryState?: HassEntity;
    location?: HassEntity;
    powerSave?: HassEntity;
    ringMode?: HassEntity;
    lastSeen?: HassEntity;
  };
  isHome: boolean;
  batteryLevel: number;
  isCharging: boolean;
  isPowerSave: boolean;
  ringMode: 'normal' | 'silent' | 'vibrate';
  // Detta är nu den slutgiltiga URL:en, färdig att användas i en <img />
  picture: string;
  unavailable: boolean;
}

export function useHassPersonProfile(person: string, mobile: string): HassProfileData {
  const { entities } = useHass();

  // 1. Hämta konfiguration för URL:er
  const haBaseUrl = import.meta.env.VITE_HA_URL || '';
  // assetBase kommer vara "/local/ha-dashboard/" (eller vad du satt i din config)
  const assetBase = import.meta.env.BASE_URL;

  const raw = useMemo(
    () => ({
      person: entities[`person.${person.toLowerCase()}`],
      battery: entities[`sensor.${mobile}_battery_level`],
      batteryState: entities[`sensor.${mobile}_battery_state`],
      location: entities[`sensor.${mobile}_geocoded_location`],
      powerSave: entities[`binary_sensor.${mobile}_power_save`],
      ringMode: entities[`sensor.${mobile}_ringer_mode`],
      lastSeen: entities[`sensor.${mobile}_last_seen`],
    }),
    [entities, person, mobile]
  );

  // 2. Beräkna Avatar-bilden
  const picture = useMemo(() => {
    const entityPicture = raw.person?.attributes?.entity_picture;
    const defaultAvatar = `${assetBase}images/avatar-default.svg`;

    if (entityPicture) {
      // Om det är en relativ HA-sökväg (/api/image...), lägg på HA-urlen
      return entityPicture.startsWith('/') ? `${haBaseUrl}${entityPicture}` : entityPicture;
    }

    return defaultAvatar;
  }, [raw.person, haBaseUrl, assetBase]);

  // 3. Resten av logiken
  const isHome = raw.person?.state?.toLowerCase() === 'home';
  const isCharging = ['charging', 'plugged_in'].includes(raw.batteryState?.state?.toLowerCase() || '');
  const batteryLevel = Number(raw.battery?.state) || 0;
  const isPowerSave = raw.powerSave?.state === 'on';
  const ringMode = (raw.ringMode?.state?.toLowerCase() || 'normal') as 'normal' | 'silent' | 'vibrate';
  const unavailable = !raw.person || raw.person.state === 'unavailable';

  return {
    person,
    raw,
    isHome,
    batteryLevel,
    isCharging,
    isPowerSave,
    ringMode,
    picture, // Den färdiga bilden!
    unavailable,
  };
}
