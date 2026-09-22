import skillData from './skills.json' with { type: 'json' };
import type { MonsterSkill } from '../lib/types.ts';

export const skills = skillData as MonsterSkill[];
export const skillById = new Map(skills.map((skill) => [skill.id, skill]));
