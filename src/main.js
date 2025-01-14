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

document.querySelector('[data-js-dropdown-open-a]').addEventListener('click', () => {
  DropdownToggle.openAllInGroup('group-a');
});

document.querySelector('[data-js-dropdown-open-b]').addEventListener('click', () => {
  DropdownToggle.openAllInGroup('group-b');
});

document.querySelector('[data-js-dropdown-close-a]').addEventListener('click', () => {
  DropdownToggle.closeAllInGroup('group-a');
});

document.querySelector('[data-js-dropdown-close-b]').addEventListener('click', () => {
  DropdownToggle.closeAllInGroup('group-b');
});
