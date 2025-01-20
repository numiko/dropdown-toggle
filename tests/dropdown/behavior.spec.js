import { expect, describe, it } from 'vitest';
import { DropdownToggle } from '../../lib/DropdownToggle';
import { setupTest, delay } from '../test-utils';

setupTest();

describe('When the dropdown is clicked', () => {
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
    new DropdownToggle(dropdownElement, {
      openDuration: 0.25,
      closeDuration: 0.25,
    });

    // Act
    // We use a click method instead of a public method because
    // we don't want to wait for the open animation to resolve
    // before we trigger the second click.
    dropdownElement.click();

    // `rAF` gives the dropdown time to start opening before we trigger
    // the second click.
    requestAnimationFrame(() => {
      dropdownElement.click();
    });

    // Wait for the dropdown to finish opening.
    await delay(300);

    // Assert
    expect(dropdownElement.getAttribute('aria-expanded')).toBe('true');
    expect(dropdownContent.getAttribute('aria-hidden')).toBe('false');
    expect(dropdownContent.style.height).toBe('auto');
    expect(dropdownContent.style.display).toBe('block');
  });

  it('should remove any open classes added when destroyed', async () => {
    // Arrange
    const dropdownElement = document.querySelector('[data-js-dropdown]');
    const dropdownContent = document.querySelector(`#${dropdownElement.getAttribute('aria-controls')}`);
    const classThatShouldBeRemoved = 'open-class';
    const dropdownToggle = new DropdownToggle(dropdownElement, {
      openDuration: 0.001,
      closeDuration: 0.001,
      openClass: classThatShouldBeRemoved,
    });
    await dropdownToggle.open();

    // Act
    dropdownToggle.destroy();

    // Assert
    expect(dropdownContent.classList.contains(classThatShouldBeRemoved)).toBe(false);
  });

  it('should do nothing if open is called on an already open dropdown', async () => {
    // Arrange
    const dropdownElement = document.querySelector('[data-js-dropdown]');
    const dropdownContent = document.querySelector(`#${dropdownElement.getAttribute('aria-controls')}`);
    const dropdownToggle = new DropdownToggle(dropdownElement, {
      openDuration: 0.001,
      closeDuration: 0.001,
    });
    await dropdownToggle.open();

    // We cache the HTML of the dropdown so we can assert that
    // nothing has changed with the markup upon calling `open()`
    // on a dropdown that's already open.
    const cachedDropdownElementHtml = dropdownElement.outerHTML;
    const cachedDropdownContentHtml = dropdownContent.outerHTML;

    // Act
    await dropdownToggle.open();

    // Assert
    expect(dropdownElement.outerHTML).toBe(cachedDropdownElementHtml);
    expect(dropdownContent.outerHTML).toBe(cachedDropdownContentHtml);
  });

  it('should do nothing if close is called on an already closed dropdown', async () => {
    // Arrange
    const dropdownElement = document.querySelector('[data-js-dropdown]');
    const dropdownContent = document.querySelector(`#${dropdownElement.getAttribute('aria-controls')}`);
    const dropdownToggle = new DropdownToggle(dropdownElement, {
      openDuration: 0.001,
      closeDuration: 0.001,
    });
    await dropdownToggle.open();
    await dropdownToggle.close();

    // We cache the HTML of the dropdown so we can assert that
    // nothing has changed upon calling `close()` on a dropdown
    // that's already closed.
    const cachedDropdownElementHtml = dropdownElement.outerHTML;
    const cachedDropdownContentHtml = dropdownContent.outerHTML;

    // Act
    await dropdownToggle.close();

    // Assert
    expect(dropdownElement.outerHTML).toBe(cachedDropdownElementHtml);
    expect(dropdownContent.outerHTML).toBe(cachedDropdownContentHtml);
  });
});

describe('When the dropdown getters are interacted with', () => {
  it('should set the isAnimating property to true when opening', async () => {
    // Arrange
    const dropdownElement = document.querySelector('[data-js-dropdown]');
    // The duration is longer here, to give us time to check
    // the state of the isAnimating property.
    const dropdownToggle = new DropdownToggle(dropdownElement, {
      openDuration: 0.3,
      closeDuration: 0.3,
    });

    // Act
    dropdownElement.click();

    // A minor delay allows the module time to set the `isAnimating` property.
    await delay(50);

    // Assert
    expect(dropdownToggle.isAnimating()).toBeTruthy();
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
