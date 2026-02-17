'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface MosaicItem {
  slug: string;
  title: string;
  image: string;
}

export default function PhotoMosaic({ images }: { images: MosaicItem[] }) {
  return (
    <section className="px-1 md:px-2 py-12 md:py-20" style={{ background: 'var(--section-alt-bg)' }}>
      <div
        className="grid grid-cols-2 md:grid-cols-3 auto-rows-[200px] md:auto-rows-[280px]"
        style={{ gap: '4px' }}
      >
        {images.map((item, i) => {
          const tall = i % 4 === 0 || i % 7 === 3;
          return (
            <Link
              key={item.slug + i}
              href={`/posts/${item.slug}`}
              className={`relative overflow-hidden group ${tall ? 'row-span-2' : ''}`}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                <span className="text-white text-sm md:text-base font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center px-4">
                  {item.title} →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
