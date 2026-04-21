import { gsap } from 'gsap';
import { deepMerge } from './utils/deepMerge';

/**
 * Detail of the group change event that is emitted
 * when a dropdown in a group is opened or closed.
 */
type GroupChangeEventDetail = {
  group: string
  /**
   * Whether all dropdowns in the group are open.
   */
  isAllOpen: boolean
};

type AnimationOptions = {
  /**
   * Duration of the animation in seconds.
   */
  duration: number
  ease: string
};

/**
 * Group mode determines how the dropdowns function in a group
 * - single: only one dropdown can be open at a time
 * - multiple: all dropdowns can be open at the same time
 * - single-await: only one dropdown can be open at a time, and the next dropdown will wait for the current one to close
 */
type GroupMode = 'single' | 'multiple' | 'single-await';

/**
 * Options that are considered "public" and can
 * be passed to the constructor.
 */
type DropdownOptions = {
  /**
   * The element to set for the label when the dropdown is open.
   * This can be a valid CSS selector or an element.
   */
  buttonLabelEl?: HTMLElement | string
  /**
   * The text to set for the label when the dropdown is closed.
   */
  openLabel?: string

  /**
   * The text to set for the label when the dropdown is open.
   */
  closeLabel?: string

  /**
   * A space-separated list of classes to add to the button when the dropdown is open.
   */
  openClass?: string
  openOnLoad?: boolean
  closeOnEsc?: boolean
  closeOnOutsideClick?: boolean
  closeOnFocusLeave?: boolean
  openTween?: (dropdownItem: HTMLElement) => gsap.core.Timeline | gsap.core.Tween
  closeTween?: (dropdownItem: HTMLElement) => gsap.core.Timeline | gsap.core.Tween
  onOpenStart?: (dropdownItem: HTMLElement) => void
  onOpenEnd?: (dropdownItem: HTMLElement) => void
  onCloseStart?: (dropdownItem: HTMLElement) => void
  onCloseEnd?: (dropdownItem: HTMLElement) => void
  onDestroy?: (dropdownItem: HTMLElement) => void
  /**
   * Options for the open animation.
   *
   * These are ignored if a custom tween is provided.
   */
  openOptions?: AnimationOptions,
  /**
   * Options for the close animation.
   *
   * These are ignored if a custom tween is provided.
   */
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
  openOptions: AnimationOptions
  closeOptions: AnimationOptions
  openTween: (dropdownItem: HTMLElement) => gsap.core.Timeline | gsap.core.Tween
  closeTween: (dropdownItem: HTMLElement) => gsap.core.Timeline | gsap.core.Tween
  onOpenStart?: (dropdownItem: HTMLElement) => void
  onOpenEnd?: (dropdownItem: HTMLElement) => void
  onCloseStart?: (dropdownItem: HTMLElement) => void
  onCloseEnd?: (dropdownItem: HTMLElement) => void
  onDestroy?: (dropdownItem: HTMLElement) => void
};
class DropdownToggle {
  /**
   * The default animation duration in seconds.
   *
   * Note: this will not apply if a custom animation is provided.
   */
  static DURATION_DEFAULT = 0.3;

  /**
   * The animation duration to use if a user has reduced motion enabled, in seconds.
   *
   * Note: this will not apply if a custom animation is provided.
   *
   */
  static DURATION_REDUCED_MOTION = 0.001;

  /**
   * The event that is emitted when a dropdown in a group is opened or closed.
   *
   * @event
   * @example
   * ```ts
   * const dropdown = new DropdownToggle(button, {
   *   group: 'group-1',
   * });
   *
   * window.addEventListener('DropdownToggle:group-change', (event: CustomEvent<GroupChangeEventDetail>) => {
   *   console.log(event.detail);
   * });
   * ```
   */
  readonly GROUP_CHANGE_EVENT_NAME = 'DropdownToggle:group-change';

  /**
   * The default animation ease.
   *
   * See GSAP documentation for available easings: {@link https://gsap.com/docs/v3/Eases/}
   *
   * Note: this will not apply if a custom animation is provided.
   */
  static EASE_DEFAULT = 'power2.easeInOut';

