import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

export default function FloatingMobileCart() {
  const { totalItems, totalPrice, toggleCart } = useCart();

  if (totalItems === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="fixed bottom-4 inset-x-4 z-40 sm:hidden"
      >
        <button
          onClick={toggleCart}
          className="w-full bg-[#0F2460] text-white p-3.5 rounded-2xl shadow-[0_15px_35px_rgba(15,36,96,0.5)] border border-[#C5A059]/40 flex items-center justify-between backdrop-blur-md active:scale-98 transition-transform cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-[#C5A059] text-black font-bold flex items-center justify-center text-xs shadow-sm">
              {totalItems}
            </span>
            <div className="text-left">
              <span className="text-xs font-semibold text-white block">Sukié Box Active</span>
              <span className="text-[11px] text-amber-200/90 font-mono">₹{totalPrice} subtotal</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C5A059]">
            <span>View Box</span>
            <span>→</span>
          </div>
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
