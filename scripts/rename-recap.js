import { readdir, rename, unlink } from "fs/promises";
import { join, extname } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const RECAP_DIR = join(__dirname, "../public/Recap");
const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif"];

async function processPhaseFolder(phasePath, phaseName) {
  const entries = await readdir(phasePath, { withFileTypes: true });

  // Separate webp files and other image files
  const webpFiles = [];
  const otherImages = [];

  for (const entry of entries) {
    if (!entry.isFile()) continue;

    const ext = extname(entry.name).toLowerCase();
    const fullPath = join(phasePath, entry.name);

    if (ext === ".webp") {
      webpFiles.push({ name: entry.name, path: fullPath });
    } else if (IMAGE_EXTENSIONS.includes(ext)) {
      otherImages.push({ name: entry.name, path: fullPath });
    }
  }

  console.log(`\n📁 ${phaseName}:`);
  console.log(`   Found ${webpFiles.length} WebP files`);
  console.log(`   Found ${otherImages.length} other images to delete`);

  // Delete non-webp images
  for (const img of otherImages) {
    try {
      await unlink(img.path);
      console.log(`   🗑️  Deleted: ${img.name}`);
    } catch (err) {
      console.error(`   ✗ Failed to delete: ${img.name} - ${err.message}`);
    }
  }

  // Sort webp files alphabetically for consistent ordering
  webpFiles.sort((a, b) => a.name.localeCompare(b.name));

  // Rename webp files to 1.webp, 2.webp, etc.
  // First rename to temp names to avoid conflicts
  const tempNames = [];
  for (let i = 0; i < webpFiles.length; i++) {
    const tempPath = join(phasePath, `__temp_${i}__.webp`);
    try {
      await rename(webpFiles[i].path, tempPath);
      tempNames.push(tempPath);
    } catch (err) {
      console.error(
        `   ✗ Failed to temp rename: ${webpFiles[i].name} - ${err.message}`
      );
      tempNames.push(null);
    }
  }

  // Now rename from temp to final names
  for (let i = 0; i < tempNames.length; i++) {
    if (!tempNames[i]) continue;

    const newName = `${i + 1}.webp`;
    const newPath = join(phasePath, newName);
    try {
      await rename(tempNames[i], newPath);
      console.log(`   ✓ Renamed: ${webpFiles[i].name} → ${newName}`);
    } catch (err) {
      console.error(
        `   ✗ Failed to rename: ${webpFiles[i].name} → ${newName} - ${err.message}`
      );
    }
  }
}

async function main() {
  console.log("🔄 Processing Recap folder...");

  const entries = await readdir(RECAP_DIR, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const phasePath = join(RECAP_DIR, entry.name);
      await processPhaseFolder(phasePath, entry.name);
    }
  }

  console.log("\n✅ Done!");
}

main().catch(console.error);
