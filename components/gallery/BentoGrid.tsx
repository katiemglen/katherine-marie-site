'use client';

import { motion } from 'framer-motion';
import { wpImage, IMG_SIZES } from '@/lib/optimizeImage';
import { staggerContainer, defaultTransition } from '@/lib/animations';
import ProgressiveImage from '../ProgressiveImage';

interface Props {
  images: string[];
  onImageClick: (index: number) => void;
  sectionIndex?: number;
}

const tileVariant = {
  hidden: { opacity: 0, scale: 0.92, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0 },
};

/*
  Pattern A (hero left):   hero spans col 1-2, row 1-2; rest fill col 3 + row 3
  Pattern B (hero right):  hero spans col 2-3, row 1-2; rest fill col 1 + row 3
  Pattern C (hero center): hero spans col 2, row 1-2; rest fill col 1,3 + row 3 (8+ images)
*/

interface TileStyle {
  gridColumn: string;
  gridRow: string;
}

function getPatternTiles(pattern: 'A' | 'B' | 'C', count: number): TileStyle[] {
  const tiles: TileStyle[] = [];

  if (pattern === 'A') {
    // Hero: col 1-2, row 1-2
    tiles.push({ gridColumn: '1 / 3', gridRow: '1 / 3' });
    // Small tiles fill remaining slots
    tiles.push({ gridColumn: '3 / 4', gridRow: '1 / 2' });
    tiles.push({ gridColumn: '3 / 4', gridRow: '2 / 3' });
    // Row 3
    tiles.push({ gridColumn: '1 / 2', gridRow: '3 / 4' });
    tiles.push({ gridColumn: '2 / 3', gridRow: '3 / 4' });
    tiles.push({ gridColumn: '3 / 4', gridRow: '3 / 4' });
    // Extra rows (pairs of 3)
    for (let i = 6; i < count; i++) {
      const col = ((i - 6) % 3) + 1;
      const row = Math.floor((i - 6) / 3) + 4;
      tiles.push({ gridColumn: `${col} / ${col + 1}`, gridRow: `${row} / ${row + 1}` });
    }
  } else if (pattern === 'B') {
    // Hero: col 2-3, row 1-2
    tiles.push({ gridColumn: '2 / 4', gridRow: '1 / 3' });
    tiles.push({ gridColumn: '1 / 2', gridRow: '1 / 2' });
    tiles.push({ gridColumn: '1 / 2', gridRow: '2 / 3' });
    tiles.push({ gridColumn: '1 / 2', gridRow: '3 / 4' });
    tiles.push({ gridColumn: '2 / 3', gridRow: '3 / 4' });
    tiles.push({ gridColumn: '3 / 4', gridRow: '3 / 4' });
    for (let i = 6; i < count; i++) {
      const col = ((i - 6) % 3) + 1;
      const row = Math.floor((i - 6) / 3) + 4;
      tiles.push({ gridColumn: `${col} / ${col + 1}`, gridRow: `${row} / ${row + 1}` });
    }
  } else {
    // Pattern C: hero center col 2, row 1-2
    tiles.push({ gridColumn: '2 / 3', gridRow: '1 / 3' });
    tiles.push({ gridColumn: '1 / 2', gridRow: '1 / 2' });
    tiles.push({ gridColumn: '3 / 4', gridRow: '1 / 2' });
    tiles.push({ gridColumn: '1 / 2', gridRow: '2 / 3' });
    tiles.push({ gridColumn: '3 / 4', gridRow: '2 / 3' });
    // Row 3
    tiles.push({ gridColumn: '1 / 2', gridRow: '3 / 4' });
    tiles.push({ gridColumn: '2 / 3', gridRow: '3 / 4' });
    tiles.push({ gridColumn: '3 / 4', gridRow: '3 / 4' });
    for (let i = 8; i < count; i++) {
      const col = ((i - 8) % 3) + 1;
      const row = Math.floor((i - 8) / 3) + 4;
      tiles.push({ gridColumn: `${col} / ${col + 1}`, gridRow: `${row} / ${row + 1}` });
    }
  }

  return tiles.slice(0, count);
}

function pickPattern(sectionIndex: number, count: number): 'A' | 'B' | 'C' {
  if (count >= 8) {
    const options: ('A' | 'B' | 'C')[] = ['A', 'B', 'C'];
    return options[sectionIndex % 3];
  }
  return sectionIndex % 2 === 0 ? 'A' : 'B';
}

export default function BentoGrid({ images, onImageClick, sectionIndex = 0 }: Props) {
  const pattern = pickPattern(sectionIndex, images.length);
  const tiles = getPatternTiles(pattern, images.length);

  return (
    <motion.div
      className="my-8"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={staggerContainer(70)}
    >
      {/* Desktop: CSS Grid 3-col with spanning */}
      <div
        className="hidden md:grid gap-2"
        style={{ gridTemplateColumns: 'repeat(3, 1fr)', gridAutoRows: '180px' }}
      >
        {images.map((src, i) => {
          const tile = tiles[i];
          const isHero = i === 0;
          return (
            <motion.div
              key={src}
              className="relative overflow-hidden rounded-xl cursor-pointer group"
              style={{
                gridColumn: tile?.gridColumn,
                gridRow: tile?.gridRow,
                border: '1px solid var(--glass-border)',
              }}
              variants={tileVariant}
              transition={{ ...defaultTransition, delay: i * 0.05 }}
              whileHover={{ scale: 1.03 }}
              onClick={() => onImageClick(i)}
            >
              <ProgressiveImage
                src={wpImage(src, isHero ? IMG_SIZES.fullBleed : IMG_SIZES.gallery)}
                alt=""
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {isHero && (
                <div
                  className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none"
                  style={{
                    background: 'linear-gradient(to top, rgba(0,0,0,0.35), transparent)',
                  }}
                />
              )}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.15)',
                  borderRadius: '0.75rem',
                }}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Mobile: simple 2-col grid, no spanning */}
      <div className="grid md:hidden grid-cols-2 gap-2">
        {images.map((src, i) => (
          <motion.div
            key={src}
            className="relative overflow-hidden rounded-xl cursor-pointer group aspect-square"
            style={{ border: '1px solid var(--glass-border)' }}
            variants={tileVariant}
            transition={{ ...defaultTransition, delay: i * 0.04 }}
            onClick={() => onImageClick(i)}
          >
            <ProgressiveImage
              src={wpImage(src, IMG_SIZES.gallery)}
              alt=""
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
