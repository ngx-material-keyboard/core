import { InjectionToken } from '@angular/core';
interface IKeyboardLayout {
    name: string;
    keys: string[][][];
    lang?: string[];
}
interface IKeyboardLayouts {
    [layout: string]: IKeyboardLayout;
}
declare const MD_KEYBOARD_LAYOUTS: InjectionToken<IKeyboardLayouts>;
declare const keyboardLayouts: IKeyboardLayouts;
export { IKeyboardLayout, IKeyboardLayouts, keyboardLayouts, MD_KEYBOARD_LAYOUTS };
