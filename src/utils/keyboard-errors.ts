/**
 * Error that is thrown when attempting to attach a keyboard that is already attached.
 * @docs-private
 */
export function throwContentAlreadyAttached() {
  throw Error('Attempting to attach keyboard content after content is already attached');
}

export function throwLayoutNotFound(locale: string) {
  throw Error(`No layout found for locale ${locale}`);
}
