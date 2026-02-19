/**
 * Cloudflare R2 image CDN configuration.
 * 
 * Images are stored in the katherine-marie R2 bucket.
 * The R2_PUBLIC_URL env var should be set to the public bucket URL.
 * Falls back to serving from local /public/ if not configured.
 */

export const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_R2_URL || '';

/**
 * Convert a local image path (e.g. "/images/slug/photo.jpg") to an R2 URL.
 * If R2 is not configured, returns the original path (local serving).
 */
export function r2Image(path: string): string {
  if (!R2_PUBLIC_URL || !path) return path;
  // Already an absolute URL
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  // Strip leading slash for URL joining
  const clean = path.startsWith('/') ? path.slice(1) : path;
  return `${R2_PUBLIC_URL}/${clean}`;
}
