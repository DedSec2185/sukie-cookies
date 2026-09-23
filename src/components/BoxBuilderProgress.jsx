import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { menuData } from '../data/menuData';

export default function BoxBuilderProgress() {
  const { totalItems, totalPrice, items, updateQuantity, clearCart, addItem, toggleCart } = useCart();
  
  // Custom box size preference: 4-Pack or 6-Pack
  const [preferredSize, setPreferredSize] = useState(4);
  
  // Dynamic target: if user has more than preferredSize, bump to 6 (or next tier)
  const target = Math.max(preferredSize, totalItems > 4 ? 6 : 4);
  const currentCount = totalItems;
  const isComplete = currentCount >= target;
  const progressPercent = Math.min(100, (currentCount / target) * 100);

  // Flatten items into individual cookie slots
  const filledSlots = [];
  items.forEach((item) => {
    for (let i = 0; i < item.quantity; i++) {
      if (filledSlots.length < target) {
        filledSlots.push(item);
      }
    }
  });

  const slots = Array.from({ length: target });

  // Handle removing a single cookie from a slot
  const handleRemoveFromSlot = (e, item) => {
    e.stopPropagation();
    if (!item) return;
    updateQuantity(item.id, item.quantity - 1);
  };

  // Quick Curate Presets
  const applyPreset = (presetType) => {
    clearCart();
    setTimeout(() => {
      if (presetType === 'bestsellers') {
        const top4 = menuData.products.filter(p => [1, 2, 3, 4].includes(p.id));
        top4.forEach(p => addItem(p));
      } else if (presetType === 'chocolate') {
        const choc1 = menuData.products.find(p => p.id === 1); // Triple Choc
        const choc2 = menuData.products.find(p => p.id === 2); // Two Chip
        const choc3 = menuData.products.find(p => p.id === 5); // Popcorn Praline
        if (choc1) { addItem(choc1); addItem(choc1); }
        if (choc2) addItem(choc2);
        if (choc3) addItem(choc3);
      }
    }, 50);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-4xl mx-auto my-8 sm:my-12 relative"
    >
      {/* Outer Ambient Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-[#C5A059]/30 via-[#195CD3]/30 to-[#C5A059]/30 rounded-[32px] blur-xl opacity-75 pointer-events-none" />

      {/* Main Haute Pâtisserie Casket Container */}
      <div className="relative rounded-[28px] bg-gradient-to-b from-[#0B2558] via-[#0C419C] to-[#061B48] p-5 sm:p-8 text-white border-2 border-[#C5A059]/80 shadow-[0_25px_60px_rgba(10,35,85,0.45)] overflow-hidden">
        
        {/* Subtle Silk Pattern & Gold Foil Watermark */}
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#F3E5AB_1.5px,transparent_1.5px)] [background-size:28px_28px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-radial from-[#1A5ED1]/25 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Corner Gold Flourishes */}
        <div className="absolute top-3 left-3 text-[#F3E5AB]/40 text-xs font-serif pointer-events-none">✦</div>
        <div className="absolute top-3 right-3 text-[#F3E5AB]/40 text-xs font-serif pointer-events-none">✦</div>
        <div className="absolute bottom-3 left-3 text-[#F3E5AB]/40 text-xs font-serif pointer-events-none">✦</div>
        <div className="absolute bottom-3 right-3 text-[#F3E5AB]/40 text-xs font-serif pointer-events-none">✦</div>

        <div className="relative z-10 space-y-6">

          {/* 1. Header: Atelier Title, Box Selector & Live Status */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-[#C5A059]/25">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F3E5AB] via-[#C5A059] to-[#8C6D2B] p-0.5 shadow-md shrink-0">
                <div className="w-full h-full rounded-[14px] bg-[#071F4F] flex items-center justify-center text-[#F3E5AB]">
                  <span className="text-xl">✨</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#F3E5AB] font-bold">
                    Sukié Atelier Studio
                  </span>
                  <span className="w-1 h-1 rounded-full bg-[#C5A059]" />
                  <span className="text-[10px] font-mono text-white/60">Bespoke Curation</span>
                </div>
                <h3 className="font-heading text-lg sm:text-2xl font-bold text-white tracking-wide mt-0.5">
                  The Royal Keepsake Casket
                </h3>
              </div>
            </div>

            {/* Box Size Toggle (4-Pack vs 6-Pack) */}
            <div className="flex items-center gap-1.5 p-1 rounded-full bg-black/40 border border-[#C5A059]/40 backdrop-blur-md self-stretch sm:self-auto justify-center">
              <button
                type="button"
                onClick={() => setPreferredSize(4)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  target === 4
                    ? 'bg-gradient-to-r from-[#F3E5AB] via-[#C5A059] to-[#D4B86A] text-stone-950 shadow-md'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Signature 4-Pack
              </button>
              <button
                type="button"
                onClick={() => setPreferredSize(6)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  target === 6
                    ? 'bg-gradient-to-r from-[#F3E5AB] via-[#C5A059] to-[#D4B86A] text-stone-950 shadow-md'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Grande 6-Pack
              </button>
            </div>
          </div>

          {/* 2. Interactive Velvet Cushion Alcoves */}
          <div className="py-2">
            <div className={`grid gap-3 sm:gap-5 items-center justify-items-center ${
              target === 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3 sm:grid-cols-6'
            }`}>
              {slots.map((_, index) => {
                const filledItem = filledSlots[index];
                const isFilled = !!filledItem;

                return (
                  <div
                    key={`casket-slot-${index}`}
                    className="flex flex-col items-center gap-2 w-full max-w-[130px] group"
                  >
                    {/* The Recessed Velvet Cushion Pod */}
                    <div
                      className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isFilled
                          ? 'p-1 bg-gradient-to-br from-[#F3E5AB] via-[#C5A059] to-[#8C6D2B] shadow-[0_0_22px_rgba(197,160,89,0.55)] ring-2 ring-[#F3E5AB]/80'
                          : 'border-2 border-dashed border-[#C5A059]/40 bg-[#06183B]/80 hover:border-[#C5A059]/80 hover:bg-[#08204D] shadow-inner'
                      }`}
                    >
                      {isFilled ? (
                        <motion.div
                          initial={{ scale: 0.5, rotate: -20 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: 'spring', damping: 14, stiffness: 220 }}
                          className="w-full h-full rounded-full overflow-hidden relative group/img cursor-pointer"
                        >
                          <img
                            src={filledItem.image}
                            alt={filledItem.name}
                            className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                          
                          {/* Slot Sequence Number Gold Badge */}
                          <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-[#0C419C]/90 text-[#F3E5AB] border border-[#C5A059]/60 shadow">
                            0{index + 1}
                          </span>

                          {/* Quick Remove Action Button on Hover */}
                          <button
                            type="button"
                            onClick={(e) => handleRemoveFromSlot(e, filledItem)}
                            aria-label={`Remove ${filledItem.name}`}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold"
                          >
                            <span className="w-7 h-7 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                              ✕
                            </span>
                          </button>
                        </motion.div>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center p-2">
                          <span className="text-sm sm:text-base text-[#C5A059] group-hover:scale-125 transition-transform duration-300">
                            ✦
                          </span>
                          <span className="text-[9px] font-mono uppercase tracking-widest text-[#F3E5AB]/70 mt-0.5">
                            Drop 0{index + 1}
                          </span>
                          <span className="text-[8px] text-white/40 font-light mt-0.5 hidden sm:block">
                            Reserved
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Sub-label under each slot */}
                    <div className="text-center w-full">
                      <p className="text-[11px] font-medium text-white truncate max-w-full">
                        {isFilled ? filledItem.name : `Alcove 0${index + 1}`}
                      </p>
                      <p className="text-[9px] font-mono text-[#F3E5AB]/80">
                        {isFilled ? '170g • In Box' : 'Awaiting'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Gold Satin Ribbon Progress Track & Milestone Status */}
          <div className="pt-2">
            {/* Ribbon Track */}
            <div className="relative h-2.5 w-full rounded-full bg-black/50 overflow-hidden p-0.5 border border-[#C5A059]/40 mb-3 shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-[#F3E5AB] via-[#C5A059] to-[#D4B86A] shadow-[0_0_12px_rgba(243,229,171,0.8)] relative"
              >
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] animate-pulse" />
              </motion.div>
            </div>

            {/* Dynamic Status Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-center sm:text-left">
                <span className="text-[#F3E5AB] text-sm">✦</span>
                {isComplete ? (
                  <span className="text-[#F3E5AB] font-heading font-medium tracking-wide">
                    <strong>Bespoke Casket Complete!</strong> Complimentary royal blue rigid gift box &amp; wax seal unlocked.
                  </span>
                ) : currentCount === 0 ? (
                  <span className="text-white/80">
                    Your velvet casket is waiting. Tap any cookie below to nest your first 170g drop.
                  </span>
                ) : (
                  <span className="text-white/90">
                    Add <strong className="text-[#F3E5AB] underline font-bold">{target - currentCount} more {target - currentCount === 1 ? 'cookie' : 'cookies'}</strong> to seal your complimentary royal gift packaging.
                  </span>
                )}
              </div>

              {/* Status Pill & Action */}
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                    isComplete
                      ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-400/50 shadow-[0_0_15px_rgba(52,211,153,0.35)]'
                      : currentCount === 0
                      ? 'bg-white/10 text-white/60 border border-white/15'
                      : 'bg-[#C5A059]/25 text-[#F3E5AB] border border-[#C5A059]/60'
                  }`}
                >
                  {isComplete ? '✓ Box Sealed' : `${currentCount} of ${target} Nested`}
                </span>

                {currentCount > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    type="button"
                    onClick={toggleCart}
                    className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#F3E5AB] via-[#C5A059] to-[#D4B86A] text-stone-950 text-xs font-mono font-bold uppercase tracking-wider shadow-lg hover:brightness-110 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>View Box</span>
                    <span>(₹{totalPrice.toLocaleString('en-IN')})</span>
                    <span>→</span>
                  </motion.button>
                )}
              </div>
            </div>
          </div>

          {/* 4. Atelier Quick-Curations & Luxury Guarantee Footer */}
          <div className="pt-4 border-t border-[#C5A059]/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-white/70">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="text-[10px] font-mono text-[#F3E5AB]/80 uppercase tracking-widest mr-1">
                Quick Curate:
              </span>
              <button
                type="button"
                onClick={() => applyPreset('bestsellers')}
                className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white text-[10px] font-medium transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>👑</span>
                <span>The Bestsellers 4-Pack</span>
              </button>
              <button
                type="button"
                onClick={() => applyPreset('chocolate')}
                className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white text-[10px] font-medium transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>🍫</span>
                <span>Chocoholic's Dream</span>
              </button>
              {currentCount > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  className="px-2.5 py-1 rounded-full bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-200 text-[10px] font-medium transition-colors cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 font-mono text-[10px] text-[#F3E5AB]/90">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>100% Pure Eggless Atelier</span>
              <span>•</span>
              <span>Mumbai Kitchen Drops</span>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
