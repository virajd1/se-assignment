import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import zlib from 'node:zlib';

function toHex(buf, len = 64) {
  return Buffer.from(buf).slice(0, len).toString('hex');
}

function toUtf8(buf, len = 256) {
  return Buffer.from(buf).slice(0, len).toString('utf8');
}

function sha256(buf) {
  const h = createHash('sha256');
  h.update(buf);
  return h.digest('hex');
}

function entropy(buf) {
  const counts = new Array(256).fill(0);
  for (const b of buf) counts[b]++;
  const len = buf.length;
  let ent = 0;
  for (const c of counts) {
    if (c === 0) continue;
    const p = c / len;
    ent -= p * Math.log2(p);
  }
  return ent;
}

function tryGunzip(buf) {
  try {
    return zlib.gunzipSync(buf);
  } catch (e) {
    return null;
  }
}

function tryInflate(buf) {
  try {
    return zlib.inflateSync(buf);
  } catch (e) {
    return null;
  }
}

function detectMagic(buf) {
  const b = Buffer.from(buf);
  const sig = b.slice(0, 8).toString('hex');
  const map = {
    '1f8b0800': 'gzip',
    '504b0304': 'zip',
    '25504446': 'pdf',
    '89504e47': 'png',
    '3c3f786d': 'xml',
    '7b227b22': 'json-ish',
  };
  for (const k of Object.keys(map)) {
    if (sig.startsWith(k)) return map[k];
  }
  return 'unknown';
}

function main() {
  const path = process.argv[2] || 'dataset.bin';
  const buf = readFileSync(path);
  console.log('Path:', path);
  console.log('Size:', buf.length);
  console.log('SHA-256:', sha256(buf));
  console.log('Magic detect:', detectMagic(buf));
  console.log('First 128 bytes (hex):', toHex(buf, 128));
  console.log('First 512 bytes (utf8):');
  console.log(toUtf8(buf, 512));
  console.log('Entropy:', entropy(buf).toFixed(3), 'bits/byte');

  // Try parsing as JSON with base64 chunks
  try {
    const text = buf.toString('utf8');
    const obj = JSON.parse(text);
    if (obj && Array.isArray(obj.data)) {
      console.log('\nDetected JSON with data array of length', obj.data.length);
      const joined = obj.data.join('');
      const decoded = Buffer.from(joined, 'base64');
      console.log('Decoded payload size:', decoded.length);
      console.log('Decoded payload sha256:', sha256(decoded));
      console.log('Decoded magic detect:', detectMagic(decoded));
      console.log('Decoded first 256 utf8:');
      console.log(toUtf8(decoded, 1024));
      console.log('Decoded entropy:', entropy(decoded).toFixed(3), 'bits/byte');

      const gun2 = tryGunzip(decoded);
      if (gun2) {
        console.log('\n-- decoded -> gunzip succeeded --');
        console.log('gunzip size:', gun2.length);
        console.log('gunzip sha256:', sha256(gun2));
        console.log('gunzip first 1024 utf8:');
        console.log(toUtf8(gun2, 2048));
        return;
      }

      const inf2 = tryInflate(decoded);
      if (inf2) {
        console.log('\n-- decoded -> inflate succeeded --');
        console.log('inflate size:', inf2.length);
        console.log('inflate sha256:', sha256(inf2));
        console.log('inflate first 1024 utf8:');
        console.log(toUtf8(inf2, 2048));
        return;
      }

      console.log('\nNo decompression succeeded on decoded payload.');
      return;
    }
  } catch (e) {
    // not JSON
  }
  const gun = tryGunzip(buf);
  if (gun) {
    console.log('\n-- gunzip succeeded --');
    console.log('gunzip size:', gun.length);
    console.log('gunzip sha256:', sha256(gun));
    console.log('gunzip first 512 utf8:');
    console.log(toUtf8(gun, 1024));
    return;
  }

  const inf = tryInflate(buf);
  if (inf) {
    console.log('\n-- inflate succeeded --');
    console.log('inflate size:', inf.length);
    console.log('inflate sha256:', sha256(inf));
    console.log('inflate first 512 utf8:');
    console.log(toUtf8(inf, 1024));
    return;
  }

  console.log('\nNo automatic decompression succeeded.');
}

main();
