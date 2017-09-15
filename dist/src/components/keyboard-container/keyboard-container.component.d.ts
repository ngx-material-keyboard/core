import { AnimationEvent } from '@angular/animations/src/animation_event';
import { ChangeDetectorRef, ComponentRef, EmbeddedViewRef, NgZone, OnDestroy } from '@angular/core';
import { BasePortalHost, ComponentPortal, PortalHostDirective } from '@angular/cdk/portal';
import { Observable } from 'rxjs/Observable';
import { MdKeyboardConfig } from '../../configs/keyboard.config';
export declare type KeyboardState = 'initial' | 'visible' | 'complete' | 'void';
export declare const SHOW_ANIMATION = "225ms cubic-bezier(0.4,0.0,1,1)";
export declare const HIDE_ANIMATION = "195ms cubic-bezier(0.0,0.0,0.2,1)";
/**
 * Internal component that wraps user-provided keyboard content.
 * @docs-private
 */
export declare class MdKeyboardContainerComponent extends BasePortalHost implements OnDestroy {
    private _ngZone;
    private _changeDetectorRef;
    attrRole: string;
    darkTheme: boolean;
    /** The portal host inside of this container into which the keyboard content will be loaded. */
    _portalHost: PortalHostDirective;
    /** The keyboard configuration. */
    keyboardConfig: MdKeyboardConfig;
    /** Subject for notifying that the keyboard has exited from view. */
    private onExit;
    /** Subject for notifying that the keyboard has finished entering the view. */
    private onEnter;
    /** The state of the keyboard animations. */
    private _animationState;
    /** Whether the component has been destroyed. */
    private _destroyed;
    constructor(_ngZone: NgZone, _changeDetectorRef: ChangeDetectorRef);
    /** Attach a component portal as content to this keyboard container. */
    attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T>;
    /** Attach a template portal as content to this keyboard container. */
    attachTemplatePortal(): EmbeddedViewRef<any>;
    /** Handle end of animations, updating the state of the keyboard. */
    onAnimationEnd(event: AnimationEvent): void;
    /** Begin animation of keyboard entrance into view. */
    enter(): void;
    /** Returns an observable resolving when the enter animation completes.  */
    _onEnter(): Observable<void>;
    /** Begin animation of the keyboard exiting from view. */
    exit(): Observable<void>;
    /** Returns an observable that completes after the closing animation is done. */
    _onExit(): Observable<void>;
    /**
     * Makes sure the exit callbacks have been invoked when the element is destroyed.
     */
    ngOnDestroy(): void;
    /**
     * Waits for the zone to settle before removing the element. Helps prevent
     * errors where we end up removing an element which is in the middle of an animation.
     */
    private _completeExit();
}
