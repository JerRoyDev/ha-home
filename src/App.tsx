// App.tsx - Applikationens rotkomponent
import { ThemeProvider } from '@/components/theme-provider';

import { HashRouter, Route, Routes } from 'react-router-dom';
import FamilyPanel from './FamilyPanel';

function App() {
  return (
    <>
      <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
        <HashRouter>
          <Routes>
            <Route path='/family-panel' element={<FamilyPanel />} />
            {/* <Route path='/dashboard2' element={<Dashboard2 />} /> */}
            <Route path='*' element={<FamilyPanel />} />
          </Routes>
        </HashRouter>
      </ThemeProvider>
    </>
  );
}

export default App;
