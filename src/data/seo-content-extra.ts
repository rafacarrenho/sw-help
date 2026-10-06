import type { SeoContentCollection } from './seo-content';

export const seoContentEs: SeoContentCollection = {
  home: {
    heading: 'Herramientas de Summoners War para planificar cada turno',
    intro: [
      'PlayerDojo reúne herramientas especializadas de Summoners War: busca counters de Siege, consulta monstruos, compara SPD, ajusta el orden del equipo y calcula breakpoints de Tick.',
      'Usa cada calculadora para planificar y confirma después las runas, artefactos, pasivas y condiciones del combate dentro del juego.',
    ],
    relatedHeading: 'Empieza con una herramienta de Summoners War',
    related: [
      { route: 'siegeCounter', label: 'Encontrar un counter de Siege' },
      { route: 'monsters', label: 'Buscar monstruos' },
      { route: 'speedTuning', label: 'Ajustar el orden de turnos' },
      { route: 'speedComparison', label: 'Comparar la SPD de dos monstruos' },
      { route: 'speedTick', label: 'Calcular breakpoints de Tick' },
    ],
  },
  siegeCounter: {
    heading: 'Cómo usar el Siege Counter de Summoners War',
    intro: [
      'Busca los nombres de los monstruos enemigos para encontrar ofensivas registradas contra una defensa de Siege. Abre un resultado para revisar líder, secuencia, runas y estadísticas objetivo.',
      'Un counter es un punto de partida, no una victoria garantizada. Compara la calidad de tus runas, artefactos, habilidades y torres antes de atacar.',
    ],
    faqHeading: 'Preguntas sobre counters de Siege',
    faqIntro: 'Cómo encontrar y evaluar ofensivas contra defensas de Siege.',
    faqs: [
      {
        question: '¿Cómo encuentro un counter para una defensa de Siege?',
        answer:
          'Introduce uno o más nombres de los monstruos enemigos. La búsqueda no depende del orden y cada resultado enlaza las ofensivas disponibles.',
      },
      {
        question: '¿Un counter registrado garantiza la victoria?',
        answer:
          'No. Las runas, artefactos, habilidades, IA y decisiones del jugador pueden cambiar el resultado. Los ejemplos no validados se identifican como demostrativos.',
      },
      {
        question: '¿Cómo interpreto la secuencia recomendada?',
        answer:
          'La secuencia representa el orden previsto. Comprueba la SPD de combate y los efectos de barra en Spd Tuning antes de usar el equipo.',
      },
    ],
    relatedHeading: 'Planifica el resto de la ofensiva',
    related: [
      { route: 'speedTuning', label: 'Ajustar el orden de la ofensiva' },
      { route: 'monsters', label: 'Consultar cada monstruo' },
      { route: 'speedComparison', label: 'Comparar la SPD inicial' },
    ],
  },
  monsters: {
    heading: 'Explora la base de datos de monstruos de Summoners War',
    intro: [
      'Busca monstruos obtenibles por nombre o familia y filtra por elemento, estrellas naturales, habilidad de líder o contenido.',
      'Cada página reúne estadísticas base, habilidades, liderazgo, evolución, fuentes, familia y equipos de Siege relacionados.',
    ],
    faqHeading: 'Preguntas sobre monstruos de Summoners War',
    faqIntro: 'Qué contiene el catálogo y cómo comparar monstruos.',
    faqs: [
      {
        question: '¿Cómo busco un monstruo?',
        answer:
          'Busca por su nombre despertado o familia y combina los filtros de elemento, estrellas y liderazgo.',
      },
      {
        question: '¿La SPD base incluye runas o torre?',
        answer:
          'No. Es el valor anterior a runas, torre, líder, Swift y la mayoría de efectos de combate.',
      },
      {
        question: '¿De dónde proceden los datos?',
        answer:
          'Los datos de monstruos y habilidades se importan de SWARFARM y conservan sus nombres y descripciones originales en inglés.',
      },
    ],
    relatedHeading: 'Usa los datos en una calculadora',
    related: [
      { route: 'siegeCounter', label: 'Encontrar equipos de Siege' },
      { route: 'speedComparison', label: 'Comparar SPD base' },
      { route: 'speedTuning', label: 'Crear un orden de turnos' },
      { route: 'speedTick', label: 'Calcular breakpoints de Tick' },
    ],
  },
  speedTuning: {
    heading: 'Spd Tuning para Siege, Arena y RTA',
    intro: [
      'Spd Tuning ajusta las velocidades para que los aliados actúen en el orden previsto sin dejar un corte evitable al enemigo.',
      'Añade los monstruos en orden, introduce la SPD de runas y configura líder, torre, Swift, buffs y aumentos de barra compatibles.',
    ],
    faqHeading: 'Preguntas sobre Spd Tuning',
    faqIntro: 'Ajuste de velocidad y prevención de cortes.',
    faqs: [
      {
        question: '¿Qué significa SPD adicional mínima?',
        answer:
          'Es la velocidad mínima que deben aportar las runas bajo las condiciones configuradas.',
      },
      {
        question: '¿Por qué Siege, Arena y RTA son diferentes?',
        answer:
          'Siege y Arena usan ticks del 7 %, mientras que RTA usa ticks del 1,5 %, lo que cambia la distancia necesaria entre velocidades.',
      },
      {
        question: '¿Un ajuste aprobado garantiza el orden?',
        answer:
          'No. Las pasivas, resistencias, recargas y manipulaciones enemigas de barra todavía pueden alterar la secuencia.',
      },
    ],
    relatedHeading: 'Comprueba las condiciones de velocidad',
    related: [
      { route: 'speedComparison', label: 'Comparar la SPD estructural' },
      { route: 'speedTick', label: 'Revisar breakpoints de Tick' },
      { route: 'monsters', label: 'Consultar SPD base y habilidades' },
    ],
  },
  speedComparison: {
    heading: 'Compara la SPD de dos monstruos antes de las runas',
    intro: [
      'El comparador muestra la ventaja estructural creada por la SPD base, el líder, la torre, Swift y los casos especiales compatibles.',
      'Usa la diferencia para estimar cuánta SPD de runas necesitas ganar o puedes ceder y aun así actuar primero.',
    ],
    faqHeading: 'Preguntas sobre el comparador de SPD',
    faqIntro: 'Qué incluye el cálculo y cómo leer el resultado.',
    faqs: [
      {
        question: '¿Qué es la SPD estructural?',
        answer:
          'Es la velocidad producida por el valor base y los bonos porcentuales configurados antes de añadir la SPD plana de las runas.',
      },
      {
        question: '¿Incluye la SPD de las runas?',
        answer:
          'Incluye el bono porcentual de Swift, pero no el atributo principal ni los subatributos planos.',
      },
      {
        question: '¿Qué ocurre en un empate?',
        answer:
          'Ningún lado tiene ventaja estructural; un solo punto adicional de SPD puede decidir quién actúa primero.',
      },
    ],
    relatedHeading: 'Continúa el cálculo de velocidad',
    related: [
      { route: 'speedTuning', label: 'Ajustar el equipo completo' },
      { route: 'speedTick', label: 'Calcular Tick 4, Tick 5 y Tick 6' },
      { route: 'monsters', label: 'Explorar estadísticas de monstruos' },
    ],
  },
  speedTick: {
    heading: 'Breakpoints de Spd Tick en Summoners War',
    intro: [
      'La calculadora convierte SPD base, torre, líder y Swift en la SPD de runas necesaria para alcanzar Tick 4, Tick 5 o Tick 6.',
      'Compara varias habilidades de líder y usa el resultado como objetivo antes de comprobar el orden completo del equipo.',
    ],
    faqHeading: 'Preguntas sobre Spd Tick',
    faqIntro: 'Cómo interpretar los breakpoints de velocidad.',
    faqs: [
      {
        question: '¿Qué es un breakpoint de Tick?',
        answer:
          'Es la velocidad mínima con la que el monstruo llena su barra en el número de ticks seleccionado bajo los bonos configurados.',
      },
      {
        question: '¿Swift reduce la SPD necesaria?',
        answer:
          'Normalmente sí. Swift añade un 25 % de la SPD base antes de considerar la velocidad adicional de las runas.',
      },
      {
        question: '¿Qué Tick debo buscar?',
        answer:
          'Elige el que necesite tu plan y puedan sostener tus runas. Más velocidad no siempre mejora el orden del equipo.',
      },
    ],
    relatedHeading: 'Convierte el breakpoint en un plan',
    related: [
      { route: 'speedTuning', label: 'Comprobar el orden completo' },
      { route: 'speedComparison', label: 'Comparar dos velocidades' },
      { route: 'monsters', label: 'Consultar la SPD base' },
    ],
  },
};

