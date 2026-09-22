import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CookieCard from './CookieCard';
import CookieModal from './CookieModal';
import { menuData } from '../data/menuData';
import { useCart } from '../context/CartContext';

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addItem } = useCart();

  const categories = [
    { id: 'all', name: 'All Drops', emoji: '✨' },
    ...menuData.categories,
  ];

  const filteredProducts =
    activeCategory === 'all'
      ? menuData.products
      : menuData.products.filter((product) => product.category === activeCategory);

  return (
    <section id="menu" className="relative bg-[#FAF6EE] py-12 sm:py-20 px-4 sm:px-6 lg:px-8 border-t border-brand-warm/15">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header with Breathing Room */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-14">
          <span className="section-label text-brand-warm text-[10px] sm:text-xs mb-2">
            Baked Fresh Daily in Limited Batches
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight text-brand-dark mt-1">
            The Sukié Collection
          </h2>
          <p className="text-stone-600 text-xs sm:text-base font-light leading-relaxed mt-2.5 max-w-lg mx-auto">
            170g (6oz) oversized molten cookies. When a drop sells out, our ovens rest until the next morning.
          </p>

          {/* Freshness Badge */}
          <div className="inline-flex items-center gap-2 mt-4 px-3.5 py-1 rounded-full bg-brand-gold/15 border border-brand-gold/30 text-brand-dark text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Ovens Fired Today • Pre-Orders Active</span>
          </div>
        </div>

        {/* Mobile Swipeable Category Pills */}
        <div className="mb-8 sm:mb-12 -mx-4 px-4 overflow-x-auto no-scrollbar">
          <div className="flex sm:justify-center items-center gap-2 min-w-max pb-1">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`relative px-4 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 cursor-pointer flex items-center gap-1.5 whitespace-nowrap shadow-xs ${
                    isActive 
                      ? 'bg-[#1B3A8C] text-white shadow-md' 
                      : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Cards Grid with AnimatePresence */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8"
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
        <div className="mt-12 sm:mt-20 p-6 sm:p-10 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-brand-blue-dark via-brand-blue to-indigo-950 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-brand-gold/30 text-center md:text-left">
          <div className="space-y-1.5">
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] font-bold text-brand-gold font-mono">
              Curated Gift Sets
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl font-bold">
              Can&apos;t Decide on One Flavour?
            </h3>
            <p className="text-white/80 text-xs sm:text-sm max-w-lg font-light">
              Choose our Assorted 4-Pack or 6-Pack Box in our signature royal cobalt gift packaging with custom warming guide.
            </p>
          </div>

          <button
            onClick={() => {
              setActiveCategory('combos');
              const el = document.getElementById('menu');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full sm:w-auto shrink-0 bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-bold px-7 py-3.5 rounded-full text-xs uppercase tracking-widest shadow-lg transition-transform active:scale-95 cursor-pointer"
          >
            Explore Gift Boxes →
          </button>
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
