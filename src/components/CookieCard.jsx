import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function CookieCard({ product, onAddToCart, onOpenModal }) {
  const [isAdded, setIsAdded] = useState(false);
  const timerRef = useRef(null);

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
    }

    setIsAdded(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setIsAdded(false);
    }, 1200);
  };

  const getTagBadge = (tag) => {
    const normalized = tag.toLowerCase().trim();
    if (normalized === 'bestseller') return 'bg-[#C5A059] text-black font-bold shadow-md';
    if (normalized === 'limited edition' || normalized === 'rare' || normalized === 'new') 
      return 'bg-[#9B2948] text-white font-bold shadow-md';
    if (normalized === 'luxury gifting' || normalized === 'ultimate box') 
      return 'bg-[#1B3A8C] text-white font-bold shadow-md border border-amber-300/40';
    return 'bg-black/60 text-white backdrop-blur-md border border-white/20';
  };

  return (
    <motion.div
      whileHover={{ y: -10, transition: { duration: 0.35, ease: 'easeOut' } }}
      onClick={() => onOpenModal && onOpenModal(product)}
      className="group rounded-3xl overflow-hidden bg-white shadow-[0_15px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_30px_70px_rgba(15,36,96,0.22)] flex flex-col justify-between border border-stone-200/80 transition-all duration-500 cursor-pointer relative"
    >
      {/* Top Image Section with Smooth Parallax Hover */}
      <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-stone-900">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Ambient Gradient Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />

        {/* Eggless Pure Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-black/70 backdrop-blur-md text-emerald-300 text-[10px] font-bold px-3 py-1 rounded-full border border-emerald-500/30 uppercase tracking-widest flex items-center gap-1.5 shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            100% Eggless
          </span>
        </div>

        {/* Tags Overlay */}
        {product.tags && product.tags.length > 0 && (
          <div className="absolute top-4 right-4 flex flex-wrap gap-1.5 justify-end max-w-[70%] z-10">
            {product.tags.map((tag, index) => (
              <span
                key={`${product.id}-tag-${index}`}
                className={`${getTagBadge(tag)} text-[10px] px-3 py-1 rounded-full uppercase tracking-wider`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Weight Pill at Bottom of Image */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs font-mono z-10">
          <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 uppercase tracking-wider">
            {product.weight}
          </span>
          <span className="text-[11px] text-amber-200/90 font-medium group-hover:text-amber-100 transition-colors">
            Tap for Tasting Notes →
          </span>
        </div>
      </div>

      {/* Bottom Content Section */}
      <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between bg-gradient-to-b from-white to-[#FDFBF7]">
        <div>
          <div className="flex items-center justify-between text-xs text-stone-500 font-mono mb-2">
            <span className="text-[#7C5E28] font-semibold uppercase tracking-wider">
              {product.serves ? `Serves ${product.serves}` : 'Artisan Cut'}
            </span>
            <span className="text-stone-400">Freshly Baked Daily</span>
          </div>

          <h3 className="font-heading text-xl sm:text-2xl font-bold text-stone-900 group-hover:text-[#1B3A8C] transition-colors leading-snug">
            {product.name}
          </h3>

          <p className="text-xs sm:text-sm text-stone-600 mt-2.5 line-clamp-2 leading-relaxed font-light">
            {product.shortDesc}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="mt-6 pt-5 border-t border-stone-200/70">
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-stone-400 block font-mono">Price</span>
              <span className="text-2xl sm:text-3xl font-bold font-heading text-[#0F2460]">
                ₹{product.price}
              </span>
            </div>

            {!product.available ? (
              <span className="bg-stone-100 text-stone-400 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider cursor-not-allowed">
                Sold Out
              </span>
            ) : isAdded ? (
              <button
                type="button"
                disabled
                className="bg-emerald-600 text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-md scale-105 transition-all"
              >
                <span>Added to Box</span>
                <span>✓</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleAddToCart}
                className="bg-[#1B3A8C] hover:bg-[#0F2460] active:scale-95 text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-indigo-900/30 cursor-pointer"
              >
                <span>Add To Box</span>
                <span className="text-base font-light">+</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
