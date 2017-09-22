// TODO: use real string based enums (available sine typescript 1.4) if
// [tslint](https://github.com/palantir/tslint/issues/2993) and more important
// [rollup](https://github.com/angular/angular/issues/17516) support it
/*
export enum KeyboardClassKey {
  Alt = 'Alt',
  AltGr = 'AltGr',
  AltLk = 'AltLk',
  Bksp = 'Bksp',
  Caps = 'Caps',
  Enter = 'Enter',
  Shift = 'Shift',
  Space = 'Space',
  Tab = 'Tab'
}
*/
export enum KeyboardClassKey {
  Alt = 'Alt' as any,
  AltGr = 'AltGr' as any,
  AltLk = 'AltLk' as any,
  Bksp = 'Bksp' as any,
  Caps = 'Caps' as any,
  Enter = 'Enter' as any,
  Shift = 'Shift' as any,
  Space = 'Space' as any,
  Tab = 'Tab' as any
}
