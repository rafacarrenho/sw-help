import type { Locale } from './routes';

const copy = {
  en: {
    teamLeader: 'Team leader',
    viewCatalog: (name: string) => `View ${name} in the catalog`,
    viewDefense: 'View defense',
    counter: 'counter',
    counters: 'counters',
    searching: 'Searching monsters…',
    searchUnavailable: 'Search unavailable. You can try again.',
    contactSubject: 'PlayerDojo contact',
    publicEmail: 'Public email',
    monsterTitle: (name: string, element: string) =>
      `${name} (${element}) – Summoners War Monster`,
    monsterDescription: (name: string, element: string) =>
      `Explore ${name}, the ${element} Summoners War monster: base stats, skills, leader effect, evolution, family, and Siege teams.`,
    siegeTitle: (name: string) => `${name} Siege Counters – Summoners War`,
    siegeDescription: (name: string) =>
      `Find registered Summoners War Siege counters for the ${name} defense, including offense teams, suggested runes, stats, and turn sequence.`,
  },
  'pt-BR': {
    teamLeader: 'Líder da composição',
    viewCatalog: (name: string) => `Ver ${name} no catálogo`,
    viewDefense: 'Ver defesa',
    counter: 'counter',
    counters: 'counters',
    searching: 'Buscando monstros…',
    searchUnavailable: 'Busca indisponível. Você pode tentar novamente.',
    contactSubject: 'Contato pelo PlayerDojo',
    publicEmail: 'E-mail público',
    monsterTitle: (name: string, element: string) =>
      `${name} (${element}) – Monstro de Summoners War`,
    monsterDescription: (name: string, element: string) =>
      `Veja ${name} de ${element} no Summoners War: atributos base, habilidades, liderança, evolução, família e times de Siege.`,
    siegeTitle: (name: string) =>
      `Counters para ${name} no Siege – Summoners War`,
    siegeDescription: (name: string) =>
      `Veja counters cadastrados para a defesa ${name} no Siege de Summoners War, com composições de ofensiva, runas, atributos e sequência.`,
  },
  es: {
    teamLeader: 'Líder de la composición',
    viewCatalog: (name: string) => `Ver ${name} en el catálogo`,
    viewDefense: 'Ver defensa',
    counter: 'counter',
    counters: 'counters',
    searching: 'Buscando monstruos…',
    searchUnavailable: 'Búsqueda no disponible. Puedes intentarlo de nuevo.',
    contactSubject: 'Contacto mediante PlayerDojo',
    publicEmail: 'Correo electrónico público',
    monsterTitle: (name: string, element: string) =>
      `${name} (${element}) – Monstruo de Summoners War`,
    monsterDescription: (name: string, element: string) =>
      `Consulta a ${name} de ${element} en Summoners War: estadísticas base, habilidades, liderazgo, evolución, familia y equipos de Siege.`,
    siegeTitle: (name: string) =>
      `Counters de Siege para ${name} – Summoners War`,
    siegeDescription: (name: string) =>
      `Consulta counters registrados para la defensa ${name} en Siege, con equipos ofensivos, runas, estadísticas y secuencia.`,
  },
  fr: {
    teamLeader: 'Leader de la composition',
    viewCatalog: (name: string) => `Voir ${name} dans le catalogue`,
    viewDefense: 'Voir la défense',
    counter: 'counter',
    counters: 'counters',
    searching: 'Recherche de monstres…',
    searchUnavailable: 'Recherche indisponible. Vous pouvez réessayer.',
    contactSubject: 'Contact via PlayerDojo',
    publicEmail: 'E-mail public',
    monsterTitle: (name: string, element: string) =>
      `${name} (${element}) – Monstre Summoners War`,
    monsterDescription: (name: string, element: string) =>
      `Découvrez ${name}, monstre ${element} de Summoners War : statistiques de base, compétences, leader, évolution, famille et équipes de siège.`,
    siegeTitle: (name: string) =>
      `Counters de siège pour ${name} – Summoners War`,
    siegeDescription: (name: string) =>
      `Consultez les counters enregistrés pour la défense ${name}, avec équipes d’offense, runes, statistiques et ordre de jeu.`,
  },
  de: {
    teamLeader: 'Team-Leader',
    viewCatalog: (name: string) => `${name} im Katalog ansehen`,
    viewDefense: 'Verteidigung ansehen',
    counter: 'Counter',
    counters: 'Counter',
    searching: 'Monster werden gesucht…',
    searchUnavailable: 'Suche nicht verfügbar. Du kannst es erneut versuchen.',
    contactSubject: 'Kontakt über PlayerDojo',
    publicEmail: 'Öffentliche E-Mail-Adresse',
    monsterTitle: (name: string, element: string) =>
      `${name} (${element}) – Summoners-War-Monster`,
    monsterDescription: (name: string, element: string) =>
      `Entdecke ${name}, das ${element}-Monster in Summoners War: Basiswerte, Skills, Leader-Effekt, Entwicklung, Familie und Belagerungsteams.`,
    siegeTitle: (name: string) =>
      `Belagerungs-Counter für ${name} – Summoners War`,
    siegeDescription: (name: string) =>
      `Finde registrierte Counter für die Verteidigung ${name}, einschließlich Angriffsteams, Runen, Werte und Zugreihenfolge.`,
  },
} satisfies Record<Locale, Record<string, unknown>>;

export const localeCopy = (locale: Locale) => copy[locale];
