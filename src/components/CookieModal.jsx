import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

export default function CookieModal({ product, isOpen, onClose }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [giftBoxOption, setGiftBoxOption] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  // Support phone hardware Back button / swipe gesture
  useEffect(() => {
    if (isOpen) {
      window.history.pushState({ modal: 'cookie-detail' }, '');
      const handlePopState = () => {
        onClose();
      };
      window.addEventListener('popstate', handlePopState);
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        ...product,
        price: product.price + (giftBoxOption ? 49 : 0),
        hasGiftBox: giftBoxOption
      });
    }
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 900);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative w-full max-w-2xl bg-gradient-to-b from-[#161311] via-[#110E0C] to-[#0A0807] text-white rounded-3xl border border-[#C5A059]/30 shadow-[0_30px_90px_rgba(0,0,0,0.9)] overflow-hidden z-10 my-4 sm:my-8"
        >
          {/* Top Back & Close navigation bar */}
          <button
            onClick={onClose}
            aria-label="Back to menu"
            className="absolute top-4 left-4 z-20 px-3.5 py-1.5 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center gap-1.5 text-xs font-medium border border-white/20 backdrop-blur-md cursor-pointer transition-all active:scale-95 shadow-md"
          >
            <span>←</span>
            <span>Back to Menu</span>
          </button>

          <button
            onClick={onClose}
            aria-label="Close details"
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center transition-colors border border-white/20 backdrop-blur-md cursor-pointer"
          >
            ✕
          </button>

          {/* Modal Header Realistic Visual */}
          <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-stone-900">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#161311] via-black/30 to-black/20" />
            
            {/* Slimmer refined badges */}
            <div className="absolute bottom-3 left-4 right-4 sm:left-6 sm:right-6 flex items-center justify-between gap-2">
              <span className="text-[10px] sm:text-xs uppercase font-mono tracking-wider text-amber-200 bg-black/70 px-2.5 py-1 rounded-full border border-amber-400/30 backdrop-blur-md">
                {product.weight} • Authentic NYC 6oz
              </span>
              <span className="text-[10px] sm:text-xs px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-300 font-medium tracking-wider border border-emerald-500/30 backdrop-blur-md flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                100% Pure Eggless
              </span>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-5 sm:p-8 space-y-5">
            
            <div>
              {/* Dynamic highlights per cookie */}
              <div className="flex items-center gap-2 text-xs text-amber-400 font-mono uppercase tracking-wider flex-wrap">
                {product.provenanceHighlights ? (
                  product.provenanceHighlights.map((hl, idx) => (
                    <span key={idx} className="flex items-center gap-2">
                      {idx > 0 && <span className="text-stone-500">•</span>}
                      <span>✦ {hl}</span>
                    </span>
                  ))
                ) : (
                  <>
                    <span>✦ Pure Couverture Chocolate</span>
                    <span>•</span>
                    <span>European Butter</span>
                  </>
                )}
              </div>

              <h3 className="font-heading text-2xl sm:text-4xl font-bold text-white mt-2">
                {product.name}
              </h3>

              <p className="text-white/80 text-xs sm:text-base leading-relaxed mt-2.5 font-light">
                {product.description}
              </p>
            </div>

            {/* Ingredients Provenance */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-[#C5A059]/20 space-y-2.5">
              <span className="text-[11px] uppercase font-bold tracking-widest text-[#C5A059] block">
                Artisan Ingredients Provenance
              </span>
              <div className="flex flex-wrap gap-2">
                {product.ingredients?.map((ing, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-3 py-1 rounded-full bg-white/10 text-white/90 border border-white/15 flex items-center gap-1.5"
                  >
                    <span className="text-[#C5A059]">✦</span>
                    <span>{ing}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Warming Protocol */}
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-100/90">
              <span className="text-lg">🔥</span>
              <div>
                <strong className="block font-semibold text-amber-300 mb-0.5">The Chef&apos;s Reheat Secret:</strong>
                Warm in a preheated oven or air-fryer at 160°C for exactly 2 minutes. The rich molten center will liquefy into an irresistible warm lava stream.
              </div>
            </div>

            {/* Gift packaging toggle */}
            <label className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/10 cursor-pointer hover:bg-white/[0.06] transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎁</span>
                <div>
                  <span className="text-sm font-semibold text-white block">Add Cobalt Blue Keepsake Gift Packaging</span>
                  <span className="text-xs text-white/50">Rigid gold-embossed box with satin ribbon & calligraphy card</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={giftBoxOption}
                onChange={(e) => setGiftBoxOption(e.target.checked)}
                className="w-5 h-5 accent-[#C5A059] rounded cursor-pointer"
              />
            </label>

            {/* Quantity and Price Bar */}
            <div className="pt-4 border-t border-white/15 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex sm:block justify-between items-baseline">
                <span className="text-[10px] text-white/50 uppercase tracking-widest block font-mono">Total Value</span>
                <span className="font-heading text-2xl sm:text-3xl font-bold text-[#C5A059]">
                  ₹{(product.price + (giftBoxOption ? 49 : 0)) * quantity}
                </span>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                {/* Quantity Controls */}
                <div className="flex items-center gap-3 bg-white/10 px-3.5 py-2 rounded-full border border-white/20">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-7 rounded-full text-white/80 hover:text-white hover:bg-white/10 flex items-center justify-center font-bold text-base cursor-pointer"
                  >
                    -
                  </button>
                  <span className="font-mono text-sm font-bold w-4 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-7 h-7 rounded-full text-white/80 hover:text-white hover:bg-white/10 flex items-center justify-center font-bold text-base cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Add to Box Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={!product.available || isAdded}
                  className={`flex-1 sm:flex-none px-6 sm:px-8 py-3.5 sm:py-4 rounded-full font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-xl cursor-pointer text-center ${
                    isAdded
                      ? 'bg-emerald-500 text-white scale-102'
                      : 'bg-[#C5A059] hover:bg-[#D4B86A] text-black hover:scale-102 active:scale-95'
                  }`}
                >
                  {isAdded ? 'Added to Box! ✓' : 'Add To Box +'}
                </button>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
