import type { NormalizedRune, RuneSetName } from './rune-optimizer-types.ts';

export const runeSetAssetNames: Record<RuneSetName, string> = {
  Energy: 'energy',
  Guard: 'guard',
  Swift: 'swift',
  Blade: 'blade',
  Rage: 'rage',
  Focus: 'focus',
  Endure: 'endure',
  Fatal: 'fatal',
  Despair: 'despair',
  Vampire: 'vampire',
  Violent: 'violent',
  Nemesis: 'nemesis',
  Will: 'will',
  Shield: 'shield',
  Revenge: 'revenge',
  Destroy: 'destroy',
  Fight: 'fight',
  Determination: 'determination',
  Enhance: 'enhance',
  Accuracy: 'accuracy',
  Tolerance: 'tolerance',
  Seal: 'seal',
  Intangible: 'intangible',
};

const qualityNames = ['normal', 'magic', 'rare', 'hero', 'legend'] as const;
const assetBase = '/images/runes';

export function runeVisualAssets(
  rune: Pick<NormalizedRune, 'slot' | 'set' | 'quality' | 'ancient'>,
) {
  const qualityIndex = Math.max(
    0,
    Math.min(qualityNames.length - 1, Math.trunc(rune.quality) - 1),
  );
  const quality = qualityNames[qualityIndex];
  const ancientSuffix = rune.ancient ? '_immemorial' : '';

  return {
    background: `${assetBase}/bg_${quality}${ancientSuffix}.png`,
    slot: `${assetBase}/rune${rune.slot}.png`,
    set: `${assetBase}/gold/${runeSetAssetNames[rune.set]}.png`,
  };
}
