import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';

export default function ComingSoon({ onEnterPreview }) {
  // Mouse position for interactive 3D card tilt & ambient spotlight
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for buttery tilt physics
  const springConfig = { damping: 25, stiffness: 180, mass: 0.5 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothMouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(smoothMouseX, [-300, 300], [-10, 10]);

  // Subtle cursor trail coordinates
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const cursorSmoothX = useSpring(cursorX, { damping: 20, stiffness: 220 });
  const cursorSmoothY = useSpring(cursorY, { damping: 20, stiffness: 220 });
  const [hasMouse, setHasMouse] = useState(false);

  // Live countdown to Drop 01
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 14, minutes: 28, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { ...prev, days: Math.max(0, prev.days - 1), hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleMouseMove = (e) => {
    if (!hasMouse) setHasMouse(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
    cursorX.set(e.clientX);
    cursorY.set(e.clientY);
  };

  const whatsappVipUrl =
    "https://wa.me/919136498467?text=Hello%20Suki%C3%A9!%20%F0%9F%8D%AA%20I%20want%20to%20claim%20my%20Batch%20%23001%20VIP%20Golden%20Ticket%20for%20the%20Mumbai%20Debut!";

  const pillars = [
    {
      num: "01",
      title: "170g Monster Scale",
      highlight: "Authentic NYC Giant Proportions",
      desc: "Massive 6-ounce cookies with crispy caramelized edges and a molten volcanic core.",
      icon: "⚖️"
    },
    {
      num: "02",
      title: "100% Pure Eggless",
      highlight: "Uncompromising Gourmet Purity",
      desc: "No compromises on texture. Slow-churned European butter and artisanal hydration craft.",
      icon: "🌿"
    },
    {
      num: "03",
      title: "54.5% Callebaut Couverture",
      highlight: "Belgian Dark Ganache Lava",
      desc: "Rich, velvety cocoa rivers and hand-ground hazelnut & pistachio gianduja fillings.",
      icon: "🍫"
    },
    {
      num: "04",
      title: "Royal Cobalt Packaging",
      highlight: "Individually Numbered & Gold Wax Sealed",
      desc: "Rigid keepsake boxes finished with gold foil lettering and heavy satin ribbon.",
      icon: "🎁"
    }
  ];

  return (
    <div
      onMouseMove={handleMouseMove}
      className="min-h-screen bg-gradient-to-b from-[#0A2668] via-[#0C419C] to-[#041233] text-white relative overflow-x-hidden selection:bg-[#C5A059] selection:text-stone-950 font-body"
    >
      {/* 1. Bespoke Fluid Luminous Cursor Ring (Desktop Mouse Only) */}
      {hasMouse && (
        <motion.div
          className="hidden lg:block pointer-events-none fixed top-0 left-0 w-8 h-8 -ml-4 -mt-4 rounded-full border border-[#F3E5AB]/80 bg-[#C5A059]/15 shadow-[0_0_20px_rgba(243,229,171,0.5)] z-50 backdrop-blur-[1px]"
          style={{
            x: cursorSmoothX,
            y: cursorSmoothY,
          }}
        />
      )}

      {/* 2. Atmospheric Royal Blue Silks & Golden Embers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Giant Radial Sukié Vividblue Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[800px] bg-radial from-[#1A5ED1]/40 via-[#0C419C]/20 to-transparent blur-[140px]" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-[#C5A059]/20 rounded-full blur-[130px]" />
        <div className="absolute bottom-10 -right-40 w-[600px] h-[600px] bg-[#0E3580]/50 rounded-full blur-[150px]" />
        
        {/* Subtle Luxury Guilloché Pattern */}
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#F3E5AB_1px,transparent_1px)] [background-size:32px_32px]" />
      </div>

      {/* 3. Top Navigation Bar */}
      <header className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-8 pt-6 sm:pt-8 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3.5 group cursor-pointer"
        >
          <div className="relative">
            <img
              src="/images/logo.png"
              alt="Sukié Logo"
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover ring-2 ring-[#C5A059] shadow-[0_0_25px_rgba(197,160,89,0.45)] group-hover:scale-105 transition-transform duration-300"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#C5A059] rounded-full border-2 border-[#0C419C] flex items-center justify-center text-[8px] text-stone-950 font-bold">
              ✦
            </span>
          </div>

          <div className="flex flex-col">
            <span className="font-heading text-2xl sm:text-4xl font-bold tracking-tight text-white drop-shadow-md">
              Sukié
            </span>
            <span className="text-[10px] sm:text-xs tracking-[0.28em] font-mono uppercase text-[#F3E5AB] font-semibold">
              MUMBAI ATELIER
            </span>
          </div>
        </motion.div>

        {/* Live Batch Telemetry Pill */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-white/10 border border-[#C5A059]/40 backdrop-blur-md shadow-lg"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34D399]" />
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-white font-medium">
            Ovens Calibrating • Batch #001
          </span>
        </motion.div>
      </header>

      {/* 4. Hero Section — Royal Vividblue & Gold Centerpiece */}
      <section className="relative z-10 max-w-6xl mx-auto w-full px-4 sm:px-6 pt-10 sm:pt-16 pb-12 sm:pb-20 text-center flex flex-col items-center">
        
        {/* Haute Pâtisserie Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2.5 px-4 sm:px-6 py-2 rounded-full bg-[#072461]/80 border border-[#C5A059]/60 backdrop-blur-md shadow-[0_4px_25px_rgba(12,65,156,0.6)] mb-6 sm:mb-8"
        >
          <span className="text-[#C5A059] text-xs">✦</span>
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-[#F3E5AB] font-bold">
            THE NYC GIANT COOKIE COMES TO MUMBAI
          </span>
          <span className="text-[#C5A059] text-xs">✦</span>
        </motion.div>

        {/* Grand Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[1.05] max-w-5xl"
        >
          Baked in Royal Blue.
          <span className="block font-serif italic font-light text-transparent bg-clip-text bg-gradient-to-r from-[#FDF6E2] via-[#F3E5AB] to-[#C5A059] mt-2 drop-shadow-lg">
            Volcanic Molten Perfection.
          </span>
        </motion.h1>

        {/* Editorial Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-white/90 text-sm sm:text-lg md:text-xl font-light max-w-2xl mx-auto mt-6 leading-relaxed"
        >
          New York City&apos;s iconic 170g giant cookies, reimagined for Mumbai with Belgian Callebaut couverture, French browned butter &amp; 100% pure eggless recipe.
        </motion.p>

        {/* 5. The Crown Jewel: 3D Interactive Royal Cobalt Keepsake Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="my-10 sm:my-16 relative w-full max-w-2xl group cursor-pointer"
          style={{ perspective: 1200 }}
        >
          {/* Ambient Glowing Halo */}
          <div className="absolute -inset-4 sm:-inset-8 bg-gradient-to-r from-[#195CD3]/60 via-[#C5A059]/40 to-[#195CD3]/60 rounded-3xl blur-3xl opacity-75 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          {/* 3D Tilted Luxury Box Card */}
          <motion.div
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
            }}
            whileHover={{ scale: 1.02 }}
            className="relative rounded-3xl sm:rounded-4xl overflow-hidden border-2 border-[#C5A059]/70 shadow-[0_30px_90px_rgba(4,18,51,0.95)] bg-[#071F52]"
          >
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden">
              <img
                src="/images/sukie_royal_box.jpg"
                alt="Sukié Royal Cobalt Blue Keepsake Box"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Luminous Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#051336] via-transparent to-black/20 pointer-events-none" />

              {/* Floating Wax Seal Callout */}
              <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#082156]/90 backdrop-blur-md border border-[#C5A059]/80 text-[#F3E5AB] text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-ping" />
                  First Drop Allocation • Mumbai Debut
                </span>
              </div>

              {/* Bottom Caption Overlay */}
              <div className="absolute bottom-4 inset-x-4 sm:bottom-6 sm:inset-x-6 z-10 flex items-end justify-between">
                <div className="text-left">
                  <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-[#F3E5AB] block drop-shadow">
                    THE SUKIÉ KEEPSAKE BOX
                  </span>
                  <h3 className="font-heading text-lg sm:text-2xl font-bold text-white mt-0.5 drop-shadow-md">
                    Signature Royal Cobalt &amp; Gold Satin
                  </h3>
                </div>

                <div className="text-right">
                  <span className="text-xs sm:text-sm font-bold font-mono text-[#F3E5AB] bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                    100 Boxes Only
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* 6. Live Drop Countdown Timer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mb-10 sm:mb-14"
        >
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-[#F3E5AB] block mb-3 font-semibold">
            ✦ FIRST PUBLIC BAKE UNLOCKS IN ✦
          </span>

          <div className="flex items-center justify-center gap-2.5 sm:gap-4 font-heading">
            {[
              { label: 'DAYS', val: timeLeft.days },
              { label: 'HOURS', val: timeLeft.hours },
              { label: 'MINUTES', val: timeLeft.minutes },
              { label: 'SECONDS', val: timeLeft.seconds }
            ].map((unit, i) => (
              <div
                key={unit.label}
                className="flex flex-col items-center justify-center w-16 sm:w-22 h-18 sm:h-24 rounded-2xl bg-[#072461]/80 border border-[#C5A059]/50 shadow-lg backdrop-blur-md"
              >
                <span className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
                  {String(unit.val).padStart(2, '0')}
                </span>
                <span className="text-[8px] sm:text-[10px] font-mono uppercase tracking-widest text-[#F3E5AB]/80 mt-0.5">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 7. Holographic VIP Golden Ticket & Reservation Card */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="w-full max-w-2xl rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-[#082259] via-[#0C419C] to-[#04173D] border-2 border-[#C5A059] shadow-[0_20px_60px_rgba(0,0,0,0.6)] relative overflow-hidden"
        >
          {/* Gilded Shimmer Glare */}
          <div className="absolute -top-16 -right-16 w-56 h-56 bg-gradient-to-br from-[#F3E5AB]/30 to-transparent rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-5 text-center">
            
            {/* VIP Pass Header */}
            <div className="flex items-center justify-center gap-2">
              <span className="text-[#F3E5AB] text-sm">★</span>
              <span className="text-xs sm:text-sm font-mono uppercase tracking-[0.25em] text-[#F3E5AB] font-bold">
                BATCH #001 VIP GOLDEN TICKET
              </span>
              <span className="text-[#F3E5AB] text-sm">★</span>
            </div>

            <h2 className="font-heading text-2xl sm:text-4xl font-bold text-white leading-tight">
              Claim Priority Allocation for Mumbai&apos;s Inaugural Drop.
            </h2>

            <p className="text-white/85 text-xs sm:text-base font-light leading-relaxed max-w-lg mx-auto">
              Drop #001 is strictly restricted to 100 royal cobalt keepsake boxes, hand-numbered and wax-sealed. Reserve your priority box directly with the Chef on WhatsApp.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <motion.a
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                href={whatsappVipUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#F3E5AB] via-[#C5A059] to-[#D4B86A] text-stone-950 font-bold text-xs uppercase tracking-widest shadow-[0_10px_30px_rgba(197,160,89,0.5)] hover:shadow-[0_15px_40px_rgba(197,160,89,0.7)] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <span>Claim VIP Golden Ticket on WhatsApp</span>
                <span className="text-base">💬</span>
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                href="https://instagram.com/sukie.mumbai"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-4 rounded-full bg-white/10 hover:bg-white/15 text-white border border-[#C5A059]/60 text-xs font-semibold uppercase tracking-wider backdrop-blur-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Follow @sukie.mumbai</span>
                <span>📸</span>
              </motion.a>
            </div>

            <div className="flex items-center justify-center gap-4 text-[10px] text-[#F3E5AB]/80 font-mono pt-1">
              <span>✦ Zero Spam Guarantee</span>
              <span>•</span>
              <span>1-on-1 Founder Notification</span>
            </div>
          </div>
        </motion.div>

        {/* 8. The 4 Culinary Standards in Royal Blue & Gold */}
        <div className="mt-16 sm:mt-24 w-full">
          <div className="text-center mb-8 sm:mb-12">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#F3E5AB] block mb-1">
              ✦ ARTISAN STANDARDS ✦
            </span>
            <h3 className="font-heading text-2xl sm:text-4xl font-bold text-white">
              Why Sukié is Unlike Anything in Mumbai
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            {pillars.map((p, idx) => (
              <motion.div
                key={p.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#082257]/70 border border-[#C5A059]/40 hover:border-[#C5A059] shadow-xl backdrop-blur-md flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl p-2 rounded-xl bg-white/10 border border-[#C5A059]/30">
                      {p.icon}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#F3E5AB]">
                      {p.num}
                    </span>
                  </div>

                  <h4 className="font-heading text-base sm:text-lg font-bold text-white mb-1">
                    {p.title}
                  </h4>
                  <span className="text-[11px] font-mono text-[#F3E5AB] block mb-2 font-medium">
                    {p.highlight}
                  </span>
                  <p className="text-white/70 text-xs leading-relaxed font-light">
                    {p.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </section>

      {/* 9. Continuous Luxury Brand Marquee Ticker */}
      <div className="w-full bg-[#05173B] border-y border-[#C5A059]/40 py-3 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-8 mx-4 text-xs font-mono uppercase tracking-[0.25em] text-[#F3E5AB]">
              <span>✦ 170G NYC MONSTER SCALE</span>
              <span>•</span>
              <span>100% PURE EGGLESS</span>
              <span>•</span>
              <span>BELGIAN CALLEBAUT GANACHE</span>
              <span>•</span>
              <span>FRENCH BEURRE NOISETTE</span>
              <span>•</span>
              <span>SOUTH MUMBAI ATELIER</span>
              <span>•</span>
              <span>ROYAL COBALT PACKAGING</span>
            </div>
          ))}
        </div>
      </div>

      {/* 10. Luxury Footer & Discreet Atelier Menu Preview */}
      <footer className="relative z-20 border-t border-white/10 py-8 px-4 text-center text-xs text-white/70">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span>© 2026 Sukié NYC Cookies</span>
            <span>•</span>
            <span className="text-[#F3E5AB]">Vividblue Signature Atelier</span>
            <span>•</span>
            <span>Mumbai</span>
          </div>

          {/* Discreet Atelier Menu Preview Toggle */}
          {onEnterPreview && (
            <button
              type="button"
              onClick={onEnterPreview}
              className="text-[11px] font-mono text-[#F3E5AB] hover:text-white px-4 py-2 rounded-full border border-[#C5A059]/60 hover:border-white bg-[#061F4D]/80 backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer shadow-md hover:scale-102 active:scale-95"
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
