import { useMemo } from 'react';
import { useHass } from '../context/HassProvider';
import { getEntityStateSafe } from '../lib/ha-entity-utils';

export interface HassProfileData {
  person: string;
  personAvatar?: string; // URL till personens avatar från entityn
  isHome: boolean;
  batteryLevel: number;
  isCharging: boolean;
  isPowerSave: boolean;
  ringMode: 'normal' | 'silent' | 'vibrate';
  location?: string;
  wifiNetwork?: string;
  lastSeen?: string;
  // Nytt: flaggor för tillgänglighet
  unavailable?: boolean; // true om någon viktig entity är otillgänglig
  batteryUnavailable?: boolean;
  personUnavailable?: boolean;
  mobileUnavailable?: boolean; // true om ALLA mobilrelaterade sensorer är otillgängliga
}

/**
 * Custom hook för att hämta profilinfo för en person och mobil från Home Assistant
 * @param person namn på person (t.ex. 'Jerry')
 * @param mobile namn på mobil entity (t.ex. 'jerrys_mobil')
 * @param debug om true, logga HassProfileData till konsolen
 * @returns HassProfileData
 */
import { useEffect } from 'react';
export function useHassPersonProfile(person: string, mobile: string, debug?: boolean): HassProfileData {
  const { entities } = useHass();

  // Definiera entity keys och deras entityId-strängar
  const entityKeys = [
    { key: 'person', id: `person.${person.toLowerCase()}` },
    { key: 'entityPicture', id: `` }, // specialhantering nedan
    { key: 'battery', id: `sensor.${mobile}_battery_level` },
    { key: 'batteryState', id: `sensor.${mobile}_battery_state` },
    { key: 'powerSave', id: `binary_sensor.${mobile}_power_save` },
    { key: 'ringMode', id: `sensor.${mobile}_ringer_mode` },
    { key: 'location', id: `sensor.${mobile}_geocoded_location` },
    { key: 'wifi', id: `sensor.${mobile}_wi_fi_connection` },
    { key: 'lastSeen', id: `sensor.${mobile}_last_seen` },
  ];

  // Bygg ett objekt med { value, unavailable } för varje entity
  const entityStates = useMemo(() => {
    const result: Record<string, { value?: string; unavailable: boolean }> = {};
    for (const { key, id } of entityKeys) {
      if (!id) {
        result[key] = { value: undefined, unavailable: true };
        continue;
      }
      result[key] = getEntityStateSafe(entities[id]);
    }
    return result;
  }, [person, mobile, entities]);

  // Mobilrelaterade sensorer för unavailable-koll
  const mobileUnavailable = ['battery', 'batteryState', 'powerSave', 'ringMode'].every(k => entityStates[k]?.unavailable);
  const personUnavailable = entityStates['person']?.unavailable;
  const unavailable = personUnavailable || mobileUnavailable;

  // Bygg övriga fält
  const isHome =
    !personUnavailable && typeof entityStates['person'].value === 'string' && entityStates['person'].value.toLowerCase() === 'home';
  const isCharging =
    !entityStates['battery'].unavailable &&
    typeof entityStates['batteryState'].value === 'string' &&
    ['charging', 'plugged_in'].includes(entityStates['batteryState'].value.toLowerCase());
  const isPowerSave = !entityStates['powerSave'].unavailable && entityStates['powerSave'].value === 'on';
  const batteryLevel = !entityStates['battery'].unavailable ? Number(entityStates['battery'].value) || 0 : 0;
  let ringMode: 'normal' | 'silent' | 'vibrate' = 'normal';
  const ringRaw = typeof entityStates['ringMode'].value === 'string' ? entityStates['ringMode'].value.toLowerCase() : '';
  if (ringRaw === 'silent') ringMode = 'silent';
  else if (ringRaw === 'vibrate') ringMode = 'vibrate';
  // Hämta person-entiteten
  const personEntity = entities[`person.${person.toLowerCase()}`];
  // Hämta baseUrl från miljövariabel
  const baseUrl = import.meta.env.VITE_HA_URL;
  // Hämta entity_picture och prefixa med baseUrl om det är en relativ path
  let entityPicture = undefined;
  if (personEntity && personEntity.attributes && typeof personEntity.attributes.entity_picture === 'string') {
    entityPicture = personEntity.attributes.entity_picture;
    if (entityPicture.startsWith('/')) {
      entityPicture = baseUrl + entityPicture;
    }
  }

  const profileData: HassProfileData = {
    person,
    personAvatar: entityPicture,
    isHome,
    batteryLevel,
    isCharging,
    isPowerSave,
    ringMode,
    location: entityStates['location'].unavailable ? undefined : entityStates['location'].value,
    wifiNetwork: entityStates['wifi'].unavailable ? undefined : entityStates['wifi'].value,
    lastSeen: entityStates['lastSeen'].unavailable ? undefined : entityStates['lastSeen'].value,
    unavailable,
    batteryUnavailable: entityStates['battery'].unavailable,
    personUnavailable,
    mobileUnavailable,
  };

  useEffect(() => {
    if (debug) {
      // eslint-disable-next-line no-console
      console.log(`[Profile Debug] ${person} (${mobile}):`, profileData);
    }
  }, [debug, person, mobile, JSON.stringify(profileData)]);

  return profileData;
}
