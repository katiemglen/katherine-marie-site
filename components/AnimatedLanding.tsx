'use client';

import { motion } from 'framer-motion';
import { fadeUpLanding, staggerContainer, landingTransition } from '@/lib/animations';
import { ReactNode } from 'react';

export function AnimatedHero({ children }: { children: ReactNode }) {
  return (
    <motion.div
      className="relative text-center max-w-3xl"
      initial="hidden"
      animate="visible"
      variants={staggerContainer(120)}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedHeading({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.h1
      className={`will-animate ${className}`}
      variants={fadeUpLanding}
      transition={landingTransition}
    >
      {children}
    </motion.h1>
  );
}

export function AnimatedText({ children, className = '', style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <motion.p
      className={`will-animate ${className}`}
      style={style}
      variants={fadeUpLanding}
      transition={landingTransition}
    >
      {children}
    </motion.p>
  );
}

export function AnimatedH2({ children, className = '', style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <motion.h2
      className={`will-animate ${className}`}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUpLanding}
      transition={landingTransition}
    >
      {children}
    </motion.h2>
  );
}

export function StaggerGrid({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={staggerContainer(100)}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={`will-animate ${className}`}
      variants={fadeUpLanding}
      transition={landingTransition}
    >
      {children}
    </motion.div>
  );
}
