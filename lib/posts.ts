import fs from "fs";
import path from "path";

export interface Post {
  id: string;
  title: string;
  date: string;
  slug: string;
  link: string;
  status: string;
  type: string;
  categories: string[];
  tags: string[];
  content: string;
  excerpt: string;
  images: string[];
  word_count: number;
}

let _posts: Post[] | null = null;

export function getAllPosts(): Post[] {
  if (!_posts) {
    const filePath = path.join(process.cwd(), "posts.json");
    _posts = (JSON.parse(fs.readFileSync(filePath, "utf-8")) as Post[]).filter((p) => p.slug);
    _posts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }
  return _posts;
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

export function getPostsByCategory(category: string): Post[] {
  return getAllPosts().filter((p) => p.categories.includes(category));
}

export const TRIPS = [
  {
    slug: "west-coast-2016",
    title: "2016 West Coast Road Trip",
    category: "2016 West Coast Road Trip",
    description: "Three weeks in a diesel Jetta — from Minnesota to Colorado, Utah, Vegas, the Grand Canyon, and California.",
    coverImage: "https://katherinemariedotcom.wordpress.com/wp-content/uploads/2016/12/20161219_145937.jpg",
  },
  {
    slug: "east-coast-2019",
    title: "2019 East Coast Road Trip",
    category: "2019 East Coast Road Trip",
    description: "Exploring the eastern seaboard — history, beaches, cities, and everything in between.",
    coverImage: "/images/peggys-cove/resized_20190509_062921.jpg",
  },
];

export function getTripBySlug(slug: string) {
  return TRIPS.find((t) => t.slug === slug);
}

export function getPostMood(post: Pick<Post, 'title' | 'content'>): { emoji: string; label: string } {
  const text = (post.title + ' ' + post.content).toLowerCase();

  const chadGrumpy = /chad/.test(text) && /stubborn|grumpy|salty|worst/.test(text);
  if (chadGrumpy) return { emoji: '😤', label: 'Chad Being Chad' };
  if (/beach|ocean|sea\b|surf|keys/.test(text)) return { emoji: '🌊', label: 'Beach Vibes' };
  if (/mountain|hike|trail|ridge/.test(text)) return { emoji: '⛰️', label: 'Mountain Air' };
  if (/rain|storm|pour|cloud/.test(text)) return { emoji: '🌧️', label: 'Rainy Adventure' };
  if (/food|eat|restaurant|coffee|bagel|lobster/.test(text)) return { emoji: '🍽️', label: 'Foodie Stop' };
  if (/city|manhattan|boston|chicago|fargo/.test(text)) return { emoji: '🏙️', label: 'City Explorer' };
  if (/camp|car\s+life|sleep|tent/.test(text)) return { emoji: '🏕️', label: 'Car Life' };
  return { emoji: '🛤️', label: 'On the Road' };
}
