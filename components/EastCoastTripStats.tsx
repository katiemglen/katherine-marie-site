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
const costBreakdown = [
  { label: "Food", amount: 2384, pct: 57.6, color: "#e8a838" },
  { label: "Entertainment", amount: 855, pct: 20.2, color: "#6ec6ca" },
  { label: "Gas", amount: 665, pct: 16.2, color: "#e07b54" },
  { label: "Parking", amount: 270, pct: 6.1, color: "#a78bfa" },
];

const foodBreakdown = [
  { label: "Restaurant", amount: 1880, pct: 79, icon: "🍽️" },
  { label: "Grocery Store", amount: 287, pct: 12, icon: "🛒" },
  { label: "Coffee Shop", amount: 217, pct: 9, icon: "☕" },
];

const sleepingSpaces = [
  { label: "Cracker Barrel", count: 16 },
  { label: "Wal-Mart", count: 9 },
  { label: "Truck Stop", count: 8 },
  { label: "Costco", count: 4 },
  { label: "Bed", count: 3 },
  { label: "Other", count: 2 },
  { label: "Bass Pro", count: 2 },
  { label: "Lowe's", count: 1 },
];

const tripMemories: { slug: string; title: string; hero: string }[] = [
  { slug: "grandmas-house", title: "Off to Grandma's House We Go", hero: "/images/grandmas-house/20190401_141236-copy.jpg" },
  { slug: "wandering-kansas-city", title: "Wandering Kansas City", hero: "/images/wandering-kansas-city/20190402_141550.jpg" },
  { slug: "kc-coffee-conversations", title: "KC Coffee Conversations", hero: "/images/kc-coffee-conversations/20190403_095219.jpg" },
  { slug: "bricktown-canals", title: "Bricktown Canals", hero: "/images/bricktown-canals/20190404_133630.jpg" },
  { slug: "next-stop-dallas", title: "Next Stop, Dallas", hero: "/images/next-stop-dallas/20190405_195301.jpg" },
  { slug: "lightening-dallas", title: "Lightening & Pouring Rain in Dallas", hero: "/images/lightening-dallas/20190406_114645.jpg" },
  { slug: "scootering", title: "Scootering Through the Farmer's Market", hero: "/images/scootering/20190407_150117.jpg" },
  { slug: "austin-texas-is-green", title: "Austin, Texas is Green?", hero: "/images/austin-texas-is-green/20190408_192039.jpg" },
  { slug: "southern-friends-trees-coffee", title: "Southern Friends, Trees & Coffee", hero: "/images/southern-friends-trees-coffee/20190409_092546.jpg" },
  { slug: "houston", title: "An Easy Day in Houston, TX", hero: "/images/houston/20190410_135411.jpg" },
  { slug: "ferry-waves-southern-grub", title: "Ferry Waves & Southern Grub", hero: "/images/ferry-waves-southern-grub/20190411_190521.jpg" },
  { slug: "new-orleans-wwii-museum", title: "New Orleans' WWII Museum", hero: "/images/new-orleans-wwii-museum/20190412_130441.jpg" },
  { slug: "new-orleans-food-music", title: "New Orleans Food & Music", hero: "/images/new-orleans-food-music/20190413_105116.jpg" },
  { slug: "panama-city-beach-fl", title: "Panama City Beach, FL", hero: "/images/panama-city-beach-fl/20190414_182729.jpg" },
  { slug: "tampas-chickens", title: "Tampa's Chickens are Loose!", hero: "/images/tampas-chickens/20190415_173302.jpg" },
  { slug: "hello-st-pete-showers", title: "Hello, St. Pete Showers!", hero: "/images/hello-st-pete-showers/20190416_144302.jpg" },
  { slug: "sea-life-beach-towns-sunsets", title: "Sea Life, Beach Towns & Sunsets", hero: "/images/sea-life-beach-towns-sunsets/20190417_120645.jpg" },
  { slug: "myakka-state-park-cats", title: "Myakka State Park & Cats", hero: "/images/myakka-state-park-cats/20190418_182416.jpg" },
  { slug: "hello-coffee-hi-bonita-springs", title: "Hello Coffee, Hi Bonita Springs", hero: "/images/hello-coffee-hi-bonita-springs/20190419_171744.jpg" },
  { slug: "florida-keys-day-trip", title: "Florida Keys Day Trip", hero: "/images/florida-keys-day-trip/20190420_172742.jpg" },
  { slug: "easter-sunday", title: "Easter Sunday Beaches", hero: "/images/easter-sunday/20190421_182754.jpg" },
  { slug: "st-augustine-beaches", title: "St. Augustine & Beaches", hero: "/images/st-augustine-beaches/20190422_095331.jpg" },
  { slug: "welcome-to-savannah", title: "Welcome to Savannah", hero: "/images/welcome-to-savannah/20190423_111333.jpg" },
  { slug: "charleston-landscaping", title: "Charleston Landscaping", hero: "/images/charleston-landscaping/20190424_125935.jpg" },
  { slug: "shrimp-salad", title: "Shrimp Salad", hero: "/images/shrimp-salad/20190425_130737.jpg" },
  { slug: "welcome-to-the-gilded-age", title: "Welcome to the Gilded Age", hero: "/images/welcome-to-the-gilded-age/20190426_131954-1.jpg" },
  { slug: "blue-ridge", title: "Blue Ridge Mountain Zipline", hero: "/images/blue-ridge/20190427_135720.jpg" },
  { slug: "civil-war", title: "Civil War & Waterfalls", hero: "/images/civil-war/20190428_130157.jpg" },
  { slug: "national-mall", title: "National Mall Memorials", hero: "/images/national-mall/20190429_181048.jpg" },
  { slug: "the-nations-front-lawn", title: "The Nation's Front Lawn", hero: "/images/the-nations-front-lawn/20190430_135913.jpg" },
  { slug: "independence", title: "Philly Exploration", hero: "/images/independence/20190501_123232.jpg" },
  { slug: "best-bagel-in-manhattan", title: "Best Bagel in Manhattan, New York", hero: "/images/best-bagel-in-manhattan/20190502_111038.jpg" },
  { slug: "sunny-manhattan", title: "Afternoon in Sunny Manhattan", hero: "/images/sunny-manhattan/20190502_125427.jpg" },
  { slug: "marthas-vineyard", title: "Martha's Vineyard", hero: "/images/marthas-vineyard/20190503_160521.jpg" },
  { slug: "boston-tea-party", title: "Boston Tea Party & Pastries", hero: "/images/boston-tea-party/20190504_181224.jpg" },
  { slug: "maine-lobster", title: "Maine Lobster & Seafood", hero: "/images/maine-lobster/20190505_130953.jpg" },
  { slug: "maine-small-town", title: "Maine Small Town Comforts", hero: "/images/maine-small-town/20190506_090840.jpg" },
  { slug: "hot-showers-in-acadia-national-park", title: "Hot Showers in Acadia National Park", hero: "/images/hot-showers-in-acadia-national-park/20190507_115618.jpg" },
  { slug: "nova-scotia", title: "Nova Scotia Turning Point", hero: "/images/nova-scotia/20190508_200513.jpg" },
  { slug: "peggys-cove", title: "Peggy's Cove, Nova Scotia", hero: "/images/peggys-cove/20190509_125233.jpg" },
  { slug: "americas-first-mile", title: "America's First Mile", hero: "/images/americas-first-mile/20190510_092958.jpg" },
  { slug: "old-city-of-quebec", title: "Old City of Quebec", hero: "/images/old-city-of-quebec/20190510_144914.jpg" },
  { slug: "montreal-ottawa-day-trip", title: "Montreal & Ottawa Day Trip", hero: "/images/montreal-ottawa-day-trip/20190511_200619.jpg" },
  { slug: "trial-errors-in-toronto", title: "Trial & Errors in Toronto", hero: "/images/trial-errors-in-toronto/20190512_164557.jpg" },
  { slug: "rainy-niagara-falls", title: "Rainy Niagara Falls", hero: "/images/rainy-niagara-falls/20190513_113400.jpg" },
  { slug: "chicago-has-great-hot-dogs", title: "Chicago Has GREAT Hot Dogs", hero: "/images/chicago-has-great-hot-dogs/20190514_083359.jpg" },
  { slug: "vacation-at-home", title: "Vacation at Home", hero: "/images/vacation-at-home/20190516_124303.jpg" },
];

