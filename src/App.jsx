import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MarqueeTicker from './components/MarqueeTicker';
import Menu from './components/Menu';
import PackagingExperience from './components/PackagingExperience';
import Craftsmanship from './components/Craftsmanship';
import TastingNotes from './components/TastingNotes';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Cart from './components/Cart';
import MobileBottomDock from './components/MobileBottomDock';
import ComingSoon from './components/ComingSoon';
import AdminAuthModal from './components/admin/AdminAuthModal';
import AdminPortal from './components/admin/AdminPortal';
import TrackOrderModal from './components/TrackOrderModal';
import { useMenu } from './context/MenuContext';
import { useLenis } from './hooks/useLenis';

export default function App() {
  // Initialize smooth momentum scrolling on desktop
  useLenis();

  const { storeConfig } = useMenu();

  // Check if visitor entered via direct preview parameter/hash
  const checkInitialPreview = () => {
    if (typeof window === 'undefined') return false;
    const urlParams = new URLSearchParams(window.location.search);
    const hash = window.location.hash.toLowerCase();
    return urlParams.get('preview') === 'true' || hash.includes('preview');
  };

  // Check if visitor entered via admin parameter/hash
  const checkInitialAdmin = () => {
    if (typeof window === 'undefined') return false;
    const urlParams = new URLSearchParams(window.location.search);
    const hash = window.location.hash.toLowerCase();
    return urlParams.get('admin') === 'true' || hash.includes('admin');
  };

  // Check if visitor entered via track parameter/hash
  const checkInitialTrack = () => {
    if (typeof window === 'undefined') return false;
    const urlParams = new URLSearchParams(window.location.search);
    const hash = window.location.hash.toLowerCase();
    return urlParams.get('track') !== null || hash.includes('track');
  };

  const getInitialTrackId = () => {
    if (typeof window === 'undefined') return '';
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('track')) return urlParams.get('track');
    const hash = window.location.hash;
    if (hash.includes('track=')) return hash.split('track=')[1].split('&')[0];
    return '';
  };

  const [isPreviewMode, setIsPreviewMode] = useState(checkInitialPreview);
  const [isAdminOpen, setIsAdminOpen] = useState(checkInitialAdmin);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem('sukie_admin_auth') === 'authenticated';
  });

  const [isTrackOpen, setIsTrackOpen] = useState(checkInitialTrack);
  const [trackOrderId, setTrackOrderId] = useState(getInitialTrackId);

  // Helper to determine view from current hash
  const getViewFromHash = () => {
    if (typeof window === 'undefined') return 'menu';
    const hash = window.location.hash.toLowerCase();
    if (hash.includes('story') || hash.includes('about') || hash.includes('craftsmanship')) return 'story';
    if (hash.includes('ritual') || hash.includes('tasting') || hash.includes('warm')) return 'ritual';
    if (hash.includes('care') || hash.includes('complaint') || hash.includes('contact')) return 'care';
    if (hash.includes('all')) return 'all';
    return 'menu';
  };

  const [activeView, setActiveView] = useState(getViewFromHash);

  // Sync with browser back/forward and hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      const urlParams = new URLSearchParams(window.location.search);
      if (hash.includes('admin') || urlParams.get('admin') === 'true') {
        setIsAdminOpen(true);
      }
      if (hash.includes('preview')) {
        setIsPreviewMode(true);
      }
      if (hash.includes('track') || urlParams.get('track') !== null) {
        setIsTrackOpen(true);
        if (window.location.hash.includes('track=')) {
          setTrackOrderId(window.location.hash.split('track=')[1].split('&')[0]);
        } else if (urlParams.get('track')) {
          setTrackOrderId(urlParams.get('track'));
        }
      }
      const nextView = getViewFromHash();
      setActiveView(nextView);
      if (hash.includes('craftsmanship')) {
        setTimeout(() => {
          const el = document.getElementById('craftsmanship');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 400);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleViewChange = (newView) => {
    setActiveView(newView);
    window.location.hash = `#${newView}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseAdmin = () => {
    setIsAdminOpen(false);
    if (window.location.hash.toLowerCase().includes('admin')) {
      window.location.hash = '';
    }
  };

  // Determine whether Coming Soon is active based on storeConfig
  const isComingSoonActive = storeConfig?.isComingSoon !== false && !isPreviewMode;

  // Sync Brand Color Combination from Founder Studio live across CSS variables
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const primary = storeConfig?.primaryColor || '#0C419C';
    const accent = storeConfig?.accentColor || '#C5A059';
    const surface = storeConfig?.surfaceColor || '#FAF6EE';
    root.style.setProperty('--color-brand-blue', primary);
    root.style.setProperty('--color-brand-vividblue', primary);
    root.style.setProperty('--color-brand-gold', accent);
    root.style.setProperty('--color-brand-cream', surface);
    root.style.setProperty('--color-brand-ivory', surface);
  }, [storeConfig?.primaryColor, storeConfig?.accentColor, storeConfig?.surfaceColor]);

  return (
    <>
      {/* 1. Admin PIN Gate / Admin Portal */}
      <AnimatePresence>
        {isAdminOpen && (
          !isAdminAuthenticated ? (
            <AdminAuthModal
              key="admin-auth-modal"
              onSuccess={() => setIsAdminAuthenticated(true)}
              onExit={handleCloseAdmin}
            />
          ) : (
            <AdminPortal
              key="admin-portal-dashboard"
              onClose={handleCloseAdmin}
            />
          )
        )}
      </AnimatePresence>

      {/* 2. Public Store View: Either Coming Soon or Full Live Atelier */}
      {isComingSoonActive ? (
        <ComingSoon
          onEnterPreview={() => setIsPreviewMode(true)}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />
      ) : (
        <div
          className="min-h-screen text-brand-dark selection:bg-brand-gold selection:text-brand-dark overflow-x-hidden pb-24 md:pb-0 relative"
          style={{ backgroundColor: storeConfig?.surfaceColor || '#FAF6EE' }}
        >
          {/* Top Header Navigation (Single Clean Uncluttered Header) */}
          <Navbar activeView={activeView} onViewChange={handleViewChange} onOpenTrack={() => setIsTrackOpen(true)} />

          {/* Sliding Cart Drawer */}
          <Cart />

          {/* Discreet Floating Preview Pill (Never clutters top header!) */}
          {storeConfig?.isComingSoon && (
            <div className="fixed bottom-20 md:bottom-5 left-4 z-40 flex items-center gap-1.5 p-1.5 pl-3 rounded-full bg-[#07132B]/95 backdrop-blur-md border border-[#C5A059]/50 shadow-xl text-white text-[11px]">
              <span className="text-[#F3E5AB] font-mono hidden sm:inline">Preview</span>
              <button
                type="button"
                onClick={() => setIsAdminOpen(true)}
                className="px-2.5 py-1 rounded-full bg-[#C5A059] text-stone-950 font-bold cursor-pointer"
              >
                Studio
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsPreviewMode(false);
                  window.location.hash = '';
                }}
                className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white/85 cursor-pointer"
              >
                Teaser ↗
              </button>
            </div>
          )}

          {/* Main Content Area with Smooth Page Transitions */}
          <main>
            <AnimatePresence mode="wait">
              {activeView === 'menu' && (
                <motion.div
                  key="view-menu"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Hero />
                  <MarqueeTicker />
                  <Menu />
                  <PackagingExperience />
                </motion.div>
              )}

              {activeView === 'story' && (
                <motion.div
                  key="view-story"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="pt-20"
                >
                  <About />
                  <Craftsmanship />
                  <PackagingExperience />
                </motion.div>
              )}

              {activeView === 'ritual' && (
                <motion.div
                  key="view-ritual"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="pt-20"
                >
                  <TastingNotes />
                  <Craftsmanship />
                </motion.div>
              )}

              {activeView === 'care' && (
                <motion.div
                  key="view-care"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="pt-20"
                >
                  <Contact />
                </motion.div>
              )}

              {activeView === 'all' && (
                <motion.div
                  key="view-all"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Hero />
                  <MarqueeTicker />
                  <Menu />
                  <PackagingExperience />
                  <Craftsmanship />
                  <TastingNotes />
                  <About />
                  <Contact />
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          {/* Footer */}
          <Footer
            onOpenTrack={() => setIsTrackOpen(true)}
            onViewChange={handleViewChange}
            onOpenAdmin={() => setIsAdminOpen(true)}
          />

          {/* Mobile-First Bottom Navigation Dock */}
          <MobileBottomDock activeTab={activeView} onTabChange={handleViewChange} />
        </div>
      )}

      {/* Customer Live Order Tracker Modal (Accessible everywhere via #track) */}
      <TrackOrderModal
        isOpen={isTrackOpen}
        initialOrderId={trackOrderId}
        onClose={() => {
          setIsTrackOpen(false);
          setTrackOrderId('');
          if (window.location.hash.toLowerCase().includes('track')) {
            window.location.hash = '';
          }
        }}
      />
    </>
  );
}
