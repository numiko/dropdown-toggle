import { Window } from 'happy-dom';
import fs from 'fs';
import path from 'path';
import { expect, describe, it, vi, beforeEach, afterEach } from 'vitest';
import { DropdownToggle, DEFAULT_DURATION, DURATION_REDUCED_MOTION } from '../lib/DropdownToggle';
// Read the HTML document content
const htmlDocumentContent = fs.readFileSync(path.join(process.cwd(), 'index.html')).toString();

// Initalise Happy DOM
const window = new Window();
const document = window.document;

// Make window and document global
global.window = window;
global.document = document;

// utility to create a small delay
async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Make sure the document is in a clear state before each test.
beforeEach(() => {
  document.body.innerHTML = '';
  document.write(htmlDocumentContent);
});

afterEach(()=> {
  vi.restoreAllMocks();
});

describe('When the dropdown is interacted with', () => {
  it('should open the dropdown when the open method is called', async () => {
    // Arrange
    const dropdownElement = document.querySelector('[data-js-dropdown]');
    const dropdownContent = document.querySelector(`#${dropdownElement.getAttribute('aria-controls')}`);
    const dropdownToggle = new DropdownToggle(dropdownElement, {
      openDuration: 0.001,
      closeDuration: 0.001,
    });

    // Act
    await dropdownToggle.open();

    // Assert
    expect(dropdownElement.getAttribute('aria-expanded')).toBe('true');
    expect(dropdownContent.getAttribute('aria-hidden')).toBe('false');
    expect(dropdownContent.style.height).toBe('auto');
    expect(dropdownContent.style.display).toBe('block');
  });

  it('should close the dropdown when the close method is called', async () => {
    // Arrange
    const dropdownElement = document.querySelector('[data-js-dropdown]');
    const dropdownContent = document.querySelector(`#${dropdownElement.getAttribute('aria-controls')}`);
    const dropdownToggle = new DropdownToggle(dropdownElement, {
      openDuration: 0.001,
      closeDuration: 0.001,
    });
    await dropdownToggle.open(); // Ensure it's open before trying to close

    // Act
    await dropdownToggle.close();

    // Assert
    expect(dropdownElement.getAttribute('aria-expanded')).toBe('false');
    expect(dropdownContent.getAttribute('aria-hidden')).toBe('true');
    expect(dropdownContent.style.height).toBe('0px');
    expect(dropdownContent.style.display).toBe('none');
  });

  it('should reset the dropdown to its initial state when the destroy method is called', async () => {
    // Arrange
    const dropdownElement = document.querySelector('[data-js-dropdown]');
    const dropdownContent = document.querySelector(`#${dropdownElement.getAttribute('aria-controls')}`);
    const dropdownToggle = new DropdownToggle(dropdownElement, {
      openDuration: 0.001,
      closeDuration: 0.001,
    });
    await dropdownToggle.open(); // Ensure it's open before trying to close
    expect(dropdownElement.getAttribute('aria-expanded')).toBe('true'); // Confirm it's open before destroy

    // Act
    dropdownToggle.destroy(); // Remove event listeners
    const event = new window.MouseEvent('click', { target: dropdownElement });
    document.dispatchEvent(event); // Try to toggle the dropdown after destroying

    // Assert
    expect(dropdownElement.getAttribute('aria-expanded')).toBe(null);
    expect(dropdownContent.getAttribute('aria-hidden')).toBe(null);
  });

  it('should close the dropdown if open and the toggle method is used', async () => {
    // Arrange
    const dropdownElement = document.querySelector('[data-js-dropdown]');
    const dropdownContent = document.querySelector(`#${dropdownElement.getAttribute('aria-controls')}`);
    const dropdownToggle = new DropdownToggle(dropdownElement, {
      openDuration: 0.001,
      closeDuration: 0.001,
    });
    await dropdownToggle.open();

    // Act
    await dropdownToggle.toggle();

    // Assert
    expect(dropdownElement.getAttribute('aria-expanded')).toBe('false');
    expect(dropdownContent.getAttribute('aria-hidden')).toBe('true');
    expect(dropdownContent.style.height).toBe('0px');
    expect(dropdownContent.style.display).toBe('none');
  });

  it('should not interrupt the open animation if dropdown is clicked whilst opening', async () => {
    const dropdownElement = document.querySelector('[data-js-dropdown]');
    const dropdownContent = document.querySelector(`#${dropdownElement.getAttribute('aria-controls')}`);
    const dropdown = new DropdownToggle(dropdownElement, {
      openDuration: 0.5,
      closeDuration: 0.5,
    });

    // Act
    // We use a click method instead of a public method because
    // we don't want to wait for the open animation to resolve
    // before we trigger the second click; the second click
    // is simulated via the `toggle` method as this is async
    // and allows us to wait for the animation to complete
    // before making our assertion.
    dropdownElement.click();

    // A minor delays allows the side-effects from the click handler
    // to run before we trigger the second click — via the `toggle` method.
    await delay(20);

    await dropdown.toggle();

    // Assert
    expect(dropdownElement.getAttribute('aria-expanded')).toBe('true');
    expect(dropdownContent.getAttribute('aria-hidden')).toBe('false');
    expect(dropdownContent.style.height).toBe('auto');
    expect(dropdownContent.style.display).toBe('block');
  });
});

