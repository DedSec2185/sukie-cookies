import { motion } from 'framer-motion';

export default function PackagingExperience() {
  const steps = [
    {
      step: "01",
      title: "The Cobalt Keepsake Box",
      desc: "Rigid, heavy-board packaging clad in our signature deep royal blue with hot-stamped gold foil Sukié lettering. Designed as a luxury keepsake, not ordinary delivery cardboard.",
      icon: "🎁",
      tag: "Rigid Box"
    },
    {
      step: "02",
      title: "Individual Botanical Parchment",
      desc: "Each 170g giant cookie is nestled in grease-resistant, food-grade botanical parchment, locking in browned-butter aroma and keeping crisp crusts separated.",
      icon: "📜",
      tag: "Freshness Sealed"
    },
    {
      step: "03",
      title: "The Golden Reheat Protocol",
      desc: "Every box includes an embossed warming guide. 2 minutes at 160°C revives the freshly baked aroma and returns the Callebaut ganache core to molten lava flow.",
      icon: "🔥",
      tag: "Chef's Card"
    }
  ];

  return (
    <section className="relative bg-[#070B14] text-white py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden border-t border-[#C5A059]/15">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 -left-32 -translate-y-1/2 w-96 h-96 bg-[#1B3A8C]/25 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#C5A059]/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="section-label text-[#C5A059] mb-3">
            Bespoke Gifting & Presentation
          </span>
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mt-2">
            The <span className="text-gold-gradient font-serif italic">Unboxing Ritual</span>
          </h2>
          <p className="text-white/70 text-base sm:text-lg font-light leading-relaxed mt-4">
            Luxury lives in the details. From our heavyweight gold-embossed boxes to our temperature-preserving parchment, unboxing Sukié is designed to be an unforgettable sensory experience.
          </p>
        </div>

        {/* Packaging Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          
          {/* Real Packaging Photography Showcase */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 flex justify-center"
          >
            <div className="relative w-full max-w-lg rounded-3xl overflow-hidden border border-[#C5A059]/30 shadow-[0_30px_90px_rgba(0,0,0,0.85)] group">
              
              <div className="relative h-[420px] w-full overflow-hidden bg-stone-900">
                <img
                  src="/images/packaging_box.jpg"
                  alt="Sukié Bespoke Luxury Cookie Box"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                {/* Overlaid Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-black/70 backdrop-blur-md text-[#C5A059] text-[10px] font-bold px-3 py-1.5 rounded-full border border-[#C5A059]/40 uppercase tracking-widest">
                    Hot-Stamped Gold Foil
                  </span>
                </div>

                {/* Bottom Box Description */}
                <div className="absolute bottom-5 inset-x-5 text-white z-10">
                  <span className="text-xs uppercase font-mono tracking-widest text-[#C5A059] block">
                    Printed Domain: sukiecookies.com
                  </span>
                  <h3 className="font-heading text-2xl font-bold mt-1">
                    The Royal Blue Keepsake Box
                  </h3>
                  <p className="text-xs text-white/70 mt-1 font-light">
                    Individually parchment-wrapped 170g cookies with silk ribbon, tasting guide, and personal calligraphy note.
                  </p>
                </div>
              </div>

              {/* Bottom Bar */}
              <div className="p-4 bg-[#0A0F1D] border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-[#C5A059] font-mono">✦ Designed for Diwali, Weddings & VIP Gifts</span>
                <span className="text-white/40">4 or 6 Pack</span>
              </div>
            </div>
          </motion.div>

          {/* 3 Step Details */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 space-y-6"
          >
            {steps.map((item) => (
              <div
                key={item.step}
                className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#C5A059]/40 hover:bg-white/[0.05] transition-all duration-300 group"
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl p-3 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/20 shrink-0">
                    {item.icon}
                  </span>
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-[#C5A059] uppercase tracking-wider">
                        Phase {item.step}
                      </span>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/10 text-white/70 uppercase tracking-widest">
                        {item.tag}
                      </span>
                    </div>
                    <h3 className="font-heading text-xl font-bold text-white group-hover:text-amber-200 transition-colors mt-1.5">
                      {item.title}
                    </h3>
                    <p className="text-white/60 text-sm leading-relaxed mt-2 font-light">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

        </div>

        {/* Corporate Gifting Callout Bar */}
        <div className="rounded-3xl bg-gradient-to-r from-[#0D1B3E] via-[#0F2250] to-[#0A1633] border border-[#C5A059]/35 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#C5A059] font-mono">
              Bespoke Corporate Commissions & Weddings
            </span>
            <h4 className="font-heading text-2xl sm:text-3xl font-bold text-white">
              Planning Bulk Luxury Gifting for Your Brand or Event?
            </h4>
            <p className="text-white/70 text-sm max-w-2xl font-light">
              We offer custom gold-foil sleeve embossing, personalized luxury calligraphy inserts, and coordinated dispatch across Mumbai for bulk orders of 15+ boxes.
            </p>
          </div>

          <a
            href="https://wa.me/919136498467?text=Hi%20Suki%C3%A9%20Team,%20I%20would%20like%20to%20enquire%20about%20custom%20luxury%20packaging%20and%20bulk%20cookie%20boxes."
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 bg-[#C5A059] hover:bg-[#D4B86A] text-black font-bold px-8 py-4 rounded-full text-xs uppercase tracking-widest transition-all duration-300 shadow-xl hover:scale-105 active:scale-95"
          >
            Enquire on WhatsApp →
          </a>
        </div>

      </div>
    </section>
  );
}
