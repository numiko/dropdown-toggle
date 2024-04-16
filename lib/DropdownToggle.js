import gsap from 'gsap';

class DropdownToggle {
  static DEFAULT_DURATION = 0.3;
  static DEFAULT_EASE = 'power2.easeInOut';
  static DURATION_REDUCED_MOTION = 0.001;

  animationDuration = this.prefersReducedMotion() ? DropdownToggle.DURATION_REDUCED_MOTION : DropdownToggle.DEFAULT_DURATION;

  static groupInstances = {};

  constructor(button, options = {}) {

    this.bindThisToMemberFunctions();
    this.state = {
      isOpen: false,
      isAnimating: false,
    };
    this.button = typeof button === 'string' ? document.querySelector(button) : button;
    this.buttonLabelEl = typeof options.buttonLabelEl === 'string' ? this.button.querySelector(options.buttonLabelEl) : options.buttonLabelEl;
    this.dropdownId = this.button.getAttribute('aria-controls');
    this.dropdownItem = document.getElementById(this.dropdownId);
    this.openLabel = options.openLabel || 'Open';
    this.closeLabel = options.closeLabel || 'Close';
    this.openClass = options.openClass;
    this.openOnLoad = !!options.openOnLoad;
    this.closeOnEsc = !!options.closeOnEsc;
    this.closeOnOutsideClick = !!options.closeOnOutsideClick;
    this.onOpenStart = options.onOpenStart;
    this.onOpenEnd = options.onOpenEnd;
    this.onCloseStart = options.onCloseStart;
    this.onCloseEnd = options.onCloseEnd;
    this.onDestroy = options.onDestroy;
    this.openOptions = {
      duration: options.openDuration || this.animationDuration,
      ease: options.openEase || DropdownToggle.DEFAULT_EASE,
    };
    this.closeOptions = {
      duration: options.closeDuration || this.animationDuration,
      ease: options.closeEase || DropdownToggle.DEFAULT_EASE,
    };
    this.group = options.group || null;

    this.init();
  }

  /**
   * Binds instance to member functions to preserve the `this` context.
   */
  bindThisToMemberFunctions() {
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
    methods.forEach(method => {
      if (typeof this[method] === 'function') {
        this[method] = this[method].bind(this);
      }
    });
  }

  /**
   * Toggles the open/close state of the dropdown.
   */
  async toggle() {
    if (this.state.isAnimating) return Promise.resolve();

    await this.closeAllInGroup(this.group, this);

    if (this.isOpen()) {
      await this.close();
    } else {
      await this.open();
    }
  }

  /**
   * Closes all dropdowns in the specified group except for the current instance.
   * @param {string} group - The name of the group.
   * @param {DropdownToggle} currentInstance - The current instance of the dropdown to exclude.
   */
  async closeAllInGroup(group, currentInstance) {
    const groupInstances = DropdownToggle.groupInstances[group] || [];
    const closePromises = groupInstances.filter(instance => instance !== currentInstance && instance.isOpen()).map(instance => instance.close());
    await Promise.all(closePromises);
  }

  /**
   * Checks if the dropdown is open.
   * @returns {boolean} True if the dropdown is open, false otherwise.
   */
  isOpen() {
    return this.state.isOpen;
  }

  /**
   * Checks if the dropdown is animating.
   * @returns {boolean} True if the dropdown is animating, false otherwise.
   */
  isAnimating() {
    return this.state.isAnimating;
  }

  // Method to check for prefers-reduced-motion
  prefersReducedMotion() {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    return mediaQuery.matches;
  }

  /**
   * Opens the dropdown.
   * @param {Object} [options=this.openOptions] - The options for the animation.
   * @returns {Promise} A promise that resolves when the animation is complete.
   */
  open(options = this.openOptions) {
    if (this.state.isOpen) return Promise.resolve();

    this.addClasses(this.button, this.openClass);
    this.setAria(true);
    this.setButtonLabel(this.closeLabel);
    return this.animate(true, options);
  }

  /**
   * Closes the dropdown.
   * @param {Object} [options=this.closeOptions] - The options for the animation.
   * @returns {Promise} A promise that resolves when the animation is complete.
   */
  close(options = this.closeOptions) {
    if (!this.state.isOpen) return Promise.resolve();

    this.removeClasses(this.button, this.openClass);
    this.setAria(false);
    this.setButtonLabel(this.openLabel);

    return this.animate(false, options);
  }

  /**
   * Animates the opening or closing of the dropdown.
   * @param {boolean} opening - Indicates if the dropdown is being opened or closed.
   * @returns {Promise} A promise that resolves when the animation is complete.
   */
  animate(opening) {
    const tween = opening ? this.defaultOpenTween(this.dropdownItem) : this.defaultCloseTween(this.dropdownItem);

    return new Promise(resolve => {
      // Handling onStart callback
      if (opening) {
        this.onOpenStart?.(this.dropdownItem);
      } else {
        this.onCloseStart?.(this.dropdownItem);
      }

      // Update state before starting animation
      this.state.isAnimating = true;
      this.state.isOpen = opening;

      // Animation completed - Setting up onComplete directly on the GSAP tween as gsap returns a promise
      tween.then(() => {
        this.state.isAnimating = false;
        if (opening) {
          this.onOpenEnd?.(this.dropdownItem);
        } else {
          this.onCloseEnd?.(this.dropdownItem);
        }
        resolve();
      });
    });
  }


