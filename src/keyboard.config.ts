import { ViewContainerRef } from '@angular/core';
import { AriaLivePoliteness } from '@angular/material';

/**
 * Configuration used when opening a keyboard.
 */
export class MdKeyboardConfig {
  /** The politeness level for the MdAriaLiveAnnouncer announcement. */
  politeness?: AriaLivePoliteness = 'assertive';

  /** Message to be announced by the MdAriaLiveAnnouncer */
  announcementMessage? = '';

  /** The view container to place the overlay for the snack bar into. */
  viewContainerRef?: ViewContainerRef = null;

  /** The length of time in milliseconds to wait before automatically dismissing the snack bar. */
  duration? = 0;

  /** Extra CSS classes to be added to the snack bar container. */
  extraClasses?: string[];
}
