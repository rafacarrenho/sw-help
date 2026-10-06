import type { Locale, RouteName } from '../i18n';

export type InstitutionalPageId = 'about' | 'contact' | 'privacy' | 'terms';

interface InstitutionalResource {
  label: string;
  href: string;
}

interface InstitutionalSection {
  heading: string;
  paragraphs: string[];
  items?: string[];
  resources?: InstitutionalResource[];
}

export interface InstitutionalPageContent {
  route: Extract<RouteName, InstitutionalPageId>;
  title: string;
  description: string;
  eyebrow: string;
  heading: string;
  intro: string;
  updated?: string;
  sections: InstitutionalSection[];
  email?: string;
}

type InstitutionalContent = Record<
  Locale,
  Record<InstitutionalPageId, InstitutionalPageContent>
>;

export const institutionalContent: InstitutionalContent = {
  en: {
    about: {
      route: 'about',
      title: 'About PlayerDojo',
      description:
        'Learn how PlayerDojo builds independent game tools, practical calculators, and reliable references for players.',
      eyebrow: 'ABOUT PLAYERDOJO',
      heading: 'Tools built to help players decide with confidence.',
      intro:
        'PlayerDojo is an independent community project that brings focused game tools, databases, and calculators into one clear portal.',
      sections: [
        {
          heading: 'Our purpose',
          paragraphs: [
            'Games often ask players to compare many small details before making a decision. PlayerDojo turns those details into practical tools that are quick to understand and useful during real planning.',
            'Summoners War is the first toolkit available on the site. The portal is designed to support additional games over time without mixing their data or context.',
          ],
        },
        {
          heading: 'How we work',
          paragraphs: [
            'We favor transparent calculations, clear limitations, readable interfaces, and source attribution. When content is demonstrative or has not been competitively validated, the site identifies it instead of presenting an invented success rate.',
          ],
          items: [
            'Calculators explain the values included in their results.',
            'Catalog pages identify external data sources and import dates when available.',
            'Corrections and feedback can be sent through the public contact channel.',
          ],
        },
        {
          heading: 'Independent project',
          paragraphs: [
            'PlayerDojo is not affiliated with, endorsed by, or sponsored by Com2uS or any other game publisher. Game names, characters, artwork, and trademarks belong to their respective owners.',
          ],
        },
      ],
    },
    contact: {
      route: 'contact',
      title: 'Contact PlayerDojo',
      description:
        'Contact PlayerDojo about tool feedback, data corrections, support, partnerships, privacy, or rights-related requests.',
      eyebrow: 'CONTACT',
      heading: 'Questions, corrections, and useful feedback are welcome.',
      intro:
        'Use the public email below for PlayerDojo support, content corrections, privacy questions, or other project-related requests.',
      email: 'contact@playerdojo.com',
      sections: [
        {
          heading: 'What to include',
          paragraphs: [
            'A clear subject and the URL of the relevant page help us understand and review your message.',
          ],
          items: [
            'Tool feedback or a reproducible calculation issue.',
            'Incorrect, outdated, or missing game data.',
            'Accessibility or usability problems.',
            'Privacy, trademark, copyright, or partnership requests.',
          ],
        },
        {
          heading: 'Before contacting us',
          paragraphs: [
            'PlayerDojo cannot provide account recovery, billing, or official game support. For those requests, contact the publisher or platform responsible for the game.',
            'Do not send passwords, game account credentials, payment details, or other sensitive information.',
          ],
        },
      ],
    },
    privacy: {
      route: 'privacy',
      title: 'Privacy Policy',
      description:
        'Understand how PlayerDojo uses analytics, cookies, local browser storage, external services, and contact information.',
      eyebrow: 'PRIVACY',
      heading: 'Clear choices and limited data collection.',
      intro:
        'PlayerDojo is designed to work without an account. This policy explains the limited information used to operate and improve the site.',
      updated: 'Last updated: October 6, 2026',
      sections: [
        {
          heading: 'Information the site uses',
          paragraphs: [
            'PlayerDojo does not offer user accounts and does not ask for names, passwords, payment details, or game credentials. The site may process standard technical request information needed to deliver pages securely, such as IP-derived network information, browser type, requested URL, and timestamps.',
            'Interface preferences, including navigation state and your advertising and analytics choices, may be stored locally in your browser. This information stays on your device unless a third-party service is separately enabled.',
          ],
        },
        {
          heading: 'Google Analytics',
          paragraphs: [
            'Google Analytics is loaded only after you accept analytics cookies. It helps us understand aggregated usage such as visited pages, device and browser category, approximate location, referral source, and interactions with the site.',
            'Until you agree, PlayerDojo does not load the Google Analytics script. After agreeing, you can reopen Cookie settings in the footer and disable analytics at any time.',
          ],
          resources: [
            {
              label: 'Google Privacy Policy',
              href: 'https://policies.google.com/privacy',
            },
            {
              label: 'Google Analytics opt-out browser add-on',
              href: 'https://tools.google.com/dlpage/gaoptout',
            },
          ],
        },
        {
          heading: 'Advertising',
          paragraphs: [
            'PlayerDojo may use Adsterra as its sole advertising provider. The privacy panel lets you choose between personalized advertising and contextual advertising, while analytics remains a separate optional choice.',
            'Personalized Adsterra advertising is loaded only after you select it. Contextual advertising is loaded only when Adsterra provides a documented mode that does not rely on non-essential device storage or identifiers. If that mode is not configured, no Adsterra request is made until personalized advertising is accepted.',
            'An advertising placement does not guarantee that an impression will be delivered. Network availability, inventory, browser settings, and content blockers may prevent an ad from appearing.',
          ],
          resources: [
            {
              label: 'Adsterra Cookie Policy',
              href: 'https://adsterra.com/cookies/',
            },
          ],
        },
        {
          heading: 'External data and hosting',
          paragraphs: [
            'The site is delivered through Cloudflare infrastructure. Some game-reference pages use data attributed to services such as SWARFARM and may link to external websites. External services have their own privacy practices and are responsible for their pages.',
          ],
        },
        {
          heading: 'Email contact',
          paragraphs: [
            'When you email PlayerDojo, the message and address you provide are used to review and respond to the request. Do not include sensitive account, payment, or authentication information.',
          ],
        },
        {
          heading: 'Changes and questions',
          paragraphs: [
            'This policy may be updated when the site, its tools, or its service providers change. Material updates will be reflected on this page. Privacy questions can be sent to contact@playerdojo.com.',
          ],
        },
      ],
    },
    terms: {
      route: 'terms',
      title: 'Terms of Use',
      description:
        'Review the terms that apply when using PlayerDojo game tools, calculators, catalogs, and reference content.',
      eyebrow: 'TERMS OF USE',
      heading: 'Use PlayerDojo as a planning aid.',
      intro:
        'By using PlayerDojo, you agree to use the site responsibly and understand the limitations described below.',
      updated: 'Last updated: October 6, 2026',
      sections: [
        {
          heading: 'Informational tools',
          paragraphs: [
            'PlayerDojo provides calculators, catalogs, examples, and planning references. Results depend on the information entered and on game mechanics that may change. Always confirm important decisions in the game itself.',
            'Counter ideas, builds, turn orders, and calculations do not guarantee a battle result, account outcome, or competitive performance.',
          ],
        },
        {
          heading: 'Acceptable use',
          paragraphs: [
            'You may use the public tools for personal planning and reference.',
          ],
          items: [
            'Do not interfere with the operation or security of the site.',
            'Do not use automated requests in a way that degrades access for others.',
            'Do not misrepresent PlayerDojo content as official publisher guidance.',
            'Do not use the service for unlawful activity or to violate third-party rights.',
          ],
        },
        {
          heading: 'Availability and accuracy',
          paragraphs: [
            'We aim to keep the site useful and accurate, but content may be incomplete, outdated, or temporarily unavailable. Features and data may be corrected, changed, or removed without notice.',
            'To the extent permitted by applicable law, PlayerDojo is provided as available without warranties of uninterrupted operation, absolute accuracy, or fitness for a particular competitive result.',
          ],
        },
        {
          heading: 'Third-party rights',
          paragraphs: [
            'PlayerDojo is an independent community project. Game names, characters, artwork, and trademarks belong to their respective owners. References to a game or publisher do not imply affiliation, endorsement, or sponsorship.',
          ],
        },
        {
          heading: 'Updates and contact',
          paragraphs: [
            'These terms may be updated as the project evolves. Continuing to use the site after an update means the current terms apply. Questions or rights-related requests can be sent to contact@playerdojo.com.',
          ],
        },
      ],
    },
  },
  'pt-BR': {
    about: {
      route: 'about',
      title: 'Sobre o PlayerDojo',
      description:
        'Conheça o PlayerDojo, um projeto independente de ferramentas, calculadoras e referências práticas para jogadores.',
      eyebrow: 'SOBRE O PLAYERDOJO',
      heading: 'Ferramentas feitas para ajudar jogadores a decidir melhor.',
      intro:
        'O PlayerDojo é um projeto independente da comunidade que reúne ferramentas, bancos de dados e calculadoras para jogos em um portal claro e objetivo.',
      sections: [
        {
          heading: 'Nosso propósito',
          paragraphs: [
            'Jogos frequentemente exigem que o jogador compare muitos detalhes antes de tomar uma decisão. O PlayerDojo transforma esses detalhes em ferramentas práticas, fáceis de entender e úteis no planejamento real.',
            'Summoners War é o primeiro conjunto de ferramentas disponível. O portal foi preparado para receber outros jogos no futuro sem misturar dados ou contextos.',
          ],
        },
        {
          heading: 'Como trabalhamos',
          paragraphs: [
            'Priorizamos cálculos transparentes, limitações claras, interfaces legíveis e atribuição de fontes. Quando um conteúdo é demonstrativo ou ainda não foi validado competitivamente, o site informa isso em vez de apresentar uma taxa de sucesso inventada.',
          ],
          items: [
            'As calculadoras explicam os valores considerados nos resultados.',
            'As páginas de catálogo identificam fontes externas e datas de importação quando disponíveis.',
            'Correções e sugestões podem ser enviadas pelo canal público de contato.',
          ],
        },
        {
          heading: 'Projeto independente',
          paragraphs: [
            'O PlayerDojo não é afiliado, endossado ou patrocinado pela Com2uS nem por outras publicadoras. Nomes de jogos, personagens, imagens e marcas pertencem aos respectivos proprietários.',
          ],
        },
      ],
    },
    contact: {
      route: 'contact',
      title: 'Contato do PlayerDojo',
      description:
        'Fale com o PlayerDojo sobre ferramentas, correções de dados, suporte, parcerias, privacidade ou direitos autorais.',
      eyebrow: 'CONTATO',
      heading: 'Dúvidas, correções e sugestões úteis são bem-vindas.',
      intro:
        'Use o e-mail público abaixo para suporte do PlayerDojo, correções de conteúdo, dúvidas de privacidade ou outras solicitações relacionadas ao projeto.',
      email: 'contact@playerdojo.com',
      sections: [
        {
          heading: 'O que incluir',
          paragraphs: [
            'Um assunto claro e a URL da página relacionada ajudam a entender e analisar sua mensagem.',
          ],
          items: [
            'Sugestões ou problemas reproduzíveis em uma calculadora.',
            'Dados de jogo incorretos, desatualizados ou ausentes.',
            'Problemas de acessibilidade ou usabilidade.',
            'Solicitações de privacidade, marca, direitos autorais ou parceria.',
          ],
        },
        {
          heading: 'Antes de entrar em contato',
          paragraphs: [
            'O PlayerDojo não oferece recuperação de conta, atendimento de cobrança ou suporte oficial de jogos. Para esses assuntos, procure a publicadora ou a plataforma responsável.',
            'Não envie senhas, credenciais de contas, dados de pagamento ou outras informações sensíveis.',
          ],
        },
      ],
    },
    privacy: {
      route: 'privacy',
      title: 'Política de Privacidade',
      description:
        'Entenda como o PlayerDojo usa analytics, cookies, armazenamento local, serviços externos e informações de contato.',
      eyebrow: 'PRIVACIDADE',
      heading: 'Escolhas claras e coleta limitada de dados.',
      intro:
        'O PlayerDojo foi feito para funcionar sem uma conta. Esta política explica as informações limitadas usadas para operar e melhorar o site.',
      updated: 'Última atualização: 6 de outubro de 2026',
      sections: [
        {
          heading: 'Informações utilizadas pelo site',
          paragraphs: [
            'O PlayerDojo não oferece contas de usuário e não solicita nomes, senhas, dados de pagamento ou credenciais de jogos. O site pode processar informações técnicas comuns necessárias para entregar as páginas com segurança, como informações de rede derivadas do IP, tipo de navegador, URL solicitada e horários de acesso.',
            'Preferências da interface, incluindo o estado da navegação e suas escolhas sobre publicidade e analytics, podem ser armazenadas localmente no navegador. Essas informações permanecem no dispositivo, salvo quando um serviço externo é habilitado separadamente.',
          ],
        },
        {
          heading: 'Google Analytics',
          paragraphs: [
            'O Google Analytics é carregado somente depois que você aceita os cookies analíticos. Ele ajuda a entender dados agregados como páginas visitadas, categoria de dispositivo e navegador, localização aproximada, origem da visita e interações com o site.',
            'Até você concordar, o PlayerDojo não carrega o script do Google Analytics. Depois de concordar, você pode abrir Preferências de cookies no rodapé e desativar o analytics a qualquer momento.',
          ],
          resources: [
            {
              label: 'Política de Privacidade do Google',
              href: 'https://policies.google.com/privacy?hl=pt-BR',
            },
            {
              label: 'Extensão de desativação do Google Analytics',
              href: 'https://tools.google.com/dlpage/gaoptout?hl=pt-BR',
            },
          ],
        },
        {
          heading: 'Publicidade',
          paragraphs: [
            'O PlayerDojo pode utilizar a Adsterra como seu único provedor de publicidade. O painel de privacidade permite escolher entre anúncios personalizados e anúncios contextuais, enquanto o analytics permanece uma escolha opcional separada.',
            'A publicidade personalizada da Adsterra é carregada somente depois que você a seleciona. A publicidade contextual é carregada apenas quando a Adsterra fornece um modo documentado que não dependa de armazenamento não essencial ou identificadores no dispositivo. Se esse modo não estiver configurado, nenhuma solicitação à Adsterra será feita até a aceitação dos anúncios personalizados.',
            'Um espaço publicitário não garante que uma impressão será entregue. Disponibilidade da rede, inventário, configurações do navegador e bloqueadores de conteúdo podem impedir a exibição do anúncio.',
          ],
          resources: [
            {
              label: 'Política de Cookies da Adsterra',
              href: 'https://adsterra.com/cookies/',
            },
          ],
        },
        {
          heading: 'Dados externos e hospedagem',
          paragraphs: [
            'O site é entregue pela infraestrutura da Cloudflare. Algumas páginas de referência usam dados atribuídos a serviços como o SWARFARM e podem conter links para sites externos. Serviços externos possuem práticas próprias de privacidade e são responsáveis por suas páginas.',
          ],
        },
        {
          heading: 'Contato por e-mail',
          paragraphs: [
            'Quando você envia um e-mail ao PlayerDojo, a mensagem e o endereço informado são usados para analisar e responder à solicitação. Não inclua dados sensíveis de contas, pagamentos ou autenticação.',
          ],
        },
        {
          heading: 'Alterações e dúvidas',
          paragraphs: [
            'Esta política pode ser atualizada quando o site, suas ferramentas ou seus provedores mudarem. Atualizações relevantes serão registradas nesta página. Dúvidas sobre privacidade podem ser enviadas para contact@playerdojo.com.',
          ],
        },
      ],
    },
    terms: {
      route: 'terms',
      title: 'Termos de Uso',
      description:
        'Consulte os termos aplicáveis ao uso das ferramentas, calculadoras, catálogos e referências do PlayerDojo.',
      eyebrow: 'TERMOS DE USO',
      heading: 'Use o PlayerDojo como apoio ao planejamento.',
      intro:
        'Ao usar o PlayerDojo, você concorda em utilizar o site de forma responsável e reconhece as limitações descritas abaixo.',
      updated: 'Última atualização: 6 de outubro de 2026',
      sections: [
        {
          heading: 'Ferramentas informativas',
          paragraphs: [
            'O PlayerDojo fornece calculadoras, catálogos, exemplos e referências de planejamento. Os resultados dependem das informações inseridas e de mecânicas que podem mudar. Sempre confirme decisões importantes dentro do próprio jogo.',
            'Ideias de counters, builds, ordens de turno e cálculos não garantem resultados de batalha, conta ou desempenho competitivo.',
          ],
        },
        {
          heading: 'Uso aceitável',
          paragraphs: [
            'Você pode usar as ferramentas públicas para planejamento e consulta pessoal.',
          ],
          items: [
            'Não interfira no funcionamento ou na segurança do site.',
            'Não faça requisições automatizadas que prejudiquem o acesso de outras pessoas.',
            'Não apresente o conteúdo do PlayerDojo como orientação oficial de uma publicadora.',
            'Não use o serviço para atividades ilegais ou para violar direitos de terceiros.',
          ],
        },
        {
          heading: 'Disponibilidade e precisão',
          paragraphs: [
            'Buscamos manter o site útil e correto, mas o conteúdo pode estar incompleto, desatualizado ou temporariamente indisponível. Ferramentas e dados podem ser corrigidos, alterados ou removidos sem aviso.',
            'Na extensão permitida pela legislação aplicável, o PlayerDojo é oferecido conforme disponível, sem garantias de operação ininterrupta, precisão absoluta ou adequação a um resultado competitivo específico.',
          ],
        },
        {
          heading: 'Direitos de terceiros',
          paragraphs: [
            'O PlayerDojo é um projeto independente da comunidade. Nomes de jogos, personagens, imagens e marcas pertencem aos respectivos proprietários. A referência a um jogo ou publicadora não representa afiliação, endosso ou patrocínio.',
          ],
        },
        {
          heading: 'Atualizações e contato',
          paragraphs: [
            'Estes termos podem ser atualizados conforme o projeto evolui. Ao continuar usando o site depois de uma atualização, passam a valer os termos atuais. Dúvidas ou solicitações relacionadas a direitos podem ser enviadas para contact@playerdojo.com.',
          ],
        },
      ],
    },
  },
};
