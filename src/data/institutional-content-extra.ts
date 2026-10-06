import type {
  InstitutionalPageContent,
  InstitutionalPageId,
} from './institutional-content';

type LocaleInstitutionalContent = Record<
  InstitutionalPageId,
  InstitutionalPageContent
>;

export const institutionalContentEs: LocaleInstitutionalContent = {
  about: {
    route: 'about',
    title: 'Acerca de PlayerDojo',
    description:
      'Conoce cómo PlayerDojo crea herramientas, calculadoras y referencias independientes para jugadores.',
    eyebrow: 'ACERCA DE PLAYERDOJO',
    heading: 'Herramientas para tomar decisiones con confianza.',
    intro:
      'PlayerDojo es un proyecto independiente de la comunidad que reúne herramientas, bases de datos y calculadoras de juegos en un portal claro.',
    sections: [
      {
        heading: 'Nuestro objetivo',
        paragraphs: [
          'Los juegos suelen exigir comparar muchos detalles antes de tomar una decisión. PlayerDojo transforma esos detalles en herramientas prácticas y fáciles de consultar.',
          'Summoners War es la primera colección del sitio. El portal está preparado para incorporar otros juegos sin mezclar datos ni contexto.',
        ],
      },
      {
        heading: 'Cómo trabajamos',
        paragraphs: [
          'Priorizamos cálculos explicables, fuentes identificadas y límites claros. Cuando un contenido es demostrativo o no está validado competitivamente, lo indicamos.',
          'Los datos de monstruos y habilidades se importan de SWARFARM y permanecen en inglés. Los textos propios de PlayerDojo se localizan para cada idioma.',
        ],
      },
      {
        heading: 'Proyecto independiente',
        paragraphs: [
          'PlayerDojo no está afiliado, patrocinado ni respaldado por Com2uS. Los nombres, personajes, imágenes y marcas pertenecen a sus respectivos propietarios.',
        ],
      },
    ],
  },
  contact: {
    route: 'contact',
    title: 'Contacto con PlayerDojo',
    description:
      'Contacta con PlayerDojo para informar de errores, sugerir mejoras o tratar cuestiones de privacidad y derechos.',
    eyebrow: 'CONTACTO',
    heading: 'Ayúdanos a mejorar las herramientas.',
    intro:
      'Envía correcciones, comentarios, consultas de privacidad o solicitudes relacionadas con derechos al correo público del proyecto.',
    email: 'contact@playerdojo.com',
    sections: [
      {
        heading: 'Qué incluir',
        paragraphs: [
          'Indica la página o herramienta, describe lo que observaste y añade los pasos necesarios para reproducir el problema. No envíes contraseñas, claves ni exportaciones privadas de tu cuenta.',
        ],
      },
      {
        heading: 'Consultas sobre privacidad y derechos',
        paragraphs: [
          'Usa el mismo correo para solicitudes relacionadas con privacidad, propiedad intelectual o contenido atribuido incorrectamente. Incluye información suficiente para identificar el material.',
        ],
      },
    ],
  },
  privacy: {
    route: 'privacy',
    title: 'Política de privacidad',
    description:
      'Consulta cómo PlayerDojo utiliza analytics, almacenamiento del navegador, publicidad y datos de contacto.',
    eyebrow: 'PRIVACIDAD',
    heading: 'Privacidad clara y opciones bajo tu control.',
    intro:
      'Esta política explica qué tecnologías puede usar PlayerDojo, para qué se utilizan y cómo cambiar tus preferencias.',
    updated: 'Actualizada el 6 de octubre de 2026',
    sections: [
      {
        heading: 'Datos que tratamos',
        paragraphs: [
          'PlayerDojo no exige una cuenta. El alojamiento puede procesar datos técnicos habituales, como dirección IP, dispositivo, navegador, página solicitada y hora de acceso, para entregar y proteger el sitio.',
          'Si nos escribes, tratamos tu dirección de correo y el contenido del mensaje para responder a la solicitud.',
        ],
      },
      {
        heading: 'Almacenamiento local y cookies',
        paragraphs: [
          'Las preferencias de interfaz y privacidad pueden guardarse en el navegador. Permanecen en tu dispositivo salvo que actives por separado un servicio externo.',
          'Puedes reabrir la configuración de cookies desde el pie de página y modificar tus elecciones en cualquier momento.',
        ],
      },
      {
        heading: 'Google Analytics',
        paragraphs: [
          'Google Analytics solo se carga después de aceptar analytics. Nos ayuda a entender de forma agregada las páginas visitadas, dispositivos, ubicación aproximada, fuentes de referencia e interacciones.',
          'PlayerDojo activa la anonimización de IP y no intenta identificar personalmente a los visitantes mediante estos informes.',
        ],
        resources: [
          {
            label: 'Política de privacidad de Google',
            href: 'https://policies.google.com/privacy?hl=es',
          },
          {
            label: 'Complemento de inhabilitación de Google Analytics',
            href: 'https://tools.google.com/dlpage/gaoptout?hl=es',
          },
        ],
      },
      {
        heading: 'Publicidad de Adsterra',
        paragraphs: [
          'PlayerDojo puede usar Adsterra como único proveedor de publicidad. El panel de privacidad permite elegir entre publicidad personalizada y contextual, por separado de analytics.',
          'Cuando se activa publicidad, Adsterra puede tratar datos técnicos y utilizar sus propias tecnologías según sus políticas.',
        ],
        resources: [
          {
            label: 'Política de privacidad de Adsterra',
            href: 'https://adsterra.com/privacy-policy/',
          },
        ],
      },
      {
        heading: 'Tus opciones y contacto',
        paragraphs: [
          'Puedes rechazar tecnologías opcionales, borrar el almacenamiento del navegador o usar controles de privacidad del navegador. Para consultas o solicitudes, escribe a contact@playerdojo.com.',
        ],
      },
    ],
  },
  terms: {
    route: 'terms',
    title: 'Términos de uso',
    description:
      'Consulta las condiciones para utilizar las herramientas, calculadoras y referencias de PlayerDojo.',
    eyebrow: 'TÉRMINOS',
    heading: 'Usa las herramientas como ayuda para planificar.',
    intro:
      'Al acceder a PlayerDojo aceptas utilizar el sitio de forma responsable y comprender los límites de sus resultados.',
    updated: 'Actualizados el 6 de octubre de 2026',
    sections: [
      {
        heading: 'Ayuda informativa',
        paragraphs: [
          'PlayerDojo ofrece calculadoras, catálogos, ejemplos y referencias. Los resultados dependen de los datos introducidos y de mecánicas que pueden cambiar. Confirma siempre las decisiones importantes dentro del juego.',
          'Los counters, builds, órdenes de turno y cálculos no garantizan resultados de batalla ni rendimiento competitivo.',
        ],
      },
      {
        heading: 'Uso aceptable',
        paragraphs: [
          'Puedes usar las herramientas públicas para consulta y planificación personal.',
        ],
        items: [
          'No interfieras con el funcionamiento o la seguridad del sitio.',
          'No realices solicitudes automatizadas que perjudiquen el acceso de otros usuarios.',
          'No presentes el contenido de PlayerDojo como información oficial de una editora.',
          'No uses el servicio para actividades ilegales o para vulnerar derechos de terceros.',
        ],
      },
      {
        heading: 'Disponibilidad y precisión',
        paragraphs: [
          'Intentamos mantener el sitio útil y correcto, pero el contenido puede estar incompleto, desactualizado o temporalmente indisponible. Las herramientas pueden cambiar sin previo aviso.',
        ],
      },
      {
        heading: 'Derechos de terceros y contacto',
        paragraphs: [
          'PlayerDojo es un proyecto independiente. Los nombres, personajes, imágenes y marcas pertenecen a sus respectivos propietarios. Escribe a contact@playerdojo.com para consultas relacionadas con derechos.',
        ],
      },
    ],
  },
};

