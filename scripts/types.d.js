'use strict';

/**
 * Global typedefs for the project.
 * These types are referenced across modules via JSDoc.
 */

/**
 * @typedef {object} Habit
 * @property {string} id - Habit identifier.
 * @property {string} name - Habit name.
 * @property {number} goalDays - Target number of days.
 * @property {string} icon - Icon identifier.
 * @property {Day[]} days - Array of day objects.
 */

/**
 * @typedef {object} Day
 * @property {number} index - Day index.
 * @property {string} comment - Comment for the day.
 * @property {boolean} done - Completion status.
 */

/**
 * @typedef {object} NewHabit
 * @property {string} name - Name of the habit.
 * @property {number} goalDays - Target number of days.
 * @property {string} icon - Icon identifier.
 * @property {Day[]} [days] - Optional array of day entries; usually starts with one unfinished day.
 */

/**
 * @typedef {object} FormData
 * @property {string|null} iconId - Identifier of the selected icon.
 * @property {string} name - Name of the habit.
 * @property {number} goal - Goal (number of days) for the habit.
 */

/**
 * @typedef {object} HabitChanges
 * @property {string} newName - New name for the habit.
 * @property {number} newGoal - New goal (number of days) for the habit.
 * @property {string} newIconId - New icon identifier for the habit.
 */

/**
 * @typedef {object} DayFormData
 * @property {number} doneDayIndex - Index of the completed day.
 * @property {string} doneDayComment - Comment for the completed day.
 */
