import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WarmingSimulator() {
  const [method, setMethod] = useState('microwave'); // 'microwave' | 'oven'
  const [isRunning, setIsRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(15);
  const [isDone, setIsDone] = useState(false);
  const timerRef = useRef(null);

  const duration = method === 'microwave' ? 15 : 45; // 45s simulated for 2 min oven demonstration

  useEffect(() => {
    if (!isRunning) {
      setSecondsLeft(duration);
      setIsDone(false);
    }
  }, [method, duration, isRunning]);

  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      timerRef.current = setTimeout(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && secondsLeft === 0) {
      setIsRunning(false);
      setIsDone(true);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isRunning, secondsLeft]);

  const handleStart = () => {
    setIsDone(false);
    setSecondsLeft(duration);
    setIsRunning(true);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(duration);
    setIsDone(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const progress = ((duration - secondsLeft) / duration) * 100;
  const strokeDashoffset = 283 - (283 * progress) / 100;

  return (
    <div className="relative rounded-2xl sm:rounded-3xl p-5 sm:p-8 bg-gradient-to-br from-[#0F172A] via-[#0A0E1A] to-[#05070D] border border-[#C5A059]/40 shadow-2xl overflow-hidden">
      {/* Ambient background heating glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          opacity: isRunning ? [0.2, 0.55, 0.35] : isDone ? 0.6 : 0.1,
          background: isDone
            ? 'radial-gradient(circle at center, rgba(234, 88, 12, 0.35) 0%, transparent 70%)'
            : isRunning
            ? 'radial-gradient(circle at center, rgba(197, 160, 89, 0.3) 0%, transparent 70%)'
            : 'radial-gradient(circle at center, rgba(12, 65, 156, 0.15) 0%, transparent 70%)',
        }}
        transition={{ duration: 1.5, repeat: isRunning ? Infinity : 0, repeatType: 'reverse' }}
      />

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-[#C5A059]/30 text-[#C5A059] text-[10px] sm:text-xs font-mono tracking-widest uppercase mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          Interactive Reheat Simulator
        </div>

        <h3 className="font-heading text-xl sm:text-3xl font-bold text-white mb-2">
          The Sukié <span className="text-gold-gradient font-serif italic">Warming Ritual</span>
        </h3>
        <p className="text-white/70 text-xs sm:text-sm font-light max-w-md mb-6 leading-relaxed">
          Simulate the thermal awakening of our 170g dough. Experience how convection warmth liquefies the Belgian Callebaut center.
        </p>

        {/* Method Switcher */}
        <div className="flex items-center p-1 rounded-full bg-black/60 border border-white/15 mb-6 max-w-xs w-full justify-between">
          <button
            type="button"
            disabled={isRunning}
            onClick={() => {
              setMethod('microwave');
              setIsRunning(false);
            }}
            className={`flex-1 py-2 px-3 rounded-full text-xs font-medium transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
              method === 'microwave'
                ? 'bg-[#C5A059] text-stone-950 font-bold shadow-md'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <span>⚡ Microwave</span>
            <span className="text-[10px] opacity-80">(15s)</span>
          </button>

          <button
            type="button"
            disabled={isRunning}
            onClick={() => {
              setMethod('oven');
              setIsRunning(false);
            }}
            className={`flex-1 py-2 px-3 rounded-full text-xs font-medium transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
              method === 'oven'
                ? 'bg-[#0C419C] text-white font-bold shadow-md'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <span>🔥 Convection</span>
            <span className="text-[10px] opacity-80">(160°C)</span>
          </button>
        </div>

        {/* Circular Timer Visualizer */}
        <div className="relative w-40 h-40 sm:w-48 sm:h-48 mb-6 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Background track */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="6"
            />
            {/* Active animated stroke */}
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke={isDone ? '#F97316' : '#C5A059'}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="283"
              strokeDashoffset={strokeDashoffset}
              transition={{ duration: 0.5, ease: 'linear' }}
            />
          </svg>

          {/* Center Info Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {isDone ? (
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center"
              >
                <span className="text-3xl sm:text-4xl mb-1">🍪✨</span>
                <span className="text-xs sm:text-sm font-bold text-amber-300 uppercase tracking-widest font-heading">
                  MOLTEN!
                </span>
                <span className="text-[9px] text-white/60 font-mono">160°C Core</span>
              </motion.div>
            ) : isRunning ? (
              <div className="flex flex-col items-center">
                <span className="font-heading text-3xl sm:text-4xl font-bold text-white tracking-tight">
                  {secondsLeft}s
                </span>
                <span className="text-[10px] text-amber-300/90 font-mono tracking-wider animate-pulse mt-0.5">
                  HEATING CORE...
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <span className="text-2xl sm:text-3xl mb-1">
                  {method === 'microwave' ? '⚡' : '🔥'}
                </span>
                <span className="font-heading text-xl sm:text-2xl font-bold text-white">
                  {duration}s
                </span>
                <span className="text-[9px] text-white/50 uppercase tracking-widest font-mono">
                  {method === 'microwave' ? 'Flash Gooey' : 'Convection 160°'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Status / Instructions Note */}
        <AnimatePresence mode="wait">
          {isDone ? (
            <motion.div
              key="done-msg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3.5 sm:p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs sm:text-sm font-light max-w-sm mb-6 shadow-inner"
            >
              <strong className="block text-white font-bold mb-1 font-heading">
                ✦ Liquid Lava Perfection Achieved
              </strong>
              Rest for 60 seconds. Crack open gently to reveal the steaming, volcanic Belgian ganache center.
            </motion.div>
          ) : isRunning ? (
            <motion.div
              key="running-msg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-xs text-white/60 font-mono mb-6 max-w-xs"
            >
              Butter hydration active • Callets softening into ganache river...
            </motion.div>
          ) : (
            <motion.div
              key="idle-msg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-xs text-white/60 font-light mb-6 max-w-sm"
            >
              {method === 'microwave'
                ? 'Standard microwave at 800W for 15s yields maximum gooey stretch.'
                : 'Convection oven at 160°C crisps the crust while keeping ganache molten.'}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {!isRunning && !isDone && (
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleStart}
              className="px-6 sm:px-8 py-3 rounded-full bg-gradient-to-r from-[#C5A059] to-[#D4B86A] text-stone-950 font-bold text-xs uppercase tracking-widest shadow-lg hover:shadow-amber-500/20 cursor-pointer flex items-center gap-2"
            >
              <span>Start Warming Timer</span>
              <span>▶</span>
            </motion.button>
          )}

          {isRunning && (
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-2.5 rounded-full bg-red-600/80 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Pause / Stop
            </button>
          )}

          {isDone && (
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleReset}
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              ↺ Simulate Again
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
