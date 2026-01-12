'use strict';
/**
 * Entry point of the Habit App.
 * Initializes the sidebar, sets up UI components, and attaches global event listeners.
 *
 * @module app
 */

import { habits } from './data/habits.js';
import { initSidebarPipeline } from './pipelines/pipelines.js';
import './ui/habitDialog.js';
import './ui/habitForm.js';
import { renderSidebar } from './render/renderSidebar.js';
import { deleteHabitHandler } from './handlers/habitHandlers.js';

import {
  handleDoneDayFormSubmit,
  deleteDayHandler,
} from './handlers/dayHandlers.js';

import { logger } from './utils/logger.js';

logger.info('Habit App initialized');

/**
 * Render the sidebar with initial habits and pipeline.
 */
renderSidebar(habits, initSidebarPipeline);

/**
 * Global click listener for deleting a habit.
 * @param {MouseEvent} event - Click event on delete habit button.
 */
document.addEventListener('click', event => {
  const delHabitBtn = event.target.closest('#delete-habit-btn');

  if (delHabitBtn) {
    event.preventDefault();
    deleteHabitHandler(event);
    logger.debug('Habits after deleting', habits);
  }
});

/**
 * Global submit listener for marking a day as done.
 * @param {SubmitEvent} event - Submit event from day form.
 */
document.addEventListener('submit', event => {
  if (event.target.name === 'day-form') {
    event.preventDefault();
    handleDoneDayFormSubmit(event);
    logger.debug('Habits after adding doneDay', habits);
  }
});

/**
 * Global click listener for deleting a day entry.
 * @param {MouseEvent} event - Click event on delete day button.
 */
document.addEventListener('click', event => {
  const deleteDayBtn = event.target.closest('[name="del-day-btn"]');

  if (deleteDayBtn) {
    event.preventDefault();
    deleteDayHandler(event, deleteDayBtn);
    logger.debug('Habits after deleting day', habits);
  }
});
