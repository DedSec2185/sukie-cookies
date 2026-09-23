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
import CustomCursor from './components/CustomCursor';
import MobileBottomDock from './components/MobileBottomDock';
import { useLenis } from './hooks/useLenis';

export default function App() {
  // Initialize buttery-smooth Lenis momentum scrolling on desktop
  useLenis();

  // Helper to determine view from current hash
  const getViewFromHash = () => {
    if (typeof window === 'undefined') return 'menu';
    const hash = window.location.hash.toLowerCase();
    if (hash.includes('story') || hash.includes('about')) return 'story';
    if (hash.includes('ritual') || hash.includes('tasting') || hash.includes('warm')) return 'ritual';
    if (hash.includes('care') || hash.includes('complaint') || hash.includes('contact')) return 'care';
    if (hash.includes('all')) return 'all';
    return 'menu';
  };

  const [activeView, setActiveView] = useState(getViewFromHash);

  // Sync with browser back/forward and hash changes
  useEffect(() => {
    const handleHashChange = () => {
      setActiveView(getViewFromHash());
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleViewChange = (newView) => {
    setActiveView(newView);
    window.location.hash = `#${newView}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const viewTabs = [
    { id: 'menu', label: 'Daily Drops', icon: '🍪', desc: 'Fresh 170g Menu' },
    { id: 'story', label: 'NYC Atelier', icon: '✨', desc: 'Story & Anatomy' },
    { id: 'ritual', label: 'Warming & Tasting', icon: '🔥', desc: 'Reheat Simulator' },
    { id: 'care', label: 'Care Lounge', icon: '🛡️', desc: 'Founder Support' },
    { id: 'all', label: 'View All', icon: '📜', desc: 'Full Editorial' },
  ];

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-brand-dark selection:bg-brand-gold selection:text-brand-dark overflow-x-hidden pb-24 md:pb-0 relative">
      {/* 1. Desktop Luxury Custom Trailing Cursor */}
      <CustomCursor />

      {/* 2. Top Header Navigation */}
      <Navbar activeView={activeView} onViewChange={handleViewChange} />

      {/* 3. Sliding Cart Drawer */}
      <Cart />

      {/* 4. Desktop Ambient View Switcher Bar (Visible on md+ screens) */}
      <div className="hidden md:block pt-24 pb-3 px-4 bg-[#0A0D14] border-b border-white/10 sticky top-0 z-30 shadow-md">
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
                  <span>{tab.icon}</span>
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

      {/* 5. Main Content Area with Smooth Page Transitions */}
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

      {/* 6. Footer */}
      <Footer />

      {/* 7. Mobile-First Bottom Navigation Dock */}
      <MobileBottomDock activeTab={activeView} onTabChange={handleViewChange} />
    </div>
  );
}
