// TODO: use real string based enums (available sine typescript 1.4) if
// [tslint](https://github.com/palantir/tslint/issues/2993) and more important
// [rollup](https://github.com/angular/angular/issues/17516) support it
/*
export enum KeyboardModifier {
  None = 'None',
  Shift = 'Shift',
  Alt = 'Alt',
  ShiftAlt = 'ShiftAlt'
}
*/
export enum KeyboardModifier {
  None = 'None' as any,
  Shift = 'Shift' as any,
  Alt = 'Alt' as any,
  ShiftAlt = 'ShiftAlt' as any
}
