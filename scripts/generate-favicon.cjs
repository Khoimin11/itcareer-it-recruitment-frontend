const fs = require("node:fs/promises");
const path = require("node:path");
const sharp = require("sharp");

async function main() {
  const source = process.argv[2];
  if (!source) throw new Error("Usage: node scripts/generate-favicon.cjs <logo.png>");
  const output = path.join(__dirname, "../src/app");
  const sizes = [16, 32, 48, 64, 256];
  const images = await Promise.all(sizes.map(size => sharp(source).resize(size, size, { fit: "contain" }).png().toBuffer()));
  const header = Buffer.alloc(6 + sizes.length * 16);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(sizes.length, 4);
  let offset = header.length;
  images.forEach((image, index) => {
    const entry = 6 + index * 16;
    header[entry] = sizes[index] === 256 ? 0 : sizes[index];
    header[entry + 1] = header[entry];
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(image.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += image.length;
  });
  await fs.writeFile(path.join(output, "favicon.ico"), Buffer.concat([header, ...images]));
  await sharp(source).resize(192, 192, { fit: "contain" }).png().toFile(path.join(output, "icon.png"));
  await sharp(source).resize(180, 180, { fit: "contain" }).png().toFile(path.join(output, "apple-icon.png"));
  console.log("Generated favicon.ico (16, 32, 48, 64, 256 px), icon.png (192 px), apple-icon.png (180 px).");
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
