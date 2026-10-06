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
  | 'portalHome'
  | 'about'
  | 'contact'
  | 'privacy'
  | 'terms'
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
    portalHome: '/',
    about: '/about',
    contact: '/contact',
    privacy: '/privacy',
    terms: '/terms',
    home: '/summoners-war',
    siegeCounter: '/summoners-war/siege-counter',
    siege: '/summoners-war/siege-counter/:id',
    monsters: '/summoners-war/monsters',
    monster: '/summoners-war/monsters/:id',
    monsterPage: '/summoners-war/monsters/page/:page',
    speedComparison: '/summoners-war/speed-comparison',
    speedTuning: '/summoners-war/speed-tuning',
    speedTick: '/summoners-war/speed-tick',
  },
  'pt-BR': {
    portalHome: '/pt',
    about: '/pt/sobre',
    contact: '/pt/contato',
    privacy: '/pt/privacidade',
    terms: '/pt/termos',
    home: '/pt/summoners-war',
    siegeCounter: '/pt/summoners-war/siege-counter',
    siege: '/pt/summoners-war/siege-counter/:id',
    monsters: '/pt/summoners-war/monstros',
    monster: '/pt/summoners-war/monstros/:id',
    monsterPage: '/pt/summoners-war/monstros/pagina/:page',
    speedComparison: '/pt/summoners-war/comparador-spd',
    speedTuning: '/pt/summoners-war/spd-tuning',
    speedTick: '/pt/summoners-war/spd-tick',
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
