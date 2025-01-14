var m = Object.defineProperty;
var O = (r, t, e) => t in r ? m(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e;
var o = (r, t, e) => O(r, typeof t != "symbol" ? t + "" : t, e);
import h from "gsap";
const s = class s {
  constructor(t, e = {}) {
    o(this, "animationDuration", this.prefersReducedMotion() ? s.DURATION_REDUCED_MOTION : s.DEFAULT_DURATION);
    this.bindThisToMemberFunctions(), this.state = {
      isOpen: !1,
      isAnimating: !1
    }, this.button = typeof t == "string" ? document.querySelector(t) : t, this.buttonLabelEl = typeof e.buttonLabelEl == "string" ? this.button.querySelector(e.buttonLabelEl) : e.buttonLabelEl, this.dropdownId = this.button.getAttribute("aria-controls"), this.dropdownItem = document.getElementById(this.dropdownId), this.openLabel = e.openLabel || "Open", this.closeLabel = e.closeLabel || "Close", this.openClass = e.openClass, this.openOnLoad = !!e.openOnLoad, this.closeOnEsc = !!e.closeOnEsc, this.closeOnOutsideClick = !!e.closeOnOutsideClick, this.onOpenStart = e.onOpenStart, this.onOpenEnd = e.onOpenEnd, this.onCloseStart = e.onCloseStart, this.onCloseEnd = e.onCloseEnd, this.onDestroy = e.onDestroy, this.onFocusLeave = e.onFocusLeave, this.openOptions = {
      duration: e.openDuration || this.animationDuration,
      ease: e.openEase || s.DEFAULT_EASE
    }, this.closeOptions = {
      duration: e.closeDuration || this.animationDuration,
      ease: e.closeEase || s.DEFAULT_EASE
    }, this.group = e.group || null, this.init();
  }
  /**
   * Binds instance to member functions to preserve the `this` context.
   */
  bindThisToMemberFunctions() {
    Object.getOwnPropertyNames(Object.getPrototypeOf(this)).forEach((e) => {
      typeof this[e] == "function" && (this[e] = this[e].bind(this));
    });
  }
  /**
   * Toggles the open/close state of the dropdown.
   */
  async toggle() {
    if (this.state.isAnimating) return Promise.resolve();
    await this.closeAllInGroup(this.group, this), this.isOpen() ? await this.close() : await this.open();
  }
  /**
   * Closes all dropdowns in the specified group except for the current instance.
   * @param {string} group - The name of the group.
   * @param {DropdownToggle} currentInstance - The current instance of the dropdown to exclude.
   */
  async closeAllInGroup(t, e) {
    const a = (s.groupInstances[t] || []).filter((n) => n !== e && n.isOpen()).map((n) => n.close());
    await Promise.all(a);
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
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  /**
   * Opens the dropdown.
   * @returns {Promise} A promise that resolves when the animation is complete.
   */
  open(t = !1) {
    return this.state.isOpen = !0, this.addClasses(this.button, this.openClass), this.setAria(!0), this.setButtonLabel(this.closeLabel), this.animate(t);
  }
  /**
   * Closes the dropdown.
   * @returns {Promise} A promise that resolves when the animation is complete.
   */
  close(t = !1) {
    return this.state.isOpen = !1, this.removeClasses(this.button, this.openClass), this.setAria(!1), this.setButtonLabel(this.openLabel), this.animate(t);
  }
  /**
   * Animates the opening or closing of the dropdown.
   * @param {boolean} open - Indicates if the dropdown is being opened or closed.
   * @param {boolean} instant - Indicates if the animation should be instant.
   * @returns {Promise} A promise that resolves when the animation is complete.
   */
  animate(t = !1) {
    const e = this.isOpen() ? this.defaultOpenTween(this.dropdownItem, t) : this.defaultCloseTween(this.dropdownItem, t);
    return new Promise((i) => {
      var a, n, d, u;
      this.isOpen() ? ((a = this.onOpenStart) == null || a.call(this, this.dropdownItem), this.onFocusLeave && document.addEventListener("keyup", this.onFocusLeaveHandler)) : ((n = this.onCloseStart) == null || n.call(this, this.dropdownItem), this.onFocusLeave && document.removeEventListener("keyup", this.onFocusLeaveHandler)), this.state.isAnimating = !0, t ? (this.state.isAnimating = !1, this.isOpen() ? (d = this.onOpenEnd) == null || d.call(this, this.dropdownItem) : (u = this.onCloseEnd) == null || u.call(this, this.dropdownItem), i()) : e.then(() => {
        var l, c;
        this.state.isAnimating = !1, this.isOpen() ? (l = this.onOpenEnd) == null || l.call(this, this.dropdownItem) : (c = this.onCloseEnd) == null || c.call(this, this.dropdownItem), i();
      });
    });
  }
  /**
   * The default opening tween animation.
   * @param {HTMLElement} element - The element to animate.
   * @param {boolean} instant - Indicates if the animation should be instant.
   */
  defaultOpenTween(t, e = !1) {
    return this.dropdownItem.style.display = "block", e ? h.set(t, { height: "auto" }) : h.fromTo(
      t,
      { height: 0 },
      { height: "auto", duration: this.openOptions.duration, ease: this.openOptions.ease }
    );
  }
  /**
   * The default closing tween animation.
   * @param {HTMLElement} element - The element to animate.
   * @param {boolean} instant - Indicates if the animation should be instant.
   */
  defaultCloseTween(t, e = !1) {
    return e ? h.set(t, { height: 0, onComplete: () => {
      this.dropdownItem.style.display = "none";
    } }) : h.to(t, {
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
  setAria(t) {
    this.button.setAttribute("aria-expanded", t), this.dropdownItem.setAttribute("aria-hidden", !t);
  }
  /*
  * Add a class (or multiple) to an element.
  */
  addClasses(t, e) {
    if (!t || !e) return;
    const i = e.split(" ");
    t.classList.add(...i);
  }
  /*
  * Removes the class (or multiple) of an element.
  */
  removeClasses(t, e) {
    if (!t || !e) return;
    const i = e.split(" ");
    t.classList.remove(...i);
  }
  /**
   * Sets the label of the dropdown button.
   * @param {string} label - The string to use for the button's label
   */
  setButtonLabel(t) {
    !t || !this.buttonLabelEl || (this.buttonLabelEl.textContent = t);
  }
  /**
   * Adds event listeners for the dropdown toggle, including click, keydown, and outside click.
   */
  addEventListeners() {
    this.button.addEventListener("click", this.toggle), this.closeOnEsc && document.addEventListener("keydown", this.onEscKeyPress), this.closeOnOutsideClick && document.addEventListener("click", this.onClickOutside);
  }
  /**
   * Handles the Escape key press to close the dropdown.
   * @param {KeyboardEvent} e - The keyboard event.
   */
  onEscKeyPress(t) {
    t.key === "Escape" && this.isOpen() && this.close();
  }
  /**
   * Handles clicks outside the dropdown to close it.
   * @param {MouseEvent} e - The mouse event.
   */
  onClickOutside(t) {
    if (!this.isOpen()) return;
    this.dropdownItem.contains(t.target) || this.button.contains(t.target) || this.close();
  }
  /**
   * Handles the focus leaving the dropdown to close it.
   * @param {KeyboardEvent} e - The keyboard event.
   */
  onFocusLeaveHandler(t) {
    if (t.key !== "Tab") return;
    this.dropdownItem.contains(t.target) || this.close();
  }
  destroy() {
    var t;
    this.resetState(), this.removeEventListeners(), this.removeFromGroup(), (t = this.onDestroy) == null || t.call(this, this.dropdownItem);
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
    this.button.removeEventListener("click", this.toggle), document.removeEventListener("keydown", this.onEscKeyPress), document.removeEventListener("click", this.onClickOutside);
  }
  /**
   * Removes the current instance from its associated group in `groupInstances`.
   * If this leaves the group empty, the group is also removed from `groupInstances` to clean up.
   * This method is part of the cleanup process to ensure proper teardown of dropdown instances,
   * preventing memory leaks and ensuring the global state remains accurate.
   */
  removeFromGroup() {
    if (this.group && s.groupInstances[this.group]) {
      const t = s.groupInstances[this.group].indexOf(this);
      t > -1 && s.groupInstances[this.group].splice(t, 1), s.groupInstances[this.group].length === 0 && delete s.groupInstances[this.group];
    }
  }
  /**
   * Checks if the dropdown should be open based on the markup and the openOnLoad option.
   * @returns {boolean} True if the dropdown should be open, false otherwise.
   */
  dropdownShouldBeOpen() {
    return this.button.getAttribute("aria-expanded") === "true" || this.openOnLoad;
  }
  /**
   * Initializes the dropdown toggle, setting its state and adding event listeners.
   */
  init() {
    this.dropdownShouldBeOpen() ? this.open(!0) : this.close(!0), this.group && (s.groupInstances[this.group] = s.groupInstances[this.group] || [], s.groupInstances[this.group].includes(this) || s.groupInstances[this.group].push(this)), this.addEventListeners();
  }
};
o(s, "DEFAULT_DURATION", 0.3), o(s, "DEFAULT_EASE", "power2.easeInOut"), o(s, "DURATION_REDUCED_MOTION", 1e-3), o(s, "groupInstances", {});
let p = s;
export {
  p as DropdownToggle
};
