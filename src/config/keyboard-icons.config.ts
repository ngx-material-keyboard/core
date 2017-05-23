import { InjectionToken } from '@angular/core';

interface IKeyboardIcons {
  [key: string]: string;
}

const MD_KEYBOARD_ICONS = new InjectionToken<IKeyboardIcons>('keyboard-icons.config');
const keyboardIcons: IKeyboardIcons = {
  'bksp': 'keyboard_backspace',
  'caps': 'keyboard_capslock',
  'enter': 'keyboard_return',
  'tab': 'keyboard_tab'
};

export { IKeyboardIcons, MD_KEYBOARD_ICONS, keyboardIcons };
