import { useState, useEffect } from 'react';
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
      `${includeGiftBox ? '🎁 Luxury Gift Box: Yes (+₹49)%0A' : ''}` +
      `📍 Delivery Area: ${deliveryArea}%0A` +
      `💰 Total: ₹${finalTotal}%0A%0A` +
      `Please let me know your payment details and delivery schedule!`;

    return `https://wa.me/919136498467?text=${message}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[80] overflow-hidden">
          {/* Dark Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
          />

          {/* Sliding Panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between"
            >
              {/* Cart Header */}
              <div className="p-6 bg-gradient-to-r from-brand-blue-dark to-brand-blue text-white flex items-center justify-between shadow-md">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🛍️</span>
                  <div>
                    <h2 className="font-heading text-xl font-bold text-white">Your Sukié Box</h2>
                    <p className="text-xs text-white/70 font-mono">
                      {totalItems} {totalItems === 1 ? 'item' : 'items'} selected
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setCartOpen(false)}
                  aria-label="Close cart"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto p-6 divide-y divide-gray-100">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 text-gray-500">
                    <span className="text-6xl mb-4 opacity-50 animate-bounce">🍪</span>
                    <h3 className="font-heading text-xl font-bold text-gray-800">Your box is empty</h3>
                    <p className="text-xs text-gray-500 mt-2 max-w-xs">
                      Our freshly baked NYC-style cookies are ready to be boxed. Explore today&apos;s limited drops!
                    </p>
                    <button
                      onClick={() => setCartOpen(false)}
                      className="mt-6 bg-brand-blue text-white px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-brand-blue-dark transition-colors"
                    >
                      Explore Menu
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="pt-4 first:pt-0 flex items-center gap-4">
                        {/* Thumbnail */}
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient || 'from-amber-900 to-amber-950'} flex items-center justify-center shrink-0 shadow-sm`}>
                          <span className="text-2xl select-none">🍪</span>
                        </div>

                        {/* Title & Price */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-heading text-sm font-bold text-gray-900 truncate">
                            {item.name}
                          </h4>
                          <p className="text-xs text-gray-500 font-mono">
                            ₹{item.price} each • {item.weight}
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 flex items-center justify-center text-xs font-bold transition-colors"
                            >
                              -
                            </button>
                            <span className="text-xs font-bold font-mono px-1">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 flex items-center justify-center text-xs font-bold transition-colors"
                            >
                              +
                            </button>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="ml-3 text-xs text-red-500 hover:text-red-700 transition-colors"
                              title="Remove item"
                            >
                              Remove
                            </button>
                          </div>
                        </div>

                        {/* Subtotal for item */}
                        <div className="text-right">
                          <span className="font-heading text-base font-bold text-brand-blue">
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
                <div className="p-6 bg-stone-50 border-t border-gray-200 space-y-4">
                  {/* Gift Box Toggle */}
                  <label className="flex items-center justify-between p-3 rounded-xl bg-white border border-gray-200 cursor-pointer text-xs">
                    <span className="flex items-center gap-2 text-gray-800 font-medium">
                      <span>🎁</span>
                      <span>Add Luxury Cobalt Gift Ribbon (+₹49)</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={includeGiftBox}
                      onChange={(e) => setIncludeGiftBox(e.target.checked)}
                      className="accent-brand-blue w-4 h-4 cursor-pointer"
                    />
                  </label>

                  {/* Delivery Location Selector */}
                  <div className="flex items-center justify-between text-xs text-gray-600 bg-white p-3 rounded-xl border border-gray-200">
                    <span className="font-medium">📍 Delivery Area:</span>
                    <select
                      value={deliveryArea}
                      onChange={(e) => setDeliveryArea(e.target.value)}
                      className="bg-transparent font-bold text-brand-blue outline-none cursor-pointer"
                    >
                      <option value="Vikhroli">Vikhroli (Direct)</option>
                      <option value="Powai">Powai</option>
                      <option value="Andheri">Andheri</option>
                      <option value="Chandivali">Chandivali</option>
                      <option value="Ghatkopar">Ghatkopar</option>
                      <option value="Navi Mumbai">Navi Mumbai</option>
                    </select>
                  </div>

                  {/* Total Calculations */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Items Subtotal</span>
                      <span className="font-mono">₹{totalPrice}</span>
                    </div>
                    {includeGiftBox && (
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Luxury Gift Packaging</span>
                        <span className="font-mono">₹49</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Mumbai Express Delivery</span>
                      <span className="text-emerald-600 font-medium">Calculated At Dispatch</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-200">
                      <span>Total Amount</span>
                      <span className="font-heading text-2xl text-brand-blue-dark">₹{finalTotal}</span>
                    </div>
                  </div>

                  {/* Dual Action Buttons */}
                  <div className="space-y-2 pt-2">
                    {/* Direct WhatsApp Ordering */}
                    <a
                      href={generateWhatsAppLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
                    >
                      <span>Order Directly on WhatsApp</span>
                      <span>💬</span>
                    </a>

                    {/* Online Gateway Option */}
                    <button
                      onClick={() => setCheckoutModalOpen(true)}
                      className="w-full py-3 px-4 bg-brand-blue hover:bg-brand-blue-dark text-white rounded-full font-bold text-xs uppercase tracking-wider transition-all"
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

      {/* Online Gateway Demo Notification Modal */}
      {checkoutModalOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <span className="text-4xl">💳</span>
            <h3 className="font-heading text-xl font-bold text-gray-900">Razorpay Gateway Ready</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              In the live version with the client&apos;s credentials, this opens the instant Razorpay payment screen supporting GPay, PhonePe, Paytm, UPI, and all Credit/Debit cards.
            </p>
            <div className="p-3 bg-brand-cream rounded-xl text-xs text-brand-dark font-medium">
              Order Total: ₹{finalTotal}
            </div>
            <button
              onClick={() => setCheckoutModalOpen(false)}
              className="w-full bg-brand-blue text-white py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-brand-blue-dark transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
