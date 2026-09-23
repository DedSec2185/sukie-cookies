import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

export default function BoxBuilderProgress() {
  const { totalItems, totalPrice, items, toggleCart } = useCart();

  // Determine target milestone: 4-pack or 6-pack
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

  const progressPercent = Math.min(100, (currentCount / target) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto my-6 sm:my-8 rounded-3xl p-5 sm:p-7 bg-gradient-to-br from-[#061B48] via-[#0C419C] to-[#041029] text-white border-2 border-[#C5A059]/70 shadow-[0_20px_50px_rgba(12,65,156,0.35)] relative overflow-hidden"
    >
      {/* Ambient Inner Gold & Royal Blue Sheen */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#C5A059]/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-[#195CD3]/30 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(#F3E5AB_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="relative z-10">
        
        {/* Top Header: Atelier Title & Status Badge */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-white/15">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 border border-[#C5A059]/60 flex items-center justify-center text-[#F3E5AB] text-lg shadow-inner">
              🎁
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-base sm:text-xl font-bold text-white tracking-wide">
                  Bespoke Box Assembler
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#C5A059]/20 text-[#F3E5AB] border border-[#C5A059]/40 uppercase">
                  {target === 4 ? 'Signature 4-Pack' : 'Grande 6-Pack'}
                </span>
              </div>
              <p className="text-[11px] text-white/70 font-light mt-0.5">
                Curate your custom selection for complimentary royal blue keepsake packaging.
              </p>
            </div>
          </div>

          {/* Status & Review CTA */}
          <div className="flex items-center gap-2.5 self-end sm:self-center">
            <span
              className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider ${
                isComplete
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-[0_0_12px_rgba(52,211,153,0.3)]'
                  : currentCount === 0
                  ? 'bg-white/10 text-white/70 border border-white/15'
                  : 'bg-[#C5A059]/25 text-[#F3E5AB] border border-[#C5A059]/60'
              }`}
            >
              {isComplete
                ? '✓ Box Complete'
                : currentCount === 0
                ? '0 of 4 Selected'
                : `${currentCount} of ${target} Selected`}
            </span>

            {currentCount > 0 && (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={toggleCart}
                className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#F3E5AB] via-[#C5A059] to-[#D4B86A] text-stone-950 text-xs font-bold font-mono uppercase tracking-wider shadow-md hover:brightness-110 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>View Box</span>
                <span>(₹{totalPrice.toLocaleString('en-IN')})</span>
                <span>→</span>
              </motion.button>
            )}
          </div>
        </div>

        {/* Circular Velvet Cushion Alcoves */}
        <div className="py-5 sm:py-6">
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 sm:gap-4 items-center justify-items-center">
            {slots.map((_, index) => {
              const filledItem = filledIcons[index];
              const isFilled = !!filledItem;

              return (
                <div
                  key={`slot-${index}`}
                  className="flex flex-col items-center gap-1.5 w-full"
                >
                  <div
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isFilled
                        ? 'p-0.5 ring-2 ring-[#C5A059] shadow-[0_0_18px_rgba(197,160,89,0.5)] bg-gradient-to-b from-[#F3E5AB] to-[#C5A059]'
                        : 'border-2 border-dashed border-[#C5A059]/40 bg-black/30 hover:border-[#C5A059]/70 hover:bg-black/40'
                    }`}
                  >
                    {isFilled ? (
                      <motion.div
                        initial={{ scale: 0.6, rotate: -15 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', damping: 14, stiffness: 220 }}
                        className="w-full h-full rounded-full overflow-hidden relative group"
                      >
                        <img
                          src={filledItem.image}
                          alt={filledItem.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                        <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-[#0C419C] text-[#F3E5AB] border border-white text-[9px] font-bold font-mono flex items-center justify-center shadow">
                          ✓
                        </span>
                      </motion.div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-[#F3E5AB]/60">
                        <span className="text-base sm:text-lg">✦</span>
                        <span className="text-[9px] font-mono tracking-widest uppercase opacity-75">
                          0{index + 1}
                        </span>
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] font-mono text-white/60 text-center truncate max-w-[70px]">
                    {isFilled ? filledItem.name.split(' ')[0] : `Drop 0${index + 1}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Silky Gold Progress Ribbon & Dynamic Incentive Note */}
        <div className="pt-2">
          {/* Progress Bar Track */}
          <div className="h-1.5 w-full rounded-full bg-black/40 overflow-hidden p-0.5 border border-white/10 mb-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-[#F3E5AB] via-[#C5A059] to-[#D4B86A] shadow-[0_0_10px_rgba(243,229,171,0.6)]"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-white/80 font-light gap-2">
            <span className="flex items-center gap-1.5 text-center sm:text-left">
              <span className="text-[#F3E5AB]">✦</span>
              {isComplete ? (
                <strong className="text-[#F3E5AB] font-medium font-heading text-xs">
                  Perfection achieved! Your box includes complimentary gold foil keepsake unboxing.
                </strong>
              ) : currentCount === 0 ? (
                <span>Pick any 4 gourmet 170g cookies below to begin assembling your bespoke box.</span>
              ) : (
                <span>
                  Add <strong className="text-[#F3E5AB] font-bold">{target - currentCount} more</strong> to unlock the hand-tied champagne gold satin ribbon.
                </span>
              )}
            </span>

            <span className="text-[10px] font-mono text-[#F3E5AB]/90 font-semibold uppercase tracking-wider shrink-0">
              100% Pure Eggless Atelier
            </span>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
