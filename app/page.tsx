import { getAllPosts, TRIPS } from "@/lib/posts";
import { wpImage, IMG_SIZES } from "@/lib/optimizeImage";
import HomeHero from "@/components/HomeHero";
import TripSplitScreen from "@/components/TripSplitScreen";
import FeaturedStory from "@/components/FeaturedStory";
import PhotoMosaic from "@/components/PhotoMosaic";
import RecentStrip from "@/components/RecentStrip";
import ClosingCTA from "@/components/ClosingCTA";

export default function Home() {
  const posts = getAllPosts();

  // Hero images — local files confirmed
  const heroImages = [
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

  // Photo mosaic — pick every ~5th post for diversity
  const mosaicData = posts
    .filter((_, i) => i % 5 === 0)
    .slice(0, 16)
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      image: wpImage(p.images[0], IMG_SIZES.gallery),
    }));

  // Recent posts — last 8
  const recent = [...posts].reverse().slice(0, 8).map((p) => ({
    slug: p.slug,
    title: p.title,
    date: p.date,
    image: wpImage(p.images[0], IMG_SIZES.gallery),
  }));

  // Closing CTA — open road shot from West Coast
  const closingImage = '/images/1032/20170102_081704.jpg';

  return (
    <div>
      <HomeHero images={heroImages} />
      <TripSplitScreen trips={tripPanels} />
      {easterPost && (
        <FeaturedStory
          slug={easterPost.slug}
          title={easterPost.title}
          excerpt="Day 21: You know the trip is going well when you see the U.S. President on Easter Sunday less than 30 feet away from you..."
          date={easterPost.date}
          category="East Coast 2019"
          image={wpImage(easterPost.images[0], IMG_SIZES.fullBleed)}
        />
      )}
      <PhotoMosaic images={mosaicData} />
      <RecentStrip posts={recent} />
      <ClosingCTA image={closingImage} />
    </div>
  );
}
