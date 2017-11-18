import { OverlayRef } from '@angular/cdk/overlay';
import { Observable } from 'rxjs/Observable';
import { MdKeyboardContainerComponent } from '../components/keyboard-container/keyboard-container.component';
/**
 * Reference to a keyboard dispatched from the keyboard service.
 */
export declare class MdKeyboardRef<T> {
    private _overlayRef;
    private _instance;
    /** The instance of the component making up the content of the keyboard. */
    readonly instance: T;
    /**
     * The instance of the component making up the content of the keyboard.
     * @docs-private
     */
    containerInstance: MdKeyboardContainerComponent;
    darkTheme: boolean;
    hasAction: boolean;
    isDebug: boolean;
    /** Subject for notifying the user that the keyboard has closed. */
    private _afterClosed;
    /** Subject for notifying the user that the keyboard has opened and appeared. */
    private _afterOpened;
    /** Subject for notifying the user that the keyboard action was called. */
    private _onAction;
    constructor(instance: T, containerInstance: MdKeyboardContainerComponent, _overlayRef: OverlayRef);
    /** Dismisses the keyboard. */
    dismiss(): void;
    /** Marks the keyboard action clicked. */
    _action(): void;
    /** Marks the keyboard as opened */
    _open(): void;
    /** Cleans up the DOM after closing. */
    private _finishDismiss();
    /** Gets an observable that is notified when the keyboard is finished closing. */
    afterDismissed(): Observable<void>;
    /** Gets an observable that is notified when the keyboard has opened and appeared. */
    afterOpened(): Observable<void>;
    /** Gets an observable that is notified when the keyboard action is called. */
    onAction(): Observable<void>;
}
