import { animate, state, style, transition, trigger } from '@angular/animations';
import { AnimationEvent } from '@angular/animations/src/animation_event';
import { ChangeDetectorRef, Component, ComponentRef, EmbeddedViewRef, HostBinding, HostListener, Input, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { BasePortalHost, ComponentPortal, PortalHostDirective } from '@angular/cdk/portal';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { KeyboardState } from '../../enums/keyboard-state.enum';
import { MdKeyboardConfig } from '../../configs/keyboard.config';

// TODO(jelbourn): we can't use constants from animation.ts here because you can't use
// a text interpolation in anything that is analyzed statically with ngc (for AoT compile).
export const SHOW_ANIMATION = '225ms cubic-bezier(0.4,0.0,1,1)';
export const HIDE_ANIMATION = '195ms cubic-bezier(0.0,0.0,0.2,1)';

/**
 * Internal component that wraps user-provided keyboard content.
 * @docs-private
 */
@Component({
  selector: 'md-keyboard-container',
  templateUrl: './keyboard-container.component.html',
  styleUrls: ['./keyboard-container.component.scss'],
  animations: [
    trigger('state', [
      state(`${KeyboardState.Visible}`, style({ transform: 'translateY(0%)' })),
      state(`${KeyboardState.Hidden}`, style({ transform: 'translateY(100%)' })),
      transition(`${KeyboardState.Visible} => ${KeyboardState.Hidden}`, animate(HIDE_ANIMATION)),
      transition(`${KeyboardState.Void} => ${KeyboardState.Visible}`, animate(SHOW_ANIMATION))
    ])
  ]
})
export class MdKeyboardContainerComponent extends BasePortalHost implements OnDestroy {

  @HostBinding('attr.role') attrRole = 'alert';

  @HostBinding('class.dark-theme')
  @Input() darkTheme: boolean;

  /** The portal host inside of this container into which the keyboard content will be loaded. */
  @ViewChild(PortalHostDirective) _portalHost: PortalHostDirective;

  /** The keyboard configuration. */
  keyboardConfig: MdKeyboardConfig;

  /** Subject for notifying that the keyboard has exited from view. */
  private onExit: Subject<any> = new Subject();

  /** Subject for notifying that the keyboard has finished entering the view. */
  private onEnter: Subject<any> = new Subject();

  /** The state of the keyboard animations. */
  @HostBinding('@state')
  private _animationState: KeyboardState = KeyboardState.Visible;

  /** Whether the component has been destroyed. */
  private _destroyed = false;

  constructor(private _ngZone: NgZone,
    private _changeDetectorRef: ChangeDetectorRef) {
    super();
  }

  /** Attach a component portal as content to this keyboard container. */
  attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T> {
    if (this._portalHost.hasAttached()) {
      throw Error('Attempting to attach keyboard content after content is already attached');
    }

    return this._portalHost.attachComponentPortal(portal);
  }

  /** Attach a template portal as content to this keyboard container. */
  attachTemplatePortal(): EmbeddedViewRef<any> {
    throw Error('Not yet implemented');
  }

  /** Handle end of animations, updating the state of the keyboard. */
  @HostListener('@state.done', ['$event'])
  onAnimationEnd(event: AnimationEvent) {
    if (event.toState === KeyboardState.Hidden.toString() || event.toState === KeyboardState.Hidden.toString()) {
      this._completeExit();
    }

    if (event.toState === KeyboardState.Visible.toString()) {
      // Note: we shouldn't use `this` inside the zone callback,
      // because it can cause a memory leak.
      const onEnter = this.onEnter;

      this._ngZone.run(() => {
        onEnter.next();
        onEnter.complete();
      });
    }
  }

  /** Begin animation of keyboard entrance into view. */
  enter(): void {
    if (!this._destroyed) {
      this._animationState = KeyboardState.Visible;
      this._changeDetectorRef.detectChanges();
    }
  }

  /** Returns an observable resolving when the enter animation completes.  */
  _onEnter(): Observable<void> {
    this._animationState = KeyboardState.Visible;
    return this.onEnter.asObservable();
  }

  /** Begin animation of the keyboard exiting from view. */
  exit(): Observable<void> {
    this._animationState = KeyboardState.Hidden;
    return this._onExit();
  }

  /** Returns an observable that completes after the closing animation is done. */
  _onExit(): Observable<void> {
    return this.onExit.asObservable();
  }

  /**
   * Makes sure the exit callbacks have been invoked when the element is destroyed.
   */
  ngOnDestroy() {
    this._destroyed = true;
    this._completeExit();
  }

  /**
   * Waits for the zone to settle before removing the element. Helps prevent
   * errors where we end up removing an element which is in the middle of an animation.
   */
  private _completeExit() {
    // Note: we shouldn't use `this` inside the zone callback,
    // because it can cause a memory leak.
    const onExit = this.onExit;
    this._ngZone.onMicrotaskEmpty.asObservable()
      .subscribe(() => {
        onExit.next();
        onExit.complete();
      });
  }
}
