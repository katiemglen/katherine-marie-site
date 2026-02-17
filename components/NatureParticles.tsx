'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  wobbleSpeed: number;
  wobbleAmp: number;
  phase: number;
  color: string;
  opacity: number;
  // firefly
  pulseSpeed: number;
  pulsePhase: number;
  baseOpacity: number;
}

const LIGHT_COLORS = ['#fbbf24', '#d4a843', '#faf6f1', '#fbbf24', '#d4a843'];
const DARK_COLORS = ['#6ee7b7', '#fbbf24', '#e0e7ff', '#6ee7b7', '#fbbf24'];

function createParticle(w: number, h: number, isDark: boolean): Particle {
  const colors = isDark ? DARK_COLORS : LIGHT_COLORS;
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    size: isDark ? 2 + Math.random() * 2 : 2 + Math.random() * 4,
    speedX: (Math.random() - 0.5) * (isDark ? 0.15 : 0.3),
    speedY: isDark ? (Math.random() - 0.5) * 0.1 : (Math.random() - 0.6) * 0.2,
    wobbleSpeed: 0.5 + Math.random() * 1.5,
    wobbleAmp: 0.3 + Math.random() * 0.7,
    phase: Math.random() * Math.PI * 2,
    color: colors[Math.floor(Math.random() * colors.length)],
    opacity: isDark ? 0.1 : 0.2 + Math.random() * 0.4,
    pulseSpeed: 2 + Math.random() * 2,
    pulsePhase: Math.random() * Math.PI * 2,
    baseOpacity: 0.1 + Math.random() * 0.6,
  };
}

export default function NatureParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let animId = 0;
    let particles: Particle[] = [];
    let lastTime = 0;
    const targetInterval = 1000 / 30; // 30fps

    const getTheme = () => document.documentElement.dataset.theme === 'dark';
    const getCount = () => window.innerWidth < 768 ? 25 : 45;
    const isPaused = () => document.body.classList.contains('overflow-hidden') || document.hidden;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const initParticles = () => {
      const isDark = getTheme();
      const count = getCount();
      particles = Array.from({ length: count }, () => createParticle(canvas.width, canvas.height, isDark));
    };

    resize();
    initParticles();

    // Watch theme changes
    const observer = new MutationObserver(() => initParticles());
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', () => {});

    const animate = (time: number) => {
      animId = requestAnimationFrame(animate);
      if (time - lastTime < targetInterval) return;
      lastTime = time;

      if (isPaused()) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      const isDark = getTheme();
      const dt = targetInterval / 1000;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.phase += p.wobbleSpeed * dt;
        p.x += p.speedX + Math.sin(p.phase) * p.wobbleAmp * dt * 10;
        p.y += p.speedY;

        // Wrap around
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;

        let opacity: number;
        if (isDark) {
          // Firefly pulse
          p.pulsePhase += (Math.PI * 2 / p.pulseSpeed) * dt;
          opacity = 0.1 + (0.6 * (0.5 + 0.5 * Math.sin(p.pulsePhase)));
        } else {
          opacity = p.opacity;
        }

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        grad.addColorStop(0, p.color);
        grad.addColorStop(1, 'transparent');
        ctx.globalAlpha = opacity;
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-30 pointer-events-none"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
}
