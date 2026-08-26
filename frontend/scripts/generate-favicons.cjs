// Script one-off: descarga el logo de Cloudinary y genera los favicons.
// Uso: node scripts/generate-favicons.js
const fs = require('fs');
const path = require('path');
const https = require('https');
const sharp = require('sharp');

const LOGO_URL =
  'https://res.cloudinary.com/dabikk5ei/image/upload/v1787667390/logo_ongamj.png';
const OUT_DIR = path.join(__dirname, '..', 'public');

function download(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return download(res.headers.location).then(resolve, reject);
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`No se pudo descargar el logo: HTTP ${res.statusCode}`));
        }
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => resolve(Buffer.concat(chunks)));
      })
      .on('error', reject);
  });
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const logoBuffer = await download(LOGO_URL);

  const targets = [
    { file: 'favicon-16x16.png', size: 16 },
    { file: 'favicon-32x32.png', size: 32 },
    { file: 'apple-touch-icon.png', size: 180 },
    { file: 'logo.png', size: 512 },
  ];

  for (const { file, size } of targets) {
    await sharp(logoBuffer)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(OUT_DIR, file));
    console.log(`Generado ${file}`);
  }
}

main().catch((err) => {
  console.error('Error generando favicons:', err.message);
  process.exit(1);
});
