'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

interface FloatingEmojiProps {
  emoji: string[];
  children: ReactNode;
}

interface EmojiParticle {
  id: number;
  emoji: string;
  x: number;
  startY: number;
  offset: number;
}

let emojiId = 0;

export default function FloatingEmoji({ emoji, children }: FloatingEmojiProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<EmojiParticle[]>([]);
  const triggered = useRef(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsDesktop(window.matchMedia('(hover: hover)').matches);
  }, []);

  useEffect(() => {
    if (!isDesktop || !ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered.current) {
          triggered.current = true;
          const count = 3 + Math.floor(Math.random() * 3);
          const newParticles: EmojiParticle[] = [];
          for (let i = 0; i < count; i++) {
            newParticles.push({
              id: emojiId++,
              emoji: emoji[Math.floor(Math.random() * emoji.length)],
              x: 5 + Math.random() * 90,
              startY: 0,
              offset: Math.random() * 500,
            });
          }
          setParticles(newParticles);
          setTimeout(() => setParticles([]), 2500);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [isDesktop, emoji]);

  return (
    <div ref={ref} className="relative">
      {children}
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute pointer-events-none text-2xl z-40"
          style={{
            left: `${p.x}%`,
            bottom: 0,
            animation: `floatUp 2s ease-out ${p.offset}ms forwards`,
          }}
        >
          {p.emoji}
        </span>
      ))}
      <style jsx>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 1;
          }
          100% {
            transform: translateY(-120px) translateX(${Math.random() > 0.5 ? '' : '-'}${10 + Math.random() * 20}px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
