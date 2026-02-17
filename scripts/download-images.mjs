import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, basename } from 'path';
import https from 'https';
import http from 'http';

const ROOT = new URL('..', import.meta.url).pathname;
const posts = JSON.parse(readFileSync(join(ROOT, 'posts.json'), 'utf8'));

// Extract all unique image URLs mapped to their post slug
const urlRegex = /https?:\/\/katherinemariedotcom\.wordpress\.com\/wp-content\/uploads\/[^\s"'<>)]+/g;
const urlToSlug = new Map(); // baseUrl -> slug

for (const post of posts) {
  const slug = post.slug;
  // From images[] array
  for (const url of (post.images || [])) {
    const base = url.replace(/\?.*$/, '');
    if (!urlToSlug.has(base)) urlToSlug.set(base, slug);
  }
  // From content HTML
  const matches = (post.content || '').match(urlRegex);
  if (matches) {
    for (const url of matches) {
      const base = url.replace(/\?.*$/, '');
      if (!urlToSlug.has(base)) urlToSlug.set(base, slug);
    }
  }
}

console.log(`Found ${urlToSlug.size} unique images across ${posts.length} posts`);

// Track filenames per slug to avoid conflicts
const usedNames = new Map(); // slug -> Set of filenames

function getLocalPath(baseUrl, slug) {
  let name = basename(baseUrl);
  if (!usedNames.has(slug)) usedNames.set(slug, new Set());
  const used = usedNames.get(slug);
  if (used.has(name)) {
    const dot = name.lastIndexOf('.');
    const stem = dot > 0 ? name.slice(0, dot) : name;
    const ext = dot > 0 ? name.slice(dot) : '';
    let i = 2;
    while (used.has(`${stem}_${i}${ext}`)) i++;
    name = `${stem}_${i}${ext}`;
  }
  used.add(name);
  return `images/${slug}/${name}`;
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const dir = join(ROOT, 'public', dest.substring(0, dest.lastIndexOf('/')));
    mkdirSync(dir, { recursive: true });
    const filePath = join(ROOT, 'public', dest);
    if (existsSync(filePath)) { resolve('skipped'); return; }

    const get = url.startsWith('https') ? https.get : http.get;
    const attempt = (u, redirects = 0) => {
      if (redirects > 5) { reject(new Error('Too many redirects')); return; }
      get(u, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          attempt(res.headers.location, redirects + 1);
          return;
        }
        if (res.statusCode !== 200) {
          res.resume();
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }
        const { createWriteStream } = await_import_fs();
        const stream = require_createWriteStream(filePath);
        res.pipe(stream);
        stream.on('finish', () => resolve('ok'));
        stream.on('error', reject);
      }).on('error', reject);
    };
    attempt(url);
  });
}

// Avoid top-level dynamic import issues - just use fs directly
function require_createWriteStream(path) {
  const fs = await_import_fs();
  return fs.createWriteStream(path);
}
function await_import_fs() {
  // We already imported what we need at top, use a different approach
  return null;
}

// Rewrite download to be simpler
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const dir = join(ROOT, 'public', dest.substring(0, dest.lastIndexOf('/')));
    mkdirSync(dir, { recursive: true });
    const filePath = join(ROOT, 'public', dest);
    if (existsSync(filePath)) { resolve('skipped'); return; }

    const doRequest = (u, redirects = 0) => {
      if (redirects > 5) { reject(new Error('Too many redirects')); return; }
      const mod = u.startsWith('https') ? https : http;
      mod.get(u, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          res.resume();
          doRequest(res.headers.location, redirects + 1);
          return;
        }
        if (res.statusCode !== 200) {
          res.resume();
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }
        const chunks = [];
        res.on('data', c => chunks.push(c));
        res.on('end', () => {
          writeFileSync(filePath, Buffer.concat(chunks));
          resolve('ok');
        });
        res.on('error', reject);
      }).on('error', reject);
    };
    doRequest(url);
  });
}

// Build download list
const tasks = [];
const manifest = {};

for (const [baseUrl, slug] of urlToSlug) {
  const localPath = getLocalPath(baseUrl, slug);
  manifest[baseUrl] = '/' + localPath;
  const downloadUrl = baseUrl + '?w=1600';
  tasks.push({ baseUrl, downloadUrl, localPath, slug });
}

// Run with concurrency
const CONCURRENCY = 10;
let completed = 0;
let failed = [];

async function runBatch(batch) {
  const results = await Promise.allSettled(
    batch.map(async (task) => {
      try {
        const result = await downloadFile(task.downloadUrl, task.localPath);
        completed++;
        if (result === 'skipped') {
          console.log(`[${completed}/${tasks.length}] Skipped (exists): ${task.localPath}`);
        } else {
          console.log(`[${completed}/${tasks.length}] Downloaded: ${task.localPath}`);
        }
      } catch (err) {
        completed++;
        console.error(`[${completed}/${tasks.length}] FAILED: ${task.localPath} — ${err.message}`);
        failed.push(task);
      }
    })
  );
}

async function main() {
  console.log(`Downloading ${tasks.length} images...`);
  
  for (let i = 0; i < tasks.length; i += CONCURRENCY) {
    const batch = tasks.slice(i, i + CONCURRENCY);
    await runBatch(batch);
    if (i + CONCURRENCY < tasks.length) {
      await new Promise(r => setTimeout(r, 100));
    }
  }

  // Retry failed ones
  if (failed.length > 0) {
    console.log(`\nRetrying ${failed.length} failed downloads...`);
    const retries = [...failed];
    failed = [];
    for (let i = 0; i < retries.length; i += CONCURRENCY) {
      const batch = retries.slice(i, i + CONCURRENCY);
      await Promise.allSettled(
        batch.map(async (task) => {
          try {
            await downloadFile(task.downloadUrl, task.localPath);
            console.log(`[RETRY OK] ${task.localPath}`);
          } catch (err) {
            console.error(`[RETRY FAILED] ${task.localPath} — ${err.message}`);
            failed.push(task);
          }
        })
      );
      await new Promise(r => setTimeout(r, 100));
    }
  }

  // Save manifest
  mkdirSync(join(ROOT, 'public', 'images'), { recursive: true });
  writeFileSync(join(ROOT, 'public', 'images', 'manifest.json'), JSON.stringify(manifest, null, 2));
  
  console.log(`\nDone! ${tasks.length - failed.length}/${tasks.length} images downloaded.`);
  if (failed.length > 0) {
    console.log(`${failed.length} permanently failed:`);
    failed.forEach(t => console.log(`  - ${t.baseUrl}`));
  }
  console.log(`Manifest saved to public/images/manifest.json`);
}

main().catch(console.error);
