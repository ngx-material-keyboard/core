import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostBinding, HostListener, Inject, LOCALE_ID, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { MatInput } from '@angular/material/input';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { IKeyboardLayout } from '../../interfaces/keyboard-layout.interface';
import { KeyboardModifier } from '../../enums/keyboard-modifier.enum';
import { KeyboardClassKey } from '../../enums/keyboard-class-key.enum';
import { MatKeyboardRef } from '../../classes/keyboard-ref.class';
import { MatKeyboardService } from '../../services/keyboard.service';
import { MatKeyboardKeyComponent } from '../../components/keyboard-key/keyboard-key.component';

/**
 * A component used to open as the default keyboard, matching material spec.
 * This should only be used internally by the keyboard service.
 */
@Component({
  selector: 'mat-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false
})
export class MatKeyboardComponent implements OnInit {

  private _darkTheme: BehaviorSubject<boolean> = new BehaviorSubject(false);

  private _isDebug: BehaviorSubject<boolean> = new BehaviorSubject(false);

  private _inputInstance$: BehaviorSubject<ElementRef | null> = new BehaviorSubject(null);

  @ViewChildren(MatKeyboardKeyComponent)
  private _keys: QueryList<MatKeyboardKeyComponent>;

  private _modifier: KeyboardModifier = KeyboardModifier.None;

  private _capsLocked = false;

  // the service provides a locale or layout optionally
  locale?: string;

  layout: IKeyboardLayout;

  control: MatInput;

  // the instance of the component making up the content of the keyboard
  keyboardRef: MatKeyboardRef<MatKeyboardComponent>;

  @HostBinding('class.mat-keyboard')
  cssClass = true;

  click: EventEmitter<any> = new EventEmitter<any>();

  enterClick: EventEmitter<void> = new EventEmitter<void>();

  capsClick: EventEmitter<void> = new EventEmitter<void>();

  altClick: EventEmitter<void> = new EventEmitter<void>();

  shiftClick: EventEmitter<void> = new EventEmitter<void>();

  // returns an observable of the input instance
  get inputInstance(): Observable<ElementRef | null> {
    return this._inputInstance$.asObservable();
  }

  set darkTheme(darkTheme: boolean) {
    if (this._darkTheme.getValue() !== darkTheme) {
      this._darkTheme.next(darkTheme);
    }
  }

  set isDebug(isDebug: boolean) {
    if (this._isDebug.getValue() !== isDebug) {
      this._isDebug.next(isDebug);
    }
  }

  get darkTheme$(): Observable<boolean> {
    return this._darkTheme.asObservable();
  }

  get isDebug$(): Observable<boolean> {
    return this._isDebug.asObservable();
  }

  // inject dependencies
  constructor(@Inject(LOCALE_ID) private _locale,
              private _keyboardService: MatKeyboardService) {}

  setInputInstance(inputInstance: ElementRef, control: MatInput) {
    this.control = control;
    this._inputInstance$.next(inputInstance);
  }

  ngOnInit() {
    // set a fallback using the locale
    if (!this.layout) {
      this.locale = this._keyboardService.mapLocale(this._locale) ? this._locale : 'en-US';
      this.layout = this._keyboardService.getLayoutForLocale(this.locale);
    }
    this._keys.click.subscribe( input => this.click.next(input));
  }

  /**
   * dismisses the keyboard
   */
  dismiss() {
    this.keyboardRef.dismiss();
  }

  /**
   * checks if a given key is currently pressed
   * @param {(string | KeyboardClassKey)[]} key
   * @returns {boolean}
   */
  isActive(key: (string | KeyboardClassKey)[]): boolean {
    const modifiedKey: string = this.getModifiedKey(key);
    const isActiveCapsLock: boolean = modifiedKey === KeyboardClassKey.Caps && this._capsLocked;
    const isActiveModifier: boolean = modifiedKey === KeyboardModifier[this._modifier];
    return isActiveCapsLock || isActiveModifier;
  }

