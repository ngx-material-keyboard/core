import { Directive, HostListener, Input } from '@angular/core';
import { MdKeyboardRef } from './keyboard-ref';
import { MdKeyboardComponent } from './keyboard.component';
import { MdKeyboardService } from './keyboard.service';

@Directive({
  selector: 'input[mdKeyboard], textarea[mdKeyboard], input[matKeyboard], textarea[matKeyboard]'
})
export class MdKeyboardDirective {

  private _keyboardRef: MdKeyboardRef<MdKeyboardComponent>;

  @Input() mdKeyboard: string;

  @HostListener('focus', ['$event'])
  private _showKeyboard() {
    this._keyboardRef = this._keyboardService.open(this.mdKeyboard);
  }

  @HostListener('blur', ['$event'])
  private _hideKeyboard() {
    if (this._keyboardRef) {
      this._keyboardRef.dismiss();
    }
  }

  constructor(private _keyboardService: MdKeyboardService) {}

}
