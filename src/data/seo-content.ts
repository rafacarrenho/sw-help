import type { Locale, RouteName } from '../i18n';

export interface SeoFaq {
  question: string;
  answer: string;
}

export interface SeoRelatedLink {
  route: RouteName;
  label: string;
}

export interface SeoPageContent {
  heading: string;
  intro: readonly string[];
  faqHeading?: string;
  faqIntro?: string;
  faqs?: readonly SeoFaq[];
  relatedHeading: string;
  related: readonly SeoRelatedLink[];
}

export interface SeoContentCollection {
  home: SeoPageContent;
  siegeCounter: SeoPageContent;
  monsters: SeoPageContent;
  speedTuning: SeoPageContent;
  speedComparison: SeoPageContent;
  speedTick: SeoPageContent;
}

export const seoContent: Record<Locale, SeoContentCollection> = {
  en: {
    home: {
      heading: 'Summoners War tools for planning every turn',
      intro: [
        'SW Help brings focused Summoners War tools into one place: search Siege counters, research monster stats and skills, compare SPD, tune a team, and calculate combat tick breakpoints.',
        'Use each calculator as a planning aid, then confirm runes, artifacts, passives, and the battle situation in game. The tools explain what they include so you can make an informed decision before investing resources or entering a fight.',
      ],
      relatedHeading: 'Start with a Summoners War tool',
      related: [
        { route: 'siegeCounter', label: 'Find a Siege counter' },
        { route: 'monsters', label: 'Search the monster database' },
        { route: 'speedTuning', label: 'Tune a team turn order' },
        { route: 'speedComparison', label: 'Compare two monsters by SPD' },
        { route: 'speedTick', label: 'Calculate SPD tick breakpoints' },
      ],
    },
    siegeCounter: {
      heading: 'How to use the Summoners War Siege Counter',
      intro: [
        'Search the enemy monster names to find registered Summoners War Siege offense ideas for that defense. Open a result to review the leader, suggested turn sequence, rune sets, target stats, and the purpose of each team.',
        'A counter is a starting point, not a guaranteed win. Compare your rune quality, artifacts, skill levels, towers, and available duplicates before using an SW Siege offense in battle.',
      ],
      faqHeading: 'Summoners War Siege Counter FAQ',
      faqIntro:
        'Answers to common questions about finding and evaluating Siege offense teams.',
      faqs: [
        {
          question:
            'How do I find a counter for a Summoners War Siege defense?',
          answer:
            'Enter one or more enemy monster names in the search field. The catalog matches registered defenses regardless of the order in which you type the names, and each result links to the available offense ideas.',
        },
        {
          question: 'Can I search with only one monster from the defense?',
          answer:
            'Yes. A partial search is useful when you remember only one or two monsters. Add more names to narrow the list to the exact Summoners War Siege defense you are facing.',
        },
        {
          question:
            'What is the difference between a 4-star tower and an open tower?',
          answer:
            'A 4-star tower only allows monsters whose natural grade meets the Siege restriction. An open tower allows broader team choices. Use the tower filter so the results match the battle you are preparing for.',
        },
        {
          question: 'What information is included with a Siege counter team?',
          answer:
            'When available, a counter page shows the three-monster offense, how to play it, suggested rune sets, stat targets, SPD, and attack sequence. Sources are listed when the example came from an external reference.',
        },
        {
          question: 'Does a listed Summoners War counter guarantee a win?',
          answer:
            'No. Rune efficiency, artifacts, skill levels, AI behavior, critical hits, and player decisions can change the result. Examples without competitive validation are identified as demonstration content.',
        },
        {
          question: 'Why does the first monster appear on the left?',
          answer:
            'The first monster is the team leader. Its leader skill is the one considered for that defense or offense composition, which also makes the team order easier to read consistently.',
        },
        {
          question: 'How should I read the recommended attack sequence?',
          answer:
            'The sequence indicates the intended move order for the offense. Your actual order depends on combat SPD and Attack Bar effects, so verify it with the SPD Tuning calculator before the Siege battle.',
        },
        {
          question: 'Are the suggested rune sets mandatory?',
          answer:
            'No. They describe the intended role of the example build. Equivalent sets can work when they preserve the required speed order, survivability, accuracy, damage, and other relevant stats.',
        },
        {
          question:
            'Can I use the Siege Counter for offense and defense planning?',
          answer:
            'Yes. The main use is finding offense ideas, but reviewing common answers also helps you understand the weaknesses of a defense before you build or place it.',
        },
        {
          question: 'What should I check before using an SW Siege counter?',
          answer:
            'Confirm the tower type, leader skill, rune sets, minimum stats, turn order, artifacts, and elemental interactions. Also check whether the example is marked as demonstration content rather than a validated result.',
        },
      ],
      relatedHeading: 'Plan the rest of the offense',
      related: [
        { route: 'speedTuning', label: 'Tune the offense turn order' },
        { route: 'monsters', label: 'Research each Summoners War monster' },
        { route: 'speedComparison', label: 'Compare first-turn SPD' },
      ],
    },
    monsters: {
      heading: 'Explore the Summoners War monster database',
      intro: [
        'Search obtainable Summoners War monsters by name or family, then filter the catalog by element, natural stars, leader skill, or game content. Sorting by base SPD, HP, ATK, or DEF helps compare forms without rune stats.',
        'Each monster page brings together max-level base stats, skills, leader effects, evolution, acquisition sources, family members, and links to Siege teams that use the monster.',
      ],
      faqHeading: 'Summoners War monster database FAQ',
      faqIntro:
        'Learn what the catalog includes and how to compare monsters accurately.',
      faqs: [
        {
          question: 'How can I find a monster in the Summoners War database?',
          answer:
            'Search by the awakened monster name or by family. You can combine the search with element, natural-star, and leader-skill filters to narrow a large family to the form you need.',
        },
        {
          question: 'Can I filter Summoners War monsters by element and stars?',
          answer:
            'Yes. The catalog includes Fire, Water, Wind, Light, and Dark filters plus natural grades from one to five stars. The filters can be combined and cleared at any time.',
        },
        {
          question: 'Which monster stats are available?',
          answer:
            'Monster pages show max HP, max ATK, max DEF, base SPD, natural stars, element, and archetype when the source provides them. These are base monster values, not a player build.',
        },
        {
          question: 'Does base SPD include runes, towers, or leader skills?',
          answer:
            'No. Base SPD is the monster value before rune bonuses, the SPD tower, leader skills, Swift, buffs, and most battle effects. Use the speed tools to model those additions.',
        },
        {
          question: 'Can I search for monsters with a specific leader skill?',
          answer:
            'Yes. Filter by the leader attribute, such as Attack Speed, HP, or Accuracy, and by the content scope where that leader skill works, such as Arena, Guild, or global content.',
        },
        {
          question: 'What skill information appears on a monster page?',
          answer:
            'The page can show skill descriptions, cooldowns, hit count, passive or area tags, effects, activation chances, damage multipliers, and skill-up progression when those fields are available.',
        },
        {
          question: 'Are second-awakened monsters included?',
          answer:
            'Yes. Second-awakened forms can appear as their own final obtainable forms and link back through the evolution path so you can compare them with other stages and family members.',
        },
        {
          question: 'How do I compare monsters from the same family?',
          answer:
            'Open a monster detail page and use the family section to visit the other elements or forms. For a direct speed race, open the SPD Comparison and select both monsters.',
        },
        {
          question: 'Can I see where a monster is used in Siege teams?',
          answer:
            'Yes. When a monster appears in a registered defense or offense, its detail page links to those Siege Counter entries so you can move from research to team planning.',
        },
        {
          question: 'Where does the Summoners War monster data come from?',
          answer:
            'The catalog imports monster and skill information from SWARFARM and displays the import date. Portraits and game characters belong to Com2uS; SW Help is an independent community project.',
        },
      ],
      relatedHeading: 'Use monster data in a calculator',
      related: [
        { route: 'siegeCounter', label: 'Find Summoners War Siege teams' },
        { route: 'speedComparison', label: 'Compare monster base SPD' },
        { route: 'speedTuning', label: 'Build a tuned turn order' },
        { route: 'speedTick', label: 'Calculate tick breakpoints' },
      ],
    },
    speedTuning: {
      heading: 'Summoners War SPD tuning for Siege, Arena, and RTA',
      intro: [
        'SPD tuning arranges a Summoners War team so allies take turns in the intended order without leaving an avoidable opening for the enemy. Add monsters from first to last, enter their rune SPD, and configure the bonuses that affect combat speed.',
        'The calculator supports Siege, Arena, and RTA timing, along with leader skills, Swift, SPD towers, Attack Bar boosts, and supported SPD effects. Treat the minimum as a mathematical target and still account for enemy interruption and effects the model does not include.',
      ],
      faqHeading: 'Summoners War SPD tuning FAQ',
      faqIntro:
        'Common questions about speed tuning teams and preventing turn-order cuts.',
      faqs: [
        {
          question: 'What is SPD tuning in Summoners War?',
          answer:
            'SPD tuning is the process of setting monster speeds so a team acts in the planned sequence. A good tune reduces the chance that an enemy moves between your setup, control, and damage turns.',
        },
        {
          question: 'How do I use the Summoners War speed tuning calculator?',
          answer:
            'Choose Siege, Arena, or RTA, add monsters in attack order, enter each rune SPD, and enable the leader, Swift, buffs, or Attack Bar effects that apply. The result shows whether the sequence holds and the minimum additional SPD needed.',
        },
        {
          question: 'What does minimum additional SPD mean?',
          answer:
            'It is the minimum green SPD from runes needed for that monster under the configured conditions. Compare it with the additional SPD shown in the monster details screen in game.',
        },
        {
          question: 'Why are Siege, Arena, and RTA calculated differently?',
          answer:
            'Siege and Arena use 7% Attack Bar ticks in this calculator, while RTA uses 1.5% ticks. The different timing changes how closely one monster must follow another to avoid a cut.',
        },
        {
          question: 'Should I enter total SPD or only rune SPD?',
          answer:
            'Enter the additional SPD supplied by runes, often shown in green in game. The calculator already knows the selected monster base SPD and applies the configured bonuses separately.',
        },
        {
          question: 'How does a Swift set affect SPD tuning?',
          answer:
            'Swift adds a percentage based on the monster base SPD, so two monsters do not gain the same flat amount. Enable Swift only for the monsters actually using the four-piece set.',
        },
        {
          question: 'How is a Summoners War SPD leader skill applied?',
          answer:
            'Enable one eligible leader for the team. The bonus uses the leader skill percentage and content restriction, so a Guild leader should not be treated as active in Arena or RTA.',
        },
        {
          question:
            'Can the calculator include Attack Bar boosts and SPD buffs?',
          answer:
            'Yes, for supported monster effects. Configure the boost percentage, target, or SPD buff where the selected monster provides those options, and the later turns are recalculated from that effect.',
        },
        {
          question: 'What does it mean when a team gets cut?',
          answer:
            'A cut happens when another unit gains a turn between two monsters that were intended to move consecutively. This can break a combo by interrupting setup, immunity, control, or damage.',
        },
        {
          question: 'Does a successful speed tune guarantee the turn order?',
          answer:
            'No. Enemy speed, passives, resisted effects, cooldowns, Attack Bar manipulation, and battle-specific mechanics can still change the sequence. Use the result to validate your own team under the selected assumptions.',
        },
      ],
      relatedHeading: 'Check the speed assumptions',
      related: [
        { route: 'speedComparison', label: 'Compare structural SPD first' },
        { route: 'speedTick', label: 'Review SPD tick breakpoints' },
        { route: 'monsters', label: 'Check monster base SPD and skills' },
      ],
    },
    speedComparison: {
      heading: 'Compare Summoners War monster SPD before rune stats',
      intro: [
        'The SPD Comparison shows which of two Summoners War monsters starts with the structural speed advantage from base SPD, leader skill, SPD tower, Swift, and supported special cases. It isolates those factors before individual rune SPD.',
        'Use the difference to estimate how much more or less rune SPD one monster needs to move first. For a complete allied turn sequence, take the result into the SPD Tuning calculator.',
      ],
      faqHeading: 'Summoners War SPD comparison FAQ',
      faqIntro:
        'Understand what the comparison includes and how to read the speed advantage.',
      faqs: [
        {
          question: 'What does the Summoners War SPD Comparison calculate?',
          answer:
            'It compares two monsters after applying base SPD, the chosen speed leader, SPD tower, Swift set, and supported special modifiers. The result is the structural difference before ordinary rune SPD.',
        },
        {
          question: 'How is SPD Comparison different from SPD Tuning?',
          answer:
            'SPD Comparison analyzes a head-to-head structural race. SPD Tuning builds an allied sequence and checks whether later monsters follow the first one without being cut.',
        },
        {
          question: 'What is structural SPD?',
          answer:
            'Structural SPD is the speed produced by the monster base value and configured percentage bonuses before individual SPD substats and slot 2 SPD are added.',
        },
        {
          question: 'Does the comparison include SPD from runes?',
          answer:
            'It includes the Swift set percentage when enabled, but not the flat additional SPD from rune main stats or substats. The result tells you how much rune SPD advantage remains to be built.',
        },
        {
          question: 'How does Swift change the comparison?',
          answer:
            'Swift increases SPD from the monster base value. A faster-base monster gains more raw SPD from the same set, which can widen or reverse the structural difference.',
        },
        {
          question: 'Can I compare different SPD tower levels?',
          answer:
            'Yes. Each side has its own SPD tower percentage, which is useful when comparing accounts or testing how a tower upgrade changes the required rune gap.',
        },
        {
          question: 'Can each monster use a different speed leader skill?',
          answer:
            'Yes. Configure the valid leader for each side. Make sure the leader scope applies to the content you are modeling, because Arena, Guild, and global skills are not interchangeable.',
        },
        {
          question: 'Why does Chilling have an initial buffs option?',
          answer:
            'Chilling has a supported passive interaction that changes speed based on the initial buffs considered by the calculator. Other unlisted passives and in-battle changes are not automatically modeled.',
        },
        {
          question: 'What happens when both monsters tie in structural SPD?',
          answer:
            'A tie means neither side has a built-in advantage under the selected settings. A single point of additional rune SPD can then decide which monster reaches the higher combat speed.',
        },
        {
          question: 'How can I use the result when building runes?',
          answer:
            'Read the stated advantage or tolerance as the rune SPD gap you must overcome or can afford. Then verify the final team order in SPD Tuning because allied boosts and turn spacing add more constraints.',
        },
      ],
      relatedHeading: 'Continue the speed calculation',
      related: [
        { route: 'speedTuning', label: 'Tune the full team order' },
        { route: 'speedTick', label: 'Calculate Tick 4, 5, and 6' },
        { route: 'monsters', label: 'Explore Summoners War monster stats' },
      ],
    },
    speedTick: {
      heading: 'Calculate Summoners War SPD tick breakpoints',
      intro: [
        'Summoners War combat advances the Attack Bar in ticks. Select a monster to calculate the additional rune SPD needed to reach Tick 4, Tick 5, or Tick 6 with a chosen SPD tower, leader skill, and Swift set.',
        'The table separates base and percentage bonuses from the green SPD you need on runes. It is a breakpoint reference for planning builds; Attack Bar boosts, buffs, passives, and enemy effects can still change real combat timing.',
      ],
      faqHeading: 'Summoners War SPD Tick calculator FAQ',
      faqIntro:
        'Answers about combat ticks, speed breakpoints, and the bonus SPD result.',
      faqs: [
        {
          question: 'What is a speed tick in Summoners War?',
          answer:
            'A tick is a combat timing step in which monsters gain Attack Bar according to their combat speed. Reaching a faster breakpoint can reduce the number of ticks needed to receive the first turn.',
        },
        {
          question: 'What do Tick 4, Tick 5, and Tick 6 mean?',
          answer:
            'They describe receiving a turn after four, five, or six Attack Bar gain steps under the calculator model. A lower Tick number requires a higher combat speed breakpoint.',
        },
        {
          question: 'How do I use the Summoners War SPD Tick calculator?',
          answer:
            'Select a monster, set your SPD tower, choose a leader percentage or view all leaders, and enable Swift if equipped. The table then shows the additional rune SPD required for each Tick.',
        },
        {
          question: 'What is bonus SPD or green SPD?',
          answer:
            'It is the additional SPD supplied by runes and shown in green in the monster details screen. It is separate from base SPD and from percentage bonuses such as leader skills, towers, and Swift.',
        },
        {
          question: 'Why does monster base SPD matter for a Tick breakpoint?',
          answer:
            'Base SPD is the starting value and the basis for several percentage bonuses. Monsters with different base speeds can need different rune SPD even when they use the same leader, tower, and Swift set.',
        },
        {
          question: 'How does the SPD tower affect the required rune speed?',
          answer:
            'The tower adds a percentage based on base SPD. A higher tower level reduces the additional rune SPD needed to reach the same combat breakpoint.',
        },
        {
          question: 'Can I compare every Summoners War SPD leader?',
          answer:
            'Yes. Leave the leader filter on All to compare the available percentages in separate columns, or select one leader value to focus the table on your planned team.',
        },
        {
          question: 'Does the Swift rune set lower the Tick requirement?',
          answer:
            'Usually yes. Swift adds 25% of base SPD before the additional rune SPD is considered, so enabling it can substantially reduce the remaining green SPD requirement.',
        },
        {
          question: 'Why might the in-game turn happen at a different time?',
          answer:
            'Attack Bar boosts, SPD buffs or debuffs, passives, skill effects, enemy actions, and content-specific mechanics can alter timing. The calculator focuses on the selected static bonuses and breakpoint.',
        },
        {
          question: 'Which Tick breakpoint should I target for my monster?',
          answer:
            'Choose the breakpoint your team plan requires and your rune quality can support. Faster is not always better if it breaks an allied turn order, so cross-check the finished build with SPD Tuning.',
        },
      ],
      relatedHeading: 'Turn the breakpoint into a team plan',
      related: [
        { route: 'speedTuning', label: 'Check the complete turn order' },
        { route: 'speedComparison', label: 'Compare two monster speeds' },
        { route: 'monsters', label: 'Look up a monster base SPD' },
      ],
    },
  },
  'pt-BR': {
    home: {
      heading: 'Ferramentas de Summoners War para planejar cada turno',
      intro: [
        'O SW Help reúne ferramentas focadas em Summoners War: encontre counters de Siege, pesquise atributos e habilidades de monstros, compare SPD, ajuste a ordem do time e calcule breakpoints de Tick.',
        'Use cada calculadora para planejar e depois confirme no jogo as runas, os artefatos, as passivas e a situação da batalha. Cada ferramenta explica o que entra no cálculo para apoiar uma decisão consciente.',
      ],
      relatedHeading: 'Comece por uma ferramenta de Summoners War',
      related: [
        { route: 'siegeCounter', label: 'Encontrar counter de Siege' },
        { route: 'monsters', label: 'Pesquisar monstros de Summoners War' },
        { route: 'speedTuning', label: 'Ajustar a ordem de turno' },
        { route: 'speedComparison', label: 'Comparar a SPD de dois monstros' },
        { route: 'speedTick', label: 'Calcular breakpoints de Tick' },
      ],
    },
    siegeCounter: {
      heading: 'Como usar o Siege Counter de Summoners War',
      intro: [
        'Busque os nomes dos monstros inimigos para encontrar ideias de ofensiva cadastradas contra aquela defesa de Siege no Summoners War. Abra o resultado para conferir líder, sequência de turnos, runas, metas de atributos e a proposta do time.',
        'Um counter é um ponto de partida, não uma vitória garantida. Compare a qualidade das suas runas, artefatos, níveis de habilidade, torres e duplicatas disponíveis antes de usar a ofensiva no Siege.',
      ],
      faqHeading: 'Dúvidas sobre counters de Siege no Summoners War',
      faqIntro:
        'Respostas para encontrar e avaliar times de ofensiva contra defesas de Siege.',
      faqs: [
        {
          question:
            'Como encontrar counter para uma defesa de Siege no Summoners War?',
          answer:
            'Digite um ou mais nomes dos monstros inimigos na busca. O catálogo encontra defesas cadastradas sem depender da ordem dos nomes, e cada resultado abre as ideias de ofensiva disponíveis.',
        },
        {
          question: 'Posso buscar apenas um monstro da defesa?',
          answer:
            'Sim. A busca parcial ajuda quando você lembra apenas um ou dois monstros. Adicione mais nomes para restringir os resultados até encontrar a defesa exata do Siege.',
        },
        {
          question: 'Qual é a diferença entre torre 4★ e torre livre?',
          answer:
            'A torre 4★ limita a raridade natural dos monstros permitidos no Siege. A torre livre aceita opções mais amplas. Use o filtro de torre para ver composições compatíveis com a batalha que você está preparando.',
        },
        {
          question: 'Quais informações aparecem em um time de counter?',
          answer:
            'Quando disponíveis, a página mostra os três monstros da ofensiva, como jogar, conjuntos de runas, metas de atributos, SPD e sequência de ataque. A fonte é indicada quando o exemplo veio de uma referência externa.',
        },
        {
          question: 'Um counter de Summoners War cadastrado garante vitória?',
          answer:
            'Não. Eficiência de runas, artefatos, habilidades, IA, acertos críticos e decisões do jogador mudam o resultado. Exemplos sem validação competitiva são identificados como conteúdo demonstrativo.',
        },
        {
          question: 'Por que o primeiro monstro aparece à esquerda?',
          answer:
            'O primeiro monstro é o líder do time. A habilidade de líder dele é a considerada na composição da defesa ou ofensiva, o que também mantém a leitura dos times consistente.',
        },
        {
          question: 'Como interpretar a sequência de ataque recomendada?',
          answer:
            'A sequência indica a ordem de turno pretendida para a ofensiva. A ordem real depende da SPD de combate e dos efeitos de barra, então valide o time na calculadora de Spd Tuning antes da batalha.',
        },
        {
          question: 'Os conjuntos de runas sugeridos são obrigatórios?',
          answer:
            'Não. Eles descrevem a função esperada do exemplo. Outros conjuntos podem funcionar se preservarem a ordem de velocidade, sobrevivência, precisão, dano e os demais atributos importantes.',
        },
        {
          question: 'Posso usar o Siege Counter para planejar ataque e defesa?',
          answer:
            'Sim. O uso principal é encontrar ideias de ofensiva, mas estudar as respostas comuns também revela pontos fracos de uma defesa antes de montá-la ou colocá-la no mapa.',
        },
        {
          question: 'O que conferir antes de usar um counter de SW Siege?',
          answer:
            'Confira tipo de torre, liderança, runas, atributos mínimos, ordem de turno, artefatos e interações elementais. Veja também se o exemplo está marcado como demonstrativo e ainda não validado.',
        },
      ],
      relatedHeading: 'Planeje o restante da ofensiva',
      related: [
        { route: 'speedTuning', label: 'Ajustar a ordem da ofensiva' },
        { route: 'monsters', label: 'Pesquisar cada monstro de Summoners War' },
        { route: 'speedComparison', label: 'Comparar a SPD do primeiro turno' },
      ],
    },
    monsters: {
      heading: 'Explore a database de monstros de Summoners War',
      intro: [
        'Busque monstros obtíveis de Summoners War por nome ou família e filtre por elemento, estrelas naturais, habilidade de líder ou conteúdo. A ordenação por SPD base, HP, ATQ ou DEF permite comparar formas sem incluir runas.',
        'Cada página reúne atributos base no nível máximo, habilidades, liderança, evolução, formas de obtenção, membros da família e links para times de Siege que usam o monstro.',
      ],
      faqHeading: 'Dúvidas sobre monstros de Summoners War',
      faqIntro:
        'Entenda o que o catálogo inclui e como comparar monstros corretamente.',
      faqs: [
        {
          question: 'Como encontrar um monstro na database de Summoners War?',
          answer:
            'Busque pelo nome despertado ou pela família. Combine a busca com os filtros de elemento, estrelas naturais e liderança para restringir uma família grande à forma desejada.',
        },
        {
          question:
            'Posso filtrar monstros de Summoners War por elemento e estrelas?',
          answer:
            'Sim. O catálogo tem filtros de Fogo, Água, Vento, Luz e Trevas, além das raridades naturais de uma a cinco estrelas. Os filtros podem ser combinados e limpos a qualquer momento.',
        },
        {
          question: 'Quais atributos de monstro estão disponíveis?',
          answer:
            'As páginas mostram HP máximo, ATQ máximo, DEF máxima, SPD base, estrelas naturais, elemento e arquétipo quando a fonte fornece esses dados. São valores base, não a build de um jogador.',
        },
        {
          question: 'A SPD base inclui runas, torres ou liderança?',
          answer:
            'Não. A SPD base é o valor do monstro antes das runas, torre de SPD, habilidade de líder, Swift, buffs e da maioria dos efeitos de batalha. Use as ferramentas de velocidade para modelar esses bônus.',
        },
        {
          question:
            'Posso buscar monstros com uma habilidade de líder específica?',
          answer:
            'Sim. Filtre pelo atributo da liderança, como Velocidade de Ataque, HP ou Precisão, e pelo conteúdo em que ela funciona, como Arena, Guild ou todo o jogo.',
        },
        {
          question:
            'Quais informações de habilidade aparecem na página do monstro?',
          answer:
            'A página pode mostrar descrição, recarga, número de golpes, tags de passiva ou área, efeitos, chances de ativação, multiplicadores de dano e progressão dos upgrades quando esses campos estão disponíveis.',
        },
        {
          question: 'Monstros com segundo despertar estão incluídos?',
          answer:
            'Sim. Formas com segundo despertar podem aparecer como formas finais obtíveis e se conectam ao caminho de evolução para facilitar a comparação com outros estágios e membros da família.',
        },
        {
          question: 'Como comparar monstros da mesma família?',
          answer:
            'Abra os detalhes de um monstro e use a seção da família para visitar outros elementos ou formas. Para uma disputa direta de velocidade, selecione os dois no Comparador de SPD.',
        },
        {
          question: 'Posso ver onde um monstro é usado em times de Siege?',
          answer:
            'Sim. Quando o monstro aparece em uma defesa ou ofensiva cadastrada, a página dele inclui links para essas entradas do Siege Counter.',
        },
        {
          question: 'De onde vêm os dados dos monstros de Summoners War?',
          answer:
            'O catálogo importa informações de monstros e habilidades do SWARFARM e exibe a data da importação. Retratos e personagens pertencem à Com2uS; o SW Help é um projeto independente da comunidade.',
        },
      ],
      relatedHeading: 'Use os dados em uma calculadora',
      related: [
        { route: 'siegeCounter', label: 'Encontrar times de Siege' },
        { route: 'speedComparison', label: 'Comparar a SPD base' },
        { route: 'speedTuning', label: 'Montar uma ordem de turno' },
        { route: 'speedTick', label: 'Calcular breakpoints de Tick' },
      ],
    },
    speedTuning: {
      heading: 'Spd Tuning de Summoners War para Siege, Arena e RTA',
      intro: [
        'Spd Tuning ajusta um time de Summoners War para que os aliados atuem na ordem planejada sem abrir um corte evitável para o inimigo. Adicione os monstros do primeiro ao último, informe a SPD das runas e configure os bônus que alteram a velocidade de combate.',
        'A calculadora considera o ritmo de Siege, Arena e RTA, além de liderança, Swift, torre de SPD, boosts de barra e efeitos de SPD compatíveis. Use o mínimo como meta matemática e ainda considere interrupções e efeitos não modelados.',
      ],
      faqHeading: 'Dúvidas sobre Spd Tuning no Summoners War',
      faqIntro:
        'Respostas sobre ajuste de velocidade e prevenção de cortes na ordem do time.',
      faqs: [
        {
          question: 'O que é Spd Tuning no Summoners War?',
          answer:
            'Spd Tuning é o ajuste das velocidades para que um time atue na sequência planejada. Um bom ajuste reduz a chance de o inimigo jogar entre a preparação, o controle e o dano da sua equipe.',
        },
        {
          question: 'Como usar a calculadora de speed tuning de Summoners War?',
          answer:
            'Escolha Siege, Arena ou RTA, adicione os monstros na ordem de ataque, informe a SPD das runas e ative liderança, Swift, buffs ou barra aplicáveis. O resultado verifica a sequência e mostra a SPD adicional mínima.',
        },
        {
          question: 'O que significa SPD adicional mínima?',
          answer:
            'É o bônus mínimo de velocidade que as runas precisam fornecer ao monstro nas condições configuradas. Compare o resultado com a SPD adicional exibida nos detalhes do monstro dentro do jogo.',
        },
        {
          question: 'Por que Siege, Arena e RTA têm cálculos diferentes?',
          answer:
            'Siege e Arena usam ticks de barra de 7% nesta calculadora, enquanto o RTA usa ticks de 1,5%. Essa diferença muda a proximidade necessária entre as velocidades para evitar um corte.',
        },
        {
          question: 'Devo informar a SPD total ou apenas a SPD das runas?',
          answer:
            'Informe a SPD adicional fornecida pelas runas, normalmente exibida em verde no jogo. A calculadora já conhece a SPD base do monstro e aplica os bônus configurados separadamente.',
        },
        {
          question: 'Como o conjunto Swift afeta o Spd Tuning?',
          answer:
            'Swift adiciona uma porcentagem baseada na SPD base, então dois monstros não recebem o mesmo valor plano. Ative Swift apenas nos monstros que realmente usam o conjunto de quatro peças.',
        },
        {
          question: 'Como a liderança de SPD é aplicada?',
          answer:
            'Ative um líder elegível para o time. O bônus respeita a porcentagem e a restrição de conteúdo, portanto uma liderança de Guild não deve ser considerada ativa na Arena ou no RTA.',
        },
        {
          question: 'A calculadora inclui boosts de barra e buffs de SPD?',
          answer:
            'Sim, para efeitos de monstros compatíveis. Configure a porcentagem, o alvo ou o buff quando essas opções aparecerem, e os turnos seguintes serão recalculados com o efeito.',
        },
        {
          question: 'O que significa ser cortado em Summoners War?',
          answer:
            'Um corte acontece quando outra unidade ganha turno entre dois monstros que deveriam jogar em sequência. Isso pode interromper a preparação, imunidade, controle ou dano de um combo.',
        },
        {
          question: 'Um speed tuning aprovado garante a ordem dos turnos?',
          answer:
            'Não. Velocidade inimiga, passivas, resistências, recargas, manipulação de barra e mecânicas específicas ainda podem alterar a sequência. O resultado valida o seu time dentro das premissas selecionadas.',
        },
      ],
      relatedHeading: 'Confira as premissas de velocidade',
      related: [
        {
          route: 'speedComparison',
          label: 'Comparar primeiro a SPD estrutural',
        },
        { route: 'speedTick', label: 'Revisar breakpoints de Tick' },
        { route: 'monsters', label: 'Conferir SPD base e habilidades' },
      ],
    },
    speedComparison: {
      heading: 'Compare a SPD de monstros de Summoners War antes das runas',
      intro: [
        'O Comparador de SPD mostra qual de dois monstros de Summoners War começa com vantagem estrutural de velocidade por SPD base, liderança, torre, Swift e casos especiais compatíveis. Esses fatores são isolados antes da SPD individual das runas.',
        'Use a diferença para estimar quanto de SPD de runa um monstro precisa ganhar ou pode perder e ainda agir primeiro. Para ajustar uma sequência aliada completa, leve o resultado ao Spd Tuning.',
      ],
      faqHeading: 'Dúvidas sobre comparação de SPD no Summoners War',
      faqIntro:
        'Entenda o que entra no cálculo e como interpretar a vantagem de velocidade.',
      faqs: [
        {
          question: 'O que o Comparador de SPD de Summoners War calcula?',
          answer:
            'Ele compara dois monstros após aplicar SPD base, liderança escolhida, torre de SPD, conjunto Swift e modificadores especiais compatíveis. O resultado é a diferença estrutural antes da SPD comum das runas.',
        },
        {
          question: 'Qual é a diferença entre Comparador de SPD e Spd Tuning?',
          answer:
            'O Comparador de SPD analisa uma disputa estrutural direta. O Spd Tuning monta uma sequência aliada e verifica se os monstros seguintes acompanham o primeiro sem serem cortados.',
        },
        {
          question: 'O que é SPD estrutural?',
          answer:
            'É a velocidade produzida pelo valor base do monstro e pelos bônus percentuais configurados antes de adicionar subatributos e o atributo principal de SPD do slot 2.',
        },
        {
          question: 'A comparação inclui SPD das runas?',
          answer:
            'Ela inclui a porcentagem do conjunto Swift quando ativado, mas não a SPD adicional plana dos atributos principais e subatributos. O resultado mostra a diferença que ainda precisa ser construída nas runas.',
        },
        {
          question: 'Como Swift muda a comparação de velocidade?',
          answer:
            'Swift aumenta a SPD a partir do valor base. Um monstro com base maior recebe mais pontos do mesmo conjunto, o que pode ampliar ou inverter a diferença estrutural.',
        },
        {
          question: 'Posso comparar níveis diferentes de torre de SPD?',
          answer:
            'Sim. Cada lado tem sua própria porcentagem de torre, útil para comparar contas ou testar como um upgrade altera a diferença de runas necessária.',
        },
        {
          question: 'Cada monstro pode usar uma liderança de SPD diferente?',
          answer:
            'Sim. Configure a liderança válida de cada lado e confirme que o escopo corresponde ao conteúdo, pois habilidades de Arena, Guild e globais não são equivalentes.',
        },
        {
          question: 'Por que Chilling tem uma opção de buffs iniciais?',
          answer:
            'Chilling possui uma interação passiva compatível que muda a velocidade conforme os buffs iniciais considerados. Outras passivas e mudanças de batalha não listadas não são modeladas automaticamente.',
        },
        {
          question:
            'O que acontece quando os monstros empatam em SPD estrutural?',
          answer:
            'O empate indica que nenhum lado tem vantagem própria nas configurações escolhidas. Um único ponto de SPD adicional das runas pode decidir qual monstro chega à maior velocidade de combate.',
        },
        {
          question: 'Como usar o resultado ao montar as runas?',
          answer:
            'Interprete a vantagem ou tolerância informada como a diferença de SPD de runa que você precisa superar ou pode ceder. Depois valide a ordem final no Spd Tuning, que considera outras restrições do time.',
        },
      ],
      relatedHeading: 'Continue o cálculo de velocidade',
      related: [
        { route: 'speedTuning', label: 'Ajustar a ordem completa do time' },
        { route: 'speedTick', label: 'Calcular Tick 4, Tick 5 e Tick 6' },
        { route: 'monsters', label: 'Explorar atributos dos monstros' },
      ],
    },
    speedTick: {
      heading: 'Calcule breakpoints de SPD Tick no Summoners War',
      intro: [
        'O combate de Summoners War avança a barra de ataque em ticks. Selecione um monstro para calcular a SPD adicional de runas necessária para atingir Tick 4, Tick 5 ou Tick 6 com a torre, liderança e Swift escolhidos.',
        'A tabela separa a base e os bônus percentuais da SPD verde exigida nas runas. Ela serve como referência de breakpoint; boosts de barra, buffs, passivas e efeitos inimigos ainda podem mudar o tempo real do combate.',
      ],
      faqHeading: 'Dúvidas sobre a calculadora de SPD Tick',
      faqIntro:
        'Respostas sobre ticks de combate, breakpoints de velocidade e SPD bônus.',
      faqs: [
        {
          question: 'O que é um Tick de velocidade no Summoners War?',
          answer:
            'Tick é uma etapa de tempo do combate em que os monstros ganham barra de ataque conforme a SPD de combate. Atingir um breakpoint mais rápido pode reduzir o número de ticks até o primeiro turno.',
        },
        {
          question: 'O que significam Tick 4, Tick 5 e Tick 6?',
          answer:
            'Eles representam receber um turno depois de quatro, cinco ou seis etapas de ganho de barra no modelo da calculadora. Um número de Tick menor exige um breakpoint maior de velocidade de combate.',
        },
        {
          question: 'Como usar a calculadora de SPD Tick de Summoners War?',
          answer:
            'Selecione o monstro, ajuste a torre de SPD, escolha uma liderança ou veja todas e ative Swift se estiver equipado. A tabela mostra a SPD adicional de runas necessária para cada Tick.',
        },
        {
          question: 'O que é SPD bônus ou SPD verde?',
          answer:
            'É a SPD adicional fornecida pelas runas e exibida em verde nos detalhes do monstro. Ela é separada da SPD base e dos bônus percentuais de liderança, torre e Swift.',
        },
        {
          question: 'Por que a SPD base muda o breakpoint de Tick?',
          answer:
            'A SPD base é o ponto de partida e a referência de vários bônus percentuais. Monstros com bases diferentes podem exigir valores distintos nas runas mesmo usando liderança, torre e Swift iguais.',
        },
        {
          question: 'Como a torre de SPD altera a velocidade necessária?',
          answer:
            'A torre adiciona uma porcentagem calculada sobre a SPD base. Uma torre mais alta reduz a SPD adicional de runas necessária para chegar ao mesmo breakpoint de combate.',
        },
        {
          question: 'Posso comparar todas as lideranças de SPD?',
          answer:
            'Sim. Mantenha o filtro em Todos para comparar as porcentagens disponíveis em colunas separadas ou selecione um valor para focar o time que você pretende montar.',
        },
        {
          question: 'O conjunto Swift reduz o requisito do Tick?',
          answer:
            'Normalmente, sim. Swift adiciona 25% da SPD base antes da SPD adicional das runas, então pode reduzir bastante o valor verde que falta para alcançar o breakpoint.',
        },
        {
          question: 'Por que o turno no jogo pode acontecer em outro momento?',
          answer:
            'Boosts de barra, buffs e debuffs de SPD, passivas, habilidades, ações inimigas e mecânicas do conteúdo alteram o tempo. A calculadora foca os bônus estáticos e o breakpoint selecionado.',
        },
        {
          question: 'Qual breakpoint de Tick devo buscar para meu monstro?',
          answer:
            'Escolha o breakpoint necessário para o plano do time e compatível com suas runas. Mais velocidade nem sempre é melhor se quebrar a ordem aliada, então confira a build final no Spd Tuning.',
        },
      ],
      relatedHeading: 'Transforme o breakpoint em plano de time',
      related: [
        { route: 'speedTuning', label: 'Conferir a ordem completa' },
        { route: 'speedComparison', label: 'Comparar a SPD de dois monstros' },
        { route: 'monsters', label: 'Consultar a SPD base do monstro' },
      ],
    },
  },
};
