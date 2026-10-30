import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CookieCard from './CookieCard';
import CookieModal from './CookieModal';
import BoxBuilderProgress from './BoxBuilderProgress';
import { useMenu } from '../context/MenuContext';
import { useCart } from '../context/CartContext';

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [samplerAdded, setSamplerAdded] = useState(false);
  const { addItem, openCheckout } = useCart();
  const { products, categories: menuCategories, storeConfig } = useMenu();

  const categories = [
    { id: 'all', name: 'All Drops', emoji: '✨' },
    ...menuCategories,
  ];

  const filteredProducts =
    activeCategory === 'all'
      ? products
      : products.filter((product) => product.category === activeCategory);

  // 1-Tap "Try Everything" Chef's Tasting Flight (Adds top 4 available individual cookies)
  const handleAddTastingFlight = (andCheckout = false) => {
    const individualCookies = products
      .filter((p) => p.available && p.category !== 'combos')
      .slice(0, 4);
    individualCookies.forEach((cookie) => addItem(cookie));
    setSamplerAdded(true);
    setTimeout(() => setSamplerAdded(false), 2000);
    if (andCheckout) {
      openCheckout();
    }
  };

  return (
    <section
      id="menu"
      className="relative bg-[#FAF6EE] py-12 sm:py-20 px-4 sm:px-6 lg:px-8 border-t border-brand-warm/15"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header with Editorial Storytelling */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10">
          <span className="section-label text-brand-warm text-[10px] sm:text-xs mb-2">
            Baked Fresh Daily in Limited Batches
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight text-brand-dark mt-1">
            The Sukié Collection
          </h2>
          <p className="text-stone-600 text-xs sm:text-base font-light leading-relaxed mt-2.5 max-w-lg mx-auto">
            170g (6oz) oversized NYC-style cookies with molten Belgian chocolate cores. Hand-portioned and flash-baked fresh for your pickup slot.
          </p>

          {/* Freshness Badge (Dynamic from Admin) */}
          <div className="inline-flex items-center gap-2 mt-4 px-4 py-1.5 rounded-full bg-[#07132B] border border-[#C5A059]/50 text-[#F3E5AB] text-[10px] sm:text-xs font-semibold uppercase tracking-wider shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{storeConfig?.ovenStatusText || 'Ovens Fired Today • Pre-Orders Active'}</span>
          </div>
        </div>

        {/* Interactive Box Builder Progress Bar */}
        <BoxBuilderProgress />

        {/* "Want to Try Everything?" 1-Tap Chef's Sampler Strip */}
        <div className="mb-6 sm:mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#FFFDF9] via-[#FAF3E3] to-[#FFFDF9] border border-[#C5A059]/45 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center md:text-left">
            <div className="hidden sm:flex -space-x-2.5 shrink-0">
              {products
                .filter((p) => p.category !== 'combos')
                .slice(0, 4)
                .map((p) => (
                  <img
                    key={p.id}
                    src={p.image}
                    alt={p.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-[#C5A059] shadow-xs"
                  />
                ))}
            </div>
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A6621] font-bold">
                  ✦ First Time at Sukié?
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-600/15 text-emerald-800 text-[9px] font-mono font-bold uppercase">
                  Unlocks Free Gift Box
                </span>
              </div>
              <h3 className="font-heading text-base sm:text-lg font-bold text-[#07132B]">
                Try the Chef&apos;s 4-Flavour Tasting Flight
              </h3>
              <p className="text-xs text-stone-600">
                Adds 1 of each signature 170g cookie to your box in a single tap — you can still customize quantities after!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-center shrink-0">
            <button
              type="button"
              onClick={() => handleAddTastingFlight(false)}
              className="flex-1 md:flex-initial px-4 py-2.5 rounded-full bg-[#0C419C] hover:bg-[#082B6B] text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
            >
              {samplerAdded ? '✓ 4 Flavours Added!' : '+ Add All 4 to Box'}
            </button>
            <button
              type="button"
              onClick={() => handleAddTastingFlight(true)}
              className="px-4 py-2.5 rounded-full bg-[#C5A059] hover:bg-[#D4B86A] text-stone-950 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
            >
              Instant Checkout →
            </button>
          </div>
        </div>

        {/* Clean Wrapped Category Pills (Zero Horizontal Scroll Needed) */}
        <div className="mb-8 sm:mb-10">
          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-2.5">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <motion.button
                  key={cat.id}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`relative px-4 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-colors duration-200 cursor-pointer flex items-center gap-1.5 shadow-xs ${
                    isActive
                      ? 'text-white'
                      : 'bg-white text-stone-700 hover:text-stone-950 border border-[#C5A059]/30'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="menuCatPill"
                      className="absolute inset-0 bg-brand-blue rounded-full shadow-md -z-10"
                      transition={{ type: 'spring', damping: 22, stiffness: 280 }}
                    />
                  )}
                  <span className="text-brand-gold text-[10px]">✦</span>
                  <span>{cat.name}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Product Cards Grid with AnimatePresence */}
        <motion.div
          id="cookie-grid"
          layout
          className="scroll-mt-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          <AnimatePresence>
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
              >
                <CookieCard
                  product={product}
                  onAddToCart={addItem}
                  onOpenModal={(prod) => setSelectedProduct(prod)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Curated Gift Sets Banner */}
        <div className="mt-12 sm:mt-20 p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-[#07132B] via-[#0C419C] to-[#07132B] text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 border border-[#C5A059]/45 text-center md:text-left">
          <div className="space-y-2">
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] font-bold text-[#F3E5AB] font-mono">
              ✦ Royal Cobalt Keepsake Gifting
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl font-bold">
              Gifting Someone Special or Ordering for a Group?
            </h3>
            <p className="text-white/80 text-xs sm:text-sm max-w-xl font-light leading-relaxed">
              Choose our Assorted 4-Pack (₹1,149) or 6-Pack Ultimate Box (₹1,699) in our signature royal cobalt keepsake box with gold foil seal and warming ritual card.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            <button
              type="button"
              onClick={() => {
                setActiveCategory('combos');
                const el = document.getElementById('cookie-grid');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto bg-[#C5A059] hover:bg-[#D4B86A] text-stone-950 font-bold px-7 py-3.5 rounded-full text-xs uppercase tracking-widest shadow-lg transition-transform active:scale-95 cursor-pointer"
            >
              Explore Gift Boxes →
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Detail Modal */}
      <CookieModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </section>
  );
}
