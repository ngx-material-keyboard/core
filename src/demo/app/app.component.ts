import { Component, Inject, LOCALE_ID, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

import { IKeyboardLayout, MAT_KEYBOARD_LAYOUTS, MatKeyboardComponent, MatKeyboardRef, MatKeyboardService } from '@ngx-material-keyboard/core';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'mat-keyboard-demo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  private _enterSubscription: Subscription;

  private _keyboardRef: MatKeyboardRef<MatKeyboardComponent>;

  darkTheme: boolean;

  duration: number;

  isDebug: boolean;

  defaultLocale: string;

  layout: string;

  layouts: {
    name: string;
    layout: IKeyboardLayout;
  }[];

  get keyboardVisible(): boolean {
    return this._keyboardService.isOpened;
  }

  constructor(private _keyboardService: MatKeyboardService,
              @Inject(LOCALE_ID) public locale,
              @Inject(MAT_KEYBOARD_LAYOUTS) private _layouts) {}

  ngOnInit() {
    this.defaultLocale = ` ${this.locale}`.slice(1);
    this.layouts = Object
      .keys(this._layouts)
      .map((name: string) => ({
        name: name,
        layout: this._layouts[name]
      }))
      .sort((a, b) => a.layout.name.localeCompare(b.layout.name));
  }

  ngOnDestroy() {
    this.closeCurrentKeyboard();
  }

  submitForm(form?: NgForm) {
    console.log('submit form', form);
  }

  openKeyboard(locale = this.defaultLocale) {
    this._keyboardRef = this._keyboardService.open(locale, {
      darkTheme: this.darkTheme,
      duration: this.duration,
      isDebug: this.isDebug
    });
    this._enterSubscription = this._keyboardRef.instance.enterClick.subscribe(() => {
      this.submitForm();
    });
  }

  closeCurrentKeyboard() {
    if (this._keyboardRef) {
      this._keyboardRef.dismiss();
    }

    if (this._enterSubscription) {
      this._enterSubscription.unsubscribe();
    }
  }

  toggleDebug(toggle: MatSlideToggleChange) {
    this.isDebug = toggle.checked;
    this._keyboardRef.instance.isDebug = this.isDebug;
  }

  toggleDarkTheme(toggle: MatSlideToggleChange) {
    this.darkTheme = toggle.checked;
    this._keyboardRef.instance.darkTheme = this.darkTheme;
  }

}
