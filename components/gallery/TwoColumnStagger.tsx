'use client';

import { motion } from 'framer-motion';
import { wpImage, IMG_SIZES } from '@/lib/optimizeImage';
import { fadeInScale, staggerContainer, defaultTransition } from '@/lib/animations';
import TiltCard from '../TiltCard';
import ProgressiveImage from '../ProgressiveImage';

interface Props {
  images: string[];
  onImageClick: (index: number) => void;
}

export default function TwoColumnStagger({ images, onImageClick }: Props) {
  return (
    <motion.div
      className="grid grid-cols-2 gap-3 my-8"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={staggerContainer(60)}
    >
      {images.map((src, i) => (
        <motion.div
          key={src}
          className={i % 2 === 1 ? 'mt-8' : ''}
          variants={fadeInScale}
          transition={defaultTransition}
        >
          <TiltCard className="cursor-pointer overflow-hidden rounded-xl will-animate relative group">
            <ProgressiveImage src={wpImage(src, IMG_SIZES.gallery)} alt="" className="w-full hover:scale-105 transition-transform duration-500" onClick={() => onImageClick(i)} />
          </TiltCard>
        </motion.div>
      ))}
    </motion.div>
  );
}
