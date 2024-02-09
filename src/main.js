import { DropdownToggle } from "../lib/DropdownToggle";

/**
 * This file is used to run the package locally for development and testing purposes.
 */
const dropdowns = document.querySelectorAll('[data-js-dropdown]');

dropdowns.forEach(dropdown => {
  new DropdownToggle(dropdown);
});
