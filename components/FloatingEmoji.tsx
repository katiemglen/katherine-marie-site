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
  drift: number;
  delay: number;
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
              drift: (Math.random() - 0.5) * 40,
              delay: Math.random() * 500,
            });
          }
          setParticles(newParticles);
          setTimeout(() => setParticles([]), 3000);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [isDesktop, emoji]);

  return (
    <div ref={ref} className="relative overflow-hidden">
      {children}
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute pointer-events-none text-2xl z-40 animate-[floatUp_2s_ease-out_forwards]"
          style={{
            left: `${p.x}%`,
            bottom: 0,
            animationDelay: `${p.delay}ms`,
            opacity: 0,
            ['--drift' as string]: `${p.drift}px`,
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
}
