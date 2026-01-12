'use strict';

import { getCurrentHabitId } from '../utils/uiUtils.js';

import {
  habitForm,
  habitNameInput,
  habitGoalInput,
  getIconLabels,
  getIconId,
  clearInput,
} from '../ui/habitForm.js';

import {
  validateRequiredInput,
  validateHabitFormData,
  validateHabitName,
  validateHabitGoal,
  clearIconsFeedback,
} from '../validation/formValidation.js';

import { deleteHabitPipeline } from '../pipelines/pipelines.js';
import { submitHabitForm } from '../actions/habitActions.js';
import { toggleDialog } from '../ui/habitDialog.js';
import { logger } from '../utils/logger.js';

/**
 * Handles habit deletion triggered by user action.
 *
 * @export
 * @param {MouseEvent} event - Click event on delete habit button.
 */
export function deleteHabitHandler(event) {
  const habitId = getCurrentHabitId();
  deleteHabitPipeline.forEach(fn => fn(habitId));
  logger.info('Habit deleted', { habitId });
}

/**
 * Handles icon selection change in the habit form.
 * Clears previous feedback and updates the selected icon state.
 *
 * @export
 * @param {Event} event - Change event from icon radio input.
 */
export function iconChangeHandler(event) {
  clearIconsFeedback();

  const input = event.target;
  const label = input.closest('.input-radio__label');

  getIconLabels().forEach(lbl => lbl.classList.remove('is-checked'));

  if (input.checked) {
    label.classList.add('is-checked');
    logger.debug('Habit icon selected', { iconId: input.id });
  }
}

/**
 * Clears input field value when it receives focus.
 *
 * @export
 */
export function inputFocusHandler() {
  clearInput(this);
}

/**
 * Validates input field on blur depending on its ID.
 *
 * @export
 * @param {FocusEvent} event - Blur event from input field.
 */
export function inputBlurHandler(event) {
  const input = event.target;

  switch (input.id) {
    case 'habit-name':
      validateHabitName(input);
      break;
    case 'habit-goal':
      validateHabitGoal(input);
      break;
    default:
      if (input.required) {
        validateRequiredInput(input);
      }
  }
}

/**
 * Validates input field dynamically while typing.
 *
 * @export
 */
export function inputInputHandler() {
  switch (this.id) {
    case 'habit-name':
      validateHabitName(this);
      break;
    case 'habit-goal':
      validateHabitGoal(this);
      break;
  }
}

/**
 * Validates and submits the habit form.
 * Performs data validation and calls submit pipeline depending on mode (create/edit).
 *
 * @export
 * @param {SubmitEvent} event - Form submit event.
 */
export function validateHabitFormHandler(event) {
  event.preventDefault();

  const formData = {
    iconId: getIconId(),
    name: habitNameInput.value.trim(),
    goal: Number(habitGoalInput.value),
  };
  logger.debug('Form data before validation', formData);

  const habitId =
    habitForm.id === 'edit-habit-form' ? getCurrentHabitId() : null;

  // Data validation
  const { isIconValid, isNameValid, isGoalValid } = validateHabitFormData(
    formData,
    habitId
  );

  if (!isIconValid || !isNameValid || !isGoalValid) {
    logger.warn('Habit form validation failed', formData);
    return;
  }

  logger.debug('Validation results', { isIconValid, isNameValid, isGoalValid });

  // Form submission depending on mode
  if (habitForm.id === 'create-habit-form') {
    submitHabitForm('create', formData);
    logger.info('Habit created successfully', formData);
  } else if (habitForm.id === 'edit-habit-form') {
    submitHabitForm('edit', formData, habitId);
    toggleDialog();
    logger.info('Habit edited successfully', { habitId, ...formData });
  } else {
    logger.error('Habit form submit failed: unknown mode', {
      formId: habitForm.id,
    });

    return;
  }
}