describe('When the dropdown getters are interacted with', () => {
  it('should set the isAnimating property to true when opening', () => {
    // Arrange
    const dropdownElement = document.querySelector('[data-js-dropdown]');
    // The duration is longer here, to give us time to check
    // the state iof the isAnimating property.
    const dropdownToggle = new DropdownToggle(dropdownElement, {
      openDuration: 0.3,
      closeDuration: 0.3,
    });

    // Act
    dropdownElement.click();

    // Assert
    requestAnimationFrame(() => {
      expect(dropdownToggle.isAnimating()).toBeTruthy();
    });
  });

  it('should set the isAnimating property to false once closed', async () => {
    // Arrange
    const dropdownElement = document.querySelector('[data-js-dropdown]');
    const dropdownToggle = new DropdownToggle(dropdownElement, {
      openDuration: 0.001,
      closeDuration: 0.001,
    });
    await dropdownToggle.open();

    // Act
    await dropdownToggle.close();

    // Assert
    expect(dropdownToggle.isAnimating()).toBeFalsy();
  });

  it('should set the isOpen property to true when open', async () => {
    // Arrange
    const dropdownElement = document.querySelector('[data-js-dropdown]');
    const dropdownToggle = new DropdownToggle(dropdownElement, {
      openDuration: 0.001,
      closeDuration: 0.001,
    });

    // Act
    await dropdownToggle.open();

    // Assert
    expect(dropdownToggle.isOpen()).toBeTruthy();
  });

  it('should set the isOpen property to false when closed', async () => {
    // Arrange
    const dropdownElement = document.querySelector('[data-js-dropdown]');
    const dropdownToggle = new DropdownToggle(dropdownElement, {
      openDuration: 0.001,
      closeDuration: 0.001,
    });
    await dropdownToggle.open();

    // Act
    await dropdownToggle.close();

    // Assert
    expect(dropdownToggle.isOpen()).toBeFalsy();
  });
});

