import { gsap as a } from "gsap";
function A(r, t) {
  const e = { ...r };
  for (const s in t)
    Object.prototype.hasOwnProperty.call(t, s) && (t[s] !== null && typeof t[s] == "object" && typeof r[s] == "object" && r[s] !== null && !Array.isArray(t[s]) && !Array.isArray(r[s]) && typeof t[s] != "function" && typeof r[s] != "function" ? e[s] = A(r[s], t[s]) : e[s] = t[s]);
  return e;
}
const i = class i {
  constructor(t, e) {
    this.GROUP_CHANGE_EVENT_NAME = "DropdownToggle:group-change", this.state = {
      isOpen: !1,
      isAnimating: !1
    }, this.options = {
      openLabel: "Open",
      closeLabel: "Close",
      openClass: "open",
      openOnLoad: !1,
      closeOnEsc: !1,
      /**
       * Whether to close the dropdown when clicking outside of the dropdown, or the button
       * used to toggle the dropdown. This is not supported in group mode, as the two
       * behaviours conflict.
       */
      closeOnOutsideClick: !1,
      closeOnFocusLeave: !1,
      group: "",
      groupMode: "multiple",
      openTween: this.defaultOpenTween.bind(this),
      closeTween: this.defaultCloseTween.bind(this),
      openOptions: {
        duration: i.getAnimationDuration(),
        ease: i.EASE_DEFAULT
      },
      closeOptions: {
        duration: i.getAnimationDuration(),
        ease: i.EASE_DEFAULT
      }
    }, this.bindThisToMemberFunctions(), e && (this.options = A(this.options, e)), this.button = this.resolveButton(t), this.buttonLabelEl = this.resolveButtonLabel(e == null ? void 0 : e.buttonLabelEl), this.dropdownId = this.resolveDropdownId(), this.dropdownItem = this.resolveDropdownElement(), this.init();
  }
  static prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  static getAnimationDuration() {
    return i.prefersReducedMotion() ? i.DURATION_REDUCED_MOTION : i.DURATION_DEFAULT;
  }
  /**
   * Checks if all dropdowns in a given group are open.
   */
  static isGroupAllOpen(t) {
    const e = i.groupInstances[t] || [];
    return e.length > 0 && e.every((s) => s.isOpen());
  }
  /**
   * Checks if all dropdowns in a given group are closed.
   */
  static isGroupAllClosed(t) {
    const e = i.groupInstances[t] || [];
    return e.length > 0 && e.every((s) => !s.isOpen());
  }
  static async closeAllInGroup(t, e) {
    const n = (i.groupInstances[t] || []).filter((o) => o !== e && o.isOpen()).map((o) => o.close());
    await Promise.all(n);
  }
  static async openAllInGroup(t) {
    const s = (i.groupInstances[t] || []).filter((n) => !n.isOpen()).map((n) => n.open(!1, !0));
    await Promise.all(s);
  }
  static isGroupAnimating(t) {
    return (i.groupInstances[t] || []).some((s) => s.isAnimating());
  }
  resolveButton(t) {
    if (typeof t == "string") {
      const e = document.querySelector(t);
      if (!e)
        throw new Error(`Button element not found: ${t}`);
      return e;
    } else
      return t;
  }
  resolveButtonLabel(t) {
    if (t)
      if (typeof t == "string") {
        const e = this.button.querySelector(t);
        if (!e)
          throw new Error(`Button label element not found: ${t}`);
        return e;
      } else
        return t;
  }
  resolveDropdownId() {
    var e;
    const t = (e = this.button.getAttribute("aria-controls")) == null ? void 0 : e.trim();
    if (!t)
      throw new Error("Button must have an aria-controls attribute pointing to the dropdown id");
    return t;
  }
  resolveDropdownElement() {
    const t = document.getElementById(this.dropdownId);
    if (!t)
      throw new Error(`Dropdown element not found: #${this.dropdownId}`);
    return t;
  }
  dispatchGroupChangeEvent(t) {
    const e = new CustomEvent(this.GROUP_CHANGE_EVENT_NAME, {
      detail: {
        group: t,
        isAllOpen: i.isGroupAllOpen(t)
      }
    });
    window.dispatchEvent(e);
  }
  bindThisToMemberFunctions() {
    Object.getOwnPropertyNames(Object.getPrototypeOf(this)).forEach((e) => {
      typeof this[e] == "function" && (this[e] = this[e].bind(this));
    });
  }
  isOpen() {
    return this.state.isOpen;
  }
  isAnimating() {
    return this.state.isAnimating;
  }
  async open(t = !1, e = !1) {
    if (this.state.isAnimating) return Promise.resolve();
    if (this.options.group && !e) {
      if (i.isGroupAnimating(this.options.group))
        return Promise.resolve();
      this.options.groupMode === "single" ? i.closeAllInGroup(this.options.group, this) : this.options.groupMode === "single-await" && await i.closeAllInGroup(this.options.group, this);
    }
    return this.state.isOpen = !0, this.addClasses(this.button, this.options.openClass), this.setAria(!0), this.setButtonLabel(this.options.closeLabel), this.options.group && this.dispatchGroupChangeEvent(this.options.group), this.animate(t);
  }
  async close(t = !1) {
    return this.state.isAnimating ? Promise.resolve() : (this.state.isOpen = !1, this.removeClasses(this.button, this.options.openClass), this.setAria(!1), this.setButtonLabel(this.options.openLabel), this.options.group && this.dispatchGroupChangeEvent(this.options.group), this.animate(t));
  }
  async toggle() {
    if (this.state.isAnimating) return Promise.resolve();
    this.isOpen() ? await this.close() : await this.open();
  }
  animate(t = !1) {
    const e = this.isOpen() ? this.options.openTween(this.dropdownItem) : this.options.closeTween(this.dropdownItem);
    return new Promise((s) => {
      var n, o, p, h, u, l, d, c;
      if (this.isOpen() ? (o = (n = this.options).onOpenStart) == null || o.call(n, this.dropdownItem) : (h = (p = this.options).onCloseStart) == null || h.call(p, this.dropdownItem), this.state.isAnimating = !0, t)
        e.progress(1), this.state.isAnimating = !1, this.isOpen() ? (l = (u = this.options).onOpenEnd) == null || l.call(u, this.dropdownItem) : (c = (d = this.options).onCloseEnd) == null || c.call(d, this.dropdownItem), s();
      else {
        const m = e.vars.onComplete;
        e.eventCallback("onComplete", () => {
          var f, g, O, E;
          m && m(), this.state.isAnimating = !1, this.isOpen() ? (g = (f = this.options).onOpenEnd) == null || g.call(f, this.dropdownItem) : (E = (O = this.options).onCloseEnd) == null || E.call(O, this.dropdownItem), s();
        });
      }
    });
  }
  defaultOpenTween(t) {
    return a.timeline().set(t, { display: "block", height: 0 }).to(t, {
      height: "auto",
      duration: this.options.openOptions.duration,
      ease: this.options.openOptions.ease
    });
  }
  defaultCloseTween(t) {
    return a.to(t, {
      height: 0,
      duration: this.options.closeOptions.duration,
      ease: this.options.closeOptions.ease,
      onComplete: () => {
        a.set(t, { display: "none" });
      }
    });
  }
  setAria(t) {
    this.button.setAttribute("aria-expanded", String(t)), this.dropdownItem.setAttribute("aria-hidden", String(!t));
  }
  addClasses(t, e) {
    if (!t || !e) return;
    const s = e.split(" ");
    t.classList.add(...s);
  }
  removeClasses(t, e) {
    if (!t || !e) return;
    const s = e.split(" ");
    t.classList.remove(...s);
  }
  setButtonLabel(t) {
    !t || !this.buttonLabelEl || (this.buttonLabelEl.textContent = t);
  }
  addEventListeners() {
    this.button.addEventListener("click", this.toggle), this.options.closeOnEsc && document.addEventListener("keydown", this.onEscKeyPress), this.options.closeOnOutsideClick && document.addEventListener("click", this.onClickOutside), this.options.closeOnFocusLeave && document.addEventListener("keyup", this.onFocusLeaveHandler);
  }
  onEscKeyPress(t) {
    t.key === "Escape" && this.isOpen() && this.close();
  }
  onClickOutside(t) {
    if (!this.isOpen()) return;
    if (this.options.group) {
      console.warn("closeOnOutsideClick is not supported in a group");
      return;
    }
    this.dropdownItem.contains(t.target) || this.button.contains(t.target) || this.close();
  }
  onFocusLeaveHandler(t) {
    if (t.key !== "Tab" || !this.isOpen()) return;
    this.dropdownItem.contains(t.target) || this.close();
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
    var t, e;
    this.resetState(), this.removeEventListeners(), this.removeInstanceFromGroup(), (e = (t = this.options).onDestroy) == null || e.call(t, this.dropdownItem);
  }
  resetState() {
    a.killTweensOf(this.dropdownItem), this.button.removeAttribute("aria-expanded"), this.options.openClass && this.removeClasses(this.button, this.options.openClass), this.options.openLabel && this.setButtonLabel(this.options.openLabel), this.dropdownItem.removeAttribute("aria-hidden"), this.dropdownItem.removeAttribute("style");
  }
  removeEventListeners() {
    this.button.removeEventListener("click", this.toggle), document.removeEventListener("keydown", this.onEscKeyPress), document.removeEventListener("click", this.onClickOutside), document.removeEventListener("keyup", this.onFocusLeaveHandler);
  }
  addInstanceToGroup() {
    i.groupInstances[this.options.group] = i.groupInstances[this.options.group] || [], i.groupInstances[this.options.group].push(this);
  }
  removeInstanceFromGroup() {
    if (this.options.group && i.groupInstances[this.options.group]) {
      const t = i.groupInstances[this.options.group].indexOf(this);
      t > -1 && i.groupInstances[this.options.group].splice(t, 1), i.groupInstances[this.options.group].length === 0 && delete i.groupInstances[this.options.group];
    }
  }
  shouldOpenOnLoad() {
    return this.button.getAttribute("aria-expanded") === "true" || this.options.openOnLoad;
  }
  init() {
    this.shouldOpenOnLoad() && this.open(!0), this.options.group && this.addInstanceToGroup(), this.addEventListeners();
  }
};
i.DURATION_DEFAULT = 0.3, i.DURATION_REDUCED_MOTION = 1e-3, i.EASE_DEFAULT = "power2.easeInOut", i.groupInstances = {};
let w = i;
export {
  w as DropdownToggle
};
