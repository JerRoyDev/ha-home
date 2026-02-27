// // CalendarTest.tsx - Testkomponent för kalender
// import { useHassCalendar } from '../../hooks/useHassCalendar';

// export const CalendarTest = () => {
//   // BYT UT DESSA mot dina faktiska entitets-ID:n i Home Assistant
//   const entities = ['calendar.alice', 'calendar.family'];
//   const { events, loading } = useHassCalendar(entities, 7);

//   if (loading) return <p>Hämtar kalenderhändelser...</p>;

//   return (
//     <div style={{ padding: '20px', background: '#1a1a1a', color: 'white', borderRadius: '12px' }}>
//       <h2>Kommande 7 dagar ({events.length} händelser)</h2>

//       {events.length === 0 ? (
//         <p>Inga händelser hittades.</p>
//       ) : (
//         <ul style={{ listStyle: 'none', padding: 0 }}>
//           {events.map((event, index) => (
//             <li
//               key={index}
//               style={{
//                 marginBottom: '15px',
//                 padding: '10px',
//                 borderLeft: `4px solid ${event.entity?.includes('peter') ? '#3498db' : '#e74c3c'}`,
//                 background: '#2a2a2a',
//               }}
//             >
//               <div style={{ fontWeight: 'bold' }}>{event.summary}</div>
//               <div style={{ fontSize: '0.85em', opacity: 0.8 }}>
//                 {new Date(event.start).toLocaleString('sv-SE', {
//                   weekday: 'long',
//                   day: 'numeric',
//                   month: 'short',
//                   hour: '2-digit',
//                   minute: '2-digit',
//                 })}
//               </div>
//               <div style={{ fontSize: '0.75em', color: '#aaa' }}>Källa: {event.entity}</div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };
