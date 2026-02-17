import { getAllPosts, TRIPS, getPostMood } from "@/lib/posts";
import { wpImage, IMG_SIZES } from "@/lib/optimizeImage";
import HomeHero from "@/components/HomeHero";
import TripSplitScreen from "@/components/TripSplitScreen";
import FeaturedStory from "@/components/FeaturedStory";
import PhotoMosaic from "@/components/PhotoMosaic";
import RecentStrip from "@/components/RecentStrip";
import ClosingCTA from "@/components/ClosingCTA";
import KatieQuotes from "@/components/KatieQuotes";
import FloatingEmoji from "@/components/FloatingEmoji";

export default function Home() {
  const posts = getAllPosts();

  // Hero images — local files confirmed
  const heroImages = [
    '/images/best-bagel-in-manhattan/20190502_111038.jpg',
    '/images/peggys-cove/20190509_125233.jpg',
    '/images/blue-ridge/20190427_090459.jpg',
    '/images/florida-keys-day-trip/20190415_173245.jpg',
    '/images/sunny-manhattan/20190502_114324.jpg',
    '/images/sea-life-beach-towns-sunsets/20190417_094848.jpg',
  ];

  // Trip panels
  const wcPosts = posts.filter((p) => p.categories.includes('2016 West Coast Road Trip'));
  const ecPosts = posts.filter((p) => p.categories.includes('2019 East Coast Road Trip'));
  const tripPanels = [
    {
      slug: 'west-coast-2016',
      title: '2016 West Coast Road Trip',
      coverImage: wpImage(TRIPS[0].coverImage, IMG_SIZES.hero),
      postCount: wcPosts.length,
      days: 28,
    },
    {
      slug: 'east-coast-2019',
      title: '2019 East Coast Road Trip',
      coverImage: wpImage(TRIPS[1].coverImage, IMG_SIZES.hero),
      postCount: ecPosts.length,
      days: 30,
    },
  ];

  // Featured story — Easter Sunday
  const easterPost = posts.find((p) => p.slug === 'easter-sunday');

  // Photo mosaic — hand-curated nature, sunlight, adventure (no people)
  const mosaicPicks: Array<{ slug: string; imageIndex: number }> = [
    { slug: 'that-is-what-mountains-look-like', imageIndex: 2 },
    { slug: 'blue-ridge', imageIndex: 5 },
    { slug: 'civil-war', imageIndex: 15 },
    { slug: 'peggys-cove', imageIndex: 0 },
    { slug: 'peggys-cove', imageIndex: 10 },
    { slug: 'florida-keys-day-trip', imageIndex: 8 },
    { slug: 'sea-life-beach-towns-sunsets', imageIndex: 20 },
    { slug: 'easter-sunday', imageIndex: 5 },
    { slug: 'maine-lobster', imageIndex: 10 },
    { slug: 'welcome-to-savannah', imageIndex: 8 },
    { slug: 'welcome-to-the-gilded-age', imageIndex: 15 },
    { slug: 'the-nations-front-lawn', imageIndex: 20 },
    { slug: 'new-orleans-food-music', imageIndex: 10 },
    { slug: 'southern-friends-trees-coffee', imageIndex: 5 },
    { slug: 'myakka-state-park-cats', imageIndex: 10 },
    { slug: 'st-augustine-beaches', imageIndex: 15 },
  ];
  const mosaicData = mosaicPicks.map((pick) => {
    const p = posts.find((x) => x.slug === pick.slug);
    return p ? {
      slug: p.slug,
      title: p.title,
      image: wpImage(p.images[pick.imageIndex] || p.images[0], IMG_SIZES.gallery),
      mood: getPostMood(p),
    } : null;
  }).filter(Boolean) as Array<{ slug: string; title: string; image: string; mood: { emoji: string; label: string } }>;

  // Recent posts — last 8
  const recent = [...posts].reverse().slice(0, 8).map((p) => ({
    slug: p.slug,
    title: p.title,
    date: p.date,
    image: wpImage(p.images[0], IMG_SIZES.gallery),
    mood: getPostMood(p),
  }));

  // Closing CTA — open road shot from West Coast
  const closingImage = '/images/1032/20170102_081704.jpg';

  return (
    <div>
      <FloatingEmoji emoji={['🗺️', '🚗', '✨']}>
        <HomeHero images={heroImages} />
      </FloatingEmoji>
      <FloatingEmoji emoji={['🌎', '📍', '🛣️']}>
        <TripSplitScreen trips={tripPanels} />
      </FloatingEmoji>
      {easterPost && (
        <FloatingEmoji emoji={['📖', '☀️', '🏖️']}>
          <FeaturedStory
            slug={easterPost.slug}
            title={easterPost.title}
            excerpt="Day 21: You know the trip is going well when you see the U.S. President on Easter Sunday less than 30 feet away from you..."
            date={easterPost.date}
            category="East Coast 2019"
            image={wpImage(easterPost.images[0], IMG_SIZES.fullBleed)}
          />
        </FloatingEmoji>
      )}
      <FloatingEmoji emoji={['📸', '🌿', '🌅']}>
        <PhotoMosaic images={mosaicData} />
      </FloatingEmoji>
      <FloatingEmoji emoji={['💬', '😂', '❤️']}>
        <KatieQuotes />
      </FloatingEmoji>
      <FloatingEmoji emoji={['🆕', '👀', '🌟']}>
        <RecentStrip posts={recent} />
      </FloatingEmoji>
      <FloatingEmoji emoji={['🛤️', '🌄', '✦']}>
        <ClosingCTA image={closingImage} />
      </FloatingEmoji>
    </div>
  );
}
