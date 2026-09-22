import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Contact() {
  const [ref, isVisible] = useScrollReveal(0.15);

  const contactCards = [
    {
      name: 'WhatsApp',
      value: '+91 91364 98467',
      href: 'https://wa.me/919136498467',
      actionText: 'Chat with us',
      iconBg: 'bg-emerald-100 text-emerald-600',
      icon: (
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
      ),
    },
    {
      name: 'Email',
      value: 'dessertedaf@gmail.com',
      href: 'mailto:dessertedaf@gmail.com',
      actionText: 'Send an inquiry',
      iconBg: 'bg-blue-100 text-brand-blue',
      icon: (
        <svg
          className="w-6 h-6 fill-none stroke-current"
          viewBox="0 0 24 24"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      value: '@sukie.mumbai',
      href: 'https://instagram.com/sukie.mumbai',
      actionText: 'Follow & DM us',
      iconBg: 'bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 text-white',
      icon: (
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      name: 'Kitchen Location',
      value: 'Vikhroli, Mumbai 400079',
      href: 'https://maps.google.com/?q=Vikhroli,+Mumbai+400079',
      actionText: 'Pre-order pick-up & delivery hub',
      iconBg: 'bg-amber-100 text-brand-warm',
      icon: (
        <svg
          className="w-6 h-6 fill-none stroke-current"
          viewBox="0 0 24 24"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
    },
  ];

  const deliveryAreas = [
    'Vikhroli',
    'Powai',
    'Andheri',
    'Chandivali',
    'Ghatkopar',
    'Bhandup',
    'Kanjurmarg',
    'Navi Mumbai',
  ];

  const whatsappEnquiryUrl =
    'https://wa.me/919136498467?text=' +
    encodeURIComponent('Hi Sukié! I would like to enquire about bulk and corporate cookie orders.');

  return (
    <section id="contact" className="bg-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div
        ref={ref}
        className={`max-w-6xl mx-auto transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="lg:grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Column: Contact Details */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cream border border-brand-gold/30 text-brand-warm text-xs font-semibold tracking-wider uppercase mb-3">
              <span>✦</span>
              <span>Direct Pre-Orders</span>
            </div>
            <h2 className="font-heading text-4xl sm:text-5xl font-bold text-brand-dark tracking-tight">
              Get In Touch
            </h2>
            <p className="text-gray-600 mt-2 text-base sm:text-lg leading-relaxed">
              Pre-orders only. DM us or order through our website.
            </p>

            {/* Contact Cards */}
            <div className="space-y-4 mt-8">
              {contactCards.map((card) => {
                const isExternal = card.href.startsWith('http');
                return (
                  <a
                    key={card.name}
                    href={card.href}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                    className="flex items-center gap-4 p-4 bg-brand-cream rounded-xl hover:shadow-md transition-all duration-200 group border border-brand-cream-dark/50 hover:border-brand-gold/50 cursor-pointer"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-xs group-hover:scale-105 transition-transform duration-200 ${card.iconBg}`}
                    >
                      {card.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          {card.name}
                        </span>
                        <span className="text-xs text-brand-gold opacity-0 group-hover:opacity-100 transition-opacity font-medium hidden sm:inline-block">
                          {card.actionText} →
                        </span>
                      </div>
                      <p className="font-semibold text-brand-dark text-base sm:text-lg group-hover:text-brand-blue transition-colors truncate">
                        {card.value}
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Right Column: Delivery Areas & Bulk Orders */}
          <div className="mt-12 lg:mt-0">
            {/* Delivery Areas */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-2xl font-bold text-brand-dark">
                  Delivery Areas
                </h3>
                <span className="text-xs font-medium text-brand-blue bg-brand-blue/10 px-3 py-1 rounded-full">
                  Fresh Delivery
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                We deliver our handcrafted, oversized NYC cookies freshly baked to your doorstep:
              </p>

              {/* Area Pills */}
              <div className="flex flex-wrap gap-2.5">
                {deliveryAreas.map((area) => (
                  <span
                    key={area}
                    className="inline-flex items-center gap-1.5 bg-brand-cream px-4 py-2 rounded-full text-sm font-medium text-brand-dark border border-brand-cream-dark/60 hover:border-brand-gold/60 hover:bg-brand-cream-dark/30 transition-all duration-150 shadow-2xs"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                    {area}
                  </span>
                ))}
              </div>
            </div>

            {/* Bulk & Corporate Orders Card */}
            <div className="bg-gradient-to-r from-brand-blue to-brand-blue-dark p-8 rounded-2xl text-white mt-8 shadow-xl relative overflow-hidden">
              {/* Background ambient accents */}
              <div className="absolute -top-12 -right-12 w-36 h-36 bg-brand-gold/15 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />

              <div className="relative z-10">
                <span className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-brand-gold-light text-xs font-semibold tracking-wider uppercase mb-3 border border-white/10">
                  Celebrations & Gifting
                </span>
                <h4 className="font-heading text-xl sm:text-2xl font-bold text-white">
                  Bulk & Corporate Orders
                </h4>
                <p className="text-white/80 mt-2 text-sm sm:text-base leading-relaxed">
                  Planning an event? Need gifts for your team? We do custom boxes and bulk orders.
                </p>

                <a
                  href={whatsappEnquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 mt-6 px-6 py-3 bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-semibold rounded-full text-sm sm:text-base transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                  <span>Enquire on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Dedicated Customer Care, Complaints & Reviews Guarantee Section */}
        <div id="care" className="mt-16 pt-12 border-t border-stone-200">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-500/30 text-emerald-800 text-[11px] font-bold tracking-wider uppercase mb-2">
              <span>🛡️</span>
              <span>100% Quality & Transparency Promise</span>
            </span>
            <h3 className="font-heading text-3xl sm:text-4xl font-bold text-brand-dark">
              Customer Care, Complaints & Reviews
            </h3>
            <p className="text-stone-600 text-xs sm:text-sm mt-2 leading-relaxed">
              We bake in small batches with genuine passion. Whether you have an issue with your delivery or want to share your tasting review, our founder is directly available on WhatsApp.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Order Complaints & Reversals */}
            <div className="bg-[#FAF6EE] rounded-2xl p-6 sm:p-8 border border-stone-200/80 shadow-xs flex flex-col justify-between hover:border-brand-gold/60 transition-colors">
              <div>
                <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center text-2xl mb-4 shadow-2xs">
                  💬
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-red-700 font-bold block mb-1">
                  Prompt Resolution
                </span>
                <h4 className="font-heading text-xl sm:text-2xl font-bold text-brand-dark mb-2">
                  Order Complaints & Reversals
                </h4>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-4">
                  If an order arrives damaged in transit, under/over-baked, or imperfect in any way, we review every complaint personally. For genuine issues, Chef immediately approves a fresh replacement batch or payment reversal.
                </p>

                <ul className="space-y-2 text-xs text-stone-700 mb-6">
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Direct founder review — no automated bots</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>100% transparent replacement or reversal option</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Direct WhatsApp support with fast turn-around</span>
                  </li>
                </ul>
              </div>

              <a
                href="https://wa.me/919136498467?text=Hello%20Suki%C3%A9%20Care!%20%F0%9F%8D%AA%20I%20have%20an%20order%20complaint%20%2F%20issue%20to%20review%20for%20resolution.%20Order%20ID%3A%20"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 bg-stone-900 hover:bg-black text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
              >
                <span>Report Complaint on WhatsApp</span>
                <span className="text-base">💬</span>
              </a>
            </div>

            {/* Card 2: Feedback & Tasting Reviews */}
            <div className="bg-[#FAF6EE] rounded-2xl p-6 sm:p-8 border border-stone-200/80 shadow-xs flex flex-col justify-between hover:border-brand-gold/60 transition-colors">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-2xl mb-4 shadow-2xs">
                  ⭐
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#7C5E28] font-bold block mb-1">
                  Community Voice
                </span>
                <h4 className="font-heading text-xl sm:text-2xl font-bold text-brand-dark mb-2">
                  Feedback & Tasting Reviews
                </h4>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-4">
                  Loved your warm molten cookie experience? Have suggestions for our next limited drop flavour? Your honest reviews help our Mumbai home kitchen grow and delight more cookie lovers.
                </p>

                <ul className="space-y-2 text-xs text-stone-700 mb-6">
                  <li className="flex items-center gap-2">
                    <span className="text-amber-500 font-bold">★</span>
                    <span>Share your tasting notes & favourite flavour</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-amber-500 font-bold">★</span>
                    <span>Suggest new cookie flavours you&apos;d love to see</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-amber-500 font-bold">★</span>
                    <span>Tag us in your unboxing on Instagram @sukie.mumbai</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <a
                  href="https://wa.me/919136498467?text=Hello%20Chef!%20%F0%9F%8D%AA%20I%20wanted%20to%20share%20my%20tasting%20review%20and%20feedback%20for%20Suki%C3%A9%20Cookies%3A%20"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
                >
                  <span>Share Review on WhatsApp</span>
                  <span className="text-base">⭐</span>
                </a>

                <a
                  href="https://instagram.com/sukie.mumbai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 bg-white hover:bg-stone-100 text-stone-800 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-2 border border-stone-200 cursor-pointer"
                >
                  <span>Tag Us on Instagram (@sukie.mumbai)</span>
                  <span>📸</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
