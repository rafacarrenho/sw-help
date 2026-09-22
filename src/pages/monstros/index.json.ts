import { monsters } from '../../data/catalog';
import { toMonsterSummary } from '../../lib/monster-catalog';

export function GET() {
  const index = monsters.map(toMonsterSummary);
  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
