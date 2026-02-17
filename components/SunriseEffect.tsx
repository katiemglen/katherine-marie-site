'use client';

import { useEffect, useState } from 'react';

export default function SunriseEffect() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) { setDone(true); return; }
    const t = setTimeout(() => setDone(true), 900);
    return () => clearTimeout(t);
  }, []);

  if (done) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none sunrise-effect" />
  );
}
