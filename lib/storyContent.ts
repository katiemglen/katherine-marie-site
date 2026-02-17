import { wpImage } from './optimizeImage';

export interface StorySlide {
  type: 'image' | 'text';
  image?: string;
  text?: string;
  heading?: string;
}

/**
 * Build story slides from a post's images and HTML content.
 */
export function buildStorySlides(
  title: string,
  images: string[],
  contentHtml: string,
): StorySlide[] {
  // --- Select up to 20 unique images, spread across the post ---
  const unique = [...new Set(images)];
  const maxImages = 20;
  let selected: string[];
  if (unique.length <= maxImages) {
    selected = unique;
  } else {
    const step = unique.length / maxImages;
    selected = Array.from({ length: maxImages }, (_, i) => unique[Math.floor(i * step)]);
  }

  // --- Extract key text moments ---
  // Strip tags helper
  const strip = (h: string) =>
    h.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&#8217;/g, "'").replace(/&#8220;/g, '\u201c').replace(/&#8221;/g, '\u201d').replace(/&amp;/g, '&').trim();

  // Gather paragraphs
  const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  const paragraphs: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = pRegex.exec(contentHtml)) !== null) {
    const t = strip(m[1]);
    if (t.length > 30) paragraphs.push(t);
  }

  // Gather blockquotes
  const bqRegex = /<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi;
  const blockquotes: string[] = [];
  while ((m = bqRegex.exec(contentHtml)) !== null) {
    const t = strip(m[1]);
    if (t.length > 10) blockquotes.push(t);
  }

  const textSlides: StorySlide[] = [];

  // First paragraph (intro)
  if (paragraphs.length > 0) {
    textSlides.push({ type: 'text', text: paragraphs[0], heading: 'Introduction' });
  }

  // Blockquotes
  for (const bq of blockquotes.slice(0, 2)) {
    textSlides.push({ type: 'text', text: `"${bq}"` });
  }

  // 1-2 longest middle paragraphs
  if (paragraphs.length > 4) {
    const middle = paragraphs.slice(1, -1);
    const sorted = [...middle].sort((a, b) => b.length - a.length);
    for (const p of sorted.slice(0, 2)) {
      // Truncate very long paragraphs for readability
      const truncated = p.length > 280 ? p.slice(0, 277) + '…' : p;
      textSlides.push({ type: 'text', text: truncated });
    }
  }

  // Last paragraph (conclusion)
  if (paragraphs.length > 1) {
    textSlides.push({ type: 'text', text: paragraphs[paragraphs.length - 1], heading: 'Conclusion' });
  }

  // Cap text slides at 5
  const texts = textSlides.slice(0, 5);

  // --- Interleave: hero image first, then 3-4 images, text, repeat ---
  const slides: StorySlide[] = [];

  if (selected.length > 0) {
    slides.push({ type: 'image', image: wpImage(selected[0], 1400) });
  }

  let imgIdx = 1;
  let txtIdx = 0;
  const imgPerGroup = selected.length > 8 ? 4 : 3;

  while (imgIdx < selected.length || txtIdx < texts.length) {
    // Add a group of images
    let added = 0;
    while (imgIdx < selected.length && added < imgPerGroup) {
      slides.push({ type: 'image', image: wpImage(selected[imgIdx], 1400) });
      imgIdx++;
      added++;
    }
    // Add a text slide
    if (txtIdx < texts.length) {
      slides.push(texts[txtIdx]);
      txtIdx++;
    }
  }

  // Last slide: CTA
  slides.push({
    type: 'text',
    text: 'Continue Reading →',
    heading: title,
  });

  return slides;
}
