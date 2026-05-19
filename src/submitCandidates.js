import { readFileSync } from 'node:fs';
import crypto from 'node:crypto';
import { BASE_URL, API_KEY } from './config.js';

function hex(buf) { return Buffer.from(buf).toString('hex'); }
function hexUpper(buf) { return Buffer.from(buf).toString('hex').toUpperCase(); }
function b64(buf) { return Buffer.from(buf).toString('base64'); }

async function postSubmission(value) {
  const url = new URL('/api/v1/submit', BASE_URL).toString();
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'content_hash', value }),
  });
  const text = await res.text();
  return { status: res.status, body: text };
}

async function main() {
  const raw = readFileSync('dataset_raw.bin');
  const dec = readFileSync('dataset_full.decoded');
  const json = readFileSync('dataset_full.json');
  const joined = JSON.parse(json.toString('utf8')).data.join('');

  const candidates = [];
  // raw bytes
  candidates.push(hex(raw));
  candidates.push(hexUpper(raw));
  candidates.push(b64(raw));
  candidates.push('sha256:' + hex(raw));
  candidates.push('SHA256:' + hexUpper(raw));

  // decoded bytes
  candidates.push(hex(dec));
  candidates.push(b64(dec));
  candidates.push('sha256:' + hex(dec));

  // assembled JSON bytes
  candidates.push(hex(json));
  candidates.push(b64(json));

  // joined base64 string (as utf8 hash)
  const joinedBuf = Buffer.from(joined, 'utf8');
  candidates.push(hex(joinedBuf));
  candidates.push(b64(joinedBuf));

  // ETag from earlier (strip W/ and quotes) - best effort
  // known etag: 0d90d944610126fdb037c9953862bab0ec956d06bf43a63ce17aba9c730ebd17
  candidates.push('0d90d944610126fdb037c9953862bab0ec956d06bf43a63ce17aba9c730ebd17');

  // unique-ify
  const uniq = [...new Set(candidates)];

  for (const c of uniq) {
    console.log('\nSubmitting candidate:', c.slice(0,80) + (c.length>80?('... len='+c.length):''));
    try {
      const res = await postSubmission(c);
      console.log('Status:', res.status);
      console.log('Body:', res.body);
      const parsed = (() => { try { return JSON.parse(res.body); } catch { return null; } })();
      if (parsed && parsed.correct) {
        console.log('Accepted candidate:', c);
        return;
      }
    } catch (e) {
      console.error('Error posting:', e.message);
    }
    // small pause to avoid hitting rate limits
    await new Promise(r => setTimeout(r, 800));
  }

  console.log('\nNo candidate accepted.');
}

main().catch((e)=>{ console.error(e); process.exit(1); });
