'use strict';

import { getHabitById } from '../data/habits.js';
import { iconContainer, habitGoalInput } from '../ui/habitForm.js';
import { getDoneDaysCount } from '../utils/dayUtils.js';
import { logger } from '../utils/logger.js';

/**
//  * @typedef {import('./types.d.js').Habit} Habit
 * @typedef {import('./types.d.js').FormData} FormData
 */

const errorMessages = {
  required: 'This field is required',
  habitIcon: 'Select a habit icon',
  habitName:
    'Name must be 2–50 characters and not start or end with a space or hyphen',
  habitGoal: 'Please enter a number between 5 and 100',
  tooSmallGoal: 'Your new goal is fewer days completed',
};

/**
 * Validates that an input is not empty (blur validation).
 *
 * @export
 * @param {HTMLInputElement} input - Input element to validate.
 * @returns {boolean} - True if input is not empty, false otherwise.
 */
export function validateRequiredInput(input) {
  const empty = isEmpty(input.value);

  if (empty) {
    markInvalid(input, errorMessages.required);
    return false;
  }

  return true;
}

/**
 * Checks if a value is empty (null, undefined, or empty string).
 *
 * @param {string|number|null|undefined} value - Value to check.
 * @returns {boolean} - True if empty, false otherwise.
 */
function isEmpty(value) {
  return value === '' || value === null || value === undefined;
}

/**
 * Validates habit name input against regex rules.
 *
 * @export
 * @param {HTMLInputElement} input - Input element containing habit name.
 * @returns {boolean} - True if valid, false otherwise.
 */
export function validateHabitName(input) {
  const result = isHabitNameValid(input.value);

  if (result.valid) {
    markValid(input);
    return true;
  } else {
    markInvalid(input, result.error);
    return false;
  }
}

/**
 * Checks if habit name is valid.
 * Rules: 2–50 characters, cannot start/end with space or hyphen.
 *
 * @param {string} name - Habit name string.
 * @returns {{valid: boolean, error?: string}} - Validation result.
 */
function isHabitNameValid(name) {
  if (isEmpty(name)) {
    return { valid: false, error: errorMessages.required };
  } else if (
    name.match(/^(?!\s*$)(?![- ])[a-zа-яёэєії0-9&:\- ]{3,50}(?<![- ])$/i)
  ) {
    return { valid: true };
  }
  return { valid: false, error: errorMessages.habitName };
}

/**
 * Validates habit goal input (number between 5 and 100).
 *
 * @export
 * @param {HTMLInputElement} input - Input element containing habit goal.
 * @returns {boolean} - True if valid, false otherwise.
 */
export function validateHabitGoal(input) {
  const result = isHabitGoalValid(Number(input.value));

  if (result.valid) {
    markValid(input);
    return true;
  } else {
    markInvalid(input, result.error);
    return false;
  }
}

/**
 * Checks if habit goal is valid.
 *
 * @param {number} goal - Goal number.
 * @returns {{valid: boolean, error?: string}} - Validation result.
 */
function isHabitGoalValid(goal) {
  if (isEmpty(goal) || isNaN(goal)) {
    return { valid: false, error: errorMessages.required };
  } else if (goal >= 5 && goal <= 100) {
    return { valid: true };
  }
  return { valid: false, error: errorMessages.habitGoal };
}

/**
 * Marks input as valid and shows feedback message.
 *
 * @param {HTMLInputElement} input - Input element.
 * @param {string} [feedbackMessage='Looks good!'] - Feedback message.
 * @returns {void}
 */
function markValid(input, feedbackMessage = 'Looks good!') {
  input.classList.remove('is-invalid');
  input.classList.add('is-valid');
  input.setCustomValidity('');

  const inputFeedbackEl = input.closest('div').querySelector('.form__feedback');

  inputFeedbackEl.classList.remove('invalid-feedback');
  inputFeedbackEl.classList.add('valid-feedback');
  inputFeedbackEl.textContent = feedbackMessage;
}

/**
 * Marks input as invalid and shows feedback message.
 *
 * @param {HTMLInputElement} input - Input element.
 * @param {string} [feedbackMessage='Invalid data!'] - Feedback message.
 * @returns {void}
 */

