import { ElementRef } from '@angular/core';
import { NgControl } from '@angular/forms';
import { MdKeyboardService } from '../services/keyboard.service';
export declare class MdKeyboardDirective {
    private _elementRef;
    private _keyboardService;
    private _ngControl;
    private _keyboardRef;
    mdKeyboard: string;
    darkTheme: boolean;
    duration: number;
    hasAction: boolean;
    isDebug: boolean;
    private _showKeyboard();
    private _hideKeyboard();
    constructor(_elementRef: ElementRef, _keyboardService: MdKeyboardService, _ngControl: NgControl);
}
