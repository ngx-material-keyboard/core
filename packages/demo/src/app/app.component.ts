import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { Component, ElementRef, Inject, LOCALE_ID, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, NgControl, NgForm, NgModel } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

import { MatInput } from '@angular/material';

import { IKeyboardLayout, MAT_KEYBOARD_LAYOUTS, MatKeyboardComponent, MatKeyboardRef, MatKeyboardService } from '@ngx-material-keyboard/core';

@Component({
  selector: 'mat-keyboard-demo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  private _enterSubscription: Subscription;

  private _keyboardRef: MatKeyboardRef<MatKeyboardComponent>;

  private _submittedForms = new BehaviorSubject<{ control: string, value: string }[][]>([]);

  @ViewChild('attachTo', { read: ElementRef })
  private _attachToElement: ElementRef;

  @ViewChild('attachTo', { read: NgModel })
  private _attachToControl: NgControl;

  get submittedForms(): Observable<{ control: string, value: string }[][]> {
    return this._submittedForms.asObservable();
  }

  darkTheme: boolean;

  duration: number;

  isDebug: boolean;

  defaultLocale: string;

  layout: string;

  layouts: {
    name: string;
    layout: IKeyboardLayout;
  }[];

  testModelValue = 'Sushi';

  attachModelValue = '';

  testControlValue = new FormControl({ value: 'Emmentaler', disabled: false });

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
        name,
        layout: this._layouts[name]
      }))
      .sort((a, b) => a.layout.name.localeCompare(b.layout.name));
  }

  ngOnDestroy() {
    this.closeCurrentKeyboard();
  }

  submitForm(form?: NgForm) {
    const submittedForms = this._submittedForms.getValue();
    const submittedForm = Object
      .keys(form.controls)
      .map((control: string) => ({
        control,
        value: form.controls[control].value
      }));
    submittedForms.push(submittedForm);
    this._submittedForms.next(submittedForms);
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

  openAttachedKeyboard(locale = this.defaultLocale) {
    this._keyboardRef = this._keyboardService.open(locale, {
      darkTheme: this.darkTheme,
      duration: this.duration,
      isDebug: this.isDebug
    });

    // reference the input element
    this._keyboardRef.instance.setInputInstance(this._attachToElement);

    // set control
    this._keyboardRef.instance.attachControl(this._attachToControl.control);
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
