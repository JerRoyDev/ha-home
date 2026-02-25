import { useEffect, useState } from 'react';
import { useHass } from '../context/HassProvider';

export const useHassCalendar = (entityIds: string[], daysAhead = 7) => {
  const { connection } = useHass();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!connection) return;

    const fetchEvents = async () => {
      setLoading(true);
      const start = new Date().toISOString();
      const end = new Date();
      end.setDate(end.getDate() + daysAhead);

      try {
        const promises = entityIds.map(async id => {
          // I moderna HA använder vi 'calendar/get_events' via sendMessagePromise
          // Notera att parametrarna ligger direkt i objektet nu
          const response = await connection.sendMessagePromise<any>({
            type: 'calendar/list_events', // Prova först denna, det är den dedikerade endpointen
            entity_id: id,
            start_time: start,
            end_time: end.toISOString(),
          });

          return response.map((event: any) => ({ ...event, entity: id }));
        });

        const results = await Promise.all(promises);
        const flattened = results.flat().sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

        setEvents(flattened);
      } catch (err: any) {
        // Om 'calendar/list_events' misslyckas, kör vi fallback på det bredare 'call_service'
        console.warn('Första metoden misslyckades, testar fallback...', err);

        try {
          // Fallback metod:
          const response = await connection.sendMessagePromise<any>({
            type: 'call_service',
            domain: 'calendar',
            service: 'get_events',
            target: { entity_id: entityIds },
            service_data: {
              start_date_time: start,
              end_date_time: end.toISOString(),
            },
            return_response: true, // Viktigt för att få tillbaka datan!
          });

          // Bearbeta svaret (vid call_service ligger datan ofta i ett underobjekt)
          const allEvents: any[] = [];
          Object.keys(response.response).forEach(id => {
            const calendarEvents = response.response[id].events.map((e: any) => ({ ...e, entity: id }));
            allEvents.push(...calendarEvents);
          });

          setEvents(allEvents.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()));
        } catch (fallbackErr) {
          console.error('Båda metoderna misslyckades:', fallbackErr);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [connection, entityIds.join(','), daysAhead]);

  return { events, loading };
};
