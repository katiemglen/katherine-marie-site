"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

/* ─── count-up hook ─── */
function useCountUp(end: number, duration = 1.5, inView: boolean) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const steps = 60;
    const inc = end / steps;
    let cur = 0;
    const t = setInterval(() => {
      cur += inc;
      if (cur >= end) { setVal(end); clearInterval(t); }
      else setVal(Math.floor(cur));
    }, (duration * 1000) / steps);
    return () => clearInterval(t);
  }, [inView, end, duration]);
  return val;
}

function CountUpCell({ end, prefix = "", suffix = "", className = "" }: { end: number; prefix?: string; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const v = useCountUp(end, 1.5, inView);
  return <span ref={ref} className={className}>{prefix}{v.toLocaleString()}{suffix}</span>;
}

/* ─── glass card ─── */
const glass: React.CSSProperties = {
  background: "rgba(180,155,100,0.08)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(180,155,100,0.18)",
  borderRadius: "1rem",
};

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } } };

/* ─── data ─── */
const funStats = [
  { icon: "🏠", label: "Days Under a Roof", value: "7" },
  { icon: "🚗", label: "Days Sleeping in Car", value: "13" },
  { icon: "🚿", label: "Longest Without Showers", value: "6 Days" },
  { icon: "👫", label: "Friends Visited", value: "3 Sets" },
  { icon: "⛰️", label: "Mountain Ranges Covered", value: "3", sub: "Rocky Mountains, Sierra Nevada, Cascades" },
  { icon: "🛣️", label: "Longest Stretch Without Stopping to Camp", value: "6 States" },
  { icon: "🤝", label: "Arguments Between Katie & Chad", value: "Zero" },
  { icon: "💀", label: "Times Katie Killed the Car", value: "14" },
  { icon: "🔧", label: "Times Chad Killed the Car", value: "4" },
  { icon: "😂", label: "Times Chad Was Right", value: "...we don't talk about it" },
];

const tripMemories: { slug: string; title: string; hero: string }[] = [
  { slug: "chad-is-stubborn", title: "What Do You Do When He Doesn't Get in the Car...", hero: "/images/chad-is-stubborn/img_4082.jpg" },
  { slug: "lets-drive-all-of-the-miles", title: "Let's Drive ALL of the Miles", hero: "/images/lets-drive-all-of-the-miles/20161218_162913.jpg" },
  { slug: "that-is-what-mountains-look-like", title: "It's Mountain Time", hero: "/images/that-is-what-mountains-look-like/20161219_145852.jpg" },
  { slug: "mountain-slopes-snatchbacks-and-manual-driving", title: "Mountain Slopes, Snatchbacks and Manual Driving", hero: "/images/mountain-slopes-snatchbacks-and-manual-driving/20161220_125054.jpg" },
  { slug: "do-people-actually-live-in-utah", title: "Do People Actually Live in Utah?", hero: "/images/do-people-actually-live-in-utah/20161221_095351.jpg" },
  { slug: "it-does-rain-in-las-vegas", title: "It Does Rain in Las Vegas", hero: "/images/it-does-rain-in-las-vegas/20161222_124634.jpg" },
  { slug: "attractions-that-could-have-been-done-at-home", title: "Attractions That Could Have Been Done at Home", hero: "/images/attractions-that-could-have-been-done-at-home/20161226_115359.jpg" },
  { slug: "our-not-so-grand-trip-to-the-grand-canyon", title: "Our Not So Grand Trip to the Grand Canyon", hero: "/images/our-not-so-grand-trip-to-the-grand-canyon/20161224_160647.jpg" },
  { slug: "hiking-in-a-spiritual-place", title: "Hiking in a Spiritual Place", hero: "/images/hiking-in-a-spiritual-place/20161225_164809.jpg" },
  { slug: "car-campers-unite", title: "Car Campers Unite", hero: "/images/car-campers-unite/20161227_082939.jpg" },
  { slug: "visiting-a-ghost-town", title: "Visiting a Ghost Town While Sneezing on Snatchbacks", hero: "/images/visiting-a-ghost-town/20161227_085557.jpg" },
  { slug: "hiking-prepared-to-get-wet-in-the-dessert", title: "Hiking - Prepared to Get Wet in the Desert", hero: "/images/hiking-prepared-to-get-wet-in-the-dessert/20161228_163842.jpg" },
  { slug: "rush-hour-truly-is-horrible", title: "Rush Hour Truly is Horrible", hero: "/images/rush-hour-truly-is-horrible/20161229_095121.jpg" },
  { slug: "tips-for-staying-clean-on-a-road-trip", title: "Tips for Staying Clean on a Road Trip", hero: "/images/tips-for-staying-clean-on-a-road-trip/teeth.jpg" },
  { slug: "saturday-is-not-chads-best-day", title: "Saturday is Not Chad's Best Day", hero: "/images/saturday-is-not-chads-best-day/20161230_122248.jpg" },
  { slug: "not-a-typical-new-year-celebration", title: "Not a Typical New Year Celebration", hero: "/images/not-a-typical-new-year-celebration/20161231_154001.jpg" },
  { slug: "san-fran-is-the-place-to-be", title: "San Fran is the Place To Be", hero: "/images/san-fran-is-the-place-to-be/20170101_140050.jpg" },
  { slug: "a-drive-through-a-giants-land", title: "A Drive Through a Giant's Land", hero: "/images/a-drive-through-a-giants-land/20170102_103149.jpg" },
  { slug: "trapped-on-a-mountain", title: "Trapped on a Mountain", hero: "/images/trapped-on-a-mountain/20170102_1326401.jpg" },
  { slug: "1997-miles-to-go", title: "1,997 Miles To Go", hero: "/images/1997-miles-to-go/20170103_164033.jpg" },
];

