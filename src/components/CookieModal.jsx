import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

export default function CookieModal({ product, isOpen, onClose }) {
  const { items, addItem, updateQuantity, openCheckout } = useCart();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setQuantity(1);
  }, [product]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const existingCartItem = items?.find((i) => i.id === product.id);
  const currentInCart = existingCartItem ? existingCartItem.quantity : 0;

  const addSelectedQuantity = () => {
    if (currentInCart > 0) {
      updateQuantity(product.id, currentInCart + quantity);
    } else {
      addItem(product);
      if (quantity > 1) {
        setTimeout(() => {
          updateQuantity(product.id, quantity);
        }, 20);
      }
    }
  };

  const handleAddToBox = () => {
    addSelectedQuantity();
    onClose();
  };

  const handleInstantCheckout = () => {
    addSelectedQuantity();
    onClose();
    openCheckout();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {/* Dark Blur Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
          />

          {/* Modal Sheet */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl bg-[#0B0D13] text-white rounded-3xl overflow-hidden border border-[#C5A059]/45 shadow-[0_25px_80px_rgba(0,0,0,0.85)] z-10 grid grid-cols-1 md:grid-cols-12 my-auto max-h-[92vh] overflow-y-auto md:overflow-visible"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="Close tasting sheet"
              className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/70 hover:bg-[#C5A059] text-white hover:text-stone-950 border border-white/20 flex items-center justify-center transition-colors cursor-pointer"
            >
              ✕
            </button>

            {/* Left Column: High-Res Visual */}
            <div className="md:col-span-5 relative min-h-[250px] sm:min-h-[340px] md:min-h-full bg-[#07132B] overflow-hidden flex flex-col justify-between">
              <img
                src={product.image}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D13] via-black/25 to-black/30" />

              {/* Top Badges */}
              <div className="relative z-10 p-5 flex flex-wrap gap-2">
                <span className="bg-black/75 backdrop-blur-md text-emerald-300 text-[10px] font-bold px-3 py-1 rounded-full border border-emerald-500/35 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  100% Pure Eggless
                </span>
                {(product.tags || [])
                  .filter((t) => t.toLowerCase() !== 'eggless')
                  .map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#C5A059] text-stone-950 shadow-md"
                    >
                      {tag}
                    </span>
                  ))}
              </div>

              {/* Bottom Specs Overlay */}
              <div className="relative z-10 p-5 space-y-3">
                <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-black/70 backdrop-blur-md border border-[#C5A059]/30 text-center">
                  <div>
                    <span className="text-[9px] text-white/50 uppercase font-mono block">Scale</span>
                    <span className="text-xs font-bold text-[#F3E5AB]">{product.weight}</span>
                  </div>
                  <div className="border-x border-white/10">
                    <span className="text-[9px] text-white/50 uppercase font-mono block">Portion</span>
                    <span className="text-xs font-bold text-white">
                      {product.serves ? `Serves ${product.serves}` : 'Oversized'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-white/50 uppercase font-mono block">Core</span>
                    <span className="text-xs font-bold text-emerald-300">Molten Lava</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Culinary Details & Instant Actions */}
            <div className="md:col-span-7 p-5 sm:p-8 flex flex-col justify-between space-y-5 bg-gradient-to-br from-[#101420] via-[#0B0D13] to-[#07090E]">
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-mono block mb-1">
                    Sukié Atelier • Tasting Dossier
                  </span>
                  <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white leading-tight">
                    {product.name}
                  </h2>
                </div>

                <p className="text-white/80 text-xs sm:text-sm font-light leading-relaxed">
                  {product.description || product.shortDesc}
                </p>

                {/* Sensory Profile Bars */}
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 grid grid-cols-3 gap-3">
                  <div>
                    <div className="flex justify-between text-[10px] font-mono mb-1">
                      <span className="text-white/60">Gooey Core</span>
                      <span className="text-[#F3E5AB] font-bold">98%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full w-[98%] bg-gradient-to-r from-[#C5A059] to-[#F3E5AB] rounded-full" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] font-mono mb-1">
                      <span className="text-white/60">Richness</span>
                      <span className="text-[#F3E5AB] font-bold">95%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full w-[95%] bg-gradient-to-r from-[#0C419C] to-[#C5A059] rounded-full" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] font-mono mb-1">
                      <span className="text-white/60">Crisp Edge</span>
                      <span className="text-[#F3E5AB] font-bold">88%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full w-[88%] bg-gradient-to-r from-amber-500 to-amber-300 rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Ingredients Pills */}
                {product.ingredients && product.ingredients.length > 0 && (
                  <div>
                    <h4 className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold mb-2 font-mono">
                      ✦ Finest Provenance Ingredients
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {product.ingredients.map((ing, i) => (
                        <span
                          key={i}
                          className="text-xs px-3 py-1 rounded-full bg-white/[0.06] border border-white/15 text-white/90"
                        >
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Chef's Reheating Note */}
                <div className="p-3.5 rounded-2xl bg-[#0C419C]/15 border border-[#C5A059]/30 flex items-start gap-3">
                  <span className="text-lg">🔥</span>
                  <div>
                    <h5 className="text-xs font-bold text-[#F3E5AB]">
                      Chef&apos;s 2-Minute Molten Ritual
                    </h5>
                    <p className="text-white/70 text-[11px] mt-0.5 leading-relaxed">
                      {product.storageNote ||
                        'Warm in a preheated oven or air-fryer at 160°C for 2 minutes (or microwave 15 seconds) before breaking open the molten center.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quantity & Dual Action Bar (Add to Box + Instant Order) */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] text-white/50 uppercase tracking-widest block font-mono">
                      Total for {quantity} {quantity === 1 ? 'Bake' : 'Bakes'}
                    </span>
                    <span className="font-heading text-2xl sm:text-3xl font-bold text-[#F3E5AB]">
                      ₹{(product.price * quantity).toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Quantity Selector */}
                  <div className="flex items-center rounded-full bg-white/10 border border-white/20 p-1">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white font-bold cursor-pointer"
                    >
                      −
                    </button>
                    <span className="px-4 font-mono text-sm font-bold">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white font-bold cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    disabled={!product.available}
                    onClick={handleAddToBox}
                    className="py-3.5 px-5 rounded-2xl bg-[#0C419C] hover:bg-[#1452C2] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg border border-[#C5A059]/40 cursor-pointer"
                  >
                    + Add to My Box
                  </button>

                  <button
                    type="button"
                    disabled={!product.available}
                    onClick={handleInstantCheckout}
                    className="py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#C5A059] via-[#DFBD73] to-[#C5A059] hover:brightness-105 text-stone-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg cursor-pointer"
                  >
                    Order Now • Express Checkout →
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
