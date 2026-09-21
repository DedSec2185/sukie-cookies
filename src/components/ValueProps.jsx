import { useScrollReveal } from '../hooks/useScrollReveal';

const valueProps = [
  {
    icon: '🍫',
    title: 'Belgian Callebaut',
    desc: 'Only the finest chocolate from Belgium makes it into our cookies',
    isEggless: false,
  },
  {
    icon: '🥚',
    title: '100% Eggless',
    desc: 'All our recipes are completely eggless without compromising on taste',
    isEggless: true,
  },
  {
    icon: '🧈',
    title: 'European Butter',
    desc: 'Rich, creamy European butter for that perfect melt-in-mouth texture',
    isEggless: false,
  },
  {
    icon: '🔥',
    title: 'Baked Fresh Daily',
    desc: 'Every cookie is baked fresh for your order — never stored, never stale',
    isEggless: false,
  },
];

export default function ValueProps() {
  const [ref, isVisible] = useScrollReveal(0.15);

  return (
    <section className="bg-brand-cream py-20 px-4 relative overflow-hidden">
      <div
        ref={ref}
        className={`max-w-6xl mx-auto reveal ${isVisible ? 'visible' : ''}`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {valueProps.map((card) => (
            <div
              key={card.title}
              className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-xl transition-all duration-300 group border border-brand-cream-dark/60 hover:border-brand-gold/40 hover:-translate-y-1 flex flex-col items-center"
            >
              <div className="h-16 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                {card.isEggless ? (
                  <span className="relative inline-flex items-center justify-center">
                    <span
                      className="text-5xl select-none leading-none"
                      role="img"
                      aria-label="Eggless"
                    >
                      🥚
                    </span>
                    <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="w-12 h-1 bg-red-500/85 -rotate-45 rounded-full shadow-xs" />
                    </span>
                  </span>
                ) : (
                  <span
                    className="text-5xl select-none leading-none"
                    role="img"
                    aria-label={card.title}
                  >
                    {card.icon}
                  </span>
                )}
              </div>
              <h3 className="font-heading text-lg font-bold text-brand-dark mt-4">
                {card.title}
              </h3>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
