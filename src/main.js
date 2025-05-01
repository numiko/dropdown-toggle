import { DropdownToggle } from '../lib/DropdownToggle';
/**
 * This file demonstrates three different group behaviors for DropdownToggle:
 *
 * Default Group:
 * - Multiple dropdowns can be open simultaneously
 * - Opening/closing one doesn't affect others
 * - Show/Hide All button toggles all dropdowns in group
 *
 * Accordion Group:
 * - Only one dropdown can be open at a time
 * - Opening a dropdown immediately closes others
 * - Show/Hide All button toggles all dropdowns in group
 *
 * Accordion Await Group:
 * - Only one dropdown can be open at a time
 * - Opening a dropdown waits for others to finish closing (useful for mega menus)
 * - Show/Hide All button toggles all dropdowns in group
 *
 * Each group has:
 * - Toggle buttons with aria-pressed state
 * - Accessible accordion controls
 * - Smooth animations between states
 */

const groups = ['multiple', 'single', 'single-await'];
const instances = [];

/*
* Group Change Event
*/
const toggleButtons = document.querySelectorAll('[data-js-dropdown-toggle]');
toggleButtons.forEach(button => {
  // Store the group value
  const group = button.getAttribute('data-js-dropdown-toggle');

  // Add click handler
  button.addEventListener('click', () => {
    const isAllOpen = DropdownToggle.isGroupAllOpen(group);
    if (!isAllOpen) {
      DropdownToggle.openAllInGroup(group);
    } else {
      DropdownToggle.closeAllInGroup(group);
    }
  });

  // Add group change handler for this specific button
  window.addEventListener('DropdownToggle:group-change', (e) => {
    if (e.detail.group === group) {
      button.setAttribute('aria-pressed', e.detail.isAllOpen);
      button.innerHTML = `${e.detail.isAllOpen ? 'Hide' : 'Show'} All`;
    }
  });
});

/*
* Initialize Dropdown Toggles
*/
groups.forEach(group => {
  document.querySelectorAll(`[data-js-group-${group}] [data-js-dropdown]`).forEach(dropdown => {
    const instance = new DropdownToggle(dropdown, {
      group,
      groupMode: group,
    });
    instances.push(instance);
  });
});
