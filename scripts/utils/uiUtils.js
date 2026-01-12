'use strict';

/**
 * @typedef {import('./types.d.js').Habit} Habit
 */

/**
 * Retrieves the current habit ID from the DOM.
 *
 * @export
 * @returns {string|null} habitId - The ID of the current habit, or null if not found.
 */
export function getCurrentHabitId() {
  const habitId = document
    .querySelector('#habit-content')
    ?.getAttribute('data-habit-id');

  return habitId;
}

/**
 * Clears the current habit identifier from the habit-content container in the DOM.
 * Removes the "data-habit-id" attribute from the #habit-content element if it exists.
 *
 * @export
 * @returns {void}
 */
export function clearHabitId() {
  document.querySelector('#habit-content')?.removeAttribute('data-habit-id');
}

/**
 * Feedback message element for displaying habit status.
 *
 * @export
 * @type {HTMLElement}
 */
export const habitFeedback = document.querySelector('.habit__feedback');

/**
 * Displays a success message when the habit goal is completed.
 *
 * @export
 * @param {Habit} habit - Habit object containing days and goalDays.
 * @returns {void}
 */
export function showCompleteHabitMessage(habit) {
  const doneDays = habit.days.filter(day => day.done === true).length;
  const goalDays = habit.goalDays;

  const completeHabitMessage = `Congratulations!🎉 You have achieved your goal.\nYou have practiced the habit of "${habit.name}"  for ${doneDays} days.`;

  if (doneDays === goalDays) {
    setSuccessHabitFeedback(completeHabitMessage);
  }
}

/**
 * Internal helper to set success feedback message in the UI.
 *
 * @param {string} message - Success message text.
 * @returns {void}
 */
function setSuccessHabitFeedback(message) {
  habitFeedback.classList.add('success');
  habitFeedback.innerText = message;
}

/**
 * Clears the habit feedback message from the UI.
 *
 * @export
 * @returns {void}
 */
export function clearHabitFeedback() {
  habitFeedback.classList.remove('success');
  habitFeedback.innerText = '';
}
