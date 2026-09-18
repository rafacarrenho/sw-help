import { monsters } from '../../data/catalog';

export function GET() {
  const index = monsters.map(
    ({
      id,
      name,
      element,
      naturalStars,
      aliases,
      image,
      family,
      awakenLevel,
      speed,
      leaderSkill,
      obtainable,
    }) => ({
      id,
      name,
      element,
      naturalStars,
      aliases,
      image,
      family,
      awakenLevel,
      speed,
      leaderSkill,
      obtainable,
    }),
  );
  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
