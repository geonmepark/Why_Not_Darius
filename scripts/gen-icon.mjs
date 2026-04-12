/**
 * gen-icon.mjs
 * Node.js 빌트인 모듈만으로 256x256 PNG 아이콘 생성
 * 디자인: Darius 테마 (다크레드 링 + 골드 중앙)
 * 실행: node scripts/gen-icon.mjs
 */
import { deflateSync } from 'zlib';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const W = 256, H = 256;
const CX = W / 2, CY = H / 2;

// ── CRC32 (인라인 구현) ──────────────────────────────────────────────────────
const crcTable = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let j = 0; j < 8; j++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
  crcTable[i] = c;
}
function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (const b of buf) c = crcTable[(c ^ b) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}

// ── PNG 청크 생성 ────────────────────────────────────────────────────────────
function makeChunk(type, data) {
  const typeBytes = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.allocUnsafe(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.allocUnsafe(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBytes, data])), 0);
  return Buffer.concat([lenBuf, typeBytes, data, crcBuf]);
}

// ── IHDR (256x256, RGB) ──────────────────────────────────────────────────────
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0);
ihdr.writeUInt32BE(H, 4);
ihdr[8]  = 8; // bit depth
ihdr[9]  = 2; // color type: RGB
ihdr[10] = 0; // compression
ihdr[11] = 0; // filter
ihdr[12] = 0; // interlace

// ── 픽셀 데이터 생성 ─────────────────────────────────────────────────────────
// 디자인:
//   r > 120        → 거의 검정 #120808 (배경)
//   80 < r ≤ 120   → 다크레드 #6B0000 (아우터 링)
//   r ≤ 80         → 골드 #C8973A (이너 서클)
//   이너 서클 내 십자 (팔 너비 18px) → 브라이트 골드 #FFD700
const scanlines = Buffer.alloc(H * (1 + W * 3));

for (let y = 0; y < H; y++) {
  const base = y * (1 + W * 3);
  scanlines[base] = 0; // filter: None
  for (let x = 0; x < W; x++) {
    const i = base + 1 + x * 3;
    const dx = x - CX, dy = y - CY;
    const r = Math.sqrt(dx * dx + dy * dy);
    const onCross = Math.abs(dx) < 9 || Math.abs(dy) < 9;

    let R, G, B;
    if (r > 120) {
      R = 0x12; G = 0x08; B = 0x08;
    } else if (r > 80) {
      R = 0x6B; G = 0x00; B = 0x00;
    } else if (onCross) {
      R = 0xFF; G = 0xD7; B = 0x00;
    } else {
      R = 0xC8; G = 0x97; B = 0x3A;
    }
    scanlines[i]   = R;
    scanlines[i+1] = G;
    scanlines[i+2] = B;
  }
}

// ── PNG 조립 ─────────────────────────────────────────────────────────────────
const idat = deflateSync(scanlines, { level: 9 });
const PNG_SIG = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

const png = Buffer.concat([
  PNG_SIG,
  makeChunk('IHDR', ihdr),
  makeChunk('IDAT', idat),
  makeChunk('IEND', Buffer.alloc(0)),
]);

const outPath = join(__dirname, '..', 'public', 'icons', 'app-icon.png');
writeFileSync(outPath, png);
console.log(`Icon generated: public/icons/app-icon.png (${png.length} bytes)`);
