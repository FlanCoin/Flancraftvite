// src/App.js
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


// Lazy load para las secciones principales
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
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1282);
    };
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
  return (
    <div className="App">
      {isMobile ? <MobileNavbar /> : <Navbar />}

      {/* Rutas principales */}
      <Suspense fallback={<div>Cargando...</div>}>
        <Routes>
          <Route
            path="/"
            element={
              <>
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
              </>
            }
          />
          <Route path="/news" element={<NewsSection />} />
          <Route path="/news/:slug" element={<NewsPage />} />
          <Route path="/store" element={<Store />} />


          {/* Ruta independiente para StatsSection */}
          <Route path="/stats" element={<StatsSection />} />

          <Route path="*" element={<div>Página no encontrada</div>} />
        </Routes>
      </Suspense>

      <Footer />
    </div>
  );
}

export default App;
