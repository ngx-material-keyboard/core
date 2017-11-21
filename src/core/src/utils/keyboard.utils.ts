import { ILocaleMap } from '../interfaces/locale-map.interface';
import { IKeyboardLayouts } from '../interfaces/keyboard-layouts.interface';
import { MatKeyboardConfig } from '../configs/keyboard.config';

/**
 * Applies default options to the keyboard configs.
 * @param config The configuration to which the defaults will be applied.
 * @returns The new configuration object with defaults applied.
 * @private
 */
export function _applyConfigDefaults(config: MatKeyboardConfig): MatKeyboardConfig {
  return Object.assign(new MatKeyboardConfig(), config);
}

/**
 * Applies available layouts.
 * @param {IKeyboardLayouts} layouts
 * @returns {ILocaleMap}
 * @private
 */
export function _applyAvailableLayouts(layouts: IKeyboardLayouts): ILocaleMap {
  const _availableLocales: ILocaleMap = {};

  Object
    .keys(layouts)
    .forEach(layout => {
      if (layouts[layout].lang) {
        layouts[layout].lang.forEach(lang => {
          _availableLocales[lang] = layout;
        });
      }
    });

  return _availableLocales;
}
