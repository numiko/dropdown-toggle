var O = Object.defineProperty;
var g = (o, t, e) => t in o ? O(o, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : o[t] = e;
var l = (o, t, e) => (g(o, typeof t != "symbol" ? t + "" : t, e), e);
import u from "gsap";
const d = 0.3, c = "power2.easeInOut", p = 1e-3, s = class s {
  constructor(t, e = {}) {
    this.bindThisToMemberFunctions(), this.state = {
      isOpen: !1,
      isAnimating: !1
    }, this.button = typeof t == "string" ? document.querySelector(t) : t, this.buttonLabelEl = typeof e.buttonLabelEl == "string" ? this.button.querySelector(e.buttonLabelEl) : e.buttonLabelEl, this.dropdownId = this.button.getAttribute("aria-controls"), this.dropdownItem = document.getElementById(this.dropdownId), this.openLabel = e.openLabel || "Open", this.closeLabel = e.closeLabel || "Close", this.openClass = e.openClass, this.openOnLoad = !!e.openOnLoad, this.closeOnEsc = !!e.closeOnEsc, this.closeOnOutsideClick = !!e.closeOnOutsideClick, this.onOpenStart = e.onOpenStart, this.onOpenEnd = e.onOpenEnd, this.onCloseStart = e.onCloseStart, this.onCloseEnd = e.onCloseEnd, this.openOptions = {
      duration: e.openDuration || d,
      ease: e.openEase || c
    }, this.closeOptions = {
      duration: e.closeDuration || d,
      ease: e.closeEase || c
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
    this.state.isAnimating || (await this.closeAllInGroup(this.group, this), this.isOpen() ? await this.close() : await this.open());
  }
  /**
   * Closes all dropdowns in the specified group except for the current instance.
   * @param {string} group - The name of the group.
   * @param {DropdownToggle} currentInstance - The current instance of the dropdown to exclude.
   */
  async closeAllInGroup(t, e) {
    const r = (s.groupInstances[t] || []).filter((i) => i !== e && i.isOpen()).map((i) => i.close());
    await Promise.all(r);
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
   * @param {Object} [options=this.openOptions] - The options for the animation.
   * @returns {Promise} A promise that resolves when the animation is complete.
   */
  open(t = this.openOptions) {
    return this.state.isOpen ? Promise.resolve() : (this.addClasses(this.button, this.openClass), this.setAria(!0), this.setButtonLabel(), this.animate(!0, t));
  }
  /**
   * Closes the dropdown.
   * @param {Object} [options=this.closeOptions] - The options for the animation.
   * @returns {Promise} A promise that resolves when the animation is complete.
   */
  close(t = this.closeOptions) {
    return this.state.isOpen ? (this.removeClasses(this.button, this.openClass), this.setAria(!1), this.setButtonLabel(), this.animate(!1, t)) : Promise.resolve();
  }
  /**
   * Animates the opening or closing of the dropdown.
   * @param {boolean} opening - Indicates if the dropdown is being opened or closed.
   * @param {Object} options - The options for the animation, including duration and ease.
   * @returns {Promise} A promise that resolves when the animation is complete.
   */
  animate(t) {
    const e = t ? this.defaultOpenTween(this.dropdownItem) : this.defaultCloseTween(this.dropdownItem);
    return new Promise((n) => {
      var r, i;
      t ? (r = this.onOpenStart) == null || r.call(this, this.dropdownItem) : (i = this.onCloseStart) == null || i.call(this, this.dropdownItem), this.state.isAnimating = !0, this.state.isOpen = t, e.then(() => {
        var a, h;
        this.state.isAnimating = !1, t ? (a = this.onOpenEnd) == null || a.call(this, this.dropdownItem) : (h = this.onCloseEnd) == null || h.call(this, this.dropdownItem), n();
      });
    });
  }
  /**
   * The default opening tween animation.
   * @param {HTMLElement} element - The element to animate.
   * @param {Object} options - Animation options including duration, ease, and onComplete callback.
   */
  defaultOpenTween(t) {
    return this.dropdownItem.style.display = "block", u.fromTo(
      t,
      {
        height: 0
      },
      {
        height: "auto",
        duration: this.prefersReducedMotion() ? p : this.closeOptions.duration,
        ease: this.openOptions.ease
      }
    );
  }
  /**
   * The default closing tween animation.
   * @param {HTMLElement} element - The element to animate.
   * @param {Object} options - Animation options including duration, ease, and onComplete callback.
   */
  defaultCloseTween(t) {
    return u.to(t, {
      height: 0,
      duration: this.prefersReducedMotion() ? p : this.closeOptions.duration,
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
    if (!t || !e)
      return;
    const n = e.split(" ");
    t.classList.add(...n);
  }
  /*
  * Removes the class (or multiple) of an element.
  */
  removeClasses(t, e) {
    if (!t || !e)
      return;
    const n = e.split(" ");
    t.classList.remove(...n);
  }
  /**
   * Sets the label of the button based on the dropdown's state.
   */
  setButtonLabel() {
    this.buttonLabelEl && (this.buttonLabelEl.textContent = this.isOpen() ? this.closeLabel : this.openLabel);
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
    if (!this.isOpen())
      return;
    this.dropdownItem.contains(t.target) || this.button.contains(t.target) || this.close();
  }
  destroy() {
    this.resetState(), this.removeEventListeners(), this.removeFromGroup();
  }
  /**
  * Resets the visual and ARIA state of the dropdown to its initial state. This method is typically
  * called as part of the component teardown process to ensure the component is cleanly reset.
  */
  resetState() {
    this.button.removeAttribute("aria-expanded"), this.openClass && this.removeClasses(this.button, this.openClass), this.dropdownItem.removeAttribute("aria-hidden"), this.dropdownItem.removeAttribute("style");
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
   * Initializes the dropdown toggle, setting its state and adding event listeners.
   */
  init() {
    this.openOnLoad && this.open({}, !0), this.group && (s.groupInstances[this.group] = s.groupInstances[this.group] || [], s.groupInstances[this.group].includes(this) || s.groupInstances[this.group].push(this)), this.addEventListeners();
  }
};
l(s, "groupInstances", {});
let m = s;
export {
  m as DropdownToggle
};
