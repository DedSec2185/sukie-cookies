import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

export default function CookieModal({ product, isOpen, onClose }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [giftBoxOption, setGiftBoxOption] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

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
      <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
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
          className="relative w-full max-w-2xl bg-gradient-to-b from-[#161311] via-[#110E0C] to-[#0A0807] text-white rounded-3xl border border-[#C5A059]/30 shadow-[0_30px_90px_rgba(0,0,0,0.9)] overflow-hidden z-10 my-8"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close details"
            className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors border border-white/20 backdrop-blur-md cursor-pointer"
          >
            ✕
          </button>

          {/* Modal Header Realistic Visual */}
          <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-stone-900">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#161311] via-black/30 to-black/20" />
            
            <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between">
              <span className="text-xs uppercase font-mono tracking-[0.25em] text-amber-200 bg-black/70 px-3.5 py-1.5 rounded-full border border-amber-400/40 backdrop-blur-md">
                {product.weight} • Authentic NYC 6oz
              </span>
              <span className="text-xs px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 font-bold uppercase tracking-wider border border-emerald-500/40 backdrop-blur-md">
                100% Eggless Pure
              </span>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-8 space-y-6">
            
            <div>
              <div className="flex items-center gap-3 text-xs text-amber-400 font-mono uppercase tracking-wider">
                <span>✦ Belgian Callebaut Chocolate</span>
                <span>•</span>
                <span>European Butter</span>
              </div>

              <h3 className="font-heading text-3xl sm:text-4xl font-bold text-white mt-2">
                {product.name}
              </h3>

              <p className="text-white/80 text-sm sm:text-base leading-relaxed mt-3 font-light">
                {product.description}
              </p>
            </div>

            {/* Ingredients Provenance */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-[#C5A059]/20 space-y-3">
              <span className="text-xs uppercase font-bold tracking-widest text-[#C5A059] block">
                Artisan Ingredients Provenance
              </span>
              <div className="flex flex-wrap gap-2">
                {product.ingredients?.map((ing, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-3 py-1.5 rounded-full bg-white/10 text-white/90 border border-white/15 flex items-center gap-1.5"
                  >
                    <span className="text-[#C5A059]">✦</span>
                    <span>{ing}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Warming Protocol */}
            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-100/90">
              <span className="text-xl">🔥</span>
              <div>
                <strong className="block font-semibold text-amber-300 mb-0.5">The Chef&apos;s Reheat Secret:</strong>
                Warm in a preheated oven or air-fryer at 160°C for exactly 2 minutes. The Belgian Callebaut chocolate will liquefy into an irresistible molten lava stream.
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
            <div className="pt-4 border-t border-white/15 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-white/50 uppercase tracking-widest block font-mono">Total Value</span>
                <span className="font-heading text-3xl font-bold text-[#C5A059]">
                  ₹{(product.price + (giftBoxOption ? 49 : 0)) * quantity}
                </span>
              </div>

              <div className="flex items-center gap-4">
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
                  className={`px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-xl cursor-pointer ${
                    isAdded
                      ? 'bg-emerald-500 text-white scale-105'
                      : 'bg-[#C5A059] hover:bg-[#D4B86A] text-black hover:scale-105 active:scale-95'
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
