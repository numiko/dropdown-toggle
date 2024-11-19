import { Window } from 'happy-dom';
import { expect, describe, it, vi, beforeEach, afterEach } from 'vitest';
import { DropdownToggle } from '../lib/DropdownToggle';


// Read the HTML document content
const htmlDocumentContent = `
<div data-js-group-a class="mb-4">
  <div class="border">
    <button data-js-dropdown aria-controls="accordion1" type="button" aria=expanded=true>
      <span data-js-dropdown-label>An accordion with user added aria-expanded=true</span>
    </button>
    <div id="accordion1" class="hidden overflow-hidden">
      <a href="/" data-js-dropdown-link>This is a link</a>
      <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corporis, voluptatibus, commodi dolorum suscipit corrupti esse quae temporibus eum sint quam, doloribus distinctio sit. Repellat quo sequi rem veniam alias minus?</p>
    </div>
  </div>
  <div class="border">
    <button data-js-dropdown aria-controls="accordion1" type="button">
      <span data-js-dropdown-label>An accordion</span>
    </button>
    <div id="accordion1" class="hidden overflow-hidden">
      <a href="/" data-js-dropdown-link>This is a link</a>
      <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corporis, voluptatibus, commodi dolorum suscipit corrupti esse quae temporibus eum sint quam, doloribus distinctio sit. Repellat quo sequi rem veniam alias minus?</p>
    </div>
  </div>

  <div class="border">
    <button data-js-dropdown aria-controls="accordion2" type="button">
      <span data-js-dropdown-label>An accordion</span>
    </button>
    <div id="accordion2" class="hidden overflow-hidden">
      <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corporis, voluptatibus, commodi dolorum suscipit corrupti esse quae temporibus eum sint quam, doloribus distinctio sit. Repellat quo sequi rem veniam alias minus?</p>
    </div>
  </div>
  </div>

  <div data-js-group-b>
  <div class="border">
    <button data-js-dropdown aria-controls="accordion3" type="button">
      <span data-js-dropdown-label>An accordion</span>
    </button>
    <div id="accordion3" class="hidden overflow-hidden">
      <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corporis, voluptatibus, commodi dolorum suscipit corrupti esse quae temporibus eum sint quam, doloribus distinctio sit. Repellat quo sequi rem veniam alias minus?</p>
    </div>
  </div>

  <div class="border">
    <button data-js-dropdown aria-controls="accordion4" type="button">
      <span data-js-dropdown-label>An accordion</span>
    </button>
    <div id="accordion4" class="hidden overflow-hidden">
      <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corporis, voluptatibus, commodi dolorum suscipit corrupti esse quae temporibus eum sint quam, doloribus distinctio sit. Repellat quo sequi rem veniam alias minus?</p>
    </div>
  </div>
</div>
`;

// Initialise Happy DOM
const window = new Window();
const document = window.document;

// Make window and document global
global.window = window;
global.document = document;

// Utility to create a small delay
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

  // We reset the groupInstances after each test because
  // this is a static property and we don't want the groups
  // from one test to leak into another.
  DropdownToggle.groupInstances = {};
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

