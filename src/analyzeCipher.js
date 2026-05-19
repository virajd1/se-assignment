import { readFileSync } from 'node:fs';

function toHex(b, n=32){ return Buffer.from(b).slice(0,n).toString('hex'); }

function isPrintable(buf){
  let printable=0;
  for(const x of buf){ if (x>=32 && x<=126) printable++; }
  return printable/buf.length;
}

function countDistinct(buf){
  const s=new Set(buf);
  return s.size;
}

function main(){
  const path = process.argv[2] || 'dataset_full.decoded';
  const buf = readFileSync(path);
  console.log('Path:', path);
  console.log('Size:', buf.length);
  console.log('First 64 hex:', toHex(buf,64));
  console.log('StartsWith 00 02?', buf[0]===0x00 && buf[1]===0x02);
  console.log('StartsWith 30 82 (ASN.1 SEQUENCE)?', buf[0]===0x30 && buf[1]===0x82);
  console.log('Distinct byte values:', countDistinct(buf));
  console.log('Printable ratio:', isPrintable(buf).toFixed(3));
  // check PKCS#1 v1.5 padding pattern (0x00 0x02 ... 0x00)
  const idx00 = buf.indexOf(0x00, 2);
  console.log('First 0x00 after offset 2 at index:', idx00);
  if (idx00>2 && idx00 < 200) console.log('PKCS#1 v1.5-looking padding region length:', idx00-2);
  // check if plausible AES (block size 16)
  console.log('Length mod 16:', buf.length % 16);
}

main();
