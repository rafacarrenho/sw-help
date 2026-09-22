export type SpeedTuningTargetScope = 'team' | 'single';

export interface SpeedTuningSkillOverride {
  atbBoost?: number;
  atbScope?: SpeedTuningTargetScope;
  speedBuffScope?: SpeedTuningTargetScope;
  excludeAtb?: boolean;
  excludeSpeedBuff?: boolean;
}

/**
 * Exceptions for skill data that cannot express a full-bar boost numerically
 * or whose imported quantity differs from the current fully-skilled value.
 * Generic ally-targeting effects continue to be inferred from skills.json.
 */
export const speedTuningSkillOverrides: Record<
  number,
  SpeedTuningSkillOverride
> = {
  81: { atbBoost: 100, atbScope: 'single' }, // Konamiya · Resurge
  85: { atbBoost: 100, atbScope: 'single' }, // Teon · Resurge
  789: { atbBoost: 40, atbScope: 'single' }, // Platy · Grant Life
  790: { atbBoost: 40, atbScope: 'single' }, // Betta · Grant Life
  1355: { atbBoost: 30, atbScope: 'team' }, // Imesety · Duty of the Monarch
  1428: {
    atbBoost: 100,
    atbScope: 'single',
    speedBuffScope: 'single',
  }, // Racuni · Rabbit's Agility
  1429: {
    atbBoost: 100,
    atbScope: 'single',
    speedBuffScope: 'single',
  }, // Dova · Rabbit's Agility
  2221: { atbBoost: 30, atbScope: 'team' }, // Belladeon · Mobilize
  3161: { atbBoost: 15, atbScope: 'team' }, // Jackson · team portion of passive
  3295: { atbBoost: 20, atbScope: 'team' }, // Megan · imported quantity is incomplete
};
