/// <reference lib="webworker" />

import { optimizeRunes } from '../lib/rune-optimizer.ts';
import { parseSwexJson } from '../lib/swex-import.ts';
import type {
  AccountSnapshot,
  OptimizerQuery,
} from '../lib/rune-optimizer-types.ts';

let snapshot: AccountSnapshot | null = null;

self.onmessage = (
  event: MessageEvent<
    | { type: 'import'; text: string }
    | { type: 'load'; snapshot: AccountSnapshot }
    | { type: 'optimize'; query: OptimizerQuery }
  >,
) => {
  try {
    if (event.data.type === 'import') {
      snapshot = parseSwexJson(event.data.text);
      self.postMessage({ type: 'imported', snapshot });
      return;
    }
    if (event.data.type === 'load') {
      snapshot = event.data.snapshot;
      self.postMessage({ type: 'loaded' });
      return;
    }
    if (!snapshot) throw new Error('no-snapshot');
    const result = optimizeRunes(snapshot.runes, event.data.query);
    self.postMessage({ type: 'optimized', result });
  } catch (error) {
    self.postMessage({
      type: 'error',
      code: error instanceof Error ? error.message : 'unexpected-error',
    });
  }
};

export {};
