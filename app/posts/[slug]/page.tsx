import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { notFound } from "next/navigation";
import Link from "next/link";

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  return { title: post?.title || "Post" };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = getAllPosts();
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  const idx = posts.indexOf(post);
  const prev = idx > 0 ? posts[idx - 1] : null;
  const next = idx < posts.length - 1 ? posts[idx + 1] : null;

  return (
    <article className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-8">
        <time className="text-amber-400/80 text-sm">{new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</time>
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl text-emerald-200 mt-2">{post.title}</h1>
        <div className="flex gap-2 mt-3">
          {post.categories.map((c) => (
            <span key={c} className="text-xs px-3 py-1 rounded-full bg-emerald-900/50 text-emerald-300 border border-emerald-700/30">{c}</span>
          ))}
        </div>
      </div>

      {post.images[0] && (
        <div className="rounded-2xl overflow-hidden mb-10">
          <img src={post.images[0]} alt={post.title} className="w-full max-h-[500px] object-cover" />
        </div>
      )}

      <div className="prose-custom text-emerald-100/80 text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: post.content }} />

      <div className="flex justify-between items-center mt-16 pt-8 border-t border-emerald-900/50">
        {prev ? (
          <Link href={`/posts/${prev.slug}`} className="text-emerald-400 hover:text-amber-300 transition text-sm">
            ← {prev.title.slice(0, 40)}…
          </Link>
        ) : <span />}
        {next ? (
          <Link href={`/posts/${next.slug}`} className="text-emerald-400 hover:text-amber-300 transition text-sm text-right">
            {next.title.slice(0, 40)}… →
          </Link>
        ) : <span />}
      </div>
    </article>
  );
}
