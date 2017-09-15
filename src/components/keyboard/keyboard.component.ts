import { ChangeDetectionStrategy, Component, ElementRef, HostBinding, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { AsyncSubject } from 'rxjs/AsyncSubject';
import { IKeyboardLayout } from '../../configs/keyboard-layouts.config';
import { KeyboardModifier } from '../../enums/keyboard-modifier.enum';
import { MdKeyboardRef } from '../../utils/keyboard-ref.class';
import { MdKeyboardService } from '../../services/keyboard.service';

/**
 * A component used to open as the default keyboard, matching material spec.
 * This should only be used internally by the keyboard service.
 */
@Component({
  selector: 'md-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MdKeyboardComponent implements OnInit {

  @HostBinding('class.mat-keyboard') cssClass = true;

  @HostBinding('class.dark-theme') darkTheme: boolean;

  @HostBinding('class.has-action') hasAction: boolean;

  @HostBinding('class.debug') isDebug = false;

  // The service provides a locale or layout optionally.
  locale?: string;

  layout: IKeyboardLayout;

  modifier: KeyboardModifier = KeyboardModifier.None;

  // The instance of the component making up the content of the keyboard.
  keyboardRef: MdKeyboardRef<MdKeyboardComponent>;

  ngControl?: NgControl;

  private _inputInstance$: AsyncSubject<any> = new AsyncSubject();

  get inputInstance(): Observable<ElementRef> {
    return this._inputInstance$.asObservable();
  }

  setInputInstance(inputInstance: ElementRef, ngControl?: NgControl) {
    this.ngControl = ngControl;
    this._inputInstance$.next(inputInstance);
    this._inputInstance$.complete();
  }

  // Inject dependencies
  constructor(@Inject(LOCALE_ID) private _locale,
              private _keyboardService: MdKeyboardService) {
  }

  ngOnInit() {
    // set a fallback using the locale
    if (!this.layout) {
      this.locale = this._keyboardService.mapLocale(this._locale) ? this._locale : 'en-US';
      this.layout = this._keyboardService.getLayoutForLocale(this.locale);
    }
  }

  // Dismisses the keyboard.
  dismiss(): void {
    this.keyboardRef._action();
  }

  isActive(key: string): boolean {
    return this.modifier === KeyboardModifier[key] || (this.modifier === KeyboardModifier.ShiftAlt && KeyboardModifier[key] > KeyboardModifier.None);
  }

  onAltClick() {
    if (this.modifier === KeyboardModifier.None) {
      this.modifier = KeyboardModifier.Alt;
    }
    else if (this.modifier === KeyboardModifier.Shift) {
      this.modifier = KeyboardModifier.ShiftAlt;
    }
    else if (this.modifier === KeyboardModifier.ShiftAlt) {
      this.modifier = KeyboardModifier.Shift;
    }
    else if (this.modifier === KeyboardModifier.Alt) {
      this.modifier = KeyboardModifier.None;
    }
  }

  onCapsClick() {}

  onShiftClick() {
    if (this.modifier === KeyboardModifier.None) {
      this.modifier = KeyboardModifier.Shift;
    }
    else if (this.modifier === KeyboardModifier.Alt) {
      this.modifier = KeyboardModifier.ShiftAlt;
    }
    else if (this.modifier === KeyboardModifier.ShiftAlt) {
      this.modifier = KeyboardModifier.Alt;
    }
    else if (this.modifier === KeyboardModifier.Shift) {
      this.modifier = KeyboardModifier.None;
    }
  }

}
