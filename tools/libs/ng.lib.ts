import { join as joinPath } from 'path';
import * as Helpers from '../test-helpers';

// (re)initialize new project
export const initialize = (cwd: string, testProjectName: string, binPath: string, silent = false): Promise<void> => Helpers
  .rimrafAsync(joinPath(cwd, testProjectName))
  .then(() => Helpers.spawnAsync(
    binPath,
    [
      'new', testProjectName,
      '--force',
      '--skip-git',
      '--skip-install'
    ],
    { cwd, silent }
  ));

// show installed angular version
export const version = (cwd: string, binPath: string, silent = false): Promise<void> => {
  return Helpers.spawnAsync(binPath, ['--version'], { cwd, silent });
};
