import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

export default function CookieCard({ product, onAddToCart, onOpenModal }) {
  const { items, addItem, updateQuantity, openCheckout } = useCart();
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

  const handleInstantBuy = (e) => {
    e.stopPropagation();
    if (!product.available) return;
    if (currentQty === 0) {
      if (onAddToCart) {
        onAddToCart(product);
      } else {
        addItem(product);
      }
    }
    openCheckout();
  };

  const getTagBadge = (tag) => {
    const normalized = tag.toLowerCase().trim();
    if (normalized === 'bestseller') return 'bg-[#C5A059] text-stone-950 font-bold shadow-md';
    if (normalized === 'limited edition' || normalized === 'rare' || normalized === 'new' || normalized === 'new drop')
      return 'bg-[#9B2948] text-white font-bold shadow-md';
    if (normalized === 'luxury gifting' || normalized === 'ultimate box' || normalized === 'gift choice')
      return 'bg-[#0C419C] text-white font-bold shadow-md border border-[#C5A059]/50';
    return 'bg-black/70 text-white backdrop-blur-md border border-white/20';
  };

  // Filter out redundant eggless tag since 100% Eggless pill is already shown on the left
  const displayTags = (product.tags || []).filter(
    (tag) => tag.toLowerCase().trim() !== 'eggless'
  );

  // Extract top 3 key provenance ingredients for sensory pill preview
  const sensoryPills = Array.isArray(product.ingredients)
    ? product.ingredients.slice(0, 3)
    : [];

  return (
    <motion.div
      whileHover={{ y: -6, transition: { duration: 0.3 } }}
      onClick={() => onOpenModal && onOpenModal(product)}
      className="group rounded-3xl overflow-hidden bg-gradient-to-b from-[#FFFDF9] via-white to-[#F9F4E8] shadow-[0_10px_30px_rgba(7,19,43,0.07)] hover:shadow-[0_24px_60px_rgba(12,65,156,0.2)] flex flex-col justify-between border border-[#C5A059]/35 hover:border-[#C5A059] transition-all duration-300 cursor-pointer relative"
    >
      {/* Top Image Section */}
      <div className="relative h-60 sm:h-72 lg:h-80 w-full overflow-hidden bg-[#07132B]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Ambient Luxury Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07132B]/90 via-black/15 to-black/25 pointer-events-none" />

        {/* Eggless Pure Badge & Selection Tracker */}
        <div className="absolute top-3.5 left-3.5 z-10 flex flex-col items-start gap-1.5">
          <span className="bg-black/75 backdrop-blur-md text-emerald-300 text-[9px] sm:text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-500/35 uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            100% Pure Eggless
          </span>
          {currentQty > 0 && (
            <span className="bg-[#C5A059] text-stone-950 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-200 shadow-md flex items-center gap-1 uppercase tracking-wider">
              <span>✓</span>
              <span>{currentQty} in Your Box</span>
            </span>
          )}
        </div>

        {/* Distinct Tags Overlay */}
        {displayTags.length > 0 && (
          <div className="absolute top-3.5 right-3.5 flex flex-wrap gap-1 justify-end max-w-[65%] z-10">
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

        {/* Weight & Interactive Tasting Sheet Trigger at Bottom of Photo */}
        <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between text-white text-[11px] font-mono z-10">
          <div className="flex items-center gap-1.5">
            <span className="bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#C5A059]/40 text-[#F3E5AB] uppercase tracking-wider text-[10px] font-semibold">
              {product.weight}
            </span>
            <span className="hidden sm:inline-block bg-[#0C419C]/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 text-white text-[10px]">
              {product.category === 'combos' ? 'Gift Box' : 'Molten Center'}
            </span>
          </div>
          <span className="text-[10px] sm:text-[11px] text-[#F3E5AB] font-semibold bg-black/55 px-2.5 py-1 rounded-full border border-white/15 group-hover:bg-[#C5A059] group-hover:text-stone-950 transition-colors">
            Inspect Inside →
          </span>
        </div>
      </div>

      {/* Bottom Content Section */}
      <div className="p-4 sm:p-6 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
            <span className="text-[#8A6621] font-bold uppercase tracking-wider flex items-center gap-1">
              <span>✦</span>
              <span>{product.serves ? `Serves ${product.serves}` : 'Artisan Cut'}</span>
            </span>
            <span className="text-stone-400 text-[10px] uppercase tracking-wider">
              Baked to Order
            </span>
          </div>

          <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#07132B] group-hover:text-[#0C419C] transition-colors leading-snug">
            {product.name}
          </h3>

          <p className="text-xs sm:text-sm text-stone-600 mt-1.5 line-clamp-2 leading-relaxed font-light">
            {product.shortDesc}
          </p>

          {/* Sensory Provenance Pills */}
          {sensoryPills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3 pt-2.5 border-t border-stone-200/60">
              {sensoryPills.map((ing, i) => (
                <span
                  key={i}
                  className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#FAF6EE] text-stone-700 border border-[#C5A059]/30 font-medium"
                >
                  {ing}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Price & Action Row */}
        <div className="mt-4 sm:mt-5 pt-3.5 border-t border-[#C5A059]/25">
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="text-[9px] uppercase tracking-widest text-stone-400 block font-mono">
                Atelier Price
              </span>
              <span className="text-2xl sm:text-3xl font-bold font-heading text-[#0C419C]">
                ₹{product.price}
              </span>
            </div>

            {!product.available ? (
              <span className="bg-stone-200 text-stone-500 px-4 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-wider cursor-not-allowed">
                Batch Sold Out
              </span>
            ) : currentQty > 0 ? (
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5"
              >
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  className="inline-flex items-center rounded-full bg-gradient-to-r from-[#07132B] via-[#0C224E] to-[#07132B] text-white p-1 border border-[#C5A059] shadow-md"
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateQuantity(product.id, currentQty - 1);
                    }}
                    aria-label="Decrease quantity"
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 text-[#F3E5AB] flex items-center justify-center text-sm font-bold transition-all cursor-pointer"
                  >
                    −
                  </button>
                  <div className="px-2 sm:px-2.5 text-center min-w-[58px] flex items-center justify-center gap-1">
                    <span className="text-xs font-bold font-mono text-white">
                      {currentQty}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateQuantity(product.id, currentQty + 1);
                    }}
                    aria-label="Increase quantity"
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-[#C5A059] to-[#D4B86A] text-stone-950 active:scale-90 flex items-center justify-center text-sm font-bold transition-all cursor-pointer shadow-sm"
                  >
                    +
                  </button>
                </motion.div>

                <button
                  type="button"
                  onClick={handleInstantBuy}
                  className="px-3 py-2 rounded-full bg-[#C5A059] hover:bg-[#D4B86A] text-stone-950 font-bold text-[10px] uppercase tracking-wider shadow-sm cursor-pointer"
                  title="Proceed directly to Checkout"
                >
                  Pay →
                </button>
              </div>
            ) : isAdded ? (
              <motion.button
                type="button"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1.03 }}
                disabled
                className="bg-emerald-600 text-white px-5 py-2.5 sm:py-3 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md"
              >
                <span>Added</span>
                <span>✓</span>
              </motion.button>
            ) : (
              <div className="flex items-center gap-1.5">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddToCart}
                  className="bg-gradient-to-r from-[#0C419C] to-[#092C6E] hover:from-[#092C6E] hover:to-[#071F52] text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md border border-[#C5A059]/40 cursor-pointer"
                >
                  <span>Add To Box</span>
                  <span className="text-sm font-light text-[#F3E5AB]">+</span>
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
