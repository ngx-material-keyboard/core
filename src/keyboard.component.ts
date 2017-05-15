import { Component, HostBinding } from '@angular/core';
import { MdKeyboardRef } from './keyboard-ref';


/**
 * A component used to open as the default snack bar, matching material spec.
 * This should only be used internally by the snack bar service.
 */
@Component({
  selector: 'md-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.scss']
})
export class KeyboardComponent {

  @HostBinding('class.mat-keyboard') cssClass = true;

  /** The message to be shown in the snack bar. */
  message: string;

  /** The label for the button in the snack bar. */
  action: string;

  /** The instance of the component making up the content of the snack bar. */
  keyboardRef: MdKeyboardRef<KeyboardComponent>;

  /** Dismisses the snack bar. */
  dismiss(): void {
    this.keyboardRef._action();
  }

  /** If the action button should be shown. */
  get hasAction(): boolean { return !!this.action; }
}
