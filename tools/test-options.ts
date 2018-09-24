import * as argv from 'minimist'; // tslint:disable-line no-implicit-dependencies
import { EOL } from 'os';
import { join as joinPath } from 'path';
import * as helpers from './test-helpers';

export interface CliVersionMappings {
  [angularVersion: string]: string;
}

export interface DefaultTestOptions {
  angularVersion: '5.1.x' | '5.2.x' | '6.0.x' | '6.1.x' | '7.0.x';
  silent: boolean;
  angularConfigPath: string;
  angularConfigTmpPath: string;
  tempDir: string;
  projectScope: string;
  testProjectName: string;
  ngBinPath: string;
  fileEncoding: string;
  mappings: CliVersionMappings;
}

export interface TestOptions extends DefaultTestOptions {
  angularCliVersion: string;
  cliWorkDir: string;
  testProjectDir: string;
  testProjectPackagePath: string;
}

export const mappings: CliVersionMappings = {
  '5.1.x': '1.5.6', // 5.1.0 - 5.1.3
  '5.2.x': '1.7.4', // 5.2.0 - 5.2.11
  '6.0.x': '6.0.8', // 6.0.0 - 6.0.9
  '6.1.x': '6.2.3', // 6.1.0 - 6.1.8
  '7.0.x': '7.0.0-beta.4', // 7.0.0 beta
};

export const cliVersions = Object
  .keys(mappings)
  .join(', ');

export const defaultTestOptions: Partial<DefaultTestOptions> = {
  silent: false,
  angularConfigPath: '.angular-cli.json',
  angularConfigTmpPath: '.angular-cli.json.tmp',
  tempDir: '.temp',
  projectScope: '@ngx-material-keyboard',
  testProjectName: 'ngx-test',
  ngBinPath: 'node_modules/.bin/ng',
  fileEncoding: 'utf8',
  mappings
};

export const parse = (): Promise<object> => {
  // get params
  const params = argv(process.argv.slice(2));

  // show help message if flag is present
  if ('help' in params || 'h' in params) {
    return helpers
      .showInfo([
        '> Prepares a test bed for a given Angular version using the Angular CLI',
        ` Command\t\tAlias\tDescription`,
        ` --angularVersion\t-a\tDefines the Angular version to use, must be one of`,
        ` \t\t\t\t${cliVersions}`,
        ` --config\t\t-c\tAn config object`,
        ` --help\t\t\t-h\tShows this help message`,
        ` --silent\t\t-s\tSilences the output`
      ].join(EOL))
      .then(() => process.exit());
  }

  return Promise.resolve(params);
};

export const setDefaults = (params: any): Promise<TestOptions> => Promise.resolve({
  ...defaultTestOptions,
  angularVersion: params.angularVersion || params.a,
  silent: JSON.parse(params.silent || params.s || defaultTestOptions.silent),
  ...(params.config || params.c || {})
});

export const validate = (options: TestOptions): Promise<TestOptions> => new Promise((resolve, reject) => {
  if (!options.angularVersion) {
    reject(`No Angular Version given. Use --angularVersion or -a flag.`);
  }
  if (!(options.angularVersion in options.mappings)) {
    reject(`No Angular CLI version known for Angular version ${options.angularVersion}. Must be one of ${cliVersions}`);
  }

  resolve(options);
});

export const enrich = (options: TestOptions): Promise<TestOptions> => Promise.resolve({
  ...options,
  angularCliVersion: options.mappings[options.angularVersion],
  cliWorkDir: joinPath(options.tempDir, options.angularVersion),
  testProjectDir: joinPath(options.tempDir, options.angularVersion, options.testProjectName),
  testProjectPackagePath: joinPath(options.tempDir, options.angularVersion, options.testProjectName, 'package.json')
});
