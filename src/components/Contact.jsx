import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useMenu } from '../context/MenuContext';

export default function Contact() {
  const [ref, isVisible] = useScrollReveal(0.15);
  const { reviews, addReview, addBulkInquiry, products } = useMenu();

  // Review Form States
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedCookie, setSelectedCookie] = useState('Triple Chocolate Overload');
  const [reviewerName, setReviewerName] = useState('');
  const [reviewNote, setReviewNote] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Instant Corporate / Bulk Quote Form States
  const [showBulkForm, setShowBulkForm] = useState(false);
  const [bulkSubmitted, setBulkSubmitted] = useState(false);
  const [bulkForm, setBulkForm] = useState({
    company: '',
    contact: '',
    phone: '',
    occasion: 'Corporate / Event Gifting',
    units: 25,
    deliveryDate: 'This Month',
    notes: '',
  });

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewNote.trim()) return;
    if (addReview) {
      addReview({
        name: reviewerName.trim(),
        stars: rating,
        cookie: selectedCookie,
        comment: reviewNote.trim(),
      });
    }
    setIsSubmitted(true);
  };

  const handleBulkSubmit = (e) => {
    e.preventDefault();
    if (!bulkForm.contact.trim() || !bulkForm.phone.trim()) return;
    if (addBulkInquiry) {
      addBulkInquiry({
        company: bulkForm.company.trim() || `${bulkForm.contact.trim()}'s Celebration`,
        contact: bulkForm.contact.trim(),
        phone: bulkForm.phone.trim(),
        occasion: bulkForm.occasion,
        units: Number(bulkForm.units) || 25,
        budget: `~₹${((Number(bulkForm.units) || 25) * 1149).toLocaleString('en-IN')}`,
        deliveryDate: bulkForm.deliveryDate || 'Upcoming Event',
        notes: bulkForm.notes.trim() || 'Submitted via Website Corporate Gifting Concierge',
      });
    }
    setBulkSubmitted(true);
  };

  const contactCards = [
    {
      name: 'WhatsApp Concierge',
      value: '+91 91364 98467',
      href: 'https://wa.me/919136498467',
      actionText: 'Chat with Chef',
      iconBg: 'bg-emerald-500/15 text-emerald-700 border border-emerald-500/30',
      icon: (
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
      ),
    },
    {
      name: 'Atelier Email',
      value: 'dessertedaf@gmail.com',
      href: 'mailto:dessertedaf@gmail.com',
      actionText: 'Send an inquiry',
      iconBg: 'bg-[#0C419C]/10 text-[#0C419C] border border-[#0C419C]/25',
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
      name: 'Instagram Journal',
      value: '@sukie.mumbai',
      href: 'https://instagram.com/sukie.mumbai',
      actionText: 'Follow & DM us',
      iconBg: 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white',
      icon: (
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      name: 'Kitchen Atelier Hub',
      value: 'Vikhroli, Mumbai 400079',
      href: 'https://maps.google.com/?q=Vikhroli,+Mumbai+400079',
      actionText: 'Open in Google Maps',
      iconBg: 'bg-[#C5A059]/20 text-[#8A6621] border border-[#C5A059]/40',
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
    <section
      id="contact"
      className="bg-[#FAF6EE] scroll-mt-24 pt-16 sm:pt-24 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-t border-[#C5A059]/25"
    >
      <div
        ref={ref}
        className={`max-w-6xl mx-auto transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="lg:grid lg:grid-cols-2 gap-14 items-start">
          {/* Left Column: Contact Details */}
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#07132B] border border-[#C5A059]/50 text-[#F3E5AB] text-[10px] sm:text-xs font-semibold tracking-wider uppercase mb-3 shadow-xs">
              <span>✦</span>
              <span>Mumbai Atelier Concierge</span>
            </div>
            <h2 className="font-heading text-4xl sm:text-5xl font-bold text-[#07132B] tracking-tight">
              Get In Touch
            </h2>
            <p className="text-stone-600 mt-2 text-sm sm:text-base leading-relaxed font-light">
              Pre-orders only. Order directly on our website or reach our pastry team for custom celebration boxes.
            </p>

            {/* Contact Cards */}
            <div className="space-y-3.5 mt-7">
              {contactCards.map((card) => {
                const isExternal = card.href.startsWith('http');
                return (
                  <a
                    key={card.name}
                    href={card.href}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                    className="flex items-center gap-4 p-4 sm:p-5 bg-gradient-to-r from-[#FFFDF9] to-white rounded-2xl hover:shadow-lg transition-all duration-200 group border border-[#C5A059]/35 hover:border-[#C5A059] cursor-pointer"
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xs group-hover:scale-105 transition-transform duration-200 ${card.iconBg}`}
                    >
                      {card.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono font-bold text-[#8A6621] uppercase tracking-wider">
                          {card.name}
                        </span>
                        <span className="text-xs text-[#0C419C] opacity-0 group-hover:opacity-100 transition-opacity font-semibold hidden sm:inline-block">
                          {card.actionText} →
                        </span>
                      </div>
                      <p className="font-heading font-bold text-[#07132B] text-base sm:text-lg group-hover:text-[#0C419C] transition-colors truncate mt-0.5">
                        {card.value}
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Right Column: Kitchen Pickup & Bulk Orders */}
          <div className="mt-10 lg:mt-0 space-y-6">
            {/* Kitchen Pickup & Collection Hub Card */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#C5A059]/35 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading text-2xl font-bold text-[#07132B]">
                  Kitchen Pickup &amp; Collections
                </h3>
                <span className="text-[10px] font-mono font-bold text-[#0C419C] bg-[#0C419C]/10 border border-[#0C419C]/20 px-3 py-1 rounded-full uppercase tracking-wider">
                  Pickups Only
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 mb-4 leading-relaxed font-light">
                All handcrafted, oversized 170g NYC cookies are baked fresh to order and collected directly from our kitchen atelier in Vikhroli, Mumbai:
              </p>

              {/* Area Pills */}
              <div className="flex flex-wrap gap-2 mb-4">
                {nearbyHubs.map((hub) => (
                  <span
                    key={hub}
                    className="inline-flex items-center gap-1.5 bg-[#FAF6EE] px-3 py-1.5 rounded-full text-xs font-medium text-[#07132B] border border-[#C5A059]/35"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                    {hub}
                  </span>
                ))}
              </div>

              {/* Third-Party Courier Clause Card */}
              <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 text-stone-800 text-xs leading-relaxed space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-950 text-[11px] uppercase tracking-wider">
                  <span>⚠️</span>
                  <span>Third-Party Courier Collections</span>
                </div>
                <p className="text-stone-700 text-[11px]">
                  Once an order has been collected by a courier arranged by the customer, transit and handling are the responsibility of the courier service.
                </p>
              </div>
            </div>

            {/* Bulk & Corporate Orders Card with Instant B2B Quote Request */}
            <div className="bg-gradient-to-br from-[#07132B] via-[#0C419C] to-[#07132B] p-6 sm:p-8 rounded-3xl text-white shadow-xl border border-[#C5A059]/45 relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#C5A059]/20 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-[#F3E5AB] text-[10px] font-mono uppercase tracking-wider border border-white/15">
                    Celebrations &amp; Corporate Gifting
                  </span>
                  <span className="inline-block px-3 py-1 rounded-full bg-[#C5A059] text-stone-950 text-[10px] font-bold font-mono uppercase tracking-wider shadow-sm">
                    Delivery Provided for Bulk Orders
                  </span>
                </div>

                <div>
                  <h4 className="font-heading text-xl sm:text-2xl font-bold text-white">
                    Bulk &amp; Corporate Orders
                  </h4>
                  <p className="text-white/85 mt-1.5 text-xs sm:text-sm leading-relaxed font-light">
                    Planning an event, wedding hampers, or client gifting? We craft bespoke keepsake boxes. <strong>Delivery can only be provided for bulk orders</strong> across Mumbai.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  <a
                    href={whatsappEnquiryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C5A059] hover:bg-[#D4B86A] text-stone-950 font-bold rounded-full text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
                  >
                    <span>Enquire on WhatsApp</span>
                    <span>💬</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setShowBulkForm(!showBulkForm);
                      setBulkSubmitted(false);
                    }}
                    className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/25 text-xs font-semibold transition-all cursor-pointer"
                  >
                    {showBulkForm ? 'Hide Quote Form' : 'Request Instant Quote →'}
                  </button>
                </div>

                {/* Expandable On-Site Corporate Quote Form */}
                <AnimatePresence>
                  {showBulkForm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pt-3 border-t border-white/15 overflow-hidden"
                    >
                      {bulkSubmitted ? (
                        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-center space-y-1">
                          <span className="text-sm font-bold text-emerald-300 block">
                            ✓ Bulk Gifting Inquiry Logged!
                          </span>
                          <p className="text-xs text-white/80">
                            Our Founder has received your inquiry in the Atelier CRM and will reach out on WhatsApp shortly.
                          </p>
                        </div>
                      ) : (
                        <form onSubmit={handleBulkSubmit} className="space-y-2.5">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <input
                              type="text"
                              required
                              placeholder="Your Name *"
                              value={bulkForm.contact}
                              onChange={(e) => setBulkForm({ ...bulkForm, contact: e.target.value })}
                              className="px-3.5 py-2 rounded-xl bg-black/40 border border-white/20 text-xs text-white placeholder:text-white/50 focus:outline-none focus:border-[#C5A059]"
                            />
                            <input
                              type="tel"
                              required
                              placeholder="WhatsApp Number *"
                              value={bulkForm.phone}
                              onChange={(e) => setBulkForm({ ...bulkForm, phone: e.target.value })}
                              className="px-3.5 py-2 rounded-xl bg-black/40 border border-white/20 text-xs text-white placeholder:text-white/50 focus:outline-none focus:border-[#C5A059]"
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <input
                              type="text"
                              placeholder="Company / Event Name"
                              value={bulkForm.company}
                              onChange={(e) => setBulkForm({ ...bulkForm, company: e.target.value })}
                              className="px-3.5 py-2 rounded-xl bg-black/40 border border-white/20 text-xs text-white placeholder:text-white/50 focus:outline-none focus:border-[#C5A059]"
                            />
                            <input
                              type="number"
                              min="10"
                              placeholder="Estimated Boxes (e.g. 30)"
                              value={bulkForm.units}
                              onChange={(e) => setBulkForm({ ...bulkForm, units: e.target.value })}
                              className="px-3.5 py-2 rounded-xl bg-black/40 border border-white/20 text-xs text-white placeholder:text-white/50 focus:outline-none focus:border-[#C5A059]"
                            />
                          </div>
                          <button
                            type="submit"
                            className="w-full py-2.5 rounded-xl bg-white text-[#07132B] font-bold text-xs uppercase tracking-wider hover:bg-[#F3E5AB] transition-colors cursor-pointer"
                          >
                            Submit to Founder Desk
                          </button>
                        </form>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Dedicated Order Care & On-Site Reviews Section */}
        <div id="care" className="scroll-mt-24 mt-16 sm:mt-20 pt-10 sm:pt-16 border-t border-[#C5A059]/25">
          <div className="rounded-3xl sm:rounded-4xl p-6 sm:p-12 bg-gradient-to-br from-[#070D1A] via-[#0C1A38] to-[#050811] text-white shadow-2xl border border-[#C5A059]/35 relative overflow-hidden">
            {/* Ambient gold / cobalt light effects */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#0C419C]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-[#C5A059]/40 backdrop-blur-md mb-3 shadow-inner">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse" />
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

              {/* Card 2: Interactive On-Site Tasting Reviews (Synced with MenuContext) */}
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
                          className="text-[10px] font-mono text-amber-300 underline mt-2 hover:text-white cursor-pointer"
                        >
                          Write Another Review →
                        </button>
                      </motion.div>
                    ) : (
                      <form
                        onSubmit={handleReviewSubmit}
                        className="space-y-3 p-4 rounded-2xl bg-black/40 border border-white/10 mb-4"
                      >
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
                                <span
                                  className={
                                    star <= (hoverRating || rating)
                                      ? 'text-amber-400'
                                      : 'text-stone-600'
                                  }
                                >
                                  ★
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Cookie Selector Pills */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-mono text-white/60 uppercase">
                            Flavor Tasted:
                          </label>
                          <div className="flex flex-wrap gap-1.5">
                            {(products || []).slice(0, 5).map((p) => {
                              const isSel = selectedCookie === p.name;
                              return (
                                <button
                                  key={p.id}
                                  type="button"
                                  onClick={() => setSelectedCookie(p.name)}
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all cursor-pointer border ${
                                    isSel
                                      ? 'bg-[#C5A059] text-stone-950 border-[#C5A059] font-bold'
                                      : 'bg-white/5 text-white/70 border-white/15 hover:text-white'
                                  }`}
                                >
                                  {p.name.split(' ').slice(0, 2).join(' ')}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Reviewer Name */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-mono text-white/60 uppercase">
                            Your Name:
                          </label>
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
                          <label className="text-[10px] font-mono text-white/60 uppercase">
                            Tasting Note / Comments:
                          </label>
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

                  {/* Live Community Tasting Notes Snippet */}
                  <div className="space-y-2.5">
                    {(reviews || []).slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/[0.04] border border-[#C5A059]/25 hover:border-[#C5A059]/50 transition-colors text-left"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-[#0C419C]/60 border border-[#C5A059]/40 flex items-center justify-center text-[10px] font-bold font-mono text-amber-200">
                              {(item.name || 'S').slice(0, 2).toUpperCase()}
                            </div>
                            <span className="font-bold text-xs text-[#F3E5AB]">{item.name}</span>
                            <span className="text-[9px] bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded-full font-mono">
                              Verified
                            </span>
                          </div>
                          <div className="flex items-center gap-0.5 text-amber-400 text-xs">
                            {'★'.repeat(item.stars || 5)}
                          </div>
                        </div>
                        <p className="text-[10px] text-[#C5A059] font-mono tracking-wide mb-1">
                          {item.cookie}
                        </p>
                        <p className="text-[11px] text-white/80 font-light leading-relaxed italic">
                          &ldquo;{item.comment}&rdquo;
                        </p>
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
                    className="w-full py-3 px-4 bg-gradient-to-r from-white/[0.07] via-white/[0.04] to-white/[0.07] hover:bg-white/[0.12] text-white rounded-xl font-medium text-xs flex items-center justify-center gap-2 border border-[#C5A059]/40 hover:border-[#C5A059] transition-all shadow-md cursor-pointer"
                  >
                    <span>Tag Us on Instagram (@sukie.mumbai)</span>
                    <span className="text-sm">📸</span>
                  </a>
                </div>
              </motion.div>
            </div>

            {/* Bottom Luxury Micro-Badge Strip */}
            <div className="mt-10 sm:mt-12 pt-6 border-t border-[#C5A059]/20 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-white relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] border border-emerald-500/30 text-emerald-300 text-[10px] sm:text-xs font-mono uppercase tracking-wider shadow-2xs">
                <span className="text-emerald-400 font-bold">✓</span> 100% Pure Eggless
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] border border-[#C5A059]/40 text-amber-200 text-[10px] sm:text-xs font-mono uppercase tracking-wider shadow-2xs">
                <span className="text-[#C5A059]">✦</span> Flash-Baked in Mumbai
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] border border-[#C5A059]/40 text-stone-200 text-[10px] sm:text-xs font-mono uppercase tracking-wider shadow-2xs">
                <span className="text-[#C5A059]">📍</span> Atelier Hub (Vikhroli)
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] border border-blue-400/30 text-blue-200 text-[10px] sm:text-xs font-mono uppercase tracking-wider shadow-2xs">
                <span className="text-blue-300">✦</span> Bulk Order Deliveries
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
