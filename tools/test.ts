import * as Helpers from './test-helpers';
import * as ng from './test-ng';
import * as npm from './test-npm';
import * as Options from './test-options';

// TODO: provide as separate module
// TODO: allow providing options as config json (e.g. .ng-testbeds.json

// TODO: implement: prepare ci tests - Add headless chrome launcher for unit tests
// TODO: implement: prepare ci tests - Add headless chrome launcer for e2e tests
// TODO: implement: link module
// TODO: implement: add tests
// TODO: implement: run unit tests
// TODO: implement: run e2e tests

let options: Options.TestOptions;

// run preparations
Promise.resolve()
  .then(Options.parse)
  .then(Options.setDefaults)
  .then(Options.validate)
  .then(Options.enrich)
  .then((opts) => options = opts)

  .then(() => Helpers.showInfo('Backup Angular CLI config temporarily'))
  .then(() => Helpers.backupCliConfig(options.angularConfigPath, options.angularConfigTmpPath))

  .then(() => Helpers.showInfo('Create work dir'))
  .then(() => Helpers.mkdirpAsync(options.cliWorkDir))

  .then(() => Helpers.showInfo('Initialize CLI environment'))
  .then(() => npm.initialize(options.cliWorkDir, options.projectScope, options.silent))

  .then(() => Helpers.showInfo(`Install Angular CLI version ${options.angularCliVersion}`))
  .then(() => npm.install(options.cliWorkDir, options.silent, `@angular/cli@${options.angularCliVersion}`))

  .then(() => Helpers.showInfo(`(Re-)Initialize new project with name ${options.testProjectName}`))
  .then(() => ng.initialize(options.cliWorkDir, options.testProjectName, options.ngBinPath, options.silent))

  .then(() => Helpers.showInfo(`Pin dependencies`))
  .then(() => npm.pin(options.testProjectPackagePath, options.fileEncoding))

  .then(() => Helpers.showInfo('Install dependencies'))
  .then(() => npm.install(options.testProjectDir, options.silent))

  .then(() => Helpers.showInfo('Show installed Angular version'))
  .then(() => ng.version(options.testProjectDir, options.ngBinPath, options.silent))

  .then(() => Helpers.showInfo('Restore Angular CLI config'))
  .then(() => Helpers.restoreCliConfig(options.angularConfigPath, options.angularConfigTmpPath))

  .catch((error) => {
    // log and exit process
    console.error(error);
    throw error;
  })
  .catch(() => process.exit(1));

// TODO: improve, stabilize and finalize
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
// (process as NodeJS.EventEmitter).on('uncaughtException', () => restoreCliConfigSync(options.angularConfigPath,
// options.angularConfigTmpPath));
