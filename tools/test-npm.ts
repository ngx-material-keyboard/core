import { coerce } from 'semver'; // tslint:disable-line no-implicit-dependencies
import * as Helpers from './test-helpers';

export const install = (cwd: string, silent = false, packageName?: string): Promise<void> => {
  const defaultOptions = [
    '--no-audit',
    '--no-optional',
    '--no-package-lock',
    '--no-progress',
    '--loglevel=error'
  ];
  const packageOptions = packageName ? [packageName, '--no-save'] : [];

  return Helpers.spawnAsync(
    'npm',
    [
      'install',
      ...packageOptions,
      ...defaultOptions
    ],
    { cwd, silent }
  );
};

export const initialize = (cwd: string, projectScope: string, silent = false): Promise<void> => Helpers.spawnAsync(
  'npm',
  [
    'init',
    '--yes',
    `--scope ${projectScope}`
  ],
  { cwd, silent }
);

// pin dependencies
// TODO: allow e.g. `beta` builds by disable pinning in config
export const pin = (cwd: string, encoding = 'utf8'): Promise<void> => Helpers.readFileAsync(cwd, encoding)
  .then((packageData: string) => JSON.parse(packageData))
  .then((packageData: any) => {
    ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies'].forEach((depType) => {
      if (depType in packageData) {
        Object
          .keys(packageData[depType])
          .forEach((depName: string) => {
            packageData[depType][depName] = coerce(packageData[depType][depName])
              .format();
          });
      }
    });

    return packageData;
  })
  .then((packageData: any) => JSON.stringify(packageData))
  .then((packageData: string) => Helpers.writeFileAsync(cwd, packageData, { encoding }));

