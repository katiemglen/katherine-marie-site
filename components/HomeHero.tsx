'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HomeHeroProps {
  images: string[];
}

export default function HomeHero({ images }: HomeHeroProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Images with Ken Burns */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={current}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        >
          <motion.img
            src={images[current]}
            alt=""
            className="w-full h-full object-cover"
            initial={{ scale: 1.05 }}
            animate={{ scale: 1.15 }}
            transition={{ duration: 6, ease: 'linear' }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.35) 100%)',
        }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <motion.img
          src="/images/logo-roadtrip.png"
          alt="Katherine Marie"
          className="w-[288px] md:w-[360px] h-auto"
          style={{ filter: 'brightness(0) invert(1)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />
        <motion.p
          className="mt-6 text-white/90 text-sm md:text-base tracking-[0.25em] uppercase font-light"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Explore the Journey
        </motion.p>
        <motion.div
          className="mt-4 text-white/70 text-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <span className="inline-block animate-bounce">↓</span>
        </motion.div>
      </div>
    </section>
  );
}
