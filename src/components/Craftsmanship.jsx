import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Craftsmanship() {
  const [activeLayer, setActiveLayer] = useState(2);

  const layers = [
    {
      id: 0,
      shortTitle: "Crust",
      title: "Caramelized Crust",
      subtitle: "Crisp Browned-Butter Shell",
      desc: "Flash-baked at 420°F convection heat to create a shatteringly thin caramelized crust that seals in steam and moisture.",
      stat: "420°F",
      statLabel: "Flash Bake",
      pinPosition: { top: '32%', left: '20%' }
    },
    {
      id: 1,
      shortTitle: "24h Crumb",
      title: "24h Cold-Aged Crumb",
      subtitle: "Slow-Fermented Dough",
      desc: "Resting dough for 24 hours allows French cultured butter to fully hydrate flour, developing deep toffee and vanilla notes.",
      stat: "24h",
      statLabel: "Cold Fermented",
      pinPosition: { top: '48%', left: '26%' }
    },
    {
      id: 2,
      shortTitle: "Molten Core",
      title: "Molten Volcanic Core",
      subtitle: "Pure Belgian Ganache Lava",
      desc: "The hallmark of an authentic Sukié 170g creation. Break it warm to release an irresistible river of molten Callebaut chocolate.",
      stat: "54.5%",
      statLabel: "Callebaut Cocoa",
      pinPosition: { top: '55%', left: '50%' }
    },
    {
      id: 3,
      shortTitle: "Sea Salt",
      title: "Artisan Finishing Touch",
      subtitle: "Fleur de Sel & Roasted Crunch",
      desc: "Hand-finished with crunchy Maldon sea salt flakes and roasted Sicilian pistachios to balance rich chocolate sweetness.",
      stat: "100%",
      statLabel: "Hand Finished",
      pinPosition: { top: '24%', left: '55%' }
    }
  ];

  const pillars = [
    {
      num: "01",
      title: "Belgian Callebaut",
      detail: "Imported from Belgium. Crafted with 100% pure cocoa butter for an unmatchable velvety melt."
    },
    {
      num: "02",
      title: "French Beurre Noisette",
      detail: "Slow-browned European butter toasted to release aromatic nutty notes through every crumb."
    },
    {
      num: "03",
      title: "100% Pure Eggless",
      detail: "Perfected formula. Authentic NYC dense, gooey texture achieved completely eggless."
    },
    {
      num: "04",
      title: "6oz / 170g Scale",
      detail: "Individually hand-portioned to 170 grams — over 3x the size of standard bakery cookies."
    }
  ];

  const current = layers[activeLayer];

  return (
    <section id="craftsmanship" className="relative bg-[#0D0B0A] text-white py-14 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden border-t border-white/10">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-80 sm:w-[500px] h-80 sm:h-[500px] bg-[#1B3A8C]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 sm:w-[400px] h-80 sm:h-[400px] bg-[#C5A059]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
          <span className="section-label text-[#C5A059] text-[10px] sm:text-xs mb-2">
            Culinary Engineering
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight text-white mt-1">
            The Anatomy of a <span className="text-gold-gradient font-serif italic">170g Cookie</span>
          </h2>
          <p className="text-white/70 text-xs sm:text-base font-light leading-relaxed mt-2.5">
            An ordinary cookie is baked flat. A Sukié creation is an architectural marvel crafted with French pastry discipline and NYC indulgence.
          </p>
        </div>

        {/* Interactive Explorer Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-center mb-14 sm:mb-20">
          
          {/* Photo Section with Clean Non-Overlapping Mobile Layout */}
          <div className="lg:col-span-7 flex flex-col items-center">
            
            {/* Visual Frame */}
            <div className="relative w-full max-w-lg aspect-[16/11] sm:aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden border border-[#C5A059]/30 shadow-2xl bg-stone-900">
              <img
                src="/images/two_chip.jpg"
                alt="Cookie Anatomy Cutaway"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

              {/* Interactive Pulsing Hotspots */}
              {layers.map((layer) => {
                const isSelected = activeLayer === layer.id;
                return (
                  <button
                    key={layer.id}
                    onClick={() => setActiveLayer(layer.id)}
                    style={{ top: layer.pinPosition.top, left: layer.pinPosition.left }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20 focus:outline-none cursor-pointer"
                    aria-label={`Inspect ${layer.title}`}
                  >
                    <span className={`relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-transform ${isSelected ? 'scale-120' : 'scale-95'}`}>
                      <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${isSelected ? 'bg-[#C5A059]' : 'bg-white'}`} />
                      <span className={`relative inline-flex items-center justify-center rounded-full h-6 w-6 sm:h-7 sm:w-7 text-[10px] sm:text-xs font-bold shadow-lg border ${isSelected ? 'bg-[#C5A059] text-black border-amber-200' : 'bg-black/80 text-white border-white/40'}`}>
                        0{layer.id + 1}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Mobile-Friendly Layer Switcher Tabs */}
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2 w-full max-w-lg mt-3">
              {layers.map((layer) => {
                const isSelected = activeLayer === layer.id;
                return (
                  <button
                    key={layer.id}
                    onClick={() => setActiveLayer(layer.id)}
                    className={`py-2 px-1 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-wider text-center transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-[#C5A059] text-black border-[#C5A059] shadow-sm'
                        : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <span>0{layer.id + 1} {layer.shortTitle}</span>
                  </button>
                );
              })}
            </div>

            {/* Clean Detail Card Below (Never Colliding) */}
            <div className="w-full max-w-lg mt-3.5 p-4 sm:p-5 rounded-2xl bg-white/[0.04] border border-[#C5A059]/30 backdrop-blur-md flex items-center justify-between">
              <div>
                <span className="text-[9px] uppercase tracking-widest text-[#C5A059] font-mono block">
                  Layer 0{current.id + 1} • {current.subtitle}
                </span>
                <h3 className="font-heading text-base sm:text-xl font-bold text-white mt-0.5">
                  {current.title}
                </h3>
                <p className="text-white/70 text-xs sm:text-sm mt-1 leading-relaxed font-light line-clamp-2 sm:line-clamp-none">
                  {current.desc}
                </p>
              </div>

              <div className="text-right shrink-0 ml-3 pl-3 border-l border-white/10">
                <span className="block font-heading text-xl sm:text-2xl font-bold text-[#C5A059]">
                  {current.stat}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-white/40 font-mono">
                  {current.statLabel}
                </span>
              </div>
            </div>

          </div>

          {/* Desktop Layer Details List (Hidden on small mobile to avoid redundancy) */}
          <div className="hidden lg:flex lg:col-span-5 flex-col space-y-3">
            {layers.map((layer) => {
              const isSelected = activeLayer === layer.id;
              return (
                <div
                  key={layer.id}
                  onClick={() => setActiveLayer(layer.id)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 border ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#1B3A8C]/40 to-white/[0.05] border-[#C5A059] shadow-md translate-x-2'
                      : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-xs text-[#C5A059] font-mono">0{layer.id + 1} • {layer.subtitle}</span>
                      <h4 className="text-base font-heading font-bold text-white mt-1">{layer.title}</h4>
                      <p className="text-white/60 text-xs mt-1 leading-relaxed font-light">{layer.desc}</p>
                    </div>
                    <span className="font-heading text-xl font-bold text-[#C5A059] shrink-0">{layer.stat}</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* 4 Standards Grid - Compact on Mobile */}
        <div className="border-t border-white/10 pt-10 sm:pt-16">
          <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12">
            <h3 className="font-heading text-xl sm:text-3xl font-bold text-white">
              The 4 Uncompromising Standards
            </h3>
            <p className="text-white/50 text-xs sm:text-sm mt-1">
              Why our customers taste the difference from the very first bite.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {pillars.map((p) => (
              <div
                key={p.num}
                className="p-4 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#C5A059]/40 transition-colors flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-wider block mb-1">
                    Standard {p.num}
                  </span>
                  <h4 className="font-heading text-sm sm:text-base font-bold text-white mb-1.5">
                    {p.title}
                  </h4>
                  <p className="text-white/60 text-[11px] sm:text-xs leading-relaxed font-light">
                    {p.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
