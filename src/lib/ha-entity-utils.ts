// Home Assistant entity helpers

/**
 * Returnerar true om entity är otillgänglig (unavailable/unknown/null)
 */

export function isEntityUnavailable(entity: { state?: string } | undefined | null): boolean {
  if (!entity || typeof entity.state !== 'string') return true;
  const s = entity.state.toLowerCase();
  return s === 'unavailable' || s === 'unknown';
}

// Overload for string state
export function getEntityStateSafe(entity: { state?: string } | undefined | null): { value?: string, unavailable: boolean };
// Generic overload
export function getEntityStateSafe<T>(entity: { state?: T } | undefined | null): { value?: T, unavailable: boolean };

/**
 * Returnerar { value, unavailable } för en entity
 * value = entity.state om tillgänglig, annars undefined
 */
export function getEntityStateSafe<T=string>(entity: { state?: T } | undefined | null): { value?: T, unavailable: boolean } {
  let unavailable: boolean;
  if (typeof (entity?.state) === 'string' || entity == null) {
    unavailable = isEntityUnavailable(entity as { state?: string } | undefined | null);
  } else {
    unavailable = entity == null;
  }
  return {
    value: !unavailable ? entity?.state : undefined,
    unavailable,
  };
}