export const seoContentFr: SeoContentCollection = {
  home: {
    heading: 'Des outils Summoners War pour planifier chaque tour',
    intro: [
      'PlayerDojo réunit des outils dédiés à Summoners War : counters de siège, catalogue de monstres, comparaison de VIT, Spd Tuning et seuils de Tick.',
      'Utilisez chaque calculateur pour planifier, puis vérifiez les runes, artefacts, passifs et conditions du combat dans le jeu.',
    ],
    relatedHeading: 'Commencez avec un outil Summoners War',
    related: [
      { route: 'siegeCounter', label: 'Trouver un counter de siège' },
      { route: 'monsters', label: 'Rechercher des monstres' },
      { route: 'speedTuning', label: 'Régler l’ordre de jeu' },
      { route: 'speedComparison', label: 'Comparer la VIT de deux monstres' },
      { route: 'speedTick', label: 'Calculer les seuils de Tick' },
    ],
  },
  siegeCounter: {
    heading: 'Comment utiliser le Siege Counter de Summoners War',
    intro: [
      'Recherchez les monstres ennemis pour trouver des offenses enregistrées contre une défense de siège. Ouvrez un résultat pour consulter leader, ordre, runes et objectifs de statistiques.',
      'Un counter est un point de départ, pas une victoire garantie. Comparez vos runes, artefacts, niveaux de compétence et tours avant d’attaquer.',
    ],
    faqHeading: 'Questions sur les counters de siège',
    faqIntro: 'Trouver et évaluer des offenses contre les défenses de siège.',
    faqs: [
      {
        question: 'Comment trouver un counter ?',
        answer:
          'Saisissez un ou plusieurs noms de monstres ennemis. La recherche fonctionne dans n’importe quel ordre et ouvre les offenses disponibles.',
      },
      {
        question: 'Un counter garantit-il la victoire ?',
        answer:
          'Non. Runes, artefacts, compétences, IA et décisions du joueur peuvent modifier le résultat.',
      },
      {
        question: 'Comment lire l’ordre conseillé ?',
        answer:
          'Il représente la séquence prévue. Vérifiez la VIT de combat et les effets de jauge dans Spd Tuning.',
      },
    ],
    relatedHeading: 'Planifiez le reste de l’offense',
    related: [
      { route: 'speedTuning', label: 'Régler l’ordre de l’offense' },
      { route: 'monsters', label: 'Consulter chaque monstre' },
      { route: 'speedComparison', label: 'Comparer la VIT initiale' },
    ],
  },
  monsters: {
    heading: 'Explorez la base de données des monstres Summoners War',
    intro: [
      'Recherchez les monstres obtenables par nom ou famille et filtrez par élément, étoiles naturelles, compétence de leader ou contenu.',
      'Chaque page regroupe statistiques de base, compétences, leader, évolution, sources, famille et équipes de siège associées.',
    ],
    faqHeading: 'Questions sur les monstres Summoners War',
    faqIntro: 'Ce que contient le catalogue et comment comparer les monstres.',
    faqs: [
      {
        question: 'Comment rechercher un monstre ?',
        answer:
          'Utilisez son nom éveillé ou sa famille, puis combinez les filtres d’élément, d’étoiles et de leader.',
      },
      {
        question: 'La VIT de base inclut-elle les runes ?',
        answer:
          'Non. Elle précède les runes, la tour, le leader, Swift et la plupart des effets de combat.',
      },
      {
        question: 'D’où viennent les données ?',
        answer:
          'Les monstres et compétences sont importés de SWARFARM ; leurs noms et descriptions restent en anglais.',
      },
    ],
    relatedHeading: 'Utilisez les données dans un calculateur',
    related: [
      { route: 'siegeCounter', label: 'Trouver des équipes de siège' },
      { route: 'speedComparison', label: 'Comparer la VIT de base' },
      { route: 'speedTuning', label: 'Créer un ordre de jeu' },
      { route: 'speedTick', label: 'Calculer les seuils de Tick' },
    ],
  },
  speedTuning: {
    heading: 'Spd Tuning pour le siège, l’arène et la RTA',
    intro: [
      'Spd Tuning règle les vitesses pour que les alliés jouent dans l’ordre prévu sans offrir une interruption évitable à l’ennemi.',
      'Ajoutez les monstres dans l’ordre, saisissez la VIT des runes et configurez leader, tour, Swift, buffs et boosts de jauge compatibles.',
    ],
    faqHeading: 'Questions sur Spd Tuning',
    faqIntro: 'Réglage de vitesse et prévention des interruptions.',
    faqs: [
      {
        question: 'Que signifie VIT supplémentaire minimale ?',
        answer:
          'C’est la vitesse minimale que les runes doivent fournir dans les conditions configurées.',
      },
      {
        question: 'Pourquoi les calculs diffèrent-ils ?',
        answer:
          'Le siège et l’arène utilisent des ticks de 7 %, la RTA des ticks de 1,5 %.',
      },
      {
        question: 'Un réglage validé garantit-il l’ordre ?',
        answer:
          'Non. Passifs, résistances, temps de recharge et manipulation ennemie de jauge peuvent encore changer la séquence.',
      },
    ],
    relatedHeading: 'Vérifiez les conditions de vitesse',
    related: [
      { route: 'speedComparison', label: 'Comparer la VIT structurelle' },
      { route: 'speedTick', label: 'Vérifier les seuils de Tick' },
      { route: 'monsters', label: 'Consulter VIT de base et compétences' },
    ],
  },
  speedComparison: {
    heading: 'Comparez la VIT de deux monstres avant les runes',
    intro: [
      'Le comparateur montre l’avantage structurel créé par la VIT de base, le leader, la tour, Swift et les cas spéciaux compatibles.',
      'Utilisez l’écart pour estimer la VIT de runes à gagner ou à céder tout en jouant en premier.',
    ],
    faqHeading: 'Questions sur le comparateur de VIT',
    faqIntro: 'Ce que le calcul inclut et comment lire le résultat.',
    faqs: [
      {
        question: 'Qu’est-ce que la VIT structurelle ?',
        answer:
          'C’est la vitesse issue de la valeur de base et des bonus configurés avant la VIT plate des runes.',
      },
      {
        question: 'Les runes sont-elles incluses ?',
        answer:
          'Le bonus de Swift est inclus, mais pas la statistique principale ni les sous-statistiques plates.',
      },
      {
        question: 'Que signifie une égalité ?',
        answer:
          'Aucun côté n’a d’avantage structurel ; un seul point de VIT supplémentaire peut décider du premier tour.',
      },
    ],
    relatedHeading: 'Poursuivez le calcul de vitesse',
    related: [
      { route: 'speedTuning', label: 'Régler toute l’équipe' },
      { route: 'speedTick', label: 'Calculer Tick 4, Tick 5 et Tick 6' },
      { route: 'monsters', label: 'Explorer les statistiques' },
    ],
  },
  speedTick: {
    heading: 'Seuils de Spd Tick dans Summoners War',
    intro: [
      'Le calculateur transforme VIT de base, tour, leader et Swift en VIT de runes nécessaire pour Tick 4, Tick 5 ou Tick 6.',
      'Comparez plusieurs leaders et utilisez le résultat comme objectif avant de vérifier l’ordre complet.',
    ],
    faqHeading: 'Questions sur Spd Tick',
    faqIntro: 'Interpréter les seuils de vitesse.',
    faqs: [
      {
        question: 'Qu’est-ce qu’un seuil de Tick ?',
        answer:
          'C’est la vitesse minimale pour remplir la jauge dans le nombre de ticks choisi avec les bonus configurés.',
      },
      {
        question: 'Swift réduit-il la VIT nécessaire ?',
        answer:
          'Généralement oui. Swift ajoute 25 % de la VIT de base avant la vitesse supplémentaire des runes.',
      },
      {
        question: 'Quel Tick viser ?',
        answer:
          'Choisissez celui dont votre plan a besoin et que vos runes peuvent soutenir sans casser l’ordre allié.',
      },
    ],
    relatedHeading: 'Transformez le seuil en plan',
    related: [
      { route: 'speedTuning', label: 'Vérifier l’ordre complet' },
      { route: 'speedComparison', label: 'Comparer deux vitesses' },
      { route: 'monsters', label: 'Consulter la VIT de base' },
    ],
  },
};

