import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMenu } from '../../context/MenuContext';

export default function AdminAuthModal({ onSuccess, onExit }) {
  const { verifyPin, storeConfig } = useMenu();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  // Keyboard number listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key >= '0' && e.key <= '9') {
        if (pin.length < 4) {
          setPin((prev) => prev + e.key);
        }
      } else if (e.key === 'Backspace') {
        setPin((prev) => prev.slice(0, -1));
      } else if (e.key === 'Escape') {
        onExit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin, onExit]);

  // Check PIN when 4 digits reached
  useEffect(() => {
    if (pin.length === 4) {
      if (verifyPin(pin)) {
        sessionStorage.setItem('sukie_admin_auth', 'authenticated');
        onSuccess();
      } else {
        setError(true);
        setShake(true);
        setTimeout(() => {
          setPin('');
          setShake(false);
        }, 600);
      }
    } else {
      setError(false);
    }
  }, [pin, verifyPin, onSuccess]);

  const handleKeyPress = (digit) => {
    if (pin.length < 4) {
      setPin((prev) => prev + digit);
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setPin('');
    setError(false);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
      {/* Ambient Sukié Blue and Gold Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#0C419C]/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-10 right-10 w-72 h-72 bg-[#C5A059]/15 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#0B2558] via-[#0C419C] to-[#071B42] border-2 border-[#C5A059]/80 shadow-[0_25px_70px_rgba(0,0,0,0.7)] p-6 sm:p-8 text-white relative overflow-hidden text-center"
      >
        {/* Subtle Silk Pattern */}
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#F3E5AB_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none" />

        {/* Brand Emblem */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full p-1 bg-gradient-to-b from-[#F3E5AB] via-[#C5A059] to-[#8C6D2B] shadow-lg mb-3">
            <img
              src={storeConfig?.logoUrl || '/images/logo.png'}
              alt={`${storeConfig?.brandName || 'Sukié'} Logo`}
              className="w-full h-full rounded-full object-cover"
            />
          </div>

          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#F3E5AB] font-bold">
            FOUNDER ATELIER
          </span>
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-white mt-0.5">
            {storeConfig?.brandName || 'Sukié'} Studio Access
          </h2>
          <p className="text-[11px] text-white/70 font-light mt-1 max-w-[240px]">
            Enter your 4-digit PIN to manage menu drops, photo uploads &amp; demand analytics.
          </p>

          {/* PIN Digits Display */}
          <motion.div
            animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-center gap-3 my-6"
          >
            {[0, 1, 2, 3].map((index) => {
              const isFilled = pin.length > index;
              return (
                <div
                  key={index}
                  className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                    isFilled
                      ? 'bg-[#F3E5AB] border-[#F3E5AB] shadow-[0_0_12px_rgba(243,229,171,0.8)] scale-110'
                      : error
                      ? 'border-red-400 bg-red-500/20'
                      : 'border-white/30 bg-black/20'
                  }`}
                />
              );
            })}
          </motion.div>

          {/* Error Message */}
          <div className="h-5 mb-2">
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs font-mono text-rose-300 font-medium"
                >
                  Incorrect PIN. Please try again.
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Numeric Keypad */}
          <div className="grid grid-cols-3 gap-2.5 w-full max-w-[260px] mx-auto">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleKeyPress(digit)}
                className="h-12 rounded-2xl bg-white/10 hover:bg-white/20 active:bg-[#C5A059]/40 border border-white/10 text-white font-mono text-lg font-bold transition-all cursor-pointer flex items-center justify-center active:scale-95 shadow-sm"
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              onClick={handleClear}
              className="h-12 rounded-2xl bg-white/5 hover:bg-white/15 text-white/60 font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center border border-white/5"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => handleKeyPress('0')}
              className="h-12 rounded-2xl bg-white/10 hover:bg-white/20 active:bg-[#C5A059]/40 border border-white/10 text-white font-mono text-lg font-bold transition-all cursor-pointer flex items-center justify-center active:scale-95 shadow-sm"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleBackspace}
              className="h-12 rounded-2xl bg-white/5 hover:bg-white/15 text-white/80 text-base font-bold transition-colors cursor-pointer flex items-center justify-center border border-white/5"
              aria-label="Backspace"
            >
              ⌫
            </button>
          </div>

          {/* Hint & Exit Action */}
          <div className="mt-6 pt-4 border-t border-white/15 w-full flex items-center justify-between text-[11px] text-white/60">
            <span className="font-mono text-[10px] text-[#F3E5AB]/70">
              Default PIN: {storeConfig.adminPin}
            </span>
            <button
              type="button"
              onClick={onExit}
              className="text-[#F3E5AB] hover:underline font-medium cursor-pointer"
            >
              Back to Store →
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
