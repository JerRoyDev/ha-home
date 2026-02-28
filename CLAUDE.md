# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A custom Home Assistant dashboard built as a React/TypeScript SPA. It connects to a Home Assistant instance via WebSocket, displays family member profiles and calendar events, and is deployed to the HA server's `/www/` directory to be served as a local resource.

## Commands

```bash
npm run dev          # Start Vite dev server
npm run build        # Type-check + build to ./dist (runs prettier first via prebuild)
npm run lint         # ESLint
npm run prettier     # Format all files with Prettier
npm run sync         # Sync HA entity types from live HA instance → src/types/ha-entities.ts
npm run deploy       # Build must run first; uploads ./dist to HA via SCP
```

## Environment Variables

A `.env` file is required at the root. `VITE_FOLDER_NAME` is also required at build time (Vite will exit if missing).

| Variable | Purpose |
|---|---|
| `VITE_FOLDER_NAME` | Subfolder name under `/www/` on HA (sets Vite `base`) |
| `VITE_HASS_URL` | URL to HA instance (e.g. `https://...`) |
| `VITE_SSH_USERNAME` | SSH user for deploy script |
| `VITE_SSH_PASSWORD` | SSH password for deploy script |
| `VITE_SSH_HOSTNAME` | IP/hostname for deploy script |
| `VITE_HASS_TOKEN` | Long-lived HA token used only by `npm run sync` (not `VITE_` prefixed so it stays server-side) |

## Architecture

### Data Flow

```
HassProvider (WebSocket auth + subscribeEntities)
  └─► HassContext { entities, connection, loading, error }
        ├─► useHassPersonProfile()  →  ProfileCard / ProfileModal
        └─► useHassCalendar()       →  CalendarTest
```

**`src/context/HassProvider.tsx`** — Single WebSocket connection to HA using `home-assistant-js-websocket`. Handles OAuth-style auth flow (`getAuth`), reconnection events, and broadcasts the full `HassEntities` map + `Connection` via context. The `useHass()` hook consumes this context and throws if used outside the provider.

**`src/hooks/useHassPersonProfile.ts`** — Derives typed profile data for a person from `entities`. Expects entity naming conventions: `person.<name>`, `sensor.<mobile>_battery_level`, `sensor.<mobile>_battery_state`, `sensor.<mobile>_geocoded_location`, `binary_sensor.<mobile>_power_save`, `sensor.<mobile>_ringer_mode`. Returns a `HassProfileData` object with computed booleans and a resolved avatar URL.

**`src/hooks/useHassCalendar.ts`** — Fetches calendar events via `connection.sendMessagePromise`. Tries `calendar/list_events` first, falls back to `call_service` with `return_response: true`.

### Type Safety for HA Entities

**`src/types/ha-entities.ts`** is **auto-generated** — do not edit manually. Run `npm run sync` to regenerate it from the live HA instance. It exports `EntityName` (union of all entity IDs) and `Domain` (inferred union of domains). Hooks cast entity lookups with `as EntityName` to get type safety.

### Routing

Uses `HashRouter` (required for HA local serving). Currently has one route: `/family-panel` (default catch-all).

### Vite Configuration

- `base` is set dynamically to `/local/<VITE_FOLDER_NAME>/` — this means `import.meta.env.BASE_URL` in components returns the correct asset path for images served from the HA `/www/` folder.
- Path alias `@` → `./src`

### UI Stack

- **Tailwind CSS v4** via `@tailwindcss/vite` plugin (no `tailwind.config.js` needed)
- **shadcn/ui** components in `src/components/ui/` (configured via `components.json`)
- **lucide-react** for icons
- `cn()` utility in `src/lib/utils.ts` combines `clsx` + `tailwind-merge`

### Deploy Script (`scripts/deploy.ts`)

Uploads `./dist` to the HA server via SCP. Tries both `/config/www/` and `/homeassistant/www/` as remote root paths (HA uses either depending on installation type). Clears the existing remote directory before uploading.
