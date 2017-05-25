import { Component, HostBinding, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { MD_KEYBOARD_DEADKEYS } from './config/keyboard-deadkey.config';
import { MD_KEYBOARD_ICONS } from './config/keyboard-icons.config';
import { IKeyboardLayout, MD_KEYBOARD_LAYOUTS } from './config/keyboard-layouts.config';
import { MdKeyboardRef } from './keyboard-ref';
import { MdKeyboardService } from './keyboard.service';

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

  private _classKeys = ['altgr', 'bksp', 'caps', 'ctrl', 'enter', 'shift', 'space', 'tab'];

  private _deadkeyKeys: string[] = [];

  private _iconKeys: string[] = [];

  // The service provides a locale or layout optionally.
  locale?: string;

  layout: IKeyboardLayout;

  @HostBinding('class.dark-theme') darkTheme: boolean;

  @HostBinding('class.mat-keyboard') cssClass = true;

  @HostBinding('class.debug') isDebug = false;

  hasAction: boolean;

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

  getIcon(key: string): string {
    return this._icons[key.toLowerCase()];
  }

  getClass(key: string): string {
    const lowerKey = key.toLowerCase();
    const classes = [];

    if (this._classKeys.find((classKey: string) => classKey === lowerKey)) {
      classes.push('mat-keyboard__key--modifier');
      classes.push(`mat-keyboard__key--${lowerKey}`);
    }

    if (this._deadkeyKeys.find((deadKey: string) => deadKey === key)) {
      classes.push('mat-keyboard__key--deadkey');
    }

    return classes.join(' ');
  }

  mousedown(ev: MouseEvent) {
    ev.preventDefault();
    console.log('focus lost?');
  }

}
