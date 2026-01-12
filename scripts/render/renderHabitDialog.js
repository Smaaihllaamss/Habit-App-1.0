'use strict';

import {
  habitForm,
  iconContainer,
  habitNameInput,
  habitGoalInput,
  habitSubmitBtn,
} from '../ui/habitForm.js';

/**
 * @typedef {import('./types.d.js').Habit} Habit
 */

const title = document.getElementById('dialog-title');

/**
 * Renders the habit dialog in either "create" or "edit" mode.
 *
 * @export
 * @param {'create'|'edit'} mode - Mode of the dialog ("create" for new habit, "edit" for existing habit).
 * @param {Habit|null} [habit=null] - Habit object to edit (required in "edit" mode).
 * @returns {void}
 */
export function renderHabitDialog(mode, habit = null) {
  if (mode === 'create') {
    renderCreateDialog();
  } else if (mode === 'edit' && habit) {
    renderEditDialog(habit);
  }
}

/**
 * Configures the dialog for creating a new habit.
 *
 * @returns {void}
 */
function renderCreateDialog() {
  title.innerText = 'New Habit';
  habitForm.id = 'create-habit-form';
  habitSubmitBtn.innerText = 'Add Habit';
}

/**
 * Configures the dialog for editing an existing habit.
 * Populates form fields with habit data and sets the correct icon.
 *
 * @param {Habit} habit - Habit object to edit.
 * @returns {void}
 */
function renderEditDialog(habit) {
  title.innerText = 'Edit Habit';
  habitForm.id = 'edit-habit-form';

  checkHabitIcon(habit);

  habitNameInput.value =
    habit.name[0].toUpperCase() + habit.name.slice(1).toLowerCase();
  habitGoalInput.value = habit.goalDays;
  habitSubmitBtn.innerText = 'Edit Habit';
}

/**
 * Checks and marks the correct icon as selected in the dialog based on habit data.
 *
 * @param {Habit} habit - Habit object containing icon property.
 * @param {string} habit.icon - Icon identifier of the habit.
 * @returns {void}
 */
function checkHabitIcon(habit) {
  const iconHref = `#${habit.icon}`;
  const iconLabels = iconContainer.querySelectorAll('.input-radio__label');

  for (let i = 0; i < iconLabels.length; i++) {
    const label = iconLabels[i];
    const inputRadioIcon = label.querySelector('input');
    const useRadioIcon = label.querySelector('use');
    const useHrefRadioIcon = useRadioIcon?.getAttribute('href') ?? '';

    if (useHrefRadioIcon == iconHref) {
      inputRadioIcon.checked = true;
      label.classList.add('is-checked');
    } else {
      inputRadioIcon.checked = false;
      label.classList.remove('is-checked');
    }
  }
}
