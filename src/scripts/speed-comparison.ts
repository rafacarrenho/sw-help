import { matchesSearch } from '../lib/search.ts';
import {
  CHILLING_SPEED_PER_BUFF,
  compareStructuralSpeed,
  DEFAULT_CHILLING_INITIAL_BUFFS,
  getSpeedComparisonLeaderPercentages,
  readSpeedComparisonQueryState,
  SPEED_COMPARISON_CHILLING_ID,
  structuralSpeed,
  writeSpeedComparisonQueryState,
  type SpeedComparisonSideState,
  type SpeedComparisonState,
} from '../lib/speed-comparison.ts';
import type { Element, Monster } from '../lib/types.ts';
import type { Locale } from '../i18n/routes.ts';

type MonsterOption = {
  id: string;
  name: string;
  unawakenedName: string | null;
  aliases: string[];
  element: Element;
  elementLabel: string;
  speed: number;
  image: string | null;
};

type Side = 'ally' | 'enemy';

type SideState = {
  monster: MonsterOption | null;
  leaderPercent: number;
  towerPercent: number;
  usesSwift: boolean;
  initialBuffs: number;
};

type SideElements = {
  root: HTMLElement;
  search: HTMLInputElement;
  options: HTMLElement;
  portrait: HTMLElement;
  placeholder: HTMLElement;
  fallback: HTMLElement;
  image: HTMLImageElement;
  name: HTMLElement;
  element: HTMLElement;
  base: HTMLElement;
  leader: HTMLSelectElement;
  initialBuffs: HTMLElement;
  initialBuffsSelect: HTMLSelectElement;
  tower: HTMLSelectElement;
  swift: HTMLInputElement;
  speed: HTMLElement;
  cardResult: HTMLElement;
  comparisonStatus: HTMLElement;
};

const root = document.querySelector<HTMLElement>('[data-speed-comparison]');
const dataNode = document.getElementById('speed-comparison-data');

