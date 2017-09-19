import { LiveAnnouncer, Overlay } from '@angular/material';
import { IKeyboardLayout } from '../configs/keyboard-layouts.config';
import { MdKeyboardRef } from '../utils/keyboard-ref.class';
import { MdKeyboardComponent } from '../components/keyboard/keyboard.component';
import { MdKeyboardConfig } from '../configs/keyboard.config';
export interface ILocaleMap {
    [locale: string]: string;
}
/**
 * Service to dispatch Material Design keyboard.
 */
export declare class MdKeyboardService {
    private _overlay;
    private _live;
    private _layouts;
    private _parentKeyboard;
    /**
     * Reference to the current keyboard in the view *at this level* (in the Angular injector tree).
     * If there is a parent keyboard service, all operations should delegate to that parent
     * via `_openedKeyboardRef`.
     */
    private _keyboardRefAtThisLevel;
    openKeyboards: number;
    /** Reference to the currently opened keyboard at *any* level. */
    _openedKeyboardRef: MdKeyboardRef<any>;
    private _availableLocales;
    readonly availableLocales: ILocaleMap;
    readonly isOpened: boolean;
    constructor(_overlay: Overlay, _live: LiveAnnouncer, _layouts: any, _parentKeyboard: MdKeyboardService);
    /**
     * Creates and dispatches a keyboard with a custom component for the content, removing any
     * currently opened keyboards.
     *
     * @param component Component to be instantiated.
     * @param config Extra configuration for the keyboard.
     */
    private _openFromComponent<T>(component, config?);
    /**
     * Opens a keyboard with a message and an optional action.
     * @param layoutOrLocale [Optional] A string representing the locale or the layout name to be used.
     * @param config Additional configuration options for the keyboard.
     */
    open(layoutOrLocale?: string, config?: MdKeyboardConfig): MdKeyboardRef<MdKeyboardComponent>;
    /**
     * Dismisses the currently-visible keyboard.
     */
    dismiss(): void;
    mapLocale(locale: string): string;
    getLayoutForLocale(locale: string): IKeyboardLayout;
    /**
     * Attaches the keyboard container component to the overlay.
     */
    private _attachKeyboardContainer(overlayRef, config);
    /**
     * Places a new component as the content of the keyboard container.
     */
    private _attachKeyboardContent<T>(component, container, overlayRef);
    /**
     * Creates a new overlay and places it in the correct location.
     */
    private _createOverlay();
}
