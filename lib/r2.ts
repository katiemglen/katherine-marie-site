export const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_R2_URL || '';

export function r2Image(path: string): string {
  if (!R2_PUBLIC_URL || !path) return path;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const clean = path.startsWith('/') ? path.slice(1) : path;
  return `${R2_PUBLIC_URL}/${clean}`;
}
