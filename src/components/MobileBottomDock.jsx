import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, Sparkles, Flame, ShieldCheck, ShoppingBag, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function MobileBottomDock({ activeTab, onTabChange }) {
  const { totalItems, totalPrice, toggleCart, openCheckout } = useCart();

  const dockTabs = [
    { id: 'menu', label: 'Drops', icon: Cookie, desc: 'Daily Drops' },
    { id: 'story', label: 'Atelier', icon: Sparkles, desc: 'NYC Story' },
    { id: 'ritual', label: 'Ritual', icon: Flame, desc: 'Reheat & Taste' },
    { id: 'care', label: 'Care', icon: ShieldCheck, desc: 'Resolution' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pointer-events-none flex flex-col gap-2">
      
      {/* Floating Express Checkout Bar (Appears automatically when items are in Box) */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: 'spring', damping: 24, stiffness: 300 }}
            className="pointer-events-auto max-w-md w-full mx-auto rounded-2xl bg-gradient-to-r from-[#07132B] via-[#0C419C] to-[#07132B] border border-[#C5A059]/60 shadow-[0_10px_30px_rgba(7,19,43,0.85)] px-3.5 py-2.5 flex items-center justify-between gap-2"
          >
            <div onClick={toggleCart} className="flex items-center gap-2.5 min-w-0 cursor-pointer">
              <div className="w-8 h-8 rounded-xl bg-[#C5A059]/20 border border-[#C5A059]/50 flex items-center justify-center text-[#F3E5AB] font-mono text-xs font-bold shrink-0">
                {totalItems}
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-white truncate">
                  {totalItems >= 4
                    ? '✓ FREE Royal Gift Box Unlocked!'
                    : `Add ${4 - totalItems} more for FREE Gift Box`}
                </p>
                <p className="text-[10px] font-mono text-[#F3E5AB]">
                  Subtotal: ₹{totalPrice.toLocaleString('en-IN')} • Tap to review
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={openCheckout}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#F3E5AB] via-[#C5A059] to-[#D4B86A] text-stone-950 font-mono text-[10px] font-bold uppercase tracking-wider shadow-md flex items-center gap-1 shrink-0 active:scale-95 transition-transform cursor-pointer"
            >
              <Zap className="w-3 h-3 fill-stone-950" />
              <span>Checkout →</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Bottom Navigation Dock */}
      <div className="pointer-events-auto max-w-md w-full mx-auto rounded-2xl bg-[#07132B]/95 backdrop-blur-2xl border border-[#C5A059]/35 shadow-[0_-10px_35px_rgba(0,0,0,0.7)] px-2.5 py-2 flex items-center justify-between">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 flex-1 justify-around">
          {dockTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const IconComponent = tab.icon;

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
                <IconComponent className={`w-4 h-4 ${isActive ? 'text-[#F3E5AB]' : 'text-white/65'}`} />
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
            <ShoppingBag className="w-4 h-4 text-stone-950" />
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
