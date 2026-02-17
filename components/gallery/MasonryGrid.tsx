'use client';

import { motion } from 'framer-motion';
import { wpImage, IMG_SIZES } from '@/lib/optimizeImage';
import { fadeInScale, staggerContainer, defaultTransition } from '@/lib/animations';

interface Props {
  images: string[];
  onImageClick: (index: number) => void;
}

export default function MasonryGrid({ images, onImageClick }: Props) {
  return (
    <motion.div
      className="columns-2 md:columns-3 gap-3 my-8"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={staggerContainer(60)}
    >
      {images.map((src, i) => (
        <motion.div
          key={src}
          className="break-inside-avoid mb-3 cursor-pointer overflow-hidden rounded-xl will-animate relative group"
          variants={fadeInScale}
          transition={defaultTransition}
          onClick={() => onImageClick(i)}
        >
          <img src={wpImage(src, IMG_SIZES.gallery)} alt="" loading="lazy" className="w-full hover:scale-105 transition-transform duration-500" />
        </motion.div>
      ))}
    </motion.div>
  );
}
