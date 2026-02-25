// FamilyPanel.tsx - Panel för familjeprofiler och kalender

import { CalendarTest } from './components/calendar/CalendarTest';
import ProfileCard from './components/phoneCard/ProfileCard';

function FamilyPanel() {

  return (
    <div className='grid grid-cols-[auto_1fr] gap-6 p-4 border rounded-2xl min-h-screen max-w-5xl mx-auto shadow-md'>
      {/* Sidokolumn med profilkort */}
      <div className='flex flex-col gap-4 '>
        <ProfileCard person='Jerry' mobile='jerrys_mobil' />
        <ProfileCard person='Alice' mobile='alices_mobil' />
        <ProfileCard person='Linnea' mobile='vog_l29' />
        <ProfileCard person='Oliver' mobile='' />
      </div>
      {/* Huvudpanel (tom, redo för fler komponenter) */}
      <div className=''>
        <CalendarTest />
      </div>
    </div>
  );
}

export default FamilyPanel;
