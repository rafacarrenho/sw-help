export type SpeedTuningTargetScope = 'team' | 'single';

export interface SpeedTuningSkillOverride {
  atbBoost?: number;
  defaultAtbBoost?: number;
  conditionalAtb?: boolean;
  atbScope?: SpeedTuningTargetScope;
  speedBuffScope?: SpeedTuningTargetScope;
  excludeAtb?: boolean;
  excludeSpeedBuff?: boolean;
}

/**
 * Exceptions for skill data that cannot express a full-bar boost numerically,
 * whose imported quantity differs from the current value, or whose activation
 * is conditional. Generic ally-targeting effects continue to be inferred from
 * skills.json.
 */
export const speedTuningSkillOverrides: Record<
  number,
  SpeedTuningSkillOverride
> = {
  81: { atbBoost: 100, atbScope: 'single' }, // Konamiya · Resurge
  85: { atbBoost: 100, atbScope: 'single' }, // Teon · Resurge
  231: { conditionalAtb: true }, // Janssen · Furious March
  789: { atbBoost: 40, atbScope: 'single' }, // Platy · Grant Life
  790: { atbBoost: 40, atbScope: 'single' }, // Betta · Grant Life
  923: { conditionalAtb: true }, // Wolyung · Amuse
  925: { conditionalAtb: true }, // Yeonhong · Blade Fan
  926: { conditionalAtb: true }, // Hwahee · Pride Will Fall
  928: { conditionalAtb: true }, // Chasun · Fallen Blossoms
  1098: { atbBoost: 10 }, // Ragdoll · Tooth For a Tooth
  1200: {
    atbBoost: 20,
    defaultAtbBoost: 10,
    conditionalAtb: true,
  }, // Woonsa · Inhale Magic
  1268: { conditionalAtb: true }, // Lisa · Cutting Magic
  1269: { conditionalAtb: true }, // Emma · Cutting Magic
  1270: { conditionalAtb: true }, // Sylvia · Cutting Magic
  1355: {
    atbBoost: 30,
    defaultAtbBoost: 10,
    conditionalAtb: true,
    atbScope: 'team',
  }, // Wedjat · Duty of the Monarch
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
  2996: { conditionalAtb: true }, // Chichi and Friends · Attack! Heal!
  3161: { atbBoost: 15, atbScope: 'team' }, // Jackson · team portion of passive
  3295: { atbBoost: 20, atbScope: 'team' }, // Megan · imported quantity is incomplete
  3997: { conditionalAtb: true }, // Mihyang · Blade Fan
  4452: { conditionalAtb: true }, // Colleen · Fiery Dance
  5002: { conditionalAtb: true }, // Neriope · Sword of Justice
  5003: { conditionalAtb: true }, // Agrenia · Sword of Justice
  5004: { conditionalAtb: true }, // Driana · Sword of Justice
  5005: { conditionalAtb: true }, // Arella · Sword of Justice
  5006: { conditionalAtb: true }, // Theonia · Sword of Justice
  5007: { conditionalAtb: true }, // Neriope · Purifying Mediation
  5010: { conditionalAtb: true }, // Arella · Purifying Mediation
  5014: { conditionalAtb: true }, // Driana · Judgment Storm
};
