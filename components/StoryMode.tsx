'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { StorySlide } from '@/lib/storyContent';

interface Props {
  slides: StorySlide[];
  title: string;
  onClose: () => void;
}

export default function StoryMode({ slides, title, onClose }: Props) {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<number | null>(null);
  const startRef = useRef(0);
  const elapsedRef = useRef(0);
  const touchStartY = useRef(0);

  const slide = slides[current];
  const isLast = current === slides.length - 1;
  const duration = slide?.type === 'text' ? 8000 : 5000;

  const goNext = useCallback(() => {
    if (isLast) {
      onClose();
    } else {
      setCurrent((c) => c + 1);
      setProgress(0);
      elapsedRef.current = 0;
    }
  }, [isLast, onClose]);

  const goPrev = useCallback(() => {
    if (current > 0) {
      setCurrent((c) => c - 1);
      setProgress(0);
      elapsedRef.current = 0;
    }
  }, [current]);

  // Auto-advance timer
  useEffect(() => {
    if (paused) return;

    startRef.current = performance.now() - elapsedRef.current;

    const tick = () => {
      const elapsed = performance.now() - startRef.current;
      const pct = Math.min(elapsed / duration, 1);
      setProgress(pct);
      if (pct >= 1) {
        goNext();
      } else {
        timerRef.current = requestAnimationFrame(tick);
      }
    };
    timerRef.current = requestAnimationFrame(tick);

    return () => {
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
    };
  }, [current, paused, duration, goNext]);

  // Pause: save elapsed
  const pause = useCallback(() => {
    setPaused(true);
    elapsedRef.current = performance.now() - startRef.current;
  }, []);

  const resume = useCallback(() => {
    setPaused(false);
  }, []);

  // Lock body scroll + hide canvas
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.classList.add('story-mode-active');
    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('story-mode-active');
    };
  }, []);

  // Keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); goNext(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goNext, goPrev, onClose]);

  // Tap zones
  const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
    const x = 'clientX' in e ? e.clientX : (e as React.TouchEvent).changedTouches[0].clientX;
    if (x > window.innerWidth / 2) goNext();
    else goPrev();
  };

  // Swipe down to exit
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (dy > 80) onClose();
  };

  // Preload next images
  useEffect(() => {
    for (let i = 1; i <= 2; i++) {
      const s = slides[current + i];
      if (s?.image) {
        const img = new Image();
        img.src = s.image;
      }
    }
  }, [current, slides]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[90] bg-black flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 z-10 flex gap-1 px-2 pt-2">
          {slides.map((_, i) => (
            <div key={i} className="flex-1 h-[3px] rounded-full bg-white/25 overflow-hidden">
              <div
                className="h-full rounded-full transition-none"
                style={{
                  width: i < current ? '100%' : i === current ? `${progress * 100}%` : '0%',
                  backgroundColor: 'var(--accent, #e8a87c)',
                }}
              />
            </div>
          ))}
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 text-white/80 hover:text-white text-2xl w-10 h-10 flex items-center justify-center"
          aria-label="Close story"
        >
          ✕
        </button>

        {/* Content area */}
        <div
          className="flex-1 flex items-center justify-center relative select-none"
          onClick={handleTap}
          onMouseDown={pause}
          onMouseUp={resume}
          onTouchStart={(e) => { pause(); handleTouchStart(e); }}
          onTouchEnd={(e) => { resume(); handleTouchEnd(e); }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {slide.type === 'image' && slide.image ? (
                <img
                  src={slide.image}
                  alt=""
                  loading="eager"
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              ) : (
                <div className="px-8 py-12 max-w-lg text-center">
                  {slide.heading && (
                    <h3 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl text-white mb-4">
                      {slide.heading}
                    </h3>
                  )}
                  {slide.text && (
                    <p className="text-white/90 text-lg leading-relaxed">
                      {slide.text}
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-6 left-4 z-10 text-white/50 text-sm">
          <span className="font-medium">{title}</span>
          <span className="ml-2">{current + 1}/{slides.length}</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
