import type { Connection, HassConfig, HassEntities, HassServices, HassUser, AuthData } from 'home-assistant-js-websocket';

// ─── Connection State ────────────────────────────────────────────────────────

export type ConnectionStatus = 'idle' | 'connecting' | 'connected' | 'disconnected' | 'error';

// ─── Auth Config ─────────────────────────────────────────────────────────────

export interface HassAuthConfig {
  /** URL to the Home Assistant instance, e.g. "http://homeassistant.local:8123" */
  hassUrl: string;
  /** Long-lived access token (preferred for internal/app use) */
  token?: string;
  /** Use OAuth2 redirect flow instead of token */
  useOAuth?: boolean;
}

// ─── Context Value ───────────────────────────────────────────────────────────

export interface HassContextValue {
  /** Current connection to Home Assistant */
  connection: Connection | null;
  /** WebSocket connection status */
  connectionStatus: ConnectionStatus;
  /** All Home Assistant entities, keyed by entity_id */
  entities: HassEntities;
  /** Home Assistant configuration object */
  config: HassConfig | null;
  /** All available services */
  services: HassServices;
  /** Authenticated user info */
  user: HassUser | null;
  /** Home Assistant version string */
  haVersion: string | null;
  /** Error message if connection failed */
  error: string | null;

  // ── Actions ──────────────────────────────────────────────────────────────

  /**
   * Call a Home Assistant service.
   * @example callService("light", "turn_on", { brightness: 255 }, { entity_id: "light.living_room" })
   */
  callService: (
    domain: string,
    service: string,
    serviceData?: Record<string, unknown>,
    target?: { entity_id?: string | string[]; area_id?: string | string[]; device_id?: string | string[] }
  ) => Promise<void>;

  /**
   * Send an arbitrary message and get a typed response.
   */
  sendMessage: <T = unknown>(message: Record<string, unknown>) => Promise<T>;

  /**
   * Subscribe to a specific event type on the HA event bus.
   * Returns an unsubscribe function.
   */
  subscribeToEvent: (eventType: string, callback: (event: unknown) => void) => Promise<() => void>;

  /**
   * Manually trigger a reconnect attempt.
   */
  reconnect: () => void;

  /**
   * Close the current connection without reconnecting.
   */
  disconnect: () => void;
}

// ─── Provider Props ───────────────────────────────────────────────────────────

export interface HassProviderProps {
  children: React.ReactNode;
  /** Authentication configuration */
  auth: HassAuthConfig;
  /**
   * Number of reconnect retries on initial connection failure.
   * Use -1 for infinite retries. Default: 3.
   */
  setupRetry?: number;
  /**
   * Called when connection status changes.
   */
  onStatusChange?: (status: ConnectionStatus) => void;
  /**
   * Called on every entity state change.
   */
  onEntitiesChange?: (entities: HassEntities) => void;
}

// ─── Re-exports from library ─────────────────────────────────────────────────

export type { Connection, HassConfig, HassEntities, HassServices, HassUser, AuthData };
