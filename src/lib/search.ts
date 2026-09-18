export function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function matchesSearch(searchText: string, query: string): boolean {
  const haystack = normalize(searchText);
  return normalize(query)
    .split(/[\s,]+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term));
}
