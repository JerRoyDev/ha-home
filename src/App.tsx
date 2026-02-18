import { ThemeProvider } from '@hakit/components';
import { HassConnect } from '@hakit/core';
import { HashRouter, Route, Routes } from 'react-router-dom';
import FamilyPanel from './FamilyPanel';
import Dashboard2 from './Dashboard2';

function App() {
  return (
    <>
      <HassConnect hassUrl={import.meta.env.VITE_HA_URL} hassToken={import.meta.env.VITE_HA_TOKEN}>
        <ThemeProvider />
        <HashRouter>
          <Routes>
            <Route path='/family-panel' element={<FamilyPanel />} />
            <Route path='/dashboard2' element={<Dashboard2 />} />
            <Route path='*' element={<FamilyPanel />} />
          </Routes>
        </HashRouter>
      </HassConnect>
    </>
  );}

export default App;
