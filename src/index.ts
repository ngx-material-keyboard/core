import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LIVE_ANNOUNCER_PROVIDER, MdButtonModule, MdCommonModule, MdIconModule, OverlayModule, PortalModule } from '@angular/material';
import { keyboardDeadkeys, MD_KEYBOARD_DEADKEYS } from './config/keyboard-deadkey.config';
import { keyboardLayouts, MD_KEYBOARD_LAYOUTS } from './config/keyboard-layouts.config';
import { KebabCasePipe } from './kebab-case.pipe';
import { MdKeyboardContainerComponent } from './keyboard-container.component';
import { MdKeyboardComponent } from './keyboard.component';
import { MdKeyboardDirective } from './keyboard.directive';
import { MdKeyboardService } from './keyboard.service';

@NgModule({
  imports: [
    OverlayModule,
    PortalModule,
    CommonModule,
    MdButtonModule,
    MdCommonModule,
    MdIconModule
  ],
  exports: [
    MdCommonModule,
    MdKeyboardContainerComponent,
    MdKeyboardDirective
  ],
  declarations: [
    KebabCasePipe,
    MdKeyboardComponent,
    MdKeyboardContainerComponent,
    MdKeyboardDirective
  ],
  entryComponents: [
    MdKeyboardComponent,
    MdKeyboardContainerComponent
  ],
  providers: [
    MdKeyboardService,
    LIVE_ANNOUNCER_PROVIDER,
    { provide: MD_KEYBOARD_DEADKEYS, useValue: keyboardDeadkeys },
    { provide: MD_KEYBOARD_LAYOUTS, useValue: keyboardLayouts }
  ]
})
export class MdKeyboardModule {
}

export * from './config';
export * from './kebab-case.pipe';
export * from './keyboard-container.component';
export * from './keyboard-ref';
export * from './keyboard.component';
export * from './keyboard.config';
export * from './keyboard.directive';
export * from './keyboard.service';
