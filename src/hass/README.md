# HassProvider — React/TypeScript

Full-featured React provider for Home Assistant built on [`home-assistant-js-websocket`](https://github.com/home-assistant/home-assistant-js-websocket).

## Install

```bash
npm i home-assistant-js-websocket
```

Copy the `src/` folder into your project (e.g. `src/hass/`).

## File structure

```
src/hass/
├── index.ts                      ← barrel export (import everything from here)
├── types/
│   └── hass.types.ts             ← all types
├── providers/
│   ├── HassContext.ts            ← React context
│   └── HassProvider.tsx          ← main provider
└── hooks/
    ├── useHass.ts                ← primary hook (connection, entities, config…)
    ├── useEntity.ts              ← useEntity / useEntities / useEntitiesByDomain
    ├── useCallService.ts         ← ergonomic service caller with loading state
    ├── useHassEvent.ts           ← subscribe to HA event bus
    └── useHassCollection.ts      ← raw getCollection() wrapper
```

## Quick start

### 1. Wrap your app

```tsx
// main.tsx
import { HassProvider } from "@/hass";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <HassProvider
    auth={{
      hassUrl: import.meta.env.VITE_HASS_URL,
      token: import.meta.env.VITE_HASS_TOKEN,
    }}
    setupRetry={5}
  >
    <App />
  </HassProvider>
);
```

### 2. `.env`

```env
VITE_HASS_URL=http://homeassistant.local:8123
VITE_HASS_TOKEN=your_long_lived_token_here
```

Create a long-lived token in HA: **Profile → Long-Lived Access Tokens → Create Token**

### 3. Read state

```tsx
import { useEntity, useCallService, useHass } from "@/hass";

function LightCard() {
  const light = useEntity("light.living_room");
  const { call, loading } = useCallService("light", "toggle");

  if (!light) return null;

  return (
    <button
      disabled={loading}
      onClick={() => call(undefined, { entity_id: light.entity_id })}
    >
      {light.attributes.friendly_name}: {light.state}
    </button>
  );
}
```

## API

### `<HassProvider>`

| Prop                 | Type                   | Required | Description                                  |
| -------------------- | ---------------------- | -------- | -------------------------------------------- |
| `auth.hassUrl`     | `string`             | ✅       | HA instance URL                              |
| `auth.token`       | `string`             | ✅*      | Long-lived access token                      |
| `auth.useOAuth`    | `boolean`            | ✅*      | Use OAuth2 redirect flow instead             |
| `setupRetry`       | `number`             | —       | Reconnect retries (default 3, -1 = infinite) |
| `onStatusChange`   | `(status) => void`   | —       | Connection status callback                   |
| `onEntitiesChange` | `(entities) => void` | —       | Fires on every entity update                 |

*Either `token` or `useOAuth: true` is required.

### Hooks

| Hook                                         | Returns                                                                   |
| -------------------------------------------- | ------------------------------------------------------------------------- |
| `useHass()`                                | Full context: connection, entities, config, services, user, callService… |
| `useEntity(entityId)`                      | Single `HassEntity \| undefined`                                         |
| `useEntities(ids[])`                       | Array of `HassEntity \| undefined`                                       |
| `useEntitiesByDomain(domain)`              | All entities for a domain                                                 |
| `useCallService(domain, service)`          | `{ call, loading, error }`                                              |
| `useHassEvent(type, callback)`             | Subscribes to HA event bus                                                |
| `useHassCollection(key, fetch, subscribe)` | Custom collection state                                                   |

### `useHass()` context shape

```ts
{
  connection: Connection | null
  connectionStatus: "idle" | "connecting" | "connected" | "disconnected" | "error"
  entities: HassEntities
  config: HassConfig | null
  services: HassServices
  user: HassUser | null
  haVersion: string | null
  error: string | null

  callService(domain, service, data?, target?): Promise<void>
  sendMessage<T>(message): Promise<T>
  subscribeToEvent(type, callback): Promise<UnsubscribeFn>
  reconnect(): void
  disconnect(): void
}
```
