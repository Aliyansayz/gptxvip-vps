/**
 * Derives the shared brand assets from the single source artwork
 * `public/images/favicon.png` (the GPTX knot mark, 2116x2084 RGBA).
 *
 * Outputs
 *   public/images/logo.png         256px square, transparent  (app <Logo/> mark)
 *   public/images/logo-192.png     192px square, transparent  (apple-touch-icon)
 *   public/images/logo-512.png     512px square, transparent  (high-dpi favicon)
 *   public/images/favicon.ico      16/32/48 multi-resolution  (legacy favicon)
 *
 * Run with: npm run brand:build
 */
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

const ROOT = path.resolve(__dirname, "..");
const IMAGES = path.join(ROOT, "public", "images");
const SOURCE = path.join(IMAGES, "favicon.png");

const ICO_SIZES = [16, 32, 48];

/**
 * The mark is drawn edge to edge, so a trimmed square would sit flush against
 * the header. Padding keeps optical breathing room at every rendered size.
 */
const PADDING_RATIO = 0.06;

function squareBuffer(size) {
  return sharp(SOURCE)
    .trim({ threshold: 1 })
    .resize({
      width: Math.round(size * (1 - PADDING_RATIO * 2)),
      height: Math.round(size * (1 - PADDING_RATIO * 2)),
      fit: "inside",
      withoutEnlargement: false,
    })
    .extend({
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9, palette: true, quality: 90 })
    .toBuffer();
}

/** Minimal ICONDIR + ICONDIRENTRY writer so the legacy favicon stays multi-size. */
function buildIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(images.length, 4);

  const entries = Buffer.alloc(16 * images.length);
  let offset = 6 + 16 * images.length;

  images.forEach((image, index) => {
    const base = index * 16;
    entries.writeUInt8(image.size >= 256 ? 0 : image.size, base + 0); // width
    entries.writeUInt8(image.size >= 256 ? 0 : image.size, base + 1); // height
    entries.writeUInt8(0, base + 2); // palette size
    entries.writeUInt8(0, base + 3); // reserved
    entries.writeUInt16LE(1, base + 4); // color planes
    entries.writeUInt16LE(32, base + 6); // bits per pixel
    entries.writeUInt32LE(image.data.length, base + 8);
    entries.writeUInt32LE(offset, base + 12);
    offset += image.data.length;
  });

  return Buffer.concat([header, entries, ...images.map((image) => image.data)]);
}

async function main() {
  if (!fs.existsSync(SOURCE)) {
    throw new Error(`Missing brand source artwork: ${SOURCE}`);
  }

  const written = [];

  for (const size of [256, 192, 512]) {
    const name = size === 256 ? "logo.png" : `logo-${size}.png`;
    const data = await squareBuffer(size);
    fs.writeFileSync(path.join(IMAGES, name), data);
    written.push(`${name} (${(data.length / 1024).toFixed(1)} kB)`);
  }

  const icoImages = [];
  for (const size of ICO_SIZES) {
    icoImages.push({
      size,
      data: await sharp(await squareBuffer(size))
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true })
        .then(({ data, info }) => encodeBmp(data, info)),
    });
  }
  fs.writeFileSync(path.join(IMAGES, "favicon.ico"), buildIco(icoImages));
  written.push(`favicon.ico (${ICO_SIZES.join("/")})`);

  console.log(`Brand assets written to public/images:\n  ${written.join("\n  ")}`);
}

/** 32-bit BGRA DIB (BITMAPINFOHEADER + XOR bitmap + AND mask), bottom-up. */
function encodeBmp(rgba, info) {
  const { width, height } = info;
  const rowBytes = width * 4;
  const andRowBytes = Math.ceil(width / 32) * 4;
  const xorSize = rowBytes * height;
  const andSize = andRowBytes * height;

  const dib = Buffer.alloc(40 + xorSize + andSize);
  dib.writeUInt32LE(40, 0);
  dib.writeInt32LE(width, 4);
  dib.writeInt32LE(height * 2, 8); // XOR + AND stacked
  dib.writeUInt16LE(1, 12);
  dib.writeUInt16LE(32, 14);
  dib.writeUInt32LE(0, 16); // BI_RGB
  dib.writeUInt32LE(xorSize + andSize, 20);

  for (let y = 0; y < height; y += 1) {
    const srcRow = (height - 1 - y) * rowBytes;
    const dstRow = 40 + y * rowBytes;
    for (let x = 0; x < width; x += 1) {
      const src = srcRow + x * 4;
      const dst = dstRow + x * 4;
      dib[dst] = rgba[src + 2]; // B
      dib[dst + 1] = rgba[src + 1]; // G
      dib[dst + 2] = rgba[src]; // R
      dib[dst + 3] = rgba[src + 3]; // A
    }
  }
  // AND mask stays zeroed: the alpha channel already carries transparency.
  return dib;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
