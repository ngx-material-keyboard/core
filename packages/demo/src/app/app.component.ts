import { Component, Inject, LOCALE_ID, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

import { IKeyboardLayout, IKeyboardLayouts, MAT_KEYBOARD_LAYOUTS, MatKeyboardComponent, MatKeyboardRef, MatKeyboardService } from '@ngx-material-keyboard/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'mat-keyboard-demo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  private _enterSubscription: Subscription;

  private _keyboardRef: MatKeyboardRef<MatKeyboardComponent>;

  private _submittedForms = new BehaviorSubject<{ control: string, value: string }[][]>([]);

  @ViewChild('form')
  private _form: NgForm;

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

  testControlValue = new FormControl({ value: 'Emmentaler', disabled: false });

  get keyboardVisible(): boolean {
    return this._keyboardService.isOpened;
  }

  constructor(private _keyboardService: MatKeyboardService,
              @Inject(LOCALE_ID) public locale: string,
              @Inject(MAT_KEYBOARD_LAYOUTS) private _layouts: IKeyboardLayouts) {}

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

  submitForm(form: NgForm) {
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
      this.submitForm(this._form);
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
