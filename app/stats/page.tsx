import Link from "next/link";
import { Metadata } from "next";
import { r2Image } from "@/lib/r2";

export const metadata: Metadata = {
  title: "Trip Stats — Katherine Marie",
};

const TRIP_STATS = [
  {
    slug: "2016-trip-stats",
    title: "2016 West Coast",
    subtitle: "December 17, 2016 – January 5, 2017",
    image: r2Image("/images/hiking-in-a-spiritual-place/20161225_161554.jpg"),
    stats: ["20 Days", "6,636 Miles", "13 States"],
  },
  {
    slug: "2019-trip-stats",
    title: "2019 East Coast",
    subtitle: "April 1 – May 15, 2019",
    image: r2Image("/images/marthas-vineyard/20190503_160521.jpg"),
    stats: ["45 Days", "9,281 Miles", "29 States"],
  },
];

export default function StatsPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      {/* Hero */}
      <section className="relative min-h-[45vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, rgba(var(--accent-rgb), 0.08) 0%, transparent 50%, rgba(var(--accent-rgb), 0.05) 100%)",
          }}
        />
        <div
          className="relative z-10 text-center px-8 py-10 pt-32 rounded-2xl max-w-2xl mx-6"
          style={{
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid var(--glass-border)',
          }}
        >
          <p
            className="text-sm tracking-[0.3em] uppercase mb-3"
            style={{ color: "var(--accent)" }}
          >
            By the Numbers
          </p>
          <h1
            className="font-[family-name:var(--font-playfair)] text-4xl md:text-6xl mb-4"
            style={{ color: "var(--heading-color)" }}
          >
            Trip Stats
          </h1>
          <p className="text-base md:text-lg max-w-xl mx-auto" style={{ color: "var(--foreground)" }}>
            Every mile, every dollar, every questionable sleeping arrangement — all tracked.
          </p>
        </div>
      </section>

      {/* Trip Stat Cards */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 gap-8">
          {TRIP_STATS.map((trip) => (
            <Link
              key={trip.slug}
              href={`/posts/${trip.slug}`}
              className="group block rounded-2xl overflow-hidden transition-transform hover:-translate-y-1"
              style={{
                background: "rgba(var(--accent-rgb), 0.06)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(var(--accent-rgb), 0.15)",
              }}
            >
              {/* Image */}
              <div className="relative h-64 md:h-80 overflow-hidden">
                <img
                  src={trip.image}
                  alt={trip.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)",
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h2 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl text-white mb-1">
                    {trip.title}
                  </h2>
                  <p className="text-white/60 text-sm">{trip.subtitle}</p>
                </div>
              </div>

              {/* Stats row */}
              <div className="p-6 flex justify-between items-center">
                <div className="flex gap-6">
                  {trip.stats.map((stat, i) => (
                    <div key={i} className="text-center">
                      <span
                        className="text-sm font-medium"
                        style={{ color: "var(--accent)" }}
                      >
                        {stat}
                      </span>
                    </div>
                  ))}
                </div>
                <span
                  className="text-sm tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: "var(--accent)" }}
                >
                  View Stats →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
