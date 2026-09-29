import { matchesSearch } from '../lib/search.ts';
import {
  compareStructuralSpeed,
  getSpeedComparisonLeaderPercentages,
  readSpeedComparisonQueryState,
  structuralSpeed,
  writeSpeedComparisonQueryState,
  type SpeedComparisonSideState,
  type SpeedComparisonState,
} from '../lib/speed-comparison.ts';
import type { Element, Monster } from '../lib/types.ts';

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
    monsters?: MonsterOption[];
    leaders?: Array<Pick<Monster, 'leaderSkill'>>;
  };
  const sortedMonsters = [...(data.monsters ?? [])].sort((first, second) =>
    first.name.localeCompare(second.name, 'pt-BR', { sensitivity: 'base' }),
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
    },
    enemy: {
      monster: null,
      leaderPercent: 0,
      towerPercent: 15,
      usesSwift: true,
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

  const publicState = (): SpeedComparisonState => ({
    ally: {
      monsterId: states.ally.monster?.id ?? null,
      leaderPercent: states.ally.leaderPercent,
      towerPercent: states.ally.towerPercent,
      usesSwift: states.ally.usesSwift,
    },
    enemy: {
      monsterId: states.enemy.monster?.id ?? null,
      leaderPercent: states.enemy.leaderPercent,
      towerPercent: states.enemy.towerPercent,
      usesSwift: states.enemy.usesSwift,
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
      empty.textContent = 'Nenhum monstro encontrado';
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
        option.textContent = percent === 0 ? 'Sem líder' : `${percent}%`;
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
      sideElements.name.textContent = 'Nenhum monstro';
      sideElements.element.textContent = 'Selecione no campo acima';
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

    const speed = state.monster
      ? structuralSpeed({
          baseSpeed: state.monster.speed,
          leaderPercent: state.leaderPercent,
          towerPercent: state.towerPercent,
          usesSwift: state.usesSwift,
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
        ? 'VANTAGEM'
        : status === 'disadvantage'
          ? 'DESVANTAGEM'
          : 'EMPATE';
    sideElements.comparisonStatus.hidden = false;
  };

  const renderResult = () => {
    const ally = states.ally;
    const enemy = states.enemy;
    if (!ally.monster || !enemy.monster) {
      result.classList.add('is-empty');
      result.classList.remove('is-ally', 'is-enemy', 'is-tie');
      resultTitle.textContent = 'Selecione os dois monstros';
      resultCopy.textContent =
        'A comparação aparecerá quando os dois lados estiverem configurados.';
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
      },
      {
        baseSpeed: enemy.monster.speed,
        leaderPercent: enemy.leaderPercent,
        towerPercent: enemy.towerPercent,
        usesSwift: enemy.usesSwift,
      },
    );
    if (!comparison) return;

    result.classList.remove('is-empty', 'is-ally', 'is-enemy', 'is-tie');
    if (comparison.winner === 'tie') {
      setComparisonStatus('ally', 'tie');
      setComparisonStatus('enemy', 'tie');
      result.classList.add('is-tie');
      resultTitle.textContent = 'Empate estrutural';
      resultCopy.textContent = `${ally.monster.name} e ${enemy.monster.name} chegam a ${comparison.allySpeed} SPD estrutural.`;
      tieCopy.hidden = false;
      tieCopy.textContent =
        'Um único ponto de SPD adicional das runas pode decidir quem age primeiro.';
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
    resultTitle.textContent = `${winnerName} tem vantagem de ${comparison.advantage} SPD`;
    resultCopy.textContent =
      comparison.strictRuneTolerance === 0
        ? `${winnerName} pode ter a mesma SPD adicional das runas e ainda agir antes de ${loserName}.`
        : `${winnerName} pode ter até ${comparison.strictRuneTolerance} SPD adicional a menos nas runas e ainda agir antes de ${loserName}.`;
    tieCopy.hidden = false;
    tieCopy.textContent = `Com ${comparison.advantage} SPD adicional a menos, os dois empatam em SPD de combate.`;
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
