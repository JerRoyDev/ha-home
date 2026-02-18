import CustomProfileCard from './components/CustomProfileCard';


function FamilyPanel() {
  return (
    // Container for the entire family panel
    <div className='flex justify-center gap-3 p-4 border border-white/50 rounded-2xl min-h-screen max-w-5xl mx-auto shadow-md'>
      {/* Profile Cards Container */}
      <div className='flex flex-row h-fit gap-3 border border-white p-4 shadow-md'>
        <CustomProfileCard name='Jerry' avatarUrl='public/images/jerry-avatar.jpg' mobile='jerrys_mobil' />
        <CustomProfileCard name='Alice' avatarUrl='public/images/alice-avatar.jpg' mobile='alices_mobil' />
        <CustomProfileCard name='Linnea' avatarUrl='public/images/linnea-avatar.jpg' mobile='linneas_mobil' />
      </div>
    </div>
  );
}

export default FamilyPanel;
