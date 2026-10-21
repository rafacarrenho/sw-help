import type { Locale } from './routes';

const monsterIdentity = (name: string, element: string, family: string) =>
  name === family ? element : `${element} ${family}`;

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
    monsterTitle: (name: string, element: string, family: string) =>
      `${name} (${monsterIdentity(name, element, family)}): Summoners War Stats & Skills`,
    monsterDescription: (
      name: string,
      element: string,
      family: string,
      speed: number | undefined,
    ) =>
      `Explore ${name}, the ${element} ${family} in Summoners War: base SPD ${speed ?? '-'}, max-level stats, skills, leader effect, evolution, and Siege teams.`,
    monsterSummary: (
      name: string,
      stars: number,
      element: string,
      archetype: string,
      family: string,
      speed: number | undefined,
      skillCount: number,
      siegeUses: number,
    ) =>
      `${name} is a ${stars}-star ${element} ${archetype} monster from the ${family} family in Summoners War. Base SPD ${speed ?? '-'}, ${skillCount} cataloged ${skillCount === 1 ? 'skill' : 'skills'}, and ${siegeUses} registered Siege ${siegeUses === 1 ? 'matchup' : 'matchups'} on PlayerDojo.`,
    monsterOverviewTitle: (name: string) => `${name} overview`,
    monsterOverviewIntro:
      'Review the main mechanics in the listed skills, then continue with a calculator using this monster.',
    monsterMechanicsTitle: 'Skill mechanics',
    monsterToolsTitle: 'Use this monster in a tool',
    monsterSpeedTickLink: (name: string) => `Calculate SPD Tick for ${name}`,
    monsterSpeedComparisonLink: (name: string) => `Compare ${name}'s SPD`,
    monsterSpeedTuningLink: (name: string) => `Tune a team with ${name}`,
    monsterRuneOptimizerLink: (name: string) => `Optimize runes for ${name}`,
    siegeTitle: (name: string) => `${name}: Summoners War Siege Defense`,
    siegeDescription: (name: string) =>
      `Review the ${name} Summoners War Siege defense, including tower rules, leader skill, monster details, and registered offense counters when available.`,
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
    monsterTitle: (name: string, element: string, family: string) =>
      `${name} (${monsterIdentity(name, element, family)}): atributos e skills de Summoners War`,
    monsterDescription: (
      name: string,
      element: string,
      family: string,
      speed: number | undefined,
    ) =>
      `Veja ${name}, ${element} da família ${family}, em Summoners War: SPD base ${speed ?? '-'}, atributos máximos, skills, liderança, evolução e times de Siege.`,
    monsterSummary: (
      name: string,
      stars: number,
      element: string,
      archetype: string,
      family: string,
      speed: number | undefined,
      skillCount: number,
      siegeUses: number,
    ) =>
      `${name} é um monstro de ${element} com ${stars} ${stars === 1 ? 'estrela natural' : 'estrelas naturais'}, arquétipo ${archetype}, da família ${family} em Summoners War. Possui ${speed ?? '-'} de SPD base, ${skillCount} ${skillCount === 1 ? 'skill catalogada' : 'skills catalogadas'} e aparece em ${siegeUses} ${siegeUses === 1 ? 'confronto' : 'confrontos'} de Siege no PlayerDojo.`,
    monsterOverviewTitle: (name: string) => `Visão geral de ${name}`,
    monsterOverviewIntro:
      'Confira as principais mecânicas das skills listadas e continue em uma calculadora com este monstro.',
    monsterMechanicsTitle: 'Mecânicas das skills',
    monsterToolsTitle: 'Use este monstro em uma ferramenta',
    monsterSpeedTickLink: (name: string) => `Calcular o SPD Tick de ${name}`,
    monsterSpeedComparisonLink: (name: string) => `Comparar o SPD de ${name}`,
    monsterSpeedTuningLink: (name: string) => `Ajustar um time com ${name}`,
    monsterRuneOptimizerLink: (name: string) => `Otimizar runas para ${name}`,
    siegeTitle: (name: string) => `${name}: Summoners War Siege Defense`,
    siegeDescription: (name: string) =>
      `Analise a defesa ${name} no Siege de Summoners War, com regra da torre, liderança, detalhes dos monstros e counters cadastrados quando disponíveis.`,
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
    monsterTitle: (name: string, element: string, family: string) =>
      `${name} (${monsterIdentity(name, element, family)}): estadísticas y skills de Summoners War`,
    monsterDescription: (
      name: string,
      element: string,
      family: string,
      speed: number | undefined,
    ) =>
      `Consulta a ${name}, ${element} de la familia ${family}, en Summoners War: SPD base ${speed ?? '-'}, estadísticas máximas, skills, liderazgo, evolución y equipos de Siege.`,
    monsterSummary: (
      name: string,
      stars: number,
      element: string,
      archetype: string,
      family: string,
      speed: number | undefined,
      skillCount: number,
      siegeUses: number,
    ) =>
      `${name} es un monstruo de ${element} con ${stars} ${stars === 1 ? 'estrella natural' : 'estrellas naturales'}, arquetipo ${archetype}, de la familia ${family} en Summoners War. Tiene ${speed ?? '-'} de SPD base, ${skillCount} ${skillCount === 1 ? 'skill registrada' : 'skills registradas'} y aparece en ${siegeUses} ${siegeUses === 1 ? 'enfrentamiento' : 'enfrentamientos'} de Siege en PlayerDojo.`,
    monsterOverviewTitle: (name: string) => `Resumen de ${name}`,
    monsterOverviewIntro:
      'Revisa las mecánicas principales de las skills registradas y continúa en una calculadora con este monstruo.',
    monsterMechanicsTitle: 'Mecánicas de las skills',
    monsterToolsTitle: 'Usa este monstruo en una herramienta',
    monsterSpeedTickLink: (name: string) => `Calcular el SPD Tick de ${name}`,
    monsterSpeedComparisonLink: (name: string) => `Comparar el SPD de ${name}`,
    monsterSpeedTuningLink: (name: string) => `Ajustar un equipo con ${name}`,
    monsterRuneOptimizerLink: (name: string) => `Optimizar runas para ${name}`,
    siegeTitle: (name: string) => `${name}: Summoners War Siege Defense`,
    siegeDescription: (name: string) =>
      `Analiza la defensa ${name} en el Siege de Summoners War, con regla de torre, liderazgo, detalles de monstruos y counters registrados cuando estén disponibles.`,
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
    monsterTitle: (name: string, element: string, family: string) =>
      `${name} (${monsterIdentity(name, element, family)}) : stats et skills Summoners War`,
    monsterDescription: (
      name: string,
      element: string,
      family: string,
      speed: number | undefined,
    ) =>
      `Découvrez ${name}, ${element} de la famille ${family}, dans Summoners War : VIT de base ${speed ?? '-'}, statistiques maximales, skills, leader, évolution et équipes de siège.`,
    monsterSummary: (
      name: string,
      stars: number,
      element: string,
      archetype: string,
      family: string,
      speed: number | undefined,
      skillCount: number,
      siegeUses: number,
    ) =>
      `${name} est un monstre ${element} à ${stars} ${stars === 1 ? 'étoile naturelle' : 'étoiles naturelles'}, de type ${archetype} et de la famille ${family} dans Summoners War. VIT de base ${speed ?? '-'}, ${skillCount} ${skillCount === 1 ? 'skill répertoriée' : 'skills répertoriées'} et ${siegeUses} ${siegeUses === 1 ? 'affrontement' : 'affrontements'} de siège sur PlayerDojo.`,
    monsterOverviewTitle: (name: string) => `Aperçu de ${name}`,
    monsterOverviewIntro:
      'Consultez les mécaniques principales des skills répertoriées, puis poursuivez dans un calculateur avec ce monstre.',
    monsterMechanicsTitle: 'Mécaniques des skills',
    monsterToolsTitle: 'Utiliser ce monstre dans un outil',
    monsterSpeedTickLink: (name: string) => `Calculer le Spd Tick de ${name}`,
    monsterSpeedComparisonLink: (name: string) => `Comparer la VIT de ${name}`,
    monsterSpeedTuningLink: (name: string) => `Ajuster une équipe avec ${name}`,
    monsterRuneOptimizerLink: (name: string) =>
      `Optimiser les runes de ${name}`,
    siegeTitle: (name: string) => `${name}: Summoners War Siege Defense`,
    siegeDescription: (name: string) =>
      `Analysez la défense ${name} du siège Summoners War : règle de tour, leader, détails des monstres et counters enregistrés lorsqu’ils sont disponibles.`,
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
    monsterTitle: (name: string, element: string, family: string) =>
      `${name} (${monsterIdentity(name, element, family)}): Summoners War Werte & Skills`,
    monsterDescription: (
      name: string,
      element: string,
      family: string,
      speed: number | undefined,
    ) =>
      `Entdecke ${name}, ${element} aus der ${family}-Familie, in Summoners War: Basis-GES ${speed ?? '-'}, Maximalwerte, Skills, Leader-Effekt, Entwicklung und Belagerungsteams.`,
    monsterSummary: (
      name: string,
      stars: number,
      element: string,
      archetype: string,
      family: string,
      speed: number | undefined,
      skillCount: number,
      siegeUses: number,
    ) =>
      `${name} ist ein ${element}-Monster mit ${stars} natürlichen ${stars === 1 ? 'Stern' : 'Sternen'}, Archetyp ${archetype}, aus der ${family}-Familie in Summoners War. Basis-GES ${speed ?? '-'}, ${skillCount} erfasste ${skillCount === 1 ? 'Skill' : 'Skills'} und ${siegeUses} registrierte ${siegeUses === 1 ? 'Belagerungspaarung' : 'Belagerungspaarungen'} auf PlayerDojo.`,
    monsterOverviewTitle: (name: string) => `${name} im Überblick`,
    monsterOverviewIntro:
      'Sieh dir die wichtigsten Mechaniken der erfassten Skills an und nutze dieses Monster direkt in einem Rechner.',
    monsterMechanicsTitle: 'Skill-Mechaniken',
    monsterToolsTitle: 'Dieses Monster in einem Tool verwenden',
    monsterSpeedTickLink: (name: string) => `Spd Tick für ${name} berechnen`,
    monsterSpeedComparisonLink: (name: string) => `GES von ${name} vergleichen`,
    monsterSpeedTuningLink: (name: string) => `Ein Team mit ${name} abstimmen`,
    monsterRuneOptimizerLink: (name: string) => `Runen für ${name} optimieren`,
    siegeTitle: (name: string) => `${name}: Summoners War Siege Defense`,
    siegeDescription: (name: string) =>
      `Analysiere die ${name} Verteidigung in Summoners War Siege mit Turmregel, Leader-Skill, Monsterdetails und registrierten Angriff-Countern, wenn verfügbar.`,
  },
} satisfies Record<Locale, Record<string, unknown>>;

export const localeCopy = (locale: Locale) => copy[locale];
