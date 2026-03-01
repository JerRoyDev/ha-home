/**
 * ─────────────────────────────────────────────────────────────────────────────
 * USAGE EXAMPLES
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── 1. Setup in main.tsx / App.tsx ──────────────────────────────────────────
/*
import { HassProvider } from "@/hass";

function App() {
  return (
    <HassProvider
      auth={{
        hassUrl: import.meta.env.VITE_HASS_URL,  // e.g. "http://homeassistant.local:8123"
        token: import.meta.env.VITE_HASS_TOKEN,   // Long-lived access token from HA profile
      }}
      setupRetry={5}
      onStatusChange={(status) => console.log("[HA] Status:", status)}
    >
      <MyDashboard />
    </HassProvider>
  );
}
*/

// ─── 2. OR: OAuth2 flow ───────────────────────────────────────────────────────
/*
<HassProvider auth={{ hassUrl: "http://homeassistant.local:8123", useOAuth: true }}>
  <App />
</HassProvider>
*/

// ─── 3. Reading connection state ──────────────────────────────────────────────
import { useHass } from '../hooks/useHass';

export function ConnectionStatus() {
  const { connectionStatus, error, haVersion, user } = useHass();

  if (connectionStatus === 'connecting') return <p>Connecting…</p>;
  if (connectionStatus === 'error') return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (connectionStatus === 'disconnected') return <p>Disconnected</p>;

  return (
    <div>
      <p>✅ Connected to Home Assistant {haVersion}</p>
      <p>User: {user?.name}</p>
    </div>
  );
}

// ─── 4. Single entity ─────────────────────────────────────────────────────────
import { useEntity } from '../hooks/useEntity';

export function LivingRoomLight() {
  const light = useEntity('light.living_room');
  if (!light) return null;

  return (
    <div>
      <strong>{light.attributes.friendly_name}</strong>
      <span>State: {light.state}</span>
      <span>Brightness: {light.attributes.brightness}</span>
    </div>
  );
}

// ─── 5. Calling a service ─────────────────────────────────────────────────────
import { useCallService } from '../hooks/useCallService';

export function ToggleLightButton() {
  const { call, loading } = useCallService('light', 'toggle');

  return (
    <button disabled={loading} onClick={() => call(undefined, { entity_id: 'light.living_room' })}>
      {loading ? 'Toggling…' : 'Toggle Light'}
    </button>
  );
}

// ─── 6. Advanced: call service with data ──────────────────────────────────────
export function BrightnessSetter() {
  const { callService } = useHass();

  const setBrightness = (value: number) =>
    callService('light', 'turn_on', { brightness: value }, { entity_id: 'light.living_room' });

  return <input type='range' onChange={e => setBrightness(Number(e.target.value))} />;
}

// ─── 7. All lights ────────────────────────────────────────────────────────────
import { useEntitiesByDomain } from '../hooks/useEntity';

export function AllLights() {
  const lights = useEntitiesByDomain('light');

  return (
    <ul>
      {lights.map(light => (
        <li key={light.entity_id}>
          {light.attributes.friendly_name}: {light.state}
        </li>
      ))}
    </ul>
  );
}

// ─── 8. Listening to HA events ───────────────────────────────────────────────
import { useHassEvent } from '../hooks/useHassEvent';

export function EventLogger() {
  useHassEvent('state_changed', event => {
    const e = event as { data: { entity_id: string; new_state: { state: string } } };
    console.log(`${e.data.entity_id} → ${e.data.new_state?.state}`);
  });
  return null;
}

// ─── 9. Sending arbitrary messages ───────────────────────────────────────────
export function PanelFetcher() {
  const { sendMessage } = useHass();

  const fetchPanels = async () => {
    const result = await sendMessage<{ panels: Record<string, unknown> }>({
      type: 'get_panels',
    });
    console.log('Panels:', result.panels);
  };

  return <button onClick={fetchPanels}>Fetch Panels</button>;
}

// ─── 10. Manual reconnect / disconnect ────────────────────────────────────────
export function ConnectionControls() {
  const { reconnect, disconnect, connectionStatus } = useHass();

  return (
    <div>
      <button onClick={reconnect} disabled={connectionStatus === 'connected'}>
        Reconnect
      </button>
      <button onClick={disconnect} disabled={connectionStatus === 'disconnected'}>
        Disconnect
      </button>
    </div>
  );
}
