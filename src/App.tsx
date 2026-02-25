// App.tsx - Applikationens rotkomponent
import { ThemeProvider } from '@/components/theme-provider';
import { HassProvider } from './context/HassProvider';
import { HashRouter, Route, Routes } from 'react-router-dom';
import FamilyPanel from './FamilyPanel';
// import Dashboard2 from './Dashboard2';

function App() {
  return (
    <>
      <HassProvider url={import.meta.env.VITE_HA_URL} token={import.meta.env.VITE_HA_TOKEN}>
        <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
          <HashRouter>
            <Routes>
              <Route path='/family-panel' element={<FamilyPanel />} />
              {/* <Route path='/dashboard2' element={<Dashboard2 />} /> */}
              <Route path='*' element={<FamilyPanel />} />
            </Routes>
          </HashRouter>
        </ThemeProvider>
      </HassProvider>
    </>
  );
}

export default App;
