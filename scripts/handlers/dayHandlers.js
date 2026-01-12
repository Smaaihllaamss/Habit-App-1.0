'use strict';

import { submitDoneDayForm, deleteDayAction } from '../actions/dayActions.js';
import { getCurrentHabitId } from '../utils/uiUtils.js';
import { logger } from '../utils/logger.js';

/**
 * Handles submission of the "done day" form.
 * Extracts habit ID, day index, and comment from the form,
 * then updates the habit data and logs the action.
 *
 * @export
 * @param {SubmitEvent} event - Form submit event triggered by clicking the "done day" button.
 */
export function handleDoneDayFormSubmit(event) {
  const btnDone = event.submitter;

  const habitId = getCurrentHabitId(btnDone); //ID from DOM

  const newDayForm = btnDone.closest('form');
  const dayIndex = +newDayForm.closest('li').getAttribute('data-day-index');
  const dayCommentValue = newDayForm.elements['day__comment'].value.trim();

  const dayFormData = {
    doneDayIndex: dayIndex,
    doneDayComment: dayCommentValue,
  };

  submitDoneDayForm(habitId, dayFormData);

  logger.info('Done day added', { habitId, ...dayFormData });
}

/**
 * Handles deletion of a "done day" entry.
 * Retrieves habit ID and day index from the DOM,
 * then removes the day entry and logs the action.
 *
 * @export
 * @param {MouseEvent} event - Click event on delete day button.
 * @param {HTMLElement} deleteDayBtn - The button element used to delete the day.
 */
export function deleteDayHandler(event, deleteDayBtn) {
  const habitId = getCurrentHabitId(deleteDayBtn); //ID from DOM
  const dayIndex = +deleteDayBtn.closest('li').getAttribute('data-day-index');

  deleteDayAction(habitId, dayIndex);

  logger.info('Done day deleted', { habitId, dayIndex });
}