describe('When the dropdown is initialized', () => {

  it('should use the custom default duration if provided', () => {
    DropdownToggle.DEFAULT_DURATION = 0.2;
    const dropdown = new DropdownToggle('[data-js-dropdown]');
    expect(dropdown.openOptions.duration).toBe(0.2);
  });

  it('should use the custom default ease if provided', () => {
    DropdownToggle.DEFAULT_EASE = 'power1.easeInOut';
    const dropdown = new DropdownToggle('[data-js-dropdown]');
    expect(dropdown.openOptions.ease).toBe('power1.easeInOut');
  });

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

  it('should use the default open duration if no duration is passed in', () => {
    const dropdown = new DropdownToggle('[data-js-dropdown]');

    expect(dropdown.openOptions.duration).toBe(DropdownToggle.DEFAULT_DURATION);
  });


  it('should use the default close duration if no duration is passed in', () => {
    const dropdown = new DropdownToggle('[data-js-dropdown]');

    expect(dropdown.closeOptions.duration).toBe(DropdownToggle.DEFAULT_DURATION);
  });

  it('should set the button element properly if a string is passed in', () => {
    const dropdownElement = document.querySelector('[data-js-dropdown]');
    const dropdown = new DropdownToggle('[data-js-dropdown]');

    expect(dropdown.button).toBe(dropdownElement);
  });

  it('should open on load immediately', async () => {
    const dropdownElement = document.querySelector('[data-js-dropdown]');
    const dropdownContent = document.querySelector(`#${dropdownElement.getAttribute('aria-controls')}`);
    new DropdownToggle(dropdownElement, {
      openOnLoad: true,
    });

    // A minor delay ensures the dropdown is open before we
    // assert against it.
    await delay(100);

    expect(dropdownElement.getAttribute('aria-expanded')).toBe('true');
    expect(dropdownContent.getAttribute('aria-hidden')).toBe('false');
    expect(dropdownContent.style.height).toBe('auto');
    expect(dropdownContent.style.display).toBe('block');

  });

  it('should open on load if html markup states aria-expanded=true', async () => {
    const dropdownElement = document.querySelector('[data-js-dropdown]');
    const dropdownContent = document.querySelector(`#${dropdownElement.getAttribute('aria-controls')}`);
    new DropdownToggle(dropdownElement, {
      openOnLoad: true,
    });

    expect(dropdownElement.getAttribute('aria-expanded')).toBe('true');
    expect(dropdownContent.getAttribute('aria-hidden')).toBe('false');
    expect(dropdownContent.style.height).toBe('auto');
    expect(dropdownContent.style.display).toBe('block');

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
    expect(previouslyOpenedDropdownContent.getAttribute('aria-hidden')).toBe('true');
    expect(previouslyOpenedDropdownContent.style.display).toBe('none');
    expect(previouslyOpenedDropdownContent.style.height).toBe('0px');
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

  it('should remove the group from `groupInstances` if destroyed', async () => {
    // Arrange
    const dropdownEl = document.querySelector('[data-js-group-a] [data-js-dropdown]');
    const dropdown = new DropdownToggle(dropdownEl, {
      openDuration: 0.001,
      closeDuration: 0.001,
      group: 'group'
    });

    // Act
    dropdown.destroy();

    // Assert
    expect(DropdownToggle.groupInstances).toEqual({});
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

describe('When onFocusLeave is set to true', () => {
  it('should close the dropdown if the user tabs outside of it', async () => {
    // Arrange
    const dropdownElement = document.querySelector('[data-js-dropdown]');
    const dropdownContent = document.querySelector(`#${dropdownElement.getAttribute('aria-controls')}`);
    const dropdownToggle = new DropdownToggle(dropdownElement, {
      onFocusLeave: true,
      openDuration: 0.001,
      closeDuration: 0.001,
    });
    await dropdownToggle.open(); // Open dropdown for testing

    // Act
    const event = new window.KeyboardEvent('keyup', { key: 'Tab' });
    document.dispatchEvent(event);

    // Because onFocusLeave uses close() which is asynchronous we need to wait for it to complete but the event itself doesnt return
    // a promise so we can simply wait a little.
    await delay(250);

    // Assert
    expect(dropdownElement.getAttribute('aria-expanded')).toBe('false');
    expect(dropdownContent.getAttribute('aria-hidden')).toBe('true');
    expect(dropdownContent.style.height).toBe('0px');
    expect(dropdownContent.style.display).toBe('none');
  });

  it('should not close the dropdown if the key pressed is not `Tab`', async () => {
    // Arrange
    const dropdownElement = document.querySelector('[data-js-dropdown]');
    const dropdownContent = document.querySelector(`#${dropdownElement.getAttribute('aria-controls')}`);
    const dropdownToggle = new DropdownToggle(dropdownElement, {
      onFocusLeave: true,
      openDuration: 0.001,
      closeDuration: 0.001,
    });
    await dropdownToggle.open(); // Open dropdown for testing

    // Act
    const event = new window.KeyboardEvent('keyup', { key: 'Esc' });
    document.dispatchEvent(event);

    // As part of `onFocusLeave`, close() could be called if the test fails, which is asynchronous we need to wait for it to complete but the event itself doesnt return
    // a promise so we can simply wait a little.
    await delay(250);

    // Assert
    expect(dropdownElement.getAttribute('aria-expanded')).toBe('true');
    expect(dropdownContent.getAttribute('aria-hidden')).toBe('false');
    expect(dropdownContent.style.height).toBe('auto');
    expect(dropdownContent.style.display).toBe('block');
  });

  it('should not close the dropdown if the focus stays within the dropdown element', async () => {
    // Arrange
    const dropdownElement = document.querySelector('[data-js-dropdown]');
    const dropdownContent = document.querySelector(`#${dropdownElement.getAttribute('aria-controls')}`);
    const dropdownLink = document.querySelector('[data-js-dropdown-link]');
    const dropdownToggle = new DropdownToggle(dropdownElement, {
      onFocusLeave: true,
      openDuration: 0.001,
      closeDuration: 0.001,
    });
    await dropdownToggle.open(); // Open dropdown for testing

    // Act
    const event = new window.KeyboardEvent('keyup', { key: 'Tab', bubbles: true });
    dropdownLink.dispatchEvent(event);

    // As part of `onFocusLeave`, close() could be called if the test fails, which is asynchronous we need to wait for it to complete but the event itself doesnt return
    // a promise so we can simply wait a little.
    await delay(250);

    // Assert
    expect(dropdownElement.getAttribute('aria-expanded')).toBe('true');
    expect(dropdownContent.getAttribute('aria-hidden')).toBe('false');
    expect(dropdownContent.style.height).toBe('auto');
    expect(dropdownContent.style.display).toBe('block');
  });
});
