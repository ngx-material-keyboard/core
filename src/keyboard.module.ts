import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LIVE_ANNOUNCER_PROVIDER, MdButtonModule, MdCommonModule, MdIconModule, OverlayModule, PortalModule } from '@angular/material';
import { keyboardDeadkeys, MD_KEYBOARD_DEADKEYS } from './configs/keyboard-deadkey.config';
import { keyboardIcons, MD_KEYBOARD_ICONS } from './configs/keyboard-icons.config';
import { keyboardLayouts, MD_KEYBOARD_LAYOUTS } from './configs/keyboard-layouts.config';
import { KebabCasePipe } from './pipes/kebab-case.pipe';
import { MdKeyboardService } from './services/keyboard.service';
import { MdKeyboardComponent } from './components/keyboard.component';
import { MdKeyboardContainerComponent } from './components/keyboard-container.component';
import { MdKeyboardKeyComponent } from './components/keyboard-key.component';
import { MdKeyboardDirective } from './directives/keyboard.directive';

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
    MdKeyboardComponent,
    MdKeyboardContainerComponent,
    MdKeyboardKeyComponent,
    MdKeyboardDirective
  ],
  declarations: [
    KebabCasePipe,
    MdKeyboardComponent,
    MdKeyboardContainerComponent,
    MdKeyboardKeyComponent,
    MdKeyboardDirective
  ],
  entryComponents: [
    MdKeyboardComponent,
    MdKeyboardContainerComponent,
    MdKeyboardKeyComponent
  ],
  providers: [
    MdKeyboardService,
    LIVE_ANNOUNCER_PROVIDER,
    { provide: MD_KEYBOARD_DEADKEYS, useValue: keyboardDeadkeys },
    { provide: MD_KEYBOARD_ICONS, useValue: keyboardIcons },
    { provide: MD_KEYBOARD_LAYOUTS, useValue: keyboardLayouts }
  ]
})
export class MdKeyboardModule {
}
