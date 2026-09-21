export default function MarqueeTicker() {
  const items = [
    "170G OVERSIZED COOKIES",
    "100% EGGLESS LUXURY",
    "BELGIAN CALLEBAUT CHOCOLATE",
    "FRENCH BROWNED BUTTER",
    "LIMITED WEEKLY DROPS",
    "FRESHLY BAKED IN MUMBAI",
    "PRE-ORDERS ONLY",
    "MOLTEN GOOEY CORE"
  ];

  return (
    <div className="relative w-full overflow-hidden bg-brand-dark py-4 border-y border-brand-gold/20 select-none">
      <div className="flex w-max marquee-track items-center">
        {[...items, ...items, ...items].map((text, idx) => (
          <div key={idx} className="flex items-center space-x-6 mx-4">
            <span className="text-xs md:text-sm font-semibold tracking-[0.25em] text-brand-gold uppercase">
              {text}
            </span>
            <span className="text-brand-gold/40 text-xs">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}