describe('When the dropdown is initialized', () => {

  it('should animate almost immediately if a user prefers reduced motion', () => {
    const matchMediaSpy = vi.spyOn(window, 'matchMedia');
    matchMediaSpy.mockImplementation(() => {
      return {
        matches: true,
      };
    });

    const dropdown = new DropdownToggle('[data-js-dropdown]');

    expect(dropdown.openOptions.duration).toBe(DURATION_REDUCED_MOTION);
  });

  it('should use the default open duration if no duration is passed in', () => {
    const dropdown = new DropdownToggle('[data-js-dropdown]');

    expect(dropdown.openOptions.duration).toBe(DEFAULT_DURATION);
  });


  it('should use the default close duration if no duration is passed in', () => {
    const dropdown = new DropdownToggle('[data-js-dropdown]');

    expect(dropdown.closeOptions.duration).toBe(DEFAULT_DURATION);
  });

  it('should set the button element properly if a string is passed in', () => {
    const dropdownElement = document.querySelector('[data-js-dropdown]');
    const dropdown = new DropdownToggle('[data-js-dropdown]');

    expect(dropdown.button).toBe(dropdownElement);
  });

  it('should open on load', async () => {
    const dropdownElement = document.querySelector('[data-js-dropdown]');
    const dropdownContent = document.querySelector(`#${dropdownElement.getAttribute('aria-controls')}`);
    new DropdownToggle(dropdownElement, {
      openOnLoad: true,
      openDuration: 0.001,
      closeDuration: 0.001,
    });

    requestAnimationFrame(() => {
      expect(dropdownElement.getAttribute('aria-expanded')).toBe('true');
      expect(dropdownContent.getAttribute('aria-hidden')).toBe('false');
      expect(dropdownContent.style.height).toBe('auto');
      expect(dropdownContent.style.display).toBe('block');
    });
  });

  it('should close when the esc key has been selected', async () => {
    // Arrange
    const dropdownElement = document.querySelector('[data-js-dropdown]');
    const dropdownContent = document.querySelector(`#${dropdownElement.getAttribute('aria-controls')}`);
    const dropdownToggle = new DropdownToggle(dropdownElement, {
      closeOnEsc: true,
      openDuration: 0.001,
      closeDuration: 0.001,
    });
    await dropdownToggle.open(); // Open dropdown for testing

    // Act
    const event = new window.KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);

    // Because 'esc' calls close() which is asynchronous we need to wait for it to complete but the event itself doesnt return
    // a promise so we can simply wait a little.
    await delay(250);

    // Assert
    expect(dropdownElement.getAttribute('aria-expanded')).toBe('false');
    expect(dropdownContent.getAttribute('aria-hidden')).toBe('true');
    expect(dropdownContent.style.height).toBe('0px');
    expect(dropdownContent.style.display).toBe('none');
  });

  it('should close when a user clicks outside of the dropdown', async () => {
    // Arrange
    const dropdownElement = document.querySelector('[data-js-dropdown]');
    const dropdownContent = document.querySelector(`#${dropdownElement.getAttribute('aria-controls')}`);
    const dropdownToggle = new DropdownToggle(dropdownElement, {
      closeOnOutsideClick: true,
      openDuration: 0.001,
      closeDuration: 0.001,
    });
    await dropdownToggle.open(); // Open dropdown for testing

    // Act
    const event = new window.MouseEvent('click', { target: document.body });
    document.dispatchEvent(event);

    // Because 'esc' calls close() which is asynchronous we need to wait for it to complete but the event itself doesnt return
    // a promise so we can simply wait a little.
    await delay(250);

    // Assert
    expect(dropdownElement.getAttribute('aria-expanded')).toBe('false');
    expect(dropdownContent.getAttribute('aria-hidden')).toBe('true');
    expect(dropdownContent.style.height).toBe('0px');
    expect(dropdownContent.style.display).toBe('none');
  });

  it('should add the provided class when opened', async () => {
    // Arrange
    const openClass = 'dropdown-open';
    const dropdownElement = document.querySelector('[data-js-dropdown]');
    const dropdownToggle = new DropdownToggle(dropdownElement, {
      openClass: openClass,
      openDuration: 0.001,
      closeDuration: 0.001,
    });

    // Act
    await dropdownToggle.open();

    // Assert
    expect(dropdownElement.classList.contains(openClass)).toBeTruthy();
  });

  it('should remove any provided open classes when closed', async () => {
    // Arrange
    const openClasses = 'class1 class2 class3';
    const dropdownElement = document.querySelector('[data-js-dropdown]');
    const dropdownToggle = new DropdownToggle(dropdownElement, {
      openClass: openClasses,
      openDuration: 0.001,
      closeDuration: 0.001,
    });
    await dropdownToggle.open();

    // Act
    await dropdownToggle.close();

    // Assert
    expect(dropdownElement.classList.contains(openClasses)).toBeFalsy();
  });

  it('should set the dropdown label to the closeLabel when opened ', async () => {
    // Arrange
    const dropdownElement = document.querySelector('[data-js-dropdown]');
    const dropdownToggle = new DropdownToggle(dropdownElement, {
      buttonLabelEl: '[data-js-dropdown-label]',
      closeLabel: 'Close dropdown',
      openDuration: 0.001,
      closeDuration: 0.001,
    });

    // Act
    await dropdownToggle.open();

    // Assert
    expect(dropdownElement.querySelector('[data-js-dropdown-label]').innerText).toBe('Close dropdown');
  });

  it('should set the dropdown label to the openLabel when closed', async () => {
    // Arrange
    const dropdownElement = document.querySelector('[data-js-dropdown]');
    const dropdownToggle = new DropdownToggle(dropdownElement, {
      buttonLabelEl: '[data-js-dropdown-label]',
      openLabel: 'Open dropdown',
      openDuration: 0.001,
      closeDuration: 0.001,
    });
    await dropdownToggle.open();

    // Act
    await dropdownToggle.close();

    // Assert
    expect(dropdownElement.querySelector('[data-js-dropdown-label]').innerText).toBe('Open dropdown');
  });

  it('should set the dropdown label to the openLabel when calling destroy()', async () => {
    // Arrange
    const openLabelText = 'Open dropdown';
    const dropdownElement = document.querySelector('[data-js-dropdown]');
    const dropdownToggle = new DropdownToggle(dropdownElement, {
      buttonLabelEl: '[data-js-dropdown-label]',
      openLabel: openLabelText
    });
    await dropdownToggle.open();

    // Act
    dropdownToggle.destroy();

    // Assert
    expect(dropdownElement.querySelector('[data-js-dropdown-label]').innerText).toBe(openLabelText);
  });
});

