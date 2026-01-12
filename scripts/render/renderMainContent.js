'use strict';

import { clearHabitFeedback } from '../utils/uiUtils.js';
import { logger } from '../utils/logger.js';

const habitContent = document.getElementById('habit-content');
const habitTitle = document.getElementById('habit-title');
const editOpenBtn = document.getElementById('dialog-edit-btn-open');
const deleteBtn = document.getElementById('delete-habit-btn');
const progressWrapper = document.querySelector('.progress');
const progressPercent = document.getElementById('progress-percent');
const progressBar = document.getElementById('progress-bar');
const habitGoalOut = document.getElementById('habit-goal-out');
const habitDays = document.getElementById('habit-days');

/**
 * Renders the main content area for a habit by executing a pipeline of rendering functions.
 *
 * @export
 * @param {Habit} habit - Habit object to render.
 * @param {Function[]} pipeline - Array of rendering functions to execute.
 * @returns {void}
 */
export function renderMainContent(habit, pipeline) {
  pipeline.forEach(fn => fn(habit));
}

/**
 * Updates the title section with the current habit name and shows edit/delete buttons.
 *
 * @export
 * @param {Habit} habit - Habit object containing id and name.
 * @returns {void}
 */
export function updateTitle(habit) {
  habitContent.setAttribute('data-habit-id', habit.id);

  habitTitle.innerText = '';
  habitTitle.innerText = habit.name[0].toUpperCase() + habit.name.slice(1);

  editOpenBtn.classList.remove('visually-hidden');
  deleteBtn.classList.remove('visually-hidden');
}

// Render Progress
const renderHabitProgressPipeline = [showHabitProgress, updateHabitProgress];

/**
 * Renders the habit progress section by executing a pipeline of progress functions.
 *
 * @export
 * @param {Habit} habit - Habit object containing days and goalDays.
 * @param {Function[]} [pipeline=renderHabitProgressPipeline] - Progress rendering functions.
 * @returns {void}
 */
export function renderHabitProgress(
  habit,
  pipeline = renderHabitProgressPipeline
) {
  pipeline.forEach(fn => fn(habit));
}

/**
 * Shows the progress bar wrapper.
 *
 * @returns {void}
 */
function showHabitProgress() {
  progressWrapper.classList.remove('visually-hidden');
}

/**
 * Updates the progress bar and percentage text based on habit completion.
 *
 * @export
 * @param {Habit} habit - Habit object containing days and goalDays.
 * @returns {void}
 */
export function updateHabitProgress(habit) {
  const progress = calcHabitProgress(habit);

  progressPercent.innerText = `${progress}%`;
  progressBar.style.width = `${progress}%`;
}

/**
 * Calculates habit progress percentage.
 *
 * @param {Habit} habit - Habit object containing days and goalDays.
 * @returns {number} - Progress percentage (0–100).
 */
function calcHabitProgress(habit) {
  const doneDays = habit.days.filter(day => day.done === true).length;
  const goalDays = habit.goalDays;

  return Math.round((doneDays / goalDays) * 100);
}

/**
 * Renders the habit goal text.
 *
 * @export
 * @param {Habit} habit - Habit object containing goalDays.
 * @returns {void}
 */
export function renderGoal(habit) {
  habitGoalOut.innerText = '';
  const goal = habit.goalDays;
  habitGoalOut.innerText = `Goal: ${goal} days`;
}

/**
 * Renders all habit days (done and not done).
 * Clears feedback and appends appropriate day elements.
 *
 * @export
 * @param {Habit} habit - Habit object containing days.
 * @returns {void}
 */
export function renderHabitDays(habit) {
  habitDays.innerHTML = '';
  clearHabitFeedback();

  const days = habit.days;
  const numberOfDays = days.length;

  for (let i = 0; i < numberOfDays; i++) {
    const day = days[i];

    if (day.done === false) {
      habitDays.append(renderNewDayForm(habit, day));
    } else if (day.done === true) {
      habitDays.append(renderDoneDay(day));
    } else {
      logger.error('Invalid day.done value', { value: day.done, day });
    }
  }
}

