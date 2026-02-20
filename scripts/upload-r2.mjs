import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative, extname } from "path";

const client = new S3Client({
  region: "auto",
  endpoint: "https://8778d571e3c5483cf5a0fed27a70cb48.r2.cloudflarestorage.com",
  credentials: {
    accessKeyId: "7b2b09d5a33e15f2759ea4d00d278ce9",
    secretAccessKey: "f26e9b1e739a8a0549237d44914272099b74c6153d4c584513ff5aba4935c9ea",
  },
});

const BUCKET = "katherine-marie";
const CONCURRENCY = 15;
const BASE = join(process.cwd(), "public/images");

const MIME = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".gif": "image/gif", ".webp": "image/webp" };

function walk(dir) {
  let files = [];
  for (const f of readdirSync(dir)) {
    const full = join(dir, f);
    if (statSync(full).isDirectory()) files.push(...walk(full));
    else files.push(full);
  }
  return files;
}

const files = walk(BASE);
console.log(`Found ${files.length} files to upload`);

let uploaded = 0, errors = 0;

async function upload(filePath) {
  const key = "images/" + relative(BASE, filePath);
  const ext = extname(filePath).toLowerCase();
  const contentType = MIME[ext] || "application/octet-stream";
  try {
    await client.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: readFileSync(filePath),
      ContentType: contentType,
    }));
    uploaded++;
    if (uploaded % 100 === 0) console.log(`Uploaded ${uploaded}/${files.length}`);
  } catch (e) {
    errors++;
    console.error(`ERROR ${key}: ${e.message}`);
  }
}

// Process with concurrency limit
const queue = [...files];
async function worker() {
  while (queue.length) {
    const f = queue.shift();
    if (f) await upload(f);
  }
}

const workers = Array.from({ length: CONCURRENCY }, () => worker());
await Promise.all(workers);

console.log(`\nDone! Uploaded: ${uploaded}, Errors: ${errors}, Total: ${files.length}`);
