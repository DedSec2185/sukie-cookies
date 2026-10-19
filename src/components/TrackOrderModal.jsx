import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Package,
  Clock,
  MapPin,
  CheckCircle2,
  Flame,
  ShoppingBag,
  ExternalLink,
  MessageCircle,
  X,
  Sparkles,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import { useMenu } from '../context/MenuContext';

export default function TrackOrderModal({ isOpen, onClose, initialOrderId = '' }) {
  const { orders } = useMenu();
  const [searchQuery, setSearchQuery] = useState(initialOrderId);
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Auto-search if initialOrderId is provided
  useEffect(() => {
    if (initialOrderId && orders?.length > 0) {
      setSearchQuery(initialOrderId);
      const cleanId = initialOrderId.trim().toUpperCase().replace('#', '');
      const found = orders.find(
        (o) => o.id?.toUpperCase() === cleanId || o.id?.toUpperCase() === `SUK-${cleanId}`
      );
      if (found) {
        setTrackedOrder(found);
        setHasSearched(true);
      }
    }
  }, [initialOrderId, orders]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSearch = (e) => {
    e?.preventDefault();
    if (!searchQuery.trim()) return;

    setHasSearched(true);
    const query = searchQuery.trim().toLowerCase().replace('#', '');

    const found = orders.find((o) => {
      const idMatch = o.id?.toLowerCase().includes(query);
      const phoneMatch = o.customer?.phone?.replace(/\D/g, '').includes(query);
      return idMatch || phoneMatch;
    });

    setTrackedOrder(found || null);
  };

  if (!isOpen) return null;

  // Determine stage (1 to 4)
  const getStageIndex = (status = '') => {
    const s = status.toLowerCase();
    if (s.includes('collect') || s.includes('fulfil')) return 4;
    if (s.includes('ready') || s.includes('boxed')) return 3;
    if (s.includes('prep') || s.includes('oven') || s.includes('bake')) return 2;
    return 1; // Pending / Confirmed
  };

  const currentStage = getStageIndex(trackedOrder?.status);

  const stages = [
    {
      num: 1,
      title: 'Order Confirmed',
      desc: 'Batch received & scheduled in kitchen schedule',
      icon: CheckCircle2,
    },
    {
      num: 2,
      title: 'Ovens Prepping (160°C)',
      desc: 'European butter dough flash-baked to order',
      icon: Flame,
    },
    {
      num: 3,
      title: 'Boxed & Ready for Pickup',
      desc: 'Wrapped in parchment & sealed in royal keepsake box',
      icon: Package,
    },
    {
      num: 4,
      title: 'Collected / Handed Over',
      desc: 'Collected by customer or courier service',
      icon: Sparkles,
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-2xl bg-[#07132B] text-white rounded-3xl border border-[#C5A059]/40 shadow-[0_25px_70px_rgba(0,0,0,0.85)] overflow-hidden z-10 my-auto"
        >
          {/* Ambient Lighting */}
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#1A5ED1]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#C5A059]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Modal Header */}
          <div className="p-5 sm:p-6 border-b border-[#C5A059]/20 flex items-center justify-between relative z-10 bg-gradient-to-r from-[#07132B] via-[#091F47] to-[#07132B]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#0C419C] border border-[#C5A059]/50 flex items-center justify-center shadow-lg">
                <Package className="w-5 h-5 text-[#F3E5AB]" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C5A059] block font-bold">
                  Sukié Live Kitchen Dispatch
                </span>
                <h3 className="font-heading text-lg sm:text-xl font-bold text-white tracking-wide">
                  Track Your Artisan Bakes
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-5 sm:p-7 space-y-6 max-h-[80vh] overflow-y-auto relative z-10">
            {/* Search Input Bar */}
            <form onSubmit={handleSearch} className="relative">
              <label className="text-[10px] font-mono text-[#F3E5AB]/80 uppercase tracking-widest block mb-2 font-semibold">
                Look up by Order ID or Registered Phone
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#C5A059] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g. SUK-4921 or 9820145892"
                    className="w-full pl-10 pr-4 py-3 bg-black/50 border border-[#C5A059]/40 rounded-2xl text-xs sm:text-sm text-white placeholder-stone-400 focus:outline-none focus:border-[#C5A059] font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#C5A059] via-[#D4B86A] to-[#C5A059] text-stone-950 font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 transition-all shrink-0 cursor-pointer"
                >
                  Locate
                </button>
              </div>
            </form>

            {/* If Order Found */}
            {trackedOrder ? (
              <div className="space-y-6">
                {/* Order Summary Header Pill */}
                <div className="p-4 rounded-2xl bg-white/[0.04] border border-[#C5A059]/30 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block">
                      Order Token
                    </span>
                    <span className="font-mono font-bold text-base sm:text-lg text-[#F3E5AB]">
                      #{trackedOrder.id}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block">
                      Customer
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-white">
                      {trackedOrder.customer?.name}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block">
                      Current Status
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono tracking-wide ${
                        currentStage === 4
                          ? 'bg-stone-700/60 text-stone-300 border border-stone-500/40'
                          : currentStage === 3
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse'
                          : currentStage === 2
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {trackedOrder.status || 'Pending'}
                    </span>
                  </div>
                </div>

                {/* Scheduled Slot Banner */}
                {trackedOrder.customer?.slot && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0C1E4A] to-[#0A1633] border border-[#C5A059]/40 flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                    <div className="text-xs space-y-1">
                      <span className="font-bold text-[#F3E5AB] block font-heading tracking-wide uppercase text-[11px]">
                        Scheduled Collection Window
                      </span>
                      <p className="text-white/90 font-mono text-xs">
                        {trackedOrder.customer?.slot}
                      </p>
                      <p className="text-[11px] text-white/60 font-light leading-relaxed">
                        To maintain our signature molten lava center, cookies are flash-baked 45 minutes prior to collection.
                      </p>
                    </div>
                  </div>
                )}

                {/* 4-Stage Animated Visual Timeline */}
                <div className="space-y-4 pt-2">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C5A059] font-bold block">
                    Live Atelier Timeline
                  </span>

                  <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-white/10">
                    {stages.map((stg) => {
                      const isComplete = currentStage >= stg.num;
                      const isCurrent = currentStage === stg.num;
                      const Icon = stg.icon;

                      return (
                        <div key={stg.num} className="relative flex items-start gap-4">
                          {/* Indicator Dot */}
                          <div
                            className={`absolute -left-6 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                              isCurrent
                                ? 'bg-gradient-to-r from-[#C5A059] to-[#D4B86A] text-stone-950 ring-4 ring-[#C5A059]/30 shadow-lg scale-110'
                                : isComplete
                                ? 'bg-[#0C419C] text-white border border-[#C5A059]/50'
                                : 'bg-black/60 text-white/30 border border-white/10'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0 pl-3">
                            <div className="flex items-center gap-2">
                              <h4
                                className={`font-heading text-sm font-bold tracking-wide ${
                                  isCurrent ? 'text-[#F3E5AB]' : isComplete ? 'text-white' : 'text-white/40'
                                }`}
                              >
                                {stg.title}
                              </h4>
                              {isCurrent && (
                                <span className="text-[9px] font-mono uppercase bg-[#C5A059]/20 text-[#C5A059] px-2 py-0.2 rounded-full border border-[#C5A059]/40 font-bold">
                                  Current Stage
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-white/60 font-light mt-0.5 leading-relaxed">
                              {stg.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Bakes in This Order */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-mono text-white/60 uppercase">
                    <span>Artisan Bakes Ordered</span>
                    <span>{trackedOrder.totalItems || trackedOrder.items?.length} items</span>
                  </div>
                  <div className="space-y-1.5 pt-1">
                    {trackedOrder.items?.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs py-1 border-b border-white/5 last:border-0"
                      >
                        <span className="text-white font-medium flex items-center gap-2">
                          <span className="text-[#C5A059] font-mono">x{item.quantity}</span>
                          <span>{item.name}</span>
                          <span className="text-[10px] text-stone-400 font-mono">({item.weight})</span>
                        </span>
                        <span className="font-mono text-amber-200">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    ))}
                    {trackedOrder.packagingFee > 0 && (
                      <div className="flex items-center justify-between text-xs py-1 text-[#C5A059]">
                        <span>🎁 Luxury Cobalt Gift Ribbon &amp; Keepsake Box</span>
                        <span className="font-mono">₹{trackedOrder.packagingFee}</span>
                      </div>
                    )}
                  </div>
                  <div className="pt-2 border-t border-white/10 flex justify-between items-center text-sm font-bold font-mono">
                    <span className="text-stone-300">Total</span>
                    <span className="text-[#F3E5AB]">₹{trackedOrder.finalTotal || trackedOrder.totalPrice}</span>
                  </div>
                </div>

                {/* Atelier Collection Location Card */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#091B3E] to-[#061229] border border-[#C5A059]/40 space-y-3">
                  <div className="flex items-center gap-2 text-[#F3E5AB] font-heading font-bold text-xs uppercase tracking-wider">
                    <MapPin className="w-4 h-4 text-[#C5A059]" />
                    <span>Kitchen Collection Hub</span>
                  </div>
                  <div className="text-xs space-y-1 text-white/80">
                    <p className="font-bold text-white">Sukié Atelier Hub</p>
                    <p className="text-stone-300">Vikhroli East, Mumbai 400079</p>
                  </div>

                  {/* Third-Party Courier Clause Card */}
                  <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-[11px] text-amber-200/90 leading-relaxed flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-amber-300">Third-Party Courier Collections:</strong>
                      Once an order has been collected by a courier arranged by the customer (Dunzo, Porter, Swiggy Genie), transit and handling are the responsibility of the courier service.
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                    <a
                      href="https://maps.google.com/?q=Vikhroli,+Mumbai+400079"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs flex items-center justify-center gap-1.5 border border-white/15 transition-all"
                    >
                      <span>Open in Google Maps</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <a
                      href={`https://wa.me/919136498467?text=Hello%20Suki%C3%A9%20Care!%20%F0%9F%8D%AA%20I%20have%20a%20query%20about%20Order%20%23${trackedOrder.id}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 px-4 rounded-xl bg-[#0F2D6B] hover:bg-[#153B8C] text-white font-semibold text-xs flex items-center justify-center gap-1.5 border border-[#C5A059]/40 transition-all"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Chat on WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            ) : hasSearched ? (
              /* No matching order found */
              <div className="p-10 rounded-2xl bg-black/40 border border-white/10 text-center space-y-3">
                <ShoppingBag className="w-10 h-10 mx-auto text-white/30" />
                <h4 className="font-heading text-base font-bold text-white">
                  No Active Order Found
                </h4>
                <p className="text-xs text-stone-400 max-w-sm mx-auto leading-relaxed">
                  We couldn’t find an order matching &ldquo;<span className="text-[#F3E5AB] font-mono">{searchQuery}</span>&rdquo;. Please verify your Order ID or contact the atelier on WhatsApp.
                </p>
                <a
                  href="https://wa.me/919136498467?text=Hello%20Suki%C3%A9!%20I%20need%20help%20tracking%20my%20cookie%20order."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C5A059] hover:underline pt-2"
                >
                  <span>Contact Atelier Support</span>
                  <span>→</span>
                </a>
              </div>
            ) : (
              /* Initial helper text */
              <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/5 text-center space-y-2">
                <Clock className="w-8 h-8 mx-auto text-[#C5A059]/60" />
                <h4 className="font-heading text-sm font-bold text-white">
                  Live Oven &amp; Dispatch Status
                </h4>
                <p className="text-xs text-stone-400 max-w-md mx-auto leading-relaxed">
                  Enter your Order ID (from your confirmation receipt or WhatsApp notification) to view your batch&apos;s real-time baking stage.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
