import gsap from 'gsap';

class DropdownToggle {
  static DURATION_DEFAULT = 0.3;
  static DURATION_REDUCED_MOTION = 0.001;
  static EASE_DEFAULT = 'power2.easeInOut';

  /**
   * Checks if the user prefers reduced motion animations.
   * @returns {boolean} True if reduced motion is preferred, false otherwise.
   */
  static prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Gets the appropriate animation duration based on user motion preferences.
   * @returns {number} The animation duration in seconds.
   */
  static getAnimationDuration() {
    return DropdownToggle.prefersReducedMotion()
      ? DropdownToggle.DURATION_REDUCED_MOTION
      : DropdownToggle.DURATION_DEFAULT;
  }

  static groupInstances = {};

  /**
   * Checks if all dropdowns in the specified group are open.
   * @param {string} group - The name of the group.
   * @returns {boolean} True if all dropdowns in the group are open, false otherwise.
   */
  static isGroupAllOpen(group) {
    const members = DropdownToggle.groupInstances[group] || [];
    return members.length > 0 && members.every(instance => instance.isOpen());
  }

  /**
   * Checks if all dropdowns in the specified group are closed.
   * @param {string} group - The name of the group.
   * @returns {boolean} True if all dropdowns in the group are closed, false otherwise.
   */
  static isGroupAllClosed(group) {
    const members = DropdownToggle.groupInstances[group] || [];
    return members.length > 0 && members.every(instance => !instance.isOpen());
  }


  /**
   * Closes all dropdowns in the specified group except for the current instance.
   * @param {string} group - The name of the group.
   * @param {DropdownToggle} currentInstance - The current instance of the dropdown to exclude.
   */
  static async closeAllInGroup(group, currentInstance) {
    const members = DropdownToggle.groupInstances[group] || [];
    const closePromises = members
      .filter(instance => instance !== currentInstance && instance.isOpen())
      .map(instance => instance.close());
    await Promise.all(closePromises);
  }


  /**
   * Opens all dropdowns in the specified group.
   * @param {string} group - The name of the group.
   */
  static async openAllInGroup(group) {
    const members = DropdownToggle.groupInstances[group] || [];
    const openPromises = members
      .filter(instance => !instance.isOpen())
      .map(instance => instance.open(false, true));
    await Promise.all(openPromises);
  }

  // Add a new static method to check if any dropdowns in a group are animating
  static isGroupAnimating(group) {
    const members = DropdownToggle.groupInstances[group] || [];
    return members.some(instance => instance.isAnimating());
  }

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
    this.closeOnFocusLeave = options.closeOnFocusLeave;
    this.onOpenStart = options.onOpenStart;
    this.onOpenEnd = options.onOpenEnd;
    this.onCloseStart = options.onCloseStart;
    this.onCloseEnd = options.onCloseEnd;
    this.onDestroy = options.onDestroy;
    this.openOptions = {
      duration: options.openDuration || DropdownToggle.getAnimationDuration(),
      ease: options.openEase || DropdownToggle.EASE_DEFAULT,
      tween: options.openTween
    };
    this.closeOptions = {
      duration: options.closeDuration || DropdownToggle.getAnimationDuration(),
      ease: options.closeEase || DropdownToggle.EASE_DEFAULT,
      tween: options.closeTween
    };
    this.group = options.group || null;
    this.groupMode = options.groupMode || 'multiple';

    // Create the custom event once
    this.groupChangeEvent = group => new CustomEvent('DropdownToggle:group-change', {
      detail: {
        group,
        isAllOpen: DropdownToggle.isGroupAllOpen(group)
      }
    });

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

  /**
   * Opens the dropdown directly, respecting group mode restrictions.
   * @param {boolean} instant - If true, skips animation
   * @param {boolean} bypassGroup - If true, bypasses group mode restrictions
   * @returns {Promise} A promise that resolves when the animation is complete
   */
  async open(instant = false, bypassGroup = false) {
    if (this.state.isAnimating) return Promise.resolve();

    // Add group behavior check
    if (this.group && !bypassGroup) {
      // Prevent opening if any dropdown in the group is animating
      if (DropdownToggle.isGroupAnimating(this.group)) {
        return Promise.resolve();
      }

      if (this.groupMode === 'single') {
        // Close all other dropdowns in the group
        DropdownToggle.closeAllInGroup(this.group, this);
      } else if (this.groupMode === 'single-await') {
        // Close all other dropdowns in the group (wait for them to close)
        await DropdownToggle.closeAllInGroup(this.group, this);
      }
    }

    this.state.isOpen = true;
    this.addClasses(this.button, this.openClass);
    this.setAria(true);
    this.setButtonLabel(this.closeLabel);

    if (this.group) {
      window.dispatchEvent(this.groupChangeEvent(this.group));
    }

    return this.animate(instant);
  }

