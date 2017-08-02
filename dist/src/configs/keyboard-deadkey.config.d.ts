import { InjectionToken } from '@angular/core';
interface IKeyboardDeadkeys {
    [deadkey: string]: {
        [target: string]: string;
    };
}
declare const MD_KEYBOARD_DEADKEYS: InjectionToken<IKeyboardDeadkeys>;
declare const keyboardDeadkeys: IKeyboardDeadkeys;
export { IKeyboardDeadkeys, MD_KEYBOARD_DEADKEYS, keyboardDeadkeys };
