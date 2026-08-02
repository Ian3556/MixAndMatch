import { spawnSync } from 'node:child_process';

const checks = ['typecheck', 'lint', 'format:check'];
const npmCli = process.env.npm_execpath;

if (!npmCli) {
  console.error('npm_execpath is unavailable. Run validation through `npm run validate`.');
  process.exit(1);
}

for (const check of checks) {
  const result = spawnSync(process.execPath, [npmCli, 'run', check], {
    shell: false,
    stdio: 'inherit',
  });

  if (result.error) {
    console.error(`Unable to run ${check}:`, result.error.message);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
