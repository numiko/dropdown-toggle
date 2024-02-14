import { Window } from 'happy-dom';
import fs from 'fs';
import path from 'path';
import { expect, describe, it, vi, beforeEach } from 'vitest'
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
  document.body.innerHTML = "";
  document.write(htmlDocumentContent);
})

describe('DropdownToggle opened', () => {
  it('should correctly set attributes & styles when opening', async () => {
    // Arrange
    const dropdownElement = document.querySelector('[data-js-dropdown]');
    const dropdownContent = document.querySelector(`#${dropdownElement.getAttribute('aria-controls')}`);
    const dropdownToggle = new DropdownToggle(dropdownElement);

    // Act
    await dropdownToggle.open();

    // Assert
    expect(dropdownElement.getAttribute('aria-expanded')).toBe('true');
    expect(dropdownContent.getAttribute('aria-hidden')).toBe('false');
    expect(dropdownContent.style.height).toBe('auto');
    expect(dropdownContent.style.display).toBe('block');
  });
});

describe('DropdownToggle closed', () => {
  it('should correctly set attributes and style when closing', async () => {
    // Arrange
    const dropdownElement = document.querySelector('[data-js-dropdown]');
    const dropdownContent = document.querySelector(`#${dropdownElement.getAttribute('aria-controls')}`);
    const dropdownToggle = new DropdownToggle(dropdownElement);

    // Act
    await dropdownToggle.open();
    await dropdownToggle.close();

    // Assert
    expect(dropdownElement.getAttribute('aria-expanded')).toBe('false');
    expect(dropdownContent.getAttribute('aria-hidden')).toBe('true');
    expect(dropdownContent.style.height).toBe('0px');
    expect(dropdownContent.style.display).toBe('none');
  });
});

describe('DropdownToggle methods', () => {

  it('"open()" method should open the dropdown', async () => {
    // Arrange
    const dropdownElement = document.querySelector('[data-js-dropdown]');
    const dropdownContent = document.querySelector(`#${dropdownElement.getAttribute('aria-controls')}`);
    const dropdownToggle = new DropdownToggle(dropdownElement);

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
    const dropdownToggle = new DropdownToggle(dropdownElement);
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
  const dropdownToggle = new DropdownToggle(dropdownElement);
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

describe('DropdownToggle additional options', () => {

  it('closeOnEsc - closes the dropdown when the Escape key is pressed', async () => {
    // Arrange
    const dropdownElement = document.querySelector('[data-js-dropdown]');
    const dropdownContent = document.querySelector(`#${dropdownElement.getAttribute('aria-controls')}`);
    const dropdownToggle = new DropdownToggle(dropdownElement, { closeOnEsc: true });
    await dropdownToggle.open(); // Open dropdown for testing

    // Act
    const event = new window.KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);

    // Because 'esc' calls close() which is asynchronous we need to wait for it to complete but the event itself doesnt return
    // a promise so we can simply wait a little.
    await delay(500);

    // Assert
    expect(dropdownElement.getAttribute('aria-expanded')).toBe('false');
    expect(dropdownContent.getAttribute('aria-hidden')).toBe('true');
    expect(dropdownContent.style.height).toBe('0px');
    expect(dropdownContent.style.display).toBe('none');
  });

  it('closeOnClickOutside - closes the dropdown when clicking outside of it', async () => {
    // Arrange
    const dropdownElement = document.querySelector('[data-js-dropdown]');
    const dropdownContent = document.querySelector(`#${dropdownElement.getAttribute('aria-controls')}`);
    const dropdownToggle = new DropdownToggle(dropdownElement, { closeOnOutsideClick: true });
    await dropdownToggle.open(); // Open dropdown for testing

    // Act
    const event = new window.MouseEvent('click', { target: document.body });
    document.dispatchEvent(event);

    // Because 'esc' calls close() which is asynchronous we need to wait for it to complete but the event itself doesnt return
    // a promise so we can simply wait a little.
    await delay(500);

    // Assert
    expect(dropdownElement.getAttribute('aria-expanded')).toBe('false');
    expect(dropdownContent.getAttribute('aria-hidden')).toBe('true');
    expect(dropdownContent.style.height).toBe('0px');
    expect(dropdownContent.style.display).toBe('none');
  });

  it('openClass - Adds class to button when opened', async () => {
    // Arrange
    const openClass = 'dropdown-open';
    const dropdownElement = document.querySelector('[data-js-dropdown]');
    const dropdownToggle = new DropdownToggle(dropdownElement, { openClass: openClass });

    // Act
    await dropdownToggle.open();

    // Assert
    expect(dropdownElement.classList.contains(openClass)).toBe(true);
  });

  it('openClass - Removes class from button when closed', async () => {
    // Arrange
    const openClasses = 'class1 class2 class3';
    const dropdownElement = document.querySelector('[data-js-dropdown]');
    const dropdownToggle = new DropdownToggle(dropdownElement, { openClass: openClasses });
    await dropdownToggle.open();

    // Act
    await dropdownToggle.close();

    // Assert
    expect(dropdownElement.classList.contains(openClasses)).toBe(false);
  });
});

describe('Dropdown callbacks', () => {
  it('should call onOpenStart callback if provided', async () => {
    // Arrange
    const onOpenStartCallback = vi.fn();
    const dropdownElement = document.querySelector('[data-js-dropdown]');
    const dropdown = new DropdownToggle(dropdownElement, {
      onOpenStart: onOpenStartCallback
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
      onOpenEnd: onOpenEndCallback
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
      onCloseStart: onCloseStartCallback
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
      onCloseEnd: onCloseEndCallback
    });
    await dropdown.open();

    // Act
    await dropdown.close();

    // Assert
    expect(onCloseEndCallback).toHaveBeenCalled();
  });

  it('should pass the dropdown content to onOpenStart callback', async () => {
    // Arrange
    const onOpenStartCallback = vi.fn();
    const dropdownElement = document.querySelector('[data-js-dropdown]');
    const dropdownContent = document.querySelector(`#${dropdownElement.getAttribute('aria-controls')}`);
    const dropdown = new DropdownToggle(dropdownElement, {
      onOpenStart: onOpenStartCallback
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
      onOpenEnd: onOpenEndCallback
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
      onCloseStart: onCloseStartCallback
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
      onCloseEnd: onCloseEndCallback
    });
    await dropdown.open();

    // Act
    await dropdown.close();

    // Assert
    expect(onCloseEndCallback).toHaveBeenCalledWith(dropdownContent);
  });
});
