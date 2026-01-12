'use strict';
import { habits } from '../data/habits.js';

import {
  createNewHabitPipeline,
  editHabitPipeline,
} from '../pipelines/pipelines.js';

import { buildHabit, buildHabitChanges } from '../utils/habitUtils.js';
import { logger } from '../utils/logger.js';

/**
 * @typedef {import('./types.d.js').FormData} FormData
 */

/**
 * Submits habit form data depending on mode (create or edit).
 * - In "create" mode: builds a new habit object and runs the creation pipeline.
 * - In "edit" mode: builds changes object and runs the edit pipeline for the given habit ID.
 * Logs the state of habits after each operation.
 *
 * @export
 * @param {'create'|'edit'} mode - Operation mode: "create" for new habit, "edit" for updating existing habit.
 * @param {FormData} formData - Form data containing habit properties.
 * @param {string|null} [habitId=null] - Habit identifier required in "edit" mode.
 * @returns {void}
 */
export function submitHabitForm(mode, formData, habitId = null) {
  if (mode === 'create') {
    const newHabit = buildHabit(formData);
    createNewHabitPipeline.forEach(fn => fn(newHabit));

    logger.debug('Habits after creating habit', habits);
  } else if (mode === 'edit' && formData && habitId) {
    const habitChanges = buildHabitChanges(formData);
    editHabitPipeline.forEach(fn => fn(habitId, habitChanges));

    logger.debug('Habits after editing habit', habits);
  }
}
