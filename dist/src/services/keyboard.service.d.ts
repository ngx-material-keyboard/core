import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Overlay } from '@angular/cdk/overlay';
import { ILocaleMap } from '../interfaces/locale-map.interface';
import { IKeyboardLayout } from '../interfaces/keyboard-layout.interface';
import { MdKeyboardRef } from '../utils/keyboard-ref.class';
import { MdKeyboardComponent } from '../components/keyboard/keyboard.component';
import { MdKeyboardConfig } from '../configs/keyboard.config';
/**
 * Service to dispatch Material Design keyboard.
 */
export declare class MdKeyboardService {
    private _overlay;
    private _live;
    private _defaultLocale;
    private _layouts;
    private _parentKeyboard;
    /**
     * Reference to the current keyboard in the view *at this level* (in the Angular injector tree).
     * If there is a parent keyboard service, all operations should delegate to that parent
     * via `_openedKeyboardRef`.
     */
    private _keyboardRefAtThisLevel;
    /** Reference to the currently opened keyboard at *any* level. */
    _openedKeyboardRef: MdKeyboardRef<MdKeyboardComponent> | null;
    private _availableLocales;
    readonly availableLocales: ILocaleMap;
    readonly isOpened: boolean;
    constructor(_overlay: Overlay, _live: LiveAnnouncer, _defaultLocale: string, _layouts: any, _parentKeyboard: MdKeyboardService);
    /**
     * Creates and dispatches a keyboard with a custom component for the content, removing any
     * currently opened keyboards.
     *
     * @param {string} layoutOrLocale layout or locale to use.
     * @param {MdKeyboardConfig} config Extra configuration for the keyboard.
     * @returns {MdKeyboardRef<MdKeyboardComponent>}
     */
    openFromComponent(layoutOrLocale: string, config: MdKeyboardConfig): MdKeyboardRef<MdKeyboardComponent>;
    /**
     * Opens a keyboard with a message and an optional action.
     * @param {string} layoutOrLocale A string representing the locale or the layout name to be used.
     * @param {MdKeyboardConfig} config Additional configuration options for the keyboard.
     * @returns {MdKeyboardRef<MdKeyboardComponent>}
     */
    open(layoutOrLocale?: string, config?: MdKeyboardConfig): MdKeyboardRef<MdKeyboardComponent>;
    /**
     * Dismisses the currently-visible keyboard.
     */
    dismiss(): void;
    /**
     * Map a given locale to a layout name.
     * @param {string} locale
     * @returns {string} The layout name
     */
    mapLocale(locale?: string): string;
    getLayoutForLocale(locale: string): IKeyboardLayout;
    /**
     * Attaches the keyboard container component to the overlay.
     */
    private _attachKeyboardContainer(overlayRef, config);
    /**
     * Places a new component as the content of the keyboard container.
     */
    private _attachKeyboardContent(config);
    /**
     * Creates a new overlay and places it in the correct location.
     */
    private _createOverlay();
}
