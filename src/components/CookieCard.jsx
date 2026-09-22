import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

export default function CookieCard({ product, onAddToCart, onOpenModal }) {
  const { items, addItem, updateQuantity } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const timerRef = useRef(null);

  const currentItem = items?.find((item) => item.id === product?.id);
  const currentQty = currentItem ? currentItem.quantity : 0;

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  if (!product) return null;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!product.available) return;

    if (onAddToCart) {
      onAddToCart(product);
    } else {
      addItem(product);
    }

    setIsAdded(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setIsAdded(false);
    }, 1200);
  };

  const getTagBadge = (tag) => {
    const normalized = tag.toLowerCase().trim();
    if (normalized === 'bestseller') return 'bg-[#C5A059] text-black font-bold shadow-sm';
    if (normalized === 'limited edition' || normalized === 'rare' || normalized === 'new') 
      return 'bg-[#9B2948] text-white font-bold shadow-sm';
    if (normalized === 'luxury gifting' || normalized === 'ultimate box' || normalized === 'gift choice') 
      return 'bg-[#1B3A8C] text-white font-bold shadow-sm border border-amber-300/30';
    return 'bg-black/60 text-white backdrop-blur-md border border-white/20';
  };

  // Filter out redundant eggless tag since 100% Eggless pill is already shown on the left
  const displayTags = (product.tags || []).filter(
    (tag) => tag.toLowerCase().trim() !== 'eggless'
  );

  return (
    <motion.div
      whileHover={{ y: -6, transition: { duration: 0.3 } }}
      onClick={() => onOpenModal && onOpenModal(product)}
      className="group rounded-2xl sm:rounded-3xl overflow-hidden bg-white shadow-[0_8px_25px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_50px_rgba(15,36,96,0.18)] flex flex-col justify-between border border-stone-200/80 transition-all duration-300 cursor-pointer relative"
    >
      {/* Top Image Section - Compact on Mobile */}
      <div className="relative h-56 sm:h-72 lg:h-80 w-full overflow-hidden bg-stone-900">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Ambient Gradient Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent pointer-events-none" />

        {/* Eggless Pure Badge & Selection Tracker */}
        <div className="absolute top-3 left-3 z-10 flex flex-col items-start gap-1.5">
          <span className="bg-black/75 backdrop-blur-md text-emerald-300 text-[9px] sm:text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-500/30 uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            100% Pure Eggless
          </span>
          {currentQty > 0 && (
            <span className="bg-[#C5A059] text-stone-950 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-200 shadow-md flex items-center gap-1 uppercase tracking-wider">
              <span>✓</span>
              <span>{currentQty} in Box</span>
            </span>
          )}
        </div>

        {/* Distinct Tags Overlay (Non-Redundant) */}
        {displayTags.length > 0 && (
          <div className="absolute top-3 right-3 flex flex-wrap gap-1 justify-end max-w-[65%] z-10">
            {displayTags.map((tag, index) => (
              <span
                key={`${product.id}-tag-${index}`}
                className={`${getTagBadge(tag)} text-[9px] sm:text-[10px] px-2.5 py-0.5 sm:py-1 rounded-full uppercase tracking-wider`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Weight & Tap hint at bottom of photo */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[11px] font-mono z-10">
          <span className="bg-black/65 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/20 uppercase tracking-wider text-[10px]">
            {product.weight}
          </span>
          <span className="text-[10px] sm:text-[11px] text-amber-200 font-medium group-hover:underline">
            Tasting Notes →
          </span>
        </div>
      </div>

      {/* Bottom Content Section */}
      <div className="p-4 sm:p-6 flex flex-col flex-1 justify-between bg-gradient-to-b from-white to-[#FDFBF7]">
        <div>
          <div className="flex items-center justify-between text-[11px] text-stone-500 font-mono mb-1.5">
            <span className="text-[#7C5E28] font-semibold uppercase tracking-wider">
              {product.serves ? `Serves ${product.serves}` : 'Artisan Cut'}
            </span>
            <span className="text-stone-400 text-[10px]">Fresh Daily</span>
          </div>

          <h3 className="font-heading text-lg sm:text-2xl font-bold text-stone-900 group-hover:text-[#1B3A8C] transition-colors leading-snug">
            {product.name}
          </h3>

          <p className="text-xs sm:text-sm text-stone-600 mt-1.5 sm:mt-2 line-clamp-2 leading-relaxed font-light">
            {product.shortDesc}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-stone-200/70">
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="text-[9px] uppercase tracking-widest text-stone-400 block font-mono">Price</span>
              <span className="text-xl sm:text-3xl font-bold font-heading text-[#0C419C]">
                ₹{product.price}
              </span>
            </div>

            {!product.available ? (
              <span className="bg-stone-100 text-stone-400 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider cursor-not-allowed">
                Sold Out
              </span>
            ) : currentQty > 0 ? (
              <div 
                onClick={(e) => e.stopPropagation()} 
                className="inline-flex items-center rounded-full bg-[#0C419C] text-white p-1 border border-[#C5A059]/40 shadow-md"
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateQuantity(product.id, currentQty - 1);
                  }}
                  aria-label="Decrease quantity"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 text-white flex items-center justify-center text-sm font-bold transition-all cursor-pointer"
                >
                  −
                </button>
                <div className="px-2.5 sm:px-3 text-center min-w-[65px] sm:min-w-[70px]">
                  <span className="text-xs font-bold font-mono text-[#C5A059] block leading-tight">
                    {currentQty} in Box
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateQuantity(product.id, currentQty + 1);
                  }}
                  aria-label="Increase quantity"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#C5A059] hover:bg-amber-300 text-stone-950 active:scale-90 flex items-center justify-center text-sm font-bold transition-all cursor-pointer shadow-sm"
                >
                  +
                </button>
              </div>
            ) : isAdded ? (
              <button
                type="button"
                disabled
                className="bg-emerald-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-md scale-102 transition-all"
              >
                <span>Added</span>
                <span>✓</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleAddToCart}
                className="bg-[#0C419C] hover:bg-[#072561] active:scale-95 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 shadow-md hover:shadow-indigo-900/30 cursor-pointer"
              >
                <span>Add To Box</span>
                <span className="text-sm font-light">+</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
