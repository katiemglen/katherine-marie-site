'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const tips = [
  { emoji: '🐚', text: 'Look for hidden emoji in the text — click them for fun facts!' },
  { emoji: '💬', text: 'Scroll through posts for surprise messages from Katie' },
  { emoji: '📸', text: 'Click any photo to see it full-screen' },
  { emoji: '🌙', text: 'Try dark mode — toggle the icon in the nav' },
];

export default function WelcomePopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem('km-welcomed') === 'true') return;
    } catch { return; }
    const timer = setTimeout(() => setShow(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setShow(false);
    try { localStorage.setItem('km-welcomed', 'true'); } catch {}
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          onClick={dismiss}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative max-w-md w-full rounded-3xl p-8"
            style={{
              background: 'var(--glass-bg)',
              backdropFilter: 'blur(24px)',
              border: '1px solid var(--glass-border)',
              boxShadow: '0 16px 60px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={dismiss}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full cursor-pointer text-sm"
              style={{ color: 'var(--muted-text)', background: 'rgba(var(--accent-rgb), 0.1)' }}
              aria-label="Close"
            >
              ✕
            </button>

            <h2 className="font-[family-name:var(--font-playfair)] text-2xl mb-2" style={{ color: 'var(--heading-color)' }}>
              👋 Welcome to Katherine Marie!
            </h2>
            <p className="mb-6 text-sm" style={{ color: 'var(--muted-text)' }}>
              We hid some fun stuff in here. Poke around — you&apos;ll see what we mean:
            </p>

            <div className="space-y-4 mb-8">
              {tips.map((tip) => (
                <div key={tip.emoji} className="flex items-start gap-3">
                  <span className="text-xl shrink-0">{tip.emoji}</span>
                  <p className="text-sm" style={{ color: 'var(--foreground)' }}>{tip.text}</p>
                </div>
              ))}
            </div>

            <button
              onClick={dismiss}
              className="w-full py-3 rounded-2xl font-semibold text-white cursor-pointer transition-opacity hover:opacity-90"
              style={{ background: 'var(--accent)' }}
            >
              Start Exploring →
            </button>

            <p className="text-center mt-3 text-xs" style={{ color: 'var(--muted-text)' }}>
              Visit <Link href="/welcome" className="underline" style={{ color: 'var(--accent)' }}>/welcome</Link> for the full guide
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
