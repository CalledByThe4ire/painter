/* global document */
/* eslint  no-restricted-syntax: 0 */
export default class ColorPalette {
  constructor({ element, colors = [] }) {
    this.element = element;
    this.colorElements = [];

    this.colors = colors;
    this.currentColor = null;

    this.init();
  }

  init() {
    this.element.addEventListener('click', this.handleColorSelected.bind(this));

    for (const color of this.colors) {
      this.addColorElement(color);
    }
  }

  handleColorSelected({ target }) {
    if (target.tagName === 'LI') {
      this.currentColor = target.style.backgroundColor;

      for (const colorElement of this.colorElements) {
        colorElement.classList.remove('color-palette__color--selected');
      }

      target.classList.add('color-palette__color--selected');
    }
  }

  addColor(color) {
    this.addColorElement(color);
  }

  addColorElement(color) {
    const li = document.createElement('li');
    li.className = 'color-palette__color';
    li.style.backgroundColor = `rgb(${color.red},${color.green},${color.blue})`;
    this.element.appendChild(li);
    this.colorElements.push(li);
  }
}