  /**
   * The default opening tween animation.
   * @param {HTMLElement} element - The element to animate.
   */
  defaultOpenTween(element) {
    this.dropdownItem.style.display = 'block';
    return gsap.fromTo(element, {
      height: 0
    },
    {
      height: 'auto',
      duration: this.openOptions.duration,
      ease: this.openOptions.ease
    });
  }

  /**
   * The default closing tween animation.
   * @param {HTMLElement} element - The element to animate.
   */
  defaultCloseTween(element) {
    return gsap.to(element, {
      height: 0,
      duration: this.closeOptions.duration,
      ease: this.closeOptions.ease,
      onComplete: () => {
        this.dropdownItem.style.display = 'none';
      }
    });
  }

  /**
   * Sets the ARIA attributes for the button and dropdown item.
   * @param {boolean} expanded - Indicates whether the dropdown is expanded or not.
   */
  setAria(expanded) {
    this.button.setAttribute('aria-expanded', expanded);
    this.dropdownItem.setAttribute('aria-hidden', !expanded);
  }

  /*
  * Add a class (or multiple) to an element.
  */
  addClasses(el, classes) {
    if (!el || !classes) return;
    const classesArray = classes.split(' ');
    el.classList.add(...classesArray);
  }

  /*
  * Removes the class (or multiple) of an element.
  */
  removeClasses(el, classes) {
    if (!el || !classes) return;
    const classesArray = classes.split(' ');
    el.classList.remove(...classesArray);
  }

  /**
   * Sets the label of the dropdown button.
   * @param {string} label - The string to use for the button's label
   */
  setButtonLabel(label) {
    if (!label || !this.buttonLabelEl) return;

    this.buttonLabelEl.textContent = label;
  }

  /**
   * Adds event listeners for the dropdown toggle, including click, keydown, and outside click.
   */
  addEventListeners() {
    this.button.addEventListener('click', this.toggle);

    if (this.closeOnEsc) {
      document.addEventListener('keydown', this.onEscKeyPress);
    }

    if (this.closeOnOutsideClick) {
      document.addEventListener('click', this.onClickOutside);
    }
  }

  /**
   * Handles the Escape key press to close the dropdown.
   * @param {KeyboardEvent} e - The keyboard event.
   */
  onEscKeyPress(e) {
    if (e.key === 'Escape' && this.isOpen()) {
      this.close();
    }
  }

  /**
   * Handles clicks outside the dropdown to close it.
   * @param {MouseEvent} e - The mouse event.
   */
  onClickOutside(e) {
    if (!this.isOpen()) return;

    const isClickInside = this.dropdownItem.contains(e.target) || this.button.contains(e.target);
    if (!isClickInside) {
      this.close();
    }
  }

  destroy() {
    this.resetState();
    this.removeEventListeners();
    this.removeFromGroup();
    this.onDestroy?.(this.dropdownItem);
  }

  /**
  * Resets the visual and ARIA state of the dropdown to its initial state. This method is typically
  * called as part of the component teardown process to ensure the component is cleanly reset.
  */
  resetState() {
    this.button.removeAttribute('aria-expanded');
    this.openClass && this.removeClasses(this.button, this.openClass);
    this.openLabel && this.setButtonLabel(this.openLabel);
    this.dropdownItem.removeAttribute('aria-hidden');
    this.dropdownItem.removeAttribute('style');
  }

  /**
  * Removes all event listeners added by the dropdown instance. This method is crucial for preventing
  * memory leaks and ensuring that event handlers do not trigger after the component has been destroyed.
  */
  removeEventListeners() {
    this.button.removeEventListener('click', this.toggle);
    document.removeEventListener('keydown', this.onEscKeyPress);
    document.removeEventListener('click', this.onClickOutside);
  }

  /**
   * Removes the current instance from its associated group in `groupInstances`.
   * If this leaves the group empty, the group is also removed from `groupInstances` to clean up.
   * This method is part of the cleanup process to ensure proper teardown of dropdown instances,
   * preventing memory leaks and ensuring the global state remains accurate.
   */
  removeFromGroup() {
  // Check if this instance belongs to a group and that the group exists
    if (this.group && DropdownToggle.groupInstances[this.group]) {
      // Find the index of this instance in its group
      const index = DropdownToggle.groupInstances[this.group].indexOf(this);
      // If found, remove this instance from the group
      if (index > -1) {
        DropdownToggle.groupInstances[this.group].splice(index, 1);
      }
      // If the group is now empty, delete it from `groupInstances`
      if (DropdownToggle.groupInstances[this.group].length === 0) {
        delete DropdownToggle.groupInstances[this.group];
      }
    }
  }

  /**
   * Initializes the dropdown toggle, setting its state and adding event listeners.
   */
  init() {
    this.setAria(false);
    this.openOnLoad && this.open({}, true);
    this.openLabel && this.setButtonLabel(this.openLabel);

    if (this.group) {
      // Ensure the group array exists for this.group
      DropdownToggle.groupInstances[this.group] = DropdownToggle.groupInstances[this.group] || [];

      // Add this instance to the group if it's not already included
      const groupIncludesInstance = DropdownToggle.groupInstances[this.group].includes(this);
      if (!groupIncludesInstance) {
        DropdownToggle.groupInstances[this.group].push(this);
      }
    }

    this.addEventListeners();
  }
}

export { DropdownToggle };
