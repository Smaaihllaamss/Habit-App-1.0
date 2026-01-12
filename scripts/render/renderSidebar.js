'use strict';

import { getHabitById } from '../data/habits.js';
import { renderMainContentPipeline } from '../pipelines/pipelines.js';
import { renderMainContent, clearMainContent } from './renderMainContent.js';
import { logger } from '../utils/logger.js';

/**
 * @typedef {import('./types.d.js').Habit} Habit
 */

const habitsList = document.getElementById('habits-list');
let menuBtns = [];

/**
 * Renders the sidebar with habit menu buttons.
 * Clears existing list, prepends new buttons for each habit,
 * and executes pipeline functions for sidebar initialization.
 *
 * @export
 * @param {Habit[]} habits - Array of habit objects with their associated days.
 * @param {Function[]} pipeline - Array of pipeline functions to run after rendering.
 * @param {string|null} [habitId=null] - Optional habit ID to set as active.
 * @returns {void}
 */
export function renderSidebar(habits, pipeline, habitId = null) {
  habitsList.innerHTML = '';
  habits.forEach(item => habitsList.prepend(renderMenuBtn(item)));

  menuBtns = habitsList.querySelectorAll('.menu-btn');

  pipeline.forEach(fn => fn(menuBtns, habitId));
}

/**
 * Internal helper to render a single habit menu button.
 *
 * @param {Habit} habit - Habit object with ID and icon.
 * @returns {HTMLLIElement} liItem - List item containing the habit button.
 */
function renderMenuBtn(habit) {
  const liItem = document.createElement('li');
  liItem.className = 'menu__list-item';

  const btnItem = document.createElement('button');
  btnItem.className = 'btn__icon btn__icon--border menu-btn';
  btnItem.type = 'button';
  btnItem.id = habit.id;

  let iconElement;
  iconElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  iconElement.classList.add('icon__accent', 'icon');

  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', `#${habit.icon}`);

  iconElement.append(use);
  btnItem.append(iconElement);
  liItem.append(btnItem);

  return liItem;
}

/**
 * Activates the first habit in the sidebar.
 * If habits exist, marks the first as active and renders its content.
 * Otherwise clears the main content.
 *
 * @export
 * @param {NodeListOf<HTMLButtonElement>} menuBtns - Collection of sidebar buttons.
 * @returns {void}
 */
export function activeFirstHabit(menuBtns) {
  if (menuBtns.length > 0) {
    menuBtns[0].classList.add('active');
    const firstHabitId = menuBtns[0].id;
    const firstHabit = getHabitById(firstHabitId);

    renderMainContent(firstHabit, renderMainContentPipeline);
  } else {
    clearMainContent();
  }
}

/**
 * Activates the current habit in the sidebar by ID.
 * Removes active class from all buttons, sets active on the matching one,
 * and renders its content. Clears main content if habit not found.
 *
 * @export
 * @param {NodeListOf<HTMLButtonElement>} menuBtns - Collection of sidebar buttons.
 * @param {string} habitId - ID of the habit to activate.
 * @returns {void}
 */
export function activeCurrentHabit(menuBtns, habitId) {
  if (menuBtns) {
    for (let i = 0; i < menuBtns.length; i++) {
      const item = menuBtns[i];
      item.classList.remove('active');
      if (item.id === habitId) {
        item.classList.add('active');
      }
    }

    const currentHabit = getHabitById(habitId);
    if (currentHabit) {
      renderMainContent(currentHabit, renderMainContentPipeline);
    } else {
      clearMainContent();
    }
  } else {
    clearMainContent();
  }
}

/**
 * Attaches click event listeners to sidebar buttons.
 * On click, sets the clicked habit as active, logs activation,
 * and renders its main content.
 *
 * @export
 * @param {NodeListOf<HTMLButtonElement>} menuBtns - Collection of sidebar buttons.
 * @returns {void}
 */
export function attachSidebarEvents(menuBtns) {
  for (let item of menuBtns) {
    item.addEventListener('click', () => {
      menuBtns.forEach(button => button.classList.remove('active'));
      item.classList.add('active');

      const habitId = item.id;
      const habit = getHabitById(habitId);

      logger.debug(
        `The habit "${
          habit.name[0].toUpperCase() + habit.name.slice(1)
        }" is activated`
      );

      renderMainContent(habit, renderMainContentPipeline);
    });
  }
}
