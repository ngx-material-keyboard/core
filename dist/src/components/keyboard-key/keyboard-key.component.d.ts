import { ElementRef, EventEmitter, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';
export declare class MdKeyboardKeyComponent implements OnInit {
    private _deadkeys;
    private _icons;
    private _deadkeyKeys;
    private _iconKeys;
    key: string;
    active: boolean;
    input?: ElementRef;
    ngControl: NgControl;
    altClick: EventEmitter<void>;
    capsClick: EventEmitter<void>;
    shiftClick: EventEmitter<void>;
    readonly lowerKey: string;
    readonly charCode: number;
    readonly isClassKey: boolean;
    readonly isDeadKey: boolean;
    readonly hasIcon: boolean;
    readonly icon: string;
    readonly cssClass: string;
    constructor(_deadkeys: any, _icons: any);
    ngOnInit(): void;
    onMousedown(ev: MouseEvent): void;
    onClick(): void;
    private _triggerKeyEvent();
    private _getCursorPosition();
    private _setCursorPosition(position);
}
