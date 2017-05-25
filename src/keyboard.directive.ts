import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { MdKeyboardRef } from './keyboard-ref';
import { MdKeyboardComponent } from './keyboard.component';
import { MdKeyboardService } from './keyboard.service';

@Directive({
  selector: 'input[mdKeyboard], textarea[mdKeyboard], input[matKeyboard], textarea[matKeyboard]'
})
export class MdKeyboardDirective {

  private _keyboardRef: MdKeyboardRef<MdKeyboardComponent>;

  @Input() mdKeyboard: string;

  @Input() darkTheme: boolean;

  @Input() duration: number;

  @Input() hasAction: boolean;

  @Input() isDebug: boolean;

  @HostListener('focus', ['$event'])
  private _showKeyboard() {
    this._keyboardRef = this._keyboardService.open(this.mdKeyboard, {
      darkTheme: this.darkTheme,
      duration: this.duration,
      hasAction: this.hasAction,
      isDebug: this.isDebug
    });
    this._keyboardRef.instance.inputInstance = this._elementRef;
  }

  @HostListener('blur', ['$event'])
  private _hideKeyboard() {
    if (this._keyboardRef) {
      this._keyboardRef.dismiss();
    }
  }

  constructor(private _elementRef: ElementRef,
              private _keyboardService: MdKeyboardService) {
  }

}
