// FamilyPanel.tsx - Huvudlayout för väggmonterad surfplatta (1024×768 liggande)
//
// Rutnät: 12 kolumner × 6 rader

// import ProfileCard from './components/phoneCard/ProfileCard';
import { ProfileCard } from './components/profile/ProfileCard';
import { CameraPreview } from './components/camera/CameraPreview';
import { MediaPlayer } from './components/media/MediaPlayer';
import { WeatherCard } from './components/weather/WeatherCard';
import { LightingControl } from './components/lighting/LightingControl';
import { Calendar } from './components/calendar/Calendar';
import { PEOPLE } from './config/people';

function FamilyPanel() {
  return (
    <div className='h-screen w-screen overflow-hidden p-3 grid grid-cols-12 grid-rows-6 gap-3 bg-background'>
      {/* nr1. Profilkort — kol 1–2, rad 1–6 */}
      <div className='col-span-2 row-span-6 flex flex-col gap-3 items-center'>
        <ProfileCard config={PEOPLE.jerry} />
        <ProfileCard config={PEOPLE.alice} />
        <ProfileCard config={PEOPLE.linnea} />
        <ProfileCard config={PEOPLE.oliver} />
      </div>

      {/* nr2. Kalender — kol 3–6, rad 1–3 */}
      <div className='col-span-4 row-span-3 col-start-3 overflow-y-auto rounded-xl'>
        <Calendar />
      </div>

      {/* nr3.  Kamera — kol 7–10, rad 1–3 */}
      <div className='col-span-4 row-span-2 col-start-7 row-start-1 overflow-hidden rounded-xl'>
        <CameraPreview />
      </div>

      {/* nr4. Väder — kol 7–12, rad 3–4 */}
      <div className='col-span-6 row-span-2 col-start-7 row-start-3'>
        <WeatherCard />
      </div>

      {/* nr5. Belysning — kol 7–12, rad 5–6 */}
      <div className='col-span-6 row-span-2 col-start-7 row-start-5'>
        <LightingControl />
      </div>

      {/* nr6. Mediaspelare — kol 3–6, rad 4–6 */}
      <div className='col-span-4 row-span-3 col-start-3 row-start-4 flex flex-col gap-3'>
        <MediaPlayer />
        <MediaPlayer />
        <MediaPlayer />
      </div>

      {/* nr7. diverse — kol 11–12, rad 1–2 */}
      <div className='col-span-2 row-span-2 col-start-11 row-start-1 flex flex-col gap-3'>
        <div className='h-full w-full rounded-xl bg-green-950 border border-slate-700/30 p-3 flex flex-col gap-2'>
          <span className='text-xs font-semibold text-slate-500 uppercase tracking-wider'>Diverse</span>
        </div>
      </div>
    </div>
  );
}

export default FamilyPanel;
