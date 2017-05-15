import { ComponentRef, Injectable, Optional, SkipSelf } from '@angular/core';
import { ComponentPortal, ComponentType, LiveAnnouncer, Overlay, OverlayRef, OverlayState } from '@angular/material';
import { MdKeyboardConfig } from './keyboard.config';
import { MdKeyboardContainerComponent } from './keyboard-container.component';
import { MdKeyboardRef } from './keyboard-ref';
import { KeyboardComponent } from './keyboard.component';


/**
 * Service to dispatch Material Design snack bar messages.
 */
@Injectable()
export class MdKeyboardService {
  /**
   * Reference to the current snack bar in the view *at this level* (in the Angular injector tree).
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

  constructor(private _overlay: Overlay,
              private _live: LiveAnnouncer,
              @Optional() @SkipSelf() private _parentKeyboard: MdKeyboardService) {}

  /**
   * Creates and dispatches a snack bar with a custom component for the content, removing any
   * currently opened snack bars.
   *
   * @param component Component to be instantiated.
   * @param config Extra configuration for the snack bar.
   */
  openFromComponent<T>(component: ComponentType<T>, config?: MdKeyboardConfig): MdKeyboardRef<T> {
    config = _applyConfigDefaults(config);
    const overlayRef = this._createOverlay();
    const keyboardContainer = this._attachKeyboardContainer(overlayRef, config);
    const keyboardRef = this._attachKeyboardContent(component, keyboardContainer, overlayRef);

    // When the keyboard is dismissed, clear the reference to it.
    keyboardRef.afterDismissed().subscribe(() => {
      // Clear the keyboard ref if it hasn't already been replaced by a newer keyboard.
      if (this._openedKeyboardRef === keyboardRef) {
        this._openedKeyboardRef = null;
      }
    });

    // If a snack bar is already in view, dismiss it and enter the new snack bar after exit
    // animation is complete.
    if (this._openedKeyboardRef) {
      this._openedKeyboardRef.afterDismissed().subscribe(() => {
        keyboardRef.containerInstance.enter();
      });
      this._openedKeyboardRef.dismiss();
      // If no snack bar is in view, enter the new snack bar.
    } else {
      keyboardRef.containerInstance.enter();
    }

    // If a dismiss timeout is provided, set up dismiss based on after the keyboard is opened.
    if (config.duration > 0) {
      keyboardRef.afterOpened().subscribe(() => {
        setTimeout(() => keyboardRef.dismiss(), config.duration);
      });
    }

    this._live.announce(config.announcementMessage, config.politeness);
    this._openedKeyboardRef = keyboardRef;
    return this._openedKeyboardRef;
  }

  /**
   * Opens a keyboard with a message and an optional action.
   * @param message The message to show in the keyboard.
   * @param action The label for the keyboard action.
   * @param config Additional configuration options for the keyboard.
   */
  open(message: string, action = '', config: MdKeyboardConfig = {}): MdKeyboardRef<KeyboardComponent> {
    config.announcementMessage = message;
    const keyboardComponentRef = this.openFromComponent(KeyboardComponent, config);
    keyboardComponentRef.instance.keyboardRef = keyboardComponentRef;
    keyboardComponentRef.instance.message = message;
    keyboardComponentRef.instance.action = action;
    return keyboardComponentRef;
  }

  /**
   * Dismisses the currently-visible snack bar.
   */
  dismiss(): void {
    if (this._openedKeyboardRef) {
      this._openedKeyboardRef.dismiss();
    }
  }

  /**
   * Attaches the snack bar container component to the overlay.
   */
  private _attachKeyboardContainer(overlayRef: OverlayRef,
                                   config: MdKeyboardConfig): MdKeyboardContainerComponent {
    const containerPortal = new ComponentPortal(MdKeyboardContainerComponent, config.viewContainerRef);
    const containerRef: ComponentRef<MdKeyboardContainerComponent> = overlayRef.attach(containerPortal);
    containerRef.instance.keyboardConfig = config;

    return containerRef.instance;
  }

  /**
   * Places a new component as the content of the snack bar container.
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
                                 .bottom('0');
    return this._overlay.create(state);
  }
}

/**
 * Applies default options to the keyboard config.
 * @param config The configuration to which the defaults will be applied.
 * @returns The new configuration object with defaults applied.
 */
function _applyConfigDefaults(config: MdKeyboardConfig): MdKeyboardConfig {
  return Object.assign(new MdKeyboardConfig(), config);
}
