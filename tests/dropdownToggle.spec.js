import { Window } from 'happy-dom';
import { expect, describe, it } from 'vitest'
import { DropdownToggle } from '../lib/main';



describe('DropdownToggle', () => {
  describe('dropdown button', () => {
    it('should have a button with `aria-expanded` set to `true` when opened', async () => {
      // Arrange
      document.body.innerHTML = `
      <button data-js-dropdown aria-controls="accordion">
        An accordion
      </button>
      <div id="accordion" data-js-dropdown-content style="overflow: hidden; display: none;">
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corporis, voluptatibus, commodi dolorum suscipit corrupti esse quae temporibus eum sint quam, doloribus distinctio sit. Repellat quo sequi rem veniam alias minus?</p>
      </div>
      `;

      // Act
      const dropdownElement = document.querySelector('[data-js-dropdown]');
      const dropdownToggle = new DropdownToggle(dropdownElement);
      await dropdownToggle.toggle();

      // Assert
      expect(dropdownElement.getAttribute('aria-expanded')).toBe('true');
    });
  });

  describe('dropdown content', () => {
    it('should have a height of `auto` when the open animation is complete', async () => {
      // Arrange
      document.body.innerHTML = `
      <button data-js-dropdown aria-controls="accordion">
        An accordion
      </button>
      <div id="accordion" data-js-dropdown-content style="overflow: hidden; display: none;">
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corporis, voluptatibus, commodi dolorum suscipit corrupti esse quae temporibus eum sint quam, doloribus distinctio sit. Repellat quo sequi rem veniam alias minus?</p>
      </div>
      `;

      // Act
      const dropdownElement = document.querySelector('[data-js-dropdown]');
      const dropdownContent = document.querySelector('[data-js-dropdown-content]');
      const dropdownToggle = new DropdownToggle(dropdownElement);
      await dropdownToggle.toggle();

      // Assert
      expect(dropdownContent.style.height).toBe('auto');
    });

    it('should have a display of `block` when the open animation is complete', async () => {
      // Arrange
      document.body.innerHTML = `
      <button data-js-dropdown aria-controls="accordion">
        An accordion
      </button>
      <div id="accordion" data-js-dropdown-content style="overflow: hidden; display: none;">
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corporis, voluptatibus, commodi dolorum suscipit corrupti esse quae temporibus eum sint quam, doloribus distinctio sit. Repellat quo sequi rem veniam alias minus?</p>
      </div>
      `;

      // Act
      const dropdownElement = document.querySelector('[data-js-dropdown]');
      const dropdownContent = document.querySelector('[data-js-dropdown-content]');
      const dropdownToggle = new DropdownToggle(dropdownElement);
      await dropdownToggle.toggle();

      // Assert
      expect(dropdownContent.style.display).toBe('block');
    });
  });


});