  /**
   * Closes the dropdown directly.
   * @param {boolean} instant - If true, skips animation
   * @returns {Promise} A promise that resolves when the animation is complete
   */
  async close(instant = false) {
    if (this.state.isAnimating) return Promise.resolve();

    this.state.isOpen = false;
    this.removeClasses(this.button, this.openClass);
    this.setAria(false);
    this.setButtonLabel(this.openLabel);

    if (this.group) {
      window.dispatchEvent(this.groupChangeEvent(this.group));
    }

    return this.animate(instant);
  }

  /**
   * Toggles the dropdown's state while respecting group mode settings.
   * @returns {Promise} A promise that resolves when the animation is complete
   */
  async toggle() {
    if (this.state.isAnimating) return Promise.resolve();

    if (this.isOpen()) {
      await this.close();
    } else {
      await this.open();
    }
  }

  /**
   * Animates the opening or closing of the dropdown.
   * @param {boolean} instant - Indicates if the animation should be instant.
   * @returns {Promise} A promise that resolves when the animation is complete.
   */
  animate(instant = false) {
    const tween = this.isOpen()
      ? (this.openOptions.tween?.(this.dropdownItem) || this.defaultOpenTween(this.dropdownItem))
      : (this.closeOptions.tween?.(this.dropdownItem) || this.defaultCloseTween(this.dropdownItem));

    return new Promise(resolve => {
      if (this.isOpen()) {
        this.onOpenStart?.(this.dropdownItem);
      } else {
        this.onCloseStart?.(this.dropdownItem);
      }

      this.state.isAnimating = true;

      if (instant) {
        tween.progress(1);
        this.state.isAnimating = false;
        if (this.isOpen()) {
          this.onOpenEnd?.(this.dropdownItem);
        } else {
          this.onCloseEnd?.(this.dropdownItem);
        }
        resolve();
      } else {
        const originalOnComplete = tween.vars.onComplete;
        tween.eventCallback('onComplete', () => {
          if (originalOnComplete) originalOnComplete();
          this.state.isAnimating = false;
          if (this.isOpen()) {
            this.onOpenEnd?.(this.dropdownItem);
          } else {
            this.onCloseEnd?.(this.dropdownItem);
          }
          resolve();
        });
      }
    });
  }

  /**
   * The default opening tween animation.
   * @param {HTMLElement} element - The element to animate.
   */
  defaultOpenTween(element) {
    // First make visible but collapsed
    return gsap.timeline()
      .set(element, { display: 'block', height: 0 })
      .to(element, {
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
        gsap.set(element, { display: 'none' });
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

    if (this.closeOnFocusLeave) {
      document.addEventListener('keyup', this.onFocusLeaveHandler);
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

  /**
   * Handles the focus leaving the dropdown to close it.
   * @param {KeyboardEvent} e - The keyboard event.
   */
  onFocusLeaveHandler(e) {
    if (e.key !== 'Tab') return;

    const isFocusInside = this.dropdownItem.contains(e.target);

    if (!isFocusInside) {
      this.close();
    }
  }

  destroy() {
    this.resetState();
    this.removeEventListeners();
    this.removeInstanceFromGroup();
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
    document.removeEventListener('keyup', this.onFocusLeaveHandler);
  }

  /**
   * Adds this instance to its specified group in the static groupInstances.
   * Creates the group array if it doesn't exist.
   */
  addInstanceToGroup() {
    // Ensure the group array exists for this.group
    DropdownToggle.groupInstances[this.group] = DropdownToggle.groupInstances[this.group] || [];

    // Add this instance to the group
    DropdownToggle.groupInstances[this.group].push(this);
  }

  /**
   * Removes the current instance from its associated group in `groupInstances`.
   * If this leaves the group empty, the group is also removed from `groupInstances` to clean up.
   */
  removeInstanceFromGroup() {
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
   * Checks if the dropdown should be open based on the markup and the openOnLoad option.
   * @returns {boolean} True if the dropdown should be open, false otherwise.
   */
  shouldOpenOnLoad() {
    const isExpandedInMarkup = this.button.getAttribute('aria-expanded') === 'true';
    const instanceShouldOpenOnLoad = isExpandedInMarkup || this.openOnLoad;
    return instanceShouldOpenOnLoad;
  }

  /**
   * Initializes the dropdown toggle, setting its state and adding event listeners.
   */
  init() {
    // Set the inital state on load
    if (this.shouldOpenOnLoad()) {
      this.open(true);
    }

    // Add the instance to its group if specified
    if (this.group) {
      this.addInstanceToGroup();
    }

    this.addEventListeners();
  }
}

export { DropdownToggle };
