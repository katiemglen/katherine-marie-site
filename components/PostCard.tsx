"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp, landingTransition } from "@/lib/animations";

interface Props {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  image?: string;
}

export default function PostCard({ title, slug, date, image }: Props) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return (
    <motion.div
      className="will-animate"
      variants={fadeUp}
      transition={landingTransition}
    >
      <Link href={`/posts/${slug}`} className="block rounded-2xl overflow-hidden relative group aspect-[4/5]" style={{ border: '1px solid var(--card-border)' }}>
        {image ? (
          <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        ) : (
          <div className="absolute inset-0" style={{ background: 'var(--section-alt-bg)' }} />
        )}

        {/* Hover gradient overlay */}
        <div
          className="absolute inset-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100 md:block"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)' }}
        />
        {/* Mobile: always visible gradient */}
        <div
          className="absolute inset-0 md:hidden"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)' }}
        />

        {/* Info — hidden on desktop, always visible on mobile */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 md:translate-y-4 md:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <time className="text-xs text-white/60">{formattedDate}</time>
          <h3 className="font-[family-name:var(--font-playfair)] text-base md:text-lg text-white leading-tight mt-1">{title}</h3>
          <p className="text-xs text-white/50 mt-2 hidden md:block md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 delay-100">Discover →</p>
        </div>
      </Link>
    </motion.div>
  );
}
