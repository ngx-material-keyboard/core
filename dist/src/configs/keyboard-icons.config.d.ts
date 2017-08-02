import { InjectionToken } from '@angular/core';
interface IKeyboardIcons {
    [key: string]: string;
}
declare const MD_KEYBOARD_ICONS: InjectionToken<IKeyboardIcons>;
declare const keyboardIcons: IKeyboardIcons;
export { IKeyboardIcons, MD_KEYBOARD_ICONS, keyboardIcons };
