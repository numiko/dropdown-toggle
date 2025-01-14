import { DropdownToggle } from '../lib/DropdownToggle';

/**
 * This file is used to run the package locally for development and testing purposes.
 */
const dropdownsGroupA = document.querySelectorAll('[data-js-group-a] [data-js-dropdown]');
const dropdownsGroupB = document.querySelectorAll('[data-js-group-b] [data-js-dropdown]');

dropdownsGroupA.forEach(dropdown => {
  new DropdownToggle(dropdown, {
    group: 'group-a',
    groupExclusive: true
  });
});

dropdownsGroupB.forEach(dropdown => {
  new DropdownToggle(dropdown, {
    group: 'group-b'
  });
});

/**
 * Toggle all dropdowns in group A
 */
document.querySelector('[data-js-dropdown-toggle-a]').addEventListener('click', (e) => {

  let isPressed = e.currentTarget.getAttribute('aria-pressed') === 'true';

  if (!isPressed) {
    DropdownToggle.openAllInGroup('group-a');
  } else {
    DropdownToggle.closeAllInGroup('group-a');
  }
  updateToggleButton(e.currentTarget, !isPressed);
});

/**
 * Toggle all dropdowns in group B
 */
document.querySelector('[data-js-dropdown-toggle-b]').addEventListener('click', (e) => {
  let isPressed = e.currentTarget.getAttribute('aria-pressed') === 'true';
  if (!isPressed) {
    DropdownToggle.openAllInGroup('group-b');
  } else {
    DropdownToggle.closeAllInGroup('group-b');
  }

  updateToggleButton(e.currentTarget, !isPressed);
});

const updateToggleButton = (button, isPressed) => {
  button.setAttribute('aria-pressed', isPressed);
  button.innerHTML = `${isPressed ? 'Hide' : 'Show'} All`;
};
