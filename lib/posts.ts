import fs from "fs";
import path from "path";
import { r2Image } from "./r2";

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
    for (const p of _posts) {
      p.images = p.images.map(r2Image);
    }
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
    coverImage: "/images/rush-hour-truly-is-horrible/20161229_095121.jpg",
  },
  {
    slug: "east-coast-2019",
    title: "2019 East Coast Road Trip",
    category: "2019 East Coast Road Trip",
    description: "Exploring the eastern seaboard — history, beaches, cities, and everything in between.",
    coverImage: "/images/civil-war/20190428_130157.jpg",
  },
];

export function getTripBySlug(slug: string) {
  const trip = TRIPS.find((t) => t.slug === slug);
  if (trip) return { ...trip, coverImage: r2Image(trip.coverImage) };
  return undefined;
}

export function getTripsWithR2() {
  return TRIPS.map((t) => ({ ...t, coverImage: r2Image(t.coverImage) }));
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