describe('When the dropdown callbacks are utilised', () => {
  it('should call onOpenStart callback if provided', async () => {
    // Arrange
    // vi.fn() is a utility function to create a spy function that we can track if its been called
    const onOpenStartCallback = vi.fn();
    const dropdownElement = document.querySelector('[data-js-dropdown]');
    const dropdown = new DropdownToggle(dropdownElement, {
      onOpenStart: onOpenStartCallback,
      openDuration: 0.001,
      closeDuration: 0.001,
    });

    // Act
    await dropdown.open();

    // Assert
    expect(onOpenStartCallback).toHaveBeenCalled();
  });

  it('should call onOpenEnd callback if provided', async () => {
    // Arrange
    const onOpenEndCallback = vi.fn();
    const dropdownElement = document.querySelector('[data-js-dropdown]');
    const dropdown = new DropdownToggle(dropdownElement, {
      onOpenEnd: onOpenEndCallback,
      openDuration: 0.001,
      closeDuration: 0.001,
    });

    // Act
    await dropdown.open();

    // Assert
    expect(onOpenEndCallback).toHaveBeenCalled();
  });

  it('should call onCloseStart callback if provided', async () => {
    // Arrange
    const onCloseStartCallback = vi.fn();
    const dropdownElement = document.querySelector('[data-js-dropdown]');
    const dropdown = new DropdownToggle(dropdownElement, {
      onCloseStart: onCloseStartCallback,
      openDuration: 0.001,
      closeDuration: 0.001,
    });
    await dropdown.open();

    // Act
    await dropdown.close();

    // Assert
    expect(onCloseStartCallback).toHaveBeenCalled();
  });

  it('should call onCloseEnd callback if provided', async () => {
    // Arrange
    const onCloseEndCallback = vi.fn();
    const dropdownElement = document.querySelector('[data-js-dropdown]');
    const dropdown = new DropdownToggle(dropdownElement, {
      onCloseEnd: onCloseEndCallback,
      openDuration: 0.001,
      closeDuration: 0.001,
    });
    await dropdown.open();

    // Act
    await dropdown.close();

    // Assert
    expect(onCloseEndCallback).toHaveBeenCalled();
  });

  it('should call onDestroy callback when instance is destroyed', () => {
    // Arrange
    const onDestroyCallback = vi.fn();
    const dropdownElement = document.querySelector('[data-js-dropdown]');
    const dropdown = new DropdownToggle(dropdownElement, {
      onDestroy: onDestroyCallback
    });

    // Act
    dropdown.destroy();

    // Assert
    expect(onDestroyCallback).toHaveBeenCalled();
  });

  it('should pass the dropdown content to onOpenStart callback', async () => {
    // Arrange
    const onOpenStartCallback = vi.fn();
    const dropdownElement = document.querySelector('[data-js-dropdown]');
    const dropdownContent = document.querySelector(`#${dropdownElement.getAttribute('aria-controls')}`);
    const dropdown = new DropdownToggle(dropdownElement, {
      onOpenStart: onOpenStartCallback,
      openDuration: 0.001,
      closeDuration: 0.001,
    });

    // Act
    await dropdown.open();

    // Assert
    expect(onOpenStartCallback).toHaveBeenCalledWith(dropdownContent);
  });

  it('should pass the dropdown content to onOpenEnd callback', async () => {
    // Arrange
    const onOpenEndCallback = vi.fn();
    const dropdownElement = document.querySelector('[data-js-dropdown]');
    const dropdownContent = document.querySelector(`#${dropdownElement.getAttribute('aria-controls')}`);
    const dropdown = new DropdownToggle(dropdownElement, {
      onOpenEnd: onOpenEndCallback,
      openDuration: 0.001,
      closeDuration: 0.001,
    });

    // Act
    await dropdown.open();

    // Assert
    expect(onOpenEndCallback).toHaveBeenCalledWith(dropdownContent);
  });

  it('should pass the dropdown content to onCloseStart callback', async () => {
    // Arrange
    const onCloseStartCallback = vi.fn();
    const dropdownElement = document.querySelector('[data-js-dropdown]');
    const dropdownContent = document.querySelector(`#${dropdownElement.getAttribute('aria-controls')}`);
    const dropdown = new DropdownToggle(dropdownElement, {
      onCloseStart: onCloseStartCallback,
      openDuration: 0.001,
      closeDuration: 0.001,
    });
    await dropdown.open();

    // Act
    await dropdown.close();

    // Assert
    expect(onCloseStartCallback).toHaveBeenCalledWith(dropdownContent);
  });

  it('should pass the dropdown content to onCloseEnd callback', async () => {
    // Arrange
    const onCloseEndCallback = vi.fn();
    const dropdownElement = document.querySelector('[data-js-dropdown]');
    const dropdownContent = document.querySelector(`#${dropdownElement.getAttribute('aria-controls')}`);
    const dropdown = new DropdownToggle(dropdownElement, {
      onCloseEnd: onCloseEndCallback,
      openDuration: 0.001,
      closeDuration: 0.001,
    });
    await dropdown.open();

    // Act
    await dropdown.close();

    // Assert
    expect(onCloseEndCallback).toHaveBeenCalledWith(dropdownContent);
  });

  it('should pass the dropdown content to onDestroy callback', () => {
    // Arrange
    const onDestroyCallback = vi.fn();
    const dropdownElement = document.querySelector('[data-js-dropdown]');
    const dropdownContent = document.querySelector(`#${dropdownElement.getAttribute('aria-controls')}`);
    const dropdown = new DropdownToggle(dropdownElement, {
      onDestroy: onDestroyCallback
    });

    // Act
    dropdown.destroy();

    // Assert
    expect(onDestroyCallback).toHaveBeenCalledWith(dropdownContent);
  });
});

