export type Element = 'fire' | 'water' | 'wind' | 'light' | 'dark';
export type Tower = '4star' | 'open';
export interface Monster {
  id: string;
  name: string;
  element: Element;
  naturalStars: number;
  aliases: string[];
  image?: string;
  source?: string;
  imageSource?: string;
}
export interface Defense {
  id: string;
  team: string[];
  tower: Tower;
  label: string;
  description: string;
  leader: string | null;
  status: 'example' | 'documented';
}
export interface Counter {
  id: string;
  defenseId: string;
  team: string[];
  leader: string | null;
  title: string;
  strategy: string;
  steps: string[];
  turnOrder: string[];
  runes: { monsterId: string; sets: string }[];
  caution: string;
  status: 'example' | 'documented';
  sources: { title: string; url: string }[];
}