  private static prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  private static getAnimationDuration() {
    return DropdownToggle.prefersReducedMotion()
      ? DropdownToggle.DURATION_REDUCED_MOTION
      : DropdownToggle.DURATION_DEFAULT;
  }

  private static groupInstances: Record<string, DropdownToggle[]> = {};

  /**
   * Checks if all dropdowns in a given group are open.
   */
  static isGroupAllOpen(group: string) {
    const members = DropdownToggle.groupInstances[group] || [];
    return members.length > 0 && members.every(instance => instance.isOpen());
  }

  /**
   * Checks if all dropdowns in a given group are closed.
   */
  static isGroupAllClosed(group: string) {
    const members = DropdownToggle.groupInstances[group] || [];
    return members.length > 0 && members.every(instance => !instance.isOpen());
  }

  static async closeAllInGroup(group: string, currentInstance?: DropdownToggle) {
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

  private static isGroupAnimating(group: string) {
    const members = DropdownToggle.groupInstances[group] || [];
    return members.some(instance => instance.isAnimating());
  }

  private button: HTMLElement;
  private buttonLabelEl?: HTMLElement;
  private dropdownId: string;
  private dropdownItem: HTMLElement;

  private state = {
    isOpen: false,
    isAnimating: false,
  };

  private options: InternalOptions = {
    openLabel: 'Open',
    closeLabel: 'Close',
    openClass: 'open',
    openOnLoad: false,
    closeOnEsc: false,
    /**
     * Whether to close the dropdown when clicking outside of the dropdown, or the button
     * used to toggle the dropdown. This is not supported in group mode, as the two
     * behaviours conflict.
     */
    closeOnOutsideClick: false,
    closeOnFocusLeave: false,
    group: '',
    groupMode: 'multiple',
    openTween: this.defaultOpenTween.bind(this),
    closeTween: this.defaultCloseTween.bind(this),
    openOptions: {
      duration: DropdownToggle.getAnimationDuration(),
      ease: DropdownToggle.EASE_DEFAULT,
    },
    closeOptions: {
      duration: DropdownToggle.getAnimationDuration(),
      ease: DropdownToggle.EASE_DEFAULT,
    },
  };

  constructor(button: HTMLElement | string, options?: DropdownOptions) {
    this.bindThisToMemberFunctions();

    if (options) {
      this.options = deepMerge(this.options, options);
    }

    this.button = this.resolveButton(button);
    this.buttonLabelEl = this.resolveButtonLabel(options?.buttonLabelEl);
    this.dropdownId = this.resolveDropdownId();
    this.dropdownItem = this.resolveDropdownElement();

    if (this.shouldOpenOnLoad()) {
      void this.open(true);
    }

    if (this.options.group) {
      this.addInstanceToGroup();
    }

    this.addEventListeners();
  }

  private resolveButton(button: HTMLElement | string) {
    if (typeof button === 'string') {
      const btn = document.querySelector<HTMLElement>(button);
      if (!btn) {
        throw new Error(`Button element not found: ${button}`);
      }
      return btn;
    } else {
      return button;
    }
  }

  private resolveButtonLabel(buttonLabelEl: HTMLElement | string | undefined) {
    if (!buttonLabelEl) return;

    if (typeof buttonLabelEl === 'string') {
      const labelEl = this.button.querySelector<HTMLElement>(buttonLabelEl);
      if (!labelEl) {
        throw new Error(`Button label element not found: ${buttonLabelEl}`);
      }
      return labelEl;
    } else {
      return buttonLabelEl;
    }
  }

  private resolveDropdownId() {
    const id = this.button.getAttribute('aria-controls')?.trim();
    if (!id) {
      throw new Error('Button must have an aria-controls attribute pointing to the dropdown id');
    }
    return id;
  }

  private resolveDropdownElement() {
    const el = document.getElementById(this.dropdownId);
    if (!el) {
      throw new Error(`Dropdown element not found: #${this.dropdownId}`);
    }
    return el;
  }

  private dispatchGroupChangeEvent(group: string) {
    const event = new CustomEvent<GroupChangeEventDetail>(this.GROUP_CHANGE_EVENT_NAME, {
      detail: {
        group,
        isAllOpen: DropdownToggle.isGroupAllOpen(group)
      }
    });
    window.dispatchEvent(event);
  }

  private bindThisToMemberFunctions() {
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

  private animate(instant = false) {
    const tween = this.isOpen()
      ? this.options.openTween(this.dropdownItem)
      : this.options.closeTween(this.dropdownItem);

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

  private defaultOpenTween(dropdownItem: HTMLElement) {
    // First make visible but collapsed
    return gsap.timeline()
      .set(dropdownItem, { display: 'block', height: 0 })
      .to(dropdownItem, {
        height: 'auto',
        duration: this.options.openOptions.duration,
        ease: this.options.openOptions.ease
      });
  }

  private defaultCloseTween(dropdownItem: HTMLElement) {
    return gsap.to(dropdownItem, {
      height: 0,
      duration: this.options.closeOptions.duration,
      ease: this.options.closeOptions.ease,
      onComplete: () => {
        gsap.set(dropdownItem, { display: 'none' });
      }
    });
  }

  private setAria(expanded: boolean) {
    this.button.setAttribute('aria-expanded', String(expanded));
    this.dropdownItem.setAttribute('aria-hidden', String(!expanded));
  }

  private addClasses(el: HTMLElement, classes: string) {
    if (!el || !classes) return;
    const classesArray = classes.split(' ');
    el.classList.add(...classesArray);
  }

  private removeClasses(el: HTMLElement, classes: string) {
    if (!el || !classes) return;
    const classesArray = classes.split(' ');
    el.classList.remove(...classesArray);
  }

  private setButtonLabel(label: string) {
    if (!label || !this.buttonLabelEl) return;

    this.buttonLabelEl.textContent = label;
  }

  private addEventListeners() {
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

  private onEscKeyPress(e: KeyboardEvent) {
    if (e.key === 'Escape' && this.isOpen()) {
      this.close();
    }
  }

  private onClickOutside(e: Event) {
    if (!this.isOpen()) return;

    if (this.options.group) {
      console.warn('closeOnOutsideClick is not supported in a group');
      return;
    }

    const isClickInside = this.dropdownItem.contains(e.target as Node) || this.button.contains(e.target as Node);
    if (!isClickInside) {
      this.close();
    }
  }

  private onFocusLeaveHandler(e: KeyboardEvent) {
    if (e.key !== 'Tab') return;
    if (!this.isOpen()) return;

    const isFocusInside = this.dropdownItem.contains(e.target as Node);

    if (!isFocusInside) {
      this.close();
    }
  }

  /**
   * Destroys the dropdown instance.
   *
   * This will:
   * - Remove all event listeners
   * - Immediately stop any animation on the dropdown item
   * - Reset the markup to its initial state
   * - Remove the instance from its group
   * - Call the `onDestroy` callback
   *
   * Note: if you are using a custom animation, you may need to run additional cleanup code.
   * This can be done by passing a custom `onDestroy` callback to the constructor.
   */
  destroy() {
    this.resetState();
    this.removeEventListeners();
    this.removeInstanceFromGroup();
    this.options.onDestroy?.(this.dropdownItem);
  }

  private resetState() {
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

  private removeEventListeners() {
    this.button.removeEventListener('click', this.toggle);
    document.removeEventListener('keydown', this.onEscKeyPress);
    document.removeEventListener('click', this.onClickOutside);
    document.removeEventListener('keyup', this.onFocusLeaveHandler);
  }

  private addInstanceToGroup() {
    // Ensure the group array exists for this.group
    DropdownToggle.groupInstances[this.options.group] = DropdownToggle.groupInstances[this.options.group] || [];

    // Only add this instance to the group if it is not already in it
    if (!DropdownToggle.groupInstances[this.options.group].includes(this)) {
      DropdownToggle.groupInstances[this.options.group].push(this);
    }
  }

  private removeInstanceFromGroup() {
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

  private shouldOpenOnLoad() {
    const isExpandedInMarkup = this.button.getAttribute('aria-expanded') === 'true';
    const instanceShouldOpenOnLoad = isExpandedInMarkup || this.options.openOnLoad;
    return instanceShouldOpenOnLoad;
  }
}

export {
  DropdownToggle,
  type DropdownOptions,
  type AnimationOptions,
  type GroupMode,
  type GroupChangeEventDetail
};
