import { ComponentRef, Inject, Injectable, LOCALE_ID, Optional, SkipSelf } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { MD_KEYBOARD_LAYOUTS } from '../configs/keyboard-layouts.config';
import { ILocaleMap } from '../interfaces/locale-map.interface';
import { IKeyboardLayouts } from '../interfaces/keyboard-layouts.interface';
import { IKeyboardLayout } from '../interfaces/keyboard-layout.interface';
import { MdKeyboardRef } from '../utils/keyboard-ref.class';
import { MdKeyboardContainerComponent } from '../components/keyboard-container/keyboard-container.component';
import { MdKeyboardComponent } from '../components/keyboard/keyboard.component';
import { MdKeyboardConfig } from '../configs/keyboard.config';

/**
 * Service to dispatch Material Design keyboard.
 */
@Injectable()
export class MdKeyboardService {
  /**
   * Reference to the current keyboard in the view *at this level* (in the Angular injector tree).
   * If there is a parent keyboard service, all operations should delegate to that parent
   * via `_openedKeyboardRef`.
   */
  private _keyboardRefAtThisLevel: MdKeyboardRef<MdKeyboardComponent> | null = null;

  /** Reference to the currently opened keyboard at *any* level. */
  get _openedKeyboardRef(): MdKeyboardRef<MdKeyboardComponent> | null {
    const parent = this._parentKeyboard;
    return parent ? parent._openedKeyboardRef : this._keyboardRefAtThisLevel;
  }

  set _openedKeyboardRef(value: MdKeyboardRef<MdKeyboardComponent>) {
    if (this._parentKeyboard) {
      this._parentKeyboard._openedKeyboardRef = value;
    } else {
      this._keyboardRefAtThisLevel = value;
    }
  }

  private _availableLocales: ILocaleMap = {};

  get availableLocales(): ILocaleMap {
    return this._availableLocales;
  }

  get isOpened(): boolean {
    return !!this._openedKeyboardRef;
  }

  constructor(private _overlay: Overlay,
              private _live: LiveAnnouncer,
              @Inject(LOCALE_ID) private _defaultLocale: string,
              @Inject(MD_KEYBOARD_LAYOUTS) private _layouts,
              @Optional() @SkipSelf() private _parentKeyboard: MdKeyboardService) {
    // prepare available layouts mapping
    this._availableLocales = _applyAvailableLayouts(_layouts);
  }

  /**
   * Creates and dispatches a keyboard with a custom component for the content, removing any
   * currently opened keyboards.
   *
   * @param {string} layoutOrLocale layout or locale to use.
   * @param {MdKeyboardConfig} config Extra configuration for the keyboard.
   * @returns {MdKeyboardRef<MdKeyboardComponent>}
   */
  openFromComponent(layoutOrLocale: string, config: MdKeyboardConfig): MdKeyboardRef<MdKeyboardComponent> {
    const keyboardRef: MdKeyboardRef<MdKeyboardComponent> = this._attachKeyboardContent(config);

    keyboardRef.darkTheme = config.darkTheme;
    keyboardRef.hasAction = config.hasAction;
    keyboardRef.isDebug = config.isDebug;

    // a locale is provided
    if (this.availableLocales[layoutOrLocale]) {
      keyboardRef.instance.locale = layoutOrLocale;
      keyboardRef.instance.layout = this.getLayoutForLocale(layoutOrLocale);
    }

    // a layout name is provided
    if (this._layouts[layoutOrLocale]) {
      keyboardRef.instance.layout = this._layouts[layoutOrLocale];
      keyboardRef.instance.locale = this._layouts[layoutOrLocale].lang &&
        this._layouts[layoutOrLocale].lang.pop();
    }

    // When the keyboard is dismissed, clear the reference to it.
    keyboardRef.afterDismissed().subscribe(() => {
      // Clear the keyboard ref if it hasn't already been replaced by a newer keyboard.
      if (this._openedKeyboardRef === keyboardRef) {
        this._openedKeyboardRef = null;
      }
    });

    if (this._openedKeyboardRef) {
      // If a keyboard is already in view, dismiss it and enter the
      // new keyboard after exit animation is complete.
      this._openedKeyboardRef.afterDismissed().subscribe(() => {
        keyboardRef.containerInstance.enter();
      });
      this._openedKeyboardRef.dismiss();
    } else {
      // If no keyboard is in view, enter the new keyboard.
      keyboardRef.containerInstance.enter();
    }

    // If a dismiss timeout is provided, set up dismiss based on after the keyboard is opened.
    // if (configs.duration > 0) {
    //   keyboardRef.afterOpened().subscribe(() => {
    //     setTimeout(() => keyboardRef.dismiss(), configs.duration);
    //   });
    // }

    if (config.announcementMessage) {
      this._live.announce(config.announcementMessage, config.politeness);
    }

    this._openedKeyboardRef = keyboardRef;
    return this._openedKeyboardRef;
  }

