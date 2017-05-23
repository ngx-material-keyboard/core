import { ViewContainerRef } from '@angular/core';
import { AriaLivePoliteness } from '@angular/material';

export class MdKeyboardConfig {
  /** The politeness level for the MdAriaLiveAnnouncer announcement. */
  politeness?: AriaLivePoliteness = 'assertive';

  /** Message to be announced by the MdAriaLiveAnnouncer */
  announcementMessage? = '';

  /** The view container to place the overlay for the keyboard into. */
  viewContainerRef?: ViewContainerRef = null;

  /** The length of time in milliseconds to wait before automatically dismissing the keyboard after blur. */
  duration? = 0;

  /** Enable a dark keyboard **/
  darkTheme? = null;
}
