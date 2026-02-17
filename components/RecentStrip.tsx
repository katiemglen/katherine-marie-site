'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import TiltCard from './TiltCard';

interface StripPost {
  slug: string;
  title: string;
  date: string;
  image: string;
  mood?: { emoji: string; label: string };
}

export default function RecentStrip({ posts }: { posts: StripPost[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) el.addEventListener('scroll', checkScroll, { passive: true });
    return () => el?.removeEventListener('scroll', checkScroll);
  }, []);

  const scroll = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 320, behavior: 'smooth' });
  };

  return (
    <section className="py-16 md:py-24 photo-enhanced">
      <h2
        className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl px-6 md:px-12 mb-8"
        style={{ color: 'var(--foreground)' }}
      >
        Recent Adventures
      </h2>

      <div className="relative group/strip">
        {canScrollLeft && (
          <button
            onClick={() => scroll(-1)}
            className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full opacity-0 group-hover/strip:opacity-100 transition-opacity cursor-pointer"
            style={{ background: 'var(--glass-bg)', backdropFilter: 'blur(8px)', border: '1px solid var(--glass-border)' }}
          >
            <span style={{ color: 'var(--foreground)' }}>←</span>
          </button>
        )}
        {canScrollRight && (
          <button
            onClick={() => scroll(1)}
            className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full opacity-0 group-hover/strip:opacity-100 transition-opacity cursor-pointer"
            style={{ background: 'var(--glass-bg)', backdropFilter: 'blur(8px)', border: '1px solid var(--glass-border)' }}
          >
            <span style={{ color: 'var(--foreground)' }}>→</span>
          </button>
        )}

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto px-6 md:px-12 pb-4"
          style={{
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {posts.map((post) => (
            <TiltCard
              key={post.slug}
              className="flex-shrink-0 w-[260px] md:w-[300px]"
            >
              <Link
                href={`/posts/${post.slug}`}
                className="relative block rounded-xl overflow-hidden group transition-all duration-300 hover:-translate-y-1"
                style={{
                  aspectRatio: '3/4',
                  scrollSnapAlign: 'start',
                  border: '1px solid rgba(var(--accent-rgb), 0.2)',
                  background: 'linear-gradient(135deg, rgba(var(--accent-rgb), 0.05), rgba(var(--accent-rgb), 0.02))',
                  boxShadow: '0 4px 24px rgba(var(--accent-rgb), 0.1)',
                }}
              >
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {/* Mood tag */}
                {post.mood && (
                  <span
                    className="absolute top-3 left-3 px-2 py-1 rounded-full text-[10px] font-medium z-10"
                    style={{
                      background: 'rgba(var(--accent-rgb), 0.15)',
                      backdropFilter: 'blur(8px)',
                      color: 'var(--accent)',
                      border: '1px solid rgba(var(--accent-rgb), 0.2)',
                    }}
                  >
                    {post.mood.emoji} {post.mood.label}
                  </span>
                )}
                <div
                  className="absolute bottom-0 left-0 right-0 p-5"
                  style={{
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    background: 'rgba(0,0,0,0.25)',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  <h3 className="text-white text-sm md:text-base font-medium leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-white/60 text-xs mt-1">
                    {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </Link>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
