import { DropdownToggle } from '../lib/DropdownToggle';

/**
 * This file is used to run the package locally for development and testing purposes.
 */
const dropdownsGroupA = document.querySelectorAll('[data-js-group-a] [data-js-dropdown]');
const dropdownsGroupB = document.querySelectorAll('[data-js-group-b] [data-js-dropdown]');

dropdownsGroupA.forEach(dropdown => {
  new DropdownToggle(dropdown, {
    group: 'group-a'
  });
});

dropdownsGroupB.forEach(dropdown => {
  new DropdownToggle(dropdown, {
    group: 'group-b'
  });
});
