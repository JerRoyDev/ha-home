// main.tsx - Entry point for React app
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { HassProvider } from './hass/index.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HassProvider
      auth={{
        hassUrl: import.meta.env.VITE_HASS_URL,
        token: import.meta.env.VITE_HASS_TOKEN,
      }}
      setupRetry={5}
    >
      <App />
    </HassProvider>
  </StrictMode>
);
