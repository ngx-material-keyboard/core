import { Directive, ElementRef, HostListener, Input, OnDestroy } from '@angular/core';
import { MdKeyboardRef } from '../utils/keyboard-ref.class';
import { MdKeyboardComponent } from '../components/keyboard/keyboard.component';
import { MdKeyboardService } from '../services/keyboard.service';

@Directive({
  selector: 'input[mdKeyboard], textarea[mdKeyboard], input[matKeyboard], textarea[matKeyboard]'
})
export class MdKeyboardDirective implements OnDestroy  {

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
    this._keyboardRef.instance.setInputInstance(this._elementRef);
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

  ngOnDestroy() {
    this._hideKeyboard();
  }

}
