'use client';

import { motion } from 'framer-motion';

interface Props {
  image: string;
  title: string;
  date: string;
  categories: string[];
}

export default function HeroSection({ image, title, date, categories }: Props) {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="relative w-full h-[80vh] overflow-hidden" style={{ viewTransitionName: 'hero-image' }}>
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
      />
      {/* Gradient overlay — same in both themes for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 lg:p-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
        >
          <div className="flex gap-2 mb-3">
            {categories.map((c) => (
              <span key={c} className="text-xs px-3 py-1 rounded-full" style={{ background: 'var(--category-bg)', color: 'var(--category-text)', border: '1px solid var(--category-border)' }}>
                {c}
              </span>
            ))}
          </div>
          <time className="text-sm" style={{ color: 'var(--accent)', opacity: 0.8 }}>{formattedDate}</time>
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl md:text-5xl lg:text-6xl text-white mt-2 max-w-3xl leading-tight">
            {title}
          </h1>
        </motion.div>
      </div>
    </div>
  );
}
