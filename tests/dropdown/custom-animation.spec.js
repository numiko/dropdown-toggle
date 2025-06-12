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
    describe('Open callbacks', () => {
      it('should call onOpenStart with dropdown content', async () => {
        const onOpenStartCallback = vi.fn();
        const dropdownElement = document.querySelector('[data-js-dropdown]');
        const dropdownContent = document.querySelector(`#${dropdownElement.getAttribute('aria-controls')}`);
        const dropdown = new DropdownToggle(dropdownElement, {
          onOpenStart: onOpenStartCallback,
          openOptions: {
            tween: fadeDownAccordionTween,
          },
          closeOptions: {
            tween: fadeUpAccordionTween,
          },
        });

        await dropdown.open();

        expect(onOpenStartCallback).toHaveBeenCalledWith(dropdownContent);
      });

      it('should call onOpenEnd with dropdown content', async () => {
        const onOpenEndCallback = vi.fn();
        const dropdownElement = document.querySelector('[data-js-dropdown]');
        const dropdownContent = document.querySelector(`#${dropdownElement.getAttribute('aria-controls')}`);
        const dropdown = new DropdownToggle(dropdownElement, {
          onOpenEnd: onOpenEndCallback,
          openOptions: {
            tween: fadeDownAccordionTween,
          },
          closeOptions: {
            tween: fadeUpAccordionTween,
          },
        });

        await dropdown.open();

        expect(onOpenEndCallback).toHaveBeenCalledWith(dropdownContent);
      });
    });

    describe('Close callbacks', () => {
      it('should call onCloseStart with dropdown content', async () => {
        const onCloseStartCallback = vi.fn();
        const dropdownElement = document.querySelector('[data-js-dropdown]');
        const dropdownContent = document.querySelector(`#${dropdownElement.getAttribute('aria-controls')}`);
        const dropdown = new DropdownToggle(dropdownElement, {
          onCloseStart: onCloseStartCallback,
          openOptions: {
            tween: fadeDownAccordionTween,
          },
          closeOptions: {
            tween: fadeUpAccordionTween,
          },
        });
        await dropdown.open();
        await dropdown.close();

        expect(onCloseStartCallback).toHaveBeenCalledWith(dropdownContent);
      });

      it('should call onCloseEnd with dropdown content', async () => {
        const onCloseEndCallback = vi.fn();
        const dropdownElement = document.querySelector('[data-js-dropdown]');
        const dropdownContent = document.querySelector(`#${dropdownElement.getAttribute('aria-controls')}`);
        const dropdown = new DropdownToggle(dropdownElement, {
          onCloseEnd: onCloseEndCallback,
          openOptions: {
            tween: fadeDownAccordionTween,
          },
          closeOptions: {
            tween: fadeUpAccordionTween,
          },
        });
        await dropdown.open();
        await dropdown.close();

        expect(onCloseEndCallback).toHaveBeenCalledWith(dropdownContent);
      });
    });

    it('should call onDestroy when instance is destroyed', () => {
      const onDestroyCallback = vi.fn();
      const dropdownElement = document.querySelector('[data-js-dropdown]');
      const dropdown = new DropdownToggle(dropdownElement, {
        onDestroy: onDestroyCallback,
        openOptions: {
          tween: fadeDownAccordionTween,
        },
        closeOptions: {
          tween: fadeUpAccordionTween,
        },
      });

      dropdown.destroy();

      expect(onDestroyCallback).toHaveBeenCalled();
    });

    it('should pass the open animation function the correct arguments', async () => {
      const openTweenMock = vi.fn().mockImplementation(fadeDownAccordionTween);
      const dropdownElement = document.querySelector('[data-js-dropdown]');
      const dropdownContent = document.querySelector(`#${dropdownElement.getAttribute('aria-controls')}`);
      const dropdown = new DropdownToggle(dropdownElement, {
        openOptions: {
          tween: openTweenMock,
        },
        closeOptions: {
          tween: fadeUpAccordionTween,
        },
      });

      await dropdown.open();

      expect(openTweenMock).toHaveBeenCalledWith(dropdownContent);
    });

    it('should pass the close animation function the correct arguments', async () => {
      const closeTweenMock = vi.fn().mockImplementation(fadeUpAccordionTween);
      const dropdownElement = document.querySelector('[data-js-dropdown]');
      const dropdownContent = document.querySelector(`#${dropdownElement.getAttribute('aria-controls')}`);
      const dropdown = new DropdownToggle(dropdownElement, {
        openOptions: {
          tween: fadeDownAccordionTween,
        },
        closeOptions: {
          tween: closeTweenMock,
        },
      });

      await dropdown.open();
      await dropdown.close();

      expect(closeTweenMock).toHaveBeenCalledWith(dropdownContent);
    });
  });
});
