import { BASE_URL, API_KEY } from './config.js';
import { writeFileSync, appendFileSync, existsSync, unlinkSync } from 'node:fs';

async function fetchRangeRaw(start = 0, end = 99) {
  const url = new URL('/api/v1/dataset', BASE_URL);
  url.searchParams.set('batch', 'true');
  url.searchParams.set('range', `${start}-${end}`);
  const res = await fetch(url.toString(), { headers: { Authorization: `Bearer ${API_KEY}` } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  return { buf, has_more: JSON.parse(buf.toString('utf8')).has_more };
}

async function main() {
  const out = 'dataset_raw.bin';
  if (existsSync(out)) unlinkSync(out);
  let start = 0;
  const step = 100;
  while (true) {
    const end = start + step - 1;
    console.log('Fetching raw range', `${start}-${end}`);
    const { buf, has_more } = await fetchRangeRaw(start, end);
    appendFileSync(out, buf);
    if (!has_more) break;
    start += step;
  }
  console.log('Wrote', out);
}

main().catch((e) => { console.error(e); process.exit(1); });
