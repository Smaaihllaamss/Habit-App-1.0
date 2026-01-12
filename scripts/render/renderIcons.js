'use strict';
// Drawing icons in the dialog "New Habit" / "Edit Habit"

import {
  iconContainer,
  getHabitIconRadioInputs,
  getIconLabels,
} from '../ui/habitForm.js';

/**
 * @typedef {object} Icon
 * @property {string} id - Identifier of the icon, taken from the icons array and used as both the input's id and value.
 * @property {string} label - Human-readable description of the icon.
 */

/**
 * Renders all habit icons inside the icon-container.
 * Clears existing icons, appends new ones, and sets the first icon as selected by default.
 *
 * @export
 * @param {Icon[]} icons - Array of icon objects.
 * @returns {void}
 */
export function addIcons(icons) {
  iconContainer.innerHTML = '';
  icons.forEach(item => iconContainer.append(renderIcon(item)));

  // First icon is-checked default
  const labels = getIconLabels();
  const radios = getHabitIconRadioInputs();
  if (labels.length > 0) {
    labels[0].classList.add('is-checked');
    radios[0].checked = true;
  }
}

/**
 * Renders a single habit icon as a radio input with label.
 * Supports both embedded sprite icons (<svg><use>) and external SVG files (<img>).
 *
 * @export
 * @param {Icon[]} icons - Array of icon objects.
 * @returns {HTMLLabelElement} inputLabel - Label element containing radio input and icon.
 */
export function renderIcon(icon) {
  const inputLabel = document.createElement('label');
  inputLabel.className = 'input-radio__label';

  const inputControl = document.createElement('input');
  inputControl.className = 'input-radio__control';
  inputControl.type = 'radio';
  inputControl.name = 'habit-icon';
  inputControl.id = icon.id;
  inputControl.value = icon.id;

  let iconElement;
  if (icon.src) {
    // External SVG file — use <img>
    iconElement = document.createElement('img');
    iconElement.className = 'input-radio__img';
    iconElement.src = icon.src;
    iconElement.alt = icon.label;
  } else {
    // Embedded sprite — using <svg><use>
    iconElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    iconElement.classList.add('input-radio__icon');

    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', `#${icon.id}`);
    iconElement.append(use);
  }

  inputLabel.append(inputControl);
  inputLabel.append(iconElement);

  return inputLabel;
}
