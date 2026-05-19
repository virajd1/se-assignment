import { BASE_URL, API_KEY } from './config.js';

const paths = [
  '/',
  '/api/v1/health',
  '/api/v1/dataset',
  '/api/v1/submit',
  '/api/v1/key',
  '/api/v1/keys',
  '/api/v1/secret',
  '/api/v1/decrypt',
  '/api/v1/time',
  '/api/v1/remaining',
  '/api/v1/clock',
  '/api/v1/info',
  '/api/v1/me',
  '/api/v1/profile',
  '/api/v1/metadata',
  '/api/v1/metadata/key',
  '/api/v1/keypair',
  '/api/v1/whoami',
  '/api/v1/status',
  '/api/v1/challenge',
];

async function probe(path) {
  const url = new URL(path, BASE_URL).toString();
  try {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${API_KEY}` } });
    const text = await res.text();
    console.log('---', path, '---');
    console.log('Status:', res.status);
    const ct = res.headers.get('content-type') || '';
    console.log('Content-Type:', ct);
    if (text.length > 1000) console.log(text.slice(0, 1000) + '\n...[truncated]');
    else console.log(text);
  } catch (e) {
    console.log('---', path, '---');
    console.log('ERROR:', e.message);
  }
}

async function main() {
  for (const p of paths) {
    // small pause to be polite
    await probe(p);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
