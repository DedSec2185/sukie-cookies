import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

export default function CookieModal({ product, isOpen, onClose }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [giftBoxOption, setGiftBoxOption] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  // Support phone hardware Back button / swipe gesture & Escape key
  useEffect(() => {
    if (isOpen) {
      window.history.pushState({ modal: 'cookie-detail' }, '');
      const handlePopState = () => onClose();
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('popstate', handlePopState);
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('popstate', handlePopState);
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        ...product,
        price: product.price + (giftBoxOption ? 49 : 0),
        hasGiftBox: giftBoxOption,
      });
    }
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 700);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
        {/* Backdrop with clean fade */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
        />

        {/* Compact, Luxury Popover Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-lg max-h-[90vh] bg-gradient-to-b from-[#121622] via-[#0A0E18] to-[#06080F] text-white rounded-2xl sm:rounded-3xl border border-[#C5A059]/40 shadow-[0_25px_80px_rgba(0,0,0,0.85)] overflow-hidden z-10 my-auto flex flex-col"
        >
          {/* Top Bar with Close Button */}
          <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="w-8 h-8 rounded-full bg-black/75 hover:bg-black text-white flex items-center justify-center transition-colors border border-white/20 backdrop-blur-md cursor-pointer text-xs font-bold shadow-lg"
            >
              ✕
            </button>
          </div>

          {/* Compact Photo Banner */}
          <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-stone-900 shrink-0">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121622] via-transparent to-black/30 pointer-events-none" />

            {/* Badges */}
            <div className="absolute bottom-2.5 inset-x-3.5 flex items-center justify-between gap-2 text-[10px] font-mono">
              <span className="uppercase tracking-wider text-amber-200 bg-black/75 px-2 py-0.5 rounded-full border border-amber-400/30 backdrop-blur-md">
                {product.weight} • 6oz Giant
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 backdrop-blur-md flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                100% Eggless
              </span>
            </div>
          </div>

          {/* Scrollable Content Body */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 no-scrollbar">
            <div>
              {/* Provenance Pills */}
              <div className="flex items-center gap-2 text-[10px] text-amber-400 font-mono uppercase tracking-wider flex-wrap mb-1">
                {product.provenanceHighlights ? (
                  product.provenanceHighlights.map((hl, idx) => (
                    <span key={idx} className="flex items-center gap-1.5">
                      {idx > 0 && <span className="text-stone-500">•</span>}
                      <span>✦ {hl}</span>
                    </span>
                  ))
                ) : (
                  <span>✦ Belgian Couverture • French Butter</span>
                )}
              </div>

              <h3 className="font-heading text-xl sm:text-2xl font-bold text-white">
                {product.name}
              </h3>

              <p className="text-white/75 text-xs sm:text-sm leading-relaxed mt-1.5 font-light">
                {product.shortDesc || product.description}
              </p>
            </div>

            {/* Ingredients Tags */}
            {product.ingredients && product.ingredients.length > 0 && (
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#C5A059] block font-mono">
                  Key Ingredients & Craft
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {product.ingredients.map((ing, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/10 text-white/90 border border-white/15"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Warming Tip */}
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-100/90 leading-relaxed">
              <span className="text-base shrink-0">🔥</span>
              <div>
                <strong className="text-amber-300 font-semibold">Chef&apos;s Reheat: </strong>
                Warm in preheated oven at 160°C for 2 min (or microwave 15s) for molten lava center.
              </div>
            </div>

            {/* Gift packaging option */}
            <label className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/10 cursor-pointer hover:bg-white/[0.06] transition-colors">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🎁</span>
                <div>
                  <span className="text-xs font-semibold text-white block">
                    Cobalt Keepsake Gift Box (+₹49)
                  </span>
                  <span className="text-[10px] text-white/50">Rigid foil box & satin ribbon</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={giftBoxOption}
                onChange={(e) => setGiftBoxOption(e.target.checked)}
                className="w-4 h-4 accent-[#C5A059] rounded cursor-pointer"
              />
            </label>
          </div>

          {/* Fixed Footer Bar */}
          <div className="p-3.5 sm:p-4 bg-[#0A0D15] border-t border-white/10 flex items-center justify-between gap-3 shrink-0">
            <div>
              <span className="text-[9px] text-white/50 uppercase tracking-widest block font-mono">
                Total
              </span>
              <span className="font-heading text-xl sm:text-2xl font-bold text-[#C5A059]">
                ₹{(product.price + (giftBoxOption ? 49 : 0)) * quantity}
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Stepper */}
              <div className="flex items-center gap-2 bg-white/10 px-2.5 py-1.5 rounded-full border border-white/20">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-6 h-6 rounded-full text-white/80 hover:text-white flex items-center justify-center font-bold text-sm cursor-pointer"
                >
                  −
                </button>
                <span className="font-mono text-xs font-bold w-4 text-center">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-6 h-6 rounded-full text-white/80 hover:text-white flex items-center justify-center font-bold text-sm cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!product.available || isAdded}
                className={`px-5 sm:px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md cursor-pointer ${
                  isAdded
                    ? 'bg-emerald-500 text-white'
                    : 'bg-[#C5A059] hover:bg-[#D4B86A] text-stone-950 active:scale-95'
                }`}
              >
                {isAdded ? 'Added! ✓' : 'Add To Box +'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
