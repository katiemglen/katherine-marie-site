'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Shell easter egg — click to reveal fun fact
export function ShellEasterEgg({ fact }: { fact: string }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <span className="inline-block relative">
      <button
        onClick={() => setRevealed(!revealed)}
        className="cursor-pointer text-lg hover:scale-125 transition-transform inline-block"
        style={{ background: 'none', border: 'none', padding: '0 2px' }}
        aria-label="Discover a fun fact"
      >
        🐚
      </button>
      <AnimatePresence>
        {revealed && (
          <motion.span
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.9 }}
            className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 rounded-xl text-xs whitespace-nowrap z-50"
            style={{
              background: 'var(--glass-bg)',
              backdropFilter: 'blur(12px)',
              border: '1px solid var(--glass-border)',
              color: 'var(--foreground)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            }}
          >
            {fact}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

// Long hover shake — photo shakes after 3s hover
export function ShakeOnLongHover({ children }: { children: React.ReactNode }) {
  const [shaking, setShaking] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const startHover = useCallback(() => {
    timerRef.current = setTimeout(() => setShaking(true), 3000);
  }, []);
  const endHover = useCallback(() => {
    clearTimeout(timerRef.current);
    setShaking(false);
  }, []);

  return (
    <div
      onMouseEnter={startHover}
      onMouseLeave={endHover}
      style={{
        display: 'contents',
        animation: shaking ? 'wiggle 0.3s ease-in-out 3' : 'none',
      }}
    >
      {children}
    </div>
  );
}

// Scroll-triggered "Katie says..." popup
export function KatieSaysPopup({ message, triggerOffset = 0.5 }: { message: string; triggerOffset?: number }) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || dismissed) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: triggerOffset }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [triggerOffset, dismissed]);

  return (
    <div ref={ref} className="relative">
      <AnimatePresence>
        {visible && !dismissed && (
          <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20 }}
            className="fixed bottom-6 left-6 z-50 max-w-xs px-4 py-3 rounded-2xl cursor-pointer"
            style={{
              background: 'var(--glass-bg)',
              backdropFilter: 'blur(16px)',
              border: '1px solid var(--glass-border)',
              color: 'var(--foreground)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
            }}
            onClick={() => setDismissed(true)}
          >
            <p className="text-xs font-medium" style={{ color: 'var(--accent)' }}>Katie says...</p>
            <p className="text-sm mt-1">{message}</p>
            <p className="text-[10px] mt-1" style={{ color: 'var(--muted-text)' }}>tap to dismiss</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
