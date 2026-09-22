import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

export default function FloatingMobileCart() {
  const { items, totalItems, totalPrice, toggleCart } = useCart();

  if (totalItems === 0) return null;

  const lastItem = items && items.length > 0 ? items[items.length - 1] : null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="fixed bottom-4 inset-x-3.5 z-40 sm:hidden"
      >
        <button
          onClick={toggleCart}
          className="w-full bg-gradient-to-r from-[#071738] via-[#0C419C] to-[#071738] text-white p-3.5 rounded-2xl shadow-[0_16px_40px_rgba(11,20,48,0.7)] border border-[#C5A059]/50 flex items-center justify-between backdrop-blur-md active:scale-[0.98] transition-transform cursor-pointer"
        >
          <div className="flex items-center gap-3">
            {/* Thumbnail or Badge */}
            <div className="relative">
              {lastItem?.image ? (
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#C5A059]/50 shrink-0 bg-stone-900 shadow-sm">
                  <img
                    src={lastItem.image}
                    alt={lastItem.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center text-base">
                  🛍️
                </div>
              )}
              <span className="absolute -top-1.5 -right-1.5 bg-[#C5A059] text-stone-950 font-bold text-[10px] rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center shadow-md ring-2 ring-[#0C419C]">
                {totalItems}
              </span>
            </div>

            <div className="text-left">
              <span className="text-xs font-bold text-white block tracking-wide">
                Sukié Box Active
              </span>
              <span className="text-[11px] text-amber-200/90 font-mono font-medium">
                ₹{totalPrice} subtotal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C5A059] pr-1">
            <span>View Box</span>
            <span>→</span>
          </div>
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
