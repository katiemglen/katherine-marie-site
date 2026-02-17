import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const ROOT = new URL('..', import.meta.url).pathname;
const posts = JSON.parse(readFileSync(join(ROOT, 'posts.json'), 'utf8'));
const manifest = JSON.parse(readFileSync(join(ROOT, 'public', 'images', 'manifest.json'), 'utf8'));

let totalUpdated = 0;

// Sort manifest keys by length (longest first) to avoid partial replacements
const sortedEntries = Object.entries(manifest).sort((a, b) => b[0].length - a[0].length);

for (const post of posts) {
  // Update images[] array
  if (post.images) {
    post.images = post.images.map(url => {
      const base = url.replace(/\?.*$/, '');
      if (manifest[base]) {
        totalUpdated++;
        return manifest[base];
      }
      return url;
    });
  }

  // Update content HTML - replace all WordPress image URLs
  if (post.content) {
    let content = post.content;
    for (const [oldUrl, newPath] of sortedEntries) {
      // Replace with and without query params
      const escaped = oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const re = new RegExp(escaped + '(\\?[^"\'\\s<>]*)?', 'g');
      const matches = content.match(re);
      if (matches) {
        totalUpdated += matches.length;
        content = content.replace(re, newPath);
      }
    }
    post.content = content;
  }
}

writeFileSync(join(ROOT, 'posts.json'), JSON.stringify(posts, null, 2));
console.log(`Updated ${totalUpdated} image references across ${posts.length} posts.`);
console.log('posts.json saved.');

// Verify no WordPress image URLs remain
const remaining = JSON.stringify(posts).match(/katherinemariedotcom\.wordpress\.com\/wp-content\/uploads/g);
if (remaining) {
  console.warn(`WARNING: ${remaining.length} WordPress image references still remain!`);
} else {
  console.log('✓ No WordPress image URLs remain in posts.json');
}
