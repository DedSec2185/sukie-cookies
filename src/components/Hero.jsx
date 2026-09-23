import { motion } from 'framer-motion';

export default function Hero() {
  const scrollToSection = (targetId) => {
    const el = document.querySelector(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.hash = targetId;
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-[85vh] lg:min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#0A0D14] text-white pt-24 sm:pt-28 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8"
    >
      {/* Background Food Image with Dark Vignette */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/images/triple_chocolate.jpg"
          alt="Sukié NYC Cookie Hero"
          className="w-full h-full object-cover object-center opacity-25 scale-105 filter blur-xs"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0D14] via-[#0A0D14]/90 to-[#0A0D14]/95" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D14] via-transparent to-[#0A0D14]/70" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-[600px] h-80 sm:h-[600px] bg-[#C5A059]/10 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
        
        {/* Left Editorial Copy Column */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7 text-center lg:text-left space-y-4 sm:space-y-6"
        >
          {/* Brand Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-[#C5A059]/30 backdrop-blur-md shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-ping" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] -ml-2.5" />
            <span className="tracking-[0.2em] uppercase text-[#C5A059] font-medium text-[10px] sm:text-xs">
              MUMBAI ATELIER • FRESH DAILY DROPS
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white leading-[1.02]">
            NYC Style
            <span className="block italic font-light text-gold-gradient font-serif mt-1">
              Giant Cookies.
            </span>
          </h1>

          {/* Editorial Subtitle */}
          <p className="text-white/80 max-w-lg mx-auto lg:mx-0 text-xs sm:text-base lg:text-lg font-light leading-relaxed">
            170g (6oz) molten-centered giant cookies crafted with Belgian Callebaut couverture, 
            French browned butter & 100% pure eggless recipe. Baked fresh in Mumbai.
          </p>

          {/* CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection('#menu')}
              className="w-full sm:w-auto bg-gradient-to-r from-[#C5A059] via-[#D4B86A] to-[#C5A059] text-black font-bold px-7 py-3.5 rounded-full text-xs uppercase tracking-widest shadow-lg cursor-pointer"
            >
              Order Today&apos;s Drop →
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection('#craftsmanship')}
              className="w-full sm:w-auto border border-white/20 hover:border-[#C5A059] text-white hover:text-[#C5A059] px-6 py-3.5 rounded-full text-xs uppercase tracking-widest backdrop-blur-xs transition-colors cursor-pointer"
            >
              The 170g Anatomy ✦
            </motion.button>
          </div>

          {/* Key Pillars Row */}
          <div className="pt-4 border-t border-white/10 grid grid-cols-3 gap-2 sm:gap-4 max-w-md mx-auto lg:mx-0 text-center lg:text-left">
            <div>
              <span className="block font-heading text-lg sm:text-2xl font-bold text-[#C5A059]">170g</span>
              <span className="text-[10px] text-white/50 uppercase font-mono">6oz Monster Scale</span>
            </div>
            <div>
              <span className="block font-heading text-lg sm:text-2xl font-bold text-[#C5A059]">100%</span>
              <span className="text-[10px] text-white/50 uppercase font-mono">Pure Eggless</span>
            </div>
            <div>
              <span className="block font-heading text-lg sm:text-2xl font-bold text-[#C5A059]">54.5%</span>
              <span className="text-[10px] text-white/50 uppercase font-mono">Callebaut Dark</span>
            </div>
          </div>
        </motion.div>

        {/* Right Hero Showcase Photo Card - Sized Compactly for Mobile with Gentle Floating Motion */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
          transition={{
            opacity: { duration: 0.7, delay: 0.15 },
            scale: { duration: 0.7, delay: 0.15 },
            y: { duration: 5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' },
          }}
          className="lg:col-span-5 flex justify-center"
        >
          <div className="relative w-full max-w-sm sm:max-w-md group">
            
            {/* Ambient gold aura */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#C5A059]/20 to-[#1B3A8C]/30 rounded-2xl sm:rounded-3xl blur-xl opacity-60 pointer-events-none" />

            {/* Framed Photography Display */}
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-[#C5A059]/30 bg-black/60 shadow-xl backdrop-blur-xl">
              
              <div 
                className="relative h-60 sm:h-80 lg:h-[380px] w-full overflow-hidden cookie-card-visual"
                data-cursor="cookie"
              >
                <img
                  src="/images/triple_chocolate.jpg"
                  alt="Triple Chocolate Overload Real Cookie"
                  className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
                />
                
                {/* Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                {/* Info Pill */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="bg-black/70 backdrop-blur-md text-[#C5A059] text-[9px] sm:text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#C5A059]/40 uppercase tracking-wider">
                    Signature Cutaway
                  </span>
                </div>

                {/* Description */}
                <div className="absolute bottom-3.5 inset-x-3.5 text-white z-10">
                  <span className="text-[10px] uppercase tracking-wider font-mono text-amber-300 block">
                    Belgian Dark Ganache Molten Center
                  </span>
                  <h3 className="font-heading text-lg sm:text-2xl font-bold mt-0.5">
                    Triple Chocolate Overload
                  </h3>
                  <p className="text-[11px] sm:text-xs text-white/70 mt-0.5 font-light line-clamp-1 sm:line-clamp-2">
                    Cracked warm at 160°C to release an avalanche of molten dark chocolate and flaky sea salt.
                  </p>
                </div>
              </div>

              {/* Bottom Bar */}
              <div className="p-3 sm:p-4 bg-[#0F1424] border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-white/40 uppercase font-mono block">Single 170g Unit</span>
                  <span className="text-lg sm:text-xl font-heading font-bold text-[#C5A059]">₹299</span>
                </div>
                <button
                  onClick={() => scrollToSection('#menu')}
                  className="bg-[#1B3A8C] hover:bg-[#0F2460] text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Order This Cookie →
                </button>
              </div>

            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
