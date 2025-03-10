var m = Object.defineProperty;
var O = (r, e, t) => e in r ? m(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t;
var a = (r, e, t) => O(r, typeof e != "symbol" ? e + "" : e, t);
import h from "gsap";
const s = class s {
  /**
   * Checks if the user prefers reduced motion animations.
   * @returns {boolean} True if reduced motion is preferred, false otherwise.
   */
  static prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  /**
   * Gets the appropriate animation duration based on user motion preferences.
   * @returns {number} The animation duration in seconds.
   */
  static getAnimationDuration() {
    return s.prefersReducedMotion() ? s.DURATION_REDUCED_MOTION : s.DURATION_DEFAULT;
  }
  /**
   * Checks if all dropdowns in the specified group are open.
   * @param {string} group - The name of the group.
   * @returns {boolean} True if all dropdowns in the group are open, false otherwise.
   */
  static isGroupAllOpen(e) {
    const t = s.groupInstances[e] || [];
    return t.length > 0 && t.every((i) => i.isOpen());
  }
  /**
   * Checks if all dropdowns in the specified group are closed.
   * @param {string} group - The name of the group.
   * @returns {boolean} True if all dropdowns in the group are closed, false otherwise.
   */
  static isGroupAllClosed(e) {
    const t = s.groupInstances[e] || [];
    if (t.length !== 0)
      return t.every((i) => !i.isOpen());
  }
  /**
   * Closes all dropdowns in the specified group except for the current instance.
   * @param {string} group - The name of the group.
   * @param {DropdownToggle} currentInstance - The current instance of the dropdown to exclude.
   */
  static async closeAllInGroup(e, t) {
    const n = (s.groupInstances[e] || []).filter((o) => o !== t && o.isOpen()).map((o) => o.close());
    await Promise.all(n);
  }
  /**
   * Opens all dropdowns in the specified group.
   * @param {string} group - The name of the group.
   */
  static async openAllInGroup(e) {
    const i = (s.groupInstances[e] || []).filter((n) => !n.isOpen()).map((n) => n.open(!1, !0));
    await Promise.all(i);
  }
  constructor(e, t = {}) {
    this.bindThisToMemberFunctions(), this.state = {
      isOpen: !1,
      isAnimating: !1
    }, this.button = typeof e == "string" ? document.querySelector(e) : e, this.buttonLabelEl = typeof t.buttonLabelEl == "string" ? this.button.querySelector(t.buttonLabelEl) : t.buttonLabelEl, this.dropdownId = this.button.getAttribute("aria-controls"), this.dropdownItem = document.getElementById(this.dropdownId), this.openLabel = t.openLabel || "Open", this.closeLabel = t.closeLabel || "Close", this.openClass = t.openClass, this.openOnLoad = !!t.openOnLoad, this.closeOnEsc = !!t.closeOnEsc, this.closeOnOutsideClick = !!t.closeOnOutsideClick, this.closeOnFocusLeave = t.closeOnFocusLeave, this.onOpenStart = t.onOpenStart, this.onOpenEnd = t.onOpenEnd, this.onCloseStart = t.onCloseStart, this.onCloseEnd = t.onCloseEnd, this.onDestroy = t.onDestroy, this.openOptions = {
      duration: t.openDuration || s.getAnimationDuration(),
      ease: t.openEase || s.EASE_DEFAULT
    }, this.closeOptions = {
      duration: t.closeDuration || s.getAnimationDuration(),
      ease: t.closeEase || s.EASE_DEFAULT
    }, this.group = t.group || null, this.groupMode = t.groupMode || "multiple", this.groupChangeEvent = (i) => new CustomEvent("DropdownToggle:group-change", {
      detail: {
        group: i,
        isAllOpen: s.isGroupAllOpen(i)
      }
    }), this.init();
  }
  /**
   * Binds instance to member functions to preserve the `this` context.
   */
  bindThisToMemberFunctions() {
    Object.getOwnPropertyNames(Object.getPrototypeOf(this)).forEach((t) => {
      typeof this[t] == "function" && (this[t] = this[t].bind(this));
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
  async open(e = !1, t = !1) {
    return this.state.isAnimating ? Promise.resolve() : (this.group && !t && (this.groupMode === "single" ? s.closeAllInGroup(this.group, this) : this.groupMode === "single-await" && await s.closeAllInGroup(this.group, this)), this.state.isOpen = !0, this.addClasses(this.button, this.openClass), this.setAria(!0), this.setButtonLabel(this.closeLabel), this.group && window.dispatchEvent(this.groupChangeEvent(this.group)), this.animate(e));
  }
  /**
   * Closes the dropdown directly.
   * @param {boolean} instant - If true, skips animation
   * @returns {Promise} A promise that resolves when the animation is complete
   */
  async close(e = !1) {
    return this.state.isAnimating ? Promise.resolve() : (this.state.isOpen = !1, this.removeClasses(this.button, this.openClass), this.setAria(!1), this.setButtonLabel(this.openLabel), this.group && window.dispatchEvent(this.groupChangeEvent(this.group)), this.animate(e));
  }
  /**
   * Toggles the dropdown's state while respecting group mode settings.
   * @returns {Promise} A promise that resolves when the animation is complete
   */
  async toggle() {
    if (this.state.isAnimating) return Promise.resolve();
    this.isOpen() ? await this.close() : await this.open();
  }
  /**
   * Animates the opening or closing of the dropdown.
   * @param {boolean} open - Indicates if the dropdown is being opened or closed.
   * @param {boolean} instant - Indicates if the animation should be instant.
   * @returns {Promise} A promise that resolves when the animation is complete.
   */
  animate(e = !1) {
    const t = this.isOpen() ? this.defaultOpenTween(this.dropdownItem, e) : this.defaultCloseTween(this.dropdownItem, e);
    return new Promise((i) => {
      var n, o, u, l;
      this.isOpen() ? (n = this.onOpenStart) == null || n.call(this, this.dropdownItem) : (o = this.onCloseStart) == null || o.call(this, this.dropdownItem), this.state.isAnimating = !0, e ? (this.state.isAnimating = !1, this.isOpen() ? (u = this.onOpenEnd) == null || u.call(this, this.dropdownItem) : (l = this.onCloseEnd) == null || l.call(this, this.dropdownItem), i()) : t.then(() => {
        var d, p;
        this.state.isAnimating = !1, this.isOpen() ? (d = this.onOpenEnd) == null || d.call(this, this.dropdownItem) : (p = this.onCloseEnd) == null || p.call(this, this.dropdownItem), i();
      });
    });
  }
  /**
   * The default opening tween animation.
   * @param {HTMLElement} element - The element to animate.
   * @param {boolean} instant - Indicates if the animation should be instant.
   */
  defaultOpenTween(e, t = !1) {
    return this.dropdownItem.style.display = "block", t ? h.set(e, { height: "auto" }) : h.fromTo(
      e,
      { height: 0 },
      { height: "auto", duration: this.openOptions.duration, ease: this.openOptions.ease }
    );
  }
  /**
   * The default closing tween animation.
   * @param {HTMLElement} element - The element to animate.
   * @param {boolean} instant - Indicates if the animation should be instant.
   */
  defaultCloseTween(e, t = !1) {
    return t ? h.set(e, { height: 0, onComplete: () => {
      this.dropdownItem.style.display = "none";
    } }) : h.to(e, {
      height: 0,
      duration: this.closeOptions.duration,
      ease: this.closeOptions.ease,
      onComplete: () => {
        this.dropdownItem.style.display = "none";
      }
    });
  }
  /**
   * Sets the ARIA attributes for the button and dropdown item.
   * @param {boolean} expanded - Indicates whether the dropdown is expanded or not.
   */
  setAria(e) {
    this.button.setAttribute("aria-expanded", e), this.dropdownItem.setAttribute("aria-hidden", !e);
  }
  /*
  * Add a class (or multiple) to an element.
  */
  addClasses(e, t) {
    if (!e || !t) return;
    const i = t.split(" ");
    e.classList.add(...i);
  }
  /*
  * Removes the class (or multiple) of an element.
  */
  removeClasses(e, t) {
    if (!e || !t) return;
    const i = t.split(" ");
    e.classList.remove(...i);
  }
  /**
   * Sets the label of the dropdown button.
   * @param {string} label - The string to use for the button's label
   */
  setButtonLabel(e) {
    !e || !this.buttonLabelEl || (this.buttonLabelEl.textContent = e);
  }
  /**
   * Adds event listeners for the dropdown toggle, including click, keydown, and outside click.
   */
  addEventListeners() {
    this.button.addEventListener("click", this.toggle), this.closeOnEsc && document.addEventListener("keydown", this.onEscKeyPress), this.closeOnOutsideClick && document.addEventListener("click", this.onClickOutside), this.closeOnFocusLeave && document.addEventListener("keyup", this.onFocusLeaveHandler);
  }
  /**
   * Handles the Escape key press to close the dropdown.
   * @param {KeyboardEvent} e - The keyboard event.
   */
  onEscKeyPress(e) {
    e.key === "Escape" && this.isOpen() && this.close();
  }
  /**
   * Handles clicks outside the dropdown to close it.
   * @param {MouseEvent} e - The mouse event.
   */
  onClickOutside(e) {
    if (!this.isOpen()) return;
    this.dropdownItem.contains(e.target) || this.button.contains(e.target) || this.close();
  }
  /**
   * Handles the focus leaving the dropdown to close it.
   * @param {KeyboardEvent} e - The keyboard event.
   */
  onFocusLeaveHandler(e) {
    if (e.key !== "Tab") return;
    this.dropdownItem.contains(e.target) || this.close();
  }
  destroy() {
    var e;
    this.resetState(), this.removeEventListeners(), this.removeInstanceFromGroup(), (e = this.onDestroy) == null || e.call(this, this.dropdownItem);
  }
  /**
  * Resets the visual and ARIA state of the dropdown to its initial state. This method is typically
  * called as part of the component teardown process to ensure the component is cleanly reset.
  */
  resetState() {
    this.button.removeAttribute("aria-expanded"), this.openClass && this.removeClasses(this.button, this.openClass), this.openLabel && this.setButtonLabel(this.openLabel), this.dropdownItem.removeAttribute("aria-hidden"), this.dropdownItem.removeAttribute("style");
  }
  /**
  * Removes all event listeners added by the dropdown instance. This method is crucial for preventing
  * memory leaks and ensuring that event handlers do not trigger after the component has been destroyed.
  */
  removeEventListeners() {
    this.button.removeEventListener("click", this.toggle), document.removeEventListener("keydown", this.onEscKeyPress), document.removeEventListener("click", this.onClickOutside), document.removeEventListener("keyup", this.onFocusLeaveHandler);
  }
  /**
   * Adds this instance to its specified group in the static groupInstances.
   * Creates the group array if it doesn't exist.
   */
  addInstanceToGroup() {
    s.groupInstances[this.group] = s.groupInstances[this.group] || [], s.groupInstances[this.group].push(this);
  }
  /**
   * Removes the current instance from its associated group in `groupInstances`.
   * If this leaves the group empty, the group is also removed from `groupInstances` to clean up.
   */
  removeInstanceFromGroup() {
    if (this.group && s.groupInstances[this.group]) {
      const e = s.groupInstances[this.group].indexOf(this);
      e > -1 && s.groupInstances[this.group].splice(e, 1), s.groupInstances[this.group].length === 0 && delete s.groupInstances[this.group];
    }
  }
  /**
   * Checks if the dropdown should be open based on the markup and the openOnLoad option.
   * @returns {boolean} True if the dropdown should be open, false otherwise.
   */
  shouldOpenOnLoad() {
    return this.button.getAttribute("aria-expanded") === "true" || this.openOnLoad;
  }
  /**
   * Initializes the dropdown toggle, setting its state and adding event listeners.
   */
  init() {
    this.shouldOpenOnLoad() ? this.open(!0) : this.close(!0), this.group && this.addInstanceToGroup(), this.addEventListeners();
  }
};
a(s, "DURATION_DEFAULT", 0.3), a(s, "DURATION_REDUCED_MOTION", 1e-3), a(s, "EASE_DEFAULT", "power2.easeInOut"), a(s, "groupInstances", {});
let c = s;
export {
  c as DropdownToggle
};
