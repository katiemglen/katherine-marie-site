'use client';

import { motion } from 'framer-motion';
import { wpImage, IMG_SIZES } from '@/lib/optimizeImage';
import { fadeInScale, defaultTransition } from '@/lib/animations';
import TiltCard from '../TiltCard';

interface Props {
  images: string[];
  onImageClick: (index: number) => void;
}

export default function SingleFullBleed({ images, onImageClick }: Props) {
  return (
    <motion.div
      className="my-8 -mx-4 md:-mx-8 lg:-mx-16"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={fadeInScale}
      transition={defaultTransition}
    >
      <TiltCard className="cursor-pointer overflow-hidden rounded-xl will-animate relative group">
        <img src={wpImage(images[0], IMG_SIZES.fullBleed)} alt="" loading="lazy" className="w-full hover:scale-[1.02] transition-transform duration-700" onClick={() => onImageClick(0)} />
      </TiltCard>
    </motion.div>
  );
}
