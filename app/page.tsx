import { getAllPosts, TRIPS } from "@/lib/posts";
import Link from "next/link";
import PostCard from "@/components/PostCard";

export default function Home() {
  const posts = getAllPosts();
  const recent = [...posts].reverse().slice(0, 6);

  return (
    <div>
      {/* Hero */}
      <section className="relative flex items-center justify-center min-h-[70vh] px-6">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, color-mix(in srgb, var(--background) 20%, black), var(--background))' }} />
        <div className="relative text-center max-w-3xl">
          <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-7xl leading-tight" style={{ color: 'var(--heading-color)' }}>
            Adventure<br /><span style={{ color: 'var(--accent)' }}>Memories</span>
          </h1>
          <p className="mt-6 text-lg max-w-xl mx-auto" style={{ color: 'var(--muted-text)' }}>
            Stories from the open road — two people, a diesel Jetta, and thousands of miles of discovery.
          </p>
        </div>
      </section>

      {/* Trip Series */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="font-[family-name:var(--font-playfair)] text-3xl mb-8" style={{ color: 'var(--heading-color)' }}>Trip Series</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {TRIPS.map((trip) => (
            <Link key={trip.slug} href={`/trips/${trip.slug}`} className="block glass rounded-2xl overflow-hidden group transition" style={{ borderColor: 'var(--card-border)' }}>
              <div className="h-56 overflow-hidden">
                <img src={trip.coverImage} alt={trip.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              </div>
              <div className="p-6">
                <h3 className="font-[family-name:var(--font-playfair)] text-xl group-hover:text-[var(--accent-secondary)] transition" style={{ color: 'var(--accent)' }}>{trip.title}</h3>
                <p className="text-sm mt-2" style={{ color: 'var(--muted-text)' }}>{trip.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Posts */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="font-[family-name:var(--font-playfair)] text-3xl mb-8" style={{ color: 'var(--heading-color)' }}>Recent Posts</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recent.map((post) => (
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
      </section>
    </div>
  );
}
