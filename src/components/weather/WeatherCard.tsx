// WeatherCard.tsx - Väder/meteogram-komponent
export const WeatherCard = () => {
  return (
    <div className='h-full w-full rounded-xl bg-sky-950 border border-sky-700/20 p-3 flex flex-col gap-2'>
      <span className='text-xs font-semibold text-sky-400/60 uppercase tracking-wider'>Väder</span>
    </div>
  );
};
