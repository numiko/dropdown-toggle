
import { expect, describe, it, vi } from 'vitest';
import { DropdownToggle } from '../../lib/DropdownToggle';
import { setupTest } from '../test-utils';

setupTest();

describe('Accessibility considerations', () => {
  it('should animate almost immediately if a user prefers reduced motion', () => {
  // We mock the matchMedia method so that it always returns true.
  // This allows us to simulate a user having 'prefers-reduced-motion' enabled
  // and as a result we can check the dropdown behaves appropriately.
    const matchMediaSpy = vi.spyOn(window, 'matchMedia');
    matchMediaSpy.mockImplementation(() => {
      return {
        matches: true,
      };
    });

    const dropdown = new DropdownToggle('[data-js-dropdown]');

    expect(dropdown.openOptions.duration).toBe(DropdownToggle.DURATION_REDUCED_MOTION);
  });
});
