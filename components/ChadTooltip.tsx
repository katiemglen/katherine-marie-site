'use client';

import { useState, useRef, useEffect, type ReactNode } from 'react';

const CHAD_QUOTES = [
  "Chad has now started a tally of how many times I will kill that car on this trip.",
  "Chad went first and lead me straight down a mogul filled black diamond by mistake.",
  "Chad is still pretty salty about not having this device.",
  "Chad finally killed the car inside the national park and I sure made a big deal about it.",
  "Chad decided this was a good time to sneeze and I clung for my life as we rounded a corner.",
  "Apparently on Saturdays, Chad falls into a sour mood.",
  "Grumpy Chad hung back and calmly took in the crashing waves.",
  "Coaxing Chad as if he were a stubborn ox, I lead him up the board walk.",
  "Semi sober from being grumpy, Chad was uber thrilled to go to a place with a ton of people (not).",
  "On cue, Chad pricked himself and danced around shouting while we all laughed.",
  "Chad mentioned he was looking forward to using his Canada rated snow tires.",
  "Really Chad?",
];

function ChadSpan() {
  const [show, setShow] = useState(false);
  const [quote, setQuote] = useState('');
  const ref = useRef<HTMLSpanElement>(null);

  const handleEnter = () => {
    setQuote(CHAD_QUOTES[Math.floor(Math.random() * CHAD_QUOTES.length)]);
    setShow(true);
  };

  return (
    <span
      ref={ref}
      className="relative inline"
      onMouseEnter={handleEnter}
      onMouseLeave={() => setShow(false)}
      style={{ cursor: 'pointer', borderBottom: '1px dashed rgba(196,136,42,0.4)' }}
    >
      Chad
      {show && (
        <span
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-4 py-3 rounded-xl text-sm z-50 whitespace-normal w-64 text-center pointer-events-none"
          style={{
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            background: 'rgba(var(--accent-rgb), 0.1)',
            border: '1px solid rgba(var(--accent-rgb), 0.3)',
            color: 'var(--foreground)',
            fontStyle: 'italic',
            fontFamily: 'var(--font-playfair), serif',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          }}
        >
          &ldquo;{quote}&rdquo;
        </span>
      )}
    </span>
  );
}

export default function ChadTooltip({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !containerRef.current) return;

    const walker = document.createTreeWalker(
      containerRef.current,
      NodeFilter.SHOW_TEXT,
      null
    );

    const textNodes: Text[] = [];
    let node: Node | null;
    while ((node = walker.nextNode())) {
      if (node.textContent && /\bChad\b/.test(node.textContent)) {
        textNodes.push(node as Text);
      }
    }

    textNodes.forEach((textNode) => {
      const parts = textNode.textContent!.split(/\b(Chad)\b/);
      if (parts.length <= 1) return;

      const fragment = document.createDocumentFragment();
      parts.forEach((part) => {
        if (part === 'Chad') {
          const span = document.createElement('span');
          span.className = 'chad-tooltip-trigger';
          span.textContent = 'Chad';
          span.style.cssText = 'cursor:pointer;border-bottom:1px dashed rgba(196,136,42,0.4);position:relative;';

          let tooltip: HTMLSpanElement | null = null;

          span.addEventListener('mouseenter', () => {
            const q = CHAD_QUOTES[Math.floor(Math.random() * CHAD_QUOTES.length)];
            tooltip = document.createElement('span');
            tooltip.textContent = `\u201C${q}\u201D`;
            tooltip.style.cssText = `
              position:absolute;bottom:100%;left:50%;transform:translateX(-50%);
              margin-bottom:8px;padding:12px 16px;border-radius:12px;font-size:0.85rem;
              z-index:50;white-space:normal;width:260px;text-align:center;pointer-events:none;
              backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);
              background:rgba(var(--accent-rgb),0.1);border:1px solid rgba(var(--accent-rgb),0.3);
              color:var(--foreground);font-style:italic;font-family:var(--font-playfair),serif;
              box-shadow:0 8px 32px rgba(0,0,0,0.15);
            `;
            span.appendChild(tooltip);
          });

          span.addEventListener('mouseleave', () => {
            if (tooltip && span.contains(tooltip)) {
              span.removeChild(tooltip);
              tooltip = null;
            }
          });

          fragment.appendChild(span);
        } else {
          fragment.appendChild(document.createTextNode(part));
        }
      });

      textNode.parentNode?.replaceChild(fragment, textNode);
    });
  }, [mounted]);

  return <div ref={containerRef}>{children}</div>;
}
