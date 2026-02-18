'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { parseWordPressContent, type GalleryBlock } from '@/lib/parseContent';
import { wpImage, IMG_SIZES } from '@/lib/optimizeImage';
import { fadeUp, fadeInScale, staggerContainer, defaultTransition, textTransition } from '@/lib/animations';
import { buildStorySlides } from '@/lib/storyContent';
import StoryMode from './StoryMode';
import HeroSection from './HeroSection';
import VideoSection from './VideoSection';
import NextStoryTeaser from './NextStoryTeaser';
import MasonryGrid from './gallery/MasonryGrid';
import TwoColumnStagger from './gallery/TwoColumnStagger';
import SingleFullBleed from './gallery/SingleFullBleed';
import ThreeUpGrid from './gallery/ThreeUpGrid';
import BentoGrid from './gallery/BentoGrid';
import Lightbox from './gallery/Lightbox';
import SectionProgress from './SectionProgress';
import AuroraMesh from './AuroraMesh';
import DustMotes from './DustMotes';
import { ShellEasterEgg, ShakeOnLongHover, KatieSaysPopup } from './EasterEgg';
import { KATIE_QUOTES } from '@/lib/katieQuotes';
import { POST_EASTER_EGGS } from '@/lib/easterEggs';

interface PostData {
  title: string;
  date: string;
  slug: string;
  categories: string[];
  content: string;
  images: string[];
}

interface PostTeaser {
  slug: string;
  title: string;
  images: string[];
}

interface Props {
  post: PostData;
  next: PostTeaser | null;
  prev: PostTeaser | null;
}

function GalleryRenderer({ gallery, onImageClick, sectionIndex = 0 }: { gallery: GalleryBlock; onImageClick: (images: string[], index: number) => void; sectionIndex?: number }) {
  const handler = (i: number) => onImageClick(gallery.images, i);

  switch (gallery.layout) {
    case 'bento':
      return <BentoGrid images={gallery.images} onImageClick={handler} sectionIndex={sectionIndex} />;
    case 'masonry':
      return <MasonryGrid images={gallery.images} onImageClick={handler} />;
    case 'two-column-stagger':
      return <TwoColumnStagger images={gallery.images} onImageClick={handler} />;
    case 'single-full-bleed':
      return <SingleFullBleed images={gallery.images} onImageClick={handler} />;
    case 'three-up':
      return <ThreeUpGrid images={gallery.images} onImageClick={handler} />;
  }
}

