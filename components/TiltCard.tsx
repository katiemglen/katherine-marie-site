'use client';

import { useRef, useState, useEffect, type ReactNode } from 'react';
import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
}

export default function TiltCard({ children, className = '', maxTilt = 12 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { stiffness: 200, damping: 20 };
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [maxTilt, -maxTilt]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-maxTilt, maxTilt]), springConfig);

  useEffect(() => {
    setIsDesktop(window.matchMedia('(hover: hover)').matches);
  }, []);

  if (!isDesktop) {
    return <div className={className}>{children}</div>;
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        perspective: 800,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          scale: isHovering ? 1.03 : 1,
          boxShadow: isHovering
            ? '0 20px 40px rgba(0,0,0,0.15)'
            : '0 0px 0px rgba(0,0,0,0)',
        }}
        transition={{ scale: { type: 'spring', stiffness: 200, damping: 20 }, boxShadow: { duration: 0.3 } }}
      >
        {children}
        {/* Dynamic light reflection */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            borderRadius: 'inherit',
            background: useTransform(
              [mouseX, mouseY],
              ([x, y]: number[]) =>
                `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.15) 0%, transparent 60%)`
            ),
            opacity: isHovering ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />
      </motion.div>
    </motion.div>
  );
}
