import { getTripBySlug, TRIPS, getPostsByCategory } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import { StaggerGrid } from "@/components/AnimatedLanding";
import Link from "next/link";
import { notFound } from "next/navigation";

const TRIP_HEROES: Record<string, string> = {
  'west-coast-2016': '/images/hiking-in-a-spiritual-place/20161225_161554.jpg',
  'east-coast-2019': '/images/a-drive-through-a-giants-land/20170102_1154131.jpg',
};

const TRIP_STATS_SLUGS: Record<string, string> = {
  'west-coast-2016': '2016-trip-stats',
  'east-coast-2019': '2019-trip-stats',
};

export async function generateStaticParams() {
  return TRIPS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const trip = getTripBySlug(slug);
  return { title: trip?.title || "Trip" };
}

export default async function TripPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const trip = getTripBySlug(slug);
  if (!trip) notFound();

  const posts = getPostsByCategory(trip.category);
  const heroImage = TRIP_HEROES[slug];
  const statsSlug = TRIP_STATS_SLUGS[slug];

  return (
    <div>
      {/* Hero Section */}
      {heroImage && (
        <section className="relative min-h-[50vh] md:min-h-[60vh] flex items-center justify-center overflow-hidden">
          <img
            src={heroImage}
            alt={trip.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.55) 100%)' }}
          />
          <div
            className="relative z-10 text-center px-8 py-10 rounded-2xl max-w-3xl mx-6"
            style={{
              background: 'rgba(0, 0, 0, 0.45)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-6xl text-white mb-4">
              {trip.title}
            </h1>
            <p className="text-white/80 text-base md:text-lg max-w-2xl mx-auto">
              {trip.description}
            </p>
            <div className="mt-6 flex items-center justify-center gap-6">
              <p className="text-sm tracking-[0.2em] uppercase" style={{ color: '#c4882a' }}>
                {posts.length} Posts
              </p>
              {statsSlug && (
                <>
                  <span className="text-white/30">✦</span>
                  <Link
                    href={`/posts/${statsSlug}`}
                    className="text-sm tracking-[0.2em] uppercase transition-colors hover:text-white"
                    style={{ color: '#c4882a' }}
                  >
                    View Trip Stats →
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Post Grid */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <StaggerGrid className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard
              key={post.slug}
              title={post.title}
              slug={post.slug}
              date={post.date}
              excerpt={post.excerpt}
              image={post.images[0]}
            />
          ))}
        </StaggerGrid>
      </div>
    </div>
  );
}
