import { getAllPosts, getPostMood } from '@/lib/posts';
import MoodsBrowser from './MoodsBrowser';

export const metadata = { title: 'Browse by Mood — Katherine Marie' };

export default function MoodsPage() {
  const posts = getAllPosts().map(p => {
    const mood = getPostMood(p);
    return {
      slug: p.slug,
      title: p.title,
      image: p.images[0] || '',
      mood: mood.label,
      moodEmoji: mood.emoji,
    };
  });

  return <MoodsBrowser posts={posts} />;
}
