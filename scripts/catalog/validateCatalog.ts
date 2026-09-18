import { createHash } from 'node:crypto';

import { generateCatalog } from '../../src/data/catalog/generator.ts';
import { formatCatalogValidation, validateCatalog } from '../../src/data/catalog/validator.ts';
import { parseCatalogCli } from './cli.ts';

const options = parseCatalogCli(process.argv.slice(2));
const generationOptions = {
  ...(options.seed === undefined ? {} : { seed: options.seed }),
  ...(options.count === undefined ? {} : { productCount: options.count }),
};
const first = generateCatalog(generationOptions);
const second = generateCatalog(generationOptions);
const firstJson = JSON.stringify(first);
const secondJson = JSON.stringify(second);
const deterministic = firstJson === secondJson;
const report = validateCatalog(first);

console.log(formatCatalogValidation(report));
console.log(
  `Determinism: ${deterministic ? 'PASS' : 'FAIL'} (${createHash('sha256').update(firstJson).digest('hex')})`,
);

if (!report.passed || !deterministic) process.exit(1);
