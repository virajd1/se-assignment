import { BASE_URL, API_KEY } from './config.js';

async function main() {
  const url = new URL('/api/v1/stats', BASE_URL).toString();
  const res = await fetch(url, { headers: { Authorization: `Bearer ${API_KEY}` } });
  console.log('Status:', res.status);
  for (const [k, v] of res.headers) console.log(k + ':', v);
  const body = await res.text();
  console.log('Body:', body.slice(0, 2000));
}

main().catch((e) => { console.error(e); process.exit(1); });
