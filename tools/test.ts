import * as argv from 'minimist'; // tslint:disable-line no-implicit-dependencies
import * as mkdirp from 'mkdirp'; // tslint:disable-line no-implicit-dependencies
import * as rimraf from 'rimraf'; // tslint:disable-line no-implicit-dependencies

import { spawn, SpawnOptions } from 'child_process';
import { rename, renameSync } from 'fs';
import { EOL } from 'os';
import { join as joinPath } from 'path';
import { promisify } from 'util';

// get params
const params = argv(process.argv.slice(2));

// show help message if flag is present
if ('help' in params || 'h' in params) {
  const help = [
    '> Prepares a test bed for a given Angular version using the Angular CLI',
    ` Command\t\tAlias\tDescription`,
    ` --angularVersion\t-a\tDefines the name of the Angular version to use, e.g. 5.1.x`,
    ` --angularCliVersion\t-c\tThe Angular CLI version to use, e.g. 1.5.6`,
    ` --help\t\t\t-h\tShows this help message`,
    ` --silent\t\t\tSilences the output`
  ];
  console.info(help.join(EOL));
  process.exit();
}

// TODO: provide as separate module
// TODO: allow providing options as config json (e.g. .ng-testbeds.json
// TODO: add Angular version to CLI mapping to project
// TODO: structure functions and utilities
// TODO: use function to parse params and queue resulting config object through functions
// prepare options
const options = {
  angularVersion: params.angularVersion || params.a,
  angularCliVersion: params.angularCliVersion || params.c,
  silent: JSON.parse(params.silent || false),
  angularConfigPath: '.angular-cli.json',
  angularConfigTmpPath: '.angular-cli.json.tmp',
  tempDir: '.temp',
  projectScope: '@ngx-material-keyboard',
  testProjectName: 'ngx-test',
  ngBinPath: 'node_modules/.bin/ng'
};

// exit if something is missing
if (!options.angularVersion) {
  throw new Error('No Angular Version given. Use --angularVersion or -a flag.');
}
if (!options.angularCliVersion) {
  throw new Error('No Angular CLI Version given. Use --angularCliVersion or -c flag.');
}

// prepare paths
const cliWorkDir = joinPath(options.tempDir, options.angularVersion);
const testProjectDir = joinPath(options.tempDir, options.angularVersion, options.testProjectName);

// turn async functions to return promises
const renameAsync = promisify(rename);
const mkdirpAsync = promisify(mkdirp);
const rimrafAsync = promisify(rimraf);
const spawnAsync = (cmd: string, args: string[], opts: SpawnOptions): Promise<void> => new Promise((resolve, reject) => {
  const childProcess = spawn(cmd, args, opts);
  if (!options.silent) {
    childProcess.stdout.on('data', (data) => process.stdout.write(data));
  }
  childProcess.on('error', (error) => reject(error));
  childProcess.on('exit', () => resolve());
});

// helper functions
const showInfo = (message: string): Promise<void> => {
  if (!options.silent) {
    console.info(`> ${message}`);
  }

  return Promise.resolve();
};

const _npmInstall = (cwd: string, packageName?: string): Promise<void> => {
  const defaultOptions = [
    '--no-audit',
    '--no-optional',
    '--no-package-lock',
    '--no-progress',
    '--loglevel=error'
  ];
  const packageOptions = packageName ? [packageName, '--no-save'] : [];

  return spawnAsync(
    'npm',
    [
      'install',
      ...packageOptions,
      ...defaultOptions
    ],
    { cwd }
  );
};

// rename Angular CLI config temporarily
const backupCliConfig = (configPath: string, tmpPath: string): Promise<void> => renameAsync(configPath, tmpPath);

// restore Angular CLI config on abort or finish
const restoreCliConfig = (configPath: string, tmpPath: string): Promise<void> => renameAsync(tmpPath, configPath);
const restoreCliConfigSync = (configPath: string, tmpPath: string) => {
  try {
    renameSync(tmpPath, configPath);
  } catch (error) {
    // noop
  }

  process.exit();
};

