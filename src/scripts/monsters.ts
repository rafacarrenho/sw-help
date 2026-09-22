import type { MonsterSummary } from '../lib/monster-catalog';
import {
  PAGE_SIZE,
  catalogPageUrl,
  readMonsterFilters,
  filterMonsters,
  elementLabels,
  formLabel,
  leaderText,
} from '../lib/monster-catalog';

const root = document.querySelector<HTMLElement>('[data-monster-catalog]')!;
const form = root.querySelector<HTMLFormElement>('[data-monster-filters]')!;
const grid = root.querySelector<HTMLElement>('[data-monster-grid]')!;
const count = root.querySelector<HTMLElement>('[data-monster-count]')!;
const empty = root.querySelector<HTMLElement>('[data-monster-empty]')!;
const error = root.querySelector<HTMLElement>('[data-monster-error]')!;
const pagination = root.querySelector<HTMLElement>(
  '[data-monster-pagination]',
)!;
const prev = root.querySelector<HTMLAnchorElement>('[data-page-prev]')!;
const next = root.querySelector<HTMLAnchorElement>('[data-page-next]')!;
const template = grid
  .querySelector<HTMLElement>('[data-monster-card]')!
  .cloneNode(true) as HTMLElement;
let indexPromise: Promise<MonsterSummary[]> | undefined;
let version = 0;
let currentPage = Number(root.dataset.page);
let debounce: ReturnType<typeof setTimeout>;

type MonsterCatalogWindow = Window & {
  __MONSTER_INDEX__?: MonsterSummary[];
};

