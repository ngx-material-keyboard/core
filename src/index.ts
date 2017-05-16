import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LIVE_ANNOUNCER_PROVIDER, MdCommonModule, OverlayModule, PortalModule } from '@angular/material';
import { MdKeyboardService } from './keyboard.service';
import { MdKeyboardContainerComponent } from './keyboard-container.component';
import { KeyboardComponent } from './keyboard.component';

import { KeyboardDirective } from './keyboard.directive';

@NgModule({
  imports: [
    OverlayModule,
    PortalModule,
    CommonModule,
    MdCommonModule,
  ],
  exports: [MdKeyboardContainerComponent, MdCommonModule, KeyboardDirective],
  declarations: [MdKeyboardContainerComponent, KeyboardComponent, KeyboardDirective],
  entryComponents: [MdKeyboardContainerComponent, KeyboardComponent],
  providers: [MdKeyboardService, LIVE_ANNOUNCER_PROVIDER]
})
export class MdKeyboardModule {
}

export * from './keyboard.service';
export * from './keyboard-container.component';
export * from './keyboard.config';
export * from './keyboard-ref';
export * from './keyboard.component';
export * from './keyboard.directive';
