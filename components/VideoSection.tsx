'use client';

import { motion } from 'framer-motion';

interface Props {
  src: string;
}

export default function VideoSection({ src }: Props) {
  return (
    <motion.div
      className="my-8"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
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
