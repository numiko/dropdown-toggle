import { DropdownToggle } from '../lib/DropdownToggle';

/**
 * This file is used to run the package locally for development and testing purposes.
 */
const dropdownsGroupDefault = document.querySelectorAll('[data-js-group-default] [data-js-dropdown]');
const dropdownsGroupAccordion = document.querySelectorAll('[data-js-group-accordion] [data-js-dropdown]');
const dropdownsGroupAccordionAwait = document.querySelectorAll('[data-js-group-accordion-await] [data-js-dropdown]');

dropdownsGroupDefault.forEach(dropdown => {
  new DropdownToggle(dropdown, {
    group: 'group-default',
  });
});

dropdownsGroupAccordion.forEach(dropdown => {
  new DropdownToggle(dropdown, {
    group: 'group-accordion',
    groupMode: 'accordion'
  });
});

dropdownsGroupAccordionAwait.forEach(dropdown => {
  new DropdownToggle(dropdown, {
    group: 'group-accordion-await',
    groupMode: 'accordion-await'
  });
});

/**
 * Toggle all dropdowns
 */
document.querySelector('[data-js-dropdown-toggle-default]').addEventListener('click', (e) => {

  let isPressed = e.currentTarget.getAttribute('aria-pressed') === 'true';

  if (!isPressed) {
    DropdownToggle.openAllInGroup('group-default');
  } else {
    DropdownToggle.closeAllInGroup('group-default');
  }
  updateToggleButton(e.currentTarget, !isPressed);
});


document.querySelector('[data-js-dropdown-toggle-accordion]').addEventListener('click', (e) => {
  let isPressed = e.currentTarget.getAttribute('aria-pressed') === 'true';
  if (!isPressed) {
    DropdownToggle.openAllInGroup('group-accordion');
  } else {
    DropdownToggle.closeAllInGroup('group-accordion');
  }

  updateToggleButton(e.currentTarget, !isPressed);
});

document.querySelector('[data-js-dropdown-toggle-accordion-await]').addEventListener('click', (e) => {
  let isPressed = e.currentTarget.getAttribute('aria-pressed') === 'true';
  if (!isPressed) {
    DropdownToggle.openAllInGroup('group-accordion-await');
  } else {
    DropdownToggle.closeAllInGroup('group-accordion-await');
  }

  updateToggleButton(e.currentTarget, !isPressed);
});

const updateToggleButton = (button, isPressed) => {
  button.setAttribute('aria-pressed', isPressed);
  button.innerHTML = `${isPressed ? 'Hide' : 'Show'} All`;
};
