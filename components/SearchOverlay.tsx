'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { search, type SearchResult } from '@/lib/searchIndex';

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

function HighlightedSnippet({ snippet, query }: { snippet: string; query: string }) {
  if (!query || query.length < 2) return <span>{snippet}</span>;

  const lower = snippet.toLowerCase();
  const q = query.toLowerCase();
  const parts: { text: string; highlight: boolean }[] = [];
  let lastIndex = 0;

  let idx = lower.indexOf(q);
  while (idx !== -1) {
    if (idx > lastIndex) {
      parts.push({ text: snippet.slice(lastIndex, idx), highlight: false });
    }
    parts.push({ text: snippet.slice(idx, idx + q.length), highlight: true });
    lastIndex = idx + q.length;
    idx = lower.indexOf(q, lastIndex);
  }
  if (lastIndex < snippet.length) {
    parts.push({ text: snippet.slice(lastIndex), highlight: false });
  }

  return (
    <span>
      {parts.map((part, i) =>
        part.highlight ? (
          <mark
            key={i}
            style={{
              background: 'rgba(var(--accent-rgb), 0.2)',
              color: 'var(--accent)',
              padding: '2px 4px',
              borderRadius: '4px',
            }}
          >
            {part.text}
          </mark>
        ) : (
          <span key={i}>{part.text}</span>
        )
      )}
    </span>
  );
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setQuery('');
      setResults([]);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    if (query.trim().length >= 2) {
      setResults(search(query));
    } else {
      setResults([]);
    }
  }, [query]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === overlayRef.current) onClose();
    },
    [onClose]
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[90] flex flex-col items-center"
          style={{
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
          onClick={handleBackdropClick}
          onKeyDown={handleKeyDown}
        >
          {/* Search container */}
          <motion.div
            initial={{ y: -30, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -20, opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-full max-w-2xl mt-[10vh] mx-4"
          >
            {/* Search input card */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                boxShadow: '0 24px 80px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
              }}
            >
              <div className="flex items-center px-5 py-4 gap-3">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search posts, places, food..."
                  className="flex-1 bg-transparent outline-none text-lg"
                  style={{
                    color: 'var(--foreground)',
                    fontFamily: 'var(--font-inter)',
                  }}
                />
                <div className="flex items-center gap-2">
                  <kbd
                    className="hidden sm:inline-block text-[10px] px-1.5 py-0.5 rounded"
                    style={{
                      background: 'rgba(var(--accent-rgb), 0.1)',
                      color: 'var(--muted-text)',
                      border: '1px solid rgba(var(--accent-rgb), 0.15)',
                    }}
                  >
                    ESC
                  </kbd>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer transition-colors"
                    style={{ color: 'var(--muted-text)' }}
                    aria-label="Close search"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>

            {/* Results */}
            {query.trim().length >= 2 && (
              <div
                className="mt-3 rounded-2xl overflow-hidden max-h-[60vh] overflow-y-auto"
                style={{
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                  boxShadow: '0 16px 60px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08)',
                }}
              >
                {results.length === 0 ? (
                  <div className="px-6 py-10 text-center" style={{ color: 'var(--muted-text)' }}>
                    <p className="text-lg mb-1">No results found</p>
                    <p className="text-sm opacity-70">Try a different search term</p>
                  </div>
                ) : (
                  <div className="py-2">
                    {results.map((result, i) => (
                      <motion.div
                        key={result.slug}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03, duration: 0.2 }}
                      >
                        <Link
                          href={`/posts/${result.slug}`}
                          onClick={onClose}
                          className="flex items-start gap-4 px-5 py-3 transition-colors"
                          style={{ textDecoration: 'none' }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.background = 'rgba(var(--accent-rgb), 0.06)';
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.background = 'transparent';
                          }}
                        >
                          {result.heroImage && (
                            <img
                              src={result.heroImage}
                              alt=""
                              className="w-14 h-14 rounded-lg object-cover shrink-0"
                              style={{
                                border: '1px solid var(--glass-border)',
                                filter: 'none',
                              }}
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <div
                              className="font-medium text-sm truncate"
                              style={{ color: 'var(--foreground)' }}
                            >
                              <HighlightedSnippet snippet={result.title} query={query} />
                            </div>
                            <div
                              className="text-xs mt-0.5 mb-1"
                              style={{ color: 'var(--accent)', opacity: 0.8 }}
                            >
                              {formatDate(result.date)}
                            </div>
                            <div
                              className="text-xs leading-relaxed line-clamp-2"
                              style={{ color: 'var(--muted-text)' }}
                            >
                              <HighlightedSnippet snippet={result.snippet} query={query} />
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Hint when empty */}
            {query.trim().length < 2 && (
              <div className="mt-4 text-center" style={{ color: 'rgba(255,255,255,0.4)' }}>
                <p className="text-sm">Type at least 2 characters to search</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook for Ctrl+K / Cmd+K
export function useSearchShortcut(onOpen: () => void) {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpen();
      }
    }
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onOpen]);
}
