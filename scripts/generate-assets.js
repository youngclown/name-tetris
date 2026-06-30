const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i += 1) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j += 1) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ -1) >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([length, typeBuf, data, crcBuf]);
}

function createPng(size, [r, g, b, a = 255]) {
  const row = Buffer.alloc(1 + size * 4);
  const raw = Buffer.alloc((1 + size * 4) * size);

  for (let y = 0; y < size; y += 1) {
    const start = y * (1 + size * 4);
    raw[start] = 0;
    for (let x = 0; x < size; x += 1) {
      const offset = start + 1 + x * 4;
      const edge = x < 4 || y < 4 || x >= size - 4 || y >= size - 4;
      raw[offset] = edge ? Math.min(255, r + 40) : r;
      raw[offset + 1] = edge ? Math.min(255, g + 40) : g;
      raw[offset + 2] = edge ? Math.min(255, b + 40) : b;
      raw[offset + 3] = a;
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const assetsDir = path.join(__dirname, '..', 'assets');
fs.mkdirSync(assetsDir, { recursive: true });

const iconColor = [255, 107, 107, 255];
const splashColor = [26, 26, 46, 255];

fs.writeFileSync(path.join(assetsDir, 'icon.png'), createPng(1024, iconColor));
fs.writeFileSync(path.join(assetsDir, 'splash-icon.png'), createPng(512, splashColor));
fs.writeFileSync(path.join(assetsDir, 'adaptive-icon.png'), createPng(1024, iconColor));

console.log('Assets generated.');