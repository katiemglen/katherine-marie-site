'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeProvider';
import SearchOverlay, { useSearchShortcut } from './SearchOverlay';
import { r2Image } from '../lib/r2';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/welcome', label: 'Welcome' },
  { href: '/trips/west-coast-2016', label: 'West Coast' },
  { href: '/trips/east-coast-2019', label: 'East Coast' },
  { href: '/moods', label: 'Moods' },
  { href: '/stats', label: 'Stats' },
];

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function ThemeIcon({ theme }: { theme: string }) {
  return (
    <motion.div
      animate={{ rotate: theme === 'dark' ? 180 : 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-center"
    >
      {theme === 'dark' ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </motion.div>
  );
}

export default function Navigation() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [scrollY, setScrollY] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useSearchShortcut(() => setSearchOpen(true));

  const isPostPage = pathname.startsWith('/posts/');
  const isHomePage = pathname === '/';
  const isTripPage = pathname.startsWith('/trips/');
  const isPostOrHome = isPostPage || isHomePage || isTripPage;
  const isCompact = scrollY > 200;
  const isTransparent = isPostOrHome && !isCompact;

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const linkColor = (active: boolean) => {
    if (isTransparent) return '#ffffff';
    return active ? 'var(--accent)' : 'var(--muted-text)';
  };

  const separatorStyle = (transparent: boolean): React.CSSProperties => ({
    color: transparent ? 'rgba(255,255,255,0.5)' : 'var(--accent)',
    opacity: 0.5,
  });

  const hamburgerColor = isTransparent ? '#fff' : 'var(--foreground)';

  // ─── COMPACT NAV ───
  if (isCompact) {
    return (
      <>
        <motion.header
          initial={{ y: -60 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed top-0 w-full z-50 flex items-center px-4 md:px-8"
          style={{
            height: 56,
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderBottom: '1px solid rgba(var(--accent-rgb), 0.12)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 4px 24px rgba(0,0,0,0.08)',
          }}
        >
          {/* Wordmark left */}
          <Link href="/" className="shrink-0">
            <motion.img
              key="rect"
              src={r2Image("/images/logo-rectangle.png")}
              alt="Katherine Marie"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              style={{
                width: 156,
                height: 'auto',
                filter: theme === 'dark' ? 'brightness(0) invert(1)' : 'none',
              }}
            />
          </Link>

          {/* Desktop links centered */}
          <nav className="hidden md:flex flex-1 items-center justify-center">
            {NAV_LINKS.map((link, i) => (
              <span key={link.href} className="flex items-center">
                {i > 0 && (
                  <span className="mx-2 md:mx-3 text-[0.5em]" style={separatorStyle(false)}>✦</span>
                )}
                <Link
                  href={link.href}
                  className="uppercase tracking-[0.25em] text-[11px] md:text-xs transition-colors hover:!color-[var(--accent)]"
                  style={{ color: pathname === link.href ? 'var(--accent)' : 'var(--muted-text)' }}
                  onMouseEnter={(e) => { (e.target as HTMLElement).style.color = 'var(--accent)'; }}
                  onMouseLeave={(e) => { (e.target as HTMLElement).style.color = pathname === link.href ? 'var(--accent)' : 'var(--muted-text)'; }}
                >
                  {link.label}
                </Link>
              </span>
            ))}
          </nav>

          {/* Search + Theme toggle right (desktop) */}
          <div className="hidden md:flex items-center gap-1 shrink-0">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center justify-center w-9 h-9 cursor-pointer"
              style={{ color: 'var(--muted-text)' }}
              aria-label="Search"
            >
              <SearchIcon />
            </button>
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-9 h-9 cursor-pointer"
              style={{ color: 'var(--muted-text)' }}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              <ThemeIcon theme={theme} />
            </button>
          </div>

          {/* Mobile hamburger right */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden ml-auto flex flex-col justify-center items-center w-11 h-11 gap-[5px] cursor-pointer"
            aria-label="Open menu"
          >
            <span className="block w-5 h-[1.5px]" style={{ background: 'var(--foreground)' }} />
            <span className="block w-5 h-[1.5px]" style={{ background: 'var(--foreground)' }} />
            <span className="block w-5 h-[1.5px]" style={{ background: 'var(--foreground)' }} />
          </button>
        </motion.header>

        <MobileOverlay open={mobileOpen} onClose={() => setMobileOpen(false)} pathname={pathname} theme={theme} toggleTheme={toggleTheme} onSearchOpen={() => { setMobileOpen(false); setSearchOpen(true); }} />
        <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      </>
    );
  }

  // ─── FULL NAV ───
  return (
    <>
      <header
        className="fixed top-0 w-full z-50"
        style={{
          background: isTransparent ? 'transparent' : 'var(--background)',
          borderBottom: isTransparent ? 'none' : '1px solid color-mix(in srgb, var(--accent) 8%, transparent)',
        }}
      >
        {/* Logo area */}
        <div className="flex items-center justify-center py-6 md:py-8 relative">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden absolute right-4 top-1/2 -translate-y-1/2 flex flex-col justify-center items-center w-11 h-11 gap-[5px] cursor-pointer"
            aria-label="Open menu"
          >
            <span className="block w-5 h-[1.5px]" style={{ background: hamburgerColor }} />
            <span className="block w-5 h-[1.5px]" style={{ background: hamburgerColor }} />
            <span className="block w-5 h-[1.5px]" style={{ background: hamburgerColor }} />
          </button>

          <Link href="/">
            <img
              src={r2Image("/images/logo-rectangle.png")}
              alt="Katherine Marie"
              className="h-[48px] md:h-[60px] w-auto"
              style={{
                filter: (isTransparent || theme === 'dark') ? 'brightness(0) invert(1)' : 'none',
              }}
            />
          </Link>
        </div>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center justify-center pb-4 md:pb-6 relative">
          {NAV_LINKS.map((link, i) => (
            <span key={link.href} className="flex items-center">
              {i > 0 && (
                <span className="mx-3 md:mx-4 text-[0.5em]" style={separatorStyle(isTransparent)}>✦</span>
              )}
              <Link
                href={link.href}
                className="uppercase tracking-[0.25em] text-[11px] md:text-xs transition-colors"
                style={{
                  color: linkColor(pathname === link.href),
                  textShadow: isTransparent ? '0 1px 4px rgba(0,0,0,0.4)' : 'none',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.color = isTransparent ? '#ffffff' : 'var(--accent)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.color = linkColor(pathname === link.href);
                }}
              >
                {link.label}
              </Link>
            </span>
          ))}
          <span className="mx-3 md:mx-4 text-[0.5em]" style={separatorStyle(isTransparent)}>✦</span>
          <button
            onClick={() => setSearchOpen(true)}
            className="cursor-pointer uppercase tracking-[0.25em] text-[11px] md:text-xs transition-colors flex items-center gap-1.5"
            style={{
              color: isTransparent ? 'rgba(255,255,255,0.8)' : 'var(--muted-text)',
              textShadow: isTransparent ? '0 1px 4px rgba(0,0,0,0.4)' : 'none',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = isTransparent ? '#ffffff' : 'var(--accent)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = isTransparent ? 'rgba(255,255,255,0.8)' : 'var(--muted-text)';
            }}
            aria-label="Search"
          >
            <SearchIcon />
          </button>
        </nav>
      </header>

      <MobileOverlay open={mobileOpen} onClose={() => setMobileOpen(false)} pathname={pathname} theme={theme} toggleTheme={toggleTheme} onSearchOpen={() => { setMobileOpen(false); setSearchOpen(true); }} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

// ─── MOBILE OVERLAY ───
function MobileOverlay({
  open,
  onClose,
  pathname,
  theme,
  toggleTheme,
  onSearchOpen,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
  theme: string;
  toggleTheme: () => void;
  onSearchOpen?: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[80] flex flex-col items-center justify-center"
          style={{
            background: 'color-mix(in srgb, var(--background) 98%, transparent)',
            backgroundImage: 'radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--accent) 3%, transparent), transparent 70%)',
          }}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-11 h-11 flex items-center justify-center text-2xl cursor-pointer"
            style={{ color: 'var(--foreground)' }}
            aria-label="Close menu"
          >
            ✕
          </button>

          {/* Logo */}
          <img
            src={r2Image("/images/logo-roadtrip.png")}
            alt="Katherine Marie"
            className="mb-10"
            style={{
              height: 120,
              width: 'auto',
              filter: theme === 'dark' ? 'brightness(0) invert(1)' : 'none',
            }}
          />

          {/* Links */}
          <nav className="flex flex-col items-center">
            {NAV_LINKS.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.05, duration: 0.3 }}
                className="flex flex-col items-center"
              >
                {i > 0 && (
                  <span className="text-[0.5em] my-1" style={{ color: 'var(--accent)', opacity: 0.4 }}>✦</span>
                )}
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="text-2xl uppercase tracking-[0.2em] py-4 transition-colors"
                  style={{ color: pathname === link.href ? 'var(--accent)' : 'var(--foreground)' }}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Search + Theme toggle */}
          <div className="mt-12 flex flex-col items-center gap-6">
            <button
              onClick={onSearchOpen}
              className="flex items-center gap-3 text-sm uppercase tracking-[0.15em] cursor-pointer"
              style={{ color: 'var(--muted-text)' }}
            >
              <SearchIcon />
              <span>Search</span>
            </button>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-3 text-sm uppercase tracking-[0.15em] cursor-pointer"
              style={{ color: 'var(--muted-text)' }}
            >
              <ThemeIcon theme={theme} />
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
