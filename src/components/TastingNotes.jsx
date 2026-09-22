import { useState } from 'react';
import { useCart } from '../context/CartContext';

export default function TastingNotes() {
  const { addItem } = useCart();
  const [selectedIdx, setSelectedIdx] = useState(0);

  const flavors = [
    {
      name: "Popcorn Praliné Toffee",
      shortName: "Popcorn Praliné",
      category: "Limited Edition Drop",
      image: "/images/popcorn_praline.jpg",
      notes: ["Browned Butter", "Almond Praline", "Callebaut Milk", "Toffee"],
      sensory: {
        richness: 95,
        crunch: 88,
        gooeyness: 92,
        sweetness: 80,
      },
      story: "French browned butter (beurre noisette) creates deep caramelized aromas that melt into a molten praline cream center with toffee crunch.",
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
      shortName: "Pistachio Gianduja",
      category: "Signature Masterpiece",
      image: "/images/pistachio.jpg",
      notes: ["Sicilian Pistachios", "White Gianduja", "European Butter", "Sea Salt"],
      sensory: {
        richness: 92,
        crunch: 76,
        gooeyness: 96,
        sweetness: 74,
      },
      story: "Slow-roasted pistachios ground into velvety gianduja folded into melted Belgian white chocolate. Break the crust to release an emerald molten lava center.",
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
      shortName: "Triple Chocolate",
      category: "Midnight Dark Cocoa",
      image: "/images/triple_chocolate.jpg",
      notes: ["Callebaut Dark 54.5%", "Milk Chunks", "Dark Cocoa Shell", "Ganache Lava"],
      sensory: {
        richness: 98,
        crunch: 68,
        gooeyness: 100,
        sweetness: 70,
      },
      story: "For the cocoa purist. A dark Dutch cocoa crumb packed with milk & white Callebaut chunks, hiding an intense warm molten ganache volcanic center.",
      tag: "Bestseller",
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
      shortName: "Cupid's Ruby",
      category: "Seasonal Exclusive",
      image: "/images/ruby_chocolate.jpg",
      notes: ["Ruby Cacao", "Wild Berries", "Ruby Ganache", "Pink Shell"],
      sensory: {
        richness: 88,
        crunch: 72,
        gooeyness: 90,
        sweetness: 82,
      },
      story: "Crafted with rare ruby chocolate — naturally pink without colorants, yielding berry-tart notes and a luscious molten center.",
      tag: "Rare Ruby",
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
    <section className="bg-[#0B0C10] text-white py-12 sm:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header with Breathing Room */}
        <div className="text-center sm:text-left max-w-2xl mb-8 sm:mb-12">
          <span className="section-label text-[#C5A059] text-[10px] sm:text-xs mb-2">Sensory Tasting Bar</span>
          <h2 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight text-white mt-1">
            The Tasting Room
          </h2>
          <p className="text-white/60 text-xs sm:text-base mt-2 font-light">
            Explore flavor notes, sensory intensity profiles, and ingredients curated like fine European patisserie.
          </p>
        </div>

        {/* Mobile Smooth Horizontal Swipe Flavor Selector */}
        <div className="mb-6 -mx-4 px-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 min-w-max pb-1">
            {flavors.map((f, idx) => (
              <button
                key={f.name}
                onClick={() => setSelectedIdx(idx)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                  selectedIdx === idx
                    ? 'bg-[#C5A059] text-black shadow-md scale-102 font-bold'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
                }`}
              >
                <img
                  src={f.image}
                  alt={f.shortName}
                  className="w-4 h-4 rounded-full object-cover border border-white/30"
                />
                <span>{f.shortName}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tasting Feature Card */}
        <div className="rounded-2xl sm:rounded-3xl p-5 sm:p-10 border border-[#C5A059]/30 bg-gradient-to-br from-[#161412] to-[#0A0908] shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-center">
            
            {/* Info Column */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/40">
                  {current.tag}
                </span>
                <span className="text-[11px] text-white/50 uppercase font-mono">
                  {current.weight}
                </span>
              </div>

              <h3 className="font-heading text-2xl sm:text-4xl font-bold text-white leading-tight">
                {current.name}
              </h3>

              <p className="text-white/80 text-xs sm:text-base font-light leading-relaxed">
                {current.story}
              </p>

              {/* Flavor Notes Pills */}
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[#C5A059] block mb-2 font-mono">
                  ✦ Flavor & Texture Profile
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {current.notes.map((note) => (
                    <span
                      key={note}
                      className="px-2.5 py-1 rounded-full text-[11px] bg-white/10 text-white/90 border border-white/15"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price & Action */}
              <div className="pt-4 border-t border-white/15 flex items-center justify-between sm:justify-start sm:gap-6">
                <div>
                  <span className="text-[9px] text-white/50 uppercase tracking-widest block font-mono">Price</span>
                  <span className="font-heading text-2xl sm:text-3xl font-bold text-[#C5A059]">₹{current.price}</span>
                </div>

                <button
                  onClick={() => addItem(current.itemData)}
                  className="bg-[#C5A059] hover:bg-[#D4B86A] active:scale-95 text-black font-bold px-6 py-2.5 sm:py-3 rounded-full text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <span>Add To Box</span>
                  <span className="text-sm font-light">+</span>
                </button>
              </div>
            </div>

            {/* Sensory Index Radar Column */}
            <div className="lg:col-span-5 bg-black/50 border border-white/10 rounded-xl p-4 sm:p-6 backdrop-blur-md space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059] font-mono">
                  Sensory Index
                </span>
                <span className="text-[10px] text-white/40 font-mono">
                  Atelier Score
                </span>
              </div>

              <div className="space-y-2.5">
                <div>
                  <div className="flex justify-between text-[11px] mb-1 font-mono">
                    <span className="text-white/80">Richness</span>
                    <span className="text-[#C5A059] font-bold">{current.sensory.richness}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#C5A059] to-amber-300 rounded-full"
                      style={{ width: `${current.sensory.richness}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1 font-mono">
                    <span className="text-white/80">Gooeyness</span>
                    <span className="text-[#C5A059] font-bold">{current.sensory.gooeyness}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full"
                      style={{ width: `${current.sensory.gooeyness}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1 font-mono">
                    <span className="text-white/80">Crust Crunch</span>
                    <span className="text-[#C5A059] font-bold">{current.sensory.crunch}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-600 to-[#C5A059] rounded-full"
                      style={{ width: `${current.sensory.crunch}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1 font-mono">
                    <span className="text-white/80">Sweetness Balance</span>
                    <span className="text-[#C5A059] font-bold">{current.sensory.sweetness}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-stone-400 to-white rounded-full"
                      style={{ width: `${current.sensory.sweetness}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
