'use strict';
// Open/close dialog "New/Edit habit"

import { icons } from '../resources/icons.js';
import { addIcons } from '../render/renderIcons.js';
import { getHabitById } from '../data/habits.js';
import { habitForm, initIconListeners, clearForm } from './habitForm.js';
import { renderHabitDialog } from '../render/renderHabitDialog.js';
import { getCurrentHabitId } from '../utils/uiUtils.js';
import { logger } from '../utils/logger.js';

/**
 * @typedef {import('./types.d.js').Habit} Habit
 */

const dialog = document.getElementById('habit-dialog');
const createHabitBtnOpen = document.getElementById('dialog-create-btn-open');
const editHabitBtnOpen = document.getElementById('dialog-edit-btn-open');
const dialogBtnClose = document.getElementById('dialog-btn-close');

/**
 * Toggles the habit dialog open/close state by adding/removing the "is-open" class.
 *
 * @export
 * @returns {void}
 */
export const toggleDialog = () => dialog.classList.toggle('is-open');

// Event listener: open dialog in "create" mode
createHabitBtnOpen.addEventListener('click', function () {
  openHabitDialog('create');
});

// Event listener: open dialog in "edit" mode with current habit data
editHabitBtnOpen.addEventListener('click', function () {
  const habitId = getCurrentHabitId();
  const habit = getHabitById(habitId);

  openHabitDialog('edit', habit);
});

// Event listener: close dialog and clear form after 300 ms
dialogBtnClose.addEventListener('click', function () {
  toggleDialog();
  logger.info('Habit dialog closed');

  setTimeout(() => {
    clearForm(habitForm);
  }, 300);
});

/**
 * Opens the habit dialog in either "create" or "edit" mode.
 * Renders the dialog content depending on the mode.
 *
 * @param {'create'|'edit'} mode - Mode of the dialog ("create" or "edit").
 * @param {Habit|null} [habit=null] - Habit object to edit, required in "edit" mode.
 * @returns {void}
 */
function openHabitDialog(mode, habit = null) {
  setupHabitDialog();

  if (mode === 'create') {
    renderHabitDialog('create');
    logger.info('Habit dialog opened', { mode });
  } else if (mode === 'edit') {
    renderHabitDialog('edit', habit);
    logger.info('Habit dialog opened', { mode });
  }
}

/**
 * Sets up the habit dialog before opening:
 * - Toggles dialog visibility
 * - Renders available icons
 * - Initializes icon listeners
 *
 * @returns {void}
 */
function setupHabitDialog() {
  toggleDialog();
  addIcons(icons);
  initIconListeners();
}
