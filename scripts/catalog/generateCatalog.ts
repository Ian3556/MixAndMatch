import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

import { generateCatalog } from '../../src/data/catalog/generator.ts';
import { formatCatalogValidation, validateCatalog } from '../../src/data/catalog/validator.ts';
import { parseCatalogCli } from './cli.ts';

const options = parseCatalogCli(process.argv.slice(2));
const catalog = generateCatalog({
  ...(options.seed === undefined ? {} : { seed: options.seed }),
  ...(options.count === undefined ? {} : { productCount: options.count }),
});
const report = validateCatalog(catalog);
const json = `${JSON.stringify(catalog, null, 2)}\n`;
const hash = createHash('sha256').update(json).digest('hex');

console.log(formatCatalogValidation(report));
console.log(`Deterministic SHA-256: ${hash}`);
if (!report.passed) process.exit(1);

const output = resolve(options.output ?? '.catalog/synthetic-catalog.json');
await mkdir(dirname(output), { recursive: true });
await writeFile(output, json, 'utf8');
console.log(`Wrote ${output}`);
