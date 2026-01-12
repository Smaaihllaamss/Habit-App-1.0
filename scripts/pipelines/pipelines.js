'use strict';

//"Scenarios" (sets of steps)

import {
  habits,
  getHabitById,
  addNewHabitAction,
  updateHabitAction,
  deleteHabitAction,
} from '../data/habits.js';

import { habitForm, clearForm } from '../ui/habitForm.js';

import {
  renderSidebar,
  activeFirstHabit,
  activeCurrentHabit,
  attachSidebarEvents,
} from '../render/renderSidebar.js';

import {
  updateTitle,
  renderHabitProgress,
  updateHabitProgress,
  renderGoal,
  renderHabitDays,
} from '../render/renderMainContent.js';

import {
  addNewDayAction,
  updateDayIndexesAction,
} from '../actions/dayActions.js';

import { clearHabitId, showCompleteHabitMessage } from '../utils/uiUtils.js';

/**
 * Pipeline for initializing the sidebar.
 * Steps:
 * 1. Activate the first habit.
 * 2. Attach sidebar event listeners.
 *
 * @export
 * @type {Function[]}
 */
export const initSidebarPipeline = [activeFirstHabit, attachSidebarEvents];

/**
 * Pipeline for updating the sidebar when a habit is changed.
 * Steps:
 * 1. Activate the current habit by ID.
 * 2. Attach sidebar event listeners.
 *
 * @export
 * @type {Function[]}
 */
export const updateSidebarPipeline = [activeCurrentHabit, attachSidebarEvents];

/**
 * Pipeline for rendering the main content area.
 * Steps:
 * 1. Update the title.
 * 2. Render habit progress.
 * 3. Render goal.
 * 4. Render habit days.
 *
 * @export
 * @type {Function[]}
 */
export const renderMainContentPipeline = [
  updateTitle,
  renderHabitProgress,
  renderGoal,
  renderHabitDays,
];

/**
 * Pipeline for creating a new habit.
 * Steps:
 * 1. Add new habit to data store.
 * 2. Clear the habit form.
 * 3. Re-render the sidebar with initialization pipeline.
 *
 * @export
 * @type {Function[]}
 */
export const createNewHabitPipeline = [
  newHabit => addNewHabitAction(newHabit),
  () => clearForm(habitForm),
  () => renderSidebar(habits, initSidebarPipeline),
];

/**
 * Pipeline for editing an existing habit.
 * Steps:
 * 1. Update habit data.
 * 2. Clear the habit form.
 * 3. Add a new day to the habit if needed.
 * 4. Re-render the sidebar with update pipeline.
 *
 * @export
 * @type {Function[]}
 */
export const editHabitPipeline = [
  (habitId, habitChanges) => updateHabitAction(habitId, habitChanges),
  () => clearForm(habitForm),
  habitId => {
    const habit = getHabitById(habitId);
    addNewDayAction(habit);
  },
  habitId => renderSidebar(habits, updateSidebarPipeline, habitId),
];

/**
 * Pipeline for deleting a habit.
 * Steps:
 * 1. Delete habit from data store.
 * 2. Clear the current habit identifier from the DOM (#habit-content).
 * 3. Re-render the sidebar with initialization pipeline.
 *
 * @export
 * @type {Function[]}
 */
export const deleteHabitPipeline = [
  habitId => deleteHabitAction(habitId),
  () => clearHabitId(),
  () => renderSidebar(habits, initSidebarPipeline),
];

/**
 * Pipeline for adding a new day to a habit.
 * Steps:
 * 1. Add new day.
 * 2. Update habit progress.
 * 3. Render habit days.
 * 4. Show completion message if goal achieved.
 *
 * @export
 * @type {Function[]}
 */
export const addNewDayPipeline = [
  addNewDayAction,
  updateHabitProgress,
  renderHabitDays,
  showCompleteHabitMessage,
];

/**
 * Pipeline for deleting a day from a habit.
 * Steps:
 * 1. Add new day (to maintain structure).
 * 2. Update day indexes.
 * 3. Update habit progress.
 * 4. Render habit days.
 *
 * @export
 * @type {Function[]}
 */
export const deleteDayPipeline = [
  addNewDayAction,
  updateDayIndexesAction,
  updateHabitProgress,
  renderHabitDays,
];
