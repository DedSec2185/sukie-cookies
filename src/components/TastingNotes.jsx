import { useState } from 'react';
import { useCart } from '../context/CartContext';

export default function TastingNotes() {
  const { addItem } = useCart();
  const [selectedIdx, setSelectedIdx] = useState(0);

  const flavors = [
    {
      name: "Popcorn Praliné Toffee",
      category: "Limited Edition Drop",
      image: "/images/popcorn_praline.jpg",
      notes: ["French Browned Butter", "Almond Popcorn Praline", "Callebaut Milk Chocolate", "Toffee Shards"],
      sensory: {
        richness: 95,
        crunch: 88,
        gooeyness: 92,
        sweetness: 80,
      },
      story: "Inspired by cinema nostalgia elevated through Parisian pastry discipline. French browned butter (beurre noisette) creates deep caramelized aromas that melt into a molten praline cream center.",
      tag: "Limited Drop",
      weight: "170g (6oz)",
      price: 349,
      itemData: {
        id: 5,
        name: 'Popcorn Praliné Toffee',
        price: 349,
        weight: '170g (6oz)',
        image: '/images/popcorn_praline.jpg',
        available: true,
      }
    },
    {
      name: "Pistachio White Gianduja",
      category: "Signature Masterpiece",
      image: "/images/pistachio.jpg",
      notes: ["Sicilian Pistachios", "White Chocolate Gianduja", "European Cultured Butter", "Flaky Sea Salt"],
      sensory: {
        richness: 92,
        crunch: 76,
        gooeyness: 96,
        sweetness: 74,
      },
      story: "Slow-roasted pistachios ground into a smooth, velvety paste folded into melted Belgian white chocolate. Break the crust to release an emerald molten lava center.",
      tag: "Chef's Pride",
      weight: "170g (6oz)",
      price: 349,
      itemData: {
        id: 3,
        name: 'Pistachio White Gianduja',
        price: 349,
        weight: '170g (6oz)',
        image: '/images/pistachio.jpg',
        available: true,
      }
    },
    {
      name: "Triple Chocolate Overload",
      category: "Midnight Dark Cocoa",
      image: "/images/triple_chocolate.jpg",
      notes: ["Belgian Callebaut Dark 54.5%", "Milk Chocolate Callets", "Dutch Dark Cocoa Shell", "Silky Ganache Lava"],
      sensory: {
        richness: 98,
        crunch: 68,
        gooeyness: 100,
        sweetness: 70,
      },
      story: "For the uncompromising cocoa purist. A dark Dutch cocoa crumb packed with milk & white Callebaut chunks, hiding an intense, warm molten ganache volcanic center.",
      tag: "All-Time Bestseller",
      weight: "170g (6oz)",
      price: 299,
      itemData: {
        id: 1,
        name: 'Triple Chocolate Overload',
        price: 299,
        weight: '170g (6oz)',
        image: '/images/triple_chocolate.jpg',
        available: true,
      }
    },
    {
      name: "Cupid's Ruby Chocolate",
      category: "Seasonal Exclusive",
      image: "/images/ruby_chocolate.jpg",
      notes: ["Ruby Cacao Beans", "Wild Berry Aromatics", "Ruby Chocolate Ganache", "Crisp Pink Shell"],
      sensory: {
        richness: 88,
        crunch: 72,
        gooeyness: 90,
        sweetness: 82,
      },
      story: "Crafted with the rare 4th type of chocolate in the world — naturally pink without added colorants or fruit flavors, yielding a berry-tart luscious molten finish.",
      tag: "Rare Ruby Drop",
      weight: "170g (6oz)",
      price: 379,
      itemData: {
        id: 4,
        name: "Cupid's Ruby Chocolate",
        price: 379,
        weight: '170g (6oz)',
        image: '/images/ruby_chocolate.jpg',
        available: true,
      }
    }
  ];

  const current = flavors[selectedIdx];

  return (
    <section className="bg-[#0B0C10] text-white py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="section-label text-[#C5A059] mb-3">Sensory Tasting Bar</span>
            <h2 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight text-white mt-2">
              The Tasting Room
            </h2>
            <p className="text-white/60 text-sm sm:text-base mt-2 max-w-xl font-light">
              Explore flavor notes, sensory intensity profiles, and ingredients curated like fine European confectionery.
            </p>
          </div>

          {/* Flavor Switcher Tabs with Real Mini Thumbnails */}
          <div className="flex flex-wrap gap-2">
            {flavors.map((f, idx) => (
              <button
                key={f.name}
                onClick={() => setSelectedIdx(idx)}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                  selectedIdx === idx
                    ? 'bg-[#C5A059] text-black shadow-[0_0_25px_rgba(197,160,89,0.4)] scale-105'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                <img
                  src={f.image}
                  alt={f.name}
                  className="w-5 h-5 rounded-full object-cover border border-white/30"
                />
                <span>{f.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Tasting Feature Card */}
        <div className="rounded-3xl p-8 sm:p-12 border border-[#C5A059]/30 bg-gradient-to-br from-[#161412] to-[#0A0908] shadow-[0_30px_90px_rgba(0,0,0,0.8)] relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Info Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/40">
                  {current.tag}
                </span>
                <span className="text-xs text-white/50 uppercase tracking-wider font-mono">
                  {current.weight} • Serves 1-2
                </span>
              </div>

              <h3 className="font-heading text-3xl sm:text-5xl font-bold text-white leading-tight">
                {current.name}
              </h3>

              <p className="text-white/80 text-base sm:text-lg font-light leading-relaxed">
                {current.story}
              </p>

              {/* Flavor Notes Pills */}
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-[#C5A059] block mb-3 font-mono">
                  ✦ Flavor & Texture Profile
                </span>
                <div className="flex flex-wrap gap-2">
                  {current.notes.map((note) => (
                    <span
                      key={note}
                      className="px-3.5 py-1.5 rounded-full text-xs bg-white/10 text-white/90 border border-white/15 backdrop-blur-xs flex items-center gap-1.5"
                    >
                      <span className="text-[#C5A059] text-xs">✦</span>
                      <span>{note}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Price & Add to Cart */}
              <div className="pt-6 border-t border-white/15 flex items-center gap-6">
                <div>
                  <span className="text-xs text-white/50 uppercase tracking-widest block font-mono">Single 170g Unit</span>
                  <span className="font-heading text-3xl font-bold text-[#C5A059]">₹{current.price}</span>
                </div>

                <button
                  onClick={() => addItem(current.itemData)}
                  className="bg-[#C5A059] hover:bg-[#D4B86A] text-black font-bold px-8 py-3.5 rounded-full text-xs uppercase tracking-widest transition-all duration-300 shadow-xl hover:shadow-[#C5A059]/30 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center gap-2"
                >
                  <span>Add To Box</span>
                  <span className="text-base font-light">+</span>
                </button>
              </div>
            </div>

            {/* Right Photography + Sensory Radar Column */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* High-res Image Preview */}
              <div className="relative h-60 w-full rounded-2xl overflow-hidden border border-white/15 shadow-2xl">
                <img
                  src={current.image}
                  alt={current.name}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-4 text-xs font-mono text-amber-200 bg-black/60 px-3 py-1 rounded-full backdrop-blur-md">
                  Gooey Center Preview
                </span>
              </div>

              {/* Sliders */}
              <div className="bg-black/60 border border-white/10 rounded-2xl p-6 backdrop-blur-md space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#C5A059] font-mono">
                    Sensory Index
                  </span>
                  <span className="text-xs text-white/40 font-mono">
                    Atelier Score
                  </span>
                </div>

                <div className="space-y-3.5">
                  <div>
                    <div className="flex justify-between text-xs mb-1.5 font-mono">
                      <span className="text-white/80">Cocoa & Butter Richness</span>
                      <span className="text-[#C5A059] font-bold">{current.sensory.richness}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#C5A059] to-amber-300 rounded-full transition-all duration-700"
                        style={{ width: `${current.sensory.richness}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1.5 font-mono">
                      <span className="text-white/80">Molten Core Gooeyness</span>
                      <span className="text-[#C5A059] font-bold">{current.sensory.gooeyness}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-700"
                        style={{ width: `${current.sensory.gooeyness}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1.5 font-mono">
                      <span className="text-white/80">Caramelized Crust Crunch</span>
                      <span className="text-[#C5A059] font-bold">{current.sensory.crunch}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-600 to-[#C5A059] rounded-full transition-all duration-700"
                        style={{ width: `${current.sensory.crunch}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1.5 font-mono">
                      <span className="text-white/80">Balanced Sweetness</span>
                      <span className="text-[#C5A059] font-bold">{current.sensory.sweetness}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-stone-400 to-white rounded-full transition-all duration-700"
                        style={{ width: `${current.sensory.sweetness}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center gap-2.5 text-xs text-white/50">
                  <span className="text-[#C5A059]">ℹ</span>
                  <span>Best enjoyed warm. Reheat at 160°C for 2 minutes.</span>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
