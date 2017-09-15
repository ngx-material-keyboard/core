import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LIVE_ANNOUNCER_PROVIDER } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { MdButtonModule, MdCommonModule, MdIconModule } from '@angular/material';
import { MdKeyboardContainerComponent } from './components/keyboard-container/keyboard-container.component';
import { MdKeyboardKeyComponent } from './components/keyboard-key/keyboard-key.component';
import { MdKeyboardComponent } from './components/keyboard/keyboard.component';
import { keyboardDeadkeys, MD_KEYBOARD_DEADKEYS } from './configs/keyboard-deadkey.config';
import { keyboardIcons, MD_KEYBOARD_ICONS } from './configs/keyboard-icons.config';
import { keyboardLayouts, MD_KEYBOARD_LAYOUTS } from './configs/keyboard-layouts.config';
import { MdKeyboardDirective } from './directives/keyboard.directive';
import { KebabCasePipe } from './pipes/kebab-case.pipe';
import { MdKeyboardService } from './services/keyboard.service';

@NgModule({
  imports: [
    CommonModule,
    OverlayModule,
    PortalModule,
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
