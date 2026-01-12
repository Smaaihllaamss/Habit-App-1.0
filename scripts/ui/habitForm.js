'use strict';

// Habit Form in the Dialog

import {
  iconChangeHandler,
  inputFocusHandler,
  inputBlurHandler,
  inputInputHandler,
  validateHabitFormHandler,
} from '../handlers/habitHandlers.js';

/**
 * Main habit form element inside the dialog.
 * @export
 * @type {HTMLFormElement}
 */
export const habitForm = document.forms['habit-form'];

/**
 * Wrapper element for habit icons inside the form.
 * @export
 * @type {HTMLElement}
 */
export const iconsWrapper = habitForm.querySelector('.form1__icons-wrapper');

/**
 * Container element holding habit icon radio inputs.
 * @export
 * @type {HTMLElement}
 */
export const iconContainer = habitForm.querySelector('#icon-container');

/**
 * All input elements inside the habit form.
 * @export
 * @type {NodeListOf<HTMLInputElement>}
 */
export const habitFormInputs = habitForm.querySelectorAll('.form1__input');

/**
 * Input element for habit name.
 * @export
 * @type {HTMLInputElement}
 */
export const habitNameInput = habitForm.elements['habit-name'];

/**
 * Input element for habit goal (number of days).
 * @export
 * @type {HTMLInputElement}
 */
export const habitGoalInput = habitForm.elements['habit-goal'];

/**
 * Submit button element for the habit form.
 * @export
 * @type {HTMLButtonElement}
 */
export const habitSubmitBtn = habitForm.elements['habit-submit-btn'];

// Disable native HTML5 validation, custom validation is handled manually
habitForm.noValidate = true;

/**
 * Initializes listeners for habit icon radio inputs.
 * Attaches change event handlers to update selected icon.
 *
 * @export
 * @returns {void}
 */
export function initIconListeners() {
  const radios = getHabitIconRadioInputs();
  radios.forEach(radio => radio.addEventListener('change', iconChangeHandler));
}

// Attach input event listeners for validation and styling
habitFormInputs.forEach(input => {
  input.addEventListener('focus', inputFocusHandler);
  input.addEventListener('blur', inputBlurHandler);
  input.addEventListener('input', inputInputHandler);
});

// Attach submit event listener for form validation
habitForm.addEventListener('submit', validateHabitFormHandler);

/**
 * Retrieves all habit icon radio input elements.
 *
 * @export
 * @returns {NodeListOf<HTMLInputElement>} - Collection of radio inputs.
 */
export function getHabitIconRadioInputs() {
  return iconContainer.querySelectorAll('input[type="radio"]');
}

/**
 * Retrieves all icon label elements associated with radio inputs.
 *
 * @export
 * @returns {NodeListOf<HTMLElement>} - Collection of icon labels.
 */
export function getIconLabels() {
  return iconContainer.querySelectorAll('.input-radio__label');
}

/**
 * Gets the currently selected icon ID from the form.
 *
 * @export
 * @returns {string|null} iconId - Selected icon identifier, or null if none selected.
 */
export function getIconId() {
  const labels = getIconLabels();

  for (let item of labels) {
    if (item.classList.contains('is-checked')) {
      const iconUse = item.getElementsByTagName('use')[0];
      const iconHref = iconUse.getAttribute('href');
      const iconId = iconHref.slice(1);
      return iconId;
    }
  }

  return null;
}

/**
 * Clears validation state and feedback message for a given input.
 *
 * @export
 * @param {HTMLInputElement} input - Input element to clear.
 * @returns {void}
 */
export function clearInput(input) {
  input.classList.remove('is-valid', 'is-invalid');
  input.setCustomValidity('');

  const inputFeedbackEl = input.closest('div').querySelector('.form__feedback');

  if (inputFeedbackEl) {
    inputFeedbackEl.textContent = '';
    inputFeedbackEl.classList.remove('valid-feedback', 'invalid-feedback');
  }
}

/**
 * Resets the habit form and clears validation states and feedback messages.
 *
 * @export
 * @param {HTMLFormElement} habitForm - Habit form element to reset.
 * @returns {void}
 */
export function clearForm(habitForm) {
  habitForm.reset();

  if (habitForm.id === 'edit-habit-form') {
    habitForm.id = '';
  }

  const inputs = habitForm.querySelectorAll('.form1__input');

  for (let input of inputs) {
    input.classList.remove('is-valid', 'is-invalid');

    const feedbackElement = input
      .closest('div')
      ?.querySelector('.form__feedback');

    if (feedbackElement) {
      feedbackElement.textContent = '';
      feedbackElement.classList.remove('valid-feedback', 'invalid-feedback');
    }
  }
}
