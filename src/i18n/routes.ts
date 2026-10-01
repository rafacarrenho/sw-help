export const locales = ['en', 'pt-BR'] as const;
export type Locale = (typeof locales)[number];

export interface LocaleMetadata {
  label: string;
  flag: string;
  abbreviation: string;
}

export const localeMetadata: Record<Locale, LocaleMetadata> = {
  en: {
    label: 'English',
    flag: '🇺🇸',
    abbreviation: 'EN',
  },
  'pt-BR': {
    label: 'Português',
    flag: '🇧🇷',
    abbreviation: 'PT',
  },
};

export const localeOptions = locales.map((locale) => ({
  locale,
  ...localeMetadata[locale],
}));

export type RouteName =
  | 'home'
  | 'siegeCounter'
  | 'siege'
  | 'monsters'
  | 'monster'
  | 'monsterPage'
  | 'speedComparison'
  | 'speedTuning'
  | 'speedTick';

export type RouteParams = {
  id?: string;
  page?: number | string;
};

const routeTemplates: Record<Locale, Record<RouteName, string>> = {
  en: {
    home: '/',
    siegeCounter: '/siege-counter',
    siege: '/siege-counter/:id',
    monsters: '/monsters',
    monster: '/monsters/:id',
    monsterPage: '/monsters/page/:page',
    speedComparison: '/speed-comparison',
    speedTuning: '/speed-tuning',
    speedTick: '/speed-tick',
  },
  'pt-BR': {
    home: '/pt',
    siegeCounter: '/pt/siege-counter',
    siege: '/pt/siege-counter/:id',
    monsters: '/pt/monstros',
    monster: '/pt/monstros/:id',
    monsterPage: '/pt/monstros/pagina/:page',
    speedComparison: '/pt/comparador-spd',
    speedTuning: '/pt/spd-tuning',
    speedTick: '/pt/spd-tick',
  },
};

export function isLocale(value: unknown): value is Locale {
  return locales.includes(value as Locale);
}

export function localePath(locale: Locale): string {
  return locale === 'en' ? '' : '/pt';
}

export function routePath(
  route: RouteName,
  locale: Locale,
  params: RouteParams = {},
): string {
  return routeTemplates[locale][route].replace(/:([a-z]+)/gi, (_, key) => {
    const value = params[key as keyof RouteParams];
    if (value === undefined || value === null || value === '') {
      throw new Error(`Missing ${key} for route ${route}.`);
    }
    return encodeURIComponent(String(value));
  });
}

export function localizedHref(
  route: RouteName,
  locale: Locale,
  params: RouteParams = {},
  search = '',
): string {
  return `${routePath(route, locale, params)}${search}`;
}
