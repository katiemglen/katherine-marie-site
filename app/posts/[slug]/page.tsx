import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { notFound } from "next/navigation";
import MagazinePost from "@/components/MagazinePost";
import TripStatsPage from "@/components/TripStatsPage";

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

  const postData = {
    title: post.title,
    date: post.date,
    slug: post.slug,
    categories: post.categories,
    content: post.content,
    images: post.images,
  };

  const toTeaser = (p: typeof post | null) =>
    p ? { slug: p.slug, title: p.title, images: p.images } : null;

  if (slug === "trip-stats" || slug === "2019-trip-stats") {
    return <TripStatsPage post={postData} />;
  }

  return <MagazinePost post={postData} next={toTeaser(next)} prev={toTeaser(prev)} />;
}
