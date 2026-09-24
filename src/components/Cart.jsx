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
    clearCart,
    setCartOpen,
  } = useCart();

  // Navigation views: 'cart' | 'checkout' | 'confirmation'
  const [view, setView] = useState('cart');
  const [deliveryArea, setDeliveryArea] = useState('Vikhroli');
  const [includeGiftBox, setIncludeGiftBox] = useState(false);

  // Direct Website Checkout form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    landmark: '',
    slot: 'Today Evening (5:00 PM – 8:00 PM)',
    note: '',
    isBulkOrder: false,
    paymentMethod: 'upi', // 'upi' | 'cod' | 'card'
  });
  const [formErrors, setFormErrors] = useState({});
  const [placedOrder, setPlacedOrder] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // On-Site Post-Order Review states
  const [orderRating, setOrderRating] = useState(5);
  const [orderReviewText, setOrderReviewText] = useState('');
  const [orderReviewSubmitted, setOrderReviewSubmitted] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        if (view === 'checkout') {
          setView('cart');
        } else {
          setCartOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, view, setCartOpen]);

  // Handle Mobile Browser Back Gesture (popstate)
  useEffect(() => {
    if (!isOpen) {
      setView('cart');
      return;
    }

    // Push state when cart opens so back gesture doesn't leave the site
    window.history.pushState({ sukieModal: 'cart' }, '');

    const handlePopState = () => {
      setView((currentView) => {
        if (currentView === 'checkout') {
          return 'cart';
        }
        setCartOpen(false);
        return 'cart';
      });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
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

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleGoToCheckout = () => {
    window.history.pushState({ sukieModal: 'checkout' }, '');
    setView('checkout');
  };

  const handleBackToCart = () => {
    setView('cart');
  };

  const handleClose = () => {
    setCartOpen(false);
    setTimeout(() => {
      setView('cart');
    }, 300);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Please enter your full name';
    
    const cleanPhone = formData.phone.replace(/[\s-+]/g, '');
    if (!formData.phone.trim()) {
      errors.phone = 'Please enter your phone number';
    } else if (cleanPhone.length < 10) {
      errors.phone = 'Please enter a valid 10-digit mobile number';
    }

    // Address is ONLY required if customer selected bulk order delivery
    if (formData.isBulkOrder && !formData.address.trim()) {
      errors.address = 'Please enter your delivery address for bulk dispatch';
    }
    return errors;
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    const orderNumber = `SUK-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder = {
      id: orderNumber,
      items: [...items],
      totalItems,
      totalPrice,
      packagingFee,
      finalTotal,
      deliveryArea: 'Vikhroli Atelier (Pickup)',
      customer: { ...formData },
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    };

    setPlacedOrder(newOrder);

    // Save to localStorage for customer reference
    try {
      const prev = JSON.parse(localStorage.getItem('sukie_orders') || '[]');
      localStorage.setItem('sukie_orders', JSON.stringify([newOrder, ...prev]));
    } catch {
      // Storage unavailable, continue
    }

    // Clear cart items
    clearCart();
    setIsSubmitting(false);
    setView('confirmation');
  };

  // WhatsApp Order Confirmation Helper (Optional user-facing copy)
  const generateOrderWhatsAppLink = (order) => {
    if (!order) return 'https://wa.me/919136498467';
    const lines = order.items
      .map((item) => `• ${item.name} (${item.weight}) x${item.quantity} = ₹${item.price * item.quantity}`)
      .join('%0A');

    const paymentMethodText =
      order.customer.paymentMethod === 'upi'
        ? 'Instant UPI Transfer'
        : order.customer.paymentMethod === 'cod'
        ? 'Pay on Collection / Handover'
        : 'Online Cards / NetBanking';

    const msg =
      `Hello Sukié Team! 🍪%0A%0A` +
      `*Order Placed on Website:* #${order.id}%0A` +
      `*Name:* ${order.customer.name}%0A` +
      `*Phone:* ${order.customer.phone}%0A` +
      `*Fulfillment:* Kitchen Pickup (Vikhroli Atelier, Mumbai 400079)%0A` +
      `*Collection Slot:* ${order.customer.slot}%0A` +
      (order.customer.isBulkOrder && order.customer.address
        ? `*Bulk Delivery Address:* ${order.customer.address}%0A`
        : '') +
      (order.customer.note ? `*Courier Note / Instructions:* ${order.customer.note}%0A` : '') +
      `%0A*Items:*%0A${lines}%0A` +
      (order.packagingFee > 0 ? `🎁 Luxury Ribbon Gift Box: Yes (+₹49)%0A` : '') +
      `%0A*Total Amount:* ₹${order.finalTotal}%0A` +
      `*Payment Choice:* ${paymentMethodText}%0A%0A` +
      `Please let me know when ready for collection!`;

    return `https://wa.me/919136498467?text=${msg}`;
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
            onClick={handleClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            aria-hidden="true"
          />

          {/* Sliding Drawer Container */}
          <div className="fixed inset-y-0 right-0 w-full max-w-lg flex pointer-events-auto">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 320 }}
              className="w-full h-full bg-[#FAF6EE] shadow-2xl flex flex-col justify-between overflow-hidden border-l border-[#C5A059]/30"
              style={{ backgroundColor: '#FAF6EE' }}
            >
              {/* ========================================================================= */}
              {/* VIEW 1: CART VIEW                                                        */}
              {/* ========================================================================= */}
              {view === 'cart' && (
                <>
                  {/* Cart Header */}
                  <div className="p-4 sm:p-5 bg-[#0C419C] text-white flex items-center justify-between shadow-md border-b border-[#C5A059]/30 shrink-0">
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
                      onClick={handleClose}
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
                          onClick={handleClose}
                          className="mt-6 bg-[#0C419C] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#1B3A8C] border border-[#C5A059]/40 transition-colors shadow-md cursor-pointer"
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
                                    e.target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-[#0C419C] text-xl text-white">🍪</div>`;
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
                              <span className="font-heading text-base font-bold text-[#0C419C]">
                                ₹{item.price * item.quantity}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Cart Footer / Checkout CTA */}
                  {items.length > 0 && (
                    <div className="p-4 sm:p-5 bg-white border-t border-stone-200 space-y-3.5 shadow-[0_-10px_30px_rgba(0,0,0,0.04)] shrink-0">
                      {/* Luxury Gift Packaging Option */}
                      <label className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200 cursor-pointer hover:border-[#C5A059]/60 transition-colors">
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          <span className="text-base shrink-0">🎁</span>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-stone-900 truncate">
                              Signature Cobalt Ribbon & Keepsake Box
                            </p>
                            <p className="text-[10px] text-stone-500">
                              Embossed card, luxury box & wax seal (+₹49)
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

                      {/* Collection Hub */}
                      <div className="flex items-center justify-between text-xs bg-stone-50 p-3 rounded-xl border border-stone-200">
                        <div className="flex items-center gap-1.5 text-stone-600 font-medium">
                          <span>📍</span>
                          <span>Fulfillment Hub:</span>
                        </div>
                        <span className="font-bold text-[#0C419C] text-xs">
                          Vikhroli Atelier (Pickups Only)
                        </span>
                      </div>

                      {/* Calculations Breakdown */}
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
                          <span>Order Fulfillment</span>
                          <span className="text-emerald-700 font-semibold font-mono">Kitchen Pickup (Free)</span>
                        </div>
                        <div className="flex justify-between items-baseline pt-2 border-t border-stone-200">
                          <span className="font-heading text-base font-bold text-stone-900">Total Amount</span>
                          <span className="font-heading text-2xl font-bold text-[#0C419C]">
                            ₹{finalTotal}
                          </span>
                        </div>
                      </div>

                      {/* Primary Direct Website Checkout Button */}
                      <div className="space-y-2 pt-1">
                        <button
                          type="button"
                          onClick={handleGoToCheckout}
                          className="w-full py-3.5 px-4 bg-[#0C419C] hover:bg-[#1B3A8C] text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-950/20 active:scale-[0.99] transition-all cursor-pointer border border-[#C5A059]/40"
                        >
                          <span>Proceed to Checkout</span>
                          <span className="text-base">→</span>
                        </button>

                        {/* Subtle WhatsApp Support Link at Bottom */}
                        <div className="text-center pt-1">
                          <a
                            href="https://wa.me/919136498467?text=Hello%20Suki%C3%A9%20Team!%20%F0%9F%8D%AA%20I%20have%20a%20question%20regarding%20flavours%20or%20bulk%20gifting."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-stone-500 hover:text-emerald-700 transition-colors inline-flex items-center gap-1 font-medium"
                          >
                            <span>Questions or custom gifting?</span>
                            <span className="underline font-semibold text-emerald-800">Chat with Chef on WhatsApp 💬</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* ========================================================================= */}
              {/* VIEW 2: DIRECT WEBSITE CHECKOUT FORM                                      */}
              {/* ========================================================================= */}
              {view === 'checkout' && (
                <>
                  {/* Checkout Header with Back Button */}
                  <div className="p-4 sm:p-5 bg-gradient-to-r from-[#071636] via-[#0C419C] to-[#071636] text-white flex items-center justify-between shadow-md border-b border-[#C5A059]/40 shrink-0">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={handleBackToCart}
                        aria-label="Back to box"
                        className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-amber-200 flex items-center justify-center text-sm font-bold transition-all cursor-pointer active:scale-95 border border-white/10"
                      >
                        ←
                      </button>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#C5A059] font-bold">
                            Atelier Pre-Order
                          </span>
                          <span className="w-1 h-1 rounded-full bg-amber-300"></span>
                          <span className="text-[9px] font-mono text-white/60">Step 2 of 2</span>
                        </div>
                        <h2 className="font-heading text-lg sm:text-xl font-bold text-white tracking-wide leading-tight">
                          Dispatch & Payment
                        </h2>
                      </div>
                    </div>

                    <button
                      onClick={handleClose}
                      aria-label="Close modal"
                      className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-semibold transition-colors cursor-pointer border border-white/10"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Form Container */}
                  <form onSubmit={handlePlaceOrder} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                    {/* Bespoke Kitchen Pass / Order Ticket */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-[#FFFDF9] via-white to-[#F9F5EC] border border-[#C5A059]/50 shadow-[0_4px_20px_rgba(197,160,89,0.12)] relative overflow-hidden">
                      <div className="flex items-start justify-between gap-3 relative z-10">
                        <div>
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0C419C]/10 text-[#0C419C] text-[10px] font-mono uppercase tracking-wider font-bold mb-1.5 border border-[#0C419C]/20">
                            <span>✦</span>
                            <span>{totalItems} {totalItems === 1 ? 'Cookie' : 'NYC Cookies'} in Box</span>
                          </span>
                          <p className="text-xs font-semibold text-stone-900 leading-snug">
                            {includeGiftBox ? '🎁 Luxury Keepsake Box & Wax Seal Ribbon' : 'Standard Artisan Bakery Box'}
                          </p>
                          <p className="text-[11px] text-stone-500 mt-0.5">
                            Fulfillment: <strong className="text-stone-800">Kitchen Pickup (Vikhroli, Mumbai 400079)</strong>
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-[9px] font-mono uppercase tracking-widest text-stone-400 block font-semibold">
                            Total Due
                          </span>
                          <span className="font-heading text-2xl font-bold text-[#0C419C] tracking-tight block">
                            ₹{finalTotal.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Section 1: Customer Contact */}
                    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-3.5">
                      <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
                        <span className="w-5 h-5 rounded-full bg-[#0C419C] text-white flex items-center justify-center text-[10px] font-bold font-mono shadow-xs">
                          1
                        </span>
                        <div>
                          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 leading-none">
                            Contact Information
                          </h3>
                          <span className="text-[10px] text-stone-500 font-mono">For pickup readiness notification</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="e.g. Ananya Sharma"
                          className={`w-full px-3.5 py-2.5 text-xs rounded-xl border bg-stone-50/60 focus:bg-white focus:outline-none transition-all ${
                            formErrors.name ? 'border-red-500 bg-red-50/30' : 'border-stone-200 focus:border-[#0C419C] focus:ring-2 focus:ring-[#0C419C]/10'
                          }`}
                        />
                        {formErrors.name && (
                          <p className="text-[10px] text-red-600 mt-1 font-medium">{formErrors.name}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                          Mobile / WhatsApp Number <span className="text-red-500">*</span>
                        </label>
                        <div className="relative flex items-center">
                          <span className="absolute left-3 text-xs text-stone-500 font-mono font-medium flex items-center gap-1.5">
                            <span>🇮🇳</span> +91
                          </span>
                          <span className="absolute left-16 h-4 w-[1px] bg-stone-200" />
                          <input
                            type="tel"
                            maxLength={10}
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value.replace(/\D/g, ''))}
                            placeholder="98765 43210"
                            className={`w-full pl-20 pr-3.5 py-2.5 text-xs rounded-xl border bg-stone-50/60 focus:bg-white focus:outline-none font-mono transition-all tracking-wider ${
                              formErrors.phone ? 'border-red-500 bg-red-50/30' : 'border-stone-200 focus:border-[#0C419C] focus:ring-2 focus:ring-[#0C419C]/10'
                            }`}
                          />
                        </div>
                        {formErrors.phone && (
                          <p className="text-[10px] text-red-600 mt-1 font-medium">{formErrors.phone}</p>
                        )}
                      </div>
                    </div>

                    {/* Section 2: Collection Schedule & Courier Terms (Pickups Only) */}
                    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-3.5">
                      <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
                        <span className="w-5 h-5 rounded-full bg-[#0C419C] text-white flex items-center justify-center text-[10px] font-bold font-mono shadow-xs">
                          2
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 leading-none">
                              Atelier Collection
                            </h3>
                            <span className="bg-[#C5A059]/20 text-[#7A5B18] text-[9px] font-bold px-2 py-0.5 rounded-full font-mono uppercase">
                              Pickups Only
                            </span>
                          </div>
                          <span className="text-[10px] text-stone-500 font-mono">Kitchen: Vikhroli, Mumbai 400079</span>
                        </div>
                      </div>

                      {/* Mandatory Third-Party Courier Clause & Bulk Note */}
                      <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-200 text-stone-800 space-y-2 text-xs">
                        <p className="text-[11px] text-stone-800 leading-relaxed">
                          <strong>Third-party courier collections:</strong> Once an order has been collected by a courier arranged by the customer, transit and handling are the responsibility of the courier service.
                        </p>
                        <div className="pt-2 border-t border-amber-200/70 text-[10px] font-semibold text-amber-950 flex items-center gap-1.5">
                          <span>✦</span>
                          <span>Delivery can only be provided for bulk orders</span>
                        </div>
                      </div>

                      {/* Collection Slot Choice Pills */}
                      <div>
                        <label className="block text-[11px] font-semibold text-stone-700 mb-1.5">
                          Select Pickup Slot <span className="text-stone-400 font-normal">(Baked Fresh for Collection)</span>
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {[
                            'Today Evening (5:00 PM – 8:00 PM)',
                            'Tomorrow Morning (11:00 AM – 2:00 PM)',
                            'Tomorrow Evening (5:00 PM – 8:00 PM)',
                            'Upcoming Weekend Batch',
                          ].map((slotOption) => {
                            const isSelected = formData.slot === slotOption;
                            return (
                              <button
                                key={slotOption}
                                type="button"
                                onClick={() => handleInputChange('slot', slotOption)}
                                className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-center justify-between ${
                                  isSelected
                                    ? 'border-[#0C419C] bg-[#0C419C]/10 text-[#0C419C] font-bold shadow-xs'
                                    : 'border-stone-200 bg-stone-50/80 hover:bg-stone-100 text-stone-700'
                                }`}
                              >
                                <span className="text-[11px] leading-tight">{slotOption}</span>
                                {isSelected && <span className="text-xs">✓</span>}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Courier / Kitchen Note */}
                      <div>
                        <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                          Courier / Collection Note <span className="text-stone-400 font-normal">(Optional)</span>
                        </label>
                        <textarea
                          rows={2}
                          value={formData.note}
                          onChange={(e) => handleInputChange('note', e.target.value)}
                          placeholder="e.g. 'Arranging WeFast / Dunzo at 6:30 PM' or 'Happy Birthday note on box'"
                          className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white focus:border-[#0C419C] focus:outline-none leading-relaxed"
                        />
                      </div>

                      {/* Bulk Order Delivery Option */}
                      <div className="pt-2 border-t border-stone-100">
                        <label className="flex items-start gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.isBulkOrder || false}
                            onChange={(e) => handleInputChange('isBulkOrder', e.target.checked)}
                            className="accent-[#0C419C] w-4 h-4 mt-0.5 cursor-pointer"
                          />
                          <div className="text-xs">
                            <span className="font-semibold text-stone-800 block">
                              This is a Bulk / Celebration Order (20+ cookies)
                            </span>
                            <span className="text-[10px] text-stone-500 block leading-tight">
                              Dedicated delivery can be provided across Mumbai for bulk orders.
                            </span>
                          </div>
                        </label>

                        {formData.isBulkOrder && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-3 space-y-2 pt-2 border-t border-stone-100"
                          >
                            <label className="block text-[11px] font-semibold text-stone-700">
                              Bulk Delivery Address <span className="text-red-500">*</span>
                            </label>
                            <textarea
                              rows={2}
                              value={formData.address}
                              onChange={(e) => handleInputChange('address', e.target.value)}
                              placeholder="Enter full delivery address for bulk courier..."
                              className={`w-full px-3.5 py-2 text-xs rounded-xl border bg-stone-50/60 focus:bg-white focus:outline-none ${
                                formErrors.address ? 'border-red-500 bg-red-50/30' : 'border-stone-200 focus:border-[#0C419C]'
                              }`}
                            />
                            {formErrors.address && (
                              <p className="text-[10px] text-red-600 font-medium">{formErrors.address}</p>
                            )}
                          </motion.div>
                        )}
                      </div>
                    </div>

                    {/* Section 3: Payment Method Selection */}
                    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-3">
                      <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
                        <span className="w-5 h-5 rounded-full bg-[#0C419C] text-white flex items-center justify-center text-[10px] font-bold font-mono shadow-xs">
                          3
                        </span>
                        <div>
                          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 leading-none">
                            Payment Method
                          </h3>
                          <span className="text-[10px] text-stone-500 font-mono">Select your convenient payment mode</span>
                        </div>
                      </div>

                      {/* Option 1: Instant UPI */}
                      <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                        formData.paymentMethod === 'upi'
                          ? 'border-[#0C419C] bg-[#0C419C]/5 shadow-xs ring-1 ring-[#0C419C]/30'
                          : 'border-stone-200 bg-stone-50/70 hover:border-stone-300'
                      }`}>
                        <input
                          type="radio"
                          name="payment"
                          value="upi"
                          checked={formData.paymentMethod === 'upi'}
                          onChange={() => handleInputChange('paymentMethod', 'upi')}
                          className="mt-0.5 accent-[#0C419C]"
                        />
                        <div className="flex-1 text-xs">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-stone-900 block">Instant UPI (GPay / PhonePe / Paytm / QR)</span>
                            <span className="bg-emerald-100 text-emerald-800 text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0">
                              Instant
                            </span>
                          </div>
                          <span className="text-[11px] text-stone-600 block mt-1 leading-relaxed">
                            Pay directly to Atelier UPI: <strong className="font-mono text-[#0C419C] select-all">sukiecookies@upi</strong>
                          </span>
                        </div>
                      </label>

                      {/* Option 2: Pay on Handover / Delivery */}
                      <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                        formData.paymentMethod === 'cod'
                          ? 'border-[#0C419C] bg-[#0C419C]/5 shadow-xs ring-1 ring-[#0C419C]/30'
                          : 'border-stone-200 bg-stone-50/70 hover:border-stone-300'
                      }`}>
                        <input
                          type="radio"
                          name="payment"
                          value="cod"
                          checked={formData.paymentMethod === 'cod'}
                          onChange={() => handleInputChange('paymentMethod', 'cod')}
                          className="mt-0.5 accent-[#0C419C]"
                        />
                        <div className="flex-1 text-xs">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-stone-900 block">Pay on Delivery / Handover</span>
                            <span className="bg-stone-200 text-stone-700 text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0">
                              Doorstep
                            </span>
                          </div>
                          <span className="text-[11px] text-stone-600 block mt-1 leading-relaxed">
                            UPI QR scan or Cash upon receiving your freshly boxed batch
                          </span>
                        </div>
                      </label>

                      {/* Option 3: Online Gateway Cards / NetBanking */}
                      <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                        formData.paymentMethod === 'card'
                          ? 'border-[#0C419C] bg-[#0C419C]/5 shadow-xs ring-1 ring-[#0C419C]/30'
                          : 'border-stone-200 bg-stone-50/70 hover:border-stone-300'
                      }`}>
                        <input
                          type="radio"
                          name="payment"
                          value="card"
                          checked={formData.paymentMethod === 'card'}
                          onChange={() => handleInputChange('paymentMethod', 'card')}
                          className="mt-0.5 accent-[#0C419C]"
                        />
                        <div className="flex-1 text-xs">
                          <span className="font-bold text-stone-900 block">Credit / Debit Card / NetBanking</span>
                          <span className="text-[11px] text-stone-600 block mt-1 leading-relaxed">
                            Secured 256-bit payment gateway
                          </span>
                        </div>
                      </label>
                    </div>

                    {/* Action Button & Reassurance */}
                    <div className="pt-2 pb-6 space-y-2.5">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 px-5 bg-gradient-to-r from-[#0C419C] via-[#1550B8] to-[#0C419C] hover:brightness-110 text-white rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-blue-950/25 active:scale-[0.99] transition-all cursor-pointer border border-[#C5A059]/40"
                      >
                        {isSubmitting ? (
                          <span>Placing Order...</span>
                        ) : (
                          <>
                            <span>Confirm & Place Order (₹{finalTotal.toLocaleString('en-IN')})</span>
                            <span className="text-amber-200">🔒</span>
                          </>
                        )}
                      </button>
                      <p className="text-center text-[10px] text-stone-500 font-mono flex items-center justify-center gap-1.5">
                        <span>✦</span>
                        <span>100% Artisanal Quality Commitment • Fresh Mumbai Kitchen Drops</span>
                      </p>
                    </div>
                  </form>
                </>
              )}

              {/* ========================================================================= */}
              {/* VIEW 3: ORDER CONFIRMATION SCREEN                                         */}
              {/* ========================================================================= */}
              {view === 'confirmation' && placedOrder && (
                <div className="flex-1 flex flex-col justify-between overflow-y-auto">
                  {/* Top Success Header */}
                  <div className="p-6 sm:p-8 bg-[#0C419C] text-white text-center shadow-md border-b border-[#C5A059]/30 shrink-0">
                    <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-3xl mb-3 shadow-lg">
                      ✨
                    </div>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-[#C5A059] block font-bold">
                      Order Confirmed
                    </span>
                    <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mt-1">
                      Thank You, {placedOrder.customer.name.split(' ')[0]}!
                    </h2>
                    <p className="text-xs text-amber-200/90 font-mono mt-1">
                      Order ID: <span className="font-bold underline">{placedOrder.id}</span>
                    </p>
                  </div>

                  {/* Order Receipt Body */}
                  <div className="p-4 sm:p-6 space-y-4 flex-1">
                    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-sm space-y-3.5">
                      <div className="flex justify-between items-center pb-3 border-b border-stone-200/70 text-xs">
                        <span className="text-stone-500 font-medium">Order Status</span>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          Ovens Preparing
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs text-stone-600">
                        <div className="flex justify-between">
                          <span className="text-stone-500">Fulfillment:</span>
                          <span className="font-semibold text-stone-900">Kitchen Pickup (Vikhroli Atelier)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-500">Collection Slot:</span>
                          <span className="font-semibold text-stone-900">{placedOrder.customer.slot}</span>
                        </div>
                        {placedOrder.customer.isBulkOrder && placedOrder.customer.address && (
                          <div className="flex justify-between">
                            <span className="text-stone-500">Bulk Delivery:</span>
                            <span className="font-semibold text-stone-900 text-right max-w-[65%] truncate">
                              {placedOrder.customer.address}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-stone-500">Payment:</span>
                          <span className="font-semibold text-[#0C419C]">
                            {placedOrder.customer.paymentMethod === 'upi'
                              ? 'Instant UPI'
                              : placedOrder.customer.paymentMethod === 'cod'
                              ? 'Pay on Collection / Handover'
                              : 'Online Payment'}
                          </span>
                        </div>
                      </div>

                      {/* Items List */}
                      <div className="pt-3 border-t border-stone-200/70 space-y-2">
                        <span className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block">
                          Bakes Included:
                        </span>
                        {placedOrder.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-xs text-stone-800">
                            <span>
                              {item.name} <span className="text-stone-400 font-mono">x{item.quantity}</span>
                            </span>
                            <span className="font-mono font-medium">₹{item.price * item.quantity}</span>
                          </div>
                        ))}

                        {placedOrder.packagingFee > 0 && (
                          <div className="flex justify-between text-xs text-[#C5A059]">
                            <span>🎁 Luxury Cobalt Gift Ribbon & Box</span>
                            <span className="font-mono font-medium">₹49</span>
                          </div>
                        )}

                        <div className="flex justify-between items-baseline pt-2 border-t border-stone-200 text-stone-900 font-bold">
                          <span className="font-heading text-sm">Total Paid / Due</span>
                          <span className="font-heading text-xl text-[#0C419C]">
                            ₹{placedOrder.finalTotal}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Third-Party Courier Notice */}
                    <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-[11px] text-stone-700 leading-relaxed">
                      <strong>Third-party courier collections:</strong> Once an order has been collected by a courier arranged by the customer, transit and handling are the responsibility of the courier service.
                    </div>

                    {/* ORDER CARE */}
                    <div className="bg-[#FAF6EE] rounded-2xl p-4 border border-[#C5A059]/40 space-y-2 text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-stone-900 font-heading font-bold text-xs uppercase tracking-wider">
                          ORDER CARE
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-[#C5A059]/20 text-[#7A5B18] text-[9px] font-mono font-bold">
                          ✦ QUALITY
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-700 leading-relaxed font-light">
                        Every order is freshly prepared, carefully checked and thoughtfully packed before it leaves our kitchen.
                      </p>
                      <a
                        href={`https://wa.me/919136498467?text=Hello%20Suki%C3%A9%20Care!%20%F0%9F%8D%AA%20I%20have%20a%20question%20regarding%20Order%20%23${placedOrder.id}.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0C419C] hover:underline pt-0.5"
                      >
                        <span>Need a Hand? Contact Us on WhatsApp</span>
                        <span>→</span>
                      </a>
                    </div>

                    {/* Post-Order Interactive Review Form (On-Site) */}
                    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-sm text-left space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-heading text-xs font-bold uppercase tracking-wider text-stone-900">
                          Rate Your Sukié Experience
                        </span>
                        <span className="text-[10px] text-amber-600 font-mono">On-Site Review</span>
                      </div>

                      {orderReviewSubmitted ? (
                        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
                          <span className="text-emerald-700 text-xs font-bold block">
                            ✓ Thank You for Your Tasting Notes!
                          </span>
                          <span className="text-[10px] text-stone-500 font-light block">
                            Your review has been saved to the atelier records.
                          </span>
                        </div>
                      ) : (
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] text-stone-600 font-medium">Your Rating:</span>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setOrderRating(star)}
                                  className="text-lg transition-transform hover:scale-110 cursor-pointer p-0.5"
                                  aria-label={`${star} star rating`}
                                >
                                  <span className={star <= orderRating ? 'text-amber-400' : 'text-stone-300'}>
                                    ★
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>

                          <textarea
                            rows={2}
                            value={orderReviewText}
                            onChange={(e) => setOrderReviewText(e.target.value)}
                            placeholder="Leave any tasting notes or thoughts for our Chef..."
                            className="w-full p-2.5 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:border-[#0C419C] focus:outline-none resize-none leading-relaxed"
                          />

                          <button
                            type="button"
                            onClick={() => {
                              if (orderReviewText.trim() || orderRating) {
                                setOrderReviewSubmitted(true);
                              }
                            }}
                            className="w-full py-2 bg-[#C5A059] hover:bg-[#D4B86A] text-stone-950 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
                          >
                            Submit Review
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Notification message */}
                    <p className="text-center text-xs text-stone-500 leading-relaxed px-2">
                      Our pastry team has received your order. We will bake your 6oz cookies fresh before your selected slot.
                    </p>
                  </div>

                  {/* Actions Footer */}
                  <div className="p-4 sm:p-6 bg-white border-t border-stone-200 space-y-2.5 shrink-0">
                    {/* Optional Send to WhatsApp */}
                    <a
                      href={generateOrderWhatsAppLink(placedOrder)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.99] transition-all cursor-pointer"
                    >
                      <span>Send Order Copy to WhatsApp</span>
                      <span className="text-base">💬</span>
                    </a>

                    {/* Return to Menu Button */}
                    <button
                      type="button"
                      onClick={handleClose}
                      className="w-full py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Return to Menu
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );

  // Mount directly via portal to document body
  if (typeof document === 'undefined') return null;
  return createPortal(cartContent, document.body);
}
