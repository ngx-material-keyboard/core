import { ElementRef, OnDestroy } from '@angular/core';
import { MdKeyboardService } from '../services/keyboard.service';
export declare class MdKeyboardDirective implements OnDestroy {
    private _elementRef;
    private _keyboardService;
    private _keyboardRef;
    mdKeyboard: string;
    darkTheme: boolean;
    duration: number;
    hasAction: boolean;
    isDebug: boolean;
    private _showKeyboard();
    private _hideKeyboard();
    constructor(_elementRef: ElementRef, _keyboardService: MdKeyboardService);
    ngOnDestroy(): void;
}
