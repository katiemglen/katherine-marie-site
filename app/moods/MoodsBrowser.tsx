'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { staggerContainer, fadeUp, landingTransition } from '@/lib/animations';

const MOOD_CATEGORIES = [
  { emoji: '🌊', label: 'Beach Vibes' },
  { emoji: '⛰️', label: 'Mountain Air' },
  { emoji: '🌧️', label: 'Rainy Adventure' },
  { emoji: '🍽️', label: 'Foodie Stop' },
  { emoji: '🏙️', label: 'City Explorer' },
  { emoji: '🏕️', label: 'Car Life' },
  { emoji: '😤', label: 'Chad Being Chad' },
  { emoji: '🛤️', label: 'On the Road' },
];

interface MoodPost {
  slug: string;
  title: string;
  image: string;
  mood: string;
  moodEmoji: string;
}

export default function MoodsBrowser({ posts }: { posts: MoodPost[] }) {
  const [activeMood, setActiveMood] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!activeMood) return posts;
    return posts.filter(p => p.mood === activeMood);
  }, [activeMood, posts]);

  const moodsWithCounts = useMemo(() => {
    return MOOD_CATEGORIES.map(m => ({
      ...m,
      count: posts.filter(p => p.mood === m.label).length,
    })).filter(m => m.count > 0);
  }, [posts]);

  return (
    <div className="pt-32 md:pt-40 pb-16 px-6 max-w-6xl mx-auto">
      <motion.h1
        className="font-[family-name:var(--font-playfair)] text-3xl md:text-5xl text-center mb-3"
        style={{ color: 'var(--heading-color)' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Browse by Mood
      </motion.h1>
      <motion.p
        className="text-center mb-10 text-sm"
        style={{ color: 'var(--muted-text)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        What kind of adventure are you in the mood for?
      </motion.p>

      {/* Mood pills */}
      <motion.div
        className="flex flex-wrap justify-center gap-3 mb-12"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <button
          onClick={() => setActiveMood(null)}
          className="px-4 py-2 rounded-full text-sm transition-all cursor-pointer"
          style={{
            background: !activeMood ? 'rgba(var(--accent-rgb), 0.2)' : 'var(--glass-bg)',
            backdropFilter: 'blur(12px)',
            border: `1px solid ${!activeMood ? 'rgba(var(--accent-rgb), 0.4)' : 'var(--glass-border)'}`,
            color: !activeMood ? 'var(--accent)' : 'var(--muted-text)',
          }}
        >
          All ✨
        </button>
        {moodsWithCounts.map(m => (
          <button
            key={m.label}
            onClick={() => setActiveMood(m.label)}
            className="px-4 py-2 rounded-full text-sm transition-all cursor-pointer"
            style={{
              background: activeMood === m.label ? 'rgba(var(--accent-rgb), 0.2)' : 'var(--glass-bg)',
              backdropFilter: 'blur(12px)',
              border: `1px solid ${activeMood === m.label ? 'rgba(var(--accent-rgb), 0.4)' : 'var(--glass-border)'}`,
              color: activeMood === m.label ? 'var(--accent)' : 'var(--muted-text)',
            }}
          >
            {m.emoji} {m.label} <span style={{ opacity: 0.6 }}>({m.count})</span>
          </button>
        ))}
      </motion.div>

      {/* Post grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeMood || 'all'}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={staggerContainer(50)}
        >
          {filtered.map(post => (
            <motion.div key={post.slug} variants={fadeUp} transition={landingTransition}>
              <Link href={`/posts/${post.slug}`} className="block relative rounded-xl overflow-hidden aspect-[4/5] group">
                {post.image ? (
                  <img src={post.image} alt={post.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                ) : (
                  <div className="absolute inset-0" style={{ background: 'var(--section-alt-bg)' }} />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <span className="text-xs text-white/70">{post.moodEmoji}</span>
                  <h3 className="text-sm md:text-base font-[family-name:var(--font-playfair)] text-white leading-tight">{post.title}</h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {filtered.length === 0 && (
        <p className="text-center py-16" style={{ color: 'var(--muted-text)' }}>No posts match this mood yet.</p>
      )}
    </div>
  );
}
