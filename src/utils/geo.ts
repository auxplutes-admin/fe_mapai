// utils/geo.ts
export const normalize = (s?: string) =>
  (s || '')
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[–—−‐-‒﹘﹣－]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

const PROVINCE_ALIASES: Record<string, string[]> = {
  'Kongo-Central': ['Kongo Central', 'Bas-Congo', 'Bas Congo'],
  'Kasai-Central': ['Kasai Central', 'kasai-central', 'Kasaï Central', 'Kananga'],
  'Kasai-Oriental': ['Kasai Oriental', 'Kasai-Oriental', 'Mbuji-Mayi', 'Mbuji Mayi'],
  'Kasai': ['Kasai'],
};

export const buildProvinceIndex = (geo: any) => {
  const idx = new Map<string, string>(); // normalized key -> canonical province (exact from GeoJSON)
  const names = new Set<string>();

  geo?.features?.forEach((f: any) => {
    const n = f?.properties?.adm1_name ?? f?.properties?.NAME_1 ?? f?.properties?.name;
    if (n) names.add(n);
  });

  for (const n of names) idx.set(normalize(n), n); // direct names

  // alias -> canonical (prefer exact that exists in GeoJSON)
  Object.entries(PROVINCE_ALIASES).forEach(([canon, list]) => {
    const canonFromGeo = [...names].find(n => normalize(n) === normalize(canon)) ?? canon;
    list.forEach(a => idx.set(normalize(a), canonFromGeo));
  });

  return idx;
};

export type ProvinceDetection =
  | { kind: 'none' }
  | { kind: 'matched'; province: string }
  | { kind: 'ambiguous'; options: string[] };

export const detectProvinceFromText = (text: string, idx: Map<string, string>): ProvinceDetection => {
  const words = normalize(text).split(' ').filter(Boolean);
  const grams = new Set<string>();
  for (let len = 1; len <= 3; len++) {
    for (let i = 0; i + len <= words.length; i++) grams.add(words.slice(i, i + len).join(' '));
  }

  const hits: string[] = [];
  for (const g of grams) {
    const m = idx.get(g);
    if (m) hits.push(m);
  }

  const uniq = Array.from(new Set(hits));
  if (uniq.length === 1) return { kind: 'matched', province: uniq[0] };
  if (uniq.length > 1) return { kind: 'ambiguous', options: uniq.sort() };
  return { kind: 'none' };
};
