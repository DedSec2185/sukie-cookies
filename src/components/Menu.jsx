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
    { id: 'all', name: 'Full Collection', emoji: '✨' },
    ...menuData.categories,
  ];

  const filteredProducts =
    activeCategory === 'all'
      ? menuData.products
      : menuData.products.filter((product) => product.category === activeCategory);

  return (
    <section id="menu" className="relative bg-[#FAF6EE] py-24 px-4 sm:px-6 lg:px-8 border-t border-brand-warm/15">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="section-label text-brand-warm mb-3">
            Handcrafted Daily in Limited Batches
          </span>
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-brand-dark mt-2">
            The Sukié Collection
          </h2>
          <p className="text-gray-600 text-base sm:text-lg font-light leading-relaxed mt-4">
            Each giant cookie is individually hand-portioned to 170g (6oz) and baked fresh. 
            When a limited drop sells out for the day, our ovens rest until the next morning.
          </p>

          {/* Freshness Badge */}
          <div className="inline-flex items-center gap-2 mt-6 px-4 py-1.5 rounded-full bg-brand-gold/15 border border-brand-gold/30 text-brand-dark text-xs font-semibold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Ovens Fired Today • Next Day Pre-Orders Available</span>
          </div>
        </div>

        {/* Animated Category Tabs */}
        <div className="flex justify-center mb-14 overflow-x-auto py-2 no-scrollbar">
          <div className="inline-flex p-1.5 rounded-full bg-white shadow-md border border-brand-warm/10 gap-1 sm:gap-2">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`relative px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-colors duration-300 cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                    isActive ? 'text-white' : 'text-gray-600 hover:text-brand-dark'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeMenuTab"
                      className="absolute inset-0 bg-brand-blue rounded-full shadow-md"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{cat.emoji}</span>
                  <span className="relative z-10">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Cards Grid with AnimatePresence */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
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

        {/* Chef's Custom Assortment Banner */}
        <div className="mt-20 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-brand-blue-dark via-brand-blue to-indigo-950 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 border border-brand-gold/30">
          <div className="space-y-3 text-center md:text-left">
            <span className="text-xs uppercase tracking-[0.3em] font-bold text-brand-gold">
              Curated Gift Sets
            </span>
            <h3 className="font-heading text-3xl sm:text-4xl font-bold">
              Can&apos;t Decide on One Flavour?
            </h3>
            <p className="text-white/80 text-sm sm:text-base max-w-xl font-light">
              Choose our Assorted 4-Pack or 6-Pack Box. Individually wrapped in our bespoke cobalt gift packaging with custom warming instructions.
            </p>
          </div>

          <button
            onClick={() => setActiveCategory('combos')}
            className="shrink-0 bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-bold px-8 py-4 rounded-full text-xs uppercase tracking-widest shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          >
            View Gift Boxes →
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
