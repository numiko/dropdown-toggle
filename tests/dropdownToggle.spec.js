import { Window } from 'happy-dom';
import fs from 'fs';
import path from 'path';
import { expect, describe, it, vi } from 'vitest'
import { DropdownToggle } from '../lib/DropdownToggle';

const htmlDocPath = path.join(process.cwd(), 'index.html');
const htmlDocumentContent = fs.readFileSync(htmlDocPath).toString();
const window = new Window();
const document = window.document;
document.write(htmlDocumentContent);
vi.stubGlobal('document', document);


describe('DropdownToggle', () => {
  describe('dropdown button', () => {
    it('should have a button with `aria-expanded` set to `true` when opened', async () => {
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
      // Act
      const dropdownElement = document.querySelector('[data-js-dropdown]');
      const dropdownContent = document.querySelector(`#${dropdownElement.getAttribute('aria-controls')}`);

      const dropdownToggle = new DropdownToggle(dropdownElement);
      await dropdownToggle.toggle();

      // Assert
      expect(dropdownContent.style.height).toBe('auto');
    });

    it('should have a display of `block` when the open animation is complete', async () => {
      // Act
      const dropdownElement = document.querySelector('[data-js-dropdown]');
      const dropdownContent = document.querySelector(`#${dropdownElement.getAttribute('aria-controls')}`);
      const dropdownToggle = new DropdownToggle(dropdownElement);
      await dropdownToggle.toggle();

      // Assert
      expect(dropdownContent.style.display).toBe('block');
    });
  });


});
