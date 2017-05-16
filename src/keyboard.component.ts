import { Component, HostBinding, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { MdKeyboardRef } from './keyboard-ref';
import { MD_KEYBOARD_DEADKEYS } from './config/keyboard-deadkey.config';

/**
 * A component used to open as the default keyboard, matching material spec.
 * This should only be used internally by the keyboard service.
 */
@Component({
  selector: 'md-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.scss']
})
export class MdKeyboardComponent implements OnInit {

  @HostBinding('class.mat-keyboard') cssClass = true;

  // The message to be shown in the keyboard.
  message: string;

  // The label for the button in the keyboard.
  action: string;

  // The instance of the component making up the content of the keyboard.
  keyboardRef: MdKeyboardRef<MdKeyboardComponent>;

  // Dismisses the keyboard.
  dismiss(): void {
    this.keyboardRef._action();
  }

  // If the action button should be shown.
  get hasAction(): boolean { return !!this.action; }

  // Inject dependencies
  constructor(@Inject(LOCALE_ID) private _locale,
              @Inject(MD_KEYBOARD_DEADKEYS) private _deadkeys) {}

  ngOnInit() {
    console.log('detected locale:', this._locale);
    console.log('configured deadkeys:', this._deadkeys);
  }

}
