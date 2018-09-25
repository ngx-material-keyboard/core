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

// modify karma config
export const addHeadlessChromeToKarma = (cwd: string, encoding = 'utf8'): Promise<void> => {
  let karmaFilePath: string;
  return Helpers
    .globAsync(`${cwd}/{src,.}/karma.conf.js`)
    .then(([filePath]) => {
      karmaFilePath = filePath;
      return Helpers.readFileAsync(karmaFilePath, encoding);
    })
    .then((karmaConfig: string) => karmaConfig.replace(
      /(browsers: \['Chrome'\]),\s*\n*(singleRun)/g,
      `$1,
      customLaunchers: {
        ChromeHeadlessCI: {
          base: 'ChromeHeadless',
          flags: ['--no-sandbox', '--disable-gpu']
        }
      },
      $2`
    ))
    .then((karmaConfig: string) => Helpers.writeFileAsync(karmaFilePath, karmaConfig, { encoding }));
};

// modify protractor config
export const addHeadlessChromeToProtractor = (cwd: string, encoding = 'utf8'): Promise<void> => {
  let protractorFilePath: string;
  return Helpers
    .globAsync(`${cwd}/{e2e,.}/protractor.conf.js`)
    .then(([filePath]) => {
      protractorFilePath = filePath;
      return Helpers.readFileAsync(protractorFilePath, encoding);
    })
    .then((protractorConfig: string) => protractorConfig.replace(
      /('browserName': 'chrome')\n+/g,
      `$1,
      chromeOptions: {
        args: ['--headless', '--no-sandbox', '--disable-gpu']
      }`
    ))
    .then((protractorConfig: string) => Helpers.writeFileAsync(protractorFilePath, protractorConfig, { encoding }));
};

// modify karma and protractor config
export const addHeadlessChrome = (cwd: string, encoding = 'utf8'): Promise<any[]> => {
  let karmaFilePath: string;
  let protractorFilePath: string;
  return Promise.all([
    addHeadlessChromeToKarma(cwd, encoding),
    addHeadlessChromeToProtractor(cwd, encoding)
  ]);
};

// show installed angular version
export const version = (cwd: string, binPath: string, silent = false): Promise<void> => {
  return Helpers.spawnAsync(binPath, ['--version'], { cwd, silent });
};
