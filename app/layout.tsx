import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import ThemeProvider from "@/components/ThemeProvider";
import Navigation from "@/components/Navigation";
import ScrollToTop from "@/components/ScrollToTop";
import CursorSparkle from "@/components/CursorSparkle";
import WelcomePopup from "@/components/WelcomePopup";
import { r2Image } from "@/lib/r2";
import { Analytics } from "@vercel/analytics/next";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL("https://katherinemariecreative.com"),
  title: "Katherine Marie — Adventure Memories",
  description: "Travel stories from road trips across America",
  openGraph: {
    title: "Katherine Marie Creative",
    description: "Travel stories from road trips across America",
    type: "website",
    images: ["/images/peggys-cove/20190509_125233.jpg"],
  },
  twitter: {
    card: "summary_large_image",
  },
};

const FOOTER_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/welcome', label: 'Welcome' },
  { href: '/trips/west-coast-2016', label: 'West Coast' },
  { href: '/trips/east-coast-2019', label: 'East Coast' },
  { href: '/moods', label: 'Moods' },
  { href: '/stats', label: 'Stats' },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var t = localStorage.getItem('km-theme');
                  if (!t) {
                    t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  document.documentElement.setAttribute('data-theme', t);
                } catch(e) {
                  document.documentElement.setAttribute('data-theme', 'light');
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`${playfair.variable} ${inter.variable} font-[family-name:var(--font-inter)] antialiased min-h-screen`}>
        <ThemeProvider>
          <Navigation />
          <WelcomePopup />
          <main className="min-h-screen">{children}</main>
          <footer className="relative py-12 md:py-16" style={{ color: 'var(--muted-text)' }}>
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'color-mix(in srgb, var(--accent) 8%, transparent)' }} />
            
            <div className="flex flex-col items-center">
              <Link href="/">
                <img
                  src={r2Image("/images/logo-rectangle.png")}
                  alt="Katherine Marie — Adventure Memories"
                  className="w-[216px] h-auto"
                  style={{ filter: 'var(--footer-logo-filter, none)' }}
                />
              </Link>

              <nav className="mt-6 flex items-center text-[11px] tracking-[0.15em] uppercase">
                {FOOTER_LINKS.map((link, i) => (
                  <span key={link.href} className="flex items-center">
                    {i > 0 && (
                      <span className="mx-2 text-[0.4em]" style={{ color: 'var(--accent)', opacity: 0.5 }}>✦</span>
                    )}
                    <Link href={link.href} className="hover:text-[var(--accent)] transition-colors" style={{ color: 'var(--muted-text)' }}>
                      {link.label}
                    </Link>
                  </span>
                ))}
              </nav>

              <p className="mt-4 text-[11px]" style={{ color: 'var(--muted-text)', opacity: 0.6 }}>
                © 2026 Katherine Marie — Adventure Memories
              </p>
            </div>
          </footer>
          <ScrollToTop />
          <CursorSparkle />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
