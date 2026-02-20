import CustomProfileCard from './components/CustomProfileCard';

function FamilyPanel() {
  const baseUrl = import.meta.env.BASE_URL;
  return (
    // Container for the entire family panel
    <div className='flex justify-center gap-3 p-4 border border-white/50 rounded-2xl min-h-screen max-w-5xl mx-auto shadow-md'>
      {/* Profile Cards Container */}
      <div className='flex flex-row h-fit gap-3 border border-white p-4 shadow-md'>
        <CustomProfileCard person='Jerry' avatarUrl={`${baseUrl}images/jerry-avatar.jpg`} mobile='jerrys_mobil' />
        <CustomProfileCard person='Alice' avatarUrl={`${baseUrl}images/alice-avatar.jpg`} mobile='alices_mobil' />
        <CustomProfileCard person='Linnea' avatarUrl={`${baseUrl}images/linnea-avatar.jpg`} mobile='vog_l29' />
      </div>
    </div>
  );
}

export default FamilyPanel;
