import { ElementRef } from '@angular/core';
import { MatInput } from '@angular/material';
import { MdKeyboardService } from '../services/keyboard.service';
export declare class MdKeyboardDirective {
    private _elementRef;
    private _keyboardService;
    private _control;
    private _keyboardRef;
    mdKeyboard: string;
    darkTheme: boolean;
    duration: number;
    hasAction: boolean;
    isDebug: boolean;
    private _showKeyboard();
    private _hideKeyboard();
    constructor(_elementRef: ElementRef, _keyboardService: MdKeyboardService, _control?: MatInput);
}
