import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { notFound } from "next/navigation";
import MagazinePost from "@/components/MagazinePost";
import WestCoastTripStats from "@/components/WestCoastTripStats";
import EastCoastTripStats from "@/components/EastCoastTripStats";

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const ogImage = post?.images?.[0] || "/images/peggys-cove/20190509_125233.jpg";
  return {
    title: post?.title || "Post",
    openGraph: {
      title: post?.title || "Post",
      images: [ogImage],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
    },
  };
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

  if (slug === "2016-trip-stats") {
    return <WestCoastTripStats />;
  }

  if (slug === "2019-trip-stats") {
    return <EastCoastTripStats />;
  }

  return <MagazinePost post={postData} next={toTeaser(next)} prev={toTeaser(prev)} />;
}
