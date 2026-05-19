import { BASE_URL, API_KEY } from './config.js';

const paths = [
  '/api/v1/key', '/api/v1/keys', '/api/v1/secret', '/api/v1/secrets', '/api/v1/token',
  '/api/v1/tokens', '/api/v1/unlock', '/api/v1/claim', '/api/v1/claim-key', '/api/v1/claim/key',
  '/api/v1/auth', '/api/v1/login', '/api/v1/sessions', '/api/v1/session', '/api/v1/cert',
  '/api/v1/certs', '/api/v1/certificate', '/api/v1/certificates', '/api/v1/public', '/api/v1/private',
  '/api/v1/wrap', '/api/v1/unwrap', '/api/v1/wrapped', '/api/v1/keyring', '/api/v1/keypair',
  '/api/v1/license', '/api/v1/licenses', '/api/v1/download', '/api/v1/artifact', '/api/v1/file',
  '/api/v1/blob', '/api/v1/manifest', '/api/v1/meta', '/api/v1/metadata', '/api/v1/info', '/api/v1/about',
  '/api/v1/participant', '/api/v1/me', '/api/v1/whoami', '/api/v1/challenge/key', '/api/v1/challenge/secret'
];

async function probe(p) {
  const url = new URL(p, BASE_URL).toString();
  try {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${API_KEY}` } });
    if (res.status !== 404) {
      const text = await res.text();
      console.log('FOUND:', p, 'Status:', res.status, 'CT:', res.headers.get('content-type'));
      console.log(text.slice(0, 800));
    } else {
      console.log('OK 404:', p);
    }
  } catch (e) {
    console.log('ERR:', p, e.message);
  }
}

async function main() {
  for (const p of paths) {
    await probe(p);
    await new Promise(r => setTimeout(r, 600));
  }
}

main().catch(e=>{console.error(e); process.exit(1)});
