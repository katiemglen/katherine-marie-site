'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SectionProgressProps {
  sections: Array<{ id: string; heading: string }>;
  lightboxOpen?: boolean;
}

export default function SectionProgress({ sections, lightboxOpen = false }: SectionProgressProps) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [visible, setVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.8);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (sections.length === 0) return;

    const observers: IntersectionObserver[] = [];

    sections.forEach((section, index) => {
      const el = document.getElementById(section.id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveIndex(index);
          }
        },
        { rootMargin: '-30% 0px -60% 0px' }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [sections]);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  if (sections.length === 0) return null;

  return (
    <AnimatePresence>
      {visible && !lightboxOpen && (
        <motion.nav
          className="hidden lg:flex fixed left-6 xl:left-8 top-1/2 -translate-y-1/2 z-30 flex-col items-center gap-0"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          aria-label="Section progress"
        >
          {sections.map((section, i) => {
            const isPast = i < activeIndex;
            const isActive = i === activeIndex;

            return (
              <div key={section.id} className="flex flex-col items-center">
                {/* Connecting line above (skip first) */}
                {i > 0 && (
                  <div
                    className="w-[2px] h-5"
                    style={{ backgroundColor: 'var(--card-border)' }}
                  />
                )}

                {/* Dot + tooltip wrapper */}
                <div
                  className="relative flex items-center cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => scrollTo(section.id)}
                >
                  <motion.div
                    animate={{
                      width: isActive ? 12 : 8,
                      height: isActive ? 12 : 8,
                      backgroundColor: isActive
                        ? 'var(--accent)'
                        : isPast
                          ? 'var(--muted-text)'
                          : 'transparent',
                      borderColor: isActive
                        ? 'var(--accent)'
                        : 'var(--muted-text)',
                      boxShadow: isActive
                        ? '0 0 8px color-mix(in srgb, var(--accent) 40%, transparent)'
                        : '0 0 0px transparent',
                    }}
                    transition={{ duration: 0.3 }}
                    className="rounded-full border-2 flex-shrink-0"
                  />

                  {/* Tooltip */}
                  <AnimatePresence>
                    {hoveredIndex === i && (
                      <motion.div
                        className="absolute left-6 whitespace-nowrap text-xs px-3 py-1.5 rounded-md shadow-md pointer-events-none"
                        style={{
                          backgroundColor: 'var(--card-bg)',
                          color: 'var(--foreground)',
                        }}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -5 }}
                        transition={{ duration: 0.15 }}
                      >
                        {section.heading}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
