import { ElementRef } from '@angular/core';
import { MdKeyboardService } from '../services/keyboard.service';
import { NgControl } from "@angular/forms";
export declare class MdKeyboardDirective {
    private _elementRef;
    private _keyboardService;
    private ngControl;
    private _keyboardRef;
    mdKeyboard: string;
    darkTheme: boolean;
    duration: number;
    hasAction: boolean;
    isDebug: boolean;
    private _showKeyboard();
    private _hideKeyboard();
    constructor(_elementRef: ElementRef, _keyboardService: MdKeyboardService, ngControl: NgControl);
}
