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

export default function PostCard({ title, slug, date, excerpt, image }: Props) {
  return (
    <motion.div
      className="will-animate"
      variants={fadeUp}
      transition={landingTransition}
    >
      <Link href={`/posts/${slug}`} className="block glass rounded-2xl overflow-hidden transition group" style={{ borderColor: 'var(--card-border)' }}>
        {image && (
          <div className="h-48 overflow-hidden">
            <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
          </div>
        )}
        <div className="p-5">
          <time className="text-xs" style={{ color: 'var(--accent)', opacity: 0.8 }}>{new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</time>
          <h3 className="font-[family-name:var(--font-playfair)] text-lg mt-1 group-hover:text-[var(--accent)] transition" style={{ color: 'var(--heading-color)' }}>{title}</h3>
          {/* excerpt removed for cleaner tiles */}
        </div>
      </Link>
    </motion.div>
  );
}