/* bento size classes — cycle through patterns */
const bentoPatterns = [
  "col-span-2 row-span-2",
  "col-span-1 row-span-1",
  "col-span-1 row-span-2",
  "col-span-1 row-span-1",
  "col-span-2 row-span-1",
  "col-span-1 row-span-1",
];

export default function WestCoastTripStats() {
  return (
    <main className="min-h-screen" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      {/* Hero Header */}
      <section className="relative overflow-hidden min-h-[60vh] flex items-center justify-center">
        <Image
          src="/images/that-is-what-mountains-look-like/20161219_145852.jpg"
          alt="West Coast Road Trip"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%)' }} />
        <motion.div className="relative z-10 text-center px-4" initial="hidden" animate="visible" variants={stagger}>
          <motion.div variants={fadeUp}>
            <Link href="/" className="inline-block mb-6 text-sm tracking-widest uppercase text-white/70 hover:text-white transition-colors">
              ← Back to Journal
            </Link>
          </motion.div>
          <motion.p variants={fadeUp} className="text-sm tracking-[0.3em] uppercase mb-3" style={{ color: '#c4882a' }}>
            #WestCoastAdventure &nbsp;·&nbsp; December 17, 2016 – January 5, 2017
          </motion.p>
          <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl lg:text-7xl mb-4 text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
            Road Trip 2016 Stats
          </motion.h1>
          <motion.p variants={fadeUp} className="text-white/70 text-lg md:text-xl">
            20 Days · 6,636 Miles · 13 States
          </motion.p>
        </motion.div>
      </section>

      {/* Row 1: Hero Stats */}
      <section className="px-4 py-10">
        <motion.div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger}>
          {[
            { end: 20, label: "DAYS" },
            { end: 6636, label: "MILES" },
            { end: 13, label: "STATES" },
          ].map((s, i) => (
            <motion.div key={i} variants={fadeUp} className="rounded-2xl p-8 text-center transition-transform hover:-translate-y-1" style={glass}>
              <div className="text-4xl md:text-6xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif", color: "var(--accent)" }}>
                <CountUpCell end={s.end} />
              </div>
              <div className="text-sm tracking-[0.2em] uppercase" style={{ color: "var(--muted-text)" }}>{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Row 2: Fun Stats */}
      <section className="px-4 pb-10">
        <motion.div className="max-w-5xl mx-auto" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger}>
          <motion.h2 variants={fadeUp} className="text-center text-sm tracking-[0.3em] uppercase mb-6" style={{ color: "var(--muted-text)" }}>Fun Stats</motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {funStats.map((s, i) => (
              <motion.div key={i} variants={fadeUp} className="rounded-2xl p-6 text-center transition-transform hover:-translate-y-1" style={glass}>
                <div className="text-3xl mb-2">{s.icon}</div>
                <div className="text-sm font-medium mb-2" style={{ color: "var(--muted-text)" }}>{s.label}</div>
                <div className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "var(--accent)" }}>
                  {s.value}
                </div>
                {s.sub && <div className="text-xs mt-1" style={{ color: "var(--muted-text)" }}>{s.sub}</div>}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Row 3: Car Stats */}
      <section className="px-4 pb-10">
        <motion.div className="max-w-5xl mx-auto" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger}>
          <motion.h2 variants={fadeUp} className="text-center text-sm tracking-[0.3em] uppercase mb-6" style={{ color: "var(--muted-text)" }}>Car Stats</motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: "🚗", label: "Starting Mileage", end: 82656 },
              { icon: "🛣️", label: "Miles Driven", end: 6636 },
              { icon: "🏁", label: "Trip Ended", text: "January 5, 2017" },
            ].map((c, i) => (
              <motion.div key={i} variants={fadeUp} className="rounded-2xl p-8 text-center transition-transform hover:-translate-y-1" style={glass}>
                <div className="text-3xl mb-2">{c.icon}</div>
                <div className="text-sm font-medium mb-2" style={{ color: "var(--muted-text)" }}>{c.label}</div>
                <div className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "var(--accent)" }}>
                  {c.end ? <CountUpCell end={c.end} /> : c.text}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Trip Memories Bento Gallery */}
      <section className="px-4 pb-24">
        <motion.div className="max-w-6xl mx-auto" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger}>
          <motion.h2 variants={fadeUp} className="text-center text-sm tracking-[0.3em] uppercase mb-8" style={{ color: "var(--muted-text)" }}>Trip Memories</motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[180px] md:auto-rows-[200px] gap-3">
            {tripMemories.map((m, i) => {
              const pattern = bentoPatterns[i % bentoPatterns.length];
              return (
                <motion.div key={m.slug} variants={fadeUp} className={`${pattern} relative rounded-xl overflow-hidden group`} style={{ border: "1px solid var(--glass-border)" }}>
                  <Link href={`/posts/${m.slug}`} className="block w-full h-full">
                    <Image src={m.hero} alt={m.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="(max-width:768px) 50vw, 25vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                      <span className="text-white text-sm font-medium leading-tight">{m.title}</span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Closing Quote */}
      <section className="px-4 pb-24">
        <motion.div
          className="max-w-3xl mx-auto text-center py-12 px-8 rounded-2xl"
          style={glass}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-2xl md:text-3xl italic leading-relaxed mb-4" style={{ fontFamily: "'Playfair Display', serif", color: "var(--foreground)" }}>
            &ldquo;This trip was eye opening, extremely fast and well worth the pants not fitting nicely anymore.&rdquo;
          </p>
          <p className="text-sm tracking-[0.2em] uppercase" style={{ color: "var(--accent)" }}>
            — Katherine Marie
          </p>
        </motion.div>
      </section>
    </main>
  );
}
