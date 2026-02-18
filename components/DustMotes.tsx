'use client';

import { useEffect, useRef } from 'react';

export default function DustMotes() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const motes: { x: number; y: number; r: number; speed: number; sway: number; phase: number; opacity: number }[] = [];
    const COUNT = 50;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < COUNT; i++) {
      motes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 3 + 1.5,
        speed: Math.random() * 0.2 + 0.08,
        sway: Math.random() * 0.4 + 0.15,
        phase: Math.random() * Math.PI * 2,
        opacity: Math.random() * 0.5 + 0.3,
      });
    }

    const isDark = () => document.documentElement.getAttribute('data-theme') === 'dark';

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const color = isDark() ? '232, 180, 80' : '255, 220, 120';
      for (const m of motes) {
        m.y -= m.speed;
        m.x += Math.sin(m.phase) * m.sway;
        m.phase += 0.005;
        if (m.y < -10) { m.y = canvas.height + 10; m.x = Math.random() * canvas.width; }
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${m.opacity})`;
        ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      style={{ opacity: 0.85 }}
    />
  );
}
