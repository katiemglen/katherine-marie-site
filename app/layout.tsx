import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Katherine Marie — Adventure Memories",
  description: "Travel stories from road trips across America",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${inter.variable} font-[family-name:var(--font-inter)] antialiased min-h-screen`}>
        <nav className="fixed top-0 w-full z-50 glass px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-[family-name:var(--font-playfair)] text-xl text-emerald-300 hover:text-emerald-200 transition">
            Katherine Marie
          </Link>
          <div className="flex gap-6 text-sm text-emerald-100/80">
            <Link href="/" className="hover:text-amber-300 transition">Home</Link>
            <Link href="/trips/west-coast-2016" className="hover:text-amber-300 transition">West Coast</Link>
            <Link href="/trips/east-coast-2019" className="hover:text-amber-300 transition">East Coast</Link>
            <Link href="/about" className="hover:text-amber-300 transition">About</Link>
          </div>
        </nav>
        <main className="pt-20 min-h-screen">{children}</main>
        <footer className="text-center py-8 text-emerald-700 text-sm border-t border-emerald-900/50">
          © {new Date().getFullYear()} Katherine Marie — Adventure Memories
        </footer>
      </body>
    </html>
  );
}
