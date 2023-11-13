import { slideDown, slideUp } from '@numiko/animation';
import gsap from 'gsap';

class DropdownToggle {

  constructor(button, options) {

    /**
   * Determines state of the dropdown
   *
   * @type {Object}
   */
    this.state = {
      isOpen: false
    };

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
     * The label for the button when the dropdown is closed.
     *
     * @type {String}
     */
    this.openLabel = options.openLabel || 'Open';

    /**
     * The label for the button when the dropdown is open.
     *
     * @type {String}
     */
    this.closeLabel = options.closeLabel || 'Close';

    /**
     * The class added to the button when the dropdown is open.
     *
     * @type {String}
     */
    this.openClass = options.openClass;

    /**
     * The class added to the button when the dropdown is closed.
     *
     * @type {String}
     */
    this.closeClass = options.closeClass;

    /**
     * Determines whether the dropdown is open on load.
     *
     * @type {Boolean}
     */
    this.openOnLoad = !!options.openOnLoad;

    /**
     * Allow user to close the dropdown with the 'esc' key
     *
     * @type {Boolean}
     */
    this.closeOnEsc = !!options.closeOnEsc;

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

     /**
     * Custom tween function to be used for opening dropdown
     * @type {Function}
     */
    this.customOpenTween = options.customOpenTween;

    /**
     * Custom tween function to be used for closing dropdown
     * @type {Function}
     */
    this.customCloseTween = options.customCloseTween;
  }

  /**
   * Returns a boolean value indicating whether the button element has the open class.
   * @return {boolean} `true` if the button has the open class, `false` otherwise.
   */
  get isOpen() {
    return this.state.isOpen;
  }

  /**
   * Returns a boolean indicating whether the menu button is currently animating.
   *
   * @returns {boolean} True if the menu button is currently animating, false otherwise.
   */
  get isAnimating() {
    return gsap.isTweening(this.dropdownItem);
  }

  /**
  * Opens the dropdown menu.
  * @param {Object} options - The options for the animation.
  * @returns {Tween} - The gsap animation
  */
  open(options = {}) {
    if (this.isOpen) return;

    this.state.isOpen = true;

    this.setAria();
    this.setButtonLabel();

    this.openClass && this.button.classList.add(this.openClass);
    this.closeClass && this.button.classList.remove(this.closeClass);

    if(this.customOpenTween) {
      // Store a reference to the custom tween and pass in the dropdownItem as a paramter
      const tween = this.customOpenTween(this.dropdownItem);

      // Cache the onStart & onComplete functions of the custom tween before we overwrite it below to append stuff to it
      const tweenOnStart = tween.eventCallback('onStart');
      const tweenOnComplete = tween.eventCallback('onComplete');

      tween.eventCallback("onStart", () => {
        // Call both the callbacks - from custom tween and the options
        typeof tweenOnStart === 'function' && tweenOnStart();
        typeof this.onOpenStart === 'function' && this.onOpenStart();
      });

      tween.eventCallback("onComplete", () => {
        // Call both the callbacks - from custom tween and the options
        typeof tweenOnComplete === 'function' && tweenOnComplete();
        typeof this.onOpenEnd === 'function' && this.onOpenEnd();
      });

      tween.play();

    } else {
      // We play the default slideDown animation
      // TODO: We should probably hook into the onStart callback properly!
      typeof this.onOpenStart === 'function' && this.onOpenStart();

      options.callback = () => {
        typeof this.onOpenEnd === 'function' && this.onOpenEnd();
      };

      return slideDown(this.dropdownItem, options);
    }
  }

  /**
  * Closes the dropdown menu.
  * @param {Object} options - The options for the animation.
  * @returns {Tween} - The gsap animation
  */
  close(options = {}) {
    if (!this.isOpen) return;

    this.state.isOpen = false;

    this.setAria();
    this.setButtonLabel();

    this.closeClass && this.button.classList.add(this.closeClass);
    this.openClass && this.button.classList.remove(this.openClass);


    if(this.customCloseTween) {
      // Store a reference to the custom tween and pass in the dropdownItem as a paramter
      const tween = this.customCloseTween(this.dropdownItem);

      // Cache the onStart & onComplete functions of the custom tween before we overwrite it below to append stuff to it
      const tweenOnStart = tween.eventCallback('onStart');
      const tweenOnComplete = tween.eventCallback('onComplete');

      tween.eventCallback("onStart", () => {
        // Call both the callbacks - from custom tween and the options
        typeof tweenOnStart === 'function' && tweenOnStart();
        typeof this.onCloseStart === 'function' && this.onCloseStart();
      });

      tween.eventCallback("onComplete", () => {
        // Call both the callbacks - from custom tween and the options
        typeof tweenOnComplete === 'function' && tweenOnComplete();
        typeof this.onCloseEnd === 'function' && this.onCloseEnd();
      });

      tween.play();

    } else {
      // We play the default slideUp animation
      // TODO: We should probably hook into the onStart callback properly!
      typeof this.onCloseStart === 'function' && this.onCloseStart();

      options.callback = () => {
        typeof this.onCloseEnd === 'function' && this.onCloseEnd();
      };

      return slideUp(this.dropdownItem, options);
    }

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
    this.openClass && this.button.classList.remove(this.openClass);
    this.closeClass && this.button.classList.remove(this.closeClass);
    this.dropdownItem.removeAttribute('aria-hidden');
    this.dropdownItem.removeAttribute('style');
  }

  onEscKeyPress(e) {
    if (e.key !== 'Escape') { return; }

    if (this.isOpen) {
      this.close();
      document.removeEventListener('keydown', this.onEscKeyPressHandler);
    }
  }

  onButtonClick() {
    if (this.isAnimating) { return; }

    if ( this.isOpen ) {
      this.close();
      document.removeEventListener('keydown', this.onEscKeyPressHandler);
    } else {
      this.open();
      document.addEventListener('keydown', this.onEscKeyPressHandler);
    }
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
        'Element doesn\'t have an associated dropdown. To add this, create an aria-controls attribute on the button and an associated id on the element you want to use as the dropdown.'
      );
    }

    if( typeof this.onOpenStart !== 'function' ) {
      console.warn('this.onOpenStart must be a function. Type \'%s\' detected', typeof this.onOpenStart);
    };

    if( typeof this.onOpenEnd !== 'function' ) {
      console.warn('this.onOpenEnd must be a function. Type \'%s\' detected', typeof this.onOpenEnd);
    };

    if( typeof this.onCloseStart !== 'function' ) {
      console.warn('this.onCloseStart must be a function. Type \'%s\' detected', typeof this.onCloseStart);
    };

    if( typeof this.onCloseEnd !== 'function' ) {
      console.warn('this.onCloseEnd must be a function. Type \'%s\' detected', typeof this.onCloseEnd);
    };

    return isValid;
  }

  destroy() {
    this.resetState();
    this.removeEventListeners();
  }

  init() {
    if (!this.validateInstance()) return;

    if (this.openOnLoad) {
      this.open({ duration: '0' });
    }

    this.addEventListeners();
  }
}

export { DropdownToggle as default }
