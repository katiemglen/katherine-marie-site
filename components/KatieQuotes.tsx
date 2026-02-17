'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const QUOTES = [
  { text: "We better go to the store and get it.", note: "on survival packs" },
  { text: "So far I am up to 11 times…", note: "on killing the manual car" },
  { text: "Showers are truly amazing and cherished.", note: null },
  { text: "I was oh so lucky to drive through the park, a privilege apparently.", note: null },
  { text: "I was terrified as I have re-discovered I am not a huge fan of cliffs.", note: null },
  { text: "I was full instantly and saved the sandwich for later while Chad killed it on the Ruben.", note: null },
  { text: "Safety was a concern and we both were firm about not wanting to camp in the car surrounded by potential crazies.", note: null },
  { text: "Waking up in Vegas was strange to me.", note: null },
  { text: "Personal hygiene is important.", note: null },
  { text: "30 minutes into Day 2, I found the ice scraper tucked next to the passenger seat.", note: null },
  { text: "What's up with boiled peanuts?", note: null },
];

export default function KatieQuotes() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(Math.floor(Math.random() * QUOTES.length));
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % QUOTES.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const quote = QUOTES[index];

  return (
    <section
      className="relative py-12 md:py-16 px-6 overflow-hidden"
      style={{
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        background: 'rgba(var(--accent-rgb), 0.04)',
        borderTop: '1px solid rgba(var(--accent-rgb), 0.15)',
        borderBottom: '1px solid rgba(var(--accent-rgb), 0.15)',
      }}
    >
      <div className="max-w-3xl mx-auto text-center min-h-[120px] flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            <p
              className="font-[family-name:var(--font-playfair)] text-xl md:text-2xl lg:text-3xl italic leading-relaxed"
              style={{ color: 'var(--foreground)' }}
            >
              &ldquo;{quote.text}&rdquo;
              {quote.note && (
                <span className="text-sm md:text-base not-italic ml-2" style={{ color: 'var(--muted-text)' }}>
                  — {quote.note}
                </span>
              )}
            </p>
            <p className="mt-4 text-xs uppercase tracking-[0.2em]" style={{ color: 'var(--accent)' }}>
              — Katherine Marie
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
