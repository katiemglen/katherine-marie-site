'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { parseWordPressContent, type GalleryBlock } from '@/lib/parseContent';
import HeroSection from './HeroSection';
import VideoSection from './VideoSection';
import NextStoryTeaser from './NextStoryTeaser';
import MasonryGrid from './gallery/MasonryGrid';
import TwoColumnStagger from './gallery/TwoColumnStagger';
import SingleFullBleed from './gallery/SingleFullBleed';
import ThreeUpGrid from './gallery/ThreeUpGrid';
import Lightbox from './gallery/Lightbox';
import SectionProgress from './SectionProgress';

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

function GalleryRenderer({ gallery, onImageClick }: { gallery: GalleryBlock; onImageClick: (images: string[], index: number) => void }) {
  const handler = (i: number) => onImageClick(gallery.images, i);

  switch (gallery.layout) {
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

  const parsed = useMemo(() => parseWordPressContent(post.content, post.images), [post.content, post.images]);

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

  const heroImage = post.images[0];
  const supportingImages = post.images.slice(1, 5);

  return (
    <article>
      {heroImage && (
        <HeroSection
          image={heroImage}
          title={post.title}
          date={post.date}
          categories={post.categories}
        />
      )}

      {supportingImages.length > 0 && (
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-2 px-4 md:px-8 lg:px-16 py-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        >
          {supportingImages.map((src, i) => (
            <motion.div
              key={src}
              className="overflow-hidden rounded-xl cursor-pointer aspect-square"
              variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              onClick={() => openLightbox(supportingImages, i)}
            >
              <img src={src} alt="" loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </motion.div>
          ))}
        </motion.div>
      )}

      <SectionProgress sections={progressSections} lightboxOpen={!!lightbox} />

      <div className="max-w-3xl mx-auto px-6 md:px-8 py-8" style={{ viewTransitionName: 'post-content' }}>
        {parsed.sections.map((section, si) => (
          <section key={si} id={`section-${si}`} className="mb-12">
            {section.heading && (
              <motion.h2
                className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl mt-8 mb-4"
                style={{ color: 'var(--heading-color)' }}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                {section.heading}
              </motion.h2>
            )}

            {section.paragraphs.map((html, pi) => (
              <motion.div
                key={pi}
                className="text-base md:text-lg leading-[1.85] mb-4 [&_p]:mb-4 [&_a]:underline [&_a]:underline-offset-2"
                style={{ color: 'var(--foreground)', opacity: 0.8 }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3 }}
                dangerouslySetInnerHTML={{ __html: html }}
              />
            ))}

            {section.videos.map((src, vi) => (
              <VideoSection key={vi} src={src} />
            ))}

            {section.galleries.map((gallery, gi) => (
              <GalleryRenderer key={gi} gallery={gallery} onImageClick={openLightbox} />
            ))}
          </section>
        ))}
      </div>

      <div className="px-4 md:px-8 lg:px-16 pb-16">
        <NextStoryTeaser next={next} prev={prev} />
      </div>

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
