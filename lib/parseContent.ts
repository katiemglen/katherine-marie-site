export type GalleryLayout = 'masonry' | 'two-column-stagger' | 'single-full-bleed' | 'three-up';

export interface GalleryBlock {
  images: string[];
  layout: GalleryLayout;
}

export interface ContentSection {
  heading?: string;
  paragraphs: string[];
  galleries: GalleryBlock[];
  videos: string[];
}

export interface ParsedContent {
  sections: ContentSection[];
}

function getLayout(count: number): GalleryLayout {
  if (count === 1) return 'single-full-bleed';
  if (count === 2) return 'two-column-stagger';
  if (count === 3) return 'three-up';
  return 'masonry'; // 4+
}

type ContentPiece =
  | { type: 'html'; html: string }
  | { type: 'gallery'; gallery: GalleryBlock }
  | { type: 'video'; src: string }
  | { type: 'heading'; text: string };

export function parseWordPressContent(html: string, _images: string[]): ParsedContent {
  // Step 1: tokenize - replace galleries and videos with tokens, collect them
  const galleries: GalleryBlock[] = [];
  const videos: string[] = [];

  // === WordPress Content Cleanup ===

  // Convert WordPress [caption] shortcodes to figure/figcaption
  let processed = html.replace(
    /\[caption[^\]]*\]([\s\S]*?<img[^>]+>)\s*([\s\S]*?)\[\/caption\]/g,
    '<figure class="wp-caption">$1<figcaption>$2</figcaption></figure>'
  );

  // Remove WordPress [gallery] shortcodes (images already extracted separately)
  processed = processed.replace(/\[gallery[^\]]*\]/g, '');

  // Remove WordPress numeric attachment shortcodes like [1589] [1577] [null]
  processed = processed.replace(/\[\d+\]/g, '');
  processed = processed.replace(/\[null\]/g, '');

  // Remove stray shortcode-like patterns: [to] [their] [while] [yes] [From] [this]
  processed = processed.replace(/\[(?:to|their|while|yes|From|this)\]/g, '');

  // Extract galleries
  processed = processed.replace(
    /<!-- wp:jetpack\/tiled-gallery.*?-->([\s\S]*?)<!-- \/wp:jetpack\/tiled-gallery -->/g,
    (_match, inner: string) => {
      const imgs: string[] = [];
      const re = /<img[^>]+src=["']([^"']+)["']/g;
      let m;
      while ((m = re.exec(inner)) !== null) imgs.push(m[1]);
      const idx = galleries.length;
      galleries.push({ images: imgs, layout: getLayout(imgs.length) });
      return `\n__GALLERY_${idx}__\n`;
    }
  );

  // Extract videos
  processed = processed.replace(
    /<!-- wp:video\s*(\{[^}]*?\})?\s*-->([\s\S]*?)<!-- \/wp:video -->/g,
    (match, attrs?: string) => {
      let src = '';
      if (attrs) {
        const m = attrs.match(/"src"\s*:\s*"([^"]+)"/);
        if (m) src = m[1];
      }
      if (!src) {
        const m = match.match(/https?:\/\/[^\s"<]+\.mp4/);
        if (m) src = m[0];
      }
      if (!src) return '';
      const idx = videos.length;
      videos.push(src);
      return `\n__VIDEO_${idx}__\n`;
    }
  );

  // Strip remaining WP comments
  processed = processed.replace(/<!--[\s\S]*?-->/g, '');
  // Clean up
  processed = processed.replace(/&nbsp;/g, ' ');
  processed = processed.replace(/ {2,}/g, ' ');
  processed = processed.replace(/<p>\s*<\/p>/g, '');

  // Step 2: split into pieces (headings, html chunks, gallery/video tokens)
  const pieces: ContentPiece[] = [];
  // Split by h2 tags and placeholders
  const splitRegex = /(<h2[^>]*>[\s\S]*?<\/h2>|__GALLERY_\d+__|__VIDEO_\d+__)/;
  const parts = processed.split(splitRegex).filter(Boolean);

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    const h2Match = trimmed.match(/^<h2[^>]*>([\s\S]*?)<\/h2>$/);
    if (h2Match) {
      // Strip all HTML tags from heading text (fixes <strong>, <a>, <img> inside h2)
      const cleanHeading = h2Match[1].replace(/<[^>]+>/g, '').trim();
      if (cleanHeading) {
        pieces.push({ type: 'heading', text: cleanHeading });
      }
      continue;
    }
    const galMatch = trimmed.match(/^__GALLERY_(\d+)__$/);
    if (galMatch) {
      pieces.push({ type: 'gallery', gallery: galleries[parseInt(galMatch[1])] });
      continue;
    }
    const vidMatch = trimmed.match(/^__VIDEO_(\d+)__$/);
    if (vidMatch) {
      pieces.push({ type: 'video', src: videos[parseInt(vidMatch[1])] });
      continue;
    }
    pieces.push({ type: 'html', html: trimmed });
  }

  // Step 2.5: Post-process HTML pieces - split long paragraphs, add image classes
  let inlineImageCount = 0;
  let firstImageFound = false;
  
  for (let i = 0; i < pieces.length; i++) {
    if (pieces[i].type === 'html') {
      let html = (pieces[i] as { type: 'html'; html: string }).html;
      
      // Split long paragraphs at sentence boundaries
      html = html.replace(/<p>([\s\S]*?)<\/p>/g, (_match, content: string) => {
        const text = content.replace(/<[^>]+>/g, '');
        if (text.length > 500) {
          const mid = Math.floor(text.length / 2);
          // Find nearest ". " to midpoint in the original content
          let bestSplit = -1;
          let bestDist = Infinity;
          const sentenceEnd = /\.\s/g;
          let m;
          // Search in stripped text for position, then map back
          while ((m = sentenceEnd.exec(text)) !== null) {
            const dist = Math.abs(m.index - mid);
            if (dist < bestDist) {
              bestDist = dist;
              bestSplit = m.index;
            }
          }
          if (bestSplit > 50 && bestSplit < text.length - 50) {
            // Find the corresponding position in the HTML content
            let textPos = 0;
            let htmlPos = 0;
            let inTag = false;
            while (htmlPos < content.length && textPos <= bestSplit) {
              if (content[htmlPos] === '<') inTag = true;
              else if (content[htmlPos] === '>') inTag = false;
              else if (!inTag) textPos++;
              htmlPos++;
              if (textPos === bestSplit + 1) break;
            }
            // Find the ". " in content near htmlPos
            const dotIdx = content.indexOf('. ', Math.max(0, htmlPos - 5));
            if (dotIdx > 0 && dotIdx < content.length - 20) {
              const splitAt = dotIdx + 1;
              return `<p>${content.slice(0, splitAt).trim()}</p><p>${content.slice(splitAt).trim()}</p>`;
            }
          }
        }
        return `<p>${content}</p>`;
      });
      
      // Add classes to images: hero-pull for first, film-strip for every 3rd
      html = html.replace(/<img([^>]*)>/g, (match, attrs: string) => {
        inlineImageCount++;
        const classes: string[] = [];
        if (!firstImageFound) {
          firstImageFound = true;
          classes.push('hero-pull-image');
        }
        // film-strip removed — caused confusing white borders
        // Add data attribute for lightbox
        const imgTag = classes.length > 0
          ? `<img class="${classes.join(' ')}" data-content-image="true"${attrs}>`
          : `<img data-content-image="true"${attrs}>`;
        return imgTag;
      });
      
      (pieces[i] as { type: 'html'; html: string }).html = html;
    }
  }

  // Step 3: group into sections (split at headings)
  const sections: ContentSection[] = [];
  let current: ContentSection = { paragraphs: [], galleries: [], videos: [] };

  for (const piece of pieces) {
    if (piece.type === 'heading') {
      // Push current if it has content
      if (current.heading || current.paragraphs.length || current.galleries.length || current.videos.length) {
        sections.push(current);
      }
      current = { heading: piece.text, paragraphs: [], galleries: [], videos: [] };
    } else if (piece.type === 'html') {
      current.paragraphs.push(piece.html);
    } else if (piece.type === 'gallery') {
      current.galleries.push(piece.gallery);
    } else if (piece.type === 'video') {
      current.videos.push(piece.src);
    }
  }
  // Push final section
  if (current.heading || current.paragraphs.length || current.galleries.length || current.videos.length) {
    sections.push(current);
  }

  return { sections };
}
