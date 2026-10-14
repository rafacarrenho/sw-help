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
  maximumPotential: string;
  currentResult: string;
  maximumResult: string;
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
  base: string;
  additional: string;
  total: string;
  finalBuild: string;
  mainStat: string;
  innateStat: string;
  substats: string;
  gemmed: string;
  ancient: string;
  inventory: string;
  equippedOn: string;
  locked: string;
  sets: string;
  runes: string;
  candidates: string;
  runePresets: string;
  statPresets: string;
  presetFastest: string;
  presetFastestWill: string;
  presetSwift: string;
  presetViolentWill: string;
  presetViolentNemesis: string;
  presetViolentDestroy: string;
  presetTank: string;
  presetDamage: string;
  presetTankHint: string;
  presetDamageHint: string;
  objectiveDamage: string;
  estimatedDamage: string;
  damageFormula: string;
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
    maximumPotential: 'Max property potential',
    currentResult: 'Current result',
    maximumResult: 'Maximum result',
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
    base: 'Base',
    additional: 'Additional',
    total: 'Total',
    finalBuild: 'Final build',
    mainStat: 'Main stat',
    innateStat: 'Innate',
    substats: 'Substats',
    gemmed: 'Gemmed',
    ancient: 'Ancient',
    inventory: 'Inventory',
    equippedOn: 'Equipped on {monster}',
    locked: 'Locked',
    sets: 'Sets',
    runes: 'Runes',
    candidates: 'combinations evaluated',
    runePresets: 'Rune presets',
    statPresets: 'Stat presets',
    presetFastest: 'Fastest',
    presetFastestWill: 'Fastest + Will',
    presetSwift: 'Swift speed',
    presetViolentWill: 'Violent + Will',
    presetViolentNemesis: 'Violent + Nemesis',
    presetViolentDestroy: 'Violent + Destroy',
    presetTank: 'Tank',
    presetDamage: 'Damage',
    presetTankHint: '30,000 HP · 700 DEF · 100% RES · Tick 5',
    presetDamageHint: '100% CR · maximize ATK and CD',
    objectiveDamage: 'Estimated damage',
    estimatedDamage: 'Estimated damage',
    damageFormula: 'ATK × critical average',
    potentialNote:
      'Current uses rune levels and grinds as they are now. Maximum projects main stats to +15 and applies the maximum possible grind, without changing existing substats.',
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
    maximumPotential: 'Potencial máximo dos atributos',
    currentResult: 'Resultado atual',
    maximumResult: 'Resultado máximo',
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
    base: 'Base',
    additional: 'Adicional',
    total: 'Total',
    finalBuild: 'Build final',
    mainStat: 'Status principal',
    innateStat: 'Inato',
    substats: 'Substats',
    gemmed: 'Gemado',
    ancient: 'Ancient',
    inventory: 'Inventário',
    equippedOn: 'Equipada em {monster}',
    locked: 'Bloqueada',
    sets: 'Sets',
    runes: 'Runas',
    candidates: 'combinações avaliadas',
    runePresets: 'Presets de runas',
    statPresets: 'Presets de status',
    presetFastest: 'Maior SPD',
    presetFastestWill: 'Maior SPD + Will',
    presetSwift: 'SPD com Swift',
    presetViolentWill: 'Violent + Will',
    presetViolentNemesis: 'Violent + Nemesis',
    presetViolentDestroy: 'Violent + Destroy',
    presetTank: 'Tank',
    presetDamage: 'Dano',
    presetTankHint: '30.000 HP · 700 DEF · 100% RES · Tick 5',
    presetDamageHint: '100% CR · maximizar ATK e CD',
    objectiveDamage: 'Dano estimado',
    estimatedDamage: 'Dano estimado',
    damageFormula: 'ATK × média crítica',
    potentialNote:
      'Atual usa o nível e os grinds que as runas têm agora. Máximo projeta os status principais para +15 e aplica o maior grind possível, sem trocar os substats existentes.',
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
    maximumPotential: 'Potencial máximo de los atributos',
    currentResult: 'Resultado actual',
    maximumResult: 'Resultado máximo',
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
    base: 'Base',
    additional: 'Adicional',
    total: 'Total',
    finalBuild: 'Build final',
    mainStat: 'Atributo principal',
    innateStat: 'Innato',
    substats: 'Substats',
    gemmed: 'Con gema',
    ancient: 'Ancient',
    inventory: 'Inventario',
    equippedOn: 'Equipada en {monster}',
    locked: 'Bloqueada',
    sets: 'Sets',
    runes: 'Runas',
    candidates: 'combinaciones evaluadas',
    runePresets: 'Presets de runas',
    statPresets: 'Presets de estadísticas',
    presetFastest: 'Mayor SPD',
    presetFastestWill: 'Mayor SPD + Will',
    presetSwift: 'SPD con Swift',
    presetViolentWill: 'Violent + Will',
    presetViolentNemesis: 'Violent + Nemesis',
    presetViolentDestroy: 'Violent + Destroy',
    presetTank: 'Tank',
    presetDamage: 'Daño',
    presetTankHint: '30.000 HP · 700 DEF · 100% RES · Tick 5',
    presetDamageHint: '100% CR · maximizar ATK y CD',
    objectiveDamage: 'Daño estimado',
    estimatedDamage: 'Daño estimado',
    damageFormula: 'ATK × promedio crítico',
    potentialNote:
      'Actual usa el nivel y los grinds que tienen las runas ahora. Máximo proyecta los atributos principales a +15 y aplica el mayor grind posible, sin cambiar los substats existentes.',
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
    maximumPotential: 'Potentiel maximal des attributs',
    currentResult: 'Résultat actuel',
    maximumResult: 'Résultat maximum',
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
    base: 'Base',
    additional: 'Additionnel',
    total: 'Total',
    finalBuild: 'Build final',
    mainStat: 'Stat principale',
    innateStat: 'Innée',
    substats: 'Substats',
    gemmed: 'Gemmée',
    ancient: 'Ancient',
    inventory: 'Inventaire',
    equippedOn: 'Équipée sur {monster}',
    locked: 'Verrouillée',
    sets: 'Sets',
    runes: 'Runes',
    candidates: 'combinaisons évaluées',
    runePresets: 'Presets de runes',
    statPresets: 'Presets de stats',
    presetFastest: 'VIT maximale',
    presetFastestWill: 'VIT maximale + Will',
    presetSwift: 'VIT avec Swift',
    presetViolentWill: 'Violent + Will',
    presetViolentNemesis: 'Violent + Nemesis',
    presetViolentDestroy: 'Violent + Destroy',
    presetTank: 'Tank',
    presetDamage: 'Dégâts',
    presetTankHint: '30 000 HP · 700 DEF · 100 % RES · Tick 5',
    presetDamageHint: '100 % CR · maximiser ATK et CD',
    objectiveDamage: 'Dégâts estimés',
    estimatedDamage: 'Dégâts estimés',
    damageFormula: 'ATK × moyenne critique',
    potentialNote:
      'Actuel utilise le niveau et les grinds présents sur les runes. Maximum projette les stats principales à +15 et applique le grind maximal possible, sans changer les substats existants.',
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
    maximumPotential: 'Maximales Attributpotenzial',
    currentResult: 'Aktuelles Ergebnis',
    maximumResult: 'Maximales Ergebnis',
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
    base: 'Basis',
    additional: 'Zusätzlich',
    total: 'Gesamt',
    finalBuild: 'Finaler Build',
    mainStat: 'Hauptwert',
    innateStat: 'Angeboren',
    substats: 'Substats',
    gemmed: 'Mit Gem',
    ancient: 'Ancient',
    inventory: 'Inventar',
    equippedOn: 'Ausgerüstet auf {monster}',
    locked: 'Gesperrt',
    sets: 'Sets',
    runes: 'Runen',
    candidates: 'Kombinationen geprüft',
    runePresets: 'Runen-Presets',
    statPresets: 'Status-Presets',
    presetFastest: 'Höchste GES',
    presetFastestWill: 'Höchste GES + Will',
    presetSwift: 'GES mit Swift',
    presetViolentWill: 'Violent + Will',
    presetViolentNemesis: 'Violent + Nemesis',
    presetViolentDestroy: 'Violent + Destroy',
    presetTank: 'Tank',
    presetDamage: 'Schaden',
    presetTankHint: '30.000 HP · 700 DEF · 100 % RES · Tick 5',
    presetDamageHint: '100 % CR · ATK und CD maximieren',
    objectiveDamage: 'Geschätzter Schaden',
    estimatedDamage: 'Geschätzter Schaden',
    damageFormula: 'ATK × kritischer Mittelwert',
    potentialNote:
      'Aktuell verwendet Runenstufe und vorhandene Grinds. Maximum rechnet Hauptwerte auf +15 und wendet den höchstmöglichen Grind an, ohne vorhandene Substats zu ersetzen.',
    unknownMonster: 'Unbekanntes Monster',
    dataRemoved: 'Lokale Daten gelöscht.',
  },
};
