import { InjectionToken } from '@angular/core';

type KeyboardClasses = string[];

const MD_KEYBOARD_CLASSES = new InjectionToken<KeyboardClasses>('keyboard-classes.config');
const keyboardClasses: KeyboardClasses = ['altgr', 'bksp', 'caps', 'ctrl', 'enter', 'shift', 'space', 'tab'];

export { KeyboardClasses, MD_KEYBOARD_CLASSES, keyboardClasses };
