import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = fileURLToPath(new URL('..', import.meta.url));
const ignoredDirectories = new Set([
  '.astro',
  '.git',
  'coverage',
  'dist',
  'node_modules',
  'playwright-report',
  'test-results',
]);

function repositoryFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) return [];

    const path = `${directory}/${entry.name}`;
    if (entry.isDirectory()) return repositoryFiles(path);
    return entry.isFile() ? [path] : [];
  });
}

test('bloqueia o caractere Unicode U+2014 em todo o repositório', () => {
  const forbiddenCharacter = String.fromCodePoint(0x2014);
  const decoder = new TextDecoder('utf-8', { fatal: true });
  const offenders = repositoryFiles(repositoryRoot)
    .filter((path) => {
      try {
        return decoder.decode(readFileSync(path)).includes(forbiddenCharacter);
      } catch {
        return false;
      }
    })
    .map((path) => relative(repositoryRoot, path))
    .sort();

  assert.deepEqual(
    offenders,
    [],
    `Unicode U+2014 encontrado em: ${offenders.join(', ')}`,
  );
});
