"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

interface TripStatsPageProps {
  post: {
    title: string;
    date: string;
    slug: string;
    categories: string[];
    content: string;
    images: string[];
  };
}

interface StatItem {
  label: string;
  value: string;
  numericValue?: number;
  icon: string;
}

interface StatCategory {
  title: string;
  icon: string;
  items: StatItem[];
}

function CountUp({ end, duration = 2 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const steps = 60;
    const increment = end / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, (duration * 1000) / steps);
    return () => clearInterval(timer);
  }, [started, end, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

function parseWestCoastStats(content: string) {
  const heroStats: StatItem[] = [
    { label: "Miles Driven", value: "6,636", numericValue: 6636, icon: "🚗" },
    { label: "Days on Road", value: "20", numericValue: 20, icon: "📅" },
    { label: "States Visited", value: "13", numericValue: 13, icon: "🗺️" },
    { label: "Mountain Ranges", value: "3", numericValue: 3, icon: "⛰️" },
  ];

  const categories: StatCategory[] = [
    {
      title: "The Journey",
      icon: "🛣️",
      items: [
        { label: "Departure", value: "Dec 17, 2016 ~3PM", icon: "🏁" },
        { label: "Return", value: "Jan 5, 2017", icon: "🏠" },
        { label: "Starting Odometer", value: "82,656 mi", icon: "📊" },
        { label: "Total Miles", value: "6,636", numericValue: 6636, icon: "🚗" },
        { label: "States Traveled Without Stopping", value: "6 (longest stretch)", icon: "🏃" },
      ],
    },
    {
      title: "Sleeping Arrangements",
      icon: "🛏️",
      items: [
        { label: "Nights Under a Roof", value: "7", numericValue: 7, icon: "🏨" },
        { label: "Nights in the Car", value: "13", numericValue: 13, icon: "🚙" },
        { label: "Longest Without Showers", value: "6 days", icon: "🚿" },
      ],
    },
    {
      title: "Mountain Ranges",
      icon: "🏔️",
      items: [
        { label: "Rocky Mountains", value: "✓", icon: "⛰️" },
        { label: "Sierra Nevada", value: "✓", icon: "🏔️" },
        { label: "Cascades", value: "✓", icon: "🌋" },
      ],
    },
    {
      title: "Fun Facts",
      icon: "😂",
      items: [
        { label: "Friends Visited", value: "3 sets", icon: "👋" },
        { label: "Times Katie Killed the Car", value: "14", numericValue: 14, icon: "💀" },
        { label: "Times Chad Killed the Car", value: "4", numericValue: 4, icon: "🔧" },
        { label: "Arguments Between Katie & Chad", value: "Zero", icon: "✌️" },
      ],
    },
  ];

  return { heroStats, categories };
}

function parseEastCoastStats(_content: string) {
  // 2019 trip stats post doesn't have structured numerical stats,
  // just intro text and beard progression gallery
  const heroStats: StatItem[] = [
    { label: "Days on Road", value: "42", numericValue: 42, icon: "📅" },
    { label: "States Visited", value: "20+", numericValue: 20, icon: "🗺️" },
    { label: "Beard Growth", value: "Epic", icon: "🧔" },
    { label: "Adventures", value: "∞", icon: "🌄" },
  ];

  const categories: StatCategory[] = [
    {
      title: "The Journey",
      icon: "🛣️",
      items: [
        { label: "Departure", value: "April 4, 2019", icon: "🏁" },
        { label: "Return", value: "May 15, 2019", icon: "🏠" },
        { label: "Route", value: "East Coast Loop", icon: "🗺️" },
      ],
    },
  ];

  return { heroStats, categories };
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function TripStatsPage({ post }: TripStatsPageProps) {
  const isWestCoast = post.slug === "trip-stats";
  const { heroStats, categories } = isWestCoast
    ? parseWestCoastStats(post.content)
    : parseEastCoastStats(post.content);

  const tripName = isWestCoast ? "West Coast 2016" : "East Coast 2019";
  const tripSubtitle = isWestCoast
    ? "Minnesota → Vegas → California → Pacific Northwest → Home"
    : "Minnesota → East Coast → Southern States → Home";

  return (
    <main className="min-h-screen" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-16 px-4">
        <div className="absolute inset-0 hero-light-rays pointer-events-none" />
        <motion.div
          className="max-w-5xl mx-auto text-center relative z-10"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.div variants={fadeUp}>
            <Link
              href="/"
              className="inline-block mb-6 text-sm tracking-widest uppercase"
              style={{ color: "var(--muted-text)" }}
            >
              ← Back to Journal
            </Link>
          </motion.div>
          <motion.p
            variants={fadeUp}
            className="text-sm tracking-[0.3em] uppercase mb-3"
            style={{ color: "var(--accent)" }}
          >
            {tripName}
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="text-4xl md:text-6xl lg:text-7xl mb-4"
            style={{ fontFamily: "'Playfair Display', serif", color: "var(--heading-color)" }}
          >
            {post.title}
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-lg md:text-xl max-w-2xl mx-auto"
            style={{ color: "var(--muted-text)" }}
          >
            {tripSubtitle}
          </motion.p>
        </motion.div>
      </section>

      {/* Hero Stats */}
      <section className="px-4 pb-16">
        <motion.div
          className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger}
        >
          {heroStats.map((stat, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="rounded-2xl p-6 md:p-8 text-center"
              style={{
                background: "var(--glass-bg)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid var(--glass-border)",
              }}
            >
              <div className="text-3xl mb-3">{stat.icon}</div>
              <div
                className="text-3xl md:text-5xl font-bold mb-2"
                style={{ fontFamily: "'Playfair Display', serif", color: "var(--accent)" }}
              >
                {stat.numericValue ? (
                  <CountUp end={stat.numericValue} />
                ) : (
                  stat.value
                )}
              </div>
              <div className="text-sm tracking-wider uppercase" style={{ color: "var(--muted-text)" }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Photo Highlights */}
      {post.images.length > 0 && (
        <section className="pb-16 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2
              className="text-center text-sm tracking-[0.3em] uppercase mb-6 px-4"
              style={{ color: "var(--muted-text)" }}
            >
              Trip Memories
            </h2>
            <div className="flex gap-4 overflow-x-auto px-4 pb-4 snap-x snap-mandatory scrollbar-hide"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {post.images.map((img, i) => (
                <motion.div
                  key={i}
                  className="flex-shrink-0 snap-center rounded-xl overflow-hidden relative"
                  style={{
                    width: "280px",
                    height: "200px",
                    border: "1px solid var(--glass-border)",
                  }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Image
                    src={img}
                    alt={`Trip memory ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="280px"
                    unoptimized={img.startsWith("http")}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* Stat Categories */}
      <section className="px-4 pb-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat, ci) => (
            <motion.div
              key={ci}
              className="rounded-2xl p-6 md:p-8"
              style={{
                background: "var(--glass-bg)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid var(--glass-border)",
              }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-30px" }}
              variants={fadeUp}
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="text-2xl">{cat.icon}</span>
                <h3
                  className="text-xl font-semibold"
                  style={{ fontFamily: "'Playfair Display', serif", color: "var(--heading-color)" }}
                >
                  {cat.title}
                </h3>
              </div>
              <div className="space-y-3">
                {cat.items.map((item, ii) => (
                  <div
                    key={ii}
                    className="flex items-center justify-between py-2 border-b"
                    style={{ borderColor: "var(--glass-border)" }}
                  >
                    <span className="flex items-center gap-2 text-sm" style={{ color: "var(--muted-text)" }}>
                      <span>{item.icon}</span>
                      {item.label}
                    </span>
                    <span className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