if (root && dataNode) {
  const data = JSON.parse(dataNode.textContent ?? '{}') as {
    locale?: Locale;
    messages?: Record<string, string>;
    monsters?: MonsterOption[];
    leaders?: Array<Pick<Monster, 'leaderSkill'>>;
  };
  const locale = data.locale ?? 'en';
  const messages = data.messages ?? {};
  const message = (key: string, fallback = '') => messages[key] ?? fallback;
  const interpolate = (
    template: string,
    values: Record<string, string | number>,
  ) =>
    Object.entries(values).reduce(
      (result, [key, value]) => result.replaceAll(`{${key}}`, String(value)),
      template,
    );
  const sortedMonsters = [...(data.monsters ?? [])].sort((first, second) =>
    first.name.localeCompare(second.name, locale, { sensitivity: 'base' }),
  );
  const leaderSources = data.leaders ?? [];
  const monsterById = new Map(
    sortedMonsters.map((monster) => [monster.id, monster]),
  );
  const sideNames: Side[] = ['ally', 'enemy'];
  const result = root.querySelector<HTMLElement>('[data-comparison-result]')!;
  const resultTitle = root.querySelector<HTMLElement>(
    '[data-comparison-result-title]',
  )!;
  const resultCopy = root.querySelector<HTMLElement>(
    '[data-comparison-result-copy]',
  )!;
  const tieCopy = root.querySelector<HTMLElement>(
    '[data-comparison-tie-copy]',
  )!;

  const states: Record<Side, SideState> = {
    ally: {
      monster: null,
      leaderPercent: 0,
      towerPercent: 15,
      usesSwift: true,
      initialBuffs: 0,
    },
    enemy: {
      monster: null,
      leaderPercent: 0,
      towerPercent: 15,
      usesSwift: true,
      initialBuffs: 0,
    },
  };

  const query = <T extends globalThis.Element>(
    parent: ParentNode,
    selector: string,
  ) => parent.querySelector<T>(selector);

  const elements = Object.fromEntries(
    sideNames.map((side) => {
      const sideRoot = root.querySelector<HTMLElement>(
        `[data-comparison-side="${side}"]`,
      )!;
      const value: SideElements = {
        root: sideRoot,
        search: query<HTMLInputElement>(sideRoot, '[data-comparison-search]')!,
        options: query<HTMLElement>(sideRoot, '[data-comparison-options]')!,
        portrait: query<HTMLElement>(sideRoot, '[data-comparison-portrait]')!,
        placeholder: query<HTMLElement>(
          sideRoot,
          '[data-comparison-placeholder]',
        )!,
        fallback: query<HTMLElement>(sideRoot, '[data-comparison-fallback]')!,
        image: query<HTMLImageElement>(sideRoot, '[data-comparison-image]')!,
        name: query<HTMLElement>(sideRoot, '[data-comparison-name]')!,
        element: query<HTMLElement>(sideRoot, '[data-comparison-element]')!,
        base: query<HTMLElement>(sideRoot, '[data-comparison-base]')!,
        leader: query<HTMLSelectElement>(sideRoot, '[data-comparison-leader]')!,
        initialBuffs: query<HTMLElement>(
          sideRoot,
          '[data-comparison-initial-buffs]',
        )!,
        initialBuffsSelect: query<HTMLSelectElement>(
          sideRoot,
          '[data-comparison-initial-buffs-select]',
        )!,
        tower: query<HTMLSelectElement>(sideRoot, '[data-comparison-tower]')!,
        swift: query<HTMLInputElement>(sideRoot, '[data-comparison-swift]')!,
        speed: query<HTMLElement>(sideRoot, '[data-comparison-speed]')!,
        cardResult: query<HTMLElement>(
          sideRoot,
          '.speed-comparison-card-result',
        )!,
        comparisonStatus: query<HTMLElement>(
          sideRoot,
          '[data-comparison-status]',
        )!,
      };
      return [side, value];
    }),
  ) as Record<Side, SideElements>;

  const leaderOptions = (state: SideState) =>
    state.monster ? getSpeedComparisonLeaderPercentages(leaderSources) : [0];

  const passiveSpeedBonus = (state: SideState) =>
    state.monster?.id === SPEED_COMPARISON_CHILLING_ID
      ? state.initialBuffs * CHILLING_SPEED_PER_BUFF
      : 0;

  const publicState = (): SpeedComparisonState => ({
    ally: {
      monsterId: states.ally.monster?.id ?? null,
      leaderPercent: states.ally.leaderPercent,
      towerPercent: states.ally.towerPercent,
      usesSwift: states.ally.usesSwift,
      initialBuffs: states.ally.initialBuffs,
    },
    enemy: {
      monsterId: states.enemy.monster?.id ?? null,
      leaderPercent: states.enemy.leaderPercent,
      towerPercent: states.enemy.towerPercent,
      usesSwift: states.enemy.usesSwift,
      initialBuffs: states.enemy.initialBuffs,
    },
  });

  const syncUrl = () => {
    const params = writeSpeedComparisonQueryState(
      new URLSearchParams(window.location.search),
      publicState(),
    );
    const search = params.toString();
    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}${search ? `?${search}` : ''}${window.location.hash}`,
    );
  };

  const closeOptions = (side: Side) => {
    const sideElements = elements[side];
    sideElements.options.hidden = true;
    sideElements.search.setAttribute('aria-expanded', 'false');
    sideElements.search.removeAttribute('aria-activedescendant');
  };

  const closeAllOptions = (except?: Side) => {
    sideNames.forEach((side) => {
      if (side !== except) closeOptions(side);
    });
  };

  const createOptionPortrait = (monster: MonsterOption) => {
    const portrait = document.createElement('span');
    portrait.className = 'speed-comparison-option-portrait';
    portrait.setAttribute('aria-hidden', 'true');
    const fallback = document.createElement('span');
    fallback.textContent = monster.name.slice(0, 2);
    portrait.append(fallback);

    if (monster.image) {
      const image = document.createElement('img');
      image.src = monster.image;
      image.alt = '';
      image.width = 40;
      image.height = 40;
      image.loading = 'lazy';
      fallback.hidden = true;
      image.addEventListener('error', () => {
        image.hidden = true;
        fallback.hidden = false;
      });
      portrait.append(image);
    }

    return portrait;
  };

  const renderOptions = (side: Side) => {
    const sideElements = elements[side];
    const searchValue = sideElements.search.value.trim();
    const visible = (
      searchValue
        ? sortedMonsters.filter((monster) =>
            matchesSearch(
              [
                monster.name,
                monster.unawakenedName,
                ...monster.aliases,
                monster.elementLabel,
              ]
                .filter(Boolean)
                .join(' '),
              searchValue,
            ),
          )
        : sortedMonsters
    ).slice(0, 50);

    sideElements.options.replaceChildren();
    if (visible.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'speed-comparison-options-empty';
      empty.textContent = message('noMonsterFound', 'No monster found');
      sideElements.options.append(empty);
    } else {
      const fragment = document.createDocumentFragment();
      visible.forEach((monster, optionIndex) => {
        const option = document.createElement('div');
        option.id = `speed-comparison-option-${side}-${monster.id}`;
        option.className = 'speed-comparison-option';
        option.setAttribute('role', 'option');
        option.setAttribute('aria-selected', 'false');
        option.dataset.optionIndex = String(optionIndex);
        option.dataset.monsterId = monster.id;

        const copy = document.createElement('span');
        copy.className = 'speed-comparison-option-copy';
        const name = document.createElement('strong');
        name.textContent = monster.name;
        const detail = document.createElement('small');
        detail.textContent = monster.unawakenedName
          ? `${monster.unawakenedName} · ${monster.elementLabel} · ${monster.speed} SPD`
          : `${monster.elementLabel} · ${monster.speed} SPD`;
        copy.append(name, detail);
        option.append(createOptionPortrait(monster), copy);
        option.addEventListener('pointerdown', (event) =>
          event.preventDefault(),
        );
        option.addEventListener('click', () => selectMonster(side, monster));
        fragment.append(option);
      });
      sideElements.options.append(fragment);
    }

    sideElements.options.hidden = false;
    sideElements.search.setAttribute('aria-expanded', 'true');
  };

  const setActiveOption = (side: Side, direction: 1 | -1) => {
    const sideElements = elements[side];
    const options = Array.from(
      sideElements.options.querySelectorAll<HTMLElement>('[role="option"]'),
    );
    if (options.length === 0) return;
    const currentIndex = options.findIndex(
      (option) => option.getAttribute('aria-selected') === 'true',
    );
    const nextIndex =
      currentIndex < 0
        ? direction === 1
          ? 0
          : options.length - 1
        : (currentIndex + direction + options.length) % options.length;

    options.forEach((option, index) =>
      option.setAttribute('aria-selected', String(index === nextIndex)),
    );
    const activeOption = options[nextIndex];
    if (!activeOption) return;
    sideElements.search.setAttribute('aria-activedescendant', activeOption.id);
    activeOption.scrollIntoView({ block: 'nearest' });
  };

  const setLeaderOptions = (side: Side) => {
    const state = states[side];
    const select = elements[side].leader;
    const percentages = leaderOptions(state);
    if (!percentages.includes(state.leaderPercent)) state.leaderPercent = 0;
    select.replaceChildren(
      ...percentages.map((percent) => {
        const option = document.createElement('option');
        option.value = String(percent);
        option.textContent =
          percent === 0 ? message('noLeader', 'No leader') : `${percent}%`;
        return option;
      }),
    );
    select.value = String(state.leaderPercent);
    select.disabled = !state.monster;
  };

  const renderPortrait = (side: Side) => {
    const state = states[side];
    const sideElements = elements[side];
    const monster = state.monster;
    sideElements.portrait.classList.toggle('is-empty', !monster);
    sideElements.placeholder.hidden = Boolean(monster);
    sideElements.fallback.hidden = !monster;
    sideElements.image.hidden = true;
    sideElements.image.removeAttribute('src');

    if (!monster) {
      sideElements.name.textContent = message('noMonster', 'No monster');
      sideElements.element.textContent = message(
        'selectAbove',
        'Select one above',
      );
      sideElements.base.textContent = '—';
      return;
    }

    sideElements.name.textContent = monster.name;
    sideElements.element.textContent = monster.elementLabel;
    sideElements.base.textContent = String(monster.speed);
    sideElements.fallback.textContent = monster.name.slice(0, 2);
    if (monster.image) {
      sideElements.image.src = monster.image;
      sideElements.image.hidden = false;
      sideElements.fallback.hidden = true;
      sideElements.image.onerror = () => {
        sideElements.image.hidden = true;
        sideElements.fallback.hidden = false;
      };
    }
  };

  const renderSide = (side: Side) => {
    const state = states[side];
    const sideElements = elements[side];
    renderPortrait(side);
    setLeaderOptions(side);
    sideElements.tower.value = String(state.towerPercent);
    sideElements.swift.checked = state.usesSwift;
    sideElements.swift.disabled = !state.monster;
    const usesChillingPassive =
      state.monster?.id === SPEED_COMPARISON_CHILLING_ID;
    sideElements.initialBuffs.hidden = !usesChillingPassive;
    sideElements.initialBuffsSelect.value = String(state.initialBuffs);

    const speed = state.monster
      ? structuralSpeed({
          baseSpeed: state.monster.speed,
          leaderPercent: state.leaderPercent,
          towerPercent: state.towerPercent,
          usesSwift: state.usesSwift,
          passiveSpeedBonus: passiveSpeedBonus(state),
        })
      : null;
    sideElements.speed.textContent = speed === null ? '—' : `${speed} SPD`;
    sideElements.cardResult.classList.toggle('is-empty', speed === null);
    sideElements.cardResult.classList.remove(
      'is-advantage',
      'is-disadvantage',
      'is-tie',
    );
    sideElements.comparisonStatus.hidden = true;
    sideElements.comparisonStatus.textContent = '';
  };

  const setComparisonStatus = (
    side: Side,
    status: 'advantage' | 'disadvantage' | 'tie',
  ) => {
    const sideElements = elements[side];
    sideElements.cardResult.classList.add(`is-${status}`);
    sideElements.comparisonStatus.textContent =
      status === 'advantage'
        ? message('advantage', 'ADVANTAGE')
        : status === 'disadvantage'
          ? message('disadvantage', 'DISADVANTAGE')
          : message('tie', 'TIE');
    sideElements.comparisonStatus.hidden = false;
  };

  const renderResult = () => {
    const ally = states.ally;
    const enemy = states.enemy;
    if (!ally.monster || !enemy.monster) {
      result.classList.add('is-empty');
      result.classList.remove('is-ally', 'is-enemy', 'is-tie');
      resultTitle.textContent = message('selectBoth', 'Select both monsters');
      resultCopy.textContent = message(
        'resultWaiting',
        'The comparison will appear when both sides are configured.',
      );
      tieCopy.hidden = true;
      tieCopy.textContent = '';
      return;
    }

    const comparison = compareStructuralSpeed(
      {
        baseSpeed: ally.monster.speed,
        leaderPercent: ally.leaderPercent,
        towerPercent: ally.towerPercent,
        usesSwift: ally.usesSwift,
        passiveSpeedBonus: passiveSpeedBonus(ally),
      },
      {
        baseSpeed: enemy.monster.speed,
        leaderPercent: enemy.leaderPercent,
        towerPercent: enemy.towerPercent,
        usesSwift: enemy.usesSwift,
        passiveSpeedBonus: passiveSpeedBonus(enemy),
      },
    );
    if (!comparison) return;

    result.classList.remove('is-empty', 'is-ally', 'is-enemy', 'is-tie');
    if (comparison.winner === 'tie') {
      setComparisonStatus('ally', 'tie');
      setComparisonStatus('enemy', 'tie');
      result.classList.add('is-tie');
      resultTitle.textContent = message('structuralTie', 'Structural tie');
      resultCopy.textContent = interpolate(
        message(
          'tieResult',
          '{ally} and {enemy} both reach {speed} structural SPD.',
        ),
        {
          ally: ally.monster.name,
          enemy: enemy.monster.name,
          speed: comparison.allySpeed,
        },
      );
      tieCopy.hidden = false;
      tieCopy.textContent = message(
        'tieDecision',
        'A single point of additional rune SPD can decide who moves first.',
      );
      return;
    }

    const winner = comparison.winner === 'ally' ? ally : enemy;
    const loser = comparison.winner === 'ally' ? enemy : ally;
    setComparisonStatus(comparison.winner, 'advantage');
    setComparisonStatus(
      comparison.winner === 'ally' ? 'enemy' : 'ally',
      'disadvantage',
    );
    const winnerName = winner.monster!.name;
    const loserName = loser.monster!.name;
    result.classList.add(comparison.winner === 'ally' ? 'is-ally' : 'is-enemy');
    resultTitle.textContent = interpolate(
      message('advantageTitle', '{winner} has a {advantage} SPD advantage'),
      { winner: winnerName, advantage: comparison.advantage },
    );
    resultCopy.textContent =
      comparison.strictRuneTolerance === 0
        ? interpolate(
            message(
              'sameRuneSpeed',
              '{winner} can have the same additional rune SPD and still move before {loser}.',
            ),
            { winner: winnerName, loser: loserName },
          )
        : interpolate(
            message(
              'runeTolerance',
              '{winner} can have up to {tolerance} less additional rune SPD and still move before {loser}.',
            ),
            {
              winner: winnerName,
              loser: loserName,
              tolerance: comparison.strictRuneTolerance,
            },
          );
    tieCopy.hidden = false;
    tieCopy.textContent = interpolate(
      message(
        'combatTie',
        'With {advantage} less additional SPD, both monsters tie in combat SPD.',
      ),
      { advantage: comparison.advantage },
    );
  };

  const render = (updateUrl = true) => {
    sideNames.forEach(renderSide);
    renderResult();
    if (updateUrl) syncUrl();
  };

  const selectMonster = (side: Side, monster: MonsterOption) => {
    const state = states[side];
    state.monster = monster;
    state.leaderPercent = 0;
    state.usesSwift = true;
    state.initialBuffs =
      monster.id === SPEED_COMPARISON_CHILLING_ID
        ? DEFAULT_CHILLING_INITIAL_BUFFS
        : 0;
    elements[side].search.value = monster.name;
    closeOptions(side);
    elements[side].search.blur();
    render();
  };

  const clearMonster = (side: Side) => {
    const state = states[side];
    state.monster = null;
    state.leaderPercent = 0;
    state.usesSwift = true;
    state.initialBuffs = 0;
  };

  const applyQueryState = (queryState: SpeedComparisonState) => {
    sideNames.forEach((side) => {
      const next = queryState[side] as SpeedComparisonSideState;
      states[side].monster = next.monsterId
        ? (monsterById.get(next.monsterId) ?? null)
        : null;
      states[side].leaderPercent = next.leaderPercent;
      states[side].towerPercent = next.towerPercent;
      states[side].usesSwift = next.usesSwift;
      states[side].initialBuffs = next.initialBuffs;
      elements[side].search.value = states[side].monster?.name ?? '';
      closeOptions(side);
    });
  };

  sideNames.forEach((side) => {
    const state = states[side];
    const sideElements = elements[side];

    sideElements.search.addEventListener('focus', () => {
      closeAllOptions(side);
      renderOptions(side);
    });
    sideElements.search.addEventListener('input', () => {
      if (
        state.monster &&
        sideElements.search.value.trim() !== state.monster.name
      ) {
        clearMonster(side);
        render();
      }
      renderOptions(side);
    });
    sideElements.search.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        if (sideElements.options.hidden) renderOptions(side);
        setActiveOption(side, event.key === 'ArrowDown' ? 1 : -1);
        return;
      }
      if (event.key === 'Enter') {
        const active = sideElements.options.querySelector<HTMLElement>(
          '[role="option"][aria-selected="true"]',
        );
        const monster = active?.dataset.monsterId
          ? monsterById.get(active.dataset.monsterId)
          : undefined;
        if (monster) {
          event.preventDefault();
          selectMonster(side, monster);
        }
        return;
      }
      if (event.key === 'Escape') {
        closeOptions(side);
        sideElements.search.select();
      }
    });
    sideElements.search.addEventListener('blur', () => {
      window.setTimeout(() => closeOptions(side), 0);
    });
    sideElements.leader.addEventListener('change', () => {
      state.leaderPercent = Number(sideElements.leader.value) || 0;
      render();
    });
    sideElements.tower.addEventListener('change', () => {
      state.towerPercent = Number(sideElements.tower.value) || 0;
      render();
    });
    sideElements.swift.addEventListener('change', () => {
      state.usesSwift = sideElements.swift.checked;
      render();
    });
    sideElements.initialBuffsSelect.addEventListener('change', () => {
      if (state.monster?.id !== SPEED_COMPARISON_CHILLING_ID) return;
      state.initialBuffs = Math.min(
        2,
        Math.max(0, Number(sideElements.initialBuffsSelect.value) || 0),
      );
      render();
    });
  });

  document.addEventListener('pointerdown', (event) => {
    const target = event.target;
    if (!(target instanceof Node)) return;
    sideNames.forEach((side) => {
      if (!elements[side].root.contains(target)) closeOptions(side);
    });
  });

  window.addEventListener('popstate', () => {
    applyQueryState(
      readSpeedComparisonQueryState(
        new URLSearchParams(window.location.search),
        monsterById,
        leaderSources,
      ),
    );
    render(false);
  });

  applyQueryState(
    readSpeedComparisonQueryState(
      new URLSearchParams(window.location.search),
      monsterById,
      leaderSources,
    ),
  );
  render();
}
