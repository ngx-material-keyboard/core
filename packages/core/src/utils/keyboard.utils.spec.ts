import { MatKeyboardConfig } from '../configs/keyboard.config';
import { IKeyboardLayouts } from '../interfaces/keyboard-layouts.interface';
import { _applyAvailableLayouts, _applyConfigDefaults } from './keyboard.utils';

describe('Keyboard utils', () => {

  let testConfig: MatKeyboardConfig;
  let testLayouts: IKeyboardLayouts;

  beforeEach(() => {
    testConfig = {
      duration: 42
    };
    testLayouts = {
      testLayout: {
        name: 'test layout',
        keys: [[['foo', 'bar']]],
        lang: ['de-DE']
      }
    };
  });

  it('should apply the default config', () => {
    const defaultConfig = _applyConfigDefaults(testConfig);
    expect('isDebug' in defaultConfig)
      .toBeTruthy();
  });

  it('should not change existing config values', () => {
    const defaultConfig = _applyConfigDefaults(testConfig);
    expect(defaultConfig.duration)
      .toBe(42);
  });

  it('should transform keyboard layouts by language', () => {
    const transformedLayouts = _applyAvailableLayouts(testLayouts);
    expect('de-DE' in transformedLayouts)
      .toBeTruthy();
  });

  it('should transform keyboard layouts and contain test layout in language', () => {
    const transformedLayouts = _applyAvailableLayouts(testLayouts);
    expect(transformedLayouts['de-DE'])
      .toBe('testLayout');
  });

});
