import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { createConnection, createLongLivedTokenAuth, subscribeEntities, Connection } from 'home-assistant-js-websocket';
import type { HassEntities } from 'home-assistant-js-websocket';

interface HassContextType {
  entities: HassEntities;
  connection: Connection | null;
  loading: boolean;
}

const HassContext = createContext<HassContextType | undefined>(undefined);

export const HassProvider = ({ children, url, token }: { children: ReactNode; url: string; token: string }) => {
  const [entities, setEntities] = useState<HassEntities>({});
  const [connection, setConnection] = useState<Connection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: () => void;
    const setup = async () => {
      try {
        const auth = createLongLivedTokenAuth(url, token);
        const conn = await createConnection({ auth });
        setConnection(conn);
        unsubscribe = subscribeEntities(conn, ems => {
          setEntities(ems);
          setLoading(false);
        });
      } catch (err) {
        console.error('HA Connection Error:', err);
      }
    };
    setup();
    return () => {
      if (unsubscribe) unsubscribe();
      if (connection) connection.close();
    };
  }, [url, token]);

  return <HassContext.Provider value={{ entities, connection, loading }}>{children}</HassContext.Provider>;
};

// Din egen hook för att använda HA var som helst i appen
export const useHass = () => {
  const context = useContext(HassContext);
  if (!context) throw new Error('useHass must be used within HassProvider');
  return context;
};
