import { matchesSearch } from '../lib/search';

const form = document.querySelector<HTMLFormElement>('[data-search-form]')!;
const search = form.querySelector<HTMLInputElement>('input[type="search"]')!;
const radios = [
  ...form.querySelectorAll<HTMLInputElement>('input[name="tower"]'),
];
const cards = [
  ...document.querySelectorAll<HTMLElement>('[data-defense-card]'),
];
const result = document.querySelector<HTMLElement>('[data-result-count]')!;
const empty = document.querySelector<HTMLElement>('[data-empty-state]')!;
const detailLinks = [
  ...document.querySelectorAll<HTMLAnchorElement>('.defense-link'),
];

function applyFilters(updateUrl = true) {
  const tower = radios.find((radio) => radio.checked)?.value ?? 'all';
  let count = 0;
  cards.forEach((card) => {
    const visible =
      (tower === 'all' || card.dataset.tower === tower) &&
      matchesSearch(card.dataset.search ?? '', search.value);
    card.hidden = !visible;
    if (visible) count++;
  });
  result.textContent = `${count} ${count === 1 ? 'defesa encontrada' : 'defesas encontradas'}`;
  empty.hidden = count !== 0;
  const params = new URLSearchParams();
  if (search.value.trim()) params.set('q', search.value.trim());
  if (tower !== 'all') params.set('tower', tower);
  const suffix = params.size ? `?${params}` : '';
  if (updateUrl)
    history.replaceState(
      null,
      '',
      `${location.pathname}${suffix}${location.hash}`,
    );
  detailLinks.forEach((link) => {
    link.search = suffix;
  });
}
function restoreFilters() {
  const params = new URLSearchParams(location.search);
  search.value = (params.get('q') ?? '').slice(0, 200);
  const tower = params.get('tower');
  radios.forEach((radio) => {
    radio.checked =
      radio.value === (tower === '4star' || tower === 'open' ? tower : 'all');
  });
  applyFilters(false);
}
form.addEventListener('submit', (event) => {
  event.preventDefault();
  applyFilters();
});
search.addEventListener('input', () => applyFilters());
radios.forEach((radio) =>
  radio.addEventListener('change', () => applyFilters()),
);
document
  .querySelector('[data-clear-filters]')!
  .addEventListener('click', () => {
    form.reset();
    search.value = '';
    applyFilters();
    search.focus();
  });
window.addEventListener('popstate', restoreFilters);
window.addEventListener('pageshow', restoreFilters);
restoreFilters();
