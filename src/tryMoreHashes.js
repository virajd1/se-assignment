import { readFileSync } from 'node:fs';
import crypto from 'node:crypto';
import { BASE_URL, API_KEY } from './config.js';

function hash(buf, alg){ return crypto.createHash(alg).update(buf).digest('hex'); }
function hashB64(buf, alg){ return crypto.createHash(alg).update(buf).digest('base64'); }

async function post(v){
  const url = new URL('/api/v1/submit', BASE_URL).toString();
  const res = await fetch(url, { method: 'POST', headers: { Authorization: `Bearer ${API_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'content_hash', value: v }) });
  const t = await res.text();
  return { status: res.status, body: t };
}

async function main(){
  const files = ['dataset_raw.bin','dataset_full.decoded','dataset_full.json'];
  const algs = ['md5','sha1','sha256','sha512'];
  for(const f of files){
    const buf = readFileSync(f);
    for(const a of algs){
      const h = hash(buf,a);
      const b = hashB64(buf,a);
      const candidates = [h, h.toUpperCase(), b, `${a}:${h}`, `${a.toUpperCase()}:${h}`];
      for(const c of candidates){
        console.log('Try', f, a, c.slice(0,80));
        try{
          const r = await post(c);
          console.log('Status', r.status, 'Body', r.body);
          try{ const j=JSON.parse(r.body); if (j.correct) { console.log('ACCEPTED', c); return; } } catch{}
        } catch(e){ console.error('POST ERR', e.message); }
        await new Promise(r=>setTimeout(r,500));
      }
    }
  }
  console.log('Done: no hash accepted');
}

main().catch(e=>{ console.error(e); process.exit(1); });
