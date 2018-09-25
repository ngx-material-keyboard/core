import * as npm from './libs/npm.lib';
import * as Helpers from './test-helpers';

export const updateWebdrivers = (cwd: string, silent = false): Promise<void> => Helpers
  .spawnAsync('node_modules/.bin/webdriver-manager', [
    'update',
    '--standalone false',
    '--gecko false',
    '--versions.chrome 2.37'
  ], { cwd, silent });

export const unitTests = (cwd: string, silent = false): Promise<void> => npm
  .run(cwd, 'test', [
    '--watch=false',
    '--progress=false',
    '--browsers=ChromeHeadlessCI'
  ], silent);

export const e2eTests = (cwd: string, silent = false): Promise<void> => updateWebdrivers(cwd, silent)
  .then(() => npm.run(cwd, 'e2e', ['--webdriver-update=false'], silent));
