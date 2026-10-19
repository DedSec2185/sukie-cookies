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

  const viewTabs = [
    { id: 'menu', label: 'Daily Drops', desc: 'Fresh 170g Menu' },
    { id: 'story', label: 'NYC Atelier', desc: 'Story & Anatomy' },
    { id: 'ritual', label: 'Warming & Tasting', desc: 'Reheat Simulator' },
    { id: 'care', label: 'Care Lounge', desc: 'Founder Support' },
    { id: 'all', label: 'View All', desc: 'Full Editorial' },
  ];

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
        <div className="min-h-screen bg-[#FAF6EE] text-brand-dark selection:bg-brand-gold selection:text-brand-dark overflow-x-hidden pb-24 md:pb-0 relative">
          {/* Discreet Preview Mode Indicator Bar (shown when Coming Soon is configured on, but previewing) */}
          {storeConfig?.isComingSoon && (
            <div className="bg-[#070B14] border-b border-[#C5A059]/40 py-2 px-4 text-center text-xs text-white flex items-center justify-between sticky top-0 z-50 shadow-md">
              <span className="flex items-center gap-1.5 text-[#C5A059] font-mono text-[11px]">
                <span>✦</span>
                <span>Atelier Menu Preview Active</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAdminOpen(true)}
                  className="text-[11px] font-mono text-[#F3E5AB] hover:text-white px-2.5 py-0.5 rounded-full border border-[#C5A059]/40 hover:border-[#C5A059] bg-[#C5A059]/10 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>🔒</span>
                  <span>Founder Studio</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsPreviewMode(false);
                    window.location.hash = '';
                  }}
                  className="text-[11px] font-mono text-white/80 hover:text-white px-2.5 py-0.5 rounded-full border border-white/20 hover:border-white/50 bg-white/5 transition-colors cursor-pointer"
                >
                  Return to Coming Soon →
                </button>
              </div>
            </div>
          )}

          {/* Top Header Navigation */}
          <Navbar activeView={activeView} onViewChange={handleViewChange} onOpenTrack={() => setIsTrackOpen(true)} />

          {/* Sliding Cart Drawer */}
          <Cart />

          {/* Desktop Ambient View Switcher Bar (Visible on md+ screens) */}
          <div className="hidden md:block pt-24 pb-3 px-4 bg-[#0A0D14] border-b border-white/10 sticky top-8 z-30 shadow-md">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                {viewTabs.map((tab) => {
                  const isActive = activeView === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => handleViewChange(tab.id)}
                      className={`relative px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors duration-200 cursor-pointer flex items-center gap-1.5 ${
                        isActive ? 'text-stone-950 font-bold' : 'text-white/70 hover:text-white'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="desktopViewPill"
                          className="absolute inset-0 bg-[#C5A059] rounded-full shadow-md -z-10"
                          transition={{ type: 'spring', damping: 22, stiffness: 280 }}
                        />
                      )}
                      {isActive && <span className="text-[10px]">✦</span>}
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-3 text-[11px] font-mono text-white/50">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Mumbai Atelier Active
                </span>
                <span>•</span>
                <span className="text-[#C5A059]">100% Pure Eggless</span>
              </div>
            </div>
          </div>

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
                  className="pt-20 md:pt-6"
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
                  className="pt-20 md:pt-6"
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
                  className="pt-20 md:pt-6"
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
