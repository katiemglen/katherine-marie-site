'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface FeaturedStoryProps {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
}

export default function FeaturedStory({ slug, title, excerpt, date, category, image }: FeaturedStoryProps) {
  return (
    <section className="py-20 md:py-28 px-6 max-w-7xl mx-auto">
      <motion.div
        className="grid md:grid-cols-5 gap-8 md:gap-12 items-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.7 }}
      >
        {/* Image — 60% */}
        <div className="md:col-span-3">
          <Link href={`/posts/${slug}`}>
            <img
              src={image}
              alt={title}
              className="w-full rounded-xl object-cover aspect-[4/3]"
              style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.12)' }}
            />
          </Link>
        </div>

        {/* Text — 40% */}
        <div className="md:col-span-2">
          <span
            className="inline-block text-xs uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-4"
            style={{
              background: 'var(--category-bg)',
              color: 'var(--category-text)',
              border: '1px solid var(--category-border)',
            }}
          >
            {category}
          </span>
          <h2
            className="font-[family-name:var(--font-playfair)] text-3xl md:text-5xl leading-tight mb-4"
            style={{ color: 'var(--foreground)' }}
          >
            {title}
          </h2>
          <p className="text-sm mb-4" style={{ color: 'var(--muted-text)' }}>
            {new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--foreground)', opacity: 0.85 }}>
            {excerpt}
          </p>
          <Link
            href={`/posts/${slug}`}
            className="inline-flex items-center text-sm uppercase tracking-[0.15em] font-medium transition-colors hover:opacity-80"
            style={{ color: 'var(--accent)' }}
          >
            Read Story →
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
