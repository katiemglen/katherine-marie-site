'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface TripPanel {
  slug: string;
  title: string;
  coverImage: string;
  postCount: number;
  days: number;
}

export default function TripSplitScreen({ trips }: { trips: TripPanel[] }) {
  return (
    <section className="grid md:grid-cols-2 photo-enhanced">
      {trips.map((trip) => (
        <Link
          key={trip.slug}
          href={`/trips/${trip.slug}`}
          className="relative block min-h-[50vh] md:min-h-[60vh] overflow-hidden group cursor-pointer"
        >
          {/* Image */}
          <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105">
            <img
              src={trip.coverImage}
              alt={trip.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Gold tint on hover */}
          <div className="absolute inset-0 bg-[rgba(196,136,42,0)] group-hover:bg-[rgba(196,136,42,0.15)] transition-colors duration-500" />

          {/* Glassmorphic info panel */}
          <div
            className="absolute bottom-0 left-0 right-0 z-10 p-8 md:p-10 transition-transform duration-500 ease-out group-hover:-translate-y-2"
            style={{
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              background: 'rgba(0,0,0,0.3)',
              borderTop: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl text-white mb-2">
              {trip.title}
            </h2>
            <p className="text-white/70 text-sm tracking-wide">
              {trip.days} Days · {trip.postCount} Posts
            </p>
          </div>

          {/* CTA on hover */}
          <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <span className="text-white text-lg tracking-[0.15em] uppercase font-light">
              Explore Trip →
            </span>
          </div>
        </Link>
      ))}
    </section>
  );
}
