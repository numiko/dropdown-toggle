import { slideDown, slideUp } from '@numiko/animation';

class DropdownToggle {

  constructor(button, options) {

    /**
     * The dropdown button element.
     *
     * @type {HTMLElement}
     */
    this.button = typeof button === 'string' ? document.querySelector(button) : button;

    /**
     * The button label element.
     *
     * @type {HTMLElement}
     */
    this.buttonLabelEl = typeof options.buttonLabelEl === 'string' ? this.button.querySelector(options.buttonLabelEl) : options.buttonLabelEl;

    /**
     * The dropdown item ID.
     *
     * @type {string}
     */
    this.dropdownId = this.button.getAttribute('aria-controls');

    /**
     * The dropdown item element.
     *
     * @type {HTMLElement}
     */
    this.dropdownItem = document.getElementById(this.dropdownId);

    /**
     * Determines whether the dropdown is currently animating.
     *
     * @type {Boolean}
     */
    this.isCurrentlyAnimating = false;

    /**
     * Determines whether the dropdown is open on load.
     *
     * @type {Boolean}
     */
    this.openOnLoad = !!options.openOnLoad;

    /**
     * The class added to the button when the dropdown is open.
     *
     * @type {String}
     */
    this.openClass = options.openClass || ''

    /**
     * The class added to the button when the dropdown is closed.
     *
     * @type {String}
     */
    this.closeClass = options.closeClass || ''

    /**
     * Event handler for the "Escape" key press event
     * @type {function}
     */
    this.onEscKeyPressHandler = this.onEscKeyPress.bind(this);

    /**
     * Event handler for the button click event
     * @type {function}
     */
    this.onButtonClickHandler = this.onButtonClick.bind(this);

    /**
     * The label for the button when the dropdown is closed.
     *
     * @type {String}
     */
    this.openLabel = options.openLabel || 'Open'

    /**
     * The label for the button when the dropdown is open.
     *
     * @type {String}
     */
    this.closeLabel = options.closeLabel || 'Close'

    /**
     * Allow user to close the dropdown with the 'esc' key
     *
     * @type {Boolean}
     */
    this.closeOnEsc = options.closeOnEsc;

    /**
     * Callback function before drodown opens
     * @type {Function}
     */
    this.onOpenStart = options.onOpenStart;

    /**
     * Callback functionswhen dropdown finishes opening
     * @type {Function}
     */
    this.onOpenEnd = options.onOpenEnd;

    /**
     * Callback function before dropdown closes
     * @type {Function}
     */
    this.onCloseStart = options.onCloseStart;

    /**
     * Callback function when dropdown is closed
     * @type {Function}
     */
    this.onCloseEnd = options.onCloseEnd;
  }

  /**
   * Returns a boolean value indicating whether the button element has the open class.
   * @return {boolean} `true` if the button has the open class, `false` otherwise.
   */
  get isOpen() {
    return this.button.classList.contains(this.openClass);
  }

  /**
   * Returns a boolean indicating whether the menu button is currently animating.
   *
   * @returns {boolean} True if the menu button is currently animating, false otherwise.
   */
  get isAnimating() {
    return this.isCurrentlyAnimating;
  }

  /**
  * Opens the dropdown menu.
  * @param {Object} options - The options for the animation.
  * @returns {Promise} - The gsap animation
  */
  open(options = {}) {
    this.isCurrentlyAnimating = true;
    this.button.classList.add(this.openClass);
    this.button.classList.remove(this.closeClass);
    this.setAria();
    this.setButtonLabel();

    if (typeof this.onOpenStart === 'function') {
      this.onOpenStart();
    } else if (this.onOpenStart) {
      console.warn('this.onOpenStart must be a function. Type %s detected', typeof this.onOpenStart);
    }

    options.callback = () => {
      this.isCurrentlyAnimating = false;

      if (typeof this.onOpenEnd === 'function') {
        this.onOpenEnd();
      } else if (this.onOpenEnd) {
        console.warn('this.onOpenEnd must be a function. Type \'%s\' detected', typeof this.onOpenEnd);
      }
    }

    return slideDown(this.dropdownItem, options);
  }

  /**
  * Closes the dropdown menu.
  * @param {Object} options - The options for the animation.
  * @returns {Promise} - The gsap animation
  */
  close(options = {}) {
    this.isCurrentlyAnimating = true;
    this.button.classList.add(this.closeClass);
    this.button.classList.remove(this.openClass);
    this.setAria();
    this.setButtonLabel();

    if (typeof this.onCloseStart === 'function') {
      this.onCloseStart();
    } else if (this.onCloseStart) {
      console.warn('this.onCloseStart must be a function. Type %s detected', typeof this.onCloseStart);
    }

    options.callback = () => {
      this.isCurrentlyAnimating = false;

      if (typeof this.onCloseEnd === 'function') {
        this.onCloseEnd();
      } else if (this.onCloseEnd) {
        console.warn('this.onCloseEnd must be a function. Type \'%s\' detected', typeof this.onCloseEnd);
      }
    };

    return slideUp(this.dropdownItem, options);
  }


  /**
   * Determines whether to open or close the dropdown
   * @returns {void}
   */
  toggle() {
    this.isOpen ? this.close() : this.open();
  }

  /**
   * Set button label based on if the dropdown is open/closed
   * @returns {void}
   */
  setButtonLabel() {
    if (this.buttonLabelEl) {
      this.buttonLabelEl.innerHTML = this.isOpen ? this.closeLabel : this.openLabel;
    }
  }

  /**
   * Set aria attributes on button and dropdown item
   * @returns {void}
   */
  setAria() {
    this.button.setAttribute('aria-expanded', this.isOpen ? 'true' : 'false');
    this.dropdownItem.setAttribute('aria-hidden', this.isOpen ? 'false' : 'true');
  }

  /**
   * Reset attributes & classes
   * @returns {void}
   */
  resetState() {
    this.button.removeAttribute('aria-expanded');
    this.button.classList.remove(this.openClass, this.closeClass);
    this.dropdownItem.removeAttribute('aria-hidden');
    this.dropdownItem.removeAttribute('style');
  }

  onEscKeyPress(e) {
    if (e.key !== "Escape") { return }
    this.close();
  }

  onButtonClick(e) {
    if (this.isAnimating) { return };
    this.toggle();
  }

  addEventListeners() {
    /**
     * Toggle item when button is clicked
     */
    this.button.addEventListener('click', this.onButtonClickHandler);

    /**
     * Close when Escape key is press
     */
    if (this.closeOnEsc) {
      document.addEventListener('keydown', this.onEscKeyPressHandler);
    }
  }

  removeEventListeners() {
    this.button.removeEventListener('click', this.onButtonClickHandler);
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

  destroy() {
    this.resetState();
    this.removeEventListeners();
  }

  init() {
    if (this.validateInstance()) {
      if (this.openOnLoad) {
        this.open({ duration: '0' });
      } else {
        this.close({ duration: '0' });
        // In case you are hiding the dropdown element via tailwind classes to avoid CLS issues
        // we will remove this after the initial close() on load
        this.dropdownItem.classList.remove('hidden');
      }

      // Ensures isCurrentlyAnimating is set to false when callback isn't fired on tweens with  `duration: 0`
      this.isCurrentlyAnimating = false;
      this.addEventListeners();
    }
  }
}

export { DropdownToggle as default }
