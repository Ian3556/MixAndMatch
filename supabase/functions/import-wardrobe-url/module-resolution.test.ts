import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const functionDirectory = dirname(fileURLToPath(import.meta.url));
const sharedDirectory = resolve(functionDirectory, '../_shared/wardrobe-import');

describe('import-wardrobe-url deployment module graph', () => {
  it('uses explicit TypeScript extensions for every deployable local import', () => {
    const files = [
      resolve(functionDirectory, 'index.ts'),
      ...readdirSync(sharedDirectory)
        .filter((name) => name.endsWith('.ts') && !name.endsWith('.test.ts'))
        .map((name) => resolve(sharedDirectory, name)),
    ];

    for (const file of files) {
      const source = readFileSync(file, 'utf8');
      const specifiers = [...source.matchAll(/from\s+['"](\.\.?\/[^'"]+)['"]/g)].flatMap((match) =>
        match[1] ? [match[1]] : [],
      );

      for (const specifier of specifiers) {
        expect(specifier, `${file} has a Deno-incompatible local import`).toMatch(/\.ts$/);
        expect(existsSync(resolve(dirname(file), specifier)), `${specifier} must resolve`).toBe(
          true,
        );
      }
    }
  });
});
