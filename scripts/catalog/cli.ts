export type CatalogCliOptions = {
  seed?: number;
  count?: number;
  output?: string;
  apply: boolean;
  resetOnly: boolean;
  resetExisting: boolean;
};

export function parseCatalogCli(args: string[]): CatalogCliOptions {
  const options: CatalogCliOptions = {
    apply: false,
    resetOnly: false,
    resetExisting: false,
  };
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === '--apply') options.apply = true;
    else if (argument === '--reset-only') options.resetOnly = true;
    else if (argument === '--reset-existing') options.resetExisting = true;
    else if (argument === '--seed') options.seed = readInteger(args[++index], '--seed');
    else if (argument === '--count') options.count = readInteger(args[++index], '--count');
    else if (argument === '--out') options.output = readValue(args[++index], '--out');
    else throw new Error(`Unknown catalog option: ${argument ?? '(missing)'}.`);
  }
  return options;
}

function readInteger(value: string | undefined, flag: string): number {
  const parsed = Number(readValue(value, flag));
  if (!Number.isInteger(parsed)) throw new Error(`${flag} requires an integer.`);
  return parsed;
}

function readValue(value: string | undefined, flag: string): string {
  if (!value || value.startsWith('--')) throw new Error(`${flag} requires a value.`);
  return value;
}
