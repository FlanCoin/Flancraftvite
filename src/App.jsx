// src/App.jsx
import React, { Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import MobileNavbar from './components/MobileNavbar';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import { SectionProvider } from './context/SectionContext';
import './styles/App.css';
import './components/Sidebar.css';
import StatsSection from './components/StatsSection';
import Sanciones from './pages/Sanciones';
import AdminPanel from './pages/admin';
import Login from './pages/login';
import StaffPanel from './pages/staff';
import PerfilJugador from './pages/PerfilJugador';
import AnimatedPage from './components/AnimatedPage';
import { AnimatePresence } from 'framer-motion';

// Lazy load
const Lobby = React.lazy(() => import('./components/Lobby'));
const Dungeon = React.lazy(() => import('./components/Dungeon'));
const SlimeFun = React.lazy(() => import('./components/SlimeFun'));
const Crates = React.lazy(() => import('./components/Crates'));
const Quests = React.lazy(() => import('./components/Quests'));
const Play = React.lazy(() => import('./components/Play'));
const NewsSection = React.lazy(() => import('./components/news/NewsSection'));
const NewsPage = React.lazy(() => import('./components/news/NewsPage'));
const Store = React.lazy(() => import('./components/store/Store'));

const ScrollToTop = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    document.fonts.ready.then(() => {
      document.body.style.fontFamily = '"YourDefaultFont", sans-serif';
    });
  }, [location.pathname]);

  return null;
};

function App() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1282);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <LoadingScreen />
      <SectionProvider>
        <AppContent isMobile={isMobile} />
      </SectionProvider>
    </Router>
  );
}

function AppContent({ isMobile }) {
  const location = useLocation();

  return (
    <div className="App">
      {isMobile ? <MobileNavbar /> : <Navbar />}

      <Suspense fallback={<div>Cargando...</div>}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <AnimatedPage>
                  <Sidebar />
                  <div className="flancraft-container">
                    <div id="lobby" className="section">
                      <Lobby />
                    </div>
                    <div id="dungeon" className="section">
                      <Dungeon />
                    </div>
                    <div id="slimefun" className="section">
                      <SlimeFun />
                    </div>
                    <div id="crates" className="section">
                      <Crates />
                    </div>
                    <div id="quests" className="section">
                      <Quests />
                    </div>
                    <div id="play" className="section">
                      <Play />
                    </div>
                  </div>
                </AnimatedPage>
              }
            />

            {/* Animadas */}
            <Route path="/sanciones" element={<AnimatedPage><Sanciones /></AnimatedPage>} />
            <Route path="/perfil/:nombre" element={<AnimatedPage><PerfilJugador /></AnimatedPage>} />
            <Route path="/admin" element={<AnimatedPage><AdminPanel /></AnimatedPage>} />
            <Route path="/login" element={<AnimatedPage><Login /></AnimatedPage>} />
            <Route path="/staff" element={<AnimatedPage><StaffPanel /></AnimatedPage>} />
            <Route path="/stats" element={<AnimatedPage><StatsSection /></AnimatedPage>} />
            <Route path="/news" element={<AnimatedPage><NewsSection /></AnimatedPage>} />
            <Route path="/news/:slug" element={<AnimatedPage><NewsPage /></AnimatedPage>} />
            <Route path="/store" element={<AnimatedPage><Store /></AnimatedPage>} />

            <Route path="*" element={<AnimatedPage><div>Página no encontrada</div></AnimatedPage>} />
          </Routes>
        </AnimatePresence>
      </Suspense>

      <Footer />
    </div>
  );
}

export default App;
