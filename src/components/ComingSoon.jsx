import { motion } from 'framer-motion';

export default function ComingSoon({ onEnterPreview }) {
  const whatsappVipUrl =
    "https://wa.me/919136498467?text=Hello%20Suki%C3%A9!%20%F0%9F%8D%AA%20Please%20notify%20me%20when%20the%20first%20drop%20goes%20live%20in%20Mumbai!";

  const highlights = [
    { label: "170g Monster Scale", desc: "Authentic NYC Giant Proportions", icon: "⚖️" },
    { label: "100% Pure Eggless", desc: "European Butter & Pure Craft", icon: "🌿" },
    { label: "Belgian Couverture", desc: "Callebaut Molten Ganache", icon: "🍫" },
    { label: "Baked Fresh in Mumbai", desc: "Limited Daily Kitchen Drops", icon: "✨" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#092B6B] via-[#0C419C] to-[#061F52] text-white relative overflow-x-hidden selection:bg-[#C5A059] selection:text-stone-950 font-body flex flex-col justify-between">
      
      {/* 1. Atmospheric Sukié Vividblue Lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Soft Radial Ambient Aura */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[1000px] h-[500px] sm:h-[700px] bg-radial from-[#1A5ED1]/40 via-transparent to-transparent blur-[140px]" />
        <div className="absolute -bottom-20 -left-20 w-80 sm:w-[500px] h-80 sm:h-[500px] bg-[#072461]/60 rounded-full blur-[130px]" />
        <div className="absolute -top-20 -right-20 w-80 sm:w-[500px] h-80 sm:h-[500px] bg-[#C5A059]/15 rounded-full blur-[130px]" />
        
        {/* Subtle Luxury Pattern */}
        <div className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(#F3E5AB_1px,transparent_1px)] [background-size:32px_32px]" />
      </div>

      {/* 2. Top Header Navigation */}
      <header className="relative z-20 max-w-6xl mx-auto w-full px-4 sm:px-8 pt-8 sm:pt-10 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3.5"
        >
          <img
            src="/images/logo.png"
            alt="Sukié Logo"
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover ring-2 ring-[#C5A059] shadow-[0_0_20px_rgba(197,160,89,0.35)]"
          />
          <div className="flex flex-col">
            <span className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-white leading-none">
              Sukié
            </span>
            <span className="text-[10px] tracking-[0.25em] font-mono uppercase text-[#F3E5AB] font-semibold mt-1">
              MUMBAI ATELIER
            </span>
          </div>
        </motion.div>

        {/* Status Pill */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-[#C5A059]/40 backdrop-blur-md shadow-md text-xs font-mono text-[#F3E5AB]"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Kitchen In Preparation</span>
        </motion.div>
      </header>

      {/* 3. Main Centerpiece & Headlines */}
      <main className="relative z-10 max-w-4xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-20 text-center flex flex-col items-center my-auto">
        
        {/* Floating Brand Emblem */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
          transition={{
            opacity: { duration: 0.7 },
            scale: { duration: 0.7 },
            y: { duration: 5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' },
          }}
          className="relative mb-8"
        >
          <div className="absolute -inset-4 bg-radial from-[#C5A059]/30 to-transparent rounded-full blur-xl pointer-events-none" />
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full p-1.5 bg-gradient-to-b from-[#F3E5AB] via-[#C5A059] to-[#0A2668] shadow-[0_15px_45px_rgba(0,0,0,0.5)]">
            <img
              src="/images/logo.png"
              alt="Sukié Cookies Official Logo"
              className="w-full h-full rounded-full object-cover shadow-inner"
            />
          </div>
        </motion.div>

        {/* Refined Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#072152]/80 border border-[#C5A059]/50 backdrop-blur-md shadow-md mb-6"
        >
          <span className="text-[#C5A059] text-xs">✦</span>
          <span className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.22em] text-[#F3E5AB] font-bold">
            NEW YORK CITY GOURMET COOKIES • COMING SOON
          </span>
          <span className="text-[#C5A059] text-xs">✦</span>
        </motion.div>

        {/* Grand Authentic Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-heading text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[1.08] max-w-3xl"
        >
          Something Extraordinary{' '}
          <span className="block font-serif italic font-light text-transparent bg-clip-text bg-gradient-to-r from-[#FFF9E6] via-[#F3E5AB] to-[#C5A059] mt-1.5 drop-shadow-md">
            is Baking in Mumbai.
          </span>
        </motion.h1>

        {/* Refined Editorial Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-white/85 text-sm sm:text-lg md:text-xl font-light max-w-2xl mx-auto mt-6 leading-relaxed"
        >
          Oversized 170g molten-centered cookies crafted with Belgian Callebaut couverture, French browned butter &amp; an uncompromising 100% pure eggless recipe. Baked fresh in limited daily drops.
        </motion.p>

        {/* 4 Brand Pillars Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 w-full max-w-3xl my-8 sm:my-10"
        >
          {highlights.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 sm:p-4 rounded-2xl bg-[#061F4D]/70 border border-[#C5A059]/35 backdrop-blur-md text-center flex flex-col items-center justify-center shadow-md"
            >
              <span className="text-xl mb-1.5">{item.icon}</span>
              <strong className="text-xs sm:text-sm font-heading font-bold text-white block">
                {item.label}
              </strong>
              <span className="text-[10px] text-[#F3E5AB]/80 font-mono mt-0.5">
                {item.desc}
              </span>
            </div>
          ))}
        </motion.div>

        {/* VIP Waitlist Notification Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="w-full max-w-xl rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#072461] via-[#0C419C] to-[#051A40] border-2 border-[#C5A059]/80 shadow-[0_20px_60px_rgba(0,0,0,0.45)] relative overflow-hidden"
        >
          <div className="relative z-10 space-y-4">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#F3E5AB] font-bold block">
              ✦ BE THE FIRST TO TASTE ✦
            </span>

            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white leading-snug">
              Get Notified When Our First Drop Goes Live.
            </h2>

            <p className="text-white/80 text-xs sm:text-sm font-light leading-relaxed max-w-md mx-auto">
              Our batches are limited and sell out fast. Message us directly on WhatsApp to receive priority notification the moment pre-orders officially unlock.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <motion.a
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                href={whatsappVipUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#F3E5AB] via-[#C5A059] to-[#D4B86A] text-stone-950 font-bold text-xs uppercase tracking-widest shadow-lg hover:shadow-amber-400/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Notify Me on WhatsApp</span>
                <span className="text-base">💬</span>
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                href="https://instagram.com/sukie.mumbai"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/25 text-xs font-semibold uppercase tracking-wider backdrop-blur-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Follow @sukie.mumbai</span>
                <span>📸</span>
              </motion.a>
            </div>

            <span className="block text-[10px] text-[#F3E5AB]/75 font-mono pt-1">
              Direct notification only. No marketing spam.
            </span>
          </div>
        </motion.div>

      </main>

      {/* 4. Infinite Luxury Brand Marquee */}
      <div className="w-full bg-[#051B42] border-y border-[#C5A059]/35 py-3 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-8 mx-4 text-xs font-mono uppercase tracking-[0.25em] text-[#F3E5AB]">
              <span>✦ 170G NYC GIANT SCALE</span>
              <span>•</span>
              <span>100% PURE EGGLESS</span>
              <span>•</span>
              <span>BELGIAN CALLEBAUT GANACHE</span>
              <span>•</span>
              <span>FRENCH BEURRE NOISETTE</span>
              <span>•</span>
              <span>MUMBAI ATELIER</span>
              <span>•</span>
              <span>LIMITED DAILY DROPS</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Clean Footer & Discreet Atelier Menu Preview */}
      <footer className="relative z-20 border-t border-white/10 py-6 px-4 text-center text-xs text-white/70">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span>© 2026 Sukié NYC Cookies</span>
            <span>•</span>
            <span>100% Pure Eggless</span>
            <span>•</span>
            <span>Mumbai</span>
          </div>

          {/* Discreet Atelier Menu Preview Toggle */}
          {onEnterPreview && (
            <button
              type="button"
              onClick={onEnterPreview}
              className="text-[11px] font-mono text-[#F3E5AB] hover:text-white px-4 py-1.5 rounded-full border border-[#C5A059]/50 hover:border-white bg-[#061F4D]/70 backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
            >
              <span>✦</span>
              <span>Enter Atelier Menu Preview</span>
              <span className="text-[9px] opacity-75">(Staff / Private Tasting Demo)</span>
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
