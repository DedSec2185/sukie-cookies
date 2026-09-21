import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Craftsmanship() {
  const [activeLayer, setActiveLayer] = useState(2);

  const layers = [
    {
      id: 0,
      title: "Artisan Finishing Touch",
      subtitle: "Flaky Sea Salt & Roasted Crunch",
      desc: "Hand-finished with Maldon fleur de sel flakes, roasted Sicilian pistachios, or caramelized toffee shards to create an essential mineral contrast against deep chocolate sweetness.",
      stat: "100%",
      statLabel: "Hand Finished",
      pinPosition: { top: '18%', left: '48%' }
    },
    {
      id: 1,
      title: "Caramelized Crust",
      subtitle: "Crisp European Browned-Butter Shell",
      desc: "Flash-baked at precision convection heat to create a shatteringly thin, golden caramelized crust that seals in steam and protects the gooey crumb beneath.",
      stat: "420°F",
      statLabel: "Flash Bake",
      pinPosition: { top: '38%', left: '18%' }
    },
    {
      id: 2,
      title: "The 24h Cold-Aged Crumb",
      subtitle: "Aged Dough For Deep Toffee Complexity",
      desc: "Resting the dough for a full 24 hours allows the French cultured butter to fully hydrate the flour and develop intricate notes of browned butter, vanilla bean, and molasses.",
      stat: "24h",
      statLabel: "Cold Fermented",
      pinPosition: { top: '65%', left: '26%' }
    },
    {
      id: 3,
      title: "Molten Volcanic Core",
      subtitle: "Warm Flowing Callebaut Ganache Center",
      desc: "The hallmark of an authentic Sukié 170g creation. Break the shell open to unleash a velvety, liquid lava flow of pure Belgian chocolate ganache or silky gianduja.",
      stat: "54.5%",
      statLabel: "Callebaut Cocoa",
      pinPosition: { top: '52%', left: '52%' }
    }
  ];

  const pillars = [
    {
      num: "01",
      title: "Belgian Callebaut Couverture",
      detail: "Imported from Wieze, Belgium. Crafted with 100% pure cocoa butter and roasted whole cocoa beans for an unmatchable velvety melt."
    },
    {
      num: "02",
      title: "French Beurre Noisette",
      detail: "Slow-browned European cultured butter gently toasted until nutty and hazelnut-toned, imparting depth into every single crumb."
    },
    {
      num: "03",
      title: "100% Pure Eggless Recipe",
      detail: "Perfected through meticulous pastry engineering. Authentic NYC gooey texture achieved completely eggless, without sacrificing flavor."
    },
    {
      num: "04",
      title: "Hand-Weighed 170g Scale",
      detail: "Every single cookie is individually portioned to a massive 6oz (170g) — more than three times the size of a standard bakery cookie."
    }
  ];

  return (
    <section id="craftsmanship" className="relative bg-[#0D0B0A] text-white py-24 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden border-t border-white/10">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#1B3A8C]/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[500px] h-[500px] bg-[#C5A059]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="section-label text-[#C5A059] mb-3">
            Culinary Engineering
          </span>
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mt-2">
            The Anatomy of a <span className="text-gold-gradient font-serif italic">170g Cookie</span>
          </h2>
          <p className="text-white/70 text-base sm:text-lg font-light leading-relaxed mt-4">
            An ordinary cookie is baked flat. A Sukié creation is a multi-layered architectural marvel 
            crafted with French pastry technique and NYC indulgence.
          </p>
        </div>

        {/* Interactive Cookie Cross-Section Explorer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-28">
          
          {/* Real Photo with Interactive Pinpoints */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-lg aspect-[4/3] rounded-3xl overflow-hidden border border-[#C5A059]/30 shadow-[0_30px_80px_rgba(0,0,0,0.8)] bg-stone-900 group">
              
              {/* Macro Food Photograph of Cookie Cut Open */}
              <img
                src="/images/two_chip.jpg"
                alt="Cookie Anatomy Cutaway"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
              />

              {/* Ambient Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

              {/* Interactive Pulsing Hotspots on the Photo */}
              {layers.map((layer) => {
                const isSelected = activeLayer === layer.id;
                return (
                  <button
                    key={layer.id}
                    onClick={() => setActiveLayer(layer.id)}
                    style={{ top: layer.pinPosition.top, left: layer.pinPosition.left }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group/pin focus:outline-none cursor-pointer"
                    aria-label={`Inspect ${layer.title}`}
                  >
                    <span className={`relative flex items-center justify-center w-8 h-8 rounded-full transition-transform duration-300 ${isSelected ? 'scale-125' : 'scale-100 hover:scale-110'}`}>
                      <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${isSelected ? 'bg-[#C5A059]' : 'bg-white'}`} />
                      <span className={`relative inline-flex items-center justify-center rounded-full h-7 w-7 text-[11px] font-bold shadow-xl border ${isSelected ? 'bg-[#C5A059] text-black border-amber-200' : 'bg-black/80 text-white border-white/40'}`}>
                        0{layer.id + 1}
                      </span>
                    </span>
                  </button>
                );
              })}

              {/* Active Hotspot Label Overlay */}
              <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md p-4 rounded-2xl border border-white/15 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-mono block">
                    Inspecting Layer 0{activeLayer + 1}
                  </span>
                  <span className="font-heading text-lg font-bold text-white">
                    {layers[activeLayer].title}
                  </span>
                </div>
                <span className="font-heading text-2xl font-bold text-[#C5A059]">
                  {layers[activeLayer].stat}
                </span>
              </div>
            </div>

            <p className="text-white/40 text-xs text-center mt-4 tracking-widest uppercase font-mono">
              ✦ Click numbered points or options on right to explore craftsmanship
            </p>
          </div>

          {/* Layer Details List */}
          <div className="lg:col-span-5 space-y-4">
            {layers.map((layer) => {
              const isSelected = activeLayer === layer.id;
              return (
                <div
                  key={layer.id}
                  onClick={() => setActiveLayer(layer.id)}
                  className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 border ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#1B3A8C]/40 to-white/[0.05] border-[#C5A059] shadow-[0_10px_35px_rgba(27,58,140,0.3)] translate-x-2'
                      : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full ${isSelected ? 'bg-[#C5A059] text-black font-bold' : 'bg-white/10 text-white/60'}`}>
                          0{layer.id + 1}
                        </span>
                        <span className="text-xs text-[#C5A059] font-medium">
                          {layer.subtitle}
                        </span>
                      </div>
                      <h3 className={`text-xl font-heading font-bold mt-2 transition-colors ${isSelected ? 'text-white' : 'text-white/80'}`}>
                        {layer.title}
                      </h3>
                      <p className="text-white/60 text-sm leading-relaxed mt-2 font-light">
                        {layer.desc}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="block font-heading text-2xl font-bold text-[#C5A059]">
                        {layer.stat}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-white/40 font-mono">
                        {layer.statLabel}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* 4 Pillars Grid */}
        <div className="border-t border-white/10 pt-20">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white">
              The 4 Uncompromising Standards
            </h3>
            <p className="text-white/50 text-sm mt-2">
              Why our clients taste the difference from the very first bite.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((p) => (
              <div
                key={p.num}
                className="group relative p-8 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#C5A059]/40 hover:bg-white/[0.04] transition-all duration-300 flex flex-col justify-between"
              >
                <div className="absolute top-0 right-0 p-6 font-mono text-4xl font-bold text-white/5 group-hover:text-[#C5A059]/20 transition-colors">
                  {p.num}
                </div>
                <div>
                  <span className="text-xs font-bold text-[#C5A059] uppercase tracking-widest block mb-4">
                    Standard {p.num}
                  </span>
                  <h4 className="font-heading text-lg font-bold text-white group-hover:text-amber-200 transition-colors mb-3">
                    {p.title}
                  </h4>
                  <p className="text-white/60 text-sm leading-relaxed font-light">
                    {p.detail}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-[#C5A059] font-medium">
                  <span>✦ Certified Artisan Quality</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
