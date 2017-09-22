import { InjectionToken } from '@angular/core';
import { KeyboardClassKey } from '../enums/keyboard-class-key.enum';
import { IKeyboardIcons } from '../interfaces/keyboard-icons.interface';

const MD_KEYBOARD_ICONS = new InjectionToken<IKeyboardIcons>('keyboard-icons.config');
const keyboardIcons: IKeyboardIcons = {
  [KeyboardClassKey.Bksp.toString()]: 'keyboard_backspace',
  [KeyboardClassKey.Caps.toString()]: 'keyboard_capslock',
  [KeyboardClassKey.Enter.toString()]: 'keyboard_return',
  [KeyboardClassKey.Space.toString()]: '',
  [KeyboardClassKey.Tab.toString()]: 'keyboard_tab'
};

export { IKeyboardIcons, MD_KEYBOARD_ICONS, keyboardIcons };
