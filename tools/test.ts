import * as ng from './libs/ng.lib';
import * as npm from './libs/npm.lib';
import * as Helpers from './test-helpers';
import * as Options from './test-options';
import * as Run from './test-run';

// TODO: provide as separate module
// TODO: allow providing options as config json (e.g. .ng-testbeds.json
let options: Options.TestOptions;

// run preparations
Promise.resolve()
  .then(Options.parse)
  .then(Options.setDefaults)
  .then(Options.validate)
  .then(Options.enrich)
  .then((opts) => options = opts)

  // .then(() => Helpers.showInfo('Run e2e tests'))
  // .then(() => Run.e2eTests(options.testProjectDir, options.silent))
  // .then(() => process.exit())

  .then(() => Helpers.showInfo('Backup Angular CLI config temporarily'))
  .then(() => Helpers.backupCliConfig(options.angularConfigPath, options.angularConfigTmpPath))
  .catch((error: Error) => Helpers.handleError('Failed to backup Angular CLI config', error, options))

  .then(() => Helpers.showInfo('Create work dir'))
  .then(() => Helpers.mkdirpAsync(options.cliWorkDir))
  .catch((error: Error) => Helpers.handleError('Failed to create work dir', error, options))

  .then(() => Helpers.showInfo('Initialize CLI environment'))
  .then(() => npm.initialize(options.cliWorkDir, options.projectScope, options.silent))
  .catch((error: Error) => Helpers.handleError('Failed to initialize CLI environment', error, options))

  .then(() => Helpers.showInfo(`Install Angular CLI version ${options.angularCliVersion}`))
  .then(() => npm.install(options.cliWorkDir, options.silent, `@angular/cli@${options.angularCliVersion}`))
  .catch((error: Error) => Helpers.handleError('Failed to install Angular CLI', error, options))

  .then(() => Helpers.showInfo(`(Re-)Initialize new project with name ${options.testProjectName}`))
  .then(() => ng.initialize(options.cliWorkDir, options.testProjectName, options.ngBinPath, options.silent))
  .catch((error: Error) => Helpers.handleError('Failed to initialize test project', error, options))

  .then(() => Helpers.showInfo(`Pin dependencies`))
  .then(() => options.skipPinning ? Promise.resolve() : npm.pin(options.testProjectPackagePath, options.fileEncoding))
  .catch((error: Error) => Helpers.handleError('Failed to pin dependencies', error, options))

  .then(() => Helpers.showInfo(`Add Angular CDK and Material version ${options.angularMaterialVersion}`))
  .then(() => npm.add(options.testProjectPackagePath, options.silent, {
    '@angular/cdk': options.angularMaterialVersion,
    '@angular/material': options.angularMaterialVersion
  }, npm.SaveType.Save, options.fileEncoding))
  .catch((error: Error) => Helpers.handleError('Failed to add Angular CSK and Material dependensies', error, options))

  .then(() => Helpers.showInfo('Install dependencies'))
  .then(() => npm.install(options.testProjectDir, options.silent))
  .catch((error: Error) => Helpers.handleError('Failed to install dependencies', error, options))

  .then(() => Helpers.showInfo('Show installed Angular version'))
  .then(() => options.silent ? Promise.resolve() : ng.version(options.testProjectDir, options.ngBinPath, options.silent))
  .catch((error: Error) => Helpers.handleError('Failed to retrieve Angular version', error, options))

  .then(() => Helpers.showInfo('Add headless Chrome launcher for unit and e2e tests'))
  .then(() => ng.addHeadlessChrome(options.testProjectDir, options.fileEncoding))
  .catch((error: Error) => Helpers.handleError('Failed to add headless Chrome configs', error, options))

  // TODO: implement: copy core
  // TODO: implement: add tests

  .then(() => Helpers.showInfo('Run unit tests'))
  .then(() => Run.unitTests(options.testProjectDir, options.silent))
  .catch((error: Error) => Helpers.handleError('Unit tests failed', error, options))

  .then(() => Helpers.showInfo('Run e2e tests'))
  .then(() => Run.e2eTests(options.testProjectDir, options.silent))
  .catch((error: Error) => Helpers.handleError('End-toend tests failed', error, options))

  .then(() => Helpers.showInfo('Restore Angular CLI config'))
  .then(() => Helpers.restoreCliConfig(options.angularConfigPath, options.angularConfigTmpPath))
  .catch((error: Error) => Helpers.handleError('Failed to restore Angular CLI config', error))

  .catch((error) => {
    // generic error
    console.error(error);
    process.exit(1);
  });

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
// (process as NodeJS.EventEmitter).on('uncaughtException', () => restoreCliConfigSync(options.angularConfigPath, options.angularConfigTmpPath));
