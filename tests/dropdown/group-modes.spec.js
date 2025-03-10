import { expect, describe, it, vi } from 'vitest';
import { DropdownToggle } from '../../lib/DropdownToggle';
import { setupTest, delay } from '../test-utils';

setupTest();

describe('Group Mode Behaviors', () => {

  describe('multiple mode (default)', () => {
    it('should allow multiple dropdowns in a group to be open simultaneously', async () => {
      // Arrange
      const firstDropdown = document.querySelector('[data-js-dropdown][aria-controls="accordion1"]');
      const firstInstance = new DropdownToggle(firstDropdown, {
        openDuration: 0.2,
        closeDuration: 0.2,
        group: 'test-group'  // No groupMode specified = default multiple mode
      });

      const secondDropdown = document.querySelector('[data-js-dropdown][aria-controls="accordion2"]');
      const secondInstance = new DropdownToggle(secondDropdown, {
        openDuration: 0.2,
        closeDuration: 0.2,
        group: 'test-group'  // No groupMode specified = default multiple mode
      });

      // Act - Open first dropdown
      await firstInstance.open();
      expect(firstInstance.isOpen()).toBe(true);
      expect(secondInstance.isOpen()).toBe(false);

      // Open second dropdown
      await secondInstance.open();

      // Assert - Both dropdowns should remain open
      expect(firstInstance.isOpen()).toBe(true);
      expect(secondInstance.isOpen()).toBe(true);

      // Additional verification - closing one shouldn't affect the other
      await firstInstance.close();
      expect(firstInstance.isOpen()).toBe(false);
      expect(secondInstance.isOpen()).toBe(true);
    });
  });

  describe('"single" mode', () => {
    it('Previous dropdown should be closed when new dropdown is opened', async () => {
      // Arrange
      const firstDropdown = document.querySelector('[data-js-dropdown][aria-controls="accordion1"]');
      const firstInstance = new DropdownToggle(firstDropdown, {
        openDuration: 0.2,
        closeDuration: 0.2,
        group: 'test-group',
        groupMode: 'single'
      });

      const secondDropdown = document.querySelector('[data-js-dropdown][aria-controls="accordion2"]');
      const secondInstance = new DropdownToggle(secondDropdown, {
        openDuration: 0.2,
        closeDuration: 0.2,
        group: 'test-group',
        groupMode: 'single'
      });

      // Ensure first dropdown is open
      await firstInstance.open();
      expect(firstInstance.isOpen()).toBe(true);
      expect(secondInstance.isOpen()).toBe(false);

      // Start opening second dropdown
      const openPromise = secondInstance.open();

      // After a short delay, both animations should be in progress
      await delay(50);
      expect(firstInstance.isOpen()).toBe(false);  // First is closing
      expect(secondInstance.isOpen()).toBe(true);  // Second is already opening

      // Wait for everything to complete
      await openPromise;

      // Assert final state
      expect(firstInstance.isOpen()).toBe(false);
      expect(secondInstance.isOpen()).toBe(true);
    });
  });

  describe('"single-await" mode', () => {
    it('should wait for previous dropdown to fully close before opening new dropdown', async () => {
      // Arrange
      const firstDropdown = document.querySelector('[data-js-dropdown][aria-controls="accordion1"]');
      const firstInstance = new DropdownToggle(firstDropdown, {
        openDuration: 0.2,
        closeDuration: 0.2,
        group: 'test-group',
        groupMode: 'single-await'
      });

      const secondDropdown = document.querySelector('[data-js-dropdown][aria-controls="accordion2"]');
      const secondInstance = new DropdownToggle(secondDropdown, {
        openDuration: 0.2,
        closeDuration: 0.2,
        group: 'test-group',
        groupMode: 'single-await'
      });

      // Act - open first dropdown (even though this is already open due to aria-expanded="true" in the DOM)
      // Happy-dom doesn't see it as open, so we need to wait for the animation to complete
      await firstInstance.open();

      // Assert initial state
      expect(firstInstance.isOpen()).toBe(true);
      expect(secondInstance.isOpen()).toBe(false);

      // Start opening second dropdown
      const openPromise = secondInstance.open();

      // After a short delay (less than animation duration), first should be closing but second should still be closed
      await delay(50);
      expect(firstInstance.isOpen()).toBe(false);
      expect(secondInstance.isOpen()).toBe(false);

      // Wait for everything to complete
      await openPromise;

      // Assert final state
      expect(firstInstance.isOpen()).toBe(false);
      expect(secondInstance.isOpen()).toBe(true);
    });
  });

});