export const institutionalContentFr: LocaleInstitutionalContent = {
  about: {
    route: 'about',
    title: 'À propos de PlayerDojo',
    description:
      'Découvrez comment PlayerDojo crée des outils, calculateurs et références indépendants pour les joueurs.',
    eyebrow: 'À PROPOS DE PLAYERDOJO',
    heading: 'Des outils pour décider avec confiance.',
    intro:
      'PlayerDojo est un projet communautaire indépendant qui rassemble outils, bases de données et calculateurs dans un portail clair.',
    sections: [
      {
        heading: 'Notre objectif',
        paragraphs: [
          'Les jeux demandent souvent de comparer de nombreux détails avant de décider. PlayerDojo transforme ces détails en outils pratiques et rapides à consulter.',
          'Summoners War est la première collection du site. Le portail peut accueillir d’autres jeux sans mélanger leurs données ni leur contexte.',
        ],
      },
      {
        heading: 'Notre méthode',
        paragraphs: [
          'Nous privilégions les calculs explicables, les sources identifiées et des limites claires. Les contenus de démonstration ou non validés en compétition sont signalés.',
          'Les données de monstres et de compétences sont importées de SWARFARM et restent en anglais. Les textes propres à PlayerDojo sont localisés.',
        ],
      },
      {
        heading: 'Projet indépendant',
        paragraphs: [
          'PlayerDojo n’est ni affilié, ni sponsorisé, ni approuvé par Com2uS. Les noms, personnages, images et marques appartiennent à leurs propriétaires respectifs.',
        ],
      },
    ],
  },
  contact: {
    route: 'contact',
    title: 'Contacter PlayerDojo',
    description:
      'Contactez PlayerDojo pour signaler une erreur, suggérer une amélioration ou poser une question de confidentialité ou de droits.',
    eyebrow: 'CONTACT',
    heading: 'Aidez-nous à améliorer les outils.',
    intro:
      'Envoyez corrections, commentaires, demandes de confidentialité ou questions de droits à l’adresse publique du projet.',
    email: 'contact@playerdojo.com',
    sections: [
      {
        heading: 'Informations utiles',
        paragraphs: [
          'Indiquez la page ou l’outil, décrivez ce que vous avez observé et ajoutez les étapes pour reproduire le problème. N’envoyez jamais de mot de passe, de clé ou d’export privé de compte.',
        ],
      },
      {
        heading: 'Confidentialité et droits',
        paragraphs: [
          'Utilisez la même adresse pour les demandes relatives à la confidentialité, à la propriété intellectuelle ou à une attribution incorrecte. Fournissez assez d’informations pour identifier le contenu.',
        ],
      },
    ],
  },
  privacy: {
    route: 'privacy',
    title: 'Politique de confidentialité',
    description:
      'Découvrez comment PlayerDojo utilise analytics, stockage du navigateur, publicité et données de contact.',
    eyebrow: 'CONFIDENTIALITÉ',
    heading: 'Une confidentialité claire et des choix sous votre contrôle.',
    intro:
      'Cette politique explique les technologies que PlayerDojo peut utiliser, leur objectif et la façon de modifier vos préférences.',
    updated: 'Mise à jour le 6 octobre 2026',
    sections: [
      {
        heading: 'Données traitées',
        paragraphs: [
          'PlayerDojo ne demande pas de compte. L’hébergement peut traiter les données techniques habituelles — adresse IP, appareil, navigateur, page et heure — pour livrer et protéger le site.',
          'Si vous nous écrivez, nous traitons votre adresse e-mail et votre message afin de répondre.',
        ],
      },
      {
        heading: 'Stockage local et cookies',
        paragraphs: [
          'Les préférences d’interface et de confidentialité peuvent être conservées dans votre navigateur. Elles restent sur votre appareil sauf activation séparée d’un service externe.',
          'Vous pouvez rouvrir les paramètres des cookies depuis le pied de page et modifier vos choix à tout moment.',
        ],
      },
      {
        heading: 'Google Analytics',
        paragraphs: [
          'Google Analytics n’est chargé qu’après votre accord. Il nous aide à comprendre de manière agrégée les pages visitées, appareils, localisation approximative, sources et interactions.',
          'PlayerDojo active l’anonymisation IP et ne cherche pas à identifier personnellement les visiteurs.',
        ],
        resources: [
          {
            label: 'Politique de confidentialité de Google',
            href: 'https://policies.google.com/privacy?hl=fr',
          },
          {
            label: 'Module de désactivation de Google Analytics',
            href: 'https://tools.google.com/dlpage/gaoptout?hl=fr',
          },
        ],
      },
      {
        heading: 'Publicité Adsterra',
        paragraphs: [
          'PlayerDojo peut utiliser Adsterra comme seul fournisseur de publicité. Le panneau permet de choisir publicité personnalisée ou contextuelle, séparément d’analytics.',
          'Lorsque la publicité est activée, Adsterra peut traiter des données techniques et utiliser ses propres technologies selon ses politiques.',
        ],
        resources: [
          {
            label: 'Politique de confidentialité d’Adsterra',
            href: 'https://adsterra.com/privacy-policy/',
          },
        ],
      },
      {
        heading: 'Vos choix et contact',
        paragraphs: [
          'Vous pouvez refuser les technologies facultatives, effacer le stockage du navigateur ou utiliser ses contrôles de confidentialité. Écrivez à contact@playerdojo.com pour toute demande.',
        ],
      },
    ],
  },
  terms: {
    route: 'terms',
    title: 'Conditions d’utilisation',
    description:
      'Consultez les conditions d’utilisation des outils, calculateurs et références PlayerDojo.',
    eyebrow: 'CONDITIONS',
    heading: 'Utilisez les outils comme aide à la planification.',
    intro:
      'En accédant à PlayerDojo, vous acceptez d’utiliser le site de manière responsable et de comprendre les limites de ses résultats.',
    updated: 'Mise à jour le 6 octobre 2026',
    sections: [
      {
        heading: 'Aide informative',
        paragraphs: [
          'PlayerDojo fournit calculateurs, catalogues, exemples et références. Les résultats dépendent des données saisies et de mécaniques susceptibles de changer. Vérifiez les décisions importantes dans le jeu.',
          'Counters, builds, ordres de jeu et calculs ne garantissent aucun résultat de combat ou de compétition.',
        ],
      },
      {
        heading: 'Utilisation acceptable',
        paragraphs: [
          'Vous pouvez utiliser les outils publics pour votre planification personnelle.',
        ],
        items: [
          'Ne perturbez pas le fonctionnement ou la sécurité du site.',
          'N’effectuez pas de requêtes automatisées qui nuisent à l’accès des autres.',
          'Ne présentez pas PlayerDojo comme une source officielle de l’éditeur.',
          'N’utilisez pas le service pour des activités illégales ou portant atteinte aux droits de tiers.',
        ],
      },
      {
        heading: 'Disponibilité et précision',
        paragraphs: [
          'Nous cherchons à garder le site utile et correct, mais le contenu peut être incomplet, obsolète ou temporairement indisponible. Les outils peuvent évoluer sans préavis.',
        ],
      },
      {
        heading: 'Droits de tiers et contact',
        paragraphs: [
          'PlayerDojo est un projet indépendant. Les noms, personnages, images et marques appartiennent à leurs propriétaires. Écrivez à contact@playerdojo.com pour les questions de droits.',
        ],
      },
    ],
  },
};

