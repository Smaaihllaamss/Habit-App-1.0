'use strict';

import { getHabitById } from '../data/habits.js';

import {
  addNewDayPipeline,
  deleteDayPipeline,
} from '../pipelines/pipelines.js';

import {
  replaceDays,
  addNewDay,
  deleteDay,
  updateDayIndexes,
} from '../utils/dayUtils.js';

/**
 * @typedef {import('./types.d.js').Habit} Habit
 * @typedef {import('./types.d.js').DayFormData} DayFormData
 */

/**
 * Submits the "done day" form for a habit.
 * Replaces the habit's days with updated data and runs the addNewDay pipeline.
 *
 * @export
 * @param {string} habitId - Identifier of the habit.
 * @param {DayFormData} dayFormData - Data from the day form (index and comment).
 * @returns {Habit} - Updated habit object with modified days.
 */
export function submitDoneDayForm(habitId, dayFormData) {
  const habit = getHabitById(habitId); //from habits array
  habit.days = replaceDays(habit, dayFormData);

  addNewDayPipeline.forEach(fn => fn(habit));

  return habit;
}

/**
 * Adds a new day entry to the given habit.
 *
 * @export
 * @param {Habit} habit - Habit object to update.
 * @returns {Habit} - Updated habit object with the new day added.
 */
export function addNewDayAction(habit) {
  habit.days = addNewDay(habit);
  return habit;
}

/**
 * Deletes a day entry from a habit by index.
 * Runs the deleteDay pipeline after removal.
 *
 * @export
 * @param {string} habitId - Identifier of the habit.
 * @param {number} dayIndex - Index of the day to delete.
 * @returns {Habit} - Updated habit object with the day removed.
 */
export function deleteDayAction(habitId, dayIndex) {
  const habit = getHabitById(habitId); //from habits array
  habit.days = deleteDay(habit, dayIndex);

  deleteDayPipeline.forEach(fn => fn(habit));

  return habit;
}

/**
 * Updates indexes of all day entries in the given habit.
 *
 * @export
 * @param {Habit} habit - Habit object to update.
 * @returns {Habit} - Updated habit object with reindexed days.
 */
export function updateDayIndexesAction(habit) {
  habit.days = updateDayIndexes(habit);
  return habit;
}
