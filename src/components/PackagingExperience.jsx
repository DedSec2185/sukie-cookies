import { motion } from 'framer-motion';
import { Package, Sparkles, Flame, Award } from 'lucide-react';

export default function PackagingExperience() {
  const steps = [
    {
      step: "01",
      title: "Cobalt Keepsake Box",
      desc: "Heavy-board rigid packaging clad in royal blue with hot-stamped gold foil Sukié lettering. Designed as a luxury keepsake.",
      icon: Package,
      tag: "Rigid Box"
    },
    {
      step: "02",
      title: "Botanical Parchment",
      desc: "Each 170g cookie is individually wrapped in food-grade botanical parchment, locking in aroma and keeping crusts crisp.",
      icon: Sparkles,
      tag: "Fresh Sealed"
    },
    {
      step: "03",
      title: "Golden Reheat Protocol",
      desc: "Includes an embossed warming guide. 2 minutes at 160°C returns the Belgian Callebaut ganache core to molten lava perfection.",
      icon: Flame,
      tag: "Chef's Card"
    }
  ];

  return (
    <section id="packaging" className="relative bg-[#070B14] text-white scroll-mt-24 pt-16 sm:pt-24 pb-28 sm:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden border-t border-[#C5A059]/20">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 -left-32 -translate-y-1/2 w-64 sm:w-96 h-64 sm:h-96 bg-[#1B3A8C]/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 sm:w-[400px] h-64 sm:h-[400px] bg-[#C5A059]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-14">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-[#C5A059]/40 text-[#F3E5AB] font-mono text-[10px] sm:text-xs uppercase tracking-widest mb-2.5">
            <Sparkles className="w-3 h-3 text-[#C5A059]" />
            <span>Bespoke Gifting &amp; Presentation</span>
          </span>
          <h2 className="font-heading text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mt-1">
            The <span className="font-serif italic font-light text-transparent bg-clip-text bg-gradient-to-r from-[#FFFDF5] via-[#F3E5AB] to-[#C5A059]">Unboxing Ritual</span>
          </h2>
          <p className="text-white/70 text-xs sm:text-base font-light leading-relaxed mt-2.5 max-w-lg mx-auto">
            Luxury lives in the details. From our gold-embossed boxes to temperature-preserving parchment, unboxing Sukié is a sensory experience.
          </p>
        </div>

        {/* Packaging Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-center mb-10 sm:mb-16">
          
          {/* Authentic Sukié Keepsake Box Presentation */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-lg rounded-3xl overflow-hidden border-2 border-[#C5A059]/60 shadow-[0_25px_60px_rgba(12,65,156,0.35)] bg-gradient-to-br from-[#0B2558] via-[#0C419C] to-[#06183B] p-4 sm:p-7">
              
              {/* Box Lid & Gold Foil Header (Mobile Responsive) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3.5 border-b border-[#C5A059]/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-b from-[#F3E5AB] to-[#C5A059] shadow-md shrink-0">
                    <img
                      src="/images/logo.png"
                      alt="Sukié Logo"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="font-heading text-base sm:text-lg font-bold text-white tracking-wide block leading-tight">
                      Sukié Royal Keepsake Box
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.18em] text-[#F3E5AB]">
                      Hot-Stamped Gold Foil • Mumbai
                    </span>
                  </div>
                </div>
                <span className="self-start sm:self-auto text-[10px] sm:text-xs font-mono font-bold text-[#F3E5AB] bg-[#C5A059]/25 px-3 py-1 rounded-full border border-[#C5A059]/50 shadow-xs whitespace-nowrap">
                  Signature 4-Pack
                </span>
              </div>

              {/* 4 Authentic Cookies Nested in Parchment & Gold (No Truncation with ...) */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 my-3.5 sm:my-5">
                {[
                  { name: 'Triple Chocolate Overload', img: '/images/triple_chocolate.jpg', batch: 'Batch #1' },
                  { name: 'Gooey Two-Chip', img: '/images/two_chip.jpg', batch: 'Batch #2' },
                  { name: 'Pistachio Gianduja', img: '/images/pistachio.jpg', batch: 'Batch #3' },
                  { name: "Cupid's Ruby Chocolate", img: '/images/ruby_chocolate.jpg', batch: 'Batch #4' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="relative rounded-2xl overflow-hidden border border-[#C5A059]/40 bg-[#06183B] shadow-md group"
                  >
                    <div className="h-24 sm:h-32 w-full overflow-hidden">
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent pointer-events-none" />
                    <div className="absolute bottom-2 left-2 right-2 text-white">
                      <span className="text-[8px] sm:text-[9px] font-mono text-[#F3E5AB] block font-semibold uppercase tracking-wider">
                        170g • {item.batch}
                      </span>
                      <p className="text-[10px] sm:text-[11px] font-heading font-bold leading-tight line-clamp-2 mt-0.5">
                        {item.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Box Footer Specs (Structured Pill Strip) */}
              <div className="pt-3 border-t border-[#C5A059]/25 flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-[11px] text-white/80">
                <span className="text-[#F3E5AB] font-mono flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#C5A059]" />
                  <span>Hand-tied Gold Satin Ribbon Included</span>
                </span>
                <span className="font-mono text-emerald-300 font-bold bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-500/30">
                  100% Pure Eggless
                </span>
              </div>
            </div>
          </div>

          {/* 3 Step Details - Compact Luxury Cards with Individual Vector Icons */}
          <div className="lg:col-span-6 space-y-3 sm:space-y-4">
            {steps.map((item, idx) => {
              const StepIcon = item.icon;
              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: idx * 0.1 }}
                  whileHover={{ x: 4, transition: { duration: 0.2 } }}
                  className="p-4 sm:p-5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-[#C5A059]/40 transition-colors shadow-md"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 rounded-xl bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#F3E5AB] shrink-0">
                      <StepIcon className="w-5 h-5 text-[#C5A059]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-[#C5A059] uppercase tracking-wider">
                          Phase {item.step}
                        </span>
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-white/70 uppercase font-mono">
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
              );
            })}
          </div>

        </div>

        {/* Corporate Gifting Callout Bar */}
        <div className="rounded-3xl bg-gradient-to-r from-[#0D1B3E] via-[#0F2250] to-[#0A1633] border border-[#C5A059]/40 p-5 sm:p-9 flex flex-col md:flex-row items-center justify-between gap-5 shadow-2xl text-center md:text-left">
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#C5A059] font-mono block">
              Bespoke Commissions &amp; Weddings
            </span>
            <h4 className="font-heading text-lg sm:text-2xl font-bold text-white leading-tight">
              Planning Bulk Luxury Gifting for Your Brand or Event?
            </h4>
            <p className="text-white/70 text-xs sm:text-sm max-w-xl font-light leading-relaxed">
              We offer custom gold-foil sleeve embossing, personalized calligraphy inserts, and coordinated dispatch across Mumbai for bulk orders of 15+ boxes.
            </p>
          </div>

          <a
            href="https://wa.me/919136498467?text=Hi%20Suki%C3%A9%20Team,%20I%20would%20like%20to%20enquire%20about%20custom%20luxury%20packaging%20and%20bulk%20cookie%20boxes."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto shrink-0 bg-[#C5A059] hover:bg-[#D4B86A] text-stone-950 font-bold px-7 py-3.5 rounded-full text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95 text-center"
          >
            Enquire on WhatsApp →
          </a>
        </div>

      </div>
    </section>
  );
}
