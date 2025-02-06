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

groups.forEach(group => {
  // Initialize dropdowns for this group
  document.querySelectorAll(`[data-js-group-${group}] [data-js-dropdown]`).forEach(dropdown => {
    new DropdownToggle(dropdown, {
      group,
      groupMode: group
    });
  });

  // Initialize toggle button for this group
  const toggleButton = document.querySelector(`[data-js-dropdown-toggle-${group}]`);
  if (toggleButton) {
    toggleButton.addEventListener('click', () => {
      const isAllOpen = DropdownToggle.isGroupAllOpen(group);
      if (!isAllOpen) {
        DropdownToggle.openAllInGroup(group);
      } else {
        DropdownToggle.closeAllInGroup(group);
      }
    });
  }
});

// Single event listener for all group changes
window.addEventListener('DropdownToggle:group-change', (e) => {
  const toggleButton = document.querySelector(`[data-js-dropdown-toggle-${e.detail.group}]`);
  if (toggleButton) {
    toggleButton.setAttribute('aria-pressed', e.detail.isAllOpen);
    toggleButton.innerHTML = `${e.detail.isAllOpen ? 'Hide' : 'Show'} All`;
  }
});