export const institutionalContentDe: LocaleInstitutionalContent = {
  about: {
    route: 'about',
    title: 'Über PlayerDojo',
    description:
      'Erfahre, wie PlayerDojo unabhängige Spieltools, Rechner und Referenzen entwickelt.',
    eyebrow: 'ÜBER PLAYERDOJO',
    heading: 'Tools für sichere Entscheidungen.',
    intro:
      'PlayerDojo ist ein unabhängiges Community-Projekt, das Spieltools, Datenbanken und Rechner in einem übersichtlichen Portal bündelt.',
    sections: [
      {
        heading: 'Unser Ziel',
        paragraphs: [
          'Spiele verlangen oft den Vergleich vieler kleiner Details. PlayerDojo verwandelt diese Details in praktische, schnell verständliche Werkzeuge.',
          'Summoners War ist die erste Sammlung auf der Website. Das Portal kann weitere Spiele aufnehmen, ohne Daten oder Kontext zu vermischen.',
        ],
      },
      {
        heading: 'Unsere Arbeitsweise',
        paragraphs: [
          'Wir setzen auf nachvollziehbare Berechnungen, benannte Quellen und klare Grenzen. Demonstrationsinhalte oder nicht wettbewerblich geprüfte Beispiele werden gekennzeichnet.',
          'Monster- und Skilldaten werden aus SWARFARM importiert und bleiben auf Englisch. PlayerDojo-eigene Texte werden lokalisiert.',
        ],
      },
      {
        heading: 'Unabhängiges Projekt',
        paragraphs: [
          'PlayerDojo ist nicht mit Com2uS verbunden, gesponsert oder unterstützt. Namen, Charaktere, Bilder und Marken gehören ihren jeweiligen Eigentümern.',
        ],
      },
    ],
  },
  contact: {
    route: 'contact',
    title: 'PlayerDojo kontaktieren',
    description:
      'Melde Fehler, schlage Verbesserungen vor oder kontaktiere PlayerDojo zu Datenschutz und Rechten.',
    eyebrow: 'KONTAKT',
    heading: 'Hilf uns, die Tools zu verbessern.',
    intro:
      'Sende Korrekturen, Feedback, Datenschutzanfragen oder rechtliche Anliegen an die öffentliche Projektadresse.',
    email: 'contact@playerdojo.com',
    sections: [
      {
        heading: 'Hilfreiche Angaben',
        paragraphs: [
          'Nenne die Seite oder das Tool, beschreibe deine Beobachtung und füge Schritte zur Reproduktion hinzu. Sende keine Passwörter, Schlüssel oder privaten Kontoexporte.',
        ],
      },
      {
        heading: 'Datenschutz und Rechte',
        paragraphs: [
          'Nutze dieselbe Adresse für Datenschutz-, Urheberrechts- oder Zuordnungsanfragen. Gib genügend Informationen an, um das Material zu identifizieren.',
        ],
      },
    ],
  },
  privacy: {
    route: 'privacy',
    title: 'Datenschutzerklärung',
    description:
      'Erfahre, wie PlayerDojo Analytics, Browserspeicher, Werbung und Kontaktdaten verwendet.',
    eyebrow: 'DATENSCHUTZ',
    heading: 'Klare Privatsphäre und Entscheidungen unter deiner Kontrolle.',
    intro:
      'Diese Erklärung beschreibt mögliche Technologien, ihren Zweck und wie du deine Einstellungen änderst.',
    updated: 'Aktualisiert am 6. Oktober 2026',
    sections: [
      {
        heading: 'Verarbeitete Daten',
        paragraphs: [
          'PlayerDojo verlangt kein Konto. Der Hostingdienst kann übliche technische Daten wie IP-Adresse, Gerät, Browser, Seite und Zugriffszeit verarbeiten, um die Website bereitzustellen und zu schützen.',
          'Wenn du uns schreibst, verarbeiten wir deine E-Mail-Adresse und Nachricht zur Beantwortung.',
        ],
      },
      {
        heading: 'Lokaler Speicher und Cookies',
        paragraphs: [
          'Oberflächen- und Datenschutzeinstellungen können im Browser gespeichert werden. Sie bleiben auf deinem Gerät, sofern du keinen externen Dienst separat aktivierst.',
          'Du kannst die Cookie-Einstellungen im Footer jederzeit erneut öffnen und deine Auswahl ändern.',
        ],
      },
      {
        heading: 'Google Analytics',
        paragraphs: [
          'Google Analytics wird nur nach deiner Zustimmung geladen. Es hilft uns, besuchte Seiten, Geräte, ungefähre Region, Verweise und Interaktionen zusammengefasst zu verstehen.',
          'PlayerDojo aktiviert die IP-Anonymisierung und versucht nicht, Besucher über diese Berichte persönlich zu identifizieren.',
        ],
        resources: [
          {
            label: 'Datenschutzerklärung von Google',
            href: 'https://policies.google.com/privacy?hl=de',
          },
          {
            label: 'Browser-Add-on zur Deaktivierung von Google Analytics',
            href: 'https://tools.google.com/dlpage/gaoptout?hl=de',
          },
        ],
      },
      {
        heading: 'Adsterra-Werbung',
        paragraphs: [
          'PlayerDojo kann Adsterra als einzigen Werbeanbieter verwenden. Im Datenschutzpanel kannst du unabhängig von Analytics zwischen personalisierter und kontextbezogener Werbung wählen.',
          'Bei aktivierter Werbung kann Adsterra technische Daten verarbeiten und eigene Technologien gemäß seinen Richtlinien einsetzen.',
        ],
        resources: [
          {
            label: 'Datenschutzerklärung von Adsterra',
            href: 'https://adsterra.com/privacy-policy/',
          },
        ],
      },
      {
        heading: 'Deine Auswahl und Kontakt',
        paragraphs: [
          'Du kannst optionale Technologien ablehnen, Browserspeicher löschen oder Browser-Datenschutzfunktionen verwenden. Anfragen richtest du an contact@playerdojo.com.',
        ],
      },
    ],
  },
  terms: {
    route: 'terms',
    title: 'Nutzungsbedingungen',
    description:
      'Lies die Bedingungen für die Nutzung der PlayerDojo-Tools, Rechner und Referenzen.',
    eyebrow: 'BEDINGUNGEN',
    heading: 'Nutze die Tools als Planungshilfe.',
    intro:
      'Mit dem Zugriff auf PlayerDojo stimmst du einer verantwortungsvollen Nutzung zu und akzeptierst die Grenzen der Ergebnisse.',
    updated: 'Aktualisiert am 6. Oktober 2026',
    sections: [
      {
        heading: 'Informative Hilfe',
        paragraphs: [
          'PlayerDojo bietet Rechner, Kataloge, Beispiele und Referenzen. Ergebnisse hängen von Eingaben und veränderlichen Spielmechaniken ab. Prüfe wichtige Entscheidungen stets im Spiel.',
          'Counter, Builds, Zugreihenfolgen und Berechnungen garantieren keine Kampf- oder Wettbewerbsergebnisse.',
        ],
      },
      {
        heading: 'Zulässige Nutzung',
        paragraphs: [
          'Du darfst die öffentlichen Tools zur persönlichen Planung und Recherche nutzen.',
        ],
        items: [
          'Beeinträchtige weder Betrieb noch Sicherheit der Website.',
          'Sende keine automatisierten Anfragen, die den Zugriff anderer stören.',
          'Stelle PlayerDojo-Inhalte nicht als offizielle Publisher-Informationen dar.',
          'Nutze den Dienst nicht für illegale Handlungen oder Rechtsverletzungen.',
        ],
      },
      {
        heading: 'Verfügbarkeit und Genauigkeit',
        paragraphs: [
          'Wir bemühen uns um eine nützliche und korrekte Website, doch Inhalte können unvollständig, veraltet oder vorübergehend nicht verfügbar sein. Tools können ohne Vorankündigung geändert werden.',
        ],
      },
      {
        heading: 'Rechte Dritter und Kontakt',
        paragraphs: [
          'PlayerDojo ist ein unabhängiges Projekt. Namen, Charaktere, Bilder und Marken gehören ihren Eigentümern. Fragen zu Rechten sendest du an contact@playerdojo.com.',
        ],
      },
    ],
  },
};
