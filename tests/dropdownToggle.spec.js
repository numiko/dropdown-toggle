import { Window } from 'happy-dom';
import fs from 'fs';
import path from 'path';
import { expect, describe, it, beforeEach, vi } from 'vitest';
import { DropdownToggle } from '../lib/DropdownToggle';


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

describe('Dropdown public methods', () => {

  it('"open()" method should open the dropdown', async () => {
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


  it('"close()" should close the dropdown', async () => {
    // Arrange
    const dropdownElement = document.querySelector('[data-js-dropdown]');
    const dropdownContent = document.querySelector(`#${dropdownElement.getAttribute('aria-controls')}`);
    const dropdownToggle = new DropdownToggle(dropdownElement,
      {
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


  it('"destroy()" method should reset DOM to inital state', async () => {
    // Arrange
    const dropdownElement = document.querySelector('[data-js-dropdown]');
    const dropdownContent = document.querySelector(`#${dropdownElement.getAttribute('aria-controls')}`);
    const dropdownToggle = new DropdownToggle(dropdownElement,
      {
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
});

describe('Dropdown configuration', () => {

  it('closeOnEsc - should close the dropdown when the Escape key is pressed', async () => {
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

  it('closeOnClickOutside - should close the dropdown when clicking outside of it', async () => {
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

  it('openClass - should add class to button when opened', async () => {
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
    expect(dropdownElement.classList.contains(openClass)).toBe(true);
  });

  it('openClass - should remove class from button when closed', async () => {
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
    expect(dropdownElement.classList.contains(openClasses)).toBe(false);
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

describe('Dropdown callbacks', () => {
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

describe('Dropdown group behaviour', () => {
  it('should close previously-opened dropdowns in the group before opening a new one', async () => {
    // Arrange
    const dropdownInstances = [];
    const dropdownElements = document.querySelectorAll('[data-js-dropdown]');

    dropdownElements.forEach((dropdown) => {
      const dropdownToggle = new DropdownToggle(dropdown, {
        openDuration: 0.001,
        closeDuration: 0.001,
        group: 'group',
      });
      const dropdownContent = document.querySelector(`#${dropdown.getAttribute('aria-controls')}`);

      dropdownInstances.push({
        instance: dropdownToggle,
        dropdownContent: dropdownContent,
      });
    });
    await dropdownInstances[0].instance.toggle();

    // Act
    dropdownInstances[1].instance.toggle();

    // Assert
    // We want to ensure that the previously-opened dropdown has closed before
    // we open a new dropdown in the group. As a result, we don't need to wait for the
    // newly-opened dropdown to finish opening before we check the state of the
    // previously-opened dropdown. We expect the previously-opened dropdown to be closed
    // before we open the new one.
    requestAnimationFrame(() => {
      expect(dropdownInstances[0].dropdownContent.getAttribute('aria-hidden')).toBeTruthy();
      expect(dropdownInstances[0].dropdownContent.style.display).toBe('none');
      expect(dropdownInstances[0].dropdownContent.style.height).toBe('0px');
    });
  });
});
