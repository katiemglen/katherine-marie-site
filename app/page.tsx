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
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/80 via-[#0a0f0d] to-[#0a0f0d]" />
        <div className="relative text-center max-w-3xl">
          <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-7xl text-emerald-200 leading-tight">
            Adventure<br /><span className="text-amber-300">Memories</span>
          </h1>
          <p className="mt-6 text-emerald-100/70 text-lg max-w-xl mx-auto">
            Stories from the open road — two people, a diesel Jetta, and thousands of miles of discovery.
          </p>
        </div>
      </section>

      {/* Trip Series */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="font-[family-name:var(--font-playfair)] text-3xl text-emerald-300 mb-8">Trip Series</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {TRIPS.map((trip) => (
            <Link key={trip.slug} href={`/trips/${trip.slug}`} className="block glass rounded-2xl overflow-hidden group hover:border-emerald-400/30 transition">
              <div className="h-56 overflow-hidden">
                <img src={trip.coverImage} alt={trip.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              </div>
              <div className="p-6">
                <h3 className="font-[family-name:var(--font-playfair)] text-xl text-amber-300 group-hover:text-amber-200 transition">{trip.title}</h3>
                <p className="text-emerald-100/60 text-sm mt-2">{trip.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Posts */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="font-[family-name:var(--font-playfair)] text-3xl text-emerald-300 mb-8">Recent Posts</h2>
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