export const seoContentDe: SeoContentCollection = {
  home: {
    heading: 'Summoners-War-Tools für die Planung jedes Zuges',
    intro: [
      'PlayerDojo bündelt spezialisierte Summoners-War-Tools: Belagerungs-Counter, Monsterkatalog, GES-Vergleich, Spd Tuning und Tick-Schwellen.',
      'Nutze jeden Rechner zur Planung und prüfe anschließend Runen, Artefakte, Passive und Kampfbedingungen im Spiel.',
    ],
    relatedHeading: 'Mit einem Summoners-War-Tool starten',
    related: [
      { route: 'siegeCounter', label: 'Belagerungs-Counter finden' },
      { route: 'monsters', label: 'Monster suchen' },
      { route: 'speedTuning', label: 'Zugreihenfolge abstimmen' },
      { route: 'speedComparison', label: 'GES zweier Monster vergleichen' },
      { route: 'speedTick', label: 'Tick-Schwellen berechnen' },
    ],
  },
  siegeCounter: {
    heading: 'So nutzt du den Summoners War Siege Counter',
    intro: [
      'Suche nach gegnerischen Monstern, um registrierte Angriffe gegen eine Belagerungsverteidigung zu finden. Öffne ein Ergebnis für Leader, Reihenfolge, Runen und Zielwerte.',
      'Ein Counter ist ein Ausgangspunkt, kein garantierter Sieg. Vergleiche Runen, Artefakte, Skilllevel und Türme vor dem Angriff.',
    ],
    faqHeading: 'Fragen zu Belagerungs-Countern',
    faqIntro: 'Angriffe gegen Belagerungsverteidigungen finden und bewerten.',
    faqs: [
      {
        question: 'Wie finde ich einen Counter?',
        answer:
          'Gib einen oder mehrere Namen der gegnerischen Monster ein. Die Reihenfolge ist egal; jedes Ergebnis zeigt verfügbare Angriffe.',
      },
      {
        question: 'Garantiert ein Counter den Sieg?',
        answer:
          'Nein. Runen, Artefakte, Skills, KI und Spielerentscheidungen können das Ergebnis verändern.',
      },
      {
        question: 'Wie lese ich die empfohlene Reihenfolge?',
        answer:
          'Sie zeigt die geplante Zugfolge. Prüfe Kampf-GES und Balkeneffekte vorab in Spd Tuning.',
      },
    ],
    relatedHeading: 'Den restlichen Angriff planen',
    related: [
      { route: 'speedTuning', label: 'Angriffsreihenfolge abstimmen' },
      { route: 'monsters', label: 'Monster nachschlagen' },
      { route: 'speedComparison', label: 'Anfangs-GES vergleichen' },
    ],
  },
  monsters: {
    heading: 'Die Summoners-War-Monsterdatenbank entdecken',
    intro: [
      'Suche erhältliche Monster nach Name oder Familie und filtere nach Element, natürlichen Sternen, Leader-Skill oder Inhalt.',
      'Jede Seite bündelt Basiswerte, Skills, Leader, Entwicklung, Quellen, Familie und zugehörige Belagerungsteams.',
    ],
    faqHeading: 'Fragen zu Summoners-War-Monstern',
    faqIntro: 'Inhalte des Katalogs und korrekter Vergleich.',
    faqs: [
      {
        question: 'Wie suche ich ein Monster?',
        answer:
          'Suche nach dem erweckten Namen oder der Familie und kombiniere Element-, Sterne- und Leader-Filter.',
      },
      {
        question: 'Enthält die Basis-GES Runen?',
        answer:
          'Nein. Sie gilt vor Runen, Turm, Leader, Swift und den meisten Kampfeffekten.',
      },
      {
        question: 'Woher stammen die Daten?',
        answer:
          'Monster- und Skilldaten werden aus SWARFARM importiert; Namen und Beschreibungen bleiben auf Englisch.',
      },
    ],
    relatedHeading: 'Daten in einem Rechner verwenden',
    related: [
      { route: 'siegeCounter', label: 'Belagerungsteams finden' },
      { route: 'speedComparison', label: 'Basis-GES vergleichen' },
      { route: 'speedTuning', label: 'Zugreihenfolge erstellen' },
      { route: 'speedTick', label: 'Tick-Schwellen berechnen' },
    ],
  },
  speedTuning: {
    heading: 'Spd Tuning für Belagerung, Arena und RTA',
    intro: [
      'Spd Tuning stimmt Geschwindigkeiten ab, damit Verbündete in der geplanten Reihenfolge ziehen, ohne dem Gegner eine vermeidbare Unterbrechung zu geben.',
      'Füge Monster der Reihe nach hinzu, gib Runen-GES ein und konfiguriere Leader, Turm, Swift, Buffs und kompatible Balken-Boosts.',
    ],
    faqHeading: 'Fragen zu Spd Tuning',
    faqIntro: 'Geschwindigkeiten abstimmen und Unterbrechungen verhindern.',
    faqs: [
      {
        question: 'Was bedeutet minimale zusätzliche GES?',
        answer:
          'Das ist die minimale Geschwindigkeit, die Runen unter den gewählten Bedingungen liefern müssen.',
      },
      {
        question: 'Warum unterscheiden sich die Modi?',
        answer:
          'Belagerung und Arena verwenden 7-%-Ticks, RTA dagegen 1,5-%-Ticks.',
      },
      {
        question: 'Garantiert eine gültige Abstimmung die Reihenfolge?',
        answer:
          'Nein. Passive, Widerstände, Abklingzeiten und gegnerische Balkenmanipulation können die Folge noch ändern.',
      },
    ],
    relatedHeading: 'Geschwindigkeitsbedingungen prüfen',
    related: [
      { route: 'speedComparison', label: 'Strukturelle GES vergleichen' },
      { route: 'speedTick', label: 'Tick-Schwellen prüfen' },
      { route: 'monsters', label: 'Basis-GES und Skills prüfen' },
    ],
  },
  speedComparison: {
    heading: 'GES zweier Monster vor den Runen vergleichen',
    intro: [
      'Der Vergleich zeigt den strukturellen Vorteil aus Basis-GES, Leader, Turm, Swift und unterstützten Sonderfällen.',
      'Nutze die Differenz, um abzuschätzen, wie viel Runen-GES ein Monster gewinnen muss oder abgeben kann und trotzdem zuerst zieht.',
    ],
    faqHeading: 'Fragen zum GES-Vergleich',
    faqIntro: 'Was die Berechnung enthält und wie das Ergebnis zu lesen ist.',
    faqs: [
      {
        question: 'Was ist strukturelle GES?',
        answer:
          'Die Geschwindigkeit aus Basiswert und konfigurierten Prozentboni vor der flachen Runen-GES.',
      },
      {
        question: 'Ist Runen-GES enthalten?',
        answer:
          'Der Swift-Prozentbonus ist enthalten, Haupt- und Nebenwerte der Runen jedoch nicht.',
      },
      {
        question: 'Was bedeutet Gleichstand?',
        answer:
          'Keine Seite hat einen strukturellen Vorteil; ein zusätzlicher GES-Punkt kann den ersten Zug entscheiden.',
      },
    ],
    relatedHeading: 'Geschwindigkeitsberechnung fortsetzen',
    related: [
      { route: 'speedTuning', label: 'Komplettes Team abstimmen' },
      { route: 'speedTick', label: 'Tick 4, Tick 5 und Tick 6 berechnen' },
      { route: 'monsters', label: 'Monsterwerte entdecken' },
    ],
  },
  speedTick: {
    heading: 'Spd-Tick-Schwellen in Summoners War',
    intro: [
      'Der Rechner wandelt Basis-GES, Turm, Leader und Swift in die Runen-GES für Tick 4, Tick 5 oder Tick 6 um.',
      'Vergleiche mehrere Leader-Skills und nutze das Ergebnis als Ziel, bevor du die komplette Zugreihenfolge prüfst.',
    ],
    faqHeading: 'Fragen zu Spd Tick',
    faqIntro: 'Geschwindigkeitsschwellen richtig verstehen.',
    faqs: [
      {
        question: 'Was ist eine Tick-Schwelle?',
        answer:
          'Die minimale Geschwindigkeit, mit der ein Monster unter den gewählten Boni seinen Balken in der ausgewählten Tickzahl füllt.',
      },
      {
        question: 'Senkt Swift die nötige GES?',
        answer:
          'Meistens ja. Swift addiert 25 % der Basis-GES vor der zusätzlichen Runengeschwindigkeit.',
      },
      {
        question: 'Welche Tick-Stufe sollte ich wählen?',
        answer:
          'Wähle die für deinen Plan nötige Stufe, die deine Runen tragen können, ohne die Teamreihenfolge zu stören.',
      },
    ],
    relatedHeading: 'Aus der Schwelle einen Plan machen',
    related: [
      { route: 'speedTuning', label: 'Komplette Reihenfolge prüfen' },
      { route: 'speedComparison', label: 'Zwei Geschwindigkeiten vergleichen' },
      { route: 'monsters', label: 'Basis-GES nachschlagen' },
    ],
  },
};
