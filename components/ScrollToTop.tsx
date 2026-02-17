'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ScrollToTop() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? scrollTop / docHeight : 0);
      setVisible(scrollTop > 300);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const radius = 19;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  // Color interpolation based on scroll progress
  const lerpColor = (a: number[], b: number[], t: number) =>
    a.map((v, i) => Math.round(v + (b[i] - v) * t));
  const toHex = (rgb: number[]) => '#' + rgb.map(v => v.toString(16).padStart(2, '0')).join('');

  const isDark = typeof document !== 'undefined' && document.documentElement.dataset.theme === 'dark';
  const stops = [
    [184, 134, 11],   // 0% amber
    [212, 168, 67],   // 33% warm gold
    [122, 182, 72],   // 66% golden green
    isDark ? [110, 231, 183] : [45, 80, 22], // 100% forest green
  ];

  let ringColor: string;
  if (progress <= 0.33) {
    ringColor = toHex(lerpColor(stops[0], stops[1], progress / 0.33));
  } else if (progress <= 0.66) {
    ringColor = toHex(lerpColor(stops[1], stops[2], (progress - 0.33) / 0.33));
  } else {
    ringColor = toHex(lerpColor(stops[2], stops[3], (progress - 0.66) / 0.34));
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 md:bottom-6 md:right-6 z-[90] w-12 h-12 rounded-full flex items-center justify-center shadow-lg border cursor-pointer"
          style={{
            background: 'var(--card-bg)',
            borderColor: 'var(--card-border)',
            backdropFilter: 'blur(12px)',
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          aria-label="Scroll to top"
        >
          {/* Progress ring */}
          <svg className="absolute inset-0 w-12 h-12 -rotate-90" viewBox="0 0 48 48">
            <circle
              cx="24"
              cy="24"
              r={radius}
              fill="none"
              stroke="var(--card-border)"
              strokeWidth="2.5"
            />
            <circle
              cx="24"
              cy="24"
              r={radius}
              fill="none"
              stroke={ringColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 0.1s ease, stroke 0.3s ease' }}
            />
          </svg>
          {/* Arrow */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
