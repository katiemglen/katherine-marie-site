/**
 * Image optimization helpers.
 * All images are now served locally — these are passthroughs for compatibility.
 */
export function wpImage(src: string, _width: number = 1200): string {
  return src;
}

export const IMG_SIZES = {
  hero: 1600,
  fullBleed: 1400,
  gallery: 800,
  thumbnail: 600,
  lightbox: 1400,
} as const;
