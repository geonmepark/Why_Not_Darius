/**
 * gen-icon.mjs
 * public/icons/app-icon.svg 하나에서 앱·사이트 아이콘을 만든다.
 *   - public/icons/app-icon.png (512) — Electron 창·트레이·electron-builder 설치 아이콘
 *   - src/app/favicon.ico (16·32·48) — 사이트 파비콘
 * 실행: yarn gen-icon
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const svg = readFileSync(join(root, 'public', 'icons', 'app-icon.svg'));

const render = (size) => sharp(svg, { density: 384 }).resize(size, size).png().toBuffer();

/** PNG 를 그대로 담는 ICO (Vista 이후 모든 브라우저·Windows 가 읽는다) */
function toIco(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(pngs.length, 4);

  let offset = 6 + 16 * pngs.length;
  const entries = pngs.map(({ size, data }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0); // width (0 = 256)
    e.writeUInt8(size >= 256 ? 0 : size, 1); // height
    e.writeUInt8(0, 2); // palette
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // color planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    return e;
  });
  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.data)]);
}

const png = await render(512);
writeFileSync(join(root, 'public', 'icons', 'app-icon.png'), png);
console.log(`public/icons/app-icon.png (512, ${png.length} bytes)`);

const icoSizes = [16, 32, 48];
const ico = toIco(
  await Promise.all(icoSizes.map(async (size) => ({ size, data: await render(size) }))),
);
writeFileSync(join(root, 'src', 'app', 'favicon.ico'), ico);
console.log(`src/app/favicon.ico (${icoSizes.join('·')}, ${ico.length} bytes)`);
