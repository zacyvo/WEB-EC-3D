/**
 * One-time script: fetch Vietnam administrative data (post-merger 34 provinces)
 * from tailieu365.com and save as a static JSON file.
 *
 * Endpoints:
 *   GET https://tailieu365.com/api/address/province?mode=2
 *   GET https://tailieu365.com/api/address/ward?provinceId={id}
 *
 * Usage: node scripts/fetch-vn-locations.mjs
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_SRC   = join(__dirname, '../src/data/vn-locations.json');
const OUT_PUB   = join(__dirname, '../public/data/vn-locations.json');
const BASE = 'https://tailieu365.com/api/address';

async function get(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

async function fetchAll() {
  console.log('Fetching provinces...');
  const provList = await get(`${BASE}/province?mode=2`);
  console.log(`  → ${provList.length} provinces`);

  const result = [];

  for (const prov of provList) {
    process.stdout.write(`  [${prov.name}] fetching wards...`);
    const wardList = await get(`${BASE}/ward?provinceId=${prov.id}`);
    const wards = wardList.map((w) => ({ id: String(w.id), name: w.name }));
    console.log(` ${wards.length} phường/xã`);
    result.push({ id: String(prov.id), name: prov.name, wards });
  }

  return result;
}

const provinces = await fetchAll();
const payload = JSON.stringify({ provinces });

mkdirSync(join(__dirname, '../src/data'),    { recursive: true });
mkdirSync(join(__dirname, '../public/data'), { recursive: true });

writeFileSync(OUT_SRC, JSON.stringify({ provinces }, null, 2), 'utf-8');
writeFileSync(OUT_PUB, payload, 'utf-8');

console.log(`\nSaved (pretty) → ${OUT_SRC}`);
console.log(`Saved (minified) → ${OUT_PUB}`);
console.log(`Total provinces: ${provinces.length}`);
