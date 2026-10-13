import type { Locale } from './routes.ts';

export interface RuneOptimizerMessages {
  nav: string;
  title: string;
  description: string;
  privacy: string;
  importTitle: string;
  importHelp: string;
  chooseFile: string;
  replaceFile: string;
  removeData: string;
  importing: string;
  importError: string;
  storedSummary: string;
  lastImport: string;
  builderTitle: string;
  monster: string;
  objective: string;
  requiredSets: string;
  anySet: string;
  poolTitle: string;
  inventoryOnly: string;
  includeLocked: string;
  excludeMonster: string;
  add: string;
  constraints: string;
  stat: string;
  minimum: string;
  maximum: string;
  tickTitle: string;
  requireTick: string;
  speedTower: string;
  leaderSkill: string;
  optimize: string;
  cancel: string;
  calculating: string;
  noResults: string;
  results: string;
  current: string;
  potential: string;
  sets: string;
  runes: string;
  candidates: string;
  presetFastest: string;
  presetSwift: string;
  presetViolentWill: string;
  presetTank: string;
  potentialNote: string;
  unknownMonster: string;
  dataRemoved: string;
}

export const runeOptimizerMessages: Record<Locale, RuneOptimizerMessages> = {
  en: {
    nav: 'Rune Optimizer',
    title: 'Rune Optimizer',
    description:
      'Import a SWEX JSON and find exact one-monster builds using your runes.',
    privacy:
      'Your file never leaves this device. Only a sanitized snapshot is stored locally; account and session identifiers are discarded.',
    importTitle: 'Import your account',
    importHelp: 'Select the HubUserLogin JSON exported by SWEX.',
    chooseFile: 'Choose JSON',
    replaceFile: 'Replace JSON',
    removeData: 'Remove local data',
    importing: 'Importing…',
    importError: 'This export could not be imported.',
    storedSummary:
      '{monsters} monsters · {runes} runes · {artifacts} artifacts',
    lastImport: 'Imported',
    builderTitle: 'Build goal',
    monster: 'Monster',
    objective: 'Maximize',
    requiredSets: 'Required sets',
    anySet: 'Any / broken set',
    poolTitle: 'Rune pool',
    inventoryOnly: 'Inventory runes only',
    includeLocked: 'Allow locked runes',
    excludeMonster: 'Do not take runes from',
    add: 'Add',
    constraints: 'Stat constraints',
    stat: 'Stat',
    minimum: 'Minimum',
    maximum: 'Maximum',
    tickTitle: 'Combat speed',
    requireTick: 'Require a Tick',
    speedTower: 'SPD tower (%)',
    leaderSkill: 'SPD leader (%)',
    optimize: 'Find exact builds',
    cancel: 'Cancel',
    calculating: 'Calculating exact combinations…',
    noResults: 'No build meets every selected condition.',
    results: 'Best builds',
    current: 'Current',
    potential: 'Potential',
    sets: 'Sets',
    runes: 'Runes',
    candidates: 'combinations evaluated',
    presetFastest: 'Fastest',
    presetSwift: 'Swift speed',
    presetViolentWill: 'Violent + Will',
    presetTank: 'Tank / RES',
    potentialNote:
      'Potential projects main stats to +15 and applies the maximum possible grind while keeping current substats.',
    unknownMonster: 'Unknown monster',
    dataRemoved: 'Local data removed.',
  },
  'pt-BR': {
    nav: 'Otimizador de Runas',
    title: 'Otimizador de Runas',
    description:
      'Importe um JSON do SWEX e encontre builds exatas para um monstro usando suas runas.',
    privacy:
      'Seu arquivo nunca sai deste dispositivo. Apenas uma cópia sanitizada é salva localmente; identificadores de conta e sessão são descartados.',
    importTitle: 'Importe sua conta',
    importHelp: 'Selecione o JSON HubUserLogin exportado pelo SWEX.',
    chooseFile: 'Escolher JSON',
    replaceFile: 'Substituir JSON',
    removeData: 'Remover dados locais',
    importing: 'Importando…',
    importError: 'Não foi possível importar este arquivo.',
    storedSummary:
      '{monsters} monstros · {runes} runas · {artifacts} artefatos',
    lastImport: 'Importado em',
    builderTitle: 'Objetivo da build',
    monster: 'Monstro',
    objective: 'Maximizar',
    requiredSets: 'Sets obrigatórios',
    anySet: 'Qualquer / set quebrado',
    poolTitle: 'Conjunto de runas',
    inventoryOnly: 'Somente runas no inventário',
    includeLocked: 'Permitir runas bloqueadas',
    excludeMonster: 'Não retirar runas de',
    add: 'Adicionar',
    constraints: 'Limites de status',
    stat: 'Status',
    minimum: 'Mínimo',
    maximum: 'Máximo',
    tickTitle: 'Velocidade de combate',
    requireTick: 'Exigir um Tick',
    speedTower: 'Torre de SPD (%)',
    leaderSkill: 'Líder de SPD (%)',
    optimize: 'Encontrar builds exatas',
    cancel: 'Cancelar',
    calculating: 'Calculando combinações exatas…',
    noResults: 'Nenhuma build atende a todas as condições.',
    results: 'Melhores builds',
    current: 'Atual',
    potential: 'Potencial',
    sets: 'Sets',
    runes: 'Runas',
    candidates: 'combinações avaliadas',
    presetFastest: 'Maior SPD',
    presetSwift: 'SPD com Swift',
    presetViolentWill: 'Violent + Will',
    presetTank: 'Tank / RES',
    potentialNote:
      'O potencial projeta os status principais para +15 e aplica o maior grind possível, mantendo os substats atuais.',
    unknownMonster: 'Monstro desconhecido',
    dataRemoved: 'Dados locais removidos.',
  },
  es: {
    nav: 'Optimizador de runas',
    title: 'Optimizador de runas',
    description:
      'Importa un JSON de SWEX y encuentra builds exactas para un monstruo con tus runas.',
    privacy:
      'Tu archivo nunca sale de este dispositivo. Solo se guarda localmente una copia saneada; se descartan los identificadores de cuenta y sesión.',
    importTitle: 'Importa tu cuenta',
    importHelp: 'Selecciona el JSON HubUserLogin exportado por SWEX.',
    chooseFile: 'Elegir JSON',
    replaceFile: 'Reemplazar JSON',
    removeData: 'Borrar datos locales',
    importing: 'Importando…',
    importError: 'No se pudo importar este archivo.',
    storedSummary:
      '{monsters} monstruos · {runes} runas · {artifacts} artefactos',
    lastImport: 'Importado',
    builderTitle: 'Objetivo de la build',
    monster: 'Monstruo',
    objective: 'Maximizar',
    requiredSets: 'Sets obligatorios',
    anySet: 'Cualquiera / set roto',
    poolTitle: 'Grupo de runas',
    inventoryOnly: 'Solo runas del inventario',
    includeLocked: 'Permitir runas bloqueadas',
    excludeMonster: 'No tomar runas de',
    add: 'Añadir',
    constraints: 'Límites de estadísticas',
    stat: 'Estadística',
    minimum: 'Mínimo',
    maximum: 'Máximo',
    tickTitle: 'Velocidad de combate',
    requireTick: 'Exigir un Tick',
    speedTower: 'Torre de SPD (%)',
    leaderSkill: 'Líder de SPD (%)',
    optimize: 'Buscar builds exactas',
    cancel: 'Cancelar',
    calculating: 'Calculando combinaciones exactas…',
    noResults: 'Ninguna build cumple todas las condiciones.',
    results: 'Mejores builds',
    current: 'Actual',
    potential: 'Potencial',
    sets: 'Sets',
    runes: 'Runas',
    candidates: 'combinaciones evaluadas',
    presetFastest: 'Mayor SPD',
    presetSwift: 'SPD con Swift',
    presetViolentWill: 'Violent + Will',
    presetTank: 'Tank / RES',
    potentialNote:
      'El potencial proyecta los atributos principales a +15 y aplica el mayor grind posible, conservando los substats actuales.',
    unknownMonster: 'Monstruo desconocido',
    dataRemoved: 'Datos locales eliminados.',
  },
  fr: {
    nav: 'Optimiseur de runes',
    title: 'Optimiseur de runes',
    description:
      'Importez un JSON SWEX et trouvez des builds exacts pour un monstre avec vos runes.',
    privacy:
      'Votre fichier ne quitte jamais cet appareil. Seule une copie assainie est enregistrée localement ; les identifiants de compte et de session sont supprimés.',
    importTitle: 'Importer votre compte',
    importHelp: 'Sélectionnez le JSON HubUserLogin exporté par SWEX.',
    chooseFile: 'Choisir le JSON',
    replaceFile: 'Remplacer le JSON',
    removeData: 'Supprimer les données locales',
    importing: 'Importation…',
    importError: "Impossible d'importer ce fichier.",
    storedSummary:
      '{monsters} monstres · {runes} runes · {artifacts} artefacts',
    lastImport: 'Importé',
    builderTitle: 'Objectif du build',
    monster: 'Monstre',
    objective: 'Maximiser',
    requiredSets: 'Sets obligatoires',
    anySet: 'Libre / set incomplet',
    poolTitle: 'Réserve de runes',
    inventoryOnly: "Runes de l'inventaire uniquement",
    includeLocked: 'Autoriser les runes verrouillées',
    excludeMonster: 'Ne pas prendre les runes de',
    add: 'Ajouter',
    constraints: 'Contraintes de stats',
    stat: 'Stat',
    minimum: 'Minimum',
    maximum: 'Maximum',
    tickTitle: 'Vitesse de combat',
    requireTick: 'Exiger un Tick',
    speedTower: 'Tour de VIT (%)',
    leaderSkill: 'Leader VIT (%)',
    optimize: 'Trouver les builds exacts',
    cancel: 'Annuler',
    calculating: 'Calcul des combinaisons exactes…',
    noResults: 'Aucun build ne respecte toutes les conditions.',
    results: 'Meilleurs builds',
    current: 'Actuel',
    potential: 'Potentiel',
    sets: 'Sets',
    runes: 'Runes',
    candidates: 'combinaisons évaluées',
    presetFastest: 'VIT maximale',
    presetSwift: 'VIT avec Swift',
    presetViolentWill: 'Violent + Will',
    presetTank: 'Tank / RES',
    potentialNote:
      'Le potentiel projette les stats principales à +15 et applique le grind maximal possible, sans changer les substats.',
    unknownMonster: 'Monstre inconnu',
    dataRemoved: 'Données locales supprimées.',
  },
  de: {
    nav: 'Runen-Optimierer',
    title: 'Runen-Optimierer',
    description:
      'Importiere eine SWEX-JSON-Datei und finde exakte Builds für ein Monster mit deinen Runen.',
    privacy:
      'Deine Datei verlässt dieses Gerät nie. Nur eine bereinigte Kopie wird lokal gespeichert; Konto- und Sitzungskennungen werden verworfen.',
    importTitle: 'Konto importieren',
    importHelp: 'Wähle die von SWEX exportierte HubUserLogin-JSON-Datei.',
    chooseFile: 'JSON auswählen',
    replaceFile: 'JSON ersetzen',
    removeData: 'Lokale Daten löschen',
    importing: 'Import wird ausgeführt…',
    importError: 'Diese Datei konnte nicht importiert werden.',
    storedSummary: '{monsters} Monster · {runes} Runen · {artifacts} Artefakte',
    lastImport: 'Importiert',
    builderTitle: 'Build-Ziel',
    monster: 'Monster',
    objective: 'Maximieren',
    requiredSets: 'Erforderliche Sets',
    anySet: 'Beliebig / Broken Set',
    poolTitle: 'Runenpool',
    inventoryOnly: 'Nur Runen im Inventar',
    includeLocked: 'Gesperrte Runen erlauben',
    excludeMonster: 'Keine Runen nehmen von',
    add: 'Hinzufügen',
    constraints: 'Statusgrenzen',
    stat: 'Status',
    minimum: 'Minimum',
    maximum: 'Maximum',
    tickTitle: 'Kampfgeschwindigkeit',
    requireTick: 'Tick verlangen',
    speedTower: 'GES-Turm (%)',
    leaderSkill: 'GES-Leader (%)',
    optimize: 'Exakte Builds finden',
    cancel: 'Abbrechen',
    calculating: 'Exakte Kombinationen werden berechnet…',
    noResults: 'Kein Build erfüllt alle Bedingungen.',
    results: 'Beste Builds',
    current: 'Aktuell',
    potential: 'Potenzial',
    sets: 'Sets',
    runes: 'Runen',
    candidates: 'Kombinationen geprüft',
    presetFastest: 'Höchste GES',
    presetSwift: 'GES mit Swift',
    presetViolentWill: 'Violent + Will',
    presetTank: 'Tank / RES',
    potentialNote:
      'Das Potenzial rechnet Hauptwerte auf +15 und wendet den höchstmöglichen Grind an, ohne Substats zu ersetzen.',
    unknownMonster: 'Unbekanntes Monster',
    dataRemoved: 'Lokale Daten gelöscht.',
  },
};
