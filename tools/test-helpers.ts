import { spawn, SpawnOptions } from 'child_process';
import { readFile, rename, renameSync, writeFile } from 'fs';
import * as glob from 'glob'; // tslint:disable-line no-implicit-dependencies
import * as mkdirp from 'mkdirp'; // tslint:disable-line no-implicit-dependencies
import * as rimraf from 'rimraf'; // tslint:disable-line no-implicit-dependencies
import { promisify } from 'util';
import * as Options from './test-options';

export const renameAsync = promisify(rename);

export const readFileAsync = promisify(readFile);

export const writeFileAsync = promisify(writeFile);

export const mkdirpAsync = promisify(mkdirp);

export const rimrafAsync = promisify(rimraf);

export const globAsync = promisify(glob);

export const spawnAsync = (cmd: string, args: string[], opts: SpawnOptions & { silent: boolean }): Promise<void> => {
  return new Promise((resolve, reject) => {
    const { silent, ...spawnOpts } = opts;
    const childProcess = spawn(cmd, args, spawnOpts);

    if (!silent) {
      childProcess.stdout.on('data', (data) => process.stdout.write(data));
    }
    childProcess.on('error', (error) => reject(error));
    childProcess.on('exit', () => resolve());
  });
};

export const showInfo = (message: string, silent = false): Promise<void> => {
  if (!silent) {
    console.info(`> ${message}`);
  }

  return Promise.resolve();
};

// rename Angular CLI config temporarily
export const backupCliConfig = (configPath: string, tmpPath: string): Promise<void> => renameAsync(configPath, tmpPath);

// restore Angular CLI config on abort or finish
export const restoreCliConfig = (configPath: string, tmpPath: string): Promise<void> => renameAsync(tmpPath, configPath);
export const restoreCliConfigSync = (configPath: string, tmpPath: string) => {
  try {
    renameSync(tmpPath, configPath);
  } catch (error) {
    // noop
  }

  process.exit();
};

export const handleError = (message: string, error: Error, options?: Options.TestOptions) => {
  console.error(`> Error: ${message}`);
  console.error(`> ${error.message}`);

  // try to restore cli config
  if (options) {
    restoreCliConfigSync(options.angularConfigPath, options.angularConfigTmpPath);
  }

  process.exit(1);
};
