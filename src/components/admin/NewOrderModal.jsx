import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, User, Phone, Clock, FileText, CheckCircle2 } from 'lucide-react';
import { useMenu } from '../../context/MenuContext';

export default function NewOrderModal({ isOpen, onClose, onOrderCreated }) {
  const { products, addOrder } = useMenu();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [slot, setSlot] = useState('Today Evening (5:00 PM – 8:00 PM)');
  const [channel, setChannel] = useState('pickup');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [note, setNote] = useState('');
  const [selectedItems, setSelectedItems] = useState({});
  const [isBulk, setIsBulk] = useState(false);

  if (!isOpen) return null;

  // Handle item quantity change
  const handleQuantityChange = (productId, delta) => {
    setSelectedItems((prev) => {
      const current = prev[productId] || 0;
      const updated = Math.max(0, current + delta);
      if (updated === 0) {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      }
      return { ...prev, [productId]: updated };
    });
  };

  // Calculate totals
  const itemEntries = Object.entries(selectedItems);
  let totalUnits = 0;
  let subtotal = 0;

  const orderItems = itemEntries.map(([prodId, qty]) => {
    const product = products.find((p) => p.id === Number(prodId) || p.id === prodId);
    const price = product?.price || 299;
    const name = product?.name || 'Signature Drop';
    const weight = product?.weight || '170g (6oz)';
    totalUnits += qty;
    subtotal += price * qty;
    return {
      id: prodId,
      name,
      price,
      weight,
      quantity: qty,
    };
  });

  const packagingFee = totalUnits > 0 ? (totalUnits >= 4 ? 49 : 0) : 0;
  const finalTotal = subtotal + packagingFee;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || orderItems.length === 0) {
      alert('Please enter customer name, phone number, and at least 1 cookie item.');
      return;
    }

    const orderId = `SUK-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const dateFormatted = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    const timeFormatted = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

    const newOrder = {
      id: orderId,
      customer: {
        name: customerName.trim(),
        phone: phone.trim(),
        email: email.trim() || '—',
        slot,
        note: note.trim(),
        paymentMethod,
        isBulkOrder: isBulk,
      },
      items: orderItems,
      totalItems: totalUnits,
      totalPrice: subtotal,
      packagingFee,
      finalTotal,
      status: 'Pending',
      channel,
      deliveryArea: 'Vikhroli Atelier (Pickup)',
      date: dateFormatted,
      time: timeFormatted,
    };

    addOrder(newOrder);
    if (onOrderCreated) {
      onOrderCreated(newOrder);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[300] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-[#091B3E] border-2 border-[#C5A059]/70 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden text-white my-auto max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#071636] via-[#0C419C] to-[#071636] border-b border-[#C5A059]/30 flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#F3E5AB] font-bold">
              MANUAL TICKET LOGGING
            </span>
            <h3 className="font-heading text-xl font-bold text-white mt-0.5">
              Create Walk-in / Phone Order
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Customer Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#C5A059] font-bold flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span>Customer Information</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-white/70 mb-1">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Radhika Merchant"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-1">Phone Number (WhatsApp) *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9820123456"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white focus:outline-none focus:border-[#C5A059] font-mono"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-1">Email Address (Optional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. client@domain.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-1">Fulfillment Slot *</label>
                <select
                  value={slot}
                  onChange={(e) => setSlot(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white focus:outline-none focus:border-[#C5A059] cursor-pointer"
                >
                  <option value="Today Evening (5:00 PM – 8:00 PM)" className="bg-[#091A3E]">Today Evening (5:00 PM – 8:00 PM)</option>
                  <option value="Tomorrow Morning (11:00 AM – 2:00 PM)" className="bg-[#091A3E]">Tomorrow Morning (11:00 AM – 2:00 PM)</option>
                  <option value="Tomorrow Evening (5:00 PM – 8:00 PM)" className="bg-[#091A3E]">Tomorrow Evening (5:00 PM – 8:00 PM)</option>
                  <option value="Immediate Kitchen Walk-in (15 mins)" className="bg-[#091A3E]">Immediate Kitchen Walk-in (15 mins)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Channel & Payment */}
          <div className="space-y-3 pt-3 border-t border-white/10">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#C5A059] font-bold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Channel &amp; Payment</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-white/70 mb-1">Collection Channel</label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white focus:outline-none focus:border-[#C5A059] cursor-pointer"
                >
                  <option value="pickup" className="bg-[#091A3E]">Direct Pickup</option>
                  <option value="courier" className="bg-[#091A3E]">Dunzo / Porter Courier</option>
                  <option value="bulk" className="bg-[#091A3E]">Corporate Bulk Drop</option>
                </select>
              </div>

              <div>
                <label className="block text-white/70 mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white focus:outline-none focus:border-[#C5A059] cursor-pointer"
                >
                  <option value="upi" className="bg-[#091A3E]">UPI / QR Paid</option>
                  <option value="cod" className="bg-[#091A3E]">Cash on Collection</option>
                  <option value="card" className="bg-[#091A3E]">Credit / Debit Card</option>
                  <option value="corporate" className="bg-[#091A3E]">Corporate Invoice</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="bulk-toggle"
                  checked={isBulk}
                  onChange={(e) => setIsBulk(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#C5A059] cursor-pointer"
                />
                <label htmlFor="bulk-toggle" className="text-xs text-white/90 cursor-pointer">
                  Corporate / Bulk Order
                </label>
              </div>
            </div>
          </div>

          {/* Item Selector */}
          <div className="space-y-3 pt-3 border-t border-white/10">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#C5A059] font-bold flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Select 170g Cookies &amp; Gift Boxes</span>
              </span>
              <span className="text-[11px] text-[#F3E5AB] font-mono">
                {totalUnits} items selected
              </span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
              {products.map((p) => {
                const qty = selectedItems[p.id] || 0;
                return (
                  <div
                    key={p.id}
                    className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-2 ${
                      qty > 0
                        ? 'bg-[#0C419C]/40 border-[#C5A059]'
                        : 'bg-black/30 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <span className="font-bold text-xs text-white block truncate">{p.name}</span>
                      <span className="text-[10px] font-mono text-[#F3E5AB]">₹{p.price} • {p.weight}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(p.id, -1)}
                        className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-mono text-xs font-bold w-4 text-center text-white">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(p.id, 1)}
                        className="w-6 h-6 rounded-lg bg-[#C5A059] hover:bg-[#D4B86A] text-stone-950 font-bold flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1 pt-3 border-t border-white/10">
            <label className="text-xs text-white/70 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Customer Handover / Courier Note</span>
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Dunzo driver will arrive at 6:15 PM, include ribbon"
              className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/20 text-xs text-white focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          {/* Summary & Submit */}
          <div className="p-4 rounded-2xl bg-black/40 border border-[#C5A059]/40 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-white/50 block">Total Due</span>
              <span className="font-heading text-2xl font-bold text-[#F3E5AB]">
                ₹{finalTotal.toLocaleString('en-IN')}
              </span>
              {packagingFee > 0 && (
                <span className="text-[10px] text-white/40 block font-mono">Includes ₹49 gift packaging</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={orderItems.length === 0}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-lg ${
                  orderItems.length > 0
                    ? 'bg-gradient-to-r from-[#C5A059] to-[#E3C378] text-stone-950 hover:shadow-xl'
                    : 'bg-white/10 text-white/40 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Log Order Ticket</span>
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