// create environment and enter it
const createTempDir = (angularTempDir: string): Promise<{}> => mkdirpAsync(angularTempDir);

// initialize CLI environment
const initializeNpmProject = (cwd: string, projectScope: string): Promise<void> => spawnAsync(
  'npm',
  [
    'init',
    '--yes',
    `--scope ${projectScope}`
  ],
  { cwd }
);

// install CLI
const installCli = (cwd: string, cliVersion: string): Promise<void> => _npmInstall(cwd, `@angular/cli@${cliVersion}`);

// (re)initialize new project
const reinitializeTestProject = (cwd: string, testProjectName: string): Promise<any[]> => Promise
  .all([
    rimrafAsync(joinPath(cwd, testProjectName)),
    spawnAsync(
      options.ngBinPath,
      [
        'new', testProjectName,
        '--force',
        '--skip-git',
        '--skip-install'
      ],
      { cwd }
    )
  ]);

// TODO: implement the following
// prepare ci tests - Add headless chrome launcher for unit tests
// prepare ci tests - Add headless chrome launcer for e2e tests
// link module
// add tests
// run unit tests
// run e2e tests

// install dependencies
const installDependencies = (cwd: string): Promise<void> => _npmInstall(cwd);

// show installed angular version
const installedAngularVersion = (cwd: string): Promise<void> => {
  if (options.silent) {
    return Promise.resolve();
  } else {
    return spawnAsync(options.ngBinPath, ['--version'], { cwd });
  }
};

// TODO: use function to run the program
// run preparations
Promise
  .resolve()
  .then(() => showInfo(`Preparing test bed for Angular ${options.angularVersion} using Angular CLI version ${options.angularCliVersion}`))

  .then(() => showInfo('Backup Angular CLI config temporarily'))
  .then(() => backupCliConfig(options.angularConfigPath, options.angularConfigTmpPath))

  .then(() => showInfo('Create environment and enter it'))
  .then(() => createTempDir(cliWorkDir))

  .then(() => showInfo('Initialize CLI environment'))
  .then(() => initializeNpmProject(cliWorkDir, options.projectScope))

  .then(() => showInfo(`Install Angular CLI version ${options.angularCliVersion}`))
  .then(() => installCli(cliWorkDir, options.angularCliVersion))

  .then(() => showInfo(`(Re-)Initialize new project with name ${options.testProjectName}`))
  .then(() => reinitializeTestProject(cliWorkDir, options.testProjectName))

  .then(() => showInfo('Install dependencies'))
  .then(() => installDependencies(testProjectDir))

  .then(() => showInfo('Show installed Angular version'))
  .then(() => installedAngularVersion(testProjectDir))

  .then(() => showInfo('Restore Angular CLI config'))
  .then(() => restoreCliConfig(options.angularConfigPath, options.angularConfigTmpPath))

  .catch((error) => console.error(error));

// TODO: improve and stabilize
// TODO: use function on exiting the program
// force cleanup on exit
// s. https://stackoverflow.com/a/14032965/1146207
// s. https://github.com/electron/electron/issues/9626#issuecomment-305581504
// process.stdin.resume();
//
// // catches ctrl+c event
// (process as NodeJS.EventEmitter).on('SIGINT', () => restoreCliConfigSync(options.angularConfigPath, options.angularConfigTmpPath));
//
// // catches "kill pid" (for example: nodemon restart)
// (process as NodeJS.EventEmitter).on('SIGUSR1', () => restoreCliConfigSync(options.angularConfigPath, options.angularConfigTmpPath));
// (process as NodeJS.EventEmitter).on('SIGUSR2', () => restoreCliConfigSync(options.angularConfigPath, options.angularConfigTmpPath));
//
// // catches uncaught exceptions
// (process as NodeJS.EventEmitter).on('uncaughtException', () => restoreCliConfigSync(options.angularConfigPath, options.angularConfigTmpPath));
