import { expect, describe, it, vi } from 'vitest';
import { DropdownToggle } from '../../lib/DropdownToggle';
import { setupTest, delay } from '../test-utils';

setupTest();

describe('Group Mode Behaviors', () => {

  describe('multiple mode (default)', () => {
    it('should allow multiple dropdowns in a group to be open simultaneously', async () => {
      // Arrange
      const firstDropdown = document.querySelector('[data-js-dropdown][aria-controls="accordion1"]');
      const firstContent = document.querySelector('#accordion1');
      const firstInstance = new DropdownToggle(firstDropdown, {
        openDuration: 0.2,
        closeDuration: 0.2,
        group: 'test-group'  // No groupMode specified = default mode
      });

      const secondDropdown = document.querySelector('[data-js-dropdown][aria-controls="accordion2"]');
      const secondContent = document.querySelector('#accordion2');
      const secondInstance = new DropdownToggle(secondDropdown, {
        openDuration: 0.2,
        closeDuration: 0.2,
        group: 'test-group'  // No groupMode specified = default mode
      });

      // Act - Open both dropdowns
      await firstInstance.toggle();
      await secondInstance.toggle();

      // Assert - Both dropdowns should be open
      expect(firstContent.style.height).toBe('auto');
      expect(firstContent.style.display).toBe('block');
      expect(firstContent.getAttribute('aria-hidden')).toBe('false');

      expect(secondContent.style.height).toBe('auto');
      expect(secondContent.style.display).toBe('block');
      expect(secondContent.getAttribute('aria-hidden')).toBe('false');
    });
  });

  describe('"single" mode', () => {
    it('Previous dropdown should be closed when new dropdown is opened', async () => {
      // Arrange
      const firstDropdown = document.querySelector('[data-js-dropdown][aria-controls="accordion1"]');
      const firstContent = document.querySelector('#accordion1');
      const firstInstance = new DropdownToggle(firstDropdown, {
        openDuration: 0.2,
        closeDuration: 0.2,
        group: 'test-group',
        groupMode: 'single'
      });

      const secondDropdown = document.querySelector('[data-js-dropdown][aria-controls="accordion2"]');
      const secondContent = document.querySelector('#accordion2');
      const secondInstance = new DropdownToggle(secondDropdown, {
        openDuration: 0.2,
        closeDuration: 0.2,
        group: 'test-group',
        groupMode: 'single'
      });

      // Act - Open two dropdowns - first should end up closed
      await firstInstance.toggle();
      secondInstance.toggle();

      // Assert - Check state during animations
      await delay(50);  // Give time for second animation to start

      // First dropdown should be closing (height decreasing)
      expect(firstContent.style.height).not.toBe('auto');
      expect(firstContent.style.display).toBe('block');
      // Second dropdown should be opening (height increasing)
      expect(secondContent.style.height).not.toBe('0px');
      expect(secondContent.style.display).toBe('block');
    });
  });

  describe('"single-await" mode', () => {
    it('should wait for previous dropdown to fully close before opening new dropdown', async () => {
      // Arrange
      const firstDropdown = document.querySelector('[data-js-dropdown][aria-controls="accordion1"]');
      const firstContent = document.querySelector('#accordion1');
      const firstInstance = new DropdownToggle(firstDropdown, {
        openDuration: 0.2,
        closeDuration: 0.2,
        group: 'test-group',
        groupMode: 'single-await'
      });

      const secondDropdown = document.querySelector('[data-js-dropdown][aria-controls="accordion2"]');
      const secondContent = document.querySelector('#accordion2');
      const secondInstance = new DropdownToggle(secondDropdown, {
        openDuration: 0.2,
        closeDuration: 0.2,
        group: 'test-group',
        groupMode: 'single-await'
      });

      // Open first dropdown
      await firstInstance.toggle();

      // Act - Click second dropdown
      secondInstance.toggle();

      // Assert - Delay that is short enough to ensure the first dropdown is closing
      await delay(50);

      // First dropdown should be closing
      expect(firstContent.style.height).not.toBe('auto');
      expect(firstContent.getAttribute('aria-hidden')).toBe('true');

      // Second dropdown should still be closed
      expect(secondContent.style.height).toBe('0px');
      expect(secondContent.style.display).toBe('none');

      // Wait for full animation
      await delay(250);

      // Now second dropdown should be open
      expect(secondContent.style.height).toBe('auto');
      expect(secondContent.style.display).toBe('block');
      expect(secondContent.getAttribute('aria-hidden')).toBe('false');
    });
  });

});
