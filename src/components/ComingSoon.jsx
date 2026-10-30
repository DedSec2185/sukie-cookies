import { motion } from 'framer-motion';
import { Sparkles, MessageCircle, ShieldCheck, Flame, Scale, Award } from 'lucide-react';
import { useMenu } from '../context/MenuContext';

export default function ComingSoon({ onEnterPreview, onOpenAdmin }) {
  const { storeConfig } = useMenu();
  const brandLogo = storeConfig?.logoUrl || '/images/logo.png';
  const brandTitle = storeConfig?.brandName || 'Sukié';
  const whatsappVipUrl =
    "https://wa.me/919136498467?text=Hello%20Suki%C3%A9!%20%F0%9F%8D%AA%20Please%20notify%20me%20when%20the%20first%20drop%20goes%20live%20in%20Mumbai!";

  const highlights = [
    { label: "170g Monster Scale", desc: "Authentic NYC Levain", icon: Scale },
    { label: "100% Pure Eggless", desc: "European Butter Craft", icon: ShieldCheck },
    { label: "Belgian Couverture", desc: "Molten Callebaut Core", icon: Award },
    { label: "Flash-Baked in Mumbai", desc: "Limited Daily Drops", icon: Flame },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#06183B] via-[#092B6B] to-[#04122B] text-white relative overflow-x-hidden selection:bg-[#C5A059] selection:text-stone-950 font-body flex flex-col justify-between">
      
      {/* 1. Atmospheric Sukié Royal Blue Ambient Lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[900px] h-[340px] sm:h-[600px] bg-radial from-[#1A5ED1]/35 via-transparent to-transparent blur-[120px]" />
        <div className="absolute -bottom-20 -left-20 w-64 sm:w-[450px] h-64 sm:h-[450px] bg-[#072461]/60 rounded-full blur-[110px]" />
        <div className="absolute -top-20 -right-20 w-64 sm:w-[450px] h-64 sm:h-[450px] bg-[#C5A059]/15 rounded-full blur-[110px]" />
        
        {/* Luxury Gold Micro-Grain */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#F3E5AB_1.5px,transparent_1.5px)] [background-size:24px_24px]" />
      </div>

      {/* 2. Top Header Navigation (Mobile Optimized) */}
      <header className="relative z-20 max-w-6xl mx-auto w-full px-4 sm:px-8 pt-6 sm:pt-10 flex items-center justify-between gap-3">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 shrink-0"
        >
          <div className="w-10 h-10 sm:w-13 sm:h-13 rounded-full p-0.5 bg-gradient-to-b from-[#F3E5AB] via-[#C5A059] to-[#8C6D2B] shadow-[0_0_18px_rgba(197,160,89,0.35)] shrink-0">
            <img
              src={brandLogo}
              alt={`${brandTitle} Logo`}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white leading-none">
              {brandTitle}
            </span>
            <span className="text-[9px] sm:text-[10px] tracking-[0.25em] font-mono uppercase text-[#F3E5AB] font-semibold mt-1">
              MUMBAI ATELIER
            </span>
          </div>
        </motion.div>

        {/* Single-Line Mobile Status Pill */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-black/40 border border-[#C5A059]/40 backdrop-blur-md shadow-md text-[10px] sm:text-xs font-mono text-[#F3E5AB] whitespace-nowrap shrink-0"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
          <span className="hidden sm:inline">Kitchen In Preparation</span>
          <span className="sm:hidden">Ovens Prepping</span>
        </motion.div>
      </header>

      {/* 3. Main Centerpiece & Headlines */}
      <main className="relative z-10 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-16 text-center flex flex-col items-center my-auto">
        
        {/* Floating Brand Emblem with Multi-Ring Gold Halo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1, y: [0, -5, 0] }}
          transition={{
            opacity: { duration: 0.6 },
            scale: { duration: 0.6 },
            y: { duration: 4.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' },
          }}
          className="relative mb-6 sm:mb-8"
        >
          <div className="absolute -inset-4 bg-radial from-[#C5A059]/25 via-transparent to-transparent rounded-full blur-xl pointer-events-none" />
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full p-1.5 bg-gradient-to-b from-[#F3E5AB] via-[#C5A059] to-[#0A2668] shadow-[0_15px_40px_rgba(0,0,0,0.6)] ring-4 ring-[#C5A059]/20">
            <img
              src={brandLogo}
              alt={`${brandTitle} Cookies Official Logo`}
              className="w-full h-full rounded-full object-cover shadow-inner"
            />
          </div>
        </motion.div>

        {/* Compact Proportioned Badge (No Edge-to-Edge Stretched Tube) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-[#061B42]/90 border border-[#C5A059]/60 backdrop-blur-md shadow-lg mb-5 max-w-[310px] sm:max-w-none mx-auto"
        >
          <Sparkles className="w-3 h-3 text-[#C5A059] shrink-0" />
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-[#F3E5AB] font-bold truncate">
            NYC GOURMET COOKIES • COMING SOON
          </span>
          <Sparkles className="w-3 h-3 text-[#C5A059] shrink-0" />
        </motion.div>

        {/* Grand Authentic Headline (Responsive Hierarchy) */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] max-w-3xl"
        >
          Something Extraordinary{' '}
          <span className="block font-serif italic font-light text-transparent bg-clip-text bg-gradient-to-r from-[#FFFDF5] via-[#F3E5AB] to-[#C5A059] mt-1 sm:mt-2 drop-shadow-md">
            is Baking in Mumbai.
          </span>
        </motion.h1>

        {/* Refined Subtitle (Structured & Legible) */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-white/85 text-xs sm:text-base md:text-lg font-light max-w-md sm:max-w-xl mx-auto mt-4 sm:mt-6 leading-relaxed"
        >
          Oversized 170g molten-centered cookies crafted with Belgian Callebaut couverture, French browned butter &amp; an uncompromising 100% pure eggless recipe. Baked fresh in limited daily drops.
        </motion.p>

        {/* 4 Brand Pillars (Handcrafted Luxury Tiles with Vector Icons) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 w-full max-w-3xl my-7 sm:my-10"
        >
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-3 sm:p-4 rounded-2xl bg-[#06183B]/80 border border-[#C5A059]/35 backdrop-blur-md text-center flex flex-col items-center justify-center shadow-lg transition-transform hover:-translate-y-0.5"
              >
                <div className="w-8 h-8 rounded-xl bg-[#C5A059]/15 border border-[#C5A059]/30 flex items-center justify-center text-[#F3E5AB] mb-1.5">
                  <Icon className="w-4 h-4 text-[#C5A059]" />
                </div>
                <strong className="text-xs sm:text-sm font-heading font-bold text-white block leading-tight">
                  {item.label}
                </strong>
                <span className="text-[9px] sm:text-[10px] text-[#F3E5AB]/80 font-mono mt-0.5">
                  {item.desc}
                </span>
              </div>
            );
          })}
        </motion.div>

        {/* VIP Waitlist Notification Card (Embossed Ticket Styling) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="w-full max-w-xl rounded-3xl p-5 sm:p-8 bg-gradient-to-br from-[#061F4D] via-[#092B6B] to-[#041536] border-2 border-[#C5A059]/75 shadow-[0_25px_60px_rgba(0,0,0,0.6)] relative overflow-hidden"
        >
          <div className="relative z-10 space-y-3.5 sm:space-y-4">
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-[#F3E5AB] font-bold block">
              ✦ BE THE FIRST TO TASTE ✦
            </span>

            <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-white leading-snug">
              Get Notified When Our First Drop Goes Live.
            </h2>

            <p className="text-white/80 text-xs sm:text-sm font-light leading-relaxed max-w-md mx-auto">
              Our batches are limited and sell out fast. Message us directly on WhatsApp to receive priority notification the moment pre-orders officially unlock.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3">
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                href={whatsappVipUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-gradient-to-r from-[#F3E5AB] via-[#C5A059] to-[#D4B86A] text-stone-950 font-bold text-xs uppercase tracking-widest shadow-xl hover:shadow-[#C5A059]/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-stone-950 text-stone-950" />
                <span>Notify Me on WhatsApp</span>
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                href="https://instagram.com/sukie.mumbai"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs font-semibold uppercase tracking-wider backdrop-blur-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current text-[#F3E5AB]" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                <span>Follow @sukie.mumbai</span>
              </motion.a>
            </div>

            <span className="block text-[10px] text-[#F3E5AB]/75 font-mono pt-1">
              Direct notification only. No marketing spam.
            </span>
          </div>
        </motion.div>

      </main>

      {/* 4. Infinite Luxury Brand Marquee */}
      <div className="w-full bg-[#051533] border-y border-[#C5A059]/35 py-2.5 sm:py-3 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-6 sm:gap-8 mx-3 sm:mx-4 text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-[#F3E5AB]">
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
      <footer className="relative z-20 border-t border-white/10 py-5 sm:py-6 px-4 text-center text-xs text-white/70">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3.5">
          <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] font-mono">
            <span>© 2026 Sukié NYC Cookies</span>
            <span>•</span>
            <span>100% Pure Eggless</span>
            <span>•</span>
            <span>Mumbai</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {onEnterPreview && (
              <button
                type="button"
                onClick={onEnterPreview}
                className="text-[10px] sm:text-[11px] font-mono text-[#F3E5AB] hover:text-white px-3.5 py-1.5 rounded-full border border-[#C5A059]/50 hover:border-white bg-[#061F4D]/70 backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
              >
                <span>✦</span>
                <span>Enter Atelier Menu Preview</span>
                <span className="text-[9px] opacity-75 hidden sm:inline">(Private Tasting)</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                if (onOpenAdmin) {
                  onOpenAdmin();
                } else {
                  window.location.hash = '#admin';
                }
              }}
              className="text-[10px] sm:text-[11px] font-mono text-white/50 hover:text-[#F3E5AB] px-3 py-1.5 rounded-full border border-white/10 hover:border-[#C5A059]/40 bg-black/20 backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer"
              title="Founder Atelier Access"
            >
              <span>🔒</span>
              <span>Founder Portal</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
