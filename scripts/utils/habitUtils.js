'use strict';

/**
 * @typedef {import('./types.d.js').Habit} Habit
 * @typedef {import('./types.d.js').FormData} FormData
 */

/**
 * Builds a new habit object from formData.
 * Initializes the habit with name, goal, icon, and a default first day entry.
 *
 * @export
 * @param {FormData} formData - Form data object.
 * @returns {Habit} habit - New habit object.
 */
export function buildHabit(formData) {
  return {
    name: formData.name,
    goalDays: formData.goal,
    icon: formData.iconId,
    days: [{ index: 1, comment: '', done: false }],
  };
}

/**
 * Builds an object containing changes to update an existing habit.
 *
 * @export
 * @param {FormData} formData - Form data object.
 * @returns {HabitChanges} habitChanges - Object with updated habit properties.
 */
export function buildHabitChanges(formData) {
  return {
    newName: formData.name,
    newGoal: formData.goal,
    newIconId: formData.iconId,
  };
}
