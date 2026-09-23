import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ComingSoon({ onEnterPreview }) {
  const [isCracked, setIsCracked] = useState(false);

  const teaserFlavours = [
    {
      name: "Triple Chocolate Overload",
      scale: "170g (6oz)",
      core: "54.5% Dark Ganache Lava",
      image: "/images/triple_chocolate.jpg",
      tag: "Drop 01 Headliner"
    },
    {
      name: "Pistachio White Gianduja",
      scale: "170g (6oz)",
      core: "In-House Sicilian Gianduja",
      image: "/images/pistachio.jpg",
      tag: "Signature Masterpiece"
    },
    {
      name: "Popcorn Praliné Toffee",
      scale: "170g (6oz)",
      core: "French Browned Butter & Toffee",
      image: "/images/popcorn_praline.jpg",
      tag: "Chef's Creation"
    },
    {
      name: "Cupid's Ruby Chocolate",
      scale: "170g (6oz)",
      core: "Ruby 33% & Cheesecake",
      image: "/images/ruby_chocolate.jpg",
      tag: "Rare Edition"
    }
  ];

  const whatsappVipUrl = "https://wa.me/919136498467?text=Hello%20Suki%C3%A9!%20%F0%9F%8D%AA%20I%20want%20to%20reserve%20VIP%20priority%20access%20for%20the%20Mumbai%20Launch%20Drop%2001!";

  return (
    <div className="min-h-screen bg-[#050811] text-white relative overflow-hidden flex flex-col justify-between selection:bg-[#C5A059] selection:text-stone-950 font-body">
      {/* Background Lighting & Atmospheric Nebulas */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[600px] sm:h-[900px] bg-radial from-[#0C419C]/30 via-[#071330]/20 to-transparent blur-[160px]" />
        <div className="absolute top-1/3 -right-32 w-80 sm:w-[500px] h-80 sm:h-[500px] bg-[#C5A059]/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 -left-20 w-80 sm:w-[450px] h-80 sm:h-[450px] bg-[#163D85]/20 rounded-full blur-[140px]" />
        {/* Subtle Luxury Dot Grid */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:28px_28px]" />
      </div>

      {/* Top Header Bar */}
      <header className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-8 pt-6 sm:pt-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/images/logo.png"
            alt="Sukié Cookies"
            className="w-11 h-11 sm:w-14 sm:h-14 rounded-full object-cover ring-2 ring-[#C5A059]/50 shadow-[0_0_20px_rgba(197,160,89,0.3)]"
          />
          <div className="flex flex-col">
            <span className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-white leading-none">
              Sukié
            </span>
            <span className="text-[9px] sm:text-[10px] tracking-[0.25em] font-mono uppercase text-[#C5A059] mt-0.5">
              Mumbai Atelier
            </span>
          </div>
        </div>

        {/* Live Kitchen Status Pill */}
        <div className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-[11px] font-mono text-white/70">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Batch #001 in Final Testing</span>
        </div>
      </header>

      {/* Center Main Hero & Interactive Sensory Teaser */}
      <main className="relative z-10 max-w-5xl mx-auto w-full px-4 sm:px-6 py-10 sm:py-16 flex flex-col items-center text-center">
        
        {/* Mysterious Status Tag */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-[#C5A059]/40 backdrop-blur-md mb-6 shadow-[0_0_15px_rgba(197,160,89,0.15)]"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-ping" />
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.22em] text-[#C5A059] font-bold">
            MUMBAI ATELIER • FIRST DROP IN PREPARATION
          </span>
        </motion.div>

        {/* Main Dramatic Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[1.05] max-w-4xl"
        >
          The 170g Volcanic Molten Cookie{' '}
          <span className="block font-serif italic font-light text-gold-gradient mt-1">
            is Arriving in Mumbai.
          </span>
        </motion.h1>

        {/* Editorial Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-white/75 text-sm sm:text-lg md:text-xl font-light max-w-2xl mx-auto mt-5 sm:mt-6 leading-relaxed"
        >
          Authentic NYC giant scale. French browned butter. Pure Belgian Callebaut couverture ganache.
          <strong className="block text-white font-medium mt-1">
            100% Pure Eggless. Baked fresh daily in strictly limited drops.
          </strong>
        </motion.p>

        {/* Interactive "Tap To Crack" Cookie Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="my-10 sm:my-14 relative group cursor-pointer select-none"
          onClick={() => setIsCracked(!isCracked)}
        >
          {/* Ambient Radiant Lava Aura */}
          <motion.div
            animate={{
              scale: isCracked ? [1, 1.15, 1.05] : [1, 1.06, 1],
              opacity: isCracked ? 0.85 : 0.45,
            }}
            transition={{ duration: 2.5, repeat: Infinity, repeatType: 'reverse' }}
            className={`absolute -inset-4 sm:-inset-6 rounded-full blur-2xl pointer-events-none transition-colors duration-500 ${
              isCracked
                ? 'bg-gradient-to-r from-amber-500 via-orange-600 to-[#C5A059]'
                : 'bg-gradient-to-r from-[#0C419C] via-[#C5A059]/40 to-[#0C419C]'
            }`}
          />

          {/* Cookie Circular Frame */}
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full p-2 bg-gradient-to-b from-[#C5A059]/70 via-[#C5A059]/20 to-transparent shadow-[0_20px_60px_rgba(0,0,0,0.9)]">
            <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white/20 bg-stone-900 shadow-inner">
              <motion.img
                src="/images/triple_chocolate.jpg"
                alt="Sukié NYC Cookie Core"
                className="w-full h-full object-cover"
                animate={{
                  scale: isCracked ? 1.12 : 1.04,
                  rotate: isCracked ? 2 : 0,
                }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              />

              {/* Fissure Vein Overlay when Cracked */}
              <AnimatePresence>
                {isCracked && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-radial from-amber-500/40 via-red-900/30 to-transparent pointer-events-none flex items-center justify-center"
                  >
                    <div className="w-1 h-32 bg-gradient-to-b from-transparent via-amber-300 to-transparent blur-[1px] rotate-45 animate-pulse" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Top Hint Badge */}
              <div className="absolute top-4 inset-x-0 flex justify-center z-10">
                <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-[#C5A059]/50 text-[#C5A059] text-[10px] font-mono uppercase tracking-widest font-bold shadow-md">
                  {isCracked ? '✦ MOLTEN GANACHE RELEASED' : 'TAP TO CRACK THE CORE ✦'}
                </span>
              </div>

              {/* Bottom Weight Badge */}
              <div className="absolute bottom-4 inset-x-0 flex justify-center z-10">
                <span className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-white/90 text-[10px] font-mono uppercase tracking-wider border border-white/20">
                  170 Grams • Convection Flash-Baked
                </span>
              </div>
            </div>
          </div>

          {/* Crack Description Toast */}
          <AnimatePresence mode="wait">
            {isCracked ? (
              <motion.div
                key="cracked-toast"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-4 px-4 py-2 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-200 text-xs font-mono max-w-sm mx-auto shadow-md"
              >
                🔥 54.5% Callebaut ganache core liquefying at 160°C. Tap again to seal.
              </motion.div>
            ) : (
              <motion.div
                key="tap-hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-[11px] text-white/50 font-mono"
              >
                (Click or tap the cookie to simulate the warm crack ritual)
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* VIP Priority Waitlist Card */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="w-full max-w-xl p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0B1530] via-[#091024] to-[#040710] border border-[#C5A059]/40 shadow-2xl relative overflow-hidden"
        >
          {/* Subtle Ambient Gold Flare */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#C5A059]/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-center gap-2">
              <span className="text-amber-300">★</span>
              <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[#C5A059] font-bold">
                BATCH #001 VIP RESERVATION
              </span>
              <span className="text-amber-300">★</span>
            </div>

            <h2 className="font-heading text-xl sm:text-3xl font-bold text-white leading-snug">
              Only 100 Keepsake Boxes in Drop #001.
            </h2>

            <p className="text-white/70 text-xs sm:text-sm font-light leading-relaxed max-w-md mx-auto">
              Our inaugural bake is individually numbered and sealed with gold wax in our signature royal cobalt box. Reserve your VIP allocation directly with the Chef on WhatsApp.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={whatsappVipUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-gradient-to-r from-[#C5A059] via-[#D4B86A] to-[#C5A059] text-stone-950 font-bold text-xs uppercase tracking-widest shadow-[0_10px_25px_rgba(197,160,89,0.35)] hover:shadow-[0_15px_35px_rgba(197,160,89,0.5)] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Reserve VIP Access on WhatsApp</span>
                <span className="text-base">💬</span>
              </a>

              <a
                href="https://instagram.com/sukie.mumbai"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-3 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs font-medium uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Follow @sukie.mumbai</span>
                <span>📸</span>
              </a>
            </div>

            <span className="block text-[10px] text-white/40 font-mono pt-1">
              Zero spam. Direct 1-on-1 notification the second pre-orders open.
            </span>
          </div>
        </motion.div>

        {/* Drop 01 Mystery Flavour Preview Row */}
        <div className="mt-14 sm:mt-20 w-full">
          <div className="text-center mb-6">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C5A059] block">
              ✦ SNEAK PEEK ✦
            </span>
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-white mt-1">
              Drop #001 Signature Lineup
            </h3>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-left">
            {teaserFlavours.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#C5A059]/40 transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="relative h-28 sm:h-36 w-full rounded-xl overflow-hidden mb-3 bg-stone-900">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                  <span className="absolute bottom-1.5 left-2 text-[9px] font-mono text-[#C5A059] bg-black/70 px-1.5 py-0.5 rounded">
                    {item.scale}
                  </span>
                </div>

                <div>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-amber-300 block mb-0.5">
                    {item.tag}
                  </span>
                  <h4 className="font-heading text-xs sm:text-sm font-bold text-white line-clamp-1">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-white/60 font-light mt-0.5 line-clamp-1">
                    {item.core}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* Bottom Footer & Discreet Atelier Preview Access */}
      <footer className="relative z-20 border-t border-white/10 py-6 px-4 text-center text-xs text-white/50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>© 2026 Sukié Mumbai</span>
            <span>•</span>
            <span>100% Pure Eggless</span>
            <span>•</span>
            <span>South Mumbai Atelier</span>
          </div>

          {/* Discreet Atelier Menu Preview Toggle */}
          {onEnterPreview && (
            <button
              type="button"
              onClick={onEnterPreview}
              className="text-[11px] font-mono text-[#C5A059] hover:text-white px-3 py-1.5 rounded-full border border-[#C5A059]/40 hover:border-white/50 bg-black/40 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span>✦</span>
              <span>Enter Atelier Menu Preview</span>
              <span className="text-[9px] opacity-70">(Staff / Tasting Demo)</span>
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
