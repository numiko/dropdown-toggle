
import { expect, describe, it, vi } from 'vitest';
import { DropdownToggle } from '../../lib/DropdownToggle';
import { setupTest, delay } from '../test-utils';

setupTest();

describe('Button Label: buttonLabelEl', () => {
  it('should set the button label element when passed a string selector', () => {
    // Arrange
    const dropdownElement = document.querySelector('[data-js-dropdown]');
    const dropdownToggle = new DropdownToggle(dropdownElement, {
      buttonLabelEl: '[data-js-dropdown-label]'
    });

    // Assert
    expect(dropdownToggle.buttonLabelEl).toBe(
      dropdownElement.querySelector('[data-js-dropdown-label]')
    );
  });

  it('should set the button label element when passed a DOM element directly', () => {
    // Arrange
    const dropdownElement = document.querySelector('[data-js-dropdown]');
    const labelElement = dropdownElement.querySelector('[data-js-dropdown-label]');
    const dropdownToggle = new DropdownToggle(dropdownElement, {
      buttonLabelEl: labelElement
    });

    // Assert
    expect(dropdownToggle.buttonLabelEl).toBe(labelElement);
  });
});

describe('Open Label: openLabel', () => {

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

describe('Close Label: closeLabel', () => {
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
});

describe('Open on load: openOnLoad', () => {
  it('should open on load immediately if openOnLoad is true', async () => {
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

});

describe('Close on esc: closeOnEsc', () => {
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
});

describe('Close on outside click: closeOnOutsideClick', () => {
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
});

describe('Open class: openClass', () => {
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
});

describe('On Focus Leave: onFocusLeave', () => {
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

describe('On Open Start callback: onOpenStart', () => {
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
});

describe('On Open End callback: onOpenEnd', () => {
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
});

describe('On Close Start callback: onCloseStart', () => {
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
});

describe('On Close End callback: onCloseEnd', () => {
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
});

describe('On Destroy callback: onDestroy', () => {
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

describe('Group Mode', () => {
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
});

describe('Group Mode: Accordion', () => {
  it('should close previously-opened dropdowns in the group before opening a new one', async () => {
    // Arrange
    const previouslyOpenedDropdown = document.querySelector('[data-js-dropdown]');
    const previouslyOpenedDropdownContent = document.querySelector(`#${previouslyOpenedDropdown.getAttribute('aria-controls')}`);
    const previouslyOpenedDropdownInstance = new DropdownToggle(previouslyOpenedDropdown, {
      openDuration: 0.1,
      closeDuration: 0.1,
      group: 'group',
      groupMode: 'accordion'
    });

    const newlyOpenedDropdown = document.querySelector('[data-js-dropdown][aria-controls="accordion2"]');
    new DropdownToggle(newlyOpenedDropdown, {
      openDuration: 0.1,
      closeDuration: 0.1,
      group: 'group',
      groupMode: 'accordion'
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
});
