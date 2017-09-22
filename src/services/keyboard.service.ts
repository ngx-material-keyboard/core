import { ComponentRef, Inject, Injectable, Optional, SkipSelf } from '@angular/core';
import { ComponentPortal, ComponentType, LiveAnnouncer, Overlay, OverlayRef, OverlayState } from '@angular/material';
import { IKeyboardLayout, MD_KEYBOARD_LAYOUTS } from '../configs/keyboard-layouts.config';
import { MdKeyboardContainerComponent } from '../components/keyboard-container/keyboard-container.component';
import { MdKeyboardRef } from '../utils/keyboard-ref.class';
import { MdKeyboardComponent } from '../components/keyboard/keyboard.component';
import { MdKeyboardConfig } from '../configs/keyboard.config';
import { throwLayoutNotFound } from '../utils/keyboard-errors';

import { ILocaleMap } from '../interfaces/locale-map.interface';

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
  private _keyboardRefAtThisLevel: MdKeyboardRef<any>;

  /** Reference to the currently opened keyboard at *any* level. */
  get _openedKeyboardRef(): MdKeyboardRef<any> {
    return this._parentKeyboard ? this._parentKeyboard._openedKeyboardRef : this._keyboardRefAtThisLevel;
  }

  set _openedKeyboardRef(value: MdKeyboardRef<any>) {
    if (this._parentKeyboard) {
      this._parentKeyboard._openedKeyboardRef = value;
    } else {
      this._keyboardRefAtThisLevel = value;
    }
  }

  private _availableLocales: ILocaleMap;

  get availableLocales(): ILocaleMap {
    return this._availableLocales;
  }

  get isOpened(): boolean {
    return !!this._openedKeyboardRef;
  }

  constructor(private _overlay: Overlay,
              private _live: LiveAnnouncer,
              @Inject(MD_KEYBOARD_LAYOUTS) private _layouts,
              @Optional() @SkipSelf() private _parentKeyboard: MdKeyboardService) {
    // prepare available layouts mapping
    this._availableLocales = {};
    Object
      .keys(this._layouts)
      .forEach(layout => {
        if (this._layouts[layout].lang) {
          this._layouts[layout].lang.forEach(lang => {
            this._availableLocales[lang] = layout;
          });
        }
      });
  }

  /**
   * Creates and dispatches a keyboard with a custom component for the content, removing any
   * currently opened keyboards.
   *
   * @param component Component to be instantiated.
   * @param config Extra configuration for the keyboard.
   */
  private _openFromComponent<T>(component: ComponentType<T>, config?: MdKeyboardConfig): MdKeyboardRef<T> {
    const _config = _applyConfigDefaults(config);
    const overlayRef = this._createOverlay();
    const keyboardContainer = this._attachKeyboardContainer(overlayRef, _config);
    const keyboardRef = this._attachKeyboardContent(component, keyboardContainer, overlayRef);

    keyboardContainer.darkTheme = _config.darkTheme;

    // When the keyboard is dismissed, clear the reference to it.
    keyboardRef.afterDismissed().subscribe(() => {
      // Clear the keyboard ref if it hasn't already been replaced by a newer keyboard.
      if (this._openedKeyboardRef === keyboardRef) {
        this._openedKeyboardRef = null;
      }
    });

    // If a keyboard is already in view, dismiss it and enter the new keyboard after exit
    // animation is complete.
    if (this._openedKeyboardRef) {
      this._openedKeyboardRef.afterDismissed().subscribe(() => {
        keyboardRef.containerInstance.enter();
      });
      this._openedKeyboardRef.dismiss();
      // If no keyboard is in view, enter the new keyboard.
    } else {
      keyboardRef.containerInstance.enter();
    }

    // If a dismiss timeout is provided, set up dismiss based on after the keyboard is opened.
    // if (configs.duration > 0) {
    //   keyboardRef.afterOpened().subscribe(() => {
    //     setTimeout(() => keyboardRef.dismiss(), configs.duration);
    //   });
    // }

    this._live.announce(_config.announcementMessage, _config.politeness);
    this._openedKeyboardRef = keyboardRef;
    return this._openedKeyboardRef;
  }

  /**
   * Opens a keyboard with a message and an optional action.
   * @param layoutOrLocale [Optional] A string representing the locale or the layout name to be used.
   * @param config Additional configuration options for the keyboard.
   */
  open(layoutOrLocale?: string, config: MdKeyboardConfig = {}): MdKeyboardRef<MdKeyboardComponent> {
    const _config = _applyConfigDefaults(config);
    const keyboardComponentRef = this._openFromComponent<MdKeyboardComponent>(MdKeyboardComponent, _config);

    keyboardComponentRef.instance.keyboardRef = keyboardComponentRef;
    keyboardComponentRef.darkTheme = config.darkTheme;
    keyboardComponentRef.hasAction = config.hasAction;
    keyboardComponentRef.isDebug = config.isDebug;

    // a locale is provided
    if (this.availableLocales[layoutOrLocale]) {
      keyboardComponentRef.instance.locale = layoutOrLocale;
      keyboardComponentRef.instance.layout = this.getLayoutForLocale(layoutOrLocale);
    }

    // a layout name is provided
    if (this._layouts[layoutOrLocale]) {
      keyboardComponentRef.instance.layout = this._layouts[layoutOrLocale];
      keyboardComponentRef.instance.locale = this._layouts[layoutOrLocale].lang &&
                                             this._layouts[layoutOrLocale].lang.pop();
    }

    return keyboardComponentRef;
  }

  /**
   * Dismisses the currently-visible keyboard.
   */
  dismiss(): void {
    if (this._openedKeyboardRef) {
      this._openedKeyboardRef.dismiss();
    }
  }

  mapLocale(locale: string): string {
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
      throwLayoutNotFound(locale);
    }

    return layout;
  }

  getLayoutForLocale(locale: string): IKeyboardLayout {
    return this._layouts[this.mapLocale(locale)];
  }

  /**
   * Attaches the keyboard container component to the overlay.
   */
  private _attachKeyboardContainer(overlayRef: OverlayRef,
                                   config: MdKeyboardConfig): MdKeyboardContainerComponent {
    const containerPortal = new ComponentPortal(MdKeyboardContainerComponent, config.viewContainerRef);
    const containerRef: ComponentRef<MdKeyboardContainerComponent> = overlayRef.attach(containerPortal);
    containerRef.instance.keyboardConfig = config;

    return containerRef.instance;
  }

  /**
   * Places a new component as the content of the keyboard container.
   */
  private _attachKeyboardContent<T>(component: ComponentType<T>,
                                    container: MdKeyboardContainerComponent,
                                    overlayRef: OverlayRef): MdKeyboardRef<T> {
    const portal = new ComponentPortal(component);
    const contentRef = container.attachComponentPortal(portal);
    return new MdKeyboardRef(contentRef.instance, container, overlayRef) as MdKeyboardRef<T>;
  }

  /**
   * Creates a new overlay and places it in the correct location.
   */
  private _createOverlay(): OverlayRef {
    const state = new OverlayState();
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
 */
function _applyConfigDefaults(config: MdKeyboardConfig): MdKeyboardConfig {
  return Object.assign(new MdKeyboardConfig(), config);
}
