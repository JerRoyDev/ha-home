import { useMemo } from 'react';
import { useHass } from './useHass';
import type { HassEntity } from 'home-assistant-js-websocket';

/**
 * Returns the current state of a single entity.
 * Returns `undefined` if the entity does not exist or entities are not yet loaded.
 *
 * @example
 * ```tsx
 * const light = useEntity("light.living_room");
 * console.log(light?.state); // "on" | "off" | undefined
 * console.log(light?.attributes.brightness);
 * ```
 */
export function useEntity(entityId: string): HassEntity | undefined {
  const { entities } = useHass();
  return useMemo(() => entities[entityId], [entities, entityId]);
}

/**
 * Returns multiple entities by their IDs as an array.
 * Returns `undefined` for each entity that doesn't exist yet.
 *
 * @example
 * ```tsx
 * const [light, sensor] = useEntities(["light.living_room", "sensor.temperature"]);
 * ```
 */
export function useEntities(entityIds: string[]): Array<HassEntity | undefined> {
  const { entities } = useHass();
  return useMemo(
    () => entityIds.map(id => entities[id]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [entities, entityIds.join(',')]
  );
}

/**
 * Returns all entities matching a given domain (e.g. "light", "sensor").
 *
 * @example
 * ```tsx
 * const lights = useEntitiesByDomain("light");
 * ```
 */
export function useEntitiesByDomain(domain: string): HassEntity[] {
  const { entities } = useHass();
  return useMemo(() => Object.values(entities).filter(e => e.entity_id.startsWith(`${domain}.`)), [entities, domain]);
}
