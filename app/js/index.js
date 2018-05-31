/* global document */
/* eslint no-new: 0 */
import App from './app';
import ColorPalette from './color-palette';
import ColorPicker from './color-picker';

new App({
  canvas: document.querySelector('.app__canvas'),

  colorPalette: new ColorPalette({
    element: document.querySelector('.color-palette'),
    colors: [
      { red: 252, green: 76, blue: 79 },
      { red: 79, green: 163, blue: 252 },
      { red: 104, green: 178, blue: 91 },
    ],
  }),

  colorPicker: new ColorPicker({
    element: document.querySelector('.color-picker'),
  }),
});
