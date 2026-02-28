// sync-types.ts - Script för att synkronisera Home Assistant-typer med TypeScript

import { createConnection, createLongLivedTokenAuth, getStates } from 'home-assistant-js-websocket';
// import { WS_URL } from 'home-assistant-js-websocket'; // Om du behöver formatera URL:en
import { writeFile } from 'fs/promises';
import * as dotenv from 'dotenv';
import { WebSocket } from 'ws'; // Du kan behöva installera: npm install --save-dev ws

import { resolve } from 'path';

// Ladda alla möjliga env-filer för att vara på säkra sidan
dotenv.config();
dotenv.config({ path: resolve(process.cwd(), '.env.local') });
dotenv.config({ path: resolve(process.cwd(), '.env.development') });

const url = process.env.VITE_HASS_URL!;
const token = process.env.VITE_HASS_TOKEN!;

console.log('Använder URL:', process.env.VITE_HASS_URL);
console.log('Token startar med:', process.env.VITE_HASS_TOKEN?.substring(0, 10) + '...');

async function sync() {
  try {
    console.log('🔄 Ansluter till Home Assistant för att synka typer...');

    // Vi behöver en WebSocket-polyfill för node-miljö
    // @ts-ignore
    global.WebSocket = WebSocket;

    const auth = createLongLivedTokenAuth(url, token);
    const connection = await createConnection({ auth });
    const states = await getStates(connection);

    const entityIds = states.map(s => s.entity_id).sort();

    // Skapa en union-typ av alla entity_ids
    const typeContent = `
/** * AUTOMATISKT GENERERAD FIL - ÄNDRA EJ 
 * Synkad: ${new Date().toLocaleString()}
 */

export type EntityName = 
  | ${entityIds.map(id => `'${id}'`).join('\n  | ')};

export type Domain = EntityName extends \`\${infer D}.\${string}\` ? D : never;
`;

    await writeFile('./src/types/ha-entities.ts', typeContent.trim());

    console.log('✅ Typer synkade! Du hittar dem i src/types/ha-entities.ts');
    connection.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Synk misslyckades:', err);
    process.exit(1);
  }
}

sync();
