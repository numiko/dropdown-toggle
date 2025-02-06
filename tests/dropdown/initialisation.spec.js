import { expect, describe, it } from 'vitest';
import { DropdownToggle } from '../../lib/DropdownToggle';
import { setupTest } from '../test-utils';

setupTest();

describe('Initialisations', () => {

  it('should use the default open duration if no duration is passed in', () => {
    const dropdown = new DropdownToggle('[data-js-dropdown]');
    expect(dropdown.openOptions.duration).toBe(DropdownToggle.DURATION_DEFAULT);
  });

  it('should use the default close duration if no duration is passed in', () => {
    const dropdown = new DropdownToggle('[data-js-dropdown]');
    expect(dropdown.closeOptions.duration).toBe(DropdownToggle.DURATION_DEFAULT);
  });

  it('should use the custom global default duration if provided', () => {
    DropdownToggle.DURATION_DEFAULT = 0.2;
    const dropdown = new DropdownToggle('[data-js-dropdown]');
    expect(dropdown.openOptions.duration).toBe(0.2);
  });

  it('should use the custom global default ease if provided', () => {
    DropdownToggle.EASE_DEFAULT = 'power1.easeInOut';
    const dropdown = new DropdownToggle('[data-js-dropdown]');
    expect(dropdown.openOptions.ease).toBe('power1.easeInOut');
  });

  it('should set the button element properly if a string is passed in', () => {
    const dropdownElement = document.querySelector('[data-js-dropdown]');
    const dropdown = new DropdownToggle('[data-js-dropdown]');

    expect(dropdown.button).toBe(dropdownElement);
  });

  it('should set the button element properly if an element is passed in', () => {
    const dropdownElement = document.querySelector('[data-js-dropdown]');
    const dropdown = new DropdownToggle(dropdownElement);

    expect(dropdown.button).toBe(dropdownElement);
  });

  it('should have correct attributes when created', async () => {
    // Arrange
    const dropdownEl = document.querySelector('[data-js-dropdown]');
    new DropdownToggle(dropdownEl);
    const dropdownContent = document.querySelector(`#${dropdownEl.getAttribute('aria-controls')}`);
    // No action

    // Assert
    expect(dropdownEl.getAttribute('aria-expanded')).toBe('false');
    expect(dropdownContent.getAttribute('aria-hidden')).toBe('true');
  });

});
