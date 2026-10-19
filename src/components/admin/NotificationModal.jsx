import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Send,
  CheckCircle2,
  Flame,
  Package,
  Calendar,
  Truck,
  Copy,
  ExternalLink,
  X,
  Sparkles,
  Smartphone,
} from 'lucide-react';

export default function NotificationModal({
  isOpen,
  onClose,
  order,
  onUpdateStatus,
  showToast,
}) {
  const [selectedTemplateKey, setSelectedTemplateKey] = useState('ready');
  const [customMessage, setCustomMessage] = useState('');
  const [copied, setCopied] = useState(false);

  // Set default template based on current order status
  useEffect(() => {
    if (!order) return;
    const status = (order.status || '').toLowerCase();
    if (status.includes('prep') || status.includes('bake')) {
      setSelectedTemplateKey('ready');
    } else if (status.includes('ready')) {
      setSelectedTemplateKey('handover');
    } else if (order.customer?.slot && (order.customer?.slot.toLowerCase().includes('tomorrow') || order.customer?.slot.includes('Sep') || order.customer?.slot.includes('Oct'))) {
      setSelectedTemplateKey('scheduled_confirm');
    } else {
      setSelectedTemplateKey('baking');
    }
  }, [order]);

  // Generate templates
  const templates = {
    scheduled_confirm: {
      id: 'scheduled_confirm',
      title: 'Scheduled Order Confirmed',
      icon: Calendar,
      badge: 'Order Logged',
      color: 'text-amber-300',
      nextStatus: 'Pending',
      generate: (ord) => {
        const name = ord.customer?.name?.split(' ')[0] || 'there';
        const slot = ord.customer?.slot || 'your scheduled slot';
        return `Hello ${name}! ✨ Your Sukié NYC cookie order #${ord.id} is confirmed and scheduled in our kitchen queue for ${slot}. We flash-bake each batch 45 mins prior to collection to ensure the molten Belgian chocolate center is warm. Track your order live: https://sukiecookies.com/#track=${ord.id}`;
      },
    },
    baking: {
      id: 'baking',
      title: 'Ovens Prepping (Baking Started)',
      icon: Flame,
      badge: 'In The Oven',
      color: 'text-blue-400',
      nextStatus: 'Kitchen Prepping',
      generate: (ord) => {
        const name = ord.customer?.name?.split(' ')[0] || 'there';
        return `Hello ${name}! 🍪 Great news: your cookies for Order #${ord.id} have just entered our ovens at 160°C. They are flash-baked fresh with European butter and molten Callebaut chocolate. We'll message you the moment they are boxed! Live tracker: https://sukiecookies.com/#track=${ord.id}`;
      },
    },
    ready: {
      id: 'ready',
      title: 'Boxed & Ready for Collection',
      icon: Package,
      badge: 'Ready for Pickup',
      color: 'text-emerald-400',
      nextStatus: 'Ready for Collection',
      generate: (ord) => {
        const name = ord.customer?.name?.split(' ')[0] || 'there';
        return `Hello ${name}! 🍪 Your fresh artisanal bakes for Order #${ord.id} are boxed in our royal keepsake packaging and ready for collection at Sukié Atelier (Vikhroli East, Mumbai). If booking a Dunzo/Porter courier, please share Order #${ord.id}. Atelier Directions: https://maps.google.com/?q=Vikhroli,+Mumbai+400079. See you soon!`;
      },
    },
    scheduled_reminder: {
      id: 'scheduled_reminder',
      title: 'Scheduled Pickup Morning Reminder',
      icon: Sparkles,
      badge: 'Day-of Reminder',
      color: 'text-[#F3E5AB]',
      nextStatus: null,
      generate: (ord) => {
        const name = ord.customer?.name?.split(' ')[0] || 'there';
        const slot = ord.customer?.slot || 'today';
        return `Hello ${name}! ✨ Friendly reminder from Sukié Atelier: your scheduled cookie pickup window is ${slot}. We will flash-bake your 170g cookies so they are fresh and warm for your collection. Hub: Vikhroli East, Mumbai.`;
      },
    },
    courier_dispatch: {
      id: 'courier_dispatch',
      title: 'Courier Handover & Transit Clause',
      icon: Truck,
      badge: 'Dispatched',
      color: 'text-purple-300',
      nextStatus: 'Collected',
      generate: (ord) => {
        const name = ord.customer?.name?.split(' ')[0] || 'there';
        return `Hello ${name}! 🛵 Your Order #${ord.id} has just been collected by your courier from our Vikhroli Atelier. Reminder: transit and handling are the responsibility of the courier service. Reheat card is inside the box (2 mins @ 160°C for molten center!). Enjoy!`;
      },
    },
  };

  // Update text when template changes
  useEffect(() => {
    if (order && templates[selectedTemplateKey]) {
      setCustomMessage(templates[selectedTemplateKey].generate(order));
    }
  }, [selectedTemplateKey, order]);

  if (!isOpen || !order) return null;

  const phone = (order.customer?.phone || '').replace(/\D/g, '');
  const cleanPhone = phone.length === 10 ? `91${phone}` : phone;
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(customMessage)}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(customMessage);
    setCopied(true);
    if (showToast) showToast('Message copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendAndAdvance = () => {
    const currentTemplate = templates[selectedTemplateKey];
    if (currentTemplate?.nextStatus && onUpdateStatus) {
      onUpdateStatus(order.id, currentTemplate.nextStatus);
    }
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        />

        {/* Modal Sheet */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl bg-[#07132B] text-white rounded-3xl border border-[#C5A059]/40 shadow-[0_25px_70px_rgba(0,0,0,0.9)] overflow-hidden z-10 my-auto"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-[#C5A059]/25 flex items-center justify-between bg-gradient-to-r from-[#07132B] via-[#091F47] to-[#07132B]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shadow-md">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C5A059] block font-bold">
                  Direct Customer Notification Engine
                </span>
                <h3 className="font-heading text-lg font-bold text-white tracking-wide">
                  Notify Customer • Order #{order.id}
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
          <div className="p-5 sm:p-6 space-y-5 max-h-[78vh] overflow-y-auto">
            {/* Customer Pill Summary */}
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#0C419C] text-[#F3E5AB] font-bold font-mono flex items-center justify-center text-xs">
                  {order.customer?.name?.slice(0, 2).toUpperCase() || 'CU'}
                </div>
                <div>
                  <span className="font-bold text-white block">{order.customer?.name}</span>
                  <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                    <Smartphone className="w-3 h-3" />
                    +{cleanPhone}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-white/50 block">Current Status</span>
                <span className="font-mono font-bold text-amber-300 text-xs">
                  {order.status || 'Pending'}
                </span>
              </div>
            </div>

            {/* Template Selector Pills */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-[#F3E5AB] font-semibold block">
                Select Notification Trigger
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.values(templates).map((tmpl) => {
                  const Icon = tmpl.icon;
                  const isSelected = selectedTemplateKey === tmpl.id;

                  return (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => setSelectedTemplateKey(tmpl.id)}
                      className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex items-start gap-2.5 ${
                        isSelected
                          ? 'bg-[#091F47] border-[#C5A059] shadow-lg ring-1 ring-[#C5A059]/40'
                          : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${tmpl.color}`} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white block truncate">
                            {tmpl.title}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-white/50 block mt-0.5">
                          {tmpl.badge}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Editable Message Preview */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-white/60">
                <span className="uppercase tracking-widest text-[#F3E5AB] font-semibold">
                  Personalized WhatsApp Message Preview
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="hover:text-white flex items-center gap-1 transition-colors cursor-pointer text-[#C5A059]"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copied ? 'Copied!' : 'Copy Text'}</span>
                </button>
              </div>
              <textarea
                rows={5}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="w-full p-3.5 rounded-2xl bg-black/60 border border-[#C5A059]/30 text-xs sm:text-sm text-white/90 font-mono leading-relaxed focus:outline-none focus:border-[#C5A059] resize-none"
              />
              <span className="text-[10px] text-white/40 font-mono block">
                Includes verified live order tracking link and Mumbai Vikhroli Atelier address.
              </span>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleSendAndAdvance}
                className="flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
              >
                <Send className="w-4 h-4" />
                <span>
                  {templates[selectedTemplateKey]?.nextStatus
                    ? `Update to "${templates[selectedTemplateKey].nextStatus}" & Send WhatsApp`
                    : 'Dispatch on WhatsApp'}
                </span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="py-3 px-5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
