export const locales = ['en', 'pt-BR', 'es', 'fr', 'de'] as const;
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
  es: {
    label: 'Español',
    flag: '🇪🇸',
    abbreviation: 'ES',
  },
  fr: {
    label: 'Français',
    flag: '🇫🇷',
    abbreviation: 'FR',
  },
  de: {
    label: 'Deutsch',
    flag: '🇩🇪',
    abbreviation: 'DE',
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
  es: {
    portalHome: '/es',
    about: '/es/acerca-de',
    contact: '/es/contacto',
    privacy: '/es/privacidad',
    terms: '/es/terminos',
    home: '/es/summoners-war',
    siegeCounter: '/es/summoners-war/siege-counter',
    siege: '/es/summoners-war/siege-counter/:id',
    monsters: '/es/summoners-war/monstruos',
    monster: '/es/summoners-war/monstruos/:id',
    monsterPage: '/es/summoners-war/monstruos/pagina/:page',
    speedComparison: '/es/summoners-war/comparador-spd',
    speedTuning: '/es/summoners-war/spd-tuning',
    speedTick: '/es/summoners-war/spd-tick',
  },
  fr: {
    portalHome: '/fr',
    about: '/fr/a-propos',
    contact: '/fr/contact',
    privacy: '/fr/confidentialite',
    terms: '/fr/conditions-utilisation',
    home: '/fr/summoners-war',
    siegeCounter: '/fr/summoners-war/siege-counter',
    siege: '/fr/summoners-war/siege-counter/:id',
    monsters: '/fr/summoners-war/monstres',
    monster: '/fr/summoners-war/monstres/:id',
    monsterPage: '/fr/summoners-war/monstres/page/:page',
    speedComparison: '/fr/summoners-war/comparateur-spd',
    speedTuning: '/fr/summoners-war/spd-tuning',
    speedTick: '/fr/summoners-war/spd-tick',
  },
  de: {
    portalHome: '/de',
    about: '/de/ueber-uns',
    contact: '/de/kontakt',
    privacy: '/de/datenschutz',
    terms: '/de/nutzungsbedingungen',
    home: '/de/summoners-war',
    siegeCounter: '/de/summoners-war/siege-counter',
    siege: '/de/summoners-war/siege-counter/:id',
    monsters: '/de/summoners-war/monster',
    monster: '/de/summoners-war/monster/:id',
    monsterPage: '/de/summoners-war/monster/seite/:page',
    speedComparison: '/de/summoners-war/spd-vergleich',
    speedTuning: '/de/summoners-war/spd-tuning',
    speedTick: '/de/summoners-war/spd-tick',
  },
};

export function isLocale(value: unknown): value is Locale {
  return locales.includes(value as Locale);
}

export function localePath(locale: Locale): string {
  const paths: Record<Locale, string> = {
    en: '',
    'pt-BR': '/pt',
    es: '/es',
    fr: '/fr',
    de: '/de',
  };
  return paths[locale];
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
