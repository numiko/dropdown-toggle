import gsap from 'gsap';

type State = {
  isOpen: boolean
  isAnimating: boolean
};

class DropdownToggle {
  static DURATION_DEFAULT = 0.3;
  static DURATION_REDUCED_MOTION = 0.001;
  static EASE_DEFAULT = 'power2.easeInOut';

  static prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  static getAnimationDuration() {
    return DropdownToggle.prefersReducedMotion()
      ? DropdownToggle.DURATION_REDUCED_MOTION
      : DropdownToggle.DURATION_DEFAULT;
  }

  static groupInstances = {};

  static isGroupAllOpen(group) {
    const members = DropdownToggle.groupInstances[group] || [];
    return members.length > 0 && members.every(instance => instance.isOpen());
  }

  static isGroupAllClosed(group) {
    const members = DropdownToggle.groupInstances[group] || [];
    return members.length > 0 && members.every(instance => !instance.isOpen());
  }

  static async closeAllInGroup(group, currentInstance) {
    const members = DropdownToggle.groupInstances[group] || [];
    const closePromises = members
      .filter(instance => instance !== currentInstance && instance.isOpen())
      .map(instance => instance.close());
    await Promise.all(closePromises);
  }

  static async openAllInGroup(group) {
    const members = DropdownToggle.groupInstances[group] || [];
    const openPromises = members
      .filter(instance => !instance.isOpen())
      .map(instance => instance.open(false, true));
    await Promise.all(openPromises);
  }

  static isGroupAnimating(group) {
    const members = DropdownToggle.groupInstances[group] || [];
    return members.some(instance => instance.isAnimating());
  }

  state: State = {
    isOpen: false,
    isAnimating: false,
  };

  constructor(button: HTMLElement | string, options = {}) {
    this.bindThisToMemberFunctions();
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

  bindThisToMemberFunctions() {
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
    methods.forEach(method => {
      if (typeof this[method] === 'function') {
        this[method] = this[method].bind(this);
      }
    });
  }

  isOpen() {
    return this.state.isOpen;
  }

  isAnimating() {
    return this.state.isAnimating;
  }

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

  async toggle() {
    if (this.state.isAnimating) return Promise.resolve();

    if (this.isOpen()) {
      await this.close();
    } else {
      await this.open();
    }
  }

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

  defaultOpenTween(element: HTMLElement) {
    // First make visible but collapsed
    return gsap.timeline()
      .set(element, { display: 'block', height: 0 })
      .to(element, {
        height: 'auto',
        duration: this.openOptions.duration,
        ease: this.openOptions.ease
      });
  }

  defaultCloseTween(element: HTMLElement) {
    return gsap.to(element, {
      height: 0,
      duration: this.closeOptions.duration,
      ease: this.closeOptions.ease,
      onComplete: () => {
        gsap.set(element, { display: 'none' });
      }
    });
  }

  setAria(expanded: boolean) {
    this.button.setAttribute('aria-expanded', expanded);
    this.dropdownItem.setAttribute('aria-hidden', !expanded);
  }

  addClasses(el: HTMLElement, classes: string) {
    if (!el || !classes) return;
    const classesArray = classes.split(' ');
    el.classList.add(...classesArray);
  }

  removeClasses(el: HTMLElement, classes: string) {
    if (!el || !classes) return;
    const classesArray = classes.split(' ');
    el.classList.remove(...classesArray);
  }

  setButtonLabel(label: string) {
    if (!label || !this.buttonLabelEl) return;

    this.buttonLabelEl.textContent = label;
  }

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

  onEscKeyPress(e: KeyboardEvent) {
    if (e.key === 'Escape' && this.isOpen()) {
      this.close();
    }
  }

  onClickOutside(e: Event) {
    if (!this.isOpen()) return;

    const isClickInside = this.dropdownItem.contains(e.target) || this.button.contains(e.target);
    if (!isClickInside) {
      this.close();
    }
  }

  onFocusLeaveHandler(e: KeyboardEvent) {
    if (e.key !== 'Tab') return;
    if (!this.isOpen()) return;

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

  resetState() {
    gsap.killTweensOf(this.dropdownItem);
    this.button.removeAttribute('aria-expanded');
    if (this.openClass) {
      this.removeClasses(this.button, this.openClass);
    }
    if (this.openLabel) {
      this.setButtonLabel(this.openLabel);
    }
    this.dropdownItem.removeAttribute('aria-hidden');
    this.dropdownItem.removeAttribute('style');
  }

  removeEventListeners() {
    this.button.removeEventListener('click', this.toggle);
    document.removeEventListener('keydown', this.onEscKeyPress);
    document.removeEventListener('click', this.onClickOutside);
    document.removeEventListener('keyup', this.onFocusLeaveHandler);
  }

  addInstanceToGroup() {
    // Ensure the group array exists for this.group
    DropdownToggle.groupInstances[this.group] = DropdownToggle.groupInstances[this.group] || [];

    // Add this instance to the group
    DropdownToggle.groupInstances[this.group].push(this);
  }

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

  shouldOpenOnLoad() {
    const isExpandedInMarkup = this.button.getAttribute('aria-expanded') === 'true';
    const instanceShouldOpenOnLoad = isExpandedInMarkup || this.openOnLoad;
    return instanceShouldOpenOnLoad;
  }

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
