import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LIVE_ANNOUNCER_PROVIDER, MdCommonModule, OverlayModule, PortalModule } from '@angular/material';
import { MdKeyboardService } from './keyboard.service';
import { MdKeyboardContainerComponent } from './keyboard-container.component';
import { KeyboardComponent } from './keyboard.component';


@NgModule({
  imports: [
    OverlayModule,
    PortalModule,
    CommonModule,
    MdCommonModule,
  ],
  exports: [MdKeyboardContainerComponent, MdCommonModule],
  declarations: [MdKeyboardContainerComponent, KeyboardComponent],
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
