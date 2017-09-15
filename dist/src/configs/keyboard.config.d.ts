import { ViewContainerRef } from '@angular/core';
import { AriaLivePoliteness } from '@angular/material';
import { NgControl } from '@angular/forms';
export declare class MdKeyboardConfig {
    /** The politeness level for the MdAriaLiveAnnouncer announcement. */
    politeness?: AriaLivePoliteness;
    /** Message to be announced by the MdAriaLiveAnnouncer */
    announcementMessage?: string;
    /** The view container to place the overlay for the keyboard into. */
    viewContainerRef?: ViewContainerRef;
    /** The length of time in milliseconds to wait before automatically dismissing the keyboard after blur. */
    duration?: number;
    /** Enable a dark keyboard **/
    darkTheme?: any;
    /** Enable an close action **/
    hasAction?: boolean;
    /** Enable the debug view **/
    isDebug?: boolean;
    /** Enable the debug view **/
    ngControl?: NgControl;
}
