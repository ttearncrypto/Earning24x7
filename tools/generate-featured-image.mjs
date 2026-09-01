import sharp from 'sharp';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { writeFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const W = 1200;
const H = 630;

const out = process.argv[2];
const title = process.argv[3] || 'Welcome to Earning24x7';
const tagline = process.argv[4] || 'Ad network reviews, affiliate programs & money-making guides';

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function wrapTitle(t) {
  const words = t.split(/\s+/);
  if (words.length <= 2) return [{ text: t, size: 72 }];
  if (words.length <= 4) {
    const mid = Math.ceil(words.length / 2);
    return [
      { text: words.slice(0, mid).join(' '), size: 64 },
      { text: words.slice(mid).join(' '), size: 64 }
    ];
  }
  const third = Math.ceil(words.length / 3);
  return [
    { text: words.slice(0, third).join(' '), size: 54 },
    { text: words.slice(third, third * 2).join(' '), size: 54 },
    { text: words.slice(third * 2).join(' '), size: 54 }
  ];
}

const lines = wrapTitle(title);
const lineStarts = lines.map((_, i) => 300 + i * (lines.length === 3 ? 78 : 78) - (lines.length - 1) * 39);

const svg = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0f172a"/>
      <stop offset="1" stop-color="#1e3a5f"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#3b82f6"/>
      <stop offset="1" stop-color="#22d3ee"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <circle cx="1050" cy="120" r="220" fill="#3b82f6" opacity="0.15"/>
  <circle cx="80" cy="560" r="180" fill="#22d3ee" opacity="0.12"/>
  <rect x="60" y="60" width="14" height="14" rx="3" fill="url(#accent)"/>
  <text x="86" y="72" font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="#e2e8f0">EARNING</text>
  <text x="86" y="90" font-family="Arial, sans-serif" font-size="20" fill="#22d3ee">24x7</text>
  ${lines
    .map(
      (l, i) =>
        `<text x="600" y="${lineStarts[i]}" text-anchor="middle" font-family="Arial, sans-serif" font-size="${l.size}" font-weight="bold" fill="url(#accent)">${esc(l.text)}</text>`
    )
    .join('\n  ')}
  <text x="600" y="${lineStarts[lineStarts.length - 1] + 52}" text-anchor="middle" font-family="Arial, sans-serif" font-size="26" fill="#cbd5e1">${esc(tagline)}</text>
  <rect x="520" y="${lineStarts[lineStarts.length - 1] + 82}" width="160" height="6" rx="3" fill="url(#accent)"/>
  <text x="600" y="${lineStarts[lineStarts.length - 1] + 200}" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="#94a3b8">by TTEarnCrypto</text>
</svg>`;

const tmpSvg = join(__dirname, 'featured.svg');
writeFileSync(tmpSvg, svg);

await sharp(tmpSvg).webp({ quality: 88 }).toFile(out);
console.log('image: ' + out);
console.log('width/height: ' + W + ' ' + H);