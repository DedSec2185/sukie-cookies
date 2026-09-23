import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

export default function MobileBottomDock({ activeTab, onTabChange }) {
  const { totalItems, totalPrice, toggleCart } = useCart();

  const dockTabs = [
    { id: 'menu', label: 'Drops', icon: '🍪', desc: 'Daily Drops' },
    { id: 'story', label: 'Atelier', icon: '✨', desc: 'NYC Story' },
    { id: 'ritual', label: 'Ritual', icon: '🔥', desc: 'Reheat & Taste' },
    { id: 'care', label: 'Care', icon: '🛡️', desc: 'Resolution' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 px-3 pb-3 pointer-events-none">
      <div className="pointer-events-auto max-w-md mx-auto rounded-2xl bg-[#090D18]/92 backdrop-blur-xl border border-white/15 shadow-[0_-8px_30px_rgba(0,0,0,0.6)] px-2 py-2 flex items-center justify-between">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 flex-1 justify-around">
          {dockTabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <motion.button
                key={tab.id}
                type="button"
                whileTap={{ scale: 0.9 }}
                onClick={() => onTabChange(tab.id)}
                className={`relative py-1.5 px-2.5 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                  isActive ? 'text-white' : 'text-white/50 hover:text-white/80'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeDockPill"
                    className="absolute inset-0 bg-[#0C419C] rounded-xl border border-[#C5A059]/40 shadow-sm -z-10"
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                  />
                )}
                <span className="text-base sm:text-lg leading-none">{tab.icon}</span>
                <span
                  className={`text-[9px] font-mono uppercase tracking-wider mt-1 leading-none ${
                    isActive ? 'font-bold text-[#C5A059]' : 'font-medium'
                  }`}
                >
                  {tab.label}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Vertical Divider */}
        <div className="h-7 w-px bg-white/15 mx-1" />

        {/* 1-Tap Cart / Box Button */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.92 }}
          onClick={toggleCart}
          className="relative px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#D4B86A] text-stone-950 font-bold flex items-center gap-2 shadow-md cursor-pointer shrink-0"
        >
          <div className="relative flex items-center">
            <span className="text-base leading-none">🛍️</span>
            {totalItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-[#0C419C] text-white text-[9px] font-mono flex items-center justify-center font-bold border border-white shadow-xs"
              >
                {totalItems}
              </motion.span>
            )}
          </div>
          <div className="flex flex-col text-left leading-tight">
            <span className="text-[9px] uppercase tracking-wider font-mono opacity-80">Box</span>
            <span className="text-xs font-bold font-mono">
              ₹{totalPrice > 0 ? totalPrice.toLocaleString('en-IN') : '0'}
            </span>
          </div>
        </motion.button>

      </div>
    </div>
  );
}