  /**
   * Opens a keyboard with a message and an optional action.
   * @param {string} layoutOrLocale A string representing the locale or the layout name to be used.
   * @param {MdKeyboardConfig} config Additional configuration options for the keyboard.
   * @returns {MdKeyboardRef<MdKeyboardComponent>}
   */
  open(layoutOrLocale: string = this._defaultLocale, config: MdKeyboardConfig = {}): MdKeyboardRef<MdKeyboardComponent> {
    const _config = _applyConfigDefaults(config);

    return this.openFromComponent(layoutOrLocale, _config);
  }

  /**
   * Dismisses the currently-visible keyboard.
   */
  dismiss(): void {
    if (this._openedKeyboardRef) {
      this._openedKeyboardRef.dismiss();
    }
  }

  /**
   * Map a given locale to a layout name.
   * @param {string} locale
   * @returns {string} The layout name
   */
  mapLocale(locale: string = this._defaultLocale): string {
    let layout: string;
    const country = locale.split('-').shift();

    // search for layout matching the
    // first part, the country code
    if (this.availableLocales[country]) {
      layout = this.availableLocales[locale];
    }

    // look if the detailed locale matches any layout
    if (this.availableLocales[locale]) {
      layout = this.availableLocales[locale];
    }

    if (!layout) {
      throw Error(`No layout found for locale ${locale}`);
    }

    return layout;
  }

  getLayoutForLocale(locale: string): IKeyboardLayout {
    return this._layouts[this.mapLocale(locale)];
  }

  /**
   * Attaches the keyboard container component to the overlay.
   */
  private _attachKeyboardContainer(overlayRef: OverlayRef, config: MdKeyboardConfig): MdKeyboardContainerComponent {
    const containerPortal = new ComponentPortal(MdKeyboardContainerComponent, config.viewContainerRef);
    const containerRef: ComponentRef<MdKeyboardContainerComponent> = overlayRef.attach(containerPortal);

    containerRef.instance.keyboardConfig = config;
    containerRef.instance.darkTheme = config.darkTheme;

    return containerRef.instance;
  }

  /**
   * Places a new component as the content of the keyboard container.
   */
  private _attachKeyboardContent(config: MdKeyboardConfig): MdKeyboardRef<MdKeyboardComponent> {
    const overlayRef = this._createOverlay();
    const container = this._attachKeyboardContainer(overlayRef, config);
    const portal = new ComponentPortal(MdKeyboardComponent);
    const contentRef = container.attachComponentPortal(portal);
    return new MdKeyboardRef(contentRef.instance, container, overlayRef) as MdKeyboardRef<MdKeyboardComponent>;
  }

  /**
   * Creates a new overlay and places it in the correct location.
   */
  private _createOverlay(): OverlayRef {
    const state = new OverlayConfig();

    state.positionStrategy = this._overlay.position().global()
      .centerHorizontally()
      .bottom('0')
      .width('100%');

    return this._overlay.create(state);
  }
}

/**
 * Applies default options to the keyboard configs.
 * @param config The configuration to which the defaults will be applied.
 * @returns The new configuration object with defaults applied.
 * @private
 */
function _applyConfigDefaults(config: MdKeyboardConfig): MdKeyboardConfig {
  return Object.assign(new MdKeyboardConfig(), config);
}

/**
 * Applies available layouts.
 * @param {IKeyboardLayouts} layouts
 * @returns {ILocaleMap}
 * @private
 */
function _applyAvailableLayouts(layouts: IKeyboardLayouts): ILocaleMap {
  const _availableLocales: ILocaleMap = {};

  Object
    .keys(layouts)
    .forEach(layout => {
      if (layouts[layout].lang) {
        layouts[layout].lang.forEach(lang => {
          _availableLocales[lang] = layout;
        });
      }
    });

  return _availableLocales;
}
