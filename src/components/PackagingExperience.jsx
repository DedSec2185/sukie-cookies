import { motion } from 'framer-motion';

export default function PackagingExperience() {
  const steps = [
    {
      step: "01",
      title: "Cobalt Keepsake Box",
      desc: "Heavy-board rigid packaging clad in royal blue with hot-stamped gold foil Sukié lettering. Designed as a luxury keepsake.",
      icon: "🎁",
      tag: "Rigid Box"
    },
    {
      step: "02",
      title: "Botanical Parchment",
      desc: "Each 170g cookie is individually wrapped in food-grade botanical parchment, locking in aroma and keeping crusts crisp.",
      icon: "📜",
      tag: "Fresh Sealed"
    },
    {
      step: "03",
      title: "Golden Reheat Protocol",
      desc: "Includes an embossed warming guide. 2 minutes at 160°C returns the Belgian Callebaut ganache core to molten lava perfection.",
      icon: "🔥",
      tag: "Chef's Card"
    }
  ];

  return (
    <section className="relative bg-[#070B14] text-white py-12 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden border-t border-[#C5A059]/15">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 -left-32 -translate-y-1/2 w-64 sm:w-96 h-64 sm:h-96 bg-[#1B3A8C]/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 sm:w-[400px] h-64 sm:h-[400px] bg-[#C5A059]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
          <span className="section-label text-[#C5A059] text-[10px] sm:text-xs mb-2">
            Bespoke Gifting & Presentation
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight text-white mt-1">
            The <span className="text-gold-gradient font-serif italic">Unboxing Ritual</span>
          </h2>
          <p className="text-white/70 text-xs sm:text-base font-light leading-relaxed mt-2.5">
            Luxury lives in the details. From our gold-embossed boxes to temperature-preserving parchment, unboxing Sukié is a sensory experience.
          </p>
        </div>

        {/* Packaging Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-center mb-12 sm:mb-16">
          
          {/* Authentic Sukié Keepsake Box Presentation */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-lg rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-[#C5A059]/60 shadow-[0_20px_50px_rgba(12,65,156,0.35)] bg-gradient-to-br from-[#0B2558] via-[#0C419C] to-[#06183B] p-6 sm:p-8">
              
              {/* Box Lid & Gold Foil Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#C5A059]/30">
                <div className="flex items-center gap-3">
                  <img
                    src="/images/logo.png"
                    alt="Sukié Logo"
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-[#C5A059]"
                  />
                  <div>
                    <span className="font-heading text-lg font-bold text-white tracking-wide block">
                      Sukié Royal Keepsake Box
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#F3E5AB]">
                      Hot-Stamped Gold Foil • Mumbai
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono text-[#F3E5AB] bg-[#C5A059]/20 px-2.5 py-1 rounded-full border border-[#C5A059]/40">
                  Signature 4-Pack
                </span>
              </div>

              {/* 4 Authentic Cookies Nested in Parchment & Gold */}
              <div className="grid grid-cols-2 gap-3.5 my-5">
                {[
                  { name: 'Triple Chocolate Overload', img: '/images/triple_chocolate.jpg' },
                  { name: 'Gooey Two-Chip', img: '/images/two_chip.jpg' },
                  { name: 'Pistachio Gianduja', img: '/images/pistachio.jpg' },
                  { name: "Cupid's Ruby Chocolate", img: '/images/ruby_chocolate.jpg' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="relative rounded-2xl overflow-hidden border border-[#C5A059]/40 bg-[#06183B] shadow-md group"
                  >
                    <div className="h-28 sm:h-32 w-full overflow-hidden">
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-2 left-2 right-2 text-white">
                      <span className="text-[9px] font-mono text-[#F3E5AB] block font-semibold">
                        170g • Batch #{idx + 1}
                      </span>
                      <p className="text-[11px] font-heading font-bold truncate">
                        {item.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Box Footer Specs */}
              <div className="pt-3 border-t border-[#C5A059]/25 flex items-center justify-between text-[11px] text-white/80">
                <span className="text-[#F3E5AB] font-mono flex items-center gap-1.5">
                  <span>✦</span>
                  <span>Hand-tied Gold Satin Ribbon Included</span>
                </span>
                <span className="font-mono text-[#F3E5AB]/90 font-bold">100% Eggless</span>
              </div>
            </div>
          </div>

          {/* 3 Step Details - Compact Cards with Viewport Animations */}
          <div className="lg:col-span-6 space-y-3 sm:space-y-4">
            {steps.map((item, idx) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.1 }}
                whileHover={{ x: 4, transition: { duration: 0.2 } }}
                className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#C5A059]/40 transition-colors"
              >
                <div className="flex items-start gap-3.5">
                  <span className="text-2xl p-2.5 rounded-lg bg-[#C5A059]/10 border border-[#C5A059]/20 shrink-0">
                    {item.icon}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-[#C5A059] uppercase tracking-wider">
                        Phase {item.step}
                      </span>
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-white/70 uppercase">
                        {item.tag}
                      </span>
                    </div>
                    <h3 className="font-heading text-base sm:text-lg font-bold text-white mt-1">
                      {item.title}
                    </h3>
                    <p className="text-white/60 text-xs sm:text-sm leading-relaxed mt-1 font-light">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>

        {/* Corporate Gifting Callout Bar */}
        <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#0D1B3E] via-[#0F2250] to-[#0A1633] border border-[#C5A059]/35 p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl text-center md:text-left">
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#C5A059] font-mono">
              Bespoke Commissions & Weddings
            </span>
            <h4 className="font-heading text-xl sm:text-2xl font-bold text-white">
              Planning Bulk Luxury Gifting for Your Brand or Event?
            </h4>
            <p className="text-white/70 text-xs sm:text-sm max-w-xl font-light">
              We offer custom gold-foil sleeve embossing, personalized calligraphy inserts, and coordinated dispatch across Mumbai for bulk orders of 15+ boxes.
            </p>
          </div>

          <a
            href="https://wa.me/919136498467?text=Hi%20Suki%C3%A9%20Team,%20I%20would%20like%20to%20enquire%20about%20custom%20luxury%20packaging%20and%20bulk%20cookie%20boxes."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto shrink-0 bg-[#C5A059] hover:bg-[#D4B86A] text-black font-bold px-7 py-3.5 rounded-full text-xs uppercase tracking-widest transition-all shadow-md active:scale-95 text-center"
          >
            Enquire on WhatsApp →
          </a>
        </div>

      </div>
    </section>
  );
}
