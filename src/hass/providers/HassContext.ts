import { createContext } from 'react';
import type { HassContextValue } from '../types/hass.types';

export const HassContext = createContext<HassContextValue | null>(null);
HassContext.displayName = 'HassContext';
