import { BASE_URL, API_KEY } from './config.js';
import { writeFileSync } from 'node:fs';

async function fetchRange(start = 0, end = 99) {
  const url = new URL('/api/v1/dataset', BASE_URL);
  url.searchParams.set('batch', 'true');
  url.searchParams.set('range', `${start}-${end}`);
  const res = await fetch(url.toString(), { headers: { Authorization: `Bearer ${API_KEY}` } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const body = await res.json();
  const link = res.headers.get('link') || '';
  return { body, link };
}

async function main() {
  let start = 0;
  const step = 100;
  let all = [];
  while (true) {
    const end = start + step - 1;
    console.log('Fetching range', `${start}-${end}`);
    const { body, link } = await fetchRange(start, end);
    if (Array.isArray(body.data)) all = all.concat(body.data);
    if (!body.has_more) break;
    // try to respect 'link' header instructions; here we just increment
    start += step;
  }

  console.log('Total chunks:', all.length);
  const combined = { data: all };
  writeFileSync('dataset_full.json', JSON.stringify(combined));
  const joined = all.join('');
  const decoded = Buffer.from(joined, 'base64');
  writeFileSync('dataset_full.decoded', decoded);
  console.log('Wrote dataset_full.json and dataset_full.decoded');
}

main().catch((e) => { console.error(e); process.exit(1); });
