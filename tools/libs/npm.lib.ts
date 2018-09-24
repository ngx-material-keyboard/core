import { coerce } from 'semver'; // tslint:disable-line no-implicit-dependencies
import * as Helpers from '../test-helpers';

export enum SaveType {
  NoSave = '--no-save',
  SaveDev = '--save-dev',
  SaveOptional = '--save-optional',
  SaveProd = '--save-prod',
  Save = '--save'
}

export const mapSaveTypeProp = (saveType: SaveType): string | undefined => {
  switch(saveType) {
    default:
    case SaveType.NoSave:
      return;
    case SaveType.SaveDev:
      return 'devDependencies';
    case SaveType.SaveOptional:
      return 'optionalDependencies';
    case SaveType.SaveProd:
    case SaveType.Save:
      return 'dependencies';
  }
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

export const add = (cwd: string, silent = false, deps: { [k: string]: string }, save: SaveType = SaveType.NoSave, encoding = 'utf8'): Promise<void> => {
  return Helpers.readFileAsync(cwd, encoding)
    .then((packageData: string) => JSON.parse(packageData))
    .then((packageData: any) => {
      const saveProp = mapSaveTypeProp(save);
      packageData[saveProp] = {
        ...packageData[saveProp],
        ...deps
      }
      return packageData;
    })
    .then((packageData: any) => JSON.stringify(packageData))
    .then((packageData: string) => Helpers.writeFileAsync(cwd, packageData, { encoding }));
};

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

export const install = (cwd: string, silent = false, name?: string, save: SaveType = SaveType.NoSave): Promise<void> => {
  const defaultOptions = [
    '--no-audit',
    '--no-optional',
    '--no-package-lock',
    '--no-progress',
    '--loglevel=error'
  ];
  const packageOptions = name ? [name, save] : [];

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
