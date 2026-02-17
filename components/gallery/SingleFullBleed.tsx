'use client';

import { motion } from 'framer-motion';
import { wpImage, IMG_SIZES } from '@/lib/optimizeImage';

interface Props {
  images: string[];
  onImageClick: (index: number) => void;
}

export default function SingleFullBleed({ images, onImageClick }: Props) {
  return (
    <motion.div
      className="my-8 -mx-4 md:-mx-8 lg:-mx-16 cursor-pointer overflow-hidden rounded-xl"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      onClick={() => onImageClick(0)}
    >
      <img src={wpImage(images[0], IMG_SIZES.fullBleed)} alt="" loading="lazy" className="w-full hover:scale-[1.02] transition-transform duration-700" />
    </motion.div>
  );
}
