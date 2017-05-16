import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LIVE_ANNOUNCER_PROVIDER, MdCommonModule, OverlayModule, PortalModule } from '@angular/material';
import { keyboardDeadkeys, MD_KEYBOARD_DEADKEYS } from './config/keyboard-deadkey.config';
import { MdKeyboardContainerComponent } from './keyboard-container.component';
import { MdKeyboardComponent } from './keyboard.component';
import { MdKeyboardDirective } from './keyboard.directive';
import { MdKeyboardService } from './keyboard.service';

@NgModule({
  imports: [
    OverlayModule,
    PortalModule,
    CommonModule,
    MdCommonModule,
  ],
  exports: [
    MdCommonModule,
    MdKeyboardContainerComponent,
    MdKeyboardDirective
  ],
  declarations: [
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
    { provide: MD_KEYBOARD_DEADKEYS, useValue: keyboardDeadkeys }
  ]
})
export class MdKeyboardModule {
}

export * from './config';
export * from './keyboard-container.component';
export * from './keyboard-ref';
export * from './keyboard.component';
export * from './keyboard.config';
export * from './keyboard.directive';
export * from './keyboard.service';
