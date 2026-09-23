import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

export default function BoxBuilderProgress() {
  const { totalItems, items, toggleCart } = useCart();

  // Determine target milestone: either 4-pack or 6-pack
  const target = totalItems <= 4 ? 4 : 6;
  const currentCount = totalItems;
  const isComplete = currentCount >= target;

  const slots = Array.from({ length: target });

  // Get item images to display in filled slots
  const filledIcons = [];
  items.forEach((item) => {
    for (let i = 0; i < item.quantity; i++) {
      if (filledIcons.length < target) {
        filledIcons.push(item);
      }
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto my-6 p-4 sm:p-5 rounded-2xl bg-white/80 backdrop-blur-md border border-[#C5A059]/30 shadow-md"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-[#C5A059]/15 text-[#C5A059] text-base">🎁</span>
          <div>
            <h4 className="font-heading text-sm sm:text-base font-bold text-stone-900 leading-tight">
              Bespoke Box Builder
            </h4>
            <span className="text-[11px] text-stone-500 font-mono">
              {target === 4 ? 'Signature 4-Pack Box' : 'Luxury 6-Pack Grande Box'}
            </span>
          </div>
        </div>

        {/* Status Pill */}
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider ${
              isComplete
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-amber-50 text-amber-900 border border-amber-200'
            }`}
          >
            {isComplete
              ? '✓ Box Complete'
              : `${currentCount} of ${target} Selected`}
          </span>

          {currentCount > 0 && (
            <button
              type="button"
              onClick={toggleCart}
              className="text-[11px] font-bold text-[#0C419C] hover:underline cursor-pointer"
            >
              Review Box →
            </button>
          )}
        </div>
      </div>

      {/* Visual Slots Row */}
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 sm:gap-3 py-2">
        {slots.map((_, index) => {
          const filledItem = filledIcons[index];
          const isFilled = !!filledItem;

          return (
            <div
              key={`slot-${index}`}
              className={`relative h-14 sm:h-16 rounded-xl flex items-center justify-center border transition-all duration-300 overflow-hidden ${
                isFilled
                  ? 'border-[#C5A059] bg-[#C5A059]/10 shadow-sm'
                  : 'border-dashed border-stone-300 bg-stone-50/60'
              }`}
            >
              {isFilled ? (
                <motion.div
                  initial={{ scale: 0.5, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', damping: 15 }}
                  className="w-full h-full flex items-center justify-center p-1 relative"
                >
                  <img
                    src={filledItem.image}
                    alt={filledItem.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/20 rounded-lg" />
                  <span className="absolute bottom-1 right-1 text-[8px] font-mono text-white bg-black/70 px-1 rounded">
                    #{index + 1}
                  </span>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center text-stone-400">
                  <span className="text-xs font-mono font-medium">#{index + 1}</span>
                  <span className="text-[9px] uppercase font-mono tracking-wider">Empty</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Dynamic Encouragement Microcopy */}
      <div className="mt-2 text-center sm:text-left text-[11px] text-stone-600 font-light flex items-center justify-between">
        <span>
          {isComplete
            ? '✨ Your box qualifies for complimentary botanical parchment & gold foil unboxing.'
            : currentCount === 0
            ? 'Pick your favorite 170g drops from below to build your curated Mumbai box.'
            : `Add ${target - currentCount} more cookie${
                target - currentCount > 1 ? 's' : ''
              } to complete your luxury keepsake packaging.`}
        </span>
        <span className="hidden sm:inline text-[#C5A059] font-mono font-bold">100% Eggless</span>
      </div>
    </motion.div>
  );
}
