'use client';

import { motion } from 'framer-motion';
import TransitionLink from './TransitionLink';

interface PostTeaser {
  slug: string;
  title: string;
  images: string[];
}

interface Props {
  next: PostTeaser | null;
  prev: PostTeaser | null;
}

export default function NextStoryTeaser({ next, prev }: Props) {
  if (!next && !prev) return null;

  return (
    <div className="mt-16">
      {prev && (
        <div className="mb-4 text-center">
          <TransitionLink href={`/posts/${prev.slug}`} className="hover:text-[var(--accent)] transition text-sm" style={{ color: 'var(--link-color)' }}>
            ← Previous: {prev.title}
          </TransitionLink>
        </div>
      )}

      {next && (
        <TransitionLink href={`/posts/${next.slug}`} className="block group">
          <motion.div
            className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden rounded-2xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            {next.images[0] && (
              <img
                src={next.images[0]}
                alt={next.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            )}
            {/* Glassmorphic bottom panel */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div
              className="absolute bottom-0 left-0 right-0 p-6 md:p-12 transition-transform duration-500 group-hover:-translate-y-1"
              style={{
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                background: 'rgba(0,0,0,0.3)',
                borderTop: '1px solid rgba(var(--accent-rgb), 0.2)',
              }}
            >
              <span className="text-sm uppercase tracking-widest" style={{ color: 'var(--accent)', opacity: 0.8 }}>Next Story</span>
              <h2 className="font-[family-name:var(--font-playfair)] text-2xl md:text-4xl text-white mt-2">
                {next.title}
              </h2>
            </div>
          </motion.div>
        </TransitionLink>
      )}
    </div>
  );
}
