import { Component, HostBinding, Inject, Input, LOCALE_ID, OnInit } from "@angular/core";
import { MD_KEYBOARD_DEADKEYS } from "./config/keyboard-deadkey.config";
import { IKeyboardLayout, MD_KEYBOARD_LAYOUTS } from "./config/keyboard-layouts.config";
import { MdKeyboardRef } from "./keyboard-ref";
import { MdKeyboardService } from "./keyboard.service";

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

  locale?: string;

  layout: IKeyboardLayout;

  @HostBinding('class.dark-theme') darkTheme: boolean;

  @HostBinding('class.mat-keyboard') cssClass = true;

  // The service provides a locale or layout optionally.

  // The instance of the component making up the content of the keyboard.
  keyboardRef: MdKeyboardRef<MdKeyboardComponent>;

  // Dismisses the keyboard.
  dismiss(): void {
    this.keyboardRef._action();
  }

  // Inject dependencies
  constructor(private _keyboardService: MdKeyboardService,
              @Inject(LOCALE_ID) private _locale,
              @Inject(MD_KEYBOARD_DEADKEYS) private _deadkeys,
              @Inject(MD_KEYBOARD_LAYOUTS) private _layouts) {
  }

  ngOnInit() {
    //   console.log('detected locale:', this._locale);
    //   console.log('configured deadkeys:', this._deadkeys);
    //   console.log('configured layouts:', this._layouts);

    // set a fallback using the locale
    if (!this.layout) {
      this.locale = this._keyboardService.mapLocale(this._locale) ? this._locale : 'en-US';
      this.layout = this._keyboardService.getLayoutForLocale(this.locale);
    }
  }

}
