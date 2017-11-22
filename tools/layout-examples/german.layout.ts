import { KeyboardClassKey } from '../src/core/src/enums/keyboard-class-key.enum';

export const LAYOUT_GERMAN: any = {
  'name': 'Deutsch',
  'lang': ['de'],
  'keys': [
    [
      ['^', '\u00b0'],
      ['1', '!'],
      ['2', '"', '\u00b2'],
      ['3', '\u00a7', '\u00b3'],
      ['4', '$'],
      ['5', '%'],
      ['6', '&'],
      ['7', '/', '{'],
      ['8', '(', '['],
      ['9', ')', ']'],
      ['0', '=', '}'],
      ['\u00df', '?', '\\'],
      ['\u00b4', '`'],
      [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
    ],
    [
      [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
      ['q', 'Q', '@'],
      ['w', 'W'],
      ['e', 'E', '\u20ac'],
      ['r', 'R'],
      ['t', 'T'],
      ['z', 'Z'],
      ['u', 'U'],
      ['i', 'I'],
      ['o', 'O'],
      ['p', 'P'],
      ['\u00fc', '\u00dc'],
      ['+', '*', '~'],
      ['#', '\'']
    ],
    [
      [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
      ['a', 'A'],
      ['s', 'S'],
      ['d', 'D'],
      ['f', 'F'],
      ['g', 'G'],
      ['h', 'H'],
      ['j', 'J'],
      ['k', 'K'],
      ['l', 'L'],
      ['\u00f6', '\u00d6'],
      ['\u00e4', '\u00c4'],
      [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
    ],
    [
      [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
      ['<', '>', '\u00a6'],
      ['y', 'Y'],
      ['x', 'X'],
      ['c', 'C'],
      ['v', 'V'],
      ['b', 'B'],
      ['n', 'N'],
      ['m', 'M', '\u00b5'],
      [',', ';'],
      ['.', ':'],
      ['-', '_'],
      [KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr]
    ],
    [
      [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space]
    ]
  ]
};