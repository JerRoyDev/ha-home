// HassProvider.tsx - Context provider för Home Assistant-data

// HassProvider.tsx - Context provider för Home Assistant-data
import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { getAuth, createConnection, subscribeEntities, Connection } from 'home-assistant-js-websocket';
import type { HassEntities } from 'home-assistant-js-websocket';

interface HassContextType {
  entities: HassEntities;
  connection: Connection | null;
  loading: boolean;
  error: string | null; // Bra att ha för att visa felmeddelanden i UI:t
}

const HassContext = createContext<HassContextType | undefined>(undefined);

export const HassProvider = ({ children, url }: { children: ReactNode; url?: string }) => {
  const [entities, setEntities] = useState<HassEntities>({});
  const [connection, setConnection] = useState<Connection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let conn: Connection | null = null;

    const setup = async () => {
      try {
        // 1. getAuth hanterar hela inloggningsflödet.
        // Om du inte är inloggad, skickar den dig till HA:s inloggningssida och sedan tillbaka hit.
        // Den sparar automatiskt sessionen i webbläsarens localStorage.
        const auth = await getAuth({
          hassUrl: url || import.meta.env.VITE_HA_URL,
        });

        // 2. Skapa anslutningen med den säkra auth-sessionen
        conn = await createConnection({ auth });
        setConnection(conn);

        // 3. Lyssna på händelser ifall anslutningen svajar (bra för vägghängda plattor)
        conn.addEventListener('ready', () => {
          console.log('Återansluten till HA');
          setError(null);
        });

        conn.addEventListener('disconnected', () => {
          console.log('Tappade anslutningen till HA');
          setError('Tappade anslutningen till servern. Försöker återansluta...');
        });

        // 4. Prenumerera på all entitetsdata precis som förut
        unsubscribe = subscribeEntities(conn, ems => {
          setEntities(ems);
          setLoading(false);
        });
      } catch (err: any) {
        console.error('HA Connection Error:', err);
        setLoading(false);

        // Översätt Home Assistants felkoder till något användbart
        if (err === 1) setError('Kunde inte ansluta till servern (ERR_CANNOT_CONNECT).');
        else if (err === 2) setError('Ogiltig inloggning (ERR_INVALID_AUTH).');
        else if (err === 3) setError('Klienten avbröt anslutningen (ERR_CONNECTION_LOST).');
        else setError('Ett okänt fel uppstod vid anslutning till Home Assistant.');
      }
    };

    setup();

    return () => {
      if (unsubscribe) unsubscribe();
      if (conn) conn.close();
    };
  }, [url]);

  return <HassContext.Provider value={{ entities, connection, loading, error }}>{children}</HassContext.Provider>;
};

export const useHass = () => {
  const context = useContext(HassContext);
  if (!context) throw new Error('useHass måste användas inuti en HassProvider');
  return context;
};
