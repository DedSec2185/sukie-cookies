import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [cursorType, setCursorType] = useState('default'); // 'default' | 'cookie' | 'button' | 'hidden'
  const [isVisible, setIsVisible] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for trailing ring
  const springConfig = { damping: 24, stiffness: 220, mass: 0.6 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Only enable custom cursor on devices with fine pointer (mouse), not touch screens
    const isTouch =
      window.matchMedia('(pointer: coarse)').matches ||
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0;

    if (isTouch) return;

    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      // Check what element is currently under the cursor
      const target = e.target;
      if (!target) return;

      if (target.closest('[data-cursor="cookie"]') || target.closest('.cookie-card-visual')) {
        setCursorType('cookie');
      } else if (
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[role="button"]') ||
        target.closest('input') ||
        target.closest('select')
      ) {
        setCursorType('button');
      } else {
        setCursorType('default');
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      setCursorType('hidden');
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible, mouseX, mouseY]);

  if (!isVisible) return null;

  return (
    <div className="hidden lg:block pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* 1. Precise Center Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 rounded-full bg-[#C5A059] shadow-[0_0_8px_#C5A059]"
        style={{
          x: mouseX,
          y: mouseY,
        }}
        animate={{
          scale: cursorType === 'button' ? 0 : cursorType === 'cookie' ? 0 : 1,
          opacity: cursorType === 'hidden' ? 0 : 1,
        }}
        transition={{ duration: 0.15 }}
      />

      {/* 2. Trailing Luxury Halo Ring */}
      <motion.div
        className="fixed top-0 left-0 -ml-5 -mt-5 flex items-center justify-center rounded-full border border-[#C5A059]/70 transition-colors duration-200"
        style={{
          x: smoothX,
          y: smoothY,
        }}
        animate={{
          width: cursorType === 'cookie' ? 76 : cursorType === 'button' ? 44 : 28,
          height: cursorType === 'cookie' ? 76 : cursorType === 'button' ? 44 : 28,
          marginLeft: cursorType === 'cookie' ? -38 : cursorType === 'button' ? -22 : -14,
          marginTop: cursorType === 'cookie' ? -38 : cursorType === 'button' ? -22 : -14,
          backgroundColor:
            cursorType === 'cookie'
              ? 'rgba(197, 160, 89, 0.92)'
              : cursorType === 'button'
              ? 'rgba(12, 65, 156, 0.15)'
              : 'rgba(197, 160, 89, 0.08)',
          borderColor:
            cursorType === 'cookie'
              ? 'rgba(255, 255, 255, 0.9)'
              : cursorType === 'button'
              ? 'rgba(12, 65, 156, 0.8)'
              : 'rgba(197, 160, 89, 0.65)',
          boxShadow:
            cursorType === 'cookie'
              ? '0 0 25px rgba(197, 160, 89, 0.6), inset 0 0 10px rgba(255, 255, 255, 0.3)'
              : cursorType === 'button'
              ? '0 0 16px rgba(12, 65, 156, 0.3)'
              : '0 0 10px rgba(197, 160, 89, 0.25)',
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 260 }}
      >
        {cursorType === 'cookie' && (
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            className="text-[9px] font-heading font-black tracking-widest text-stone-950 uppercase select-none text-center leading-none"
          >
            TASTE
            <span className="block text-[7px] font-mono tracking-wider opacity-80 mt-0.5">✦ NOTES</span>
          </motion.span>
        )}
      </motion.div>
    </div>
  );
}