  // retrieves modified key
  getModifiedKey(key: (string | KeyboardClassKey)[]): string {
    let modifier: KeyboardModifier = this._modifier;

    // `CapsLock` inverts the meaning of `Shift`
    if (this._capsLocked) {
      modifier = this._invertShiftModifier(this._modifier);
    }

    return key[modifier];
  }

  /**
   * listens to users keyboard inputs to simulate on virtual keyboard, too
   * @param {KeyboardEvent} event
   */
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // 'activate' corresponding key
    this._keys
      .filter((key: MatKeyboardKeyComponent) => key.key === event.key)
      .forEach((key: MatKeyboardKeyComponent) => {
        key.pressed = true;
      });

    // simulate modifier press
    if (event.key === KeyboardClassKey.Caps) {
      this.onCapsClick(event.getModifierState(KeyboardClassKey.Caps));
    }
    if (event.key === KeyboardClassKey.Alt && this._modifier !== KeyboardModifier.Alt && this._modifier !== KeyboardModifier.ShiftAlt) {
      this.onAltClick();
    }
    if (event.key === KeyboardClassKey.Shift && this._modifier !== KeyboardModifier.Shift && this._modifier !== KeyboardModifier.ShiftAlt) {
      this.onShiftClick();
    }
  }

  /**
   * listens to users keyboard inputs to simulate on virtual keyboard, too
   * @param {KeyboardEvent} event
   */
  @HostListener('document:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    // 'deactivate' corresponding key
    this._keys
      .filter((key: MatKeyboardKeyComponent) => key.key === event.key)
      .forEach((key: MatKeyboardKeyComponent) => {
        key.pressed = false;
      });

    // simulate modifier release
    if (event.key === KeyboardClassKey.Alt && (this._modifier === KeyboardModifier.Alt || this._modifier === KeyboardModifier.ShiftAlt)) {
      this.onAltClick();
    }
    if (event.key === KeyboardClassKey.Shift && (this._modifier === KeyboardModifier.Shift || this._modifier === KeyboardModifier.ShiftAlt)) {
      this.onShiftClick();
    }
  }

  /**
   * bubbles event if submit is potentially triggered
   */
  onEnterClick() {
    // notify subscribers
    this.enterClick.next();
  }

  /**
   * simulates clicking `CapsLock` key
   * @param {boolean} targetState
   */
  onCapsClick(targetState = !this._capsLocked) {
    // not implemented
    this._capsLocked = targetState;

    // notify subscribers
    this.capsClick.next();
  }

  /**
   * simulates clicking `Alt` key
   */
  onAltClick() {
    // invert modifier meaning
    this._modifier = this._invertAltModifier(this._modifier);

    // notify subscribers
    this.altClick.next();
  }

  /**
   * simulates clicking `Shift` key
   */
  onShiftClick() {
    // invert modifier meaning
    this._modifier = this._invertShiftModifier(this._modifier);

    // notify subscribers
    this.shiftClick.next();
  }

  private _invertAltModifier(modifier: KeyboardModifier): KeyboardModifier {
    switch (modifier) {
      case KeyboardModifier.None:
        return KeyboardModifier.Alt;

      case KeyboardModifier.Shift:
        return KeyboardModifier.ShiftAlt;

      case KeyboardModifier.ShiftAlt:
        return KeyboardModifier.Shift;

      case KeyboardModifier.Alt:
        return KeyboardModifier.None;
    }
  }

  private _invertShiftModifier(modifier: KeyboardModifier): KeyboardModifier {
    switch (modifier) {
      case KeyboardModifier.None:
        return KeyboardModifier.Shift;

      case KeyboardModifier.Alt:
        return KeyboardModifier.ShiftAlt;

      case KeyboardModifier.ShiftAlt:
        return KeyboardModifier.Alt;

      case KeyboardModifier.Shift:
        return KeyboardModifier.None;
    }
  }

}
