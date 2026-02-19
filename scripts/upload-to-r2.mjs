import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { readFileSync } from 'fs';
import { execSync } from 'child_process';
import { extname } from 'path';

const client = new S3Client({
  region: 'auto',
  endpoint: 'https://8778d571e3c5483cf5a0fed27a70cb48.r2.cloudflarestorage.com',
  credentials: {
    accessKeyId: '7b2b09d5a33e15f2759ea4d00d278ce9',
    secretAccessKey: 'f26e9b1e739a8a0549237d44914272099b74c6153d4c584513ff5aba4935c9ea',
  },
});

const BUCKET = 'katherine-marie';
const PUBLIC_DIR = './public';

const mimeTypes = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.png': 'image/png', '.gif': 'image/gif', '.webp': 'image/webp',
};

const files = execSync(
  `find ${PUBLIC_DIR} -type f \\( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.gif" -o -iname "*.webp" \\)`
).toString().trim().split('\n').filter(Boolean);

// Resume support - skip first N files
const START = parseInt(process.env.START || '0');
const remaining = files.slice(START);
console.log(`Total: ${files.length}, Starting from: ${START}, Remaining: ${remaining.length}`);

let uploaded = 0, failed = 0, totalBytes = 0;

// Upload sequentially to avoid memory issues
for (const file of remaining) {
  const key = file.replace('./public/', '');
  const ext = extname(file).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';
  const body = readFileSync(file);
  totalBytes += body.length;

  try {
    await client.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
    }));
    uploaded++;
    if (uploaded % 50 === 0) console.log(`  ${START + uploaded}/${files.length}...`);
  } catch (err) {
    console.error(`FAIL: ${key} - ${err.message}`);
    failed++;
  }
}

console.log(`\nDone! Uploaded: ${uploaded}, Failed: ${failed}, Size: ${(totalBytes / 1024 / 1024).toFixed(1)} MB`);
