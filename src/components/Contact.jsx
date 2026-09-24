import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Contact() {
  const [ref, isVisible] = useScrollReveal(0.15);

  // Review Form States
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedCookie, setSelectedCookie] = useState('Triple Chocolate Overload');
  const [reviewerName, setReviewerName] = useState('');
  const [reviewNote, setReviewNote] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [reviewsList, setReviewsList] = useState([
    {
      id: 1,
      name: 'Rohan M.',
      stars: 5,
      cookie: 'Triple Chocolate Overload',
      comment: 'The molten 54.5% ganache lava core is out of this world. Massive 170g size and 100% pure eggless perfection.',
      date: '2 days ago',
    },
    {
      id: 2,
      name: 'Simran K.',
      stars: 5,
      cookie: 'Pistachio White Gianduja',
      comment: 'The roasted Sicilian pistachios and smooth white chocolate gianduja are sheer luxury. Best cookie in Mumbai.',
      date: 'Yesterday',
    },
    {
      id: 3,
      name: 'Arjun V.',
      stars: 5,
      cookie: 'Gooey Two-Chip',
      comment: 'Maldon sea salt flakes with the gooey chocolate center balance the sweetness flawlessly.',
      date: '3 days ago',
    },
  ]);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewNote.trim()) return;
    const newEntry = {
      id: Date.now(),
      name: reviewerName.trim(),
      stars: rating,
      cookie: selectedCookie,
      comment: reviewNote.trim(),
      date: 'Just now',
    };
    setReviewsList([newEntry, ...reviewsList]);
    setIsSubmitted(true);
  };

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
      actionText: 'Pre-order pick-up & collection hub',
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

  const nearbyHubs = [
    'Vikhroli Atelier Hub',
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

          {/* Right Column: Kitchen Pickup & Bulk Orders */}
          <div className="mt-12 lg:mt-0">
            {/* Kitchen Pickup & Collection Hub */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-2xl font-bold text-brand-dark">
                  Kitchen Pickup &amp; Collections
                </h3>
                <span className="text-xs font-semibold text-brand-blue bg-brand-blue/10 px-3 py-1 rounded-full uppercase tracking-wider">
                  Pickups Only
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                All handcrafted, oversized NYC cookies are baked fresh to order and collected directly from our kitchen atelier in Vikhroli, Mumbai:
              </p>

              {/* Area Pills */}
              <div className="flex flex-wrap gap-2 mb-4">
                {nearbyHubs.map((hub) => (
                  <span
                    key={hub}
                    className="inline-flex items-center gap-1.5 bg-brand-cream px-3 py-1.5 rounded-full text-xs font-medium text-brand-dark border border-brand-cream-dark/60 shadow-2xs"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                    {hub}
                  </span>
                ))}
              </div>

              {/* Third-Party Courier Clause Card */}
              <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-stone-800 text-xs leading-relaxed space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-900 text-[11px] uppercase tracking-wider">
                  <span>⚠️</span>
                  <span>Third-Party Courier Collections</span>
                </div>
                <p className="text-stone-700 text-[11px]">
                  Once an order has been collected by a courier arranged by the customer, transit and handling are the responsibility of the courier service.
                </p>
              </div>
            </div>

            {/* Bulk & Corporate Orders Card */}
            <div className="bg-gradient-to-r from-brand-blue to-brand-blue-dark p-7 sm:p-8 rounded-2xl text-white mt-6 shadow-xl relative overflow-hidden">
              {/* Background ambient accents */}
              <div className="absolute -top-12 -right-12 w-36 h-36 bg-brand-gold/15 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />

              <div className="relative z-10">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-brand-gold-light text-xs font-semibold tracking-wider uppercase border border-white/10">
                    Celebrations &amp; Gifting
                  </span>
                  <span className="inline-block px-3 py-1 rounded-full bg-[#C5A059] text-stone-950 text-xs font-bold font-mono uppercase tracking-wider shadow-sm">
                    Delivery Provided for Bulk Orders
                  </span>
                </div>

                <h4 className="font-heading text-xl sm:text-2xl font-bold text-white">
                  Bulk &amp; Corporate Orders
                </h4>
                <p className="text-white/85 mt-2 text-xs sm:text-sm leading-relaxed">
                  Planning an event? Need luxury gifts for your team or wedding guests? We do custom boxes and bulk orders. <strong>Delivery can only be provided for bulk orders</strong> across Mumbai.
                </p>

                <a
                  href={whatsappEnquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 mt-5 px-6 py-2.5 bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-semibold rounded-full text-xs sm:text-sm transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                  <span>Enquire on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Dedicated Order Care & On-Site Reviews Section */}
        <div id="care" className="mt-20 pt-16 border-t border-stone-200/80">
          <div className="rounded-3xl sm:rounded-4xl p-6 sm:p-12 bg-gradient-to-br from-[#070D1A] via-[#0C1A38] to-[#050811] text-white shadow-2xl border border-[#C5A059]/30 relative overflow-hidden">
            {/* Ambient gold / cobalt light effects */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#0C419C]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-[#C5A059]/40 backdrop-blur-md mb-3 shadow-inner">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse"></span>
                <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] font-semibold text-amber-200">
                  The Sukié Atelier Standard
                </span>
              </div>
              <h3 className="font-heading text-3xl sm:text-5xl font-bold text-white tracking-tight mt-1">
                Order Care &amp; Reviews
              </h3>
              <p className="text-white/70 text-xs sm:text-base font-light leading-relaxed mt-3 max-w-xl mx-auto">
                Every order is freshly prepared, carefully checked and thoughtfully packed before it leaves our kitchen.
              </p>
            </div>

            {/* Two Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
              
              {/* Card 1: Exact ORDER CARE Pillar as requested */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="rounded-2xl sm:rounded-3xl p-6 sm:p-8 bg-white/[0.04] backdrop-blur-xl border border-[#C5A059]/40 hover:border-[#C5A059]/70 transition-all duration-300 flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <span className="px-3 py-1 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/50 text-amber-200 text-[10px] font-mono uppercase tracking-wider font-semibold">
                      ✦ QUALITY
                    </span>
                    <span className="text-[10px] text-white/50 font-mono">Mumbai Kitchen</span>
                  </div>

                  <h4 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-2.5">
                    ORDER CARE
                  </h4>
                  <p className="text-white/80 text-xs sm:text-sm leading-relaxed mb-6 font-light">
                    Every order is freshly prepared, carefully checked and thoughtfully packed before it leaves our kitchen.
                  </p>

                  <div className="space-y-4 mb-8 p-5 rounded-2xl bg-black/40 border border-[#C5A059]/25 text-xs text-white/90">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-amber-300 font-bold uppercase tracking-wider text-[11px]">
                        <span>✦</span>
                        <span>FRESHLY PREPARED</span>
                      </div>
                      <p className="text-white/75 text-[11px] pl-4 leading-relaxed font-light">
                        Each order is made fresh and checked before it’s ready for collection.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-amber-300 font-bold uppercase tracking-wider text-[11px]">
                        <span>✦</span>
                        <span>CAREFULLY PACKED</span>
                      </div>
                      <p className="text-white/75 text-[11px] pl-4 leading-relaxed font-light">
                        Your cookies are packed with their journey home in mind.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-amber-300 font-bold uppercase tracking-wider text-[11px]">
                        <span>✦</span>
                        <span>NEED A HAND?</span>
                      </div>
                      <p className="text-white/75 text-[11px] pl-4 leading-relaxed font-light">
                        If you have any questions or concerns about your order, just reach out to us on WhatsApp. We’re happy to help.
                      </p>
                    </div>
                  </div>
                </div>

                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  href="https://wa.me/919136498467?text=Hello%20Suki%C3%A9%20Care!%20%F0%9F%8D%AA%20I%20have%20a%20question%20regarding%20my%20order."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 px-5 bg-gradient-to-r from-[#C5A059] via-[#D4B86A] to-[#C5A059] hover:brightness-110 text-stone-950 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl cursor-pointer"
                >
                  <span>CONTACT US ON WHATSAPP</span>
                  <span className="text-base">💬</span>
                </motion.a>
              </motion.div>

              {/* Card 2: Interactive On-Site Tasting Reviews (NO WhatsApp for reviews!) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.12 }}
                className="rounded-2xl sm:rounded-3xl p-6 sm:p-8 bg-white/[0.04] backdrop-blur-xl border border-[#C5A059]/30 hover:border-[#C5A059]/60 transition-all duration-300 flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="px-3 py-1 rounded-full bg-amber-950/70 border border-amber-500/30 text-amber-300 text-[10px] font-mono uppercase tracking-wider font-semibold">
                      ⭐ Tasting Room &amp; Community Reviews
                    </span>
                    <span className="text-[10px] text-amber-200/60 font-mono">On-Site Reviews</span>
                  </div>

                  <h4 className="font-heading text-xl sm:text-2xl font-bold text-white mb-1.5">
                    Share Your Tasting Notes
                  </h4>
                  <p className="text-white/70 text-xs leading-relaxed mb-4 font-light">
                    Rate your cookie experience directly on our site. Your feedback shapes future oven batches!
                  </p>

                  {/* Interactive On-Site Review Form */}
                  <AnimatePresence mode="wait">
                    {isSubmitted ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-5 rounded-2xl bg-[#0C419C]/30 border border-[#C5A059]/60 text-center space-y-2 mb-4"
                      >
                        <span className="text-3xl block">✨</span>
                        <h5 className="font-heading text-base font-bold text-[#F3E5AB]">
                          Thank You for Your Tasting Notes!
                        </h5>
                        <p className="text-xs text-white/80 font-light leading-relaxed">
                          Your review has been saved to the Sukié community wall.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setIsSubmitted(false);
                            setReviewerName('');
                            setReviewNote('');
                          }}
                          className="text-[10px] font-mono text-amber-300 underline mt-2 hover:text-white"
                        >
                          Write Another Review →
                        </button>
                      </motion.div>
                    ) : (
                      <form onSubmit={handleReviewSubmit} className="space-y-3 p-4 rounded-2xl bg-black/40 border border-white/10 mb-4">
                        {/* Star Rating Picker */}
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-white/70 font-medium">Your Rating:</span>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                className="text-xl sm:text-2xl transition-transform hover:scale-120 cursor-pointer p-0.5"
                                aria-label={`${star} star rating`}
                              >
                                <span className={star <= (hoverRating || rating) ? 'text-amber-400' : 'text-stone-600'}>
                                  ★
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Cookie Selector */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-mono text-white/60 uppercase">Flavor Tasted:</label>
                          <select
                            value={selectedCookie}
                            onChange={(e) => setSelectedCookie(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-xs text-white focus:outline-none focus:border-[#C5A059] cursor-pointer"
                          >
                            <option value="Triple Chocolate Overload" className="bg-stone-900">Triple Chocolate Overload</option>
                            <option value="Gooey Two-Chip" className="bg-stone-900">Gooey Two-Chip</option>
                            <option value="Pistachio White Gianduja" className="bg-stone-900">Pistachio White Gianduja</option>
                            <option value="Cupid's Ruby Chocolate" className="bg-stone-900">Cupid&apos;s Ruby Chocolate</option>
                            <option value="Popcorn Praliné Toffee" className="bg-stone-900">Popcorn Praliné Toffee</option>
                            <option value="Bespoke Keepsake Box" className="bg-stone-900">The Royal Keepsake Box</option>
                          </select>
                        </div>

                        {/* Reviewer Name */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-mono text-white/60 uppercase">Your Name:</label>
                          <input
                            type="text"
                            required
                            value={reviewerName}
                            onChange={(e) => setReviewerName(e.target.value)}
                            placeholder="e.g. Ananya S."
                            className="w-full px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                          />
                        </div>

                        {/* Review Note */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-mono text-white/60 uppercase">Tasting Note / Comments:</label>
                          <textarea
                            rows={2}
                            required
                            value={reviewNote}
                            onChange={(e) => setReviewNote(e.target.value)}
                            placeholder="Tell us about the texture, molten center & aroma..."
                            className="w-full px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-xs text-white focus:outline-none focus:border-[#C5A059] resize-none"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 px-4 bg-[#C5A059] hover:bg-[#D4B86A] text-stone-950 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-md"
                        >
                          Submit Tasting Review
                        </button>
                      </form>
                    )}
                  </AnimatePresence>

                  {/* Recent Community Tasting Notes Snippet */}
                  <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                    {reviewsList.slice(0, 2).map((item) => (
                      <div key={item.id} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-left text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#F3E5AB]">{item.name}</span>
                          <span className="text-amber-400 font-mono text-xs">{'★'.repeat(item.stars)}</span>
                        </div>
                        <p className="text-[10px] text-white/60 font-mono">{item.cookie}</p>
                        <p className="text-[11px] text-white/80 font-light mt-1 italic">&ldquo;{item.comment}&rdquo;</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Instagram Community Link */}
                <div className="mt-4 pt-3 border-t border-white/10">
                  <a
                    href="https://instagram.com/sukie.mumbai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 bg-white/10 hover:bg-white/15 text-white rounded-xl font-medium text-xs flex items-center justify-center gap-2 border border-white/15 transition-colors cursor-pointer"
                  >
                    <span>Tag Us on Instagram (@sukie.mumbai)</span>
                    <span>📸</span>
                  </a>
                </div>
              </motion.div>

            </div>

            {/* Bottom Luxury Micro-Badge Strip */}
            <div className="mt-10 sm:mt-12 pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-[11px] text-white/50 font-mono uppercase tracking-wider relative z-10">
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-400">✓</span> 100% Pure Eggless
              </span>
              <span className="text-white/20">•</span>
              <span className="flex items-center gap-1.5">
                <span className="text-amber-300">✦</span> Flash-Baked in Mumbai
              </span>
              <span className="text-white/20">•</span>
              <span className="flex items-center gap-1.5">
                <span className="text-[#C5A059]">📍</span> Atelier Pickup Hub (Vikhroli)
              </span>
              <span className="text-white/20">•</span>
              <span className="flex items-center gap-1.5">
                <span className="text-amber-300">✦</span> Bulk Order Deliveries
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
