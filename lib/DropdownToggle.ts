import gsap from 'gsap';
import { deepMerge } from './utils/deepMerge';

type AnimationOptions = {
  duration: number
  ease: string
  tween: (el: HTMLElement) => gsap.core.Timeline | gsap.core.Tween
};

type State = {
  isOpen: boolean
  isAnimating: boolean
};

type GroupMode = 'single' | 'multiple' | 'single-await';

/**
 * Options that are considered "public" and can
 * be passed to the constructor.
 */
type DropdownOptions = {
  buttonLabelEl?: HTMLElement | string
  openLabel?: string
  closeLabel?: string
  openClass?: string
  openOnLoad?: boolean
  closeOnEsc?: boolean
  closeOnOutsideClick?: boolean
  closeOnFocusLeave?: boolean
  onOpenStart?: () => void
  onOpenEnd?: () => void
  onCloseStart?: () => void
  onCloseEnd?: () => void
  onDestroy?: () => void
  openOptions?: AnimationOptions,
  closeOptions?: AnimationOptions,
  group?: string,
  groupMode?: GroupMode
};

/**
 * Options that are considered "internal" and are
 * merged with the public options. Public options
 * take precedence over internal options.
 */
type InternalOptions = {
  openLabel: string
  closeLabel: string
  openClass: string
  openOnLoad: boolean
  closeOnEsc: boolean
  closeOnOutsideClick: boolean
  closeOnFocusLeave: boolean
  group: string
  groupMode: GroupMode
  openOptions: AnimationOptions,
  closeOptions: AnimationOptions,
  onOpenStart?: (el: HTMLElement) => void
  onOpenEnd?: (el: HTMLElement) => void
  onCloseStart?: (el: HTMLElement) => void
  onCloseEnd?: (el: HTMLElement) => void
  onDestroy?: (el: HTMLElement) => void
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

  static groupInstances: Record<string, DropdownToggle[]> = {};

  static isGroupAllOpen(group: string) {
    const members = DropdownToggle.groupInstances[group] || [];
    return members.length > 0 && members.every(instance => instance.isOpen());
  }

  static isGroupAllClosed(group: string) {
    const members = DropdownToggle.groupInstances[group] || [];
    return members.length > 0 && members.every(instance => !instance.isOpen());
  }

  static async closeAllInGroup(group: string, currentInstance: DropdownToggle) {
    const members = DropdownToggle.groupInstances[group] || [];
    const closePromises = members
      .filter(instance => instance !== currentInstance && instance.isOpen())
      .map(instance => instance.close());
    await Promise.all(closePromises);
  }

  static async openAllInGroup(group: string) {
    const members = DropdownToggle.groupInstances[group] || [];
    const openPromises = members
      .filter(instance => !instance.isOpen())
      .map(instance => instance.open(false, true));
    await Promise.all(openPromises);
  }

  static isGroupAnimating(group: string) {
    const members = DropdownToggle.groupInstances[group] || [];
    return members.some(instance => instance.isAnimating());
  }

  button: HTMLElement;
  buttonLabelEl?: HTMLElement;
  dropdownId: string;
  dropdownItem: HTMLElement;

  state: State = {
    isOpen: false,
    isAnimating: false,
  };

  options: InternalOptions = {
    openLabel: 'Open',
    closeLabel: 'Close',
    openClass: 'open',
    openOnLoad: false,
    closeOnEsc: false,
    closeOnOutsideClick: false,
    closeOnFocusLeave: false,
    group: '',
    groupMode: 'multiple',
    openOptions: {
      duration: DropdownToggle.getAnimationDuration(),
      ease: DropdownToggle.EASE_DEFAULT,
      tween: this.defaultOpenTween.bind(this),
    },
    closeOptions: {
      duration: DropdownToggle.getAnimationDuration(),
      ease: DropdownToggle.EASE_DEFAULT,
      tween: this.defaultCloseTween.bind(this),
    },
  };

  constructor(button: HTMLElement | string, options?: DropdownOptions) {
    this.bindThisToMemberFunctions();

    if (options) {
      this.options = deepMerge(this.options, options);
    }

    if (typeof button === 'string') {
      const btn = document.querySelector<HTMLElement>(button);
      if (btn) {
        this.button = btn;
      } else {
        throw new Error(`Button element not found: ${button}`);
      }
    } else {
      this.button = button;
    }

    if (options?.buttonLabelEl) {
      if (typeof options.buttonLabelEl === 'string') {
        const labelEl = this.button.querySelector<HTMLElement>(options.buttonLabelEl);
        if (labelEl) {
          this.buttonLabelEl = labelEl;
        } else {
          throw new Error(`Button label element not found: ${options.buttonLabelEl}`);
        }
      } else {
        this.buttonLabelEl = options.buttonLabelEl;
      }
    }

    if (this.button.getAttribute('aria-controls')) {
      const dropdownId = this.button.getAttribute('aria-controls');
      if (dropdownId) {
        this.dropdownId = dropdownId;
      } else {
        throw new Error('Dropdown ID not found');
      }
    } else {
      throw new Error('Dropdown ID not found');
    }

    const dropdownEl = document.getElementById(this.dropdownId);
    if (dropdownEl) {
      this.dropdownItem = dropdownEl;
    } else {
      throw new Error('Dropdown element not found');
    }

    this.init();
  }

  dispatchGroupChangeEvent(group: string) {
    const event = new CustomEvent('DropdownToggle:group-change', {
      detail: {
        group,
        isAllOpen: DropdownToggle.isGroupAllOpen(group)
      }
    });
    window.dispatchEvent(event);
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
    if (this.options.group && !bypassGroup) {
      // Prevent opening if any dropdown in the group is animating
      if (DropdownToggle.isGroupAnimating(this.options.group)) {
        return Promise.resolve();
      }

      if (this.options.groupMode === 'single') {
        // Close all other dropdowns in the group
        DropdownToggle.closeAllInGroup(this.options.group, this);
      } else if (this.options.groupMode === 'single-await') {
        // Close all other dropdowns in the group (wait for them to close)
        await DropdownToggle.closeAllInGroup(this.options.group, this);
      }
    }

    this.state.isOpen = true;
    this.addClasses(this.button, this.options.openClass);
    this.setAria(true);
    this.setButtonLabel(this.options.closeLabel);

    if (this.options.group) {
      this.dispatchGroupChangeEvent(this.options.group);
    }

    return this.animate(instant);
  }

  async close(instant = false) {
    if (this.state.isAnimating) return Promise.resolve();

    this.state.isOpen = false;
    this.removeClasses(this.button, this.options.openClass);
    this.setAria(false);
    this.setButtonLabel(this.options.openLabel);

    if (this.options.group) {
      this.dispatchGroupChangeEvent(this.options.group);
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
      ? this.options.openOptions.tween?.(this.dropdownItem)
      : this.options.closeOptions.tween?.(this.dropdownItem);

    return new Promise<void>((resolve) => {
      if (this.isOpen()) {
        this.options.onOpenStart?.(this.dropdownItem);
      } else {
        this.options.onCloseStart?.(this.dropdownItem);
      }

      this.state.isAnimating = true;

      if (instant) {
        tween.progress(1);
        this.state.isAnimating = false;
        if (this.isOpen()) {
          this.options.onOpenEnd?.(this.dropdownItem);
        } else {
          this.options.onCloseEnd?.(this.dropdownItem);
        }
        resolve();
      } else {
        const originalOnComplete = tween.vars.onComplete;
        tween.eventCallback('onComplete', () => {
          if (originalOnComplete) originalOnComplete();
          this.state.isAnimating = false;
          if (this.isOpen()) {
            this.options.onOpenEnd?.(this.dropdownItem);
          } else {
            this.options.onCloseEnd?.(this.dropdownItem);
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
        duration: this.options.openOptions.duration,
        ease: this.options.openOptions.ease
      });
  }

  defaultCloseTween(element: HTMLElement) {
    return gsap.to(element, {
      height: 0,
      duration: this.options.closeOptions.duration,
      ease: this.options.closeOptions.ease,
      onComplete: () => {
        gsap.set(element, { display: 'none' });
      }
    });
  }

  setAria(expanded: boolean) {
    this.button.setAttribute('aria-expanded', String(expanded));
    this.dropdownItem.setAttribute('aria-hidden', String(!expanded));
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

    if (this.options.closeOnEsc) {
      document.addEventListener('keydown', this.onEscKeyPress);
    }

    if (this.options.closeOnOutsideClick) {
      document.addEventListener('click', this.onClickOutside);
    }

    if (this.options.closeOnFocusLeave) {
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

    const isClickInside = this.dropdownItem.contains(e.target as Node) || this.button.contains(e.target as Node);
    if (!isClickInside) {
      this.close();
    }
  }

  onFocusLeaveHandler(e: KeyboardEvent) {
    if (e.key !== 'Tab') return;
    if (!this.isOpen()) return;

    const isFocusInside = this.dropdownItem.contains(e.target as Node);

    if (!isFocusInside) {
      this.close();
    }
  }

  destroy() {
    this.resetState();
    this.removeEventListeners();
    this.removeInstanceFromGroup();
    this.options.onDestroy?.(this.dropdownItem);
  }

  resetState() {
    gsap.killTweensOf(this.dropdownItem);
    this.button.removeAttribute('aria-expanded');
    if (this.options.openClass) {
      this.removeClasses(this.button, this.options.openClass);
    }
    if (this.options.openLabel) {
      this.setButtonLabel(this.options.openLabel);
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
    DropdownToggle.groupInstances[this.options.group] = DropdownToggle.groupInstances[this.options.group] || [];

    // Add this instance to the group
    DropdownToggle.groupInstances[this.options.group].push(this);
  }

  removeInstanceFromGroup() {
    // Check if this instance belongs to a group and that the group exists
    if (this.options.group && DropdownToggle.groupInstances[this.options.group]) {
      // Find the index of this instance in its group
      const index = DropdownToggle.groupInstances[this.options.group].indexOf(this);
      // If found, remove this instance from the group
      if (index > -1) {
        DropdownToggle.groupInstances[this.options.group].splice(index, 1);
      }
      // If the group is now empty, delete it from `groupInstances`
      if (DropdownToggle.groupInstances[this.options.group].length === 0) {
        delete DropdownToggle.groupInstances[this.options.group];
      }
    }
  }

  shouldOpenOnLoad() {
    const isExpandedInMarkup = this.button.getAttribute('aria-expanded') === 'true';
    const instanceShouldOpenOnLoad = isExpandedInMarkup || this.options.openOnLoad;
    return instanceShouldOpenOnLoad;
  }

  init() {
    // Set the initial state on load
    if (this.shouldOpenOnLoad()) {
      this.open(true);
    }

    // Add the instance to its group if specified
    if (this.options.group) {
      this.addInstanceToGroup();
    }

    this.addEventListeners();
  }
}

export { DropdownToggle };
