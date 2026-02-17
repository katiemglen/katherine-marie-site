'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ClosingCTA({ image }: { image: string }) {
  return (
    <section className="relative min-h-[50vh] md:min-h-[60vh] flex items-center justify-center overflow-hidden">
      <img
        src={image}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 100%)',
        }}
      />

      <motion.div
        className="relative z-10 text-center px-6"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-5xl text-white mb-8 leading-tight">
          Every mile has a story.
        </h2>
        <div className="flex gap-6 justify-center">
          <Link
            href="/trips/west-coast-2016"
            className="text-sm md:text-base uppercase tracking-[0.15em] font-medium transition-opacity hover:opacity-80"
            style={{ color: '#c4882a' }}
          >
            West Coast →
          </Link>
          <Link
            href="/trips/east-coast-2019"
            className="text-sm md:text-base uppercase tracking-[0.15em] font-medium transition-opacity hover:opacity-80"
            style={{ color: '#c4882a' }}
          >
            East Coast →
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
