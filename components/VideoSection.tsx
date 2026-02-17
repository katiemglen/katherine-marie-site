'use client';

import { motion } from 'framer-motion';
import { fadeIn, defaultTransition } from '@/lib/animations';

interface Props {
  src: string;
}

export default function VideoSection({ src }: Props) {
  return (
    <motion.div
      className="my-8 will-animate"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={fadeIn}
      transition={defaultTransition}
    >
      <video
        src={src}
        controls
        preload="metadata"
        playsInline
        className="w-full rounded-xl"
      />
    </motion.div>
  );
}
