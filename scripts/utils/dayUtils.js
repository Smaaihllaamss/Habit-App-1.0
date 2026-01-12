'use strict';

/**
 * @typedef {import('./types.d.js').Habit} Habit
 * @typedef {import('./types.d.js').Day} Day
 * @typedef {import('./types.d.js').DayFormData} DayFormData
 */

/**
 * Replaces a day entry in the habit with a new "done day" from form data.
 *
 * @export
 * @param {Habit} habit - Habit object containing days.
 * @param {DayFormData} dayFormData - Data from the day form.
 * @returns {Day[]} days - Updated array of days with the new "done day".
 */
export function replaceDays(habit, dayFormData) {
  const doneDays = habit.days.filter(
    day => day.index != dayFormData.doneDayIndex
  );
  const newDoneDay = buildDoneDay(dayFormData);

  return [...doneDays, newDoneDay];
}

/**
 * Internal helper to build a "done day" object.
 *
 * @param {DayFormData} dayFormData - Data from the day form.
 * @returns {Day} day - New day object marked as done.
 */
function buildDoneDay(dayFormData) {
  return {
    index: dayFormData.doneDayIndex,
    comment: dayFormData.doneDayComment,
    done: true,
  };
}

/**
 * Adds a new day entry to the habit if conditions are met:
 * - Done days count is less than goalDays.
 * - No unfinished days remain.
 *
 * @export
 * @param {Habit} habit - Habit object containing days and goalDays.
 * @returns {Day[]} days - Updated array of days with a new day added if applicable.
 */
export function addNewDay(habit) {
  const goalDays = habit.goalDays;
  const days = habit.days;
  const doneDaysCount = getDoneDaysCount(habit);
  const notDoneDaysCount = getNotDoneDaysCount(habit);

  if (doneDaysCount < goalDays && notDoneDaysCount < 1) {
    const newDay = buildNewDay(habit);
    return [...days, newDay];
  }

  return days;
}

/**
 * Counts the number of completed days in a habit.
 *
 * @export
 * @param {Habit} habit - Habit object containing days.
 * @returns {number} count - Number of days marked as done.
 */
export function getDoneDaysCount(habit) {
  return habit.days.filter(day => day.done).length;
}

/**
 * Internal helper to count unfinished days in a habit.
 *
 * @param {Habit} habit - Habit object containing days.
 * @returns {number} count - Number of days not marked as done.
 */
function getNotDoneDaysCount(habit) {
  return habit.days.filter(day => !day.done).length;
}

/**
 * Internal helper to build a new unfinished day object.
 *
 * @param {Habit} habit - Habit object containing days.
 * @returns {Day} day - New day object with incremented index.
 */
function buildNewDay(habit) {
  const lastIndex = habit.days.length;
  return {
    index: lastIndex + 1,
    comment: '',
    done: false,
  };
}

/**
 * Deletes a day entry from a habit by index.
 *
 * @export
 * @param {Habit} habit - Habit object containing days.
 * @param {number} dayIndex - Index of the day to delete.
 * @returns {Day[]} days - Updated array of days without the deleted entry.
 */
export function deleteDay(habit, dayIndex) {
  return habit.days.filter(day => day.index !== dayIndex);
}

/**
 * Updates indexes of all day entries in a habit.
 * Sorts days by index and reassigns sequential indexes starting from 1.
 *
 * @export
 * @param {Habit} habit - Habit object containing days.
 * @returns {Day[]} days - Updated array of days with corrected indexes.
 */
export function updateDayIndexes(habit) {
  const sortedDays = [...habit.days].sort((a, b) => a.index - b.index);
  return sortedDays.map((day, i) => ({ ...day, index: i + 1 }));
}
