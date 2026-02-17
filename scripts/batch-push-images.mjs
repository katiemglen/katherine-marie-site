#!/usr/bin/env node
/**
 * Batch push images to GitHub in small groups.
 * Run: node scripts/batch-push-images.mjs
 * 
 * Safe to run multiple times — picks up where it left off.
 * Each batch: stage ~250 files, commit, push.
 */

import { execSync } from 'child_process';
import { readdirSync, statSync, existsSync, writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

const ROOT = join(import.meta.dirname, '..');
const IMAGE_DIR = join(ROOT, 'public', 'images');
const PROGRESS_FILE = join(ROOT, 'scripts', 'batch-progress.json');
const BATCH_SIZE = 250; // files per batch

function run(cmd) {
  console.log(`$ ${cmd}`);
  return execSync(cmd, { cwd: ROOT, encoding: 'utf-8', timeout: 120_000 }).trim();
}

function getAllImageFiles() {
  const files = [];
  const folders = readdirSync(IMAGE_DIR);
  for (const folder of folders) {
    const folderPath = join(IMAGE_DIR, folder);
    if (!statSync(folderPath).isDirectory()) {
      if (folder === 'manifest.json') files.push(`public/images/${folder}`);
      continue;
    }
    const images = readdirSync(folderPath);
    for (const img of images) {
      files.push(`public/images/${folder}/${img}`);
    }
  }
  return files;
}

function loadProgress() {
  if (existsSync(PROGRESS_FILE)) {
    return JSON.parse(readFileSync(PROGRESS_FILE, 'utf-8'));
  }
  return { pushed: [], batchesDone: 0, status: 'pending' };
}

function saveProgress(progress) {
  writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

async function main() {
  // First, check if images are already committed or need to be staged
  const allFiles = getAllImageFiles();
  const progress = loadProgress();
  const alreadyPushed = new Set(progress.pushed);

  const remaining = allFiles.filter(f => !alreadyPushed.has(f));
  console.log(`Total image files: ${allFiles.length}`);
  console.log(`Already pushed: ${alreadyPushed.size}`);
  console.log(`Remaining: ${remaining.length}`);

  if (remaining.length === 0) {
    console.log('All images pushed! ✅');
    progress.status = 'complete';
    saveProgress(progress);
    return;
  }

  // Take one batch
  const batch = remaining.slice(0, BATCH_SIZE);
  const batchNum = progress.batchesDone + 1;
  console.log(`\nBatch ${batchNum}: ${batch.length} files`);

  // Stage files
  for (const file of batch) {
    run(`git add "${file}"`);
  }

  // Commit
  run(`git commit -m "Image batch ${batchNum}: ${batch.length} files (${alreadyPushed.size + batch.length}/${allFiles.length} total)"`);

  // Push
  console.log('Pushing to GitHub...');
  run(`git push origin main`);

  // Update progress
  for (const f of batch) {
    progress.pushed.push(f);
  }
  progress.batchesDone = batchNum;
  progress.status = (alreadyPushed.size + batch.length >= allFiles.length) ? 'complete' : 'in_progress';
  saveProgress(progress);

  console.log(`\nBatch ${batchNum} complete! ✅ (${alreadyPushed.size + batch.length}/${allFiles.length} pushed)`);
  if (progress.status !== 'complete') {
    console.log(`Run again for the next batch.`);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