export default function MagazinePost({ post, next, prev }: Props) {
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null);
  const [storyOpen, setStoryOpen] = useState(false);

  const parsed = useMemo(() => parseWordPressContent(post.content, post.images), [post.content, post.images]);

  const storySlides = useMemo(
    () => buildStorySlides(post.title, post.images, post.content),
    [post.title, post.images, post.content]
  );

  const openLightbox = useCallback((images: string[], index: number) => {
    setLightbox({ images, index });
  }, []);

  const progressSections = useMemo(
    () =>
      parsed.sections
        .map((s, i) => (s.heading ? { id: `section-${i}`, heading: s.heading } : null))
        .filter((s): s is { id: string; heading: string } => s !== null),
    [parsed.sections]
  );

  // Collect all content images for lightbox
  const contentImages = useMemo(() => {
    const imgs: string[] = [];
    const imgRegex = /<img[^>]+src=["']([^"']+)["']/g;
    for (const section of parsed.sections) {
      for (const p of section.paragraphs) {
        let m;
        while ((m = imgRegex.exec(p)) !== null) {
          imgs.push(m[1]);
        }
      }
    }
    return imgs;
  }, [parsed.sections]);

  const contentRef = useRef<HTMLDivElement>(null);

  // Wire up click handlers on content images for lightbox
  useEffect(() => {
    if (!contentRef.current) return;
    const imgs = contentRef.current.querySelectorAll('img[data-content-image]');
    const handler = (e: Event) => {
      const img = e.currentTarget as HTMLImageElement;
      const src = img.src;
      const idx = contentImages.findIndex(u => src.includes(u) || u.includes(new URL(src).pathname));
      openLightbox(contentImages, idx >= 0 ? idx : 0);
    };
    imgs.forEach(img => img.addEventListener('click', handler));
    return () => { imgs.forEach(img => img.removeEventListener('click', handler)); };
  }, [contentImages, openLightbox]);

  const heroImage = post.images[0];
  const supportingImages = post.images.slice(1, 5);
  const katieQuote = KATIE_QUOTES[post.slug];
  const katieSaysSection = parsed.sections.length > 2 ? 2 : Math.min(1, parsed.sections.length - 1);

  // Easter egg placement: distribute 3 eggs across sections
  const easterEggs = POST_EASTER_EGGS[post.slug] || [];
  const eggSections = useMemo(() => {
    const total = parsed.sections.length;
    if (total <= 1) return [0, 0, 0];
    if (total <= 3) return [0, Math.min(1, total - 1), total - 1];
    const mid = Math.floor(total / 2);
    const late = Math.floor(total * 0.75);
    return [Math.min(1, total - 1), mid, late];
  }, [parsed.sections.length]);

  return (
    <article className="-mt-48 md:-mt-56">
      {heroImage && (
        <div className="relative">
          <HeroSection
            image={heroImage}
            title={post.title}
            date={post.date}
            categories={post.categories}
          />
          <DustMotes />
        </div>
      )}

      {supportingImages.length > 0 && (
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-2 px-4 md:px-8 lg:px-16 py-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer(80)}
        >
          {supportingImages.map((src, i) => (
            <motion.div
              key={src}
              className="overflow-hidden rounded-xl cursor-pointer aspect-square will-animate"
              variants={fadeInScale}
              transition={defaultTransition}
              onClick={() => openLightbox(supportingImages, i)}
            >
              <img src={wpImage(src, IMG_SIZES.thumbnail)} alt="" loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </motion.div>
          ))}
        </motion.div>
      )}

      {storySlides.length > 2 && (
        <motion.div
          className="flex lg:hidden justify-center py-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <button
            onClick={() => setStoryOpen(true)}
            className="px-6 py-2.5 rounded-full text-sm font-medium"
            style={{
              background: 'var(--glass-bg)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              color: 'var(--foreground)',
              border: '1px solid var(--glass-border)',
            }}
          >
            📖 Read as Story
          </button>
        </motion.div>
      )}

      <SectionProgress sections={progressSections} lightboxOpen={!!lightbox} />

      
      <div ref={contentRef} style={{ viewTransitionName: 'post-content' }}>
        {parsed.sections.map((section, si) => (
          <section
            key={si}
            id={`section-${si}`}
            className="section-divider"
            style={{
              background: si % 2 === 0 ? 'var(--background)' : 'var(--section-alt-bg)',
              contentVisibility: si > 0 ? 'auto' : undefined,
            } as React.CSSProperties}
          >
            {/* Aurora mesh between sections */}
            {si > 0 && si % 2 === 0 && <AuroraMesh />}

            <motion.div
              className="max-w-3xl mx-auto px-6 md:px-8 py-12 md:py-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={staggerContainer(80)}
            >
              {section.heading && (
                <motion.h2
                  className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl mb-4 will-animate magazine-heading"
                  style={{ color: 'var(--heading-color)' }}
                  variants={fadeUp}
                  transition={textTransition}
                >
                  {section.heading}
                  {/* Easter eggs: themed emoji per post */}
                  {easterEggs.map((egg, ei) =>
                    eggSections[ei] === si ? (
                      <ShellEasterEgg key={ei} emoji={egg.emoji} fact={egg.fact} />
                    ) : null
                  )}
                </motion.h2>
              )}

              {section.paragraphs.map((html, pi) => (
                <motion.div
                  key={pi}
                  className="prose-custom text-base md:text-lg leading-[1.85] mb-4 [&_p]:mb-[1.5em] [&_a]:underline [&_a]:underline-offset-2 will-animate"
                  style={{ color: 'var(--foreground)' }}
                  variants={fadeUp}
                  transition={textTransition}
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              ))}

              {section.videos.map((src, vi) => (
                <VideoSection key={vi} src={src} />
              ))}

              {section.galleries.map((gallery, gi) => {
                // Determine gallery breakout wrapper class
                const galleryWrapperClass =
                  gallery.layout === 'bento' ? 'gallery-full-width' :
                  gallery.layout === 'masonry' || gallery.layout === 'three-up' ? 'gallery-wide' :
                  undefined; // two-column-stagger and single-full-bleed stay in text column

                const rendered = post.slug === 'sea-life-beach-towns-sunsets' && si === 0 && gi === 0 ? (
                  <ShakeOnLongHover key={gi}>
                    <GalleryRenderer gallery={gallery} onImageClick={openLightbox} sectionIndex={si} />
                  </ShakeOnLongHover>
                ) : (
                  <GalleryRenderer key={gi} gallery={gallery} onImageClick={openLightbox} sectionIndex={si} />
                );

                return galleryWrapperClass ? (
                  <div key={gi} className={galleryWrapperClass}>{rendered}</div>
                ) : rendered;
              })}

              {/* Katie Says popup — data-driven per post */}
              {katieQuote && si === katieSaysSection && (
                <KatieSaysPopup message={katieQuote} />
              )}
            </motion.div>
          </section>
        ))}
      </div>
      

      <div className="px-4 md:px-8 lg:px-16 pb-16">
        <NextStoryTeaser next={next} prev={prev} />
      </div>

      {storyOpen && (
        <StoryMode
          slides={storySlides}
          title={post.title}
          onClose={() => setStoryOpen(false)}
        />
      )}

      {lightbox && (
        <Lightbox
          images={lightbox.images}
          initialIndex={lightbox.index}
          onClose={() => setLightbox(null)}
        />
      )}
    </article>
  );
}
