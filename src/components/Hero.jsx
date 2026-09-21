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
      className="relative min-h-[92vh] lg:min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#0A0D14] text-white pt-28 pb-16 px-4 sm:px-6 lg:px-8"
    >
      {/* Cinematic Background Food Image with Dark Vignette */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/triple_chocolate.jpg"
          alt="Sukié NYC Cookie Hero"
          className="w-full h-full object-cover object-center opacity-30 scale-105 filter blur-xs"
        />
        {/* Deep luxury radial gradient mask */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0D14] via-[#0A0D14]/85 to-[#0A0D14]/90" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D14] via-transparent to-[#0A0D14]/60" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#C5A059]/10 rounded-full blur-[180px] pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* Left Editorial Copy Column */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="lg:col-span-7 text-center lg:text-left space-y-6"
        >
          {/* Brand Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-[#C5A059]/30 backdrop-blur-md shadow-lg">
            <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-ping" />
            <span className="w-2 h-2 rounded-full bg-[#C5A059] -ml-3" />
            <span className="tracking-[0.25em] uppercase text-[#C5A059] font-medium text-xs">
              MUMBAI ATELIER • FRESH DAILY DROPS
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white leading-[0.95]">
            NYC Style
            <span className="block italic font-light text-gold-gradient font-serif mt-2">
              Giant Cookies.
            </span>
          </h1>

          {/* Editorial Subtitle */}
          <p className="text-white/80 max-w-xl text-base sm:text-lg lg:text-xl font-light leading-relaxed">
            Oversized 170g (6oz) molten-centered cookies crafted with Belgian Callebaut couverture, 
            French browned butter & 100% pure eggless recipe. Baked fresh daily in Vikhroli.
          </p>

          {/* CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <button
              onClick={() => scrollToSection('#menu')}
              className="w-full sm:w-auto bg-gradient-to-r from-[#C5A059] via-[#D4B86A] to-[#C5A059] text-black font-bold px-8 py-4 rounded-full text-xs uppercase tracking-widest shadow-[0_10px_35px_rgba(197,160,89,0.35)] hover:shadow-[0_15px_45px_rgba(197,160,89,0.5)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            >
              Order Today&apos;s Drop →
            </button>
            <button
              onClick={() => scrollToSection('#craftsmanship')}
              className="w-full sm:w-auto border border-white/30 hover:border-[#C5A059] text-white hover:text-[#C5A059] px-7 py-4 rounded-full text-xs uppercase tracking-widest backdrop-blur-xs transition-all duration-300 cursor-pointer"
            >
              The 170g Anatomy ✦
            </button>
          </div>

          {/* Three Key Pillars */}
          <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 max-w-lg text-center lg:text-left">
            <div>
              <span className="block font-heading text-2xl font-bold text-[#C5A059]">170g</span>
              <span className="text-[11px] text-white/50 uppercase tracking-wider font-mono">6oz Monster Scale</span>
            </div>
            <div>
              <span className="block font-heading text-2xl font-bold text-[#C5A059]">100%</span>
              <span className="text-[11px] text-white/50 uppercase tracking-wider font-mono">Pure Eggless</span>
            </div>
            <div>
              <span className="block font-heading text-2xl font-bold text-[#C5A059]">54.5%</span>
              <span className="text-[11px] text-white/50 uppercase tracking-wider font-mono">Callebaut Dark</span>
            </div>
          </div>
        </motion.div>

        {/* Right Realistic Hero Showcase Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="lg:col-span-5 flex justify-center"
        >
          <div className="relative w-full max-w-md group">
            
            {/* Ambient gold aura */}
            <div className="absolute -inset-2 bg-gradient-to-r from-[#C5A059]/30 to-[#1B3A8C]/40 rounded-3xl blur-2xl opacity-60 group-hover:opacity-90 transition-opacity duration-700 pointer-events-none" />

            {/* Framed Photography Display */}
            <div className="relative rounded-3xl overflow-hidden border border-[#C5A059]/30 bg-black/60 shadow-[0_25px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl">
              
              <div className="relative h-96 sm:h-[420px] w-full overflow-hidden">
                <img
                  src="/images/triple_chocolate.jpg"
                  alt="Triple Chocolate Overload Real Cookie"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                
                {/* Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                {/* Floating Info Pill on Image */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-black/70 backdrop-blur-md text-[#C5A059] text-[10px] font-bold px-3 py-1.5 rounded-full border border-[#C5A059]/40 uppercase tracking-wider">
                    Signature Cutaway
                  </span>
                </div>

                {/* Live molten ganache description */}
                <div className="absolute bottom-5 inset-x-5 text-white z-10">
                  <span className="text-[11px] uppercase tracking-[0.2em] font-mono text-amber-300 block">
                    Belgian Dark Ganache Volcanic Center
                  </span>
                  <h3 className="font-heading text-2xl font-bold mt-1">
                    Triple Chocolate Overload
                  </h3>
                  <p className="text-xs text-white/70 mt-1 font-light line-clamp-2">
                    Cracked warm at 160°C to release an avalanche of molten dark chocolate and flaky sea salt.
                  </p>
                </div>
              </div>

              {/* Bottom Quick Action Bar */}
              <div className="p-4 bg-[#0F1424] border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-white/40 uppercase font-mono block">Single 170g Unit</span>
                  <span className="text-xl font-heading font-bold text-[#C5A059]">₹299</span>
                </div>
                <button
                  onClick={() => scrollToSection('#menu')}
                  className="bg-[#1B3A8C] hover:bg-[#0F2460] text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Order This Cookie →
                </button>
              </div>

            </div>

            {/* Micro Badge */}
            <div className="absolute -bottom-3 -left-3 bg-[#0A0D14] border border-[#C5A059]/50 text-white px-3.5 py-1.5 rounded-full text-[10px] font-mono tracking-wider shadow-lg flex items-center gap-1.5">
              <span className="text-[#C5A059]">✦</span>
              <span>Baked Fresh Every Morning</span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
