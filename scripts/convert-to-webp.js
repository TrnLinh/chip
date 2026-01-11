import sharp from "sharp";
import { readdir, unlink } from "fs/promises";
import { join, extname, basename } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PHOTO_DIR = join(__dirname, "../public/Recap");
const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif"];
const QUALITY = 80;

async function convertToWebP(filePath) {
  const ext = extname(filePath).toLowerCase();
  if (!IMAGE_EXTENSIONS.includes(ext)) return null;

  const webpPath = filePath.replace(/\.(jpg|jpeg|png|gif)$/i, ".webp");

  try {
    await sharp(filePath).webp({ quality: QUALITY }).toFile(webpPath);

    console.log(`✓ Converted: ${basename(filePath)} → ${basename(webpPath)}`);
    return { original: filePath, webp: webpPath };
  } catch (err) {
    console.error(`✗ Failed: ${basename(filePath)} - ${err.message}`);
    return null;
  }
}

async function processDirectory(dirPath) {
  const entries = await readdir(dirPath, { withFileTypes: true });
  const results = [];

  for (const entry of entries) {
    const fullPath = join(dirPath, entry.name);

    if (entry.isDirectory()) {
      const subResults = await processDirectory(fullPath);
      results.push(...subResults);
    } else if (entry.isFile()) {
      const result = await convertToWebP(fullPath);
      if (result) results.push(result);
    }
  }

  return results;
}

async function main() {
  console.log("🖼️  Converting images to WebP...\n");

  const results = await processDirectory(PHOTO_DIR);

  console.log(`\n✅ Converted ${results.length} images to WebP`);

  // Ask about deleting originals
  console.log(
    "\n📁 Original files preserved. You can delete them manually after verifying."
  );
}

main().catch(console.error);
