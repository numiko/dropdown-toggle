import { slideDown, slideUp } from '@numiko/animation';

class DropdownToggle {
  constructor(button, options) {
    this.activeClass = '-is-active';
    this.button = button;
    this.dropdownId = this.button.getAttribute('aria-controls');
    this.dropdownItem = document.getElementById(this.dropdownId);
    this.buttonText = this.button.querySelector('[data-js-dropdown-label]');
    this.isAnimating = false;

    /**
     * Event handlers with `this` bound to the instance of the class
     * rather than the element that fired the event
     */
    this.onEscKeyPressHandler = this.onEscKeyPress.bind(this);
    this.toggleHandler = this.toggle.bind(this);

    /**
     * openOnLoad
     *
     * @type {Boolean}
     *
     * Determines whether the instance should be open or closed on load
     */
    this.openOnLoad = options.openOnLoad || false;

    /**
     * openLabel
     *
     * @type {String}
     *
     * Label to show to instruct user to open dropdown
     */
    this.openLabel = options.openLabel || 'Open'


    /**
     * closeLabel
     *
     * @type {String}
     *
     * Label to show to instruct user to close dropdown
     */
    this.closeLabel = options.closeLabel || 'Close'

    /**
     * closeOnEsc
     *
     * @type {Boolean}
     *
     * Determines whether component should close when esc key is pressed
     * Useful for navigation
     */
    this.closeOnEsc = options.closeOnEsc;

    /**
     * Callback functions when dropdown is opened
     */
    this.onOpenStart = options.onOpenStart;
    this.onOpenEnd = options.onOpenEnd;

    /**
     * Callback functions when dropdown is closed
     */
    this.onCloseStart = options.onCloseStart;
    this.onCloseEnd = options.onCloseEnd;
  }

  /**
   * isActive
   *
   * Checks whether dropdown is open or not
   */
  get isActive() {
    return this.button.classList.contains(this.activeClass);
  }

  /**
   * open
   *
   * @param {Object} options - Options that can be passed to slideUp function
   *
   * Animates dropdown into view and sets relevant aria- attributes
   */
  open(options = {}) {
    if (!this.isAnimating) {
      this.isAnimating = true;
      this.button.classList.add(this.activeClass);
      this.setAria();
      this.setButtonText();

      if (typeof this.onOpenStart === 'function') {
        this.onOpenStart();
      } else if (this.onOpenStart) {
        console.warn('this.onOpenStart must be a function. Type %s detected', typeof this.onOpenStart);
      }

      options.callback = () => {
        this.isAnimating = false;

        if (typeof this.onOpenEnd === 'function') {
          this.onOpenEnd();
        } else if (this.onOpenEnd) {
          console.warn('this.onOpenEnd must be a function. Type \'%s\' detected', typeof this.onOpenEnd);
        }
      }

      return slideDown(this.dropdownItem, options);
    }
  }

  /**
   * close
   *
   * @param {Object} options - Options that can be passed to slideUp function
   *
   * Animates dropdown out of view and sets relevant aria- attributes
   */
  close(options = {}) {
    if (!this.isAnimating) {
      this.isAnimating = true;
      this.button.classList.remove(this.activeClass);
      this.setAria();
      this.setButtonText();

      if (typeof this.onCloseStart === 'function') {
        this.onCloseStart();
      } else if (this.onCloseStart) {
        console.warn('this.onCloseStart must be a function. Type %s detected', typeof this.onCloseStart);
      }

      options.callback = () => {
        this.isAnimating = false;

        if (typeof this.onCloseEnd === 'function') {
          this.onCloseEnd();
        } else if (this.onCloseEnd) {
          console.warn('this.onCloseEnd must be a function. Type \'%s\' detected', typeof this.onCloseEnd);
        }
      };

      return slideUp(this.dropdownItem, options);
    }
  }

  /**
   * toggle
   *
   * Determines whether to open or close the dropdown
   */
  toggle() {
    if (this.isActive) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * setButtonText
   */
  setButtonText() {
    if (this.buttonText) {
      this.buttonText.innerText = this.isActive ? this.closeLabel : this.openLabel;
    }
  }

  /**
   * setAria
   *
   * Sets aria state on button and item
   */
  setAria() {
    this.button.setAttribute('aria-expanded', this.isActive ? 'true' : 'false');
    this.dropdownItem.setAttribute('aria-hidden', this.isActive ? 'false' : 'true');
  }

  /**
   * resetState
   *
   * Resets the state when switching breakpoints
   */
  resetState() {
    this.button.removeAttribute('aria-expanded');
    this.button.classList.remove(this.activeClass);
    this.dropdownItem.removeAttribute('aria-hidden');
    this.dropdownItem.removeAttribute('style');
  }

  onEscKeyPress(e) {
    if (e.key === "Escape") {
      this.close();
    }
  }

  /**
   * addEventListeners
   */
  addEventListeners() {
    /**
     * Toggle item when button is clicked
     */
    this.button.addEventListener('click', this.toggleHandler);

    /**
     * Close when Escape key is press
     */
    if (this.closeOnEsc) {
      document.addEventListener('keydown', this.onEscKeyPressHandler);
    }
  }

  /**
   * removeEventListeners
   */
  removeEventListeners() {
    this.button.removeEventListener('click', this.toggleHandler);

    document.removeEventListener('keydown', this.onEscKeyPressHandler);
  }

  validateInstance() {
    let isValid = false;

    if (this.dropdownId && this.dropdownItem) {
      isValid = true;
    } else {
      console.warn(
        this.button,
        `Element doesn't have an associated dropdown. To add this, create an aria-controls attribute on the button and an associated id on the element you want to use as the dropdown.`
      );
    }

    return isValid;
  }

  /**
   * init
   *
   * Set up initial state add event listeners
   */
  init() {
    if (this.validateInstance()) {
      if (this.openOnLoad) {
        this.open({ duration: '0' });
      } else {
        this.close({ duration: '0' });
      }

      // Ensures isAnimating is set to false when callback isn't fired on tweens with  `duration: 0`
      this.isAnimating = false;

      this.addEventListeners();
    }
  }

  /**
   * destroy
   *
   * Remove aria attributes and event listeners
   */
  destroy() {
    this.resetState();
    this.removeEventListeners();
  }
}

export { DropdownToggle as default }