/**
 * Marks input as invalid and shows feedback message.
 *
 * @param {HTMLInputElement} input - Input element.
 * @param {string} [feedbackMessage='Invalid data!'] - Feedback message.
 * @returns {void}
 */
function markInvalid(input, feedbackMessage = 'Invalid data!') {
  input.classList.remove('is-valid');
  input.classList.add('is-invalid');
  input.setCustomValidity(feedbackMessage);

  const inputFeedbackEl = input.closest('div').querySelector('.form__feedback');

  inputFeedbackEl.classList.remove('valid-feedback');
  inputFeedbackEl.classList.add('invalid-feedback');
  inputFeedbackEl.textContent = feedbackMessage;
}

/**
 * @typedef {object} ValidationResult
 * @property {boolean} isIconValid - Whether the icon field is valid.
 * @property {boolean} isNameValid - Whether the name field is valid.
 * @property {boolean} isGoalValid - Whether the goal field is valid.
 */

/**
 * Validates habit form data on submit.
 * Checks icon, name, and goal fields. For existing habits, ensures new goal is not less than completed days.
 *
 * @export
 * @param {HabitFormData} formData - Form data object.
 * @param {string|null} [habitId=null] - Habit ID if editing existing habit.
 * @returns {ValidationResult} - Validation results.
 */
export function validateHabitFormData({ iconId, name, goal }, habitId = null) {
  const { valid: isIconValid } = isIconChecked(iconId);
  const { valid: isNameValid } = isHabitNameValid(name);
  let { valid: isGoalValid } = isHabitGoalValid(goal);

  if (isGoalValid && habitId) {
    isGoalValid = validateGoalForExistingHabit(habitId, goal);
  }

  return { isIconValid, isNameValid, isGoalValid };
}

/**
 * Validates goal for an existing habit.
 * Ensures new goal is not smaller than already completed days.
 *
 * @param {string} habitId - Habit identifier.
 * @param {number} goal - New goal value.
 * @returns {boolean} - True if valid, false otherwise.
 */
function validateGoalForExistingHabit(habitId, goal) {
  const habit = getHabitById(habitId);
  const doneDaysCount = getDoneDaysCount(habit);
  const { valid, error } = isGoalValidForHabit(doneDaysCount, goal);

  if (!valid) {
    markInvalid(habitGoalInput, errorMessages.tooSmallGoal);
    logger.warn('Habit goal validation failed', { goal, doneDaysCount });
    return false;
  }
  return true;
}

/**
 * Checks if icon is selected.
 *
 * @param {string|null} iconId - Selected icon ID.
 * @returns {{valid: boolean, error?: string}} - Validation result.
 */
function isIconChecked(iconId) {
  if (iconId) {
    clearIconsFeedback();
    return { valid: true };
  } else {
    showInvalidFeedback(errorMessages.habitIcon);
    return { valid: false, error: errorMessages.habitIcon };
  }
}

/**
 * Shows invalid feedback message for icon selection.
 *
 * @param {string} [feedbackMessage='Icon didn`t select!'] - Feedback message.
 * @returns {void}
 */
function showInvalidFeedback(feedbackMessage = 'Icon didn`t select!') {
  const iconRadioFeedbackEl = iconContainer.nextElementSibling;

  iconRadioFeedbackEl.textContent = '';
  iconRadioFeedbackEl.classList.remove('valid-feedback', 'invalid-feedback');
  iconRadioFeedbackEl.classList.add('invalid-feedback');
  iconRadioFeedbackEl.textContent = feedbackMessage;
}

/**
 * Clears feedback message for icon selection.
 *
 * @export
 * @returns {void}
 */
export function clearIconsFeedback() {
  const iconRadioFeedbackEl = iconContainer.nextElementSibling;

  iconRadioFeedbackEl.textContent = '';
  iconRadioFeedbackEl.classList.remove('valid-feedback', 'invalid-feedback');
}

/**
 * Checks if new goal is valid compared to completed days.
 *
 * @param {number} doneDaysCount - Number of completed days.
 * @param {number} newGoal - New goal value.
 * @returns {{valid: boolean, error?: string}} - Validation result.
 */
function isGoalValidForHabit(doneDaysCount, newGoal) {
  if (newGoal < doneDaysCount) {
    return { valid: false, error: errorMessages.tooSmallGoal };
  }

  return { valid: true };
}
