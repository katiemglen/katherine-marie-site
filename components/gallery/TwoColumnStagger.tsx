'use client';

import { motion } from 'framer-motion';

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
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
      {images.map((src, i) => (
        <motion.div
          key={src}
          className={`cursor-pointer overflow-hidden rounded-xl ${i % 2 === 1 ? 'mt-8' : ''}`}
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          onClick={() => onImageClick(i)}
        >
          <img src={src} alt="" loading="lazy" className="w-full hover:scale-105 transition-transform duration-500" />
        </motion.div>
      ))}
    </motion.div>
  );
}
