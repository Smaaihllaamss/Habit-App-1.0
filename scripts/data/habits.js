'use strict';

/**
 * Module for managing habits array.
 * Provides actions to add, update, delete habits and retrieve them by ID.
 *
 * @module habits
 */

/**
 * @typedef {import('./types.d.js').Habit} Habit
 * @typedef {import('./types.d.js').NewHabit} NewHabit
 * @typedef {import('./types.d.js').HabitChanges} HabitChanges
 */

export let habits = [];

/**
 * Adds a new habit to the habits array.
 *
 * @export
 * @param {NewHabit} newHabit - New habit data object.
 * @returns {Habit[]} habits - Updated array of habits including the new habit.
 */
export function addNewHabitAction(newHabit) {
  habits = addNewHabit(newHabit);
  return habits;
}

/**
 * Internal helper to add a new habit with generated ID.
 *
 * @param {NewHabit} newHabit - New habit data object.
 * @returns {Habit[]} habits - New array of habits with the added habit.
 */
function addNewHabit(newHabit) {
  const habitWithId = {
    id: generateHabitId(),
    ...newHabit,
  };

  return [...habits, habitWithId];
}

/**
 * Generates a unique habit ID using timestamp and random number.
 *
 * @returns {string} habitId - Unique identifier for a habit.
 */
function generateHabitId() {
  const timestamp = Date.now(); //текущее время в миллисекундах
  const random = Math.floor(Math.random() * 1000); //random number from 0 to 999

  return `habit_${timestamp}_${random}`;
}

/**
 * Retrieves a habit object by its ID.
 *
 * @export
 * @param {string} habitId - Identifier of the habit.
 * @returns {Habit|undefined} - Habit object if found, otherwise undefined.
 */
export function getHabitById(habitId) {
  return habits.find(habit => habit.id === habitId);
}

// REVIEW: Decide whether the option is needed.
// export function getDayByDayIndex(habit, dayIndex) {
//   const day = habit.days.find((d) => d.index === dayIndex);
//   return day;
// }

/**
 * Updates a habit in the habits array by applying changes.
 *
 * @export
 * @param {string} habitId - Identifier of the habit to update.
 * @param {HabitChanges} habitChanges - Object containing updated habit properties.
 * @returns {Habit[]} habits - Updated array of habits.
 */
export function updateHabitAction(habitId, habitChanges) {
  habits = updateHabit(habitId, habitChanges);
  return habits;
}

/**
 * Internal helper to update habit properties.
 *
 * @param {string} habitId - Identifier of the habit.
 * @param {HabitChanges} habitChanges - Object with updated properties.
 * @returns {Habit[]} habits - Updated array of habits.
 */
function updateHabit(habitId, habitChanges) {
  return habits.map(habit =>
    habit.id === habitId
      ? {
          ...habit,
          name: habitChanges.newName,
          goalDays: habitChanges.newGoal,
          icon: habitChanges.newIconId,
        }
      : habit
  );
}

/**
 * Deletes a habit from the habits array by ID.
 *
 * @export
 * @param {string} habitId - Identifier of the habit to delete.
 * @returns {Habit[]} habits - Updated array of habits without the deleted habit.
 */
export function deleteHabitAction(habitId) {
  habits = deleteHabit(habitId);
  return habits;
}

/**
 * Internal helper to remove a habit by ID.
 *
 * @param {string} habitId - Identifier of the habit.
 * @returns {Habit[]} habits - New array without the specified habit.
 */
function deleteHabit(habitId) {
  return habits.filter(habit => habit.id !== habitId);
}
