import { getTripBySlug, TRIPS, getPostsByCategory } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import { notFound } from "next/navigation";

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

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl mb-4" style={{ color: 'var(--heading-color)' }}>{trip.title}</h1>
      <p className="mb-12 max-w-2xl" style={{ color: 'var(--muted-text)' }}>{trip.description}</p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </div>
    </div>
  );
}
