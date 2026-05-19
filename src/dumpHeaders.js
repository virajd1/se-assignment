import { BASE_URL, API_KEY } from './config.js';

async function dump(path) {
  const url = new URL(path, BASE_URL).toString();
  const res = await fetch(url, { headers: { Authorization: `Bearer ${API_KEY}` } });
  console.log('---', path, 'Status:', res.status);
  for (const [k, v] of res.headers) {
    console.log(k + ':', v);
  }
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    const body = await res.json();
    console.log('Body keys:', Object.keys(body));
  } else {
    const text = await res.text();
    console.log('Body (truncated):', text.slice(0, 500));
  }
}

async function main() {
  await dump('/api/v1/dataset');
  await dump('/api/v1/health');
}

main().catch((e) => { console.error(e); process.exit(1); });
