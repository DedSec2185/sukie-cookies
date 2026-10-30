import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useMenu } from '../context/MenuContext';

export default function Navbar({ activeView = 'menu', onViewChange, onOpenTrack }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { items, totalItems, totalPrice, toggleCart } = useCart();
  const { storeConfig } = useMenu();
  const brandLogo = storeConfig?.logoUrl || '/images/logo.png';
  const brandTitle = storeConfig?.brandName || 'Sukié';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: 'Drops', view: 'menu', href: '#menu' },
    { name: 'Atelier Story', view: 'story', href: '#story' },
    { name: 'Warming & Tasting', view: 'ritual', href: '#ritual' },
    { name: 'Care & Reviews', view: 'care', href: '#care' },
  ];

  const handleLinkClick = (e, link) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    if (onViewChange) {
      onViewChange(link.view);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (link.href === '#home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const targetElement = document.querySelector(link.href);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.hash = link.href;
      }
    }
  };

  return (
    <>
      <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out ${
        isScrolled
          ? 'bg-[#07132B]/95 backdrop-blur-xl border-b border-[#C5A059]/25 shadow-[0_10px_30px_rgba(3,8,22,0.6)] py-3'
          : 'bg-gradient-to-b from-[#07132B]/90 via-[#07132B]/40 to-transparent py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Left: Brand Logo & Name */}
          <a
            href="#home"
            onClick={(e) => handleLinkClick(e, { view: 'menu', href: '#home' })}
            className="flex items-center space-x-3 group cursor-pointer focus:outline-none"
            aria-label="Sukié Cookies Home"
          >
            <img
              src={brandLogo}
              alt={`${brandTitle} Logo`}
              className="h-11 sm:h-12 w-11 sm:w-12 rounded-full object-cover shadow-sm ring-2 ring-brand-gold/60 group-hover:scale-105 transition-transform duration-300"
            />
            <div className="flex flex-col">
              <span
                className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-white group-hover:text-[#F3E5AB] transition-colors duration-300"
              >
                {brandTitle}
              </span>
            </div>
          </a>

          {/* Right: Desktop Navigation Links & Cart Button */}
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex items-center space-x-2" aria-label="Main Navigation">
              {navLinks.map((link) => {
                const isActive = activeView === link.view;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link)}
                    className={`text-xs font-semibold tracking-wider uppercase transition-colors duration-200 relative group py-1.5 px-3.5 rounded-full cursor-pointer ${
                      isActive
                        ? 'text-stone-950 font-bold'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="navbarActivePill"
                        className="absolute inset-0 rounded-full shadow-sm -z-10 bg-[#C5A059]"
                        transition={{ type: 'spring', damping: 22, stiffness: 280 }}
                      />
                    )}
                    {link.name}
                  </a>
                );
              })}
            </nav>

            {/* Track Order Button */}
            <button
              type="button"
              onClick={onOpenTrack}
              className="text-[11px] font-mono uppercase tracking-wider text-[#F3E5AB]/90 hover:text-white px-3 py-1.5 rounded-full border border-[#C5A059]/40 hover:border-[#C5A059] bg-[#C5A059]/10 hover:bg-[#C5A059]/20 transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
              title="Track your order status"
            >
              <span>📦</span>
              <span>Track Order</span>
            </button>

            {/* Desktop Cart Icon with Luxury Hover Popover */}
            <div className="relative group">
              <button
                type="button"
                onClick={toggleCart}
                aria-label={`Shopping bag with ${totalItems} items`}
                className="relative p-2.5 rounded-full transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C5A059] group-hover:scale-105 active:scale-95 text-white hover:bg-white/10 hover:text-[#F3E5AB]"
              >
                <svg
                  className="w-6 h-6 transition-transform duration-300 group-hover:-rotate-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#C5A059] text-stone-950 font-bold text-xs rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center shadow-md ring-2 ring-white/80 animate-pulse-glow">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Luxury Hover Preview Popover on Desktop */}
              <div className="absolute right-0 top-full pt-3 hidden lg:block opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50">
                <div className="w-80 rounded-2xl bg-[#0B1020] text-white p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-[#C5A059]/40 backdrop-blur-xl">
                  <div className="flex items-center justify-between pb-3 border-b border-[#C5A059]/20">
                    <span className="font-heading text-sm font-bold text-white flex items-center gap-1.5">
                      <span>🛍️</span>
                      <span>Sukié Artisan Box</span>
                    </span>
                    <span className="text-[11px] font-mono text-amber-200/90 bg-[#C5A059]/20 px-2 py-0.5 rounded-full border border-[#C5A059]/30">
                      {totalItems} {totalItems === 1 ? 'item' : 'items'}
                    </span>
                  </div>

                  {items.length === 0 ? (
                    <div className="py-5 text-center text-stone-400">
                      <p className="text-xs">Your box is currently empty</p>
                      <p className="text-[10px] text-stone-500 mt-1">Fresh 6oz NYC drops baked daily</p>
                    </div>
                  ) : (
                    <div className="py-3 space-y-2.5 max-h-48 overflow-y-auto">
                      {items.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex items-center gap-2.5 text-xs">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-9 h-9 rounded-lg object-cover border border-[#C5A059]/30 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-white truncate">{item.name}</p>
                            <p className="text-[10px] text-stone-400 font-mono">
                              {item.quantity} × ₹{item.price}
                            </p>
                          </div>
                          <span className="font-mono text-amber-200 font-bold shrink-0">
                            ₹{item.price * item.quantity}
                          </span>
                        </div>
                      ))}
                      {items.length > 3 && (
                        <p className="text-[10px] text-stone-400 text-center italic">
                          +{items.length - 3} more in box
                        </p>
                      )}
                    </div>
                  )}

                  <div className="pt-3 border-t border-[#C5A059]/20">
                    {totalItems > 0 && (
                      <div className="flex justify-between items-center text-xs mb-2.5">
                        <span className="text-stone-400">Box Subtotal</span>
                        <span className="font-heading font-bold text-base text-amber-200">
                          ₹{totalPrice}
                        </span>
                      </div>
                    )}
                    <button
                      onClick={toggleCart}
                      className="w-full py-2 px-3 bg-[#0F2460] hover:bg-[#C5A059] hover:text-black text-white rounded-xl text-xs font-bold uppercase tracking-wider border border-[#C5A059]/40 transition-all duration-200 flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <span>{totalItems > 0 ? 'View Box & Checkout' : 'Browse Drops'}</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Right Controls: Cart + Hamburger */}
          <div className="flex md:hidden items-center space-x-1.5">
            {/* Cart Button for Mobile */}
            <button
              type="button"
              onClick={toggleCart}
              aria-label={`Shopping bag with ${totalItems} items`}
              className="relative p-2 rounded-full transition-all duration-300 active:scale-90 focus:outline-none focus:ring-2 focus:ring-[#C5A059] text-white hover:bg-white/10 hover:text-[#F3E5AB]"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C5A059] text-stone-950 font-bold text-xs rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center shadow">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              aria-expanded={isMobileMenuOpen}
              className="p-2 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#C5A059] cursor-pointer text-white hover:bg-white/10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    {/* Portaled Mobile Drawer to document.body: Prevents parent header backdrop-filter clipping & transparency bug */}
    {typeof document !== 'undefined' &&
      createPortal(
        <>
          {/* Mobile Drawer Backdrop */}
          <div
            className={`fixed inset-0 bg-black/85 backdrop-blur-md z-[998] transition-opacity duration-300 md:hidden ${
              isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Mobile Drawer Panel (Midnight Royal Blue Luxury Theme) */}
          <aside
            className={`fixed top-0 right-0 h-dvh w-80 max-w-[85vw] text-white shadow-[0_0_50px_rgba(0,0,0,0.9)] z-[999] transform transition-transform duration-300 ease-in-out md:hidden flex flex-col justify-between p-6 border-l border-[#C5A059]/40 bg-[#071533] ${
              isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'
            }`}
            aria-label="Mobile Navigation"
          >
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-6 border-b border-[#C5A059]/20">
                <div className="flex items-center space-x-3">
                  <img
                    src={brandLogo}
                    alt={`${brandTitle} Cookies`}
                    className="h-10 w-10 rounded-full object-cover shadow-sm ring-2 ring-brand-gold/60"
                  />
                  <div className="flex flex-col">
                    <span className="font-heading text-2xl font-bold text-white tracking-tight">
                      {brandTitle}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059]">
                      NYC Cookies Mumbai
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close menu"
                  className="p-2 text-stone-400 hover:text-white rounded-full hover:bg-white/10 transition-colors focus:outline-none cursor-pointer"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Drawer Nav Links */}
              <nav className="mt-8 flex flex-col space-y-2">
                {navLinks.map((link) => {
                  const isActive = activeView === link.view;
                  return (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={(e) => handleLinkClick(e, link)}
                      className={`font-heading text-base font-medium transition-all duration-200 py-3 px-3.5 rounded-xl flex items-center justify-between border-b border-white/5 ${
                        isActive
                          ? 'bg-[#0C419C] text-white font-bold shadow-md border-l-4 border-l-[#C5A059]'
                          : 'text-stone-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span>{link.name}</span>
                      {isActive && (
                        <span className="text-[10px] bg-[#C5A059] text-stone-950 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                          Active
                        </span>
                      )}
                    </a>
                  );
                })}
              </nav>

              {/* Track My Order Mobile Action */}
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onOpenTrack) onOpenTrack();
                }}
                className="w-full mt-4 py-2.5 px-3.5 rounded-xl bg-white/[0.05] border border-[#C5A059]/40 text-[#F3E5AB] font-mono text-xs uppercase tracking-wider flex items-center justify-between cursor-pointer hover:bg-white/10 transition-colors shadow-xs"
              >
                <span className="flex items-center gap-2">
                  <span>📦</span>
                  <span>Track My Order</span>
                </span>
                <span className="text-[10px] text-[#C5A059] font-bold">Live Status →</span>
              </button>
            </div>

            {/* Drawer Footer & Quick Action */}
            <div className="pt-6 border-t border-[#C5A059]/20 space-y-4">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  toggleCart();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-[#C5A059] via-[#D4B86A] to-[#C5A059] text-stone-950 rounded-xl font-bold shadow-lg hover:brightness-110 border border-[#F3E5AB]/40 transition-all cursor-pointer"
              >
                <svg
                  className="w-5 h-5 text-stone-950"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <span className="font-heading font-bold text-sm tracking-wide">View Box ({totalItems})</span>
              </button>

              <div className="text-center text-xs text-stone-400">
                <p className="font-semibold text-[#F3E5AB] uppercase tracking-wider text-[10px] font-mono">
                  NYC Gourmet 170g Cookies • Mumbai
                </p>
                <p className="mt-1 text-[11px] text-stone-400 font-light">100% Pure Eggless • Artisanal Batches</p>
              </div>
            </div>
          </aside>
        </>,
        document.body
      )}
  </>
  );
}
