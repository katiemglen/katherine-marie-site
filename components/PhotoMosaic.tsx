'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import TiltCard from './TiltCard';

interface MosaicItem {
  slug: string;
  title: string;
  image: string;
  mood?: { emoji: string; label: string };
}

export default function PhotoMosaic({ images }: { images: MosaicItem[] }) {
  return (
    <section className="px-1 md:px-2 py-12 md:py-20 photo-enhanced" style={{ background: 'var(--section-alt-bg)' }}>
      <div
        className="grid grid-cols-2 md:grid-cols-3 auto-rows-[200px] md:auto-rows-[280px]"
        style={{ gap: '4px' }}
      >
        {images.map((item, i) => {
          const tall = i % 4 === 0 || i % 7 === 3;
          return (
            <TiltCard
              key={item.slug + i}
              className={`relative overflow-hidden ${tall ? 'row-span-2' : ''}`}
            >
              <Link
                href={`/posts/${item.slug}`}
                className="relative block w-full h-full overflow-hidden group"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    background: 'rgba(0,0,0,0.2)',
                  }}
                >
                  <span className="text-white text-sm md:text-base font-medium text-center px-4">
                    {item.mood && <span className="mr-1">{item.mood.emoji}</span>}
                    {item.title} →
                  </span>
                </div>
              </Link>
            </TiltCard>
          );
        })}
      </div>
    </section>
  );
}
