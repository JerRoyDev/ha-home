import { useCallback, useState } from 'react';
import { useHass } from './useHass';

interface UseCallServiceReturn {
  /** Call the service. Returns a promise that resolves when complete. */
  call: (
    serviceData?: Record<string, unknown>,
    target?: {
      entity_id?: string | string[];
      area_id?: string | string[];
      device_id?: string | string[];
    }
  ) => Promise<void>;
  /** True while the service call is in flight */
  loading: boolean;
  /** Error thrown by the last call, if any */
  error: Error | null;
}

/**
 * Hook that returns a stable `call` function for a specific domain + service.
 * Tracks loading and error state for easy UI feedback.
 *
 * @example
 * ```tsx
 * const { call, loading } = useCallService("light", "turn_on");
 *
 * <button
 *   disabled={loading}
 *   onClick={() => call({ brightness: 255 }, { entity_id: "light.living_room" })}
 * >
 *   Turn On
 * </button>
 * ```
 */
export function useCallService(domain: string, service: string): UseCallServiceReturn {
  const { callService } = useHass();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const call = useCallback(
    async (
      serviceData?: Record<string, unknown>,
      target?: {
        entity_id?: string | string[];
        area_id?: string | string[];
        device_id?: string | string[];
      }
    ): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        await callService(domain, service, serviceData, target);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [callService, domain, service]
  );

  return { call, loading, error };
}
