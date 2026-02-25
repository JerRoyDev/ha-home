import { CalendarTest } from './components/calendar/CalendarTest';
import ProfileCard from './components/phoneCard/ProfileCard';

function FamilyPanel() {
  const baseUrl = import.meta.env.BASE_URL;
  return (
    <div className='grid grid-cols-[auto_1fr] gap-6 p-4 border rounded-2xl min-h-screen max-w-5xl mx-auto shadow-md'>
      {/* Sidokolumn med profilkort */}
      <div className='flex flex-col gap-4 '>
        <ProfileCard person='Jerry' /* avatarUrl={`${baseUrl}images/jerry-avatar.jpg`} */ mobile='jerrys_mobil' />
        <ProfileCard person='Alice' /* avatarUrl={`${baseUrl}images/alice-avatar.jpg`} */ mobile='alices_mobil' />
        <ProfileCard person='Linnea' /* avatarUrl={`${baseUrl}images/linnea-avatar.jpg`} */ mobile='vog_l29' />
        <ProfileCard person='Oliver' /* avatarUrl={`${baseUrl}images/oliver-avatar.jpg`} */ mobile='' />
      </div>
      {/* Huvudpanel (tom, redo för fler komponenter) */}
      <div className=''>
        <CalendarTest />
      </div>
    </div>
  );
}

export default FamilyPanel;
