"use client";
import Link from "next/link";
import { motion } from "framer-motion";

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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Link href={`/posts/${slug}`} className="block glass rounded-2xl overflow-hidden hover:border-emerald-400/30 transition group">
        {image && (
          <div className="h-48 overflow-hidden">
            <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
          </div>
        )}
        <div className="p-5">
          <time className="text-xs text-amber-400/80">{new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</time>
          <h3 className="font-[family-name:var(--font-playfair)] text-lg text-emerald-200 mt-1 group-hover:text-amber-300 transition">{title}</h3>
          {excerpt && <p className="text-sm text-emerald-100/60 mt-2 line-clamp-2">{excerpt}</p>}
        </div>
      </Link>
    </motion.div>
  );
}
