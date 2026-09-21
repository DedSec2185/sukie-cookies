import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems, toggleCart } = useCart();

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
    { name: 'Home', href: '#home' },
    { name: 'Menu', href: '#menu' },
    { name: 'Our Story', href: '#story' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    if (href === '#home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const targetElement = document.querySelector(href);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.hash = href;
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Left: Brand Logo & Name */}
          <a
            href="#home"
            onClick={(e) => handleLinkClick(e, '#home')}
            className="flex items-center space-x-3 group cursor-pointer focus:outline-none"
            aria-label="Sukié Cookies Home"
          >
            <img
              src="/images/logo.png"
              alt="Sukié Cookies Logo"
              className="h-12 w-12 rounded-full object-cover shadow-sm ring-2 ring-brand-gold/40 group-hover:scale-105 transition-transform duration-300"
            />
            <div className="flex flex-col">
              <span
                className={`font-heading text-2xl md:text-3xl font-bold tracking-tight transition-colors duration-300 ${
                  isScrolled ? 'text-brand-blue-dark' : 'text-white'
                }`}
              >
                Sukié
              </span>
            </div>
          </a>

          {/* Right: Desktop Navigation Links & Cart Button */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex items-center space-x-8" aria-label="Main Navigation">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`text-sm font-medium tracking-wider uppercase transition-colors duration-300 relative group py-1 ${
                    isScrolled
                      ? 'text-brand-dark hover:text-brand-blue'
                      : 'text-white/90 hover:text-brand-gold'
                  }`}
                >
                  {link.name}
                  <span
                    className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                      isScrolled ? 'bg-brand-blue' : 'bg-brand-gold'
                    }`}
                  />
                </a>
              ))}
            </nav>

            {/* Cart Icon Button */}
            <button
              type="button"
              onClick={toggleCart}
              aria-label={`Shopping bag with ${totalItems} items`}
              className={`relative p-2.5 rounded-full transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-gold ${
                isScrolled
                  ? 'text-brand-dark hover:bg-black/5 hover:text-brand-blue'
                  : 'text-white hover:bg-white/10 hover:text-brand-gold'
              }`}
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
                <span className="absolute -top-1 -right-1 bg-brand-gold text-brand-dark font-bold text-xs rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center shadow-md animate-pulse-glow">
                  {totalItems}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Right Controls: Cart + Hamburger */}
          <div className="flex md:hidden items-center space-x-2">
            {/* Cart Button for Mobile */}
            <button
              type="button"
              onClick={toggleCart}
              aria-label={`Shopping bag with ${totalItems} items`}
              className={`relative p-2 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-brand-gold ${
                isScrolled
                  ? 'text-brand-dark hover:bg-black/5'
                  : 'text-white hover:bg-white/10'
              }`}
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
                <span className="absolute -top-1 -right-1 bg-brand-gold text-brand-dark font-bold text-xs rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center shadow">
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
              className={`p-2 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-brand-gold ${
                isScrolled
                  ? 'text-brand-dark hover:bg-black/5'
                  : 'text-white hover:bg-white/10'
              }`}
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

      {/* Mobile Drawer Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs z-40 transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Drawer Panel (slides in from right) */}
      <aside
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-brand-cream text-brand-dark shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col justify-between p-6 ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'
        }`}
        aria-label="Mobile Navigation"
      >
        <div>
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-6 border-b border-brand-warm/20">
            <div className="flex items-center space-x-3">
              <img
                src="/images/logo.png"
                alt="Sukié Cookies"
                className="h-10 w-10 rounded-full object-cover shadow-sm ring-2 ring-brand-gold/40"
              />
              <span className="font-heading text-2xl font-bold text-brand-blue-dark">
                Sukié
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
              className="p-2 text-brand-dark/70 hover:text-brand-dark rounded-full hover:bg-black/5 transition-colors focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Drawer Nav Links */}
          <nav className="mt-8 flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="font-heading text-xl font-medium text-brand-dark hover:text-brand-blue hover:translate-x-1.5 transition-all duration-200 py-3 px-2 rounded-lg hover:bg-white/60 border-b border-brand-warm/10"
              >
                {link.name}
              </a>
            ))}
          </nav>
        </div>

        {/* Drawer Footer & Quick Action */}
        <div className="pt-6 border-t border-brand-warm/20 space-y-4">
          <button
            type="button"
            onClick={() => {
              setIsMobileMenuOpen(false);
              toggleCart();
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-brand-blue text-white rounded-full font-medium shadow-md hover:bg-brand-blue-dark transition-colors cursor-pointer"
          >
            <svg
              className="w-5 h-5"
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
            <span>View Cart ({totalItems})</span>
          </button>

          <div className="text-center text-xs text-brand-dark/60">
            <p className="font-medium text-brand-warm uppercase tracking-wider">
              NYC Style Cookies • Mumbai
            </p>
            <p className="mt-1">Pre-orders only • Baked fresh daily</p>
          </div>
        </div>
      </aside>
    </header>
  );
}
