// ─── Provider ─────────────────────────────────────────────────────────────────
export { HassProvider } from './providers/HassProvider';
export { HassContext } from './providers/HassContext';

// ─── Hooks ────────────────────────────────────────────────────────────────────
export { useHass } from './hooks/useHass';
export { useEntity, useEntities, useEntitiesByDomain } from './hooks/useEntity';
export { useCallService } from './hooks/useCallService';
export { useHassEvent } from './hooks/useHassEvent';
export { useHassCollection } from './hooks/useHassCollection';

// ─── Types ────────────────────────────────────────────────────────────────────
export type { HassContextValue, HassProviderProps, HassAuthConfig, ConnectionStatus } from './types/hass.types';

// ─── Re-export useful types from the library ──────────────────────────────────
export type { HassEntity, HassEntities, HassConfig, HassServices, HassUser, Connection } from 'home-assistant-js-websocket';
