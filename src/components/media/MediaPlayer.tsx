// MediaPlayers.tsx - Behållare för tre staplade mediaspelare-komponenter
export const MediaPlayer = () => {
  return (
    <div className='h-full w-full flex flex-col gap-3'>
      <div className='flex-1 rounded-xl bg-violet-950 border border-violet-700/20 p-3 flex flex-col gap-2'>
        <span className='text-xs font-semibold text-violet-400/60 uppercase tracking-wider'>Mediaspelare</span>
      </div>
    </div>
  );
};