/* bento size classes — cycle through patterns */
const bentoPatterns = [
  "col-span-2 row-span-2",  // large
  "col-span-1 row-span-1",  // small
  "col-span-1 row-span-2",  // tall
  "col-span-1 row-span-1",  // small
  "col-span-2 row-span-1",  // wide
  "col-span-1 row-span-1",  // small
];

export default function EastCoastTripStats() {
  const maxSleep = sleepingSpaces[0].count;

  return (
    <main className="min-h-screen" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      {/* Header */}
      <section className="relative overflow-hidden pt-24 pb-8 px-4">
        <div className="absolute inset-0 hero-light-rays pointer-events-none" />
        <motion.div className="max-w-5xl mx-auto text-center relative z-10" initial="hidden" animate="visible" variants={stagger}>
          <motion.div variants={fadeUp}>
            <Link href="/" className="inline-block mb-6 text-sm tracking-widest uppercase" style={{ color: "var(--muted-text)" }}>
              ← Back to Journal
            </Link>
          </motion.div>
          <motion.p variants={fadeUp} className="text-sm tracking-[0.3em] uppercase mb-2" style={{ color: "var(--accent)" }}>
            #EastCoastJetta &nbsp;·&nbsp; April 1 – May 15
          </motion.p>
          <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl lg:text-7xl mb-4" style={{ fontFamily: "'Playfair Display', serif", color: "var(--heading-color)" }}>
            Road Trip 2019 Stats
          </motion.h1>
        </motion.div>
      </section>

      {/* Infographic Image */}
      <section className="px-4 pb-12">
        <motion.div className="max-w-[800px] mx-auto" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
          <Image src="/images/2019-trip-stats/2019-road-trip.png" alt="2019 Road Trip Stats Infographic" width={800} height={1200} className="w-full h-auto rounded-2xl" style={{ border: "1px solid var(--glass-border)" }} priority />
        </motion.div>
      </section>

      {/* Row 1: Hero Stats */}
      <section className="px-4 pb-10">
        <motion.div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger}>
          {[
            { end: 45, label: "DAYS", prefix: "" },
            { end: 9281, label: "MILES", prefix: "" },
            { end: 4424, label: "SPENT", prefix: "$" },
          ].map((s, i) => (
            <motion.div key={i} variants={fadeUp} className="rounded-2xl p-8 text-center transition-transform hover:-translate-y-1" style={glass}>
              <div className="text-4xl md:text-6xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif", color: "var(--accent)" }}>
                <CountUpCell end={s.end} prefix={s.prefix} />
              </div>
              <div className="text-sm tracking-[0.2em] uppercase" style={{ color: "var(--muted-text)" }}>{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Row 2: Cost Breakdown */}
      <section className="px-4 pb-10">
        <motion.div className="max-w-5xl mx-auto" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger}>
          <motion.h2 variants={fadeUp} className="text-center text-sm tracking-[0.3em] uppercase mb-6" style={{ color: "var(--muted-text)" }}>Cost Breakdown</motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {costBreakdown.map((c, i) => (
              <motion.div key={i} variants={fadeUp} className="rounded-2xl p-6 text-center transition-transform hover:-translate-y-1" style={glass}>
                <div className="text-2xl md:text-3xl font-bold mb-1" style={{ fontFamily: "'Playfair Display', serif", color: c.color }}>
                  $<CountUpCell end={c.amount} />
                </div>
                <div className="text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>{c.label}</div>
                <div className="w-full bg-black/10 rounded-full h-2 overflow-hidden">
                  <motion.div className="h-full rounded-full" style={{ background: c.color }} initial={{ width: 0 }} whileInView={{ width: `${c.pct}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.3 }} />
                </div>
                <div className="text-xs mt-1" style={{ color: "var(--muted-text)" }}>{c.pct}%</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Row 3: Food Breakdown */}
      <section className="px-4 pb-10">
        <motion.div className="max-w-5xl mx-auto" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger}>
          <motion.h2 variants={fadeUp} className="text-center text-sm tracking-[0.3em] uppercase mb-6" style={{ color: "var(--muted-text)" }}>Food Breakdown</motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {foodBreakdown.map((f, i) => (
              <motion.div key={i} variants={fadeUp} className="rounded-2xl p-6 text-center transition-transform hover:-translate-y-1" style={glass}>
                <div className="text-3xl mb-2">{f.icon}</div>
                <div className="text-2xl md:text-3xl font-bold mb-1" style={{ fontFamily: "'Playfair Display', serif", color: "var(--accent)" }}>
                  $<CountUpCell end={f.amount} />
                </div>
                <div className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{f.label}</div>
                <div className="text-xs" style={{ color: "var(--muted-text)" }}>{f.pct}%</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Row 4: Fun Stats */}
      <section className="px-4 pb-10">
        <motion.div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger}>
          {/* Showers */}
          <motion.div variants={fadeUp} className="rounded-2xl p-6 transition-transform hover:-translate-y-1" style={glass}>
            <div className="text-2xl mb-3">🚿</div>
            <h3 className="text-lg font-semibold mb-3" style={{ fontFamily: "'Playfair Display', serif", color: "var(--heading-color)" }}>Showers</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span style={{ color: "var(--muted-text)" }}>Katie</span><span className="font-bold" style={{ color: "var(--accent)" }}>9/9</span></div>
              <div className="flex justify-between"><span style={{ color: "var(--muted-text)" }}>Chad</span><span className="font-bold" style={{ color: "var(--accent)" }}>8/9</span></div>
              <div className="flex justify-between pt-2 border-t" style={{ borderColor: "rgba(180,155,100,0.18)" }}>
                <span style={{ color: "var(--muted-text)" }}>Longest Without</span>
                <span className="font-bold" style={{ color: "var(--accent)" }}>9 Days</span>
              </div>
            </div>
          </motion.div>
          {/* Laundry */}
          <motion.div variants={fadeUp} className="rounded-2xl p-6 text-center transition-transform hover:-translate-y-1" style={glass}>
            <div className="text-2xl mb-3">👕</div>
            <h3 className="text-lg font-semibold mb-3" style={{ fontFamily: "'Playfair Display', serif", color: "var(--heading-color)" }}>Laundry Trips</h3>
            <div className="text-5xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "var(--accent)" }}>
              <CountUpCell end={3} />
            </div>
          </motion.div>
          {/* Fuel */}
          <motion.div variants={fadeUp} className="rounded-2xl p-6 transition-transform hover:-translate-y-1" style={glass}>
            <div className="text-2xl mb-3">⛽</div>
            <h3 className="text-lg font-semibold mb-3" style={{ fontFamily: "'Playfair Display', serif", color: "var(--heading-color)" }}>Fuel Efficiency</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span style={{ color: "var(--muted-text)" }}>USA</span><span className="font-bold" style={{ color: "var(--accent)" }}>34 AVG MPG</span></div>
              <div className="flex justify-between"><span style={{ color: "var(--muted-text)" }}>Canada</span><span className="font-bold" style={{ color: "var(--accent)" }}>41 AVG MPG</span></div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Row 5: Sleeping Spaces */}
      <section className="px-4 pb-10">
        <motion.div className="max-w-5xl mx-auto" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger}>
          <motion.h2 variants={fadeUp} className="text-center text-sm tracking-[0.3em] uppercase mb-6" style={{ color: "var(--muted-text)" }}>Favorite Sleeping Spaces</motion.h2>
          <motion.div variants={fadeUp} className="rounded-2xl p-6 md:p-8 transition-transform hover:-translate-y-1" style={glass}>
            <div className="space-y-3">
              {sleepingSpaces.map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-28 text-sm text-right shrink-0" style={{ color: "var(--muted-text)" }}>{s.label}</span>
                  <div className="flex-1 bg-black/10 rounded-full h-6 overflow-hidden relative">
                    <motion.div
                      className="h-full rounded-full flex items-center justify-end pr-2"
                      style={{ background: "linear-gradient(90deg, rgba(232,168,56,0.6), rgba(232,168,56,0.9))" }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(s.count / maxSleep) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: i * 0.05 }}
                    >
                      <span className="text-xs font-bold" style={{ color: "var(--foreground)" }}>{s.count}</span>
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <span className="inline-block rounded-full px-4 py-1 text-xs font-bold tracking-wider uppercase" style={{ background: "rgba(224,60,60,0.15)", color: "#e04040", border: "1px solid rgba(224,60,60,0.3)" }}>
                🚨 Kicked Out: 1
              </span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Row 6: Geography */}
      <section className="px-4 pb-16">
        <motion.div className="max-w-5xl mx-auto" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger}>
          <motion.h2 variants={fadeUp} className="text-center text-sm tracking-[0.3em] uppercase mb-6" style={{ color: "var(--muted-text)" }}>States & Provinces</motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { end: 29, label: "States", icon: "🇺🇸" },
              { end: 1, label: "District (DC)", icon: "🏛️" },
              { end: 4, label: "Canadian Provinces", icon: "🇨🇦" },
            ].map((g, i) => (
              <motion.div key={i} variants={fadeUp} className="rounded-2xl p-8 text-center transition-transform hover:-translate-y-1" style={glass}>
                <div className="text-3xl mb-2">{g.icon}</div>
                <div className="text-4xl md:text-5xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif", color: "var(--accent)" }}>
                  <CountUpCell end={g.end} />
                </div>
                <div className="text-sm tracking-wider uppercase" style={{ color: "var(--muted-text)" }}>{g.label}</div>
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
    </main>
  );
}