describe('When a dropdown is part of a larger group', () => {
  it('should close previously-opened dropdowns in the group before opening a new one', async () => {
    // Arrange
    const previouslyOpenedDropdown = document.querySelector('[data-js-dropdown]');
    const previouslyOpenedDropdownContent = document.querySelector(`#${previouslyOpenedDropdown.getAttribute('aria-controls')}`);
    const previouslyOpenedDropdownInstance = new DropdownToggle(previouslyOpenedDropdown, {
      openDuration: 0.1,
      closeDuration: 0.1,
      group: 'group',
    });

    const newlyOpenedDropdown = document.querySelector('[data-js-dropdown][aria-controls="accordion2"]');
    new DropdownToggle(newlyOpenedDropdown, {
      openDuration: 0.1,
      closeDuration: 0.1,
      group: 'group',
    });

    await previouslyOpenedDropdownInstance.toggle();

    // Act
    newlyOpenedDropdown.click();

    // Assert

    // We add a small delay to give time for the previously opened dropdown
    // to close before asserting against it.
    await delay(250);

    // We want to ensure that the previously-opened dropdown has closed before
    // we open a new dropdown in the group. As a result, we don't need to wait for the
    // newly-opened dropdown to finish opening before we check the state of the
    // previously-opened dropdown. We expect the previously-opened dropdown to be closed
    // before we open the new one.
    requestAnimationFrame(() => {
      expect(previouslyOpenedDropdownContent.getAttribute('aria-hidden')).toBe('true');
      expect(previouslyOpenedDropdownContent.style.display).toBe('none');
      expect(previouslyOpenedDropdownContent.style.height).toBe('0px');
    });
  });

  it('should only close dropdowns that are part of the same group', async () => {
    // Arrange
    const dropdownInFirstGroup = document.querySelector('[data-js-group-a] [data-js-dropdown]');
    const dropdownInFirstGroupContent = document.querySelector(`#${dropdownInFirstGroup.getAttribute('aria-controls')}`);
    const dropdownInFirstGroupInstance = new DropdownToggle(dropdownInFirstGroup, {
      openDuration: 0.001,
      closeDuration: 0.001,
      group: 'group-a',
    });

    const dropdownInSecondGroup = document.querySelector('[data-js-group-b] [data-js-dropdown]');
    const dropdownInSecondGroupInstance = new DropdownToggle(dropdownInSecondGroup, {
      openDuration: 0.001,
      closeDuration: 0.001,
      group: 'group-b',
    });

    await dropdownInFirstGroupInstance.open();

    // Act
    await dropdownInSecondGroupInstance.toggle();

    // Assert
    expect(dropdownInFirstGroupContent.getAttribute('aria-hidden')).toBe('false');
    expect(dropdownInFirstGroupContent.style.display).toBe('block');
    expect(dropdownInFirstGroupContent.style.height).toBe('auto');
  });

  it('should remove a dropdown from a group when destroyed', async () => {
    // Arrange
    const firstDropdownInGroupAEl = document.querySelector('[data-js-group-a] [data-js-dropdown]');
    const firstDropdownInGroupAContent = document.querySelector(`#${firstDropdownInGroupAEl.getAttribute('aria-controls')}`);
    const firstDropdownInGroupA = new DropdownToggle(firstDropdownInGroupAEl, {
      openDuration: 0.001,
      closeDuration: 0.001,
      group: 'group-a',
    });

    const secondDropdownInGroupAEl = document.querySelector('[data-js-group-a] [data-js-dropdown][aria-controls="accordion2"]');
    const secondDropdownInGroupA = new DropdownToggle(secondDropdownInGroupAEl, {
      openDuration: 0.001,
      closeDuration: 0.001,
      group: 'group-a',
    });

    // Act
    secondDropdownInGroupA.destroy();

    const reInitialisedSecondDropdownEl = document.querySelector('[data-js-group-a] [data-js-dropdown][aria-controls="accordion2"]');
    const reInitialisedSecondDropdownContent = document.querySelector(`#${reInitialisedSecondDropdownEl.getAttribute('aria-controls')}`);
    const reInitialisedSecondDropdown = new DropdownToggle(reInitialisedSecondDropdownEl, {
      openDuration: 0.001,
      closeDuration: 0.001,
    });

    await reInitialisedSecondDropdown.toggle();

    await firstDropdownInGroupA.toggle();

    // Assert
    // We expect both dropdowns to be visible because they are no longer
    // in a group, and so act independently of one another.
    expect(firstDropdownInGroupAContent.getAttribute('aria-hidden')).toBe('false');
    expect(firstDropdownInGroupAContent.style.display).toBe('block');
    expect(firstDropdownInGroupAContent.style.height).toBe('auto');

    expect(reInitialisedSecondDropdownContent.getAttribute('aria-hidden')).toBe('false');
    expect(reInitialisedSecondDropdownContent.style.display).toBe('block');
    expect(reInitialisedSecondDropdownContent.style.height).toBe('auto');
  });
});
