import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const {
    items,
    isOpen,
    totalItems,
    totalPrice,
    updateQuantity,
    removeItem,
    setCartOpen,
  } = useCart();

  const [deliveryArea, setDeliveryArea] = useState('Powai');
  const [includeGiftBox, setIncludeGiftBox] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setCartOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, setCartOpen]);

  // Lock body scroll when cart is open
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

  const packagingFee = includeGiftBox ? 49 : 0;
  const finalTotal = totalPrice + packagingFee;

  // Generate WhatsApp Order Link
  const generateWhatsAppLink = () => {
    const orderLines = items
      .map((item) => `• ${item.name} (${item.weight}) x${item.quantity} = ₹${item.price * item.quantity}`)
      .join('%0A');

    const message = `Hello Sukié Team! 🍪%0A%0AI would like to place an order:%0A${orderLines}%0A%0A` +
      `${includeGiftBox ? '🎁 Luxury Cobalt Gift Box: Yes (+₹49)%0A' : ''}` +
      `📍 Delivery Area: ${deliveryArea}%0A` +
      `💰 Total: ₹${finalTotal}%0A%0A` +
      `Please let me know your payment details and delivery schedule!`;

    return `https://wa.me/919136498467?text=${message}`;
  };

  const cartContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] overflow-hidden">
          {/* Dark Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            aria-hidden="true"
          />

          {/* Sliding Panel - Clean container without pl-10 to prevent mobile overflow */}
          <div className="fixed inset-y-0 right-0 w-full max-w-md flex pointer-events-auto">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 320 }}
              className="w-full h-full bg-[#FAF6EE] shadow-2xl flex flex-col justify-between overflow-hidden border-l border-[#C5A059]/30"
              style={{ backgroundColor: '#FAF6EE' }}
            >
              {/* Cart Header */}
              <div className="p-4 sm:p-5 bg-[#0F2460] text-white flex items-center justify-between shadow-md border-b border-[#C5A059]/30 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center text-lg shadow-inner">
                    🛍️
                  </div>
                  <div>
                    <h2 className="font-heading text-lg sm:text-xl font-bold text-white tracking-wide">
                      Your Sukié Box
                    </h2>
                    <p className="text-xs text-amber-200/80 font-mono">
                      {totalItems} {totalItems === 1 ? 'artisan bake' : 'artisan bakes'} selected
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setCartOpen(false)}
                  aria-label="Close cart"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-semibold transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
                {items.length === 0 ? (
                  <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-6 text-stone-500">
                    <span className="text-5xl sm:text-6xl mb-3 animate-bounce select-none">🍪</span>
                    <h3 className="font-heading text-xl font-bold text-stone-800">Your box is empty</h3>
                    <p className="text-xs text-stone-500 mt-2 max-w-xs leading-relaxed">
                      Our freshly baked 6oz NYC-style cookies are ready to be boxed. Explore today&apos;s limited drops!
                    </p>
                    <button
                      onClick={() => setCartOpen(false)}
                      className="mt-6 bg-[#0F2460] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#1B3A8C] border border-[#C5A059]/40 transition-colors shadow-md cursor-pointer"
                    >
                      Explore Menu
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 bg-white rounded-2xl border border-stone-200 shadow-xs flex items-center gap-3 hover:border-[#C5A059]/50 transition-colors"
                      >
                        {/* Real Cookie Photography Thumbnail */}
                        <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-[#C5A059]/30 bg-stone-900 shadow-xs">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              if (e.target.parentElement) {
                                e.target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-[#0F2460] text-xl text-white">🍪</div>`;
                              }
                            }}
                          />
                        </div>

                        {/* Title, Weight & Quantity Controls */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-heading text-sm font-bold text-stone-900 truncate leading-snug">
                            {item.name}
                          </h4>
                          <p className="text-[11px] text-stone-500 font-mono mt-0.5">
                            ₹{item.price} each • {item.weight}
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 mt-2">
                            <div className="inline-flex items-center rounded-lg border border-stone-200 bg-stone-50 shadow-xs">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-7 h-7 rounded-l-lg hover:bg-stone-200 text-stone-700 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
                                aria-label="Decrease quantity"
                              >
                                −
                              </button>
                              <span className="text-xs font-bold font-mono px-2 text-stone-900">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-7 h-7 rounded-r-lg hover:bg-stone-200 text-stone-700 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-[11px] text-stone-400 hover:text-red-600 font-medium ml-2 transition-colors cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        </div>

                        {/* Subtotal for item */}
                        <div className="text-right shrink-0 pr-1">
                          <span className="font-heading text-base font-bold text-[#0F2460]">
                            ₹{item.price * item.quantity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cart Footer / Checkout Options */}
              {items.length > 0 && (
                <div className="p-4 sm:p-5 bg-white border-t border-stone-200 space-y-3.5 shadow-[0_-10px_30px_rgba(0,0,0,0.04)] shrink-0">
                  {/* Luxury Gift Packaging Option */}
                  <label className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200 cursor-pointer hover:border-[#C5A059]/60 transition-colors">
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <span className="text-base shrink-0">🎁</span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-stone-900 truncate">
                          Signature Cobalt Gift Ribbon
                        </p>
                        <p className="text-[10px] text-stone-500">
                          Includes luxury box & wax seal (+₹49)
                        </p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={includeGiftBox}
                      onChange={(e) => setIncludeGiftBox(e.target.checked)}
                      className="accent-[#0F2460] w-4 h-4 cursor-pointer shrink-0"
                    />
                  </label>

                  {/* Delivery Location Selector */}
                  <div className="flex items-center justify-between text-xs bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <div className="flex items-center gap-1.5 text-stone-600 font-medium">
                      <span>📍</span>
                      <span>Delivery Area:</span>
                    </div>
                    <select
                      value={deliveryArea}
                      onChange={(e) => setDeliveryArea(e.target.value)}
                      className="bg-white border border-stone-200 rounded-lg px-2.5 py-1 text-xs font-bold text-[#0F2460] outline-none cursor-pointer focus:border-[#C5A059]"
                    >
                      <option value="Vikhroli">Vikhroli (Local Hub)</option>
                      <option value="Powai">Powai</option>
                      <option value="Andheri">Andheri</option>
                      <option value="Chandivali">Chandivali</option>
                      <option value="Ghatkopar">Ghatkopar</option>
                      <option value="Bandra / BKC">Bandra / BKC</option>
                      <option value="Navi Mumbai">Navi Mumbai</option>
                      <option value="Other Mumbai">Other Mumbai</option>
                    </select>
                  </div>

                  {/* Price Calculations */}
                  <div className="space-y-1.5 pt-1 text-xs">
                    <div className="flex justify-between text-stone-600">
                      <span>Cookies Subtotal</span>
                      <span className="font-mono font-medium text-stone-900">₹{totalPrice}</span>
                    </div>
                    {includeGiftBox && (
                      <div className="flex justify-between text-stone-600">
                        <span>Luxury Gift Packaging</span>
                        <span className="font-mono font-medium text-[#C5A059]">₹49</span>
                      </div>
                    )}
                    <div className="flex justify-between text-stone-500 text-[11px]">
                      <span>Mumbai Express Delivery</span>
                      <span className="text-emerald-700 font-semibold">Calculated at Dispatch</span>
                    </div>
                    <div className="flex justify-between items-baseline pt-2 border-t border-stone-200">
                      <span className="font-heading text-base font-bold text-stone-900">Total Amount</span>
                      <span className="font-heading text-2xl font-bold text-[#0F2460]">
                        ₹{finalTotal}
                      </span>
                    </div>
                  </div>

                  {/* Dual Action Buttons */}
                  <div className="space-y-2 pt-1">
                    {/* Direct WhatsApp Ordering */}
                    <a
                      href={generateWhatsAppLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.99] transition-all cursor-pointer"
                    >
                      <span>Order Directly on WhatsApp</span>
                      <span className="text-base">💬</span>
                    </a>

                    {/* Online Gateway Option */}
                    <button
                      onClick={() => setCheckoutModalOpen(true)}
                      className="w-full py-3 px-4 bg-[#0F2460] hover:bg-[#1B3A8C] text-white rounded-xl font-bold text-xs uppercase tracking-wider border border-[#C5A059]/40 active:scale-[0.99] transition-all cursor-pointer"
                    >
                      Pay Online (UPI / Cards / NetBanking)
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}

      {/* Online Gateway Demo Modal */}
      {checkoutModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-4 shadow-2xl border border-[#C5A059]/30">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#0F2460]/10 text-[#0F2460] flex items-center justify-center text-2xl">
              💳
            </div>
            <h3 className="font-heading text-xl font-bold text-stone-900">Razorpay Payment Ready</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              When integrated with the live client account, this triggers the direct Razorpay checkout popup supporting GPay, PhonePe, Paytm, UPI, and all Credit/Debit cards.
            </p>
            <div className="p-3 bg-stone-100 rounded-xl text-xs text-stone-900 font-medium">
              Order Total: <strong className="text-[#0F2460]">₹{finalTotal}</strong>
            </div>
            <button
              onClick={() => setCheckoutModalOpen(false)}
              className="w-full bg-[#0F2460] text-white py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#1B3A8C] transition-colors cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </AnimatePresence>
  );

  // Use createPortal to mount directly on document.body, avoiding any stacking context bugs
  if (typeof document === 'undefined') return null;
  return createPortal(cartContent, document.body);
}