/**
 * Renders a completed day element.
 *
 * @param {Day} day - Day object with index, comment, and done=true.
 * @returns {HTMLLIElement} - List item element representing a completed day.
 */
function renderDoneDay(day) {
  const dayContainer = document.createElement('li');
  dayContainer.className = 'habit__day-done habit__day';
  dayContainer.setAttribute('data-day-index', day.index);

  const dayIndex = document.createElement('div');
  dayIndex.className = 'day__index';
  dayIndex.innerText = `Day ${day.index}`;

  const dayComment = document.createElement('div');
  dayComment.className = 'day__comment';
  dayComment.innerText = day.comment;

  const dayDelBtn = document.createElement('button');
  dayDelBtn.className = 'day__del-btn btn__icon';
  dayDelBtn.type = 'button';
  dayDelBtn.name = 'del-day-btn';

  const delIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  delIcon.classList.add('icon', 'icon__secondary-stroke');

  const useDelIcon = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'use'
  );
  useDelIcon.setAttributeNS(
    'http://www.w3.org/1999/xlink',
    'href',
    '#icon-delete'
  );
  delIcon.append(useDelIcon);
  dayDelBtn.append(delIcon);

  dayContainer.append(dayIndex);
  dayContainer.append(dayComment);
  dayContainer.append(dayDelBtn);

  return dayContainer;
}

/**
 * Renders a new day form element for adding comments and marking as done.
 *
 * @param {Habit} habit - Habit object containing days.
 * @param {Day} day - Day object with index, comment, and done=false.
 * @returns {HTMLLIElement} - List item element containing the new day form.
 */
function renderNewDayForm(habit, day) {
  const newDayContainer = document.createElement('li');
  newDayContainer.className = 'habit__day-new habit__day';
  newDayContainer.setAttribute('data-day-index', day.index);

  const dayIndex = document.createElement('div');
  dayIndex.className = 'day__index';
  dayIndex.innerText = `Day ${day.index}`;

  const newDayForm = document.createElement('form');
  newDayForm.className = 'day__form';
  newDayForm.action = '#';
  newDayForm.name = 'day-form';
  newDayForm.setAttribute('autocomplete', 'off');

  const commentIcon = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'svg'
  );
  commentIcon.classList.add('comment__icon', 'icon__secondary-fill');

  const useCommentIcon = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'use'
  );
  useCommentIcon.setAttributeNS(
    'http://www.w3.org/1999/xlink',
    'href',
    '#icon-comment'
  );
  commentIcon.append(useCommentIcon);

  const input = document.createElement('input');
  input.className = 'day__input input';
  input.type = 'text';
  input.id = `day${day.index}-comment`;
  input.name = 'day__comment';
  input.max = 200;
  input.placeholder = 'Comment';

  const label = document.createElement('label');
  label.className = 'visually-hidden';
  label.setAttribute('for', `day${day.index}-comment`);

  const dayDoneBtn = document.createElement('button');
  dayDoneBtn.className = 'day__done-btn btn__text';
  dayDoneBtn.type = 'submit';
  dayDoneBtn.innerText = 'Done';

  newDayForm.append(commentIcon);
  newDayForm.append(input);
  newDayForm.append(label);
  newDayForm.append(dayDoneBtn);

  newDayContainer.append(dayIndex);
  newDayContainer.append(newDayForm);

  return newDayContainer;
}

/**
 * Clears the main content area.
 * Resets title, hides buttons and progress, clears habit goal output,
 * and empties the habit days list.
 *
 * @export
 * @returns {void}
 */
export function clearMainContent() {
  habitTitle.innerText = 'Create Your Habits';
  editOpenBtn.classList.add('visually-hidden');
  deleteBtn.classList.add('visually-hidden');
  progressWrapper.classList.add('visually-hidden');
  habitGoalOut.innerText = '';
  habitDays.innerHTML = '';
}
