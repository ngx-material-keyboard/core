import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { KeyboardKeyClass } from '../../enums/keyboard-key-class.enum';
import { MD_KEYBOARD_DEADKEYS } from '../../configs/keyboard-deadkey.config';
import { MD_KEYBOARD_ICONS } from '../../configs/keyboard-icons.config';

@Component({
  selector: 'md-keyboard-key',
  templateUrl: './keyboard-key.component.html',
  styleUrls: ['./keyboard-key.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MdKeyboardKeyComponent implements OnInit {

  private _deadkeyKeys: string[] = [];

  private _iconKeys: string[] = [];

  @Input() key: string;

  @Input() active: boolean;

  @Input() input?: ElementRef;

  @Output() altClick = new EventEmitter<void>();

  @Output() capsClick = new EventEmitter<void>();

  @Output() shiftClick = new EventEmitter<void>();

  get lowerKey(): string {
    return this.key.toLowerCase();
  }

  get charCode(): number {
    return this.key.charCodeAt(0);
  }

  get isClassKey(): boolean {
    return !!KeyboardKeyClass[this.key];
  }

  get isDeadKey(): boolean {
    return !!this._deadkeyKeys.find((deadKey: string) => deadKey === this.key);
  }

  get hasIcon(): boolean {
    return !!this._iconKeys.find((iconKey: string) => iconKey === this.lowerKey);
  }

  get icon(): string {
    return this._icons[this.lowerKey];
  }

  get cssClass(): string {
    const classes = [];

    if (this.isClassKey) {
      classes.push('mat-keyboard-key-modifier');
      classes.push(`mat-keyboard-key-${KeyboardKeyClass[this.key]}`);
    }

    if (this.isDeadKey) {
      classes.push('mat-keyboard-key-deadkey');
    }

    return classes.join(' ');
  }

  // Inject dependencies
  constructor(@Inject(MD_KEYBOARD_DEADKEYS) private _deadkeys,
              @Inject(MD_KEYBOARD_ICONS) private _icons) {
  }

  ngOnInit() {
    //   console.log('configured deadkeys:', this._deadkeys);

    // read the deadkeys
    this._deadkeyKeys = Object.keys(this._deadkeys);

    // read the icons
    this._iconKeys = Object.keys(this._icons);
  }

  onMousedown(ev: MouseEvent) {
    ev.preventDefault();
  }

  onClick() {
    // Trigger a global key event
    // TODO: determine whether an output should bubble the pressed key similar to the keybboard action or not
    this._triggerKeyEvent();

    // Manipulate the focused input / textarea value
    const value = this.input ? this.input.nativeElement.value : '';
    const caret = this.input ? this._getCursorPosition() : 0;
    let char: string;

    switch (this.key) {
      // this keys have no actions yet
      // TODO: add deadkeys and modifiers
      case 'Alt':
      case 'AltGr':
      case 'AltLK':
        this.altClick.emit();
        break;

      case 'Bksp':
        this.input.nativeElement.value = [value.slice(0, caret - 1), value.slice(caret)].join('');
        this._setCursorPosition(caret - 1);
        break;

      case 'Caps':
        this.capsClick.emit();
        break;

      case 'Enter':
        char = '\n\r';
        break;

      case 'Shift':
        this.shiftClick.emit();
        break;

      case 'Space':
        char = ' ';
        break;

      case 'Tab':
        char = '\t';
        break;

      default:
        char = this.key;
        break;
    }

    if (char && this.input) {
      this.input.nativeElement.value = [value.slice(0, caret), char, value.slice(caret)].join('');
      this._setCursorPosition(caret + 1);
    }
  }

  private _triggerKeyEvent(): Event {
    const keyboardEvent = window.document.createEvent('KeyboardEvent');
    const initMethod = typeof keyboardEvent.initKeyboardEvent !== 'undefined' ? 'initKeyboardEvent' : 'initKeyEvent';

    keyboardEvent[initMethod](
      'keydown', // event type : keydown, keyup, keypress
      true, // bubbles
      true, // cancelable
      window, // viewArg: should be window
      false, // ctrlKeyArg
      false, // altKeyArg
      false, // shiftKeyArg
      false, // metaKeyArg
      this.charCode, // keyCodeArg : unsigned long - the virtual key code, else 0
      0 // charCodeArgs : unsigned long - the Unicode character associated with the depressed key, else 0
    );

    window.document.dispatchEvent(keyboardEvent);

    return keyboardEvent;
  }

  // inspired by:
  // ref https://stackoverflow.com/a/2897510/1146207
  private _getCursorPosition(): number {
    if (!this.input) {
      return;
    }

    if ('selectionStart' in this.input.nativeElement) {
      // Standard-compliant browsers
      return this.input.nativeElement.selectionStart;
    } else if (window.document['selection']) {
      // IE
      this.input.nativeElement.focus();
      const sel = window.document['selection'].createRange();
      const selLen = window.document['selection'].createRange().text.length;
      sel.moveStart('character', -this.input.nativeElement.value.length);

      return sel.text.length - selLen;
    }
  }

  // inspired by:
  // ref https://stackoverflow.com/a/12518737/1146207
  private _setCursorPosition(position: number): boolean {
    if (!this.input) {
      return;
    }

    this.input.nativeElement.value = this.input.nativeElement.value;
    // ^ this is used to not only get "focus", but
    // to make sure we don't have it everything -selected-
    // (it causes an issue in chrome, and having it doesn't hurt any other browser)

    if ('createTextRange' in this.input.nativeElement) {
      const range = this.input.nativeElement.createTextRange();
      range.move('character', position);
      range.select();
      return true;
    } else {
      // (el.selectionStart === 0 added for Firefox bug)
      if (this.input.nativeElement.selectionStart || this.input.nativeElement.selectionStart === 0) {
        this.input.nativeElement.focus();
        this.input.nativeElement.setSelectionRange(position, position);
        return true;
      }

      else { // fail city, fortunately this never happens (as far as I've tested) :)
        this.input.nativeElement.focus();
        return false;
      }
    }
  }

}
