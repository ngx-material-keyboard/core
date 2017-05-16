import { MdError } from '@angular/material';

/**
 * Error that is thrown when attempting to attach a keyboard that is already attached.
 * @docs-private
 */
export class MdKeyboardContentAlreadyAttached extends MdError {
  constructor() {
    super('Attempting to attach keyboard content after content is already attached');
  }
}
