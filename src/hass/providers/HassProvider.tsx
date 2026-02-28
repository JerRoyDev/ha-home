import { useCallback, useEffect, useRef, useState } from 'react';
import {
  createConnection,
  createLongLivedTokenAuth,
  getAuth,
  subscribeEntities,
  subscribeConfig,
  subscribeServices,
  getUser,
  callService as hassCallService,
  ERR_HASS_HOST_REQUIRED,
  ERR_INVALID_AUTH,
  ERR_CANNOT_CONNECT,
  type Connection,
  type HassConfig,
  type HassEntities,
  type HassServices,
  type HassUser,
} from 'home-assistant-js-websocket';

import { HassContext } from './HassContext';
import type { ConnectionStatus, HassProviderProps } from '../types/hass.types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function mapErrorCode(code: unknown): string {
  switch (code) {
    case ERR_CANNOT_CONNECT:
      return 'Could not connect to Home Assistant. Check the URL and network.';
    case ERR_INVALID_AUTH:
      return 'Invalid authentication. Check your token or re-authenticate.';
    case ERR_HASS_HOST_REQUIRED:
      return 'Home Assistant host URL is required.';
    default:
      return `Unknown error: ${String(code)}`;
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export function HassProvider({ children, auth: authConfig, setupRetry = 3, onStatusChange, onEntitiesChange }: HassProviderProps) {
  const [connection, setConnection] = useState<Connection | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('idle');
  const [entities, setEntities] = useState<HassEntities>({});
  const [config, setConfig] = useState<HassConfig | null>(null);
  const [services, setServices] = useState<HassServices>({});
  const [user, setUser] = useState<HassUser | null>(null);
  const [haVersion, setHaVersion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Refs for cleanup and preventing stale closures
  const connectionRef = useRef<Connection | null>(null);
  const unsubscribeCallbacks = useRef<Array<() => void>>([]);
  const isMountedRef = useRef(true);

  // ── Status helper ──────────────────────────────────────────────────────────
  const updateStatus = useCallback(
    (status: ConnectionStatus) => {
      if (!isMountedRef.current) return;
      setConnectionStatus(status);
      onStatusChange?.(status);
    },
    [onStatusChange]
  );

  // ── Cleanup helper ─────────────────────────────────────────────────────────
  const cleanupSubscriptions = useCallback(() => {
    unsubscribeCallbacks.current.forEach(unsub => {
      try {
        unsub();
      } catch {
        // ignore errors on cleanup
      }
    });
    unsubscribeCallbacks.current = [];
  }, []);

  const cleanupConnection = useCallback(() => {
    cleanupSubscriptions();
    if (connectionRef.current) {
      try {
        connectionRef.current.close();
      } catch {
        // ignore
      }
      connectionRef.current = null;
    }
  }, [cleanupSubscriptions]);

  // ── Subscribe to all collections ───────────────────────────────────────────
  const setupSubscriptions = useCallback(
    (conn: Connection) => {
      // Entities
      const unsubEntities = subscribeEntities(conn, ents => {
        if (!isMountedRef.current) return;
        setEntities(ents);
        onEntitiesChange?.(ents);
      });

      // Config
      const unsubConfig = subscribeConfig(conn, cfg => {
        if (!isMountedRef.current) return;
        setConfig(cfg);
      });

      // Services
      const unsubServices = subscribeServices(conn, svcs => {
        if (!isMountedRef.current) return;
        setServices(svcs);
      });

      unsubscribeCallbacks.current.push(unsubEntities, unsubConfig, unsubServices);
    },
    [onEntitiesChange]
  );

  // ── Connect ────────────────────────────────────────────────────────────────
  const connect = useCallback(async () => {
    cleanupConnection();
    setError(null);
    updateStatus('connecting');

    try {
      let auth;

      if (authConfig.token) {
        // Long-lived access token flow
        auth = createLongLivedTokenAuth(authConfig.hassUrl, authConfig.token);
      } else if (authConfig.useOAuth) {
        // OAuth2 redirect flow
        try {
          auth = await getAuth({ hassUrl: authConfig.hassUrl });
        } catch (err) {
          if (err === ERR_HASS_HOST_REQUIRED) {
            auth = await getAuth({ hassUrl: authConfig.hassUrl });
          } else {
            throw err;
          }
        }
      } else {
        throw new Error('Either `token` or `useOAuth: true` must be provided in auth config.');
      }

      const conn = await createConnection({ auth, setupRetry });

      if (!isMountedRef.current) {
        conn.close();
        return;
      }

      connectionRef.current = conn;

      // ── Connection lifecycle events ──────────────────────────────────────
      conn.addEventListener('ready', () => {
        if (!isMountedRef.current) return;
        updateStatus('connected');
        setHaVersion(conn.haVersion);
      });

      conn.addEventListener('disconnected', () => {
        if (!isMountedRef.current) return;
        updateStatus('disconnected');
      });

      conn.addEventListener('reconnect-error', (_, errCode) => {
        if (!isMountedRef.current) return;
        updateStatus('error');
        setError(mapErrorCode(errCode));
      });

      // ── Fetch user ───────────────────────────────────────────────────────
      const hassUser = await getUser(conn);
      if (isMountedRef.current) {
        setUser(hassUser);
        setHaVersion(conn.haVersion);
      }

      // ── Subscribe to collections ─────────────────────────────────────────
      setupSubscriptions(conn);

      setConnection(conn);
      updateStatus('connected');
    } catch (err) {
      if (!isMountedRef.current) return;
      const message = mapErrorCode(err);
      setError(message);
      updateStatus('error');
      console.error('[HassProvider] Connection error:', err);
    }
  }, [authConfig, setupRetry, cleanupConnection, updateStatus, setupSubscriptions]);

  // ── Mount / unmount ────────────────────────────────────────────────────────
  useEffect(() => {
    isMountedRef.current = true;
    connect();

    return () => {
      isMountedRef.current = false;
      cleanupConnection();
    };
    // We deliberately only run this once (or when auth config changes)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authConfig.hassUrl, authConfig.token]);

  // ── Public API ─────────────────────────────────────────────────────────────

  const callService = useCallback(
    async (
      domain: string,
      service: string,
      serviceData?: Record<string, unknown>,
      target?: {
        entity_id?: string | string[];
        area_id?: string | string[];
        device_id?: string | string[];
      }
    ): Promise<void> => {
      if (!connectionRef.current) {
        throw new Error('Not connected to Home Assistant.');
      }
      await hassCallService(connectionRef.current, domain, service, serviceData, target);
    },
    []
  );

  const sendMessage = useCallback(async <T = unknown,>(message: Record<string, unknown>): Promise<T> => {
    if (!connectionRef.current) {
      throw new Error('Not connected to Home Assistant.');
    }
    // Ensure message has a 'type' property
    if (!('type' in message) || typeof message.type !== 'string') {
      throw new Error("Message must have a 'type' property of type string.");
    }
    return connectionRef.current.sendMessagePromise(message as any) as Promise<T>;
  }, []);

  const subscribeToEvent = useCallback(async (eventType: string, callback: (event: unknown) => void): Promise<() => void> => {
    if (!connectionRef.current) {
      throw new Error('Not connected to Home Assistant.');
    }
    const unsub = await connectionRef.current.subscribeEvents(callback, eventType);
    return unsub;
  }, []);

  const reconnect = useCallback(() => {
    connect();
  }, [connect]);

  const disconnect = useCallback(() => {
    cleanupConnection();
    setConnection(null);
    updateStatus('disconnected');
  }, [cleanupConnection, updateStatus]);

  // ── Context value ─────────────────────────────────────────────────────────
  const contextValue = {
    connection,
    connectionStatus,
    entities,
    config,
    services,
    user,
    haVersion,
    error,
    callService,
    sendMessage,
    subscribeToEvent,
    reconnect,
    disconnect,
  };

  return <HassContext.Provider value={contextValue}>{children}</HassContext.Provider>;
}