function loadIndex() {
  const embedded = (window as MonsterCatalogWindow).__MONSTER_INDEX__;
  if (embedded) {
    return Promise.resolve(embedded);
  }
  return (indexPromise ??= fetch('/monstros/index.json')
    .then((response) => {
      if (!response.ok) throw new Error('Índice indisponível');
      return response.json() as Promise<MonsterSummary[]>;
    })
    .catch((error) => {
      indexPromise = undefined;
      throw error;
    }));
}
function parameters() {
  const params = new URLSearchParams();
  const filters = readMonsterFilters(
    new URLSearchParams(
      Array.from(new FormData(form), ([key, value]) => [key, String(value)]),
    ),
  );
  for (const [key, value] of Object.entries(filters))
    if (
      value &&
      key !== 'availability' &&
      !(key === 'sort' && value === 'name')
    )
      params.set(key, value);
  return params;
}
function pageHref(page: number, params: URLSearchParams) {
  const query = params.toString();
  // Filtered result pages use the index route: every URL exists on a static host.
  if (query) {
    const filtered = new URLSearchParams(params);
    if (page > 1) filtered.set('page', String(page));
    return `/monstros/?${filtered}`;
  }
  return catalogPageUrl(page);
}
function setDetailLinks() {
  const params = parameters();
  if (currentPage > 1) params.set('page', String(currentPage));
  for (const link of grid.querySelectorAll<HTMLAnchorElement>(
    '[data-monster-card]',
  ))
    link.search = params.toString();
}
function renderCard(monster: MonsterSummary) {
  const card = template.cloneNode(true) as HTMLAnchorElement;
  card.href = `/monstros/${monster.id}/`;
  card.setAttribute('aria-label', `Ver ${monster.name}, ${formLabel(monster)}`);
  card.querySelector('.monster')!.className =
    `monster monster--${monster.element}`;
  card.querySelector('.monster-name')!.textContent = monster.name;
  card.querySelector('.monster-fallback')!.textContent = monster.name.slice(
    0,
    2,
  );
  const img = card.querySelector<HTMLImageElement>('img')!;
  img.hidden = !monster.image;
  if (monster.image) img.src = monster.image;
  img.addEventListener('error', () => {
    img.hidden = true;
  });
  const marker = card.querySelector<HTMLElement>('.element-marker')!;
  marker.title = elementLabels[monster.element];
  marker.setAttribute(
    'aria-label',
    `Elemento: ${elementLabels[monster.element]}`,
  );
  marker.replaceChildren(
    root
      .querySelector<HTMLTemplateElement>(
        `[data-element-icon="${monster.element}"]`,
      )!
      .content.cloneNode(true),
  );
  card.querySelector('[data-family]')!.textContent = monster.family ?? '';
  const formTag = card.querySelector<HTMLElement>('[data-form]');
  if (monster.awakenLevel === 2) {
    if (!formTag) {
      const tag = document.createElement('span');
      tag.className = 'form-tag';
      tag.setAttribute('data-form', 'true');
      const top = card.querySelector<HTMLElement>('.bestiary-card-top');
      if (top) top.appendChild(tag);
      tag.textContent = formLabel(monster);
    } else {
      formTag.textContent = formLabel(monster);
    }
  } else if (formTag) {
    formTag.remove();
  }
  const stars = card.querySelector<HTMLElement>('[data-stars]')!;
  stars.className = 'natural-stars';
  if (monster.awakenLevel === 1) stars.classList.add('natural-stars--awakened');
  if (monster.awakenLevel === 2)
    stars.classList.add('natural-stars--second-awaken');
  stars.textContent = '★'.repeat(monster.naturalStars);
  stars.setAttribute('aria-label', `${monster.naturalStars} estrelas naturais`);
  card.querySelector('[data-leader]')!.textContent = leaderText(
    monster.leaderSkill,
  );
  return card;
}
async function update(
  page = 1,
  historyMode: 'push' | 'replace' | 'none' = 'replace',
  focus = false,
) {
  const revision = ++version;
  const params = parameters();
  error.hidden = true;
  grid.setAttribute('aria-busy', 'true');
  count.textContent = 'Buscando monstros…';
  try {
    const monsters = await loadIndex();
    if (revision !== version) return;
    const matches = filterMonsters(monsters, readMonsterFilters(params));
    const pages = Math.max(1, Math.ceil(matches.length / PAGE_SIZE));
    currentPage = Math.min(Math.max(1, Math.trunc(page) || 1), pages);
    grid.replaceChildren(
      ...matches
        .slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
        .map(renderCard),
    );
    empty.hidden = matches.length > 0;
    pagination.hidden = matches.length === 0;
    count.textContent = `${matches.length.toLocaleString('pt-BR')} resultados · página ${currentPage} de ${pages}`;
    root.querySelector('[data-page-label]')!.textContent =
      `Página ${currentPage} de ${pages}`;
    prev.hidden = currentPage === 1;
    next.hidden = currentPage === pages;
    prev.href = pageHref(currentPage - 1, params);
    next.href = pageHref(currentPage + 1, params);
    if (historyMode !== 'none')
      history[historyMode === 'push' ? 'pushState' : 'replaceState'](
        null,
        '',
        pageHref(currentPage, params),
      );
    setDetailLinks();
    if (focus) {
      count.focus({ preventScroll: true });
      count.scrollIntoView({ block: 'start' });
    }
  } catch {
    if (revision !== version) return;
    error.hidden = false;
    count.textContent = 'Busca indisponível. Você pode tentar novamente.';
  } finally {
    if (revision === version) grid.removeAttribute('aria-busy');
  }
}
function restore() {
  clearTimeout(debounce);
  const params = new URLSearchParams(location.search);
  const filters = readMonsterFilters(params);
  for (const [key, value] of Object.entries(filters)) {
    const field = form.elements.namedItem(key);
    if (
      field instanceof HTMLInputElement ||
      field instanceof HTMLSelectElement
    ) {
      field.value = value;
    }
  }
  const page = Number(
    params.get('page') ??
      location.pathname.match(/\/pagina\/(\d+)\//)?.[1] ??
      1,
  );
  void update(page, 'none');
}
form.addEventListener('submit', (event) => {
  event.preventDefault();
  clearTimeout(debounce);
  void update();
});
form.addEventListener('input', (event) => {
  clearTimeout(debounce);
  if ((event.target as HTMLElement).tagName === 'INPUT')
    debounce = setTimeout(() => void update(), 150);
});
form.addEventListener('change', (event) => {
  if ((event.target as HTMLElement).tagName === 'SELECT') {
    clearTimeout(debounce);
    void update();
  }
});
root.querySelectorAll('[data-reset-monsters]').forEach((button) =>
  button.addEventListener('click', () => {
    clearTimeout(debounce);
    form.reset();
    void update();
    form.querySelector('input')!.focus();
  }),
);
root
  .querySelector('[data-retry-monsters]')!
  .addEventListener('click', () => void update());
for (const [link, delta] of [
  [prev, -1],
  [next, 1],
] as const)
  link.addEventListener('click', (event) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
      return;
    event.preventDefault();
    clearTimeout(debounce);
    void update(currentPage + delta, 'push', true);
  });
window.addEventListener('popstate', restore);
if (location.search) restore();
else setDetailLinks();
