import { motion } from 'framer-motion';
import { X, Phone, Mail, Award, Clock, ShoppingBag, MessageSquare, ChevronRight, Calendar, Heart } from 'lucide-react';

export default function CustomerDrawer({ customer, orders, onClose, onSelectOrder }) {
  if (!customer) return null;

  const customerOrders = orders.filter((o) => {
    const p1 = (o.customer?.phone || '').replace(/\D/g, '');
    const p2 = (customer.phone || '').replace(/\D/g, '');
    return p1 && p2 && p1 === p2;
  });

  const isVip = customer.totalSpent > 2500 || customer.isBulk;
  const firstName = customer.name.split(' ')[0] || 'Client';

  const cleanPhone = customer.phone.replace(/\D/g, '');
  const waPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  const waLink = `https://wa.me/${waPhone}?text=${encodeURIComponent(
    `Hello ${firstName}! 🍪 Greetings from Sukié Mumbai Atelier. Our Head Chef wanted to personally thank you for being a valued patron of our artisanal bakes!`
  )}`;

  return (
    <div className="fixed inset-0 z-[280] overflow-hidden flex justify-end">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/75 backdrop-blur-xs"
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="relative w-full max-w-lg bg-[#091A3E] border-l border-[#C5A059]/40 shadow-2xl flex flex-col justify-between overflow-hidden text-white"
      >
        {/* Drawer Header */}
        <div className="p-6 bg-gradient-to-r from-[#07132B] via-[#0A2254] to-[#07132B] border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#0C419C] to-[#1E60D5] border-2 border-[#C5A059] flex items-center justify-center font-heading font-bold text-lg text-[#F3E5AB] shadow-lg">
              {customer.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-lg font-bold text-white leading-tight">
                  {customer.name}
                </h3>
                {isVip && (
                  <span className="text-[9px] bg-amber-400/20 text-amber-300 font-mono font-bold px-2 py-0.5 rounded-full uppercase border border-amber-400/30 flex items-center gap-1">
                    <Award className="w-3 h-3 text-amber-300" />
                    <span>VIP Member</span>
                  </span>
                )}
              </div>
              <span className="text-xs text-white/60 font-mono mt-0.5 block">
                Customer Dossier • {customerOrders.length} {customerOrders.length === 1 ? 'Order' : 'Orders'} Recorded
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Quick Contact & WhatsApp Pill */}
          <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/60 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Phone / WhatsApp</span>
              </span>
              <span className="font-mono font-bold text-white">{customer.phone}</span>
            </div>
            {customer.email && customer.email !== '—' && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/60 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Email Address</span>
                </span>
                <span className="font-mono text-white/90">{customer.email}</span>
              </div>
            )}
            <div className="pt-2 border-t border-white/10">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-emerald-700/80 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Open WhatsApp Concierge Chat</span>
              </a>
            </div>
          </div>

          {/* CRM Lifetime Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-black/30 border border-white/10">
              <span className="text-[10px] font-mono uppercase tracking-wider text-white/50 block mb-1">
                Lifetime Spend (LTV)
              </span>
              <span className="font-heading text-2xl font-bold text-[#F3E5AB]">
                ₹{customer.totalSpent.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-emerald-400 font-mono block mt-0.5">
                High-Value Client
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-black/30 border border-white/10">
              <span className="text-[10px] font-mono uppercase tracking-wider text-white/50 block mb-1">
                Average Order Value
              </span>
              <span className="font-heading text-2xl font-bold text-white">
                ₹{Math.round(customer.totalSpent / (customer.totalOrders || 1)).toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-white/40 font-mono block mt-0.5">
                ~{(customer.totalOrders > 0 ? (customer.totalSpent / (customer.totalOrders * 299)).toFixed(1) : 1)} boxes/order
              </span>
            </div>
          </div>

          {/* Favorite Flavor & Preference */}
          <div className="p-4 rounded-2xl bg-black/30 border border-[#C5A059]/30 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#C5A059]/20 text-[#F3E5AB] flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#F3E5AB] font-bold block">
                Client Flavor Preference
              </span>
              <span className="font-bold text-sm text-white">{customer.favoriteCookie}</span>
              <span className="text-[11px] text-white/50 block mt-0.5">Ordered most frequently across visits</span>
            </div>
          </div>

          {/* Customer Orders History List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-white/10">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#C5A059] font-bold flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Complete Order History ({customerOrders.length})</span>
              </h4>
            </div>

            {customerOrders.length === 0 ? (
              <p className="text-xs text-white/50 italic py-2">No past orders found in this session.</p>
            ) : (
              <div className="space-y-2.5">
                {customerOrders.map((ord) => (
                  <div
                    key={ord.id}
                    onClick={() => {
                      if (onSelectOrder) onSelectOrder(ord);
                    }}
                    className="p-3.5 rounded-xl bg-black/40 border border-white/10 hover:border-[#C5A059]/50 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-[#F3E5AB]">#{ord.id}</span>
                        <span className="text-[10px] px-2 py-0.2 rounded-full font-mono bg-white/10 text-white/70">
                          {ord.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-white/50 font-mono mt-1">
                        <span>{ord.date}</span>
                        <span>•</span>
                        <span>{ord.time}</span>
                      </div>
                      <p className="text-xs text-white/80 line-clamp-1 mt-1">
                        {ord.items?.map((i) => `${i.name} (x${i.quantity})`).join(', ')}
                      </p>
                    </div>

                    <div className="text-right shrink-0 flex items-center gap-2">
                      <div>
                        <span className="font-heading font-bold text-sm text-[#F3E5AB] block">
                          ₹{ord.finalTotal?.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-white/40 font-mono uppercase">
                          {ord.channel || 'Pickup'}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-5 border-t border-white/10 bg-[#07132B] flex items-center justify-between">
          <span className="text-[11px] text-white/50 font-mono">
            Sukié Client Relationship Management
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Close Dossier
          </button>
        </div>
      </motion.div>
    </div>
  );
}
