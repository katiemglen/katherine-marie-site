import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import ThemeProvider from "@/components/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";
import ScrollToTop from "@/components/ScrollToTop";
import NatureParticles from "@/components/NatureParticles";
import SunriseEffect from "@/components/SunriseEffect";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Katherine Marie — Adventure Memories",
  description: "Travel stories from road trips across America",
};

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
          <nav className="fixed top-0 w-full z-50 glass px-6 py-4 flex items-center justify-between">
            <Link href="/" className="font-[family-name:var(--font-playfair)] text-xl transition" style={{ color: 'var(--heading-color)' }}>
              Katherine Marie
            </Link>
            <div className="flex gap-6 text-sm" style={{ color: 'var(--muted-text)' }}>
              <Link href="/" className="hover:text-[var(--accent)] transition">Home</Link>
              <Link href="/trips/west-coast-2016" className="hover:text-[var(--accent)] transition">West Coast</Link>
              <Link href="/trips/east-coast-2019" className="hover:text-[var(--accent)] transition">East Coast</Link>
              <Link href="/about" className="hover:text-[var(--accent)] transition">About</Link>
            </div>
          </nav>
          <main className="pt-20 min-h-screen">{children}</main>
          <footer className="text-center py-8 text-sm border-t" style={{ color: 'var(--muted-text)', borderColor: 'var(--card-border)' }}>
            © {new Date().getFullYear()} Katherine Marie — Adventure Memories
          </footer>
          <ThemeToggle />
          <ScrollToTop />
          <NatureParticles />
          <SunriseEffect />
        </ThemeProvider>
      </body>
    </html>
  );
}
