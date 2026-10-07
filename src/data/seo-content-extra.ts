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
        question:
          '¿Cómo encuentro un counter para una defensa de Siege de Summoners War?',
        answer:
          'Introduce uno o más nombres de monstruos enemigos en el campo de búsqueda. El catálogo encuentra las defensas registradas sin importar el orden en que escribas los nombres, y cada resultado enlaza las ideas de ofensiva disponibles.',
      },
      {
        question: '¿Puedo buscar usando solo un monstruo de la defensa?',
        answer:
          'Sí. Una búsqueda parcial es útil cuando solo recuerdas uno o dos monstruos. Añade más nombres para limitar la lista a la defensa exacta de Siege de Summoners War a la que te enfrentas.',
      },
      {
        question:
          '¿Cuál es la diferencia entre una torre de 4 estrellas y una torre libre?',
        answer:
          'Una torre de 4 estrellas solo permite monstruos cuyo grado natural cumple la restricción de Siege. Una torre libre permite elegir entre más equipos. Usa el filtro de torre para que los resultados coincidan con el combate que estás preparando.',
      },
      {
        question: '¿Qué información incluye un equipo counter de Siege?',
        answer:
          'Cuando está disponible, la página del counter muestra la ofensiva de tres monstruos, cómo jugarla, los sets de runas sugeridos, los objetivos de estadísticas, la SPD y la secuencia de ataque. Si el ejemplo procede de una referencia externa, también se indican las fuentes.',
      },
      {
        question:
          '¿Un counter registrado de Summoners War garantiza la victoria?',
        answer:
          'No. La eficiencia de las runas, los artefactos, los niveles de habilidad, el comportamiento de la IA, los golpes críticos y las decisiones del jugador pueden cambiar el resultado. Los ejemplos sin validación competitiva se identifican como contenido demostrativo.',
      },
      {
        question: '¿Por qué el primer monstruo aparece a la izquierda?',
        answer:
          'El primer monstruo es el líder del equipo. Su habilidad de líder es la que se considera para esa composición defensiva u ofensiva, lo que también permite leer siempre el orden del equipo con facilidad.',
      },
      {
        question: '¿Cómo debo interpretar la secuencia de ataque recomendada?',
        answer:
          'La secuencia indica el orden de movimiento previsto para la ofensiva. El orden real depende de la SPD de combate y de los efectos sobre la Barra de Ataque, así que compruébalo con la calculadora Spd Tuning antes del combate de Siege.',
      },
      {
        question: '¿Son obligatorios los sets de runas sugeridos?',
        answer:
          'No. Describen la función prevista para la build del ejemplo. Otros sets equivalentes pueden funcionar si conservan el orden de velocidad, la supervivencia, la precisión, el daño y las demás estadísticas necesarias.',
      },
      {
        question:
          '¿Puedo usar Siege Counter para planificar tanto la ofensiva como la defensa?',
        answer:
          'Sí. Su uso principal es encontrar ideas de ofensiva, pero revisar las respuestas habituales también ayuda a comprender los puntos débiles de una defensa antes de crearla o colocarla.',
      },
      {
        question: '¿Qué debo comprobar antes de usar un counter de SW Siege?',
        answer:
          'Confirma el tipo de torre, la habilidad de líder, los sets de runas, las estadísticas mínimas, el orden de turnos, los artefactos y las interacciones elementales. Comprueba también si el ejemplo está marcado como contenido demostrativo en lugar de como resultado validado.',
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
        question:
          '¿Cómo encuentro un monstruo en la base de datos de Summoners War?',
        answer:
          'Busca por el nombre despertado del monstruo o por su familia. Puedes combinar la búsqueda con los filtros de elemento, estrellas naturales y habilidad de líder para limitar una familia numerosa a la forma que necesitas.',
      },
      {
        question:
          '¿Puedo filtrar los monstruos de Summoners War por elemento y estrellas?',
        answer:
          'Sí. El catálogo incluye filtros de Fuego, Agua, Viento, Luz y Oscuridad, además de grados naturales de una a cinco estrellas. Los filtros se pueden combinar y borrar en cualquier momento.',
      },
      {
        question: '¿Qué estadísticas de los monstruos están disponibles?',
        answer:
          'Las páginas de monstruos muestran HP máximo, ATK máximo, DEF máxima, SPD base, estrellas naturales, elemento y arquetipo cuando la fuente proporciona esos datos. Son valores base del monstruo, no una build de jugador.',
      },
      {
        question: '¿La SPD base incluye runas, torres o habilidades de líder?',
        answer:
          'No. La SPD base es el valor del monstruo antes de los bonos de runas, la torre de SPD, las habilidades de líder, Swift, los buffs y la mayoría de los efectos de combate. Usa las herramientas de velocidad para simular esos factores.',
      },
      {
        question:
          '¿Puedo buscar monstruos con una habilidad de líder específica?',
        answer:
          'Sí. Filtra por el atributo del líder, como Velocidad de Ataque, HP o Precisión, y por el ámbito de contenido en el que funciona la habilidad, como Arena, Gremio o contenido global.',
      },
      {
        question: '¿Qué información de habilidades aparece en la página?',
        answer:
          'La página puede mostrar descripciones de habilidades, tiempos de recarga, número de golpes, etiquetas de pasiva o área, efectos, probabilidades de activación, multiplicadores de daño y progresión de mejoras cuando esos campos están disponibles.',
      },
      {
        question: '¿Se incluyen los monstruos con segundo despertar?',
        answer:
          'Sí. Las formas con segundo despertar pueden aparecer como formas finales obtenibles independientes y enlazan con la ruta de evolución para que puedas compararlas con otras etapas y miembros de la familia.',
      },
      {
        question: '¿Cómo comparo monstruos de la misma familia?',
        answer:
          'Abre la página de detalles de un monstruo y usa la sección de familia para visitar los demás elementos o formas. Para una comparación directa de velocidad, abre SPD Comparison y selecciona ambos monstruos.',
      },
      {
        question: '¿Puedo ver dónde se usa un monstruo en equipos de Siege?',
        answer:
          'Sí. Cuando un monstruo aparece en una defensa u ofensiva registrada, su página de detalles enlaza esas entradas de Siege Counter para que puedas pasar de la investigación a la planificación del equipo.',
      },
      {
        question: '¿De dónde proceden los datos de monstruos de Summoners War?',
        answer:
          'El catálogo importa la información de monstruos y habilidades de SWARFARM y muestra la fecha de importación. Los retratos y personajes del juego pertenecen a Com2uS; PlayerDojo es un proyecto comunitario independiente.',
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
        question: '¿Qué es el Spd Tuning en Summoners War?',
        answer:
          'El Spd Tuning es el proceso de ajustar las velocidades de los monstruos para que el equipo actúe en la secuencia prevista. Un buen ajuste reduce la posibilidad de que un enemigo actúe entre los turnos de preparación, control y daño.',
      },
      {
        question: '¿Cómo uso la calculadora de Spd Tuning de Summoners War?',
        answer:
          'Elige Siege, Arena o RTA, añade los monstruos en orden de ataque, introduce la SPD de las runas y activa el líder, Swift, los buffs o los efectos de Barra de Ataque aplicables. El resultado indica si se mantiene la secuencia y la SPD adicional mínima necesaria.',
      },
      {
        question: '¿Qué significa SPD adicional mínima?',
        answer:
          'Es la SPD verde mínima de las runas que necesita ese monstruo con las condiciones configuradas. Compárala con la SPD adicional que aparece en la pantalla de detalles del monstruo dentro del juego.',
      },
      {
        question: '¿Por qué Siege, Arena y RTA se calculan de forma distinta?',
        answer:
          'En esta calculadora, Siege y Arena usan ticks de Barra de Ataque del 7 %, mientras que RTA usa ticks del 1,5 %. Esa diferencia de tiempo cambia lo cerca que debe seguir un monstruo al anterior para evitar un corte.',
      },
      {
        question: '¿Debo introducir la SPD total o solo la SPD de las runas?',
        answer:
          'Introduce la SPD adicional que aportan las runas, normalmente mostrada en verde dentro del juego. La calculadora ya conoce la SPD base del monstruo seleccionado y aplica por separado los bonos configurados.',
      },
      {
        question: '¿Cómo afecta un set Swift al Spd Tuning?',
        answer:
          'Swift añade un porcentaje basado en la SPD base del monstruo, por lo que dos monstruos no reciben la misma cantidad plana. Activa Swift solo para los monstruos que realmente usan el set de cuatro piezas.',
      },
      {
        question:
          '¿Cómo se aplica una habilidad de líder de SPD de Summoners War?',
        answer:
          'Activa un líder válido para el equipo. El bono usa el porcentaje y la restricción de contenido de la habilidad de líder, por lo que un líder de Gremio no debe considerarse activo en Arena o RTA.',
      },
      {
        question:
          '¿La calculadora puede incluir aumentos de Barra de Ataque y buffs de SPD?',
        answer:
          'Sí, para los efectos de monstruos compatibles. Configura el porcentaje de aumento, el objetivo o el buff de SPD cuando el monstruo seleccionado ofrezca esas opciones; los turnos posteriores se recalcularán a partir del efecto.',
      },
      {
        question: '¿Qué significa que un equipo sufra un corte?',
        answer:
          'Un corte ocurre cuando otra unidad obtiene un turno entre dos monstruos que debían actuar consecutivamente. Esto puede romper un combo al interrumpir la preparación, la inmunidad, el control o el daño.',
      },
      {
        question: '¿Un Spd Tuning correcto garantiza el orden de turnos?',
        answer:
          'No. La velocidad del enemigo, las pasivas, los efectos resistidos, los tiempos de recarga, la manipulación de la Barra de Ataque y las mecánicas específicas del combate aún pueden cambiar la secuencia. Usa el resultado para validar tu equipo con las condiciones seleccionadas.',
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
        question: '¿Qué calcula SPD Comparison de Summoners War?',
        answer:
          'Compara dos monstruos después de aplicar la SPD base, el líder de velocidad elegido, la torre de SPD, el set Swift y los modificadores especiales compatibles. El resultado es la diferencia estructural antes de la SPD normal de las runas.',
      },
      {
        question: '¿En qué se diferencia SPD Comparison de Spd Tuning?',
        answer:
          'SPD Comparison analiza una comparación estructural directa. Spd Tuning crea una secuencia de aliados y comprueba si los monstruos posteriores siguen al primero sin sufrir un corte.',
      },
      {
        question: '¿Qué es la SPD estructural?',
        answer:
          'La SPD estructural es la velocidad producida por el valor base del monstruo y los bonos porcentuales configurados antes de añadir los subatributos individuales de SPD y la SPD de la ranura 2.',
      },
      {
        question: '¿La comparación incluye la SPD de las runas?',
        answer:
          'Incluye el porcentaje del set Swift cuando está activado, pero no la SPD adicional plana de los atributos principales o subatributos de las runas. El resultado indica cuánta ventaja de SPD todavía debes conseguir con las runas.',
      },
      {
        question: '¿Cómo cambia Swift la comparación?',
        answer:
          'Swift aumenta la SPD a partir del valor base del monstruo. Un monstruo con mayor SPD base obtiene más SPD bruta del mismo set, lo que puede ampliar o invertir la diferencia estructural.',
      },
      {
        question: '¿Puedo comparar distintos niveles de torre de SPD?',
        answer:
          'Sí. Cada lado tiene su propio porcentaje de torre de SPD, lo que resulta útil para comparar cuentas o comprobar cómo una mejora de torre cambia la diferencia de runas necesaria.',
      },
      {
        question:
          '¿Puede cada monstruo usar una habilidad de líder de velocidad distinta?',
        answer:
          'Sí. Configura el líder válido para cada lado. Asegúrate de que el ámbito del líder se aplica al contenido que estás simulando, porque las habilidades de Arena, Gremio y globales no son intercambiables.',
      },
      {
        question: '¿Por qué Chilling tiene una opción de buffs iniciales?',
        answer:
          'Chilling tiene una interacción pasiva compatible que cambia su velocidad según los buffs iniciales considerados por la calculadora. Otras pasivas no indicadas y los cambios durante el combate no se simulan automáticamente.',
      },
      {
        question:
          '¿Qué ocurre cuando ambos monstruos empatan en SPD estructural?',
        answer:
          'Un empate significa que ningún lado tiene una ventaja propia con la configuración seleccionada. Un solo punto adicional de SPD de runas puede decidir entonces qué monstruo alcanza la mayor velocidad de combate.',
      },
      {
        question: '¿Cómo puedo usar el resultado al equipar runas?',
        answer:
          'Interpreta la ventaja o el margen indicados como la diferencia de SPD de runas que debes superar o que puedes permitirte. Después comprueba el orden final del equipo en Spd Tuning, porque los aumentos aliados y el espacio entre turnos añaden más restricciones.',
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
        question: '¿Qué es un tick de velocidad en Summoners War?',
        answer:
          'Un tick es un paso del tiempo de combate en el que los monstruos ganan Barra de Ataque según su velocidad de combate. Alcanzar un breakpoint más rápido puede reducir el número de ticks necesarios para obtener el primer turno.',
      },
      {
        question: '¿Qué significan Tick 4, Tick 5 y Tick 6?',
        answer:
          'Describen la obtención de un turno después de cuatro, cinco o seis pasos de ganancia de Barra de Ataque según el modelo de la calculadora. Un número de Tick menor requiere un breakpoint de velocidad de combate más alto.',
      },
      {
        question: '¿Cómo uso la calculadora SPD Tick de Summoners War?',
        answer:
          'Selecciona un monstruo, configura tu torre de SPD, elige un porcentaje de líder o consulta todos los líderes y activa Swift si está equipado. La tabla mostrará la SPD adicional de runas necesaria para cada Tick.',
      },
      {
        question: '¿Qué es la SPD adicional o SPD verde?',
        answer:
          'Es la SPD adicional que aportan las runas y que aparece en verde en la pantalla de detalles del monstruo. Es independiente de la SPD base y de los bonos porcentuales, como habilidades de líder, torres y Swift.',
      },
      {
        question:
          '¿Por qué importa la SPD base del monstruo para un breakpoint de Tick?',
        answer:
          'La SPD base es el valor inicial y la referencia para varios bonos porcentuales. Los monstruos con distintas velocidades base pueden necesitar diferente SPD de runas aunque usen el mismo líder, torre y set Swift.',
      },
      {
        question:
          '¿Cómo afecta la torre de SPD a la velocidad de runas necesaria?',
        answer:
          'La torre añade un porcentaje basado en la SPD base. Un nivel de torre más alto reduce la SPD adicional de runas necesaria para alcanzar el mismo breakpoint de combate.',
      },
      {
        question: '¿Puedo comparar todos los líderes de SPD de Summoners War?',
        answer:
          'Sí. Deja el filtro de líder en Todos para comparar los porcentajes disponibles en columnas separadas, o selecciona un valor de líder para centrar la tabla en el equipo que planeas usar.',
      },
      {
        question: '¿El set de runas Swift reduce el requisito de Tick?',
        answer:
          'Normalmente sí. Swift añade un 25 % de la SPD base antes de considerar la SPD adicional de las runas, por lo que activarlo puede reducir considerablemente la SPD verde restante.',
      },
      {
        question:
          '¿Por qué el turno dentro del juego puede ocurrir en otro momento?',
        answer:
          'Los aumentos de Barra de Ataque, los buffs o debuffs de SPD, las pasivas, los efectos de habilidades, las acciones enemigas y las mecánicas específicas del contenido pueden alterar el tiempo. La calculadora se centra en los bonos estáticos y el breakpoint seleccionados.',
      },
      {
        question: '¿Qué breakpoint de Tick debo buscar para mi monstruo?',
        answer:
          'Elige el breakpoint que necesite tu plan de equipo y pueda sostener la calidad de tus runas. Más velocidad no siempre es mejor si rompe el orden de turnos aliado, así que comprueba la build terminada con Spd Tuning.',
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
        question:
          'Comment trouver un counter pour une défense de siège dans Summoners War ?',
        answer:
          'Saisissez le nom d’un ou plusieurs monstres ennemis dans le champ de recherche. Le catalogue retrouve les défenses enregistrées quel que soit l’ordre dans lequel vous saisissez les noms, et chaque résultat mène aux idées d’offense disponibles.',
      },
      {
        question:
          'Puis-je effectuer une recherche avec un seul monstre de la défense ?',
        answer:
          'Oui. Une recherche partielle est utile lorsque vous ne vous souvenez que d’un ou deux monstres. Ajoutez d’autres noms pour limiter la liste à la défense de siège Summoners War exacte que vous affrontez.',
      },
      {
        question:
          'Quelle est la différence entre une tour 4 étoiles et une tour libre ?',
        answer:
          'Une tour 4 étoiles n’autorise que les monstres dont le grade naturel respecte la restriction du siège. Une tour libre offre un choix d’équipes plus large. Utilisez le filtre de tour pour obtenir des résultats adaptés au combat que vous préparez.',
      },
      {
        question: 'Quelles informations contient une équipe counter de siège ?',
        answer:
          'Lorsqu’elles sont disponibles, la page d’un counter présente l’offense de trois monstres, la manière de la jouer, les sets de runes conseillés, les objectifs de statistiques, la VIT et l’ordre d’attaque. Les sources sont indiquées lorsque l’exemple provient d’une référence externe.',
      },
      {
        question:
          'Un counter Summoners War répertorié garantit-il la victoire ?',
        answer:
          'Non. L’efficacité des runes, les artefacts, les niveaux de compétence, le comportement de l’IA, les coups critiques et les décisions du joueur peuvent modifier le résultat. Les exemples sans validation compétitive sont identifiés comme du contenu de démonstration.',
      },
      {
        question: 'Pourquoi le premier monstre apparaît-il à gauche ?',
        answer:
          'Le premier monstre est le leader de l’équipe. Sa compétence de leader est celle prise en compte pour cette composition défensive ou offensive, ce qui permet aussi de lire l’ordre des équipes de manière cohérente.',
      },
      {
        question: 'Comment lire l’ordre d’attaque recommandé ?',
        answer:
          'Cet ordre indique la séquence d’action prévue pour l’offense. L’ordre réel dépend de la VIT de combat et des effets sur la Barre d’Attaque : vérifiez-le donc avec le calculateur Spd Tuning avant le combat de siège.',
      },
      {
        question: 'Les sets de runes conseillés sont-ils obligatoires ?',
        answer:
          'Non. Ils décrivent le rôle prévu du build présenté en exemple. Des sets équivalents peuvent fonctionner s’ils préservent l’ordre de vitesse, la survie, la précision, les dégâts et les autres statistiques nécessaires.',
      },
      {
        question:
          'Puis-je utiliser Siege Counter pour planifier l’offense et la défense ?',
        answer:
          'Oui. Son usage principal est de trouver des idées d’offense, mais l’étude des réponses courantes aide aussi à comprendre les faiblesses d’une défense avant de la construire ou de la placer.',
      },
      {
        question:
          'Que dois-je vérifier avant d’utiliser un counter de siège SW ?',
        answer:
          'Vérifiez le type de tour, la compétence de leader, les sets de runes, les statistiques minimales, l’ordre des tours, les artefacts et les interactions élémentaires. Vérifiez également si l’exemple est signalé comme contenu de démonstration plutôt que comme résultat validé.',
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
        question:
          'Comment trouver un monstre dans la base de données Summoners War ?',
        answer:
          'Recherchez le nom éveillé du monstre ou sa famille. Vous pouvez combiner cette recherche avec les filtres d’élément, d’étoiles naturelles et de compétence de leader afin de limiter une grande famille à la forme recherchée.',
      },
      {
        question:
          'Puis-je filtrer les monstres Summoners War par élément et par étoiles ?',
        answer:
          'Oui. Le catalogue propose des filtres Feu, Eau, Vent, Lumière et Ténèbres, ainsi que les grades naturels d’une à cinq étoiles. Ces filtres peuvent être combinés et réinitialisés à tout moment.',
      },
      {
        question: 'Quelles statistiques de monstre sont disponibles ?',
        answer:
          'Les pages de monstre affichent les PV max, l’ATQ max, la DÉF max, la VIT de base, les étoiles naturelles, l’élément et l’archétype lorsque la source fournit ces données. Il s’agit des valeurs de base du monstre, pas du build d’un joueur.',
      },
      {
        question:
          'La VIT de base inclut-elle les runes, les tours ou les compétences de leader ?',
        answer:
          'Non. La VIT de base est la valeur du monstre avant les bonus de runes, la tour de VIT, les compétences de leader, Swift, les buffs et la plupart des effets de combat. Utilisez les outils de vitesse pour modéliser ces ajouts.',
      },
      {
        question:
          'Puis-je rechercher des monstres possédant une compétence de leader précise ?',
        answer:
          'Oui. Filtrez par attribut de leader, comme la Vitesse d’Attaque, les PV ou la Précision, puis par le contenu dans lequel cette compétence s’applique, comme l’Arène, la Guilde ou tous les contenus.',
      },
      {
        question:
          'Quelles informations sur les compétences figurent sur une page de monstre ?',
        answer:
          'La page peut afficher les descriptions des compétences, les temps de recharge, le nombre de coups, les étiquettes de passif ou de zone, les effets, les chances d’activation, les multiplicateurs de dégâts et la progression des skill-ups lorsque ces données sont disponibles.',
      },
      {
        question: 'Les monstres avec un second éveil sont-ils inclus ?',
        answer:
          'Oui. Les formes avec un second éveil peuvent apparaître comme des formes finales obtenables à part entière et renvoient au parcours d’évolution pour permettre leur comparaison avec les autres étapes et membres de la famille.',
      },
      {
        question: 'Comment comparer les monstres d’une même famille ?',
        answer:
          'Ouvrez la page détaillée d’un monstre et utilisez la section consacrée à sa famille pour consulter les autres éléments ou formes. Pour une comparaison directe de vitesse, ouvrez SPD Comparison et sélectionnez les deux monstres.',
      },
      {
        question:
          'Puis-je voir dans quelles équipes de siège un monstre est utilisé ?',
        answer:
          'Oui. Lorsqu’un monstre apparaît dans une défense ou une offense enregistrée, sa page détaillée renvoie vers les entrées correspondantes de Siege Counter afin de passer de la recherche à la planification d’équipe.',
      },
      {
        question:
          'D’où proviennent les données sur les monstres de Summoners War ?',
        answer:
          'Le catalogue importe les informations sur les monstres et les compétences depuis SWARFARM et affiche la date d’importation. Les portraits et les personnages du jeu appartiennent à Com2uS ; PlayerDojo est un projet communautaire indépendant.',
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
        question: 'Qu’est-ce que le Spd Tuning dans Summoners War ?',
        answer:
          'Le Spd Tuning consiste à régler la vitesse des monstres pour que l’équipe joue dans l’ordre prévu. Un bon réglage réduit le risque qu’un ennemi joue entre vos tours de préparation, de contrôle et de dégâts.',
      },
      {
        question:
          'Comment utiliser le calculateur de Spd Tuning de Summoners War ?',
        answer:
          'Choisissez Siège, Arène ou RTA, ajoutez les monstres dans l’ordre d’attaque, saisissez la VIT de leurs runes et activez le leader, Swift, les buffs ou les effets de Barre d’Attaque applicables. Le résultat indique si l’ordre est respecté et la VIT supplémentaire minimale nécessaire.',
      },
      {
        question: 'Que signifie VIT supplémentaire minimale ?',
        answer:
          'Il s’agit de la VIT verte minimale que les runes doivent fournir à ce monstre dans les conditions configurées. Comparez-la à la VIT supplémentaire affichée sur l’écran détaillé du monstre dans le jeu.',
      },
      {
        question:
          'Pourquoi le Siège, l’Arène et la RTA sont-ils calculés différemment ?',
        answer:
          'Dans ce calculateur, le Siège et l’Arène utilisent des ticks de Barre d’Attaque de 7 %, tandis que la RTA utilise des ticks de 1,5 %. Cette différence de timing modifie la proximité nécessaire entre deux monstres pour éviter une interruption.',
      },
      {
        question:
          'Dois-je saisir la VIT totale ou uniquement la VIT des runes ?',
        answer:
          'Saisissez la VIT supplémentaire fournie par les runes, généralement affichée en vert dans le jeu. Le calculateur connaît déjà la VIT de base du monstre sélectionné et applique séparément les bonus configurés.',
      },
      {
        question: 'Quel est l’effet d’un set Swift sur le Spd Tuning ?',
        answer:
          'Swift ajoute un pourcentage calculé à partir de la VIT de base du monstre : deux monstres ne gagnent donc pas la même valeur brute. Activez Swift uniquement pour les monstres qui utilisent réellement ce set de quatre runes.',
      },
      {
        question:
          'Comment une compétence de leader de VIT est-elle appliquée dans Summoners War ?',
        answer:
          'Activez un leader éligible pour l’équipe. Le bonus dépend du pourcentage et de la restriction de contenu de la compétence de leader : un leader de Guilde ne doit donc pas être considéré comme actif en Arène ou en RTA.',
      },
      {
        question:
          'Le calculateur peut-il inclure les boosts de Barre d’Attaque et les buffs de VIT ?',
        answer:
          'Oui, pour les effets de monstres pris en charge. Configurez le pourcentage de boost, la cible ou le buff de VIT lorsque le monstre sélectionné propose ces options ; les tours suivants seront recalculés à partir de cet effet.',
      },
      {
        question: 'Que signifie une interruption dans l’ordre d’une équipe ?',
        answer:
          'Une interruption se produit lorsqu’une autre unité obtient un tour entre deux monstres qui devaient jouer à la suite. Elle peut briser un combo en interrompant la préparation, l’immunité, le contrôle ou les dégâts.',
      },
      {
        question: 'Un Spd Tuning réussi garantit-il l’ordre des tours ?',
        answer:
          'Non. La vitesse ennemie, les passifs, les effets résistés, les temps de recharge, la manipulation de la Barre d’Attaque et les mécaniques propres au combat peuvent encore modifier l’ordre. Utilisez le résultat pour valider votre équipe selon les hypothèses sélectionnées.',
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
        question: 'Que calcule le comparateur de VIT de Summoners War ?',
        answer:
          'Il compare deux monstres après application de la VIT de base, du leader de vitesse choisi, de la tour de VIT, du set Swift et des modificateurs spéciaux pris en charge. Le résultat est la différence structurelle avant la VIT ordinaire des runes.',
      },
      {
        question:
          'Quelle est la différence entre SPD Comparison et Spd Tuning ?',
        answer:
          'SPD Comparison analyse une confrontation structurelle directe. Spd Tuning construit une séquence alliée et vérifie si les monstres suivants jouent après le premier sans être interrompus.',
      },
      {
        question: 'Qu’est-ce que la VIT structurelle ?',
        answer:
          'La VIT structurelle est la vitesse produite par la valeur de base du monstre et les bonus en pourcentage configurés, avant l’ajout des sous-statistiques individuelles de VIT et de la VIT de l’emplacement 2.',
      },
      {
        question: 'La comparaison inclut-elle la VIT des runes ?',
        answer:
          'Elle inclut le pourcentage du set Swift lorsqu’il est activé, mais pas la VIT supplémentaire brute des statistiques principales ou secondaires des runes. Le résultat indique l’avantage de VIT qu’il reste à obtenir avec les runes.',
      },
      {
        question: 'Comment Swift modifie-t-il la comparaison ?',
        answer:
          'Swift augmente la VIT à partir de la valeur de base du monstre. Un monstre doté d’une VIT de base plus élevée gagne davantage de VIT brute avec le même set, ce qui peut creuser ou inverser la différence structurelle.',
      },
      {
        question: 'Puis-je comparer différents niveaux de tour de VIT ?',
        answer:
          'Oui. Chaque côté possède son propre pourcentage de tour de VIT, ce qui permet de comparer des comptes ou de vérifier comment une amélioration de la tour modifie l’écart de runes nécessaire.',
      },
      {
        question:
          'Chaque monstre peut-il utiliser une compétence de leader de vitesse différente ?',
        answer:
          'Oui. Configurez le leader valide de chaque côté. Vérifiez que son champ d’application correspond au contenu modélisé, car les compétences d’Arène, de Guilde et globales ne sont pas interchangeables.',
      },
      {
        question:
          'Pourquoi Chilling possède-t-il une option de buffs initiaux ?',
        answer:
          'Chilling dispose d’une interaction passive prise en charge qui modifie sa vitesse selon les buffs initiaux considérés par le calculateur. Les autres passifs non répertoriés et les changements en cours de combat ne sont pas modélisés automatiquement.',
      },
      {
        question:
          'Que se passe-t-il lorsque les deux monstres ont la même VIT structurelle ?',
        answer:
          'Une égalité signifie qu’aucun côté ne bénéficie d’un avantage intrinsèque avec les réglages sélectionnés. Un seul point de VIT de runes supplémentaire peut alors décider quel monstre atteint la vitesse de combat la plus élevée.',
      },
      {
        question: 'Comment utiliser le résultat pour choisir mes runes ?',
        answer:
          'Interprétez l’avantage ou la marge indiqués comme l’écart de VIT de runes que vous devez combler ou pouvez concéder. Vérifiez ensuite l’ordre final de l’équipe dans Spd Tuning, car les boosts alliés et l’espacement des tours ajoutent d’autres contraintes.',
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
        question: 'Qu’est-ce qu’un tick de vitesse dans Summoners War ?',
        answer:
          'Un tick est une étape du timing de combat pendant laquelle les monstres gagnent de la Barre d’Attaque selon leur vitesse de combat. Atteindre un seuil plus rapide peut réduire le nombre de ticks nécessaires pour obtenir le premier tour.',
      },
      {
        question: 'Que signifient Tick 4, Tick 5 et Tick 6 ?',
        answer:
          'Ils correspondent à l’obtention d’un tour après quatre, cinq ou six étapes de gain de Barre d’Attaque selon le modèle du calculateur. Un numéro de Tick plus bas exige un seuil de vitesse de combat plus élevé.',
      },
      {
        question: 'Comment utiliser le calculateur SPD Tick de Summoners War ?',
        answer:
          'Sélectionnez un monstre, réglez votre tour de VIT, choisissez un pourcentage de leader ou affichez tous les leaders, puis activez Swift s’il est équipé. Le tableau indique alors la VIT de runes supplémentaire requise pour chaque Tick.',
      },
      {
        question: 'Qu’est-ce que la VIT bonus ou VIT verte ?',
        answer:
          'Il s’agit de la VIT supplémentaire fournie par les runes et affichée en vert sur l’écran détaillé du monstre. Elle est distincte de la VIT de base et des bonus en pourcentage comme les compétences de leader, les tours et Swift.',
      },
      {
        question:
          'Pourquoi la VIT de base du monstre compte-t-elle pour un seuil de Tick ?',
        answer:
          'La VIT de base est la valeur de départ et sert de référence à plusieurs bonus en pourcentage. Des monstres ayant des vitesses de base différentes peuvent nécessiter une VIT de runes différente même avec le même leader, la même tour et le même set Swift.',
      },
      {
        question:
          'Comment la tour de VIT modifie-t-elle la vitesse de runes requise ?',
        answer:
          'La tour ajoute un pourcentage calculé sur la VIT de base. Un niveau de tour supérieur réduit la VIT de runes supplémentaire nécessaire pour atteindre le même seuil de combat.',
      },
      {
        question: 'Puis-je comparer tous les leaders de VIT de Summoners War ?',
        answer:
          'Oui. Laissez le filtre de leader sur Tous pour comparer les pourcentages disponibles dans des colonnes distinctes, ou sélectionnez une valeur de leader afin de concentrer le tableau sur l’équipe prévue.',
      },
      {
        question: 'Le set de runes Swift réduit-il le seuil de Tick ?',
        answer:
          'Généralement oui. Swift ajoute 25 % de la VIT de base avant la prise en compte de la VIT supplémentaire des runes ; l’activer peut donc réduire considérablement la VIT verte encore nécessaire.',
      },
      {
        question:
          'Pourquoi le tour peut-il se produire à un autre moment dans le jeu ?',
        answer:
          'Les boosts de Barre d’Attaque, les buffs ou debuffs de VIT, les passifs, les effets de compétences, les actions ennemies et les mécaniques propres au contenu peuvent modifier le timing. Le calculateur se concentre sur les bonus statiques et le seuil sélectionnés.',
      },
      {
        question: 'Quel seuil de Tick dois-je viser pour mon monstre ?',
        answer:
          'Choisissez le seuil exigé par votre plan d’équipe et compatible avec la qualité de vos runes. Aller plus vite n’est pas toujours préférable si cela brise l’ordre des tours alliés : vérifiez donc le build terminé dans Spd Tuning.',
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
        question:
          'Wie finde ich einen Counter für eine Summoners-War-Belagerungsverteidigung?',
        answer:
          'Gib den Namen eines oder mehrerer gegnerischer Monster in das Suchfeld ein. Der Katalog findet registrierte Verteidigungen unabhängig von der Reihenfolge der eingegebenen Namen, und jedes Ergebnis führt zu den verfügbaren Angriffsideen.',
      },
      {
        question: 'Kann ich mit nur einem Monster aus der Verteidigung suchen?',
        answer:
          'Ja. Eine Teilsuche ist nützlich, wenn du dich nur an ein oder zwei Monster erinnerst. Füge weitere Namen hinzu, um die Liste auf die genaue Summoners-War-Belagerungsverteidigung einzugrenzen, gegen die du antrittst.',
      },
      {
        question:
          'Was ist der Unterschied zwischen einem 4-Sterne-Turm und einem offenen Turm?',
        answer:
          'Ein 4-Sterne-Turm erlaubt nur Monster, deren natürlicher Rang die Belagerungsbeschränkung erfüllt. Ein offener Turm bietet eine größere Teamauswahl. Nutze den Turmfilter, damit die Ergebnisse zum geplanten Kampf passen.',
      },
      {
        question: 'Welche Informationen enthält ein Belagerungs-Counterteam?',
        answer:
          'Wenn verfügbar, zeigt die Counterseite den Angriff mit drei Monstern, die Spielweise, empfohlene Runensets, Zielwerte, GES und Angriffsreihenfolge. Stammt das Beispiel aus einer externen Referenz, werden die Quellen angegeben.',
      },
      {
        question:
          'Garantiert ein aufgeführter Summoners-War-Counter einen Sieg?',
        answer:
          'Nein. Runeneffizienz, Artefakte, Skilllevel, KI-Verhalten, kritische Treffer und Spielerentscheidungen können das Ergebnis verändern. Beispiele ohne kompetitive Bestätigung sind als Demonstrationsinhalte gekennzeichnet.',
      },
      {
        question: 'Warum erscheint das erste Monster auf der linken Seite?',
        answer:
          'Das erste Monster ist der Teamleader. Sein Leader-Skill wird für diese Verteidigungs- oder Angriffszusammenstellung berücksichtigt, wodurch sich die Teamreihenfolge außerdem einheitlich lesen lässt.',
      },
      {
        question: 'Wie lese ich die empfohlene Angriffsreihenfolge?',
        answer:
          'Die Reihenfolge zeigt die vorgesehene Zugfolge des Angriffs. Die tatsächliche Reihenfolge hängt von der Kampf-GES und Effekten auf den Angriffsbalken ab. Prüfe sie deshalb vor dem Belagerungskampf mit dem Spd-Tuning-Rechner.',
      },
      {
        question: 'Sind die empfohlenen Runensets verpflichtend?',
        answer:
          'Nein. Sie beschreiben die vorgesehene Rolle des Beispiel-Builds. Gleichwertige Sets können funktionieren, wenn sie die erforderliche Geschwindigkeitsreihenfolge, Überlebensfähigkeit, Genauigkeit, den Schaden und andere relevante Werte erhalten.',
      },
      {
        question:
          'Kann ich Siege Counter zur Angriffs- und Verteidigungsplanung nutzen?',
        answer:
          'Ja. Hauptsächlich dient das Tool dazu, Angriffsideen zu finden. Häufige Antworten zu prüfen hilft dir aber auch, die Schwächen einer Verteidigung zu verstehen, bevor du sie baust oder aufstellst.',
      },
      {
        question:
          'Was sollte ich vor der Nutzung eines SW-Belagerungs-Counters prüfen?',
        answer:
          'Prüfe Turmtyp, Leader-Skill, Runensets, Mindestwerte, Zugreihenfolge, Artefakte und Elementinteraktionen. Achte außerdem darauf, ob das Beispiel als Demonstrationsinhalt statt als bestätigtes Ergebnis gekennzeichnet ist.',
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
        question: 'Wie finde ich ein Monster in der Summoners-War-Datenbank?',
        answer:
          'Suche nach dem erweckten Monsternamen oder nach der Familie. Du kannst die Suche mit Element-, natürlichem Sterne- und Leader-Skill-Filter kombinieren, um eine große Familie auf die benötigte Form einzugrenzen.',
      },
      {
        question:
          'Kann ich Summoners-War-Monster nach Element und Sternen filtern?',
        answer:
          'Ja. Der Katalog enthält Filter für Feuer, Wasser, Wind, Licht und Dunkelheit sowie natürliche Ränge von einem bis fünf Sternen. Die Filter lassen sich kombinieren und jederzeit zurücksetzen.',
      },
      {
        question: 'Welche Monsterwerte sind verfügbar?',
        answer:
          'Monsterseiten zeigen maximale HP, maximalen ATK, maximale DEF, Basis-GES, natürliche Sterne, Element und Archetyp, sofern die Quelle diese Daten bereitstellt. Das sind die Basiswerte des Monsters, nicht der Build eines Spielers.',
      },
      {
        question: 'Enthält die Basis-GES Runen, Türme oder Leader-Skills?',
        answer:
          'Nein. Die Basis-GES ist der Monsterwert vor Runenboni, dem GES-Turm, Leader-Skills, Swift, Buffs und den meisten Kampfeffekten. Nutze die Geschwindigkeits-Tools, um diese Ergänzungen zu berechnen.',
      },
      {
        question:
          'Kann ich nach Monstern mit einem bestimmten Leader-Skill suchen?',
        answer:
          'Ja. Filtere nach dem Leader-Attribut wie Angriffsgeschwindigkeit, HP oder Genauigkeit und nach dem Inhaltsbereich, in dem der Leader-Skill wirkt, zum Beispiel Arena, Gilde oder alle Inhalte.',
      },
      {
        question: 'Welche Skillinformationen zeigt eine Monsterseite?',
        answer:
          'Die Seite kann Skillbeschreibungen, Abklingzeiten, Trefferzahl, Passiv- oder Flächenkennzeichnungen, Effekte, Aktivierungschancen, Schadensmultiplikatoren und die Entwicklung durch Skill-ups anzeigen, wenn diese Felder verfügbar sind.',
      },
      {
        question: 'Sind Monster mit zweiter Erweckung enthalten?',
        answer:
          'Ja. Zweiterweckte Formen können als eigene endgültige und erhältliche Formen erscheinen und über den Entwicklungspfad zurückverlinken, damit du sie mit anderen Stufen und Familienmitgliedern vergleichen kannst.',
      },
      {
        question: 'Wie vergleiche ich Monster derselben Familie?',
        answer:
          'Öffne die Detailseite eines Monsters und nutze den Familienbereich, um die anderen Elemente oder Formen aufzurufen. Öffne für einen direkten Geschwindigkeitsvergleich SPD Comparison und wähle beide Monster aus.',
      },
      {
        question:
          'Kann ich sehen, wo ein Monster in Belagerungsteams eingesetzt wird?',
        answer:
          'Ja. Wenn ein Monster in einer registrierten Verteidigung oder einem registrierten Angriff vorkommt, verlinkt seine Detailseite auf diese Siege-Counter-Einträge. So kannst du direkt von der Recherche zur Teamplanung wechseln.',
      },
      {
        question: 'Woher stammen die Summoners-War-Monsterdaten?',
        answer:
          'Der Katalog importiert Monster- und Skillinformationen aus SWARFARM und zeigt das Importdatum an. Porträts und Spielfiguren gehören Com2uS; PlayerDojo ist ein unabhängiges Communityprojekt.',
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
        question: 'Was ist Spd Tuning in Summoners War?',
        answer:
          'Spd Tuning bedeutet, die Geschwindigkeiten der Monster so einzustellen, dass ein Team in der geplanten Reihenfolge handelt. Eine gute Abstimmung verringert das Risiko, dass ein Gegner zwischen deinen Vorbereitungs-, Kontroll- und Schadenszügen handelt.',
      },
      {
        question: 'Wie nutze ich den Summoners-War-Rechner für Spd Tuning?',
        answer:
          'Wähle Belagerung, Arena oder RTA, füge Monster in Angriffsreihenfolge hinzu, gib ihre Runen-GES ein und aktiviere den zutreffenden Leader, Swift, Buffs oder Angriffsbalken-Effekte. Das Ergebnis zeigt, ob die Zugfolge hält und welche minimale zusätzliche GES benötigt wird.',
      },
      {
        question: 'Was bedeutet minimale zusätzliche GES?',
        answer:
          'Das ist die minimale grüne GES aus Runen, die das Monster unter den eingestellten Bedingungen benötigt. Vergleiche sie mit der zusätzlichen GES, die im Detailbildschirm des Monsters im Spiel angezeigt wird.',
      },
      {
        question:
          'Warum werden Belagerung, Arena und RTA unterschiedlich berechnet?',
        answer:
          'Belagerung und Arena verwenden in diesem Rechner 7-%-Angriffsbalken-Ticks, RTA dagegen 1,5-%-Ticks. Das unterschiedliche Timing verändert, wie dicht ein Monster auf das vorherige folgen muss, um eine Unterbrechung zu vermeiden.',
      },
      {
        question: 'Soll ich die gesamte GES oder nur die Runen-GES eingeben?',
        answer:
          'Gib die zusätzliche GES aus Runen ein, die im Spiel meist grün angezeigt wird. Der Rechner kennt bereits die Basis-GES des ausgewählten Monsters und wendet die eingestellten Boni separat an.',
      },
      {
        question: 'Wie beeinflusst ein Swift-Set das Spd Tuning?',
        answer:
          'Swift addiert einen Prozentsatz auf Grundlage der Basis-GES des Monsters. Zwei Monster erhalten deshalb nicht denselben flachen Wert. Aktiviere Swift nur für Monster, die das vierteilige Set tatsächlich tragen.',
      },
      {
        question: 'Wie wird ein Summoners-War-GES-Leader-Skill angewendet?',
        answer:
          'Aktiviere einen zulässigen Leader für das Team. Der Bonus berücksichtigt den Prozentsatz und die Inhaltsbeschränkung des Leader-Skills. Ein Gilden-Leader sollte daher in Arena oder RTA nicht als aktiv gelten.',
      },
      {
        question:
          'Kann der Rechner Angriffsbalken-Boosts und GES-Buffs berücksichtigen?',
        answer:
          'Ja, bei unterstützten Monstereffekten. Stelle Boost-Prozentsatz, Ziel oder GES-Buff ein, wenn das ausgewählte Monster diese Optionen bietet. Die späteren Züge werden dann auf Grundlage dieses Effekts neu berechnet.',
      },
      {
        question:
          'Was bedeutet es, wenn die Zugfolge eines Teams unterbrochen wird?',
        answer:
          'Eine Unterbrechung tritt ein, wenn eine andere Einheit zwischen zwei Monstern einen Zug erhält, die direkt nacheinander handeln sollten. Dadurch kann eine Kombination scheitern, weil Vorbereitung, Immunität, Kontrolle oder Schaden unterbrochen werden.',
      },
      {
        question: 'Garantiert ein erfolgreiches Spd Tuning die Zugreihenfolge?',
        answer:
          'Nein. Gegnerische Geschwindigkeit, Passive, widerstandene Effekte, Abklingzeiten, Angriffsbalken-Manipulation und kampfspezifische Mechaniken können die Reihenfolge weiterhin verändern. Nutze das Ergebnis, um dein eigenes Team unter den ausgewählten Annahmen zu prüfen.',
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
        question: 'Was berechnet SPD Comparison für Summoners War?',
        answer:
          'Das Tool vergleicht zwei Monster nach Anwendung von Basis-GES, gewähltem Geschwindigkeits-Leader, GES-Turm, Swift-Set und unterstützten Sondermodifikatoren. Das Ergebnis ist die strukturelle Differenz vor der gewöhnlichen Runen-GES.',
      },
      {
        question: 'Wie unterscheidet sich SPD Comparison von Spd Tuning?',
        answer:
          'SPD Comparison analysiert ein direktes strukturelles Geschwindigkeitsduell. Spd Tuning erstellt eine Zugfolge für Verbündete und prüft, ob spätere Monster ohne Unterbrechung auf das erste folgen.',
      },
      {
        question: 'Was ist strukturelle GES?',
        answer:
          'Strukturelle GES ist die Geschwindigkeit aus dem Basiswert des Monsters und den eingestellten Prozentboni, bevor individuelle GES-Nebenwerte und die GES aus Slot 2 addiert werden.',
      },
      {
        question: 'Enthält der Vergleich die GES aus Runen?',
        answer:
          'Er enthält bei Aktivierung den Prozentbonus des Swift-Sets, aber nicht die flache zusätzliche GES aus Haupt- oder Nebenwerten der Runen. Das Ergebnis zeigt, wie viel GES-Vorsprung noch mit Runen aufgebaut werden muss.',
      },
      {
        question: 'Wie verändert Swift den Vergleich?',
        answer:
          'Swift erhöht die GES auf Grundlage des Basiswerts des Monsters. Ein Monster mit höherer Basis-GES erhält durch dasselbe Set mehr rohe GES, was die strukturelle Differenz vergrößern oder umkehren kann.',
      },
      {
        question: 'Kann ich verschiedene Stufen des GES-Turms vergleichen?',
        answer:
          'Ja. Jede Seite hat ihren eigenen GES-Turm-Prozentsatz. Das ist nützlich, um Accounts zu vergleichen oder zu prüfen, wie ein Turm-Upgrade die erforderliche Runendifferenz verändert.',
      },
      {
        question:
          'Kann jedes Monster einen anderen Geschwindigkeits-Leader-Skill verwenden?',
        answer:
          'Ja. Stelle für jede Seite den gültigen Leader ein. Achte darauf, dass sein Geltungsbereich zum modellierten Inhalt passt, denn Arena-, Gilden- und globale Skills sind nicht austauschbar.',
      },
      {
        question: 'Warum hat Chilling eine Option für anfängliche Buffs?',
        answer:
          'Chilling hat eine unterstützte passive Wechselwirkung, die seine Geschwindigkeit abhängig von den im Rechner berücksichtigten anfänglichen Buffs verändert. Andere nicht aufgeführte Passive und Änderungen während des Kampfes werden nicht automatisch modelliert.',
      },
      {
        question:
          'Was passiert, wenn beide Monster dieselbe strukturelle GES haben?',
        answer:
          'Ein Gleichstand bedeutet, dass unter den gewählten Einstellungen keine Seite einen eingebauten Vorteil hat. Ein einziger zusätzlicher Punkt Runen-GES kann dann entscheiden, welches Monster die höhere Kampfgeschwindigkeit erreicht.',
      },
      {
        question: 'Wie kann ich das Ergebnis beim Runenbau verwenden?',
        answer:
          'Lies den angegebenen Vorteil oder Spielraum als die Runen-GES-Differenz, die du überwinden musst oder dir erlauben kannst. Prüfe danach die endgültige Teamreihenfolge in Spd Tuning, da verbündete Boosts und Zugabstände weitere Einschränkungen hinzufügen.',
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
        question: 'Was ist ein Geschwindigkeits-Tick in Summoners War?',
        answer:
          'Ein Tick ist ein Schritt im Kampftiming, in dem Monster entsprechend ihrer Kampfgeschwindigkeit Angriffsbalken erhalten. Das Erreichen einer schnelleren Schwelle kann die Anzahl der Ticks bis zum ersten Zug verringern.',
      },
      {
        question: 'Was bedeuten Tick 4, Tick 5 und Tick 6?',
        answer:
          'Sie beschreiben einen Zug nach vier, fünf oder sechs Schritten mit Angriffsbalken-Zuwachs im Modell des Rechners. Eine niedrigere Tickzahl erfordert eine höhere Kampfgeschwindigkeits-Schwelle.',
      },
      {
        question: 'Wie nutze ich den Summoners-War-Rechner für SPD Tick?',
        answer:
          'Wähle ein Monster, stelle deinen GES-Turm ein, wähle einen Leader-Prozentsatz oder zeige alle Leader an und aktiviere Swift, falls es ausgerüstet ist. Die Tabelle zeigt anschließend die zusätzlich benötigte Runen-GES für jeden Tick.',
      },
      {
        question: 'Was ist Bonus-GES oder grüne GES?',
        answer:
          'Das ist die zusätzliche GES aus Runen, die im Detailbildschirm des Monsters grün angezeigt wird. Sie ist von der Basis-GES und Prozentboni wie Leader-Skills, Türmen und Swift getrennt.',
      },
      {
        question:
          'Warum ist die Basis-GES des Monsters für eine Tick-Schwelle wichtig?',
        answer:
          'Die Basis-GES ist der Ausgangswert und die Grundlage für mehrere Prozentboni. Monster mit unterschiedlicher Basisgeschwindigkeit können selbst mit demselben Leader, Turm und Swift-Set verschieden viel Runen-GES benötigen.',
      },
      {
        question:
          'Wie beeinflusst der GES-Turm die benötigte Runengeschwindigkeit?',
        answer:
          'Der Turm addiert einen Prozentsatz auf Grundlage der Basis-GES. Eine höhere Turmstufe verringert die zusätzliche Runen-GES, die zum Erreichen derselben Kampfschwelle benötigt wird.',
      },
      {
        question: 'Kann ich alle Summoners-War-GES-Leader vergleichen?',
        answer:
          'Ja. Lass den Leader-Filter auf Alle, um die verfügbaren Prozentsätze in getrennten Spalten zu vergleichen, oder wähle einen Leader-Wert aus, um die Tabelle auf dein geplantes Team zu konzentrieren.',
      },
      {
        question: 'Senkt das Swift-Runenset die Tick-Anforderung?',
        answer:
          'Meistens ja. Swift addiert 25 % der Basis-GES, bevor die zusätzliche Runen-GES berücksichtigt wird. Das Aktivieren des Sets kann daher den verbleibenden Bedarf an grüner GES deutlich senken.',
      },
      {
        question:
          'Warum kann der Zug im Spiel zu einem anderen Zeitpunkt stattfinden?',
        answer:
          'Angriffsbalken-Boosts, GES-Buffs oder -Debuffs, Passive, Skilleffekte, gegnerische Aktionen und inhaltsspezifische Mechaniken können das Timing verändern. Der Rechner konzentriert sich auf die ausgewählten statischen Boni und die Tick-Schwelle.',
      },
      {
        question: 'Welche Tick-Schwelle sollte ich für mein Monster anstreben?',
        answer:
          'Wähle die Schwelle, die dein Teamplan erfordert und deine Runenqualität unterstützt. Schneller ist nicht immer besser, wenn dadurch die Zugreihenfolge der Verbündeten bricht. Prüfe den fertigen Build deshalb mit Spd Tuning.',
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
