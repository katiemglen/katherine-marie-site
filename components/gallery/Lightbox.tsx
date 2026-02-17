'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LightboxProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

export default function Lightbox({ images, initialIndex, onClose }: LightboxProps) {
  const [index, setIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const touchStart = useRef<{ x: number; y: number; dist?: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const prev = useCallback(() => setIndex(i => (i > 0 ? i - 1 : images.length - 1)), [images.length]);
  const next = useCallback(() => setIndex(i => (i < images.length - 1 ? i + 1 : 0)), [images.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose, prev, next]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchStart.current = { x: 0, y: 0, dist };
    } else if (e.touches.length === 1) {
      touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchStart.current?.dist) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setScale(Math.max(1, Math.min(3, dist / touchStart.current.dist)));
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current && !touchStart.current.dist && e.changedTouches.length === 1) {
      const dx = e.changedTouches[0].clientX - touchStart.current.x;
      if (Math.abs(dx) > 60) {
        dx > 0 ? prev() : next();
      }
    }
    if (scale !== 1) setScale(1);
    touchStart.current = null;
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={containerRef}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => { if (e.target === containerRef.current) onClose(); }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition text-2xl"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Counter */}
        <div className="absolute top-4 left-4 text-white/60 text-sm">
          {index + 1} / {images.length}
        </div>

        {/* Nav arrows */}
        {images.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-2 md:left-4 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition text-xl" aria-label="Previous">
              ‹
            </button>
            <button onClick={next} className="absolute right-2 md:right-4 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition text-xl" aria-label="Next">
              ›
            </button>
          </>
        )}

        {/* Image */}
        <motion.img
          key={index}
          src={images[index]}
          alt=""
          className="max-h-[90vh] max-w-[95vw] object-contain select-none"
          style={{ transform: `scale(${scale})` }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          draggable={false}
        />
      </motion.div>
    </AnimatePresence>
  );
}
