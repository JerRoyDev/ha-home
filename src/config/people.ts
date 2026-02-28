// src/config/people.ts
import type { EntityName } from '@/types/ha-entities';

export interface PersonConfig {
  displayName: string;
  personEntityId?: EntityName;
  trackerEntityId?: EntityName;
  batteryEntityId?: EntityName;
  powerSaveEntityId?: EntityName;
  batteryStateEntityId?: EntityName;
  geocodedLocationEntityId?: EntityName;
  ringerModeEntityId?: EntityName;
  wifiEntityId?: EntityName;
  detectedActivityEntityId?: EntityName;
  chargerTypeEntityId?: EntityName;
  batteryHealthEntityId?: EntityName;
  batteryTemperatureEntityId?: EntityName;
  audioModeEntityId?: EntityName;
  networkTypeEntityId?: EntityName;
  remainingChargeTimeEntityId?: EntityName;
  stepsSensorEntityId?: EntityName;
}

export const PEOPLE: Record<string, PersonConfig> = {
  jerry: {
    displayName: 'Jerry',
    personEntityId: 'person.jerry',
    trackerEntityId: 'device_tracker.vog_l29',
    batteryEntityId: 'sensor.jerrys_mobil_battery_level',
    powerSaveEntityId: 'binary_sensor.jerrys_mobil_power_save',
    batteryStateEntityId: 'sensor.jerrys_mobil_battery_state',
    geocodedLocationEntityId: 'sensor.jerrys_mobil_geocoded_location',
    ringerModeEntityId: 'sensor.jerrys_mobil_ringer_mode',
    wifiEntityId: 'sensor.jerrys_mobil_wi_fi_connection',
    detectedActivityEntityId: 'sensor.jerrys_mobil_detected_activity',
    audioModeEntityId: 'sensor.vog_l29_audio_mode',
  },
  alice: {
    displayName: 'Alice',
    personEntityId: 'person.alice',
    trackerEntityId: 'device_tracker.vog_l29',
    batteryEntityId: 'sensor.alices_mobil_battery_level',
    powerSaveEntityId: 'binary_sensor.alices_mobil_power_save',
    batteryStateEntityId: 'sensor.alices_mobil_battery_state',
    geocodedLocationEntityId: 'sensor.alices_mobil_geocoded_location',
    ringerModeEntityId: 'sensor.alices_mobil_ringer_mode',
    wifiEntityId: 'sensor.alices_mobil_wi_fi_connection',
    detectedActivityEntityId: 'sensor.alices_mobil_detected_activity',
    chargerTypeEntityId: undefined,
    batteryHealthEntityId: undefined,
    batteryTemperatureEntityId: undefined,
    audioModeEntityId: 'sensor.alices_mobil_audio_mode',
    networkTypeEntityId: undefined,
    remainingChargeTimeEntityId: undefined,
    stepsSensorEntityId: undefined,
  },
  linnea: {
    displayName: 'Linnea',
    personEntityId: 'person.linnea',
    trackerEntityId: 'device_tracker.vog_l29',
    batteryEntityId: 'sensor.vog_l29_battery_level',
    powerSaveEntityId: 'binary_sensor.vog_l29_power_save',
    batteryStateEntityId: 'sensor.vog_l29_battery_state',
    geocodedLocationEntityId: 'sensor.vog_l29_geocoded_location',
    ringerModeEntityId: 'sensor.vog_l29_audio_mode',
    wifiEntityId: 'sensor.vog_l29_wi_fi_connection',
    detectedActivityEntityId: 'sensor.vog_l29_detected_activity',
    chargerTypeEntityId: undefined,
    batteryHealthEntityId: 'sensor.vog_l29_battery_state',
    batteryTemperatureEntityId: undefined,
    audioModeEntityId: 'sensor.vog_l29_audio_mode',
    networkTypeEntityId: undefined,
    remainingChargeTimeEntityId: undefined,
    stepsSensorEntityId: undefined,
  },
  oliver: {
    displayName: 'Oliver',
    personEntityId: 'person.oliver',
    // Oliver har ingen telefon, endast personEntityId
  },
  tablet: {
    displayName: 'Tablet',
    personEntityId: 'person.tablet',
    trackerEntityId: 'device_tracker.sm_t550',
    batteryEntityId: 'sensor.sm_t550_battery_level',
    powerSaveEntityId: 'sensor.sm_t550_charger_type',
  },
};
