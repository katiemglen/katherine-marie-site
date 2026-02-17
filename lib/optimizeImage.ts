/**
 * Append WordPress.com resize parameters to image URLs.
 * Full-bleed/hero: w=1600, gallery thumbnails: w=800, lightbox: w=1400
 */
export function wpImage(src: string, width: number = 1200): string {
  if (!src) return src;
  // Only optimize WordPress.com hosted images
  if (!src.includes('katherinemariedotcom.wordpress.com') && !src.includes('wp.com')) {
    return src;
  }
  // Strip any existing resize params
  const url = src.replace(/\?.*$/, '');
  return `${url}?w=${width}&quality=80`;
}

export const IMG_SIZES = {
  hero: 1600,
  fullBleed: 1400,
  gallery: 800,
  thumbnail: 600,
  lightbox: 1400,
} as const;
