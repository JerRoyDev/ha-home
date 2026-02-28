import { /* useEntity, */ useEntities } from '@/hass';
import type { EntityName } from '@/types/ha-entities';

export interface PersonStatus {
  isHome: boolean;
  zone: string | null; // "home" | "work" | "not_home" | GPS-zonnamn
  batteryLevel: number | null; // 0–100
  isPowerSave: boolean;
  lastChanged: Date | null;
  stateLabel: string; // Redo att visa i UI
  isAvailable: boolean; // false = entiteten saknas/unavailable
  entityPicture?: string | null; // URL till profilbild
  ringerMode?: string | null;
  wifi?: string | null;
  detectedActivity?: string | null;
  audioMode?: string | null;
  isCharging?: boolean;
}

interface UsePersonStatusOptions {
  /** entity_id för person-integration, t.ex. "person.jerry" */
  personEntityId?: EntityName;
  /** entity_id för device_tracker, t.ex. "device_tracker.jerrys_mobil" */
  trackerEntityId?: EntityName;
  /** entity_id för batterisensor, t.ex. "sensor.jerrys_mobil_battery_level" */
  batteryEntityId?: EntityName;
  /** entity_id för strömsparläge, t.ex. "binary_sensor.jerrys_mobil_power_save" */
  powerSaveEntityId?: EntityName;
  /** entity_id för ringer mode */
  ringerModeEntityId?: EntityName;
  /** entity_id för wifi */
  wifiEntityId?: EntityName;
  /** entity_id för detected activity */
  detectedActivityEntityId?: EntityName;
  /** entity_id för audio mode */
  audioModeEntityId?: EntityName;
  /** entity_id för batteristatus, t.ex. "sensor.jerrys_mobil_battery_state" */
  batteryStateEntityId?: EntityName;
}

const ZONE_LABELS: Record<string, string> = {
  home: 'Hemma',
  not_home: 'Borta',
  work: 'Jobbet',
};

export function usePersonStatus({
  personEntityId,
  trackerEntityId,
  batteryEntityId,
  powerSaveEntityId,
  ringerModeEntityId,
  wifiEntityId,
  detectedActivityEntityId,
  audioModeEntityId,
  batteryStateEntityId,
}: UsePersonStatusOptions): PersonStatus {
  // Hämta alla entiteter i ett anrop (undviker flera re-renders)
  const [
    personEntity,
    trackerEntity,
    batteryEntity,
    powerSaveEntity,
    ringerModeEntity,
    wifiEntity,
    detectedActivityEntity,
    audioModeEntity,
    batteryStateEntity,
  ] = useEntities([
    personEntityId ?? '',
    trackerEntityId ?? '',
    batteryEntityId ?? '',
    powerSaveEntityId ?? '',
    ringerModeEntityId ?? '',
    wifiEntityId ?? '',
    detectedActivityEntityId ?? '',
    audioModeEntityId ?? '',
    batteryStateEntityId ?? '',
  ]);

  // Prioritera person-entiteten, fall tillbaka på device_tracker
  const presenceEntity = personEntity ?? trackerEntity;
  const rawState = presenceEntity?.state ?? null;

  const isAvailable = !!presenceEntity && presenceEntity.state !== 'unavailable';

  const isHome = rawState === 'home';
  const zone = rawState;
  const stateLabel = rawState != null ? (ZONE_LABELS[rawState] ?? rawState) : 'Okänd';

  const batteryLevel = batteryEntity?.state ? Math.round(Number(batteryEntity.state)) : null;

  const isPowerSave = powerSaveEntity?.state === 'on';

  // Charging status: batteryStateEntity?.state === 'charging' or 'full'
  const isCharging = batteryStateEntity?.state === 'charging' || batteryStateEntity?.state === 'full';

  const lastChangedRaw = presenceEntity?.last_changed;
  const lastChanged = lastChangedRaw ? new Date(lastChangedRaw) : null;

  // Hämta entity_picture från personEntity eller trackerEntity
  const entityPicture = personEntity?.attributes?.entity_picture || trackerEntity?.attributes?.entity_picture || null;

  return {
    isHome,
    zone,
    batteryLevel,
    isPowerSave,
    lastChanged,
    stateLabel,
    isAvailable,
    entityPicture,
    ringerMode: ringerModeEntity?.state ?? null,
    wifi: wifiEntity?.state ?? null,
    detectedActivity: detectedActivityEntity?.state ?? null,
    audioMode: audioModeEntity?.state ?? null,
    isCharging,
  };
}
