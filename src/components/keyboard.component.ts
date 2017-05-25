import { Component, ElementRef, HostBinding, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { MD_KEYBOARD_CLASSES } from '../configs/keyboard-classes.config';
import { MD_KEYBOARD_DEADKEYS } from '../configs/keyboard-deadkey.config';
import { MD_KEYBOARD_ICONS } from '../configs/keyboard-icons.config';
import { IKeyboardLayout, MD_KEYBOARD_LAYOUTS } from '../configs/keyboard-layouts.config';
import { MdKeyboardRef } from '../classes/keyboard-ref.class';
import { MdKeyboardService } from '../services/keyboard.service';

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

  private _deadkeyKeys: string[] = [];

  private _iconKeys: string[] = [];

  // The service provides a locale or layout optionally.
  locale?: string;

  layout: IKeyboardLayout;

  @HostBinding('class.mat-keyboard') cssClass = true;

  @HostBinding('class.dark-theme') darkTheme: boolean;

  @HostBinding('class.has-action') hasAction: boolean;

  @HostBinding('class.debug') isDebug = false;

  // The instance of the component making up the content of the keyboard.
  keyboardRef: MdKeyboardRef<MdKeyboardComponent>;

  inputInstance?: ElementRef;

  // Dismisses the keyboard.
  dismiss(): void {
    this.keyboardRef._action();
  }

  // Inject dependencies
  constructor(private _keyboardService: MdKeyboardService,
              @Inject(LOCALE_ID) private _locale,
              @Inject(MD_KEYBOARD_CLASSES) private _classKeys,
              @Inject(MD_KEYBOARD_DEADKEYS) private _deadkeys,
              @Inject(MD_KEYBOARD_ICONS) private _icons,
              @Inject(MD_KEYBOARD_LAYOUTS) private _layouts) {
  }

  ngOnInit() {
    //   console.log('detected locale:', this._locale);
    //   console.log('configured deadkeys:', this._deadkeys);
    //   console.log('configured layouts:', this._layouts);

    // read the deadkeys
    this._deadkeyKeys = Object.keys(this._deadkeys);

    // read the icons
    this._iconKeys = Object.keys(this._icons);

    // set a fallback using the locale
    if (!this.layout) {
      this.locale = this._keyboardService.mapLocale(this._locale) ? this._locale : 'en-US';
      this.layout = this._keyboardService.getLayoutForLocale(this.locale);
    }
  }

  hasIcon(key: string): boolean {
    const lowerKey = key.toLowerCase();
    return !!this._iconKeys.find((iconKey: string) => iconKey === lowerKey);
  }

  isClassKey(key: string): boolean {
    return !!this._classKeys.find((classKey: string) => classKey === key.toLowerCase());
  }

  isDeadKey(key: string): boolean {
    return !!this._deadkeyKeys.find((deadKey: string) => deadKey === key);
  }

  getIcon(key: string): string {
    return this._icons[key.toLowerCase()];
  }

  getClass(key: string): string {
    const classes = [];

    if (this.isClassKey(key)) {
      classes.push('mat-keyboard__key--modifier');
      classes.push(`mat-keyboard__key--${key.toLowerCase()}`);
    }

    if (this.isDeadKey(key)) {
      classes.push('mat-keyboard__key--deadkey');
    }

    return classes.join(' ');
  }

  mousedown(ev: MouseEvent) {
    ev.preventDefault();
  }

  click(ev: MouseEvent, key: string) {
    // Trigger a global key event
    // TODO: determine whether an output should bubble the pressed key similar to the keybboard action or not
    this._triggerKeyEvent(key);

    // Manipulate the focused input / textarea value
    if (this.inputInstance) {
      const value = this.inputInstance.nativeElement.value;
      const caret = this._getCursorPosition();
      let char: string;

      switch (key) {
        // this keys have no actions yet
        // TODO: add deadkeys and modifiers
        case 'Alt':
        case 'AltGr':
        case 'Caps':
        case 'Ctrl':
        case 'Enter':
        case 'Shift':
          break;

        case 'Bksp':
          this.inputInstance.nativeElement.value = [value.slice(0, caret - 1), value.slice(caret)].join('');
          this._setCursorPosition(caret - 1);
          break;

        case 'Space':
          char = ' ';
          break;

        case 'Tab':
          char = '\t';
          break;

        default:
          char = key;
          break;
      }

      if (char) {
        this.inputInstance.nativeElement.value = [value.slice(0, caret), char, value.slice(caret)].join('');
        this._setCursorPosition(caret + 1);
      }
    }
  }

  private _triggerKeyEvent(key: string): Event {
    const charCode = key.charCodeAt(0);
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
      charCode, // keyCodeArg : unsigned long - the virtual key code, else 0
      0 // charCodeArgs : unsigned long - the Unicode character associated with the depressed key, else 0
    );

    window.document.dispatchEvent(keyboardEvent);

    return keyboardEvent;
  }

  // inspired by:
  // ref https://stackoverflow.com/a/2897510/1146207
  private _getCursorPosition(): number {
    if (!this.inputInstance) {
      return;
    }

    if ('selectionStart' in this.inputInstance.nativeElement) {
      // Standard-compliant browsers
      return this.inputInstance.nativeElement.selectionStart;
    } else if (window.document['selection']) {
      // IE
      this.inputInstance.nativeElement.focus();
      const sel = window.document['selection'].createRange();
      const selLen = window.document['selection'].createRange().text.length;
      sel.moveStart('character', -this.inputInstance.nativeElement.value.length);

      return sel.text.length - selLen;
    }
  }

  // inspired by:
  // ref https://stackoverflow.com/a/12518737/1146207
  private _setCursorPosition(position: number): boolean {
    if (!this.inputInstance) {
      return;
    }

    this.inputInstance.nativeElement.value = this.inputInstance.nativeElement.value;
    // ^ this is used to not only get "focus", but
    // to make sure we don't have it everything -selected-
    // (it causes an issue in chrome, and having it doesn't hurt any other browser)

    if ('createTextRange' in this.inputInstance.nativeElement) {
      let range = this.inputInstance.nativeElement.createTextRange();
      range.move('character', position);
      range.select();
      return true;
    } else {
      // (el.selectionStart === 0 added for Firefox bug)
      if (this.inputInstance.nativeElement.selectionStart || this.inputInstance.nativeElement.selectionStart === 0) {
        this.inputInstance.nativeElement.focus();
        this.inputInstance.nativeElement.setSelectionRange(position, position);
        return true;
      }

      else { // fail city, fortunately this never happens (as far as I've tested) :)
        this.inputInstance.nativeElement.focus();
        return false;
      }
    }
  }

}
