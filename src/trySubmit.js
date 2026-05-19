import { BASE_URL, API_KEY } from './config.js';

async function main() {
  const url = new URL('/api/v1/submit', BASE_URL).toString();
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'content_hash', value: '2bf74cdbd19ae2d82a52d54691197bef019c3e236b14dad5381132bdc85d2fe8' }),
  });
  const text = await res.text();
  console.log('Status:', res.status);
  console.log('Body:', text);
}

main().catch((e) => { console.error(e); process.exit(1); });
