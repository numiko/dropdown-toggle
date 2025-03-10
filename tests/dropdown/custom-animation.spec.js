import gsap from 'gsap';
import { expect, describe, it, vi } from 'vitest';
import { DropdownToggle } from '../../lib/DropdownToggle';
import { setupTest } from '../test-utils';

const fadeDownAccordionTween = (dropdownContent) => {
  return gsap.fromTo(
    dropdownContent,
    { autoAlpha: 0 },
    { autoAlpha: 1, duration: 0.1 }
  );
};

const fadeUpAccordionTween = (dropdownContent) => {
  return gsap.fromTo(
    dropdownContent,
    { autoAlpha: 1 },
    { autoAlpha: 0, duration: 0.1 }
  );
};

setupTest();

describe('Custom animations', () => {
  describe('Callbacks', () => {
    describe('On Open Start callback: onOpenStart', () => {
      it('should call onOpenStart callback if provided', async () => {
        // Arrange
        // vi.fn() is a utility function to create a spy function that we can track if its been called
        const onOpenStartCallback = vi.fn();
        const dropdownElement = document.querySelector('[data-js-dropdown]');
        const dropdown = new DropdownToggle(dropdownElement, {
          onOpenStart: onOpenStartCallback,
          openTween: fadeDownAccordionTween,
          closeTween: fadeUpAccordionTween,
        });

        // Act
        await dropdown.open();

        // Assert
        expect(onOpenStartCallback).toHaveBeenCalled();
      });
    });

    describe('On Open End callback: onOpenEnd', () => {
      it('should call onOpenEnd callback if provided', async () => {
        // Arrange
        const onOpenEndCallback = vi.fn();
        const dropdownElement = document.querySelector('[data-js-dropdown]');
        const dropdown = new DropdownToggle(dropdownElement, {
          onOpenEnd: onOpenEndCallback,
          openTween: fadeDownAccordionTween,
          closeTween: fadeUpAccordionTween,
        });

        // Act
        await dropdown.open();

        // Assert
        expect(onOpenEndCallback).toHaveBeenCalled();
      });

      it('should pass the dropdown content to onOpenEnd callback', async () => {
        // Arrange
        const onOpenEndCallback = vi.fn();
        const dropdownElement = document.querySelector('[data-js-dropdown]');
        const dropdownContent = document.querySelector(`#${dropdownElement.getAttribute('aria-controls')}`);
        const dropdown = new DropdownToggle(dropdownElement, {
          onOpenEnd: onOpenEndCallback,
          openTween: fadeDownAccordionTween,
          closeTween: fadeUpAccordionTween,
        });

        // Act
        await dropdown.open();

        // Assert
        expect(onOpenEndCallback).toHaveBeenCalledWith(dropdownContent);
      });
    });

    describe('On Close Start callback: onCloseStart', () => {
      it('should call onCloseStart callback if provided', async () => {
        // Arrange
        const onCloseStartCallback = vi.fn();
        const dropdownElement = document.querySelector('[data-js-dropdown]');
        const dropdown = new DropdownToggle(dropdownElement, {
          onCloseStart: onCloseStartCallback,
          openTween: fadeDownAccordionTween,
          closeTween: fadeUpAccordionTween,
        });
        await dropdown.open();

        // Act
        await dropdown.close();

        // Assert
        expect(onCloseStartCallback).toHaveBeenCalled();
      });

      it('should pass the dropdown content to onCloseStart callback', async () => {
        // Arrange
        const onCloseStartCallback = vi.fn();
        const dropdownElement = document.querySelector('[data-js-dropdown]');
        const dropdownContent = document.querySelector(`#${dropdownElement.getAttribute('aria-controls')}`);
        const dropdown = new DropdownToggle(dropdownElement, {
          onCloseStart: onCloseStartCallback,
          openTween: fadeDownAccordionTween,
          closeTween: fadeUpAccordionTween,
        });
        await dropdown.open();

        // Act
        await dropdown.close();

        // Assert
        expect(onCloseStartCallback).toHaveBeenCalledWith(dropdownContent);
      });
    });

    describe('On Close End callback: onCloseEnd', () => {
      it('should call onCloseEnd callback if provided', async () => {
        // Arrange
        const onCloseEndCallback = vi.fn();
        const dropdownElement = document.querySelector('[data-js-dropdown]');
        const dropdown = new DropdownToggle(dropdownElement, {
          onCloseEnd: onCloseEndCallback,
          openTween: fadeDownAccordionTween,
          closeTween: fadeUpAccordionTween,
        });
        await dropdown.open();

        // Act
        await dropdown.close();

        // Assert
        expect(onCloseEndCallback).toHaveBeenCalled();
      });

      it('should pass the dropdown content to onCloseEnd callback', async () => {
        // Arrange
        const onCloseEndCallback = vi.fn();
        const dropdownElement = document.querySelector('[data-js-dropdown]');
        const dropdownContent = document.querySelector(`#${dropdownElement.getAttribute('aria-controls')}`);
        const dropdown = new DropdownToggle(dropdownElement, {
          onCloseEnd: onCloseEndCallback,
          openTween: fadeDownAccordionTween,
          closeTween: fadeUpAccordionTween,
        });
        await dropdown.open();

        // Act
        await dropdown.close();

        // Assert
        expect(onCloseEndCallback).toHaveBeenCalledWith(dropdownContent);
      });
    });

    describe('On Destroy callback: onDestroy', () => {
      it('should call onDestroy callback when instance is destroyed', () => {
        // Arrange
        const onDestroyCallback = vi.fn();
        const dropdownElement = document.querySelector('[data-js-dropdown]');
        const dropdown = new DropdownToggle(dropdownElement, {
          onDestroy: onDestroyCallback,
          openTween: fadeDownAccordionTween,
          closeTween: fadeUpAccordionTween,
        });

        // Act
        dropdown.destroy();

        // Assert
        expect(onDestroyCallback).toHaveBeenCalled();
      });
    });

    it('should pass the open animation function the correct arguments', async () => {
      // Arrange
      const openTweenMock = vi.fn().mockImplementation(fadeDownAccordionTween);
      const dropdownElement = document.querySelector('[data-js-dropdown]');
      const dropdownContent = document.querySelector(`#${dropdownElement.getAttribute('aria-controls')}`);
      const dropdown = new DropdownToggle(dropdownElement, {
        openTween: openTweenMock,
        closeTween: fadeUpAccordionTween,
      });

      // Act
      await dropdown.open();

      // Assert
      expect(openTweenMock).toHaveBeenCalledWith(dropdownContent);
    });

    it('should pass the close animation function the correct arguments', async () => {
      // Arrange
      const closeTweenMock = vi.fn().mockImplementation(fadeUpAccordionTween);
      const dropdownElement = document.querySelector('[data-js-dropdown]');
      const dropdownContent = document.querySelector(`#${dropdownElement.getAttribute('aria-controls')}`);
      const dropdown = new DropdownToggle(dropdownElement, {
        openTween: fadeDownAccordionTween,
        closeTween: closeTweenMock,
      });

      // Act
      await dropdown.open();
      await dropdown.close();

      // Assert
      expect(closeTweenMock).toHaveBeenCalledWith(dropdownContent);
    });
  });
});
