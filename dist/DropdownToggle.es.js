import { gsap as e } from "gsap";
// lib/utils/deepMerge.ts
function t(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function n(e, r) {
	let i = e ?? {}, a = r ?? {}, o = { ...i };
	for (let e in a) if (Object.prototype.hasOwnProperty.call(a, e)) {
		let r = i[e], s = a[e];
		o[e] = t(r) && t(s) ? n(r, s) : s;
	}
	return o;
}
// lib/DropdownToggle.ts
var r = class t {
	static {
		this.DURATION_DEFAULT = .3;
	}
	static {
		this.DURATION_REDUCED_MOTION = .001;
	}
	static {
		this.EASE_DEFAULT = "power2.easeInOut";
	}
	static prefersReducedMotion() {
		return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	}
	static getAnimationDuration() {
		return t.prefersReducedMotion() ? t.DURATION_REDUCED_MOTION : t.DURATION_DEFAULT;
	}
	static {
		this.groupInstances = {};
	}
	static isGroupAllOpen(e) {
		let n = t.groupInstances[e] || [];
		return n.length > 0 && n.every((e) => e.isOpen());
	}
	static isGroupAllClosed(e) {
		let n = t.groupInstances[e] || [];
		return n.length > 0 && n.every((e) => !e.isOpen());
	}
	static async closeAllInGroup(e, n) {
		let r = (t.groupInstances[e] || []).filter((e) => e !== n && e.isOpen()).map((e) => e.close());
		await Promise.all(r);
	}
	static async openAllInGroup(e) {
		let n = (t.groupInstances[e] || []).filter((e) => !e.isOpen()).map((e) => e.open(!1, !0));
		await Promise.all(n);
	}
	static isGroupAnimating(e) {
		return (t.groupInstances[e] || []).some((e) => e.isAnimating());
	}
	constructor(e, r) {
		this.GROUP_CHANGE_EVENT_NAME = "DropdownToggle:group-change", this.state = {
			isOpen: !1,
			isAnimating: !1
		}, this.options = {
			openLabel: "Open",
			closeLabel: "Close",
			openClass: "open",
			openOnLoad: !1,
			closeOnEsc: !1,
			closeOnOutsideClick: !1,
			closeOnFocusLeave: !1,
			group: "",
			groupMode: "multiple",
			openTween: this.defaultOpenTween.bind(this),
			closeTween: this.defaultCloseTween.bind(this),
			openOptions: {
				duration: t.getAnimationDuration(),
				ease: t.EASE_DEFAULT
			},
			closeOptions: {
				duration: t.getAnimationDuration(),
				ease: t.EASE_DEFAULT
			}
		}, this.bindThisToMemberFunctions(), r && (this.options = n(this.options, r)), this.button = this.resolveButton(e), this.buttonLabelEl = this.resolveButtonLabel(r?.buttonLabelEl), this.dropdownId = this.resolveDropdownId(), this.dropdownItem = this.resolveDropdownElement();
	}
	resolveButton(e) {
		if (typeof e == "string") {
			let t = document.querySelector(e);
			if (!t) throw Error(`Button element not found: ${e}`);
			return t;
		}
		return e;
	}
	resolveButtonLabel(e) {
		if (e) {
			if (typeof e == "string") {
				let t = this.button.querySelector(e);
				if (!t) throw Error(`Button label element not found: ${e}`);
				return t;
			}
			return e;
		}
	}
	resolveDropdownId() {
		let e = this.button.getAttribute("aria-controls")?.trim();
		if (!e) throw Error("Button must have an aria-controls attribute pointing to the dropdown id");
		return e;
	}
	resolveDropdownElement() {
		let e = document.getElementById(this.dropdownId);
		if (!e) throw Error(`Dropdown element not found: #${this.dropdownId}`);
		return e;
	}
	dispatchGroupChangeEvent(e) {
		let n = new CustomEvent(this.GROUP_CHANGE_EVENT_NAME, { detail: {
			group: e,
			isAllOpen: t.isGroupAllOpen(e)
		} });
		window.dispatchEvent(n);
	}
	bindThisToMemberFunctions() {
		let e = Object.getOwnPropertyNames(Object.getPrototypeOf(this)), t = this;
		e.forEach((e) => {
			let n = t[e];
			typeof n == "function" && (t[e] = n.bind(this));
		});
	}
	isOpen() {
		return this.state.isOpen;
	}
	isAnimating() {
		return this.state.isAnimating;
	}
	async open(e = !1, n = !1) {
		if (this.state.isAnimating) return Promise.resolve();
		if (this.options.group && !n) {
			if (t.isGroupAnimating(this.options.group)) return Promise.resolve();
			this.options.groupMode === "single" ? t.closeAllInGroup(this.options.group, this) : this.options.groupMode === "single-await" && await t.closeAllInGroup(this.options.group, this);
		}
		return this.state.isOpen = !0, this.addClasses(this.button, this.options.openClass), this.setAria(!0), this.setButtonLabel(this.options.closeLabel), this.options.group && this.dispatchGroupChangeEvent(this.options.group), this.animate(e);
	}
	async close(e = !1) {
		return this.state.isAnimating ? Promise.resolve() : (this.state.isOpen = !1, this.removeClasses(this.button, this.options.openClass), this.setAria(!1), this.setButtonLabel(this.options.openLabel), this.options.group && this.dispatchGroupChangeEvent(this.options.group), this.animate(e));
	}
	async toggle() {
		if (this.state.isAnimating) return Promise.resolve();
		this.isOpen() ? await this.close() : await this.open();
	}
	animate(e = !1) {
		let t = this.isOpen() ? this.options.openTween(this.dropdownItem) : this.options.closeTween(this.dropdownItem);
		return new Promise((n) => {
			if (this.isOpen() ? this.options.onOpenStart?.(this.dropdownItem) : this.options.onCloseStart?.(this.dropdownItem), this.state.isAnimating = !0, e) t.progress(1), this.state.isAnimating = !1, this.isOpen() ? this.options.onOpenEnd?.(this.dropdownItem) : this.options.onCloseEnd?.(this.dropdownItem), n();
			else {
				let e = t.vars.onComplete;
				t.eventCallback("onComplete", () => {
					e && e(), this.state.isAnimating = !1, this.isOpen() ? this.options.onOpenEnd?.(this.dropdownItem) : this.options.onCloseEnd?.(this.dropdownItem), n();
				});
			}
		});
	}
	defaultOpenTween(t) {
		return e.timeline().set(t, {
			display: "block",
			height: 0
		}).to(t, {
			height: "auto",
			duration: this.options.openOptions.duration,
			ease: this.options.openOptions.ease
		});
	}
	defaultCloseTween(t) {
		return e.to(t, {
			height: 0,
			duration: this.options.closeOptions.duration,
			ease: this.options.closeOptions.ease,
			onComplete: () => {
				e.set(t, { display: "none" });
			}
		});
	}
	setAria(e) {
		this.button.setAttribute("aria-expanded", String(e)), this.dropdownItem.setAttribute("aria-hidden", String(!e));
	}
	addClasses(e, t) {
		if (!e || !t) return;
		let n = t.split(" ");
		e.classList.add(...n);
	}
	removeClasses(e, t) {
		if (!e || !t) return;
		let n = t.split(" ");
		e.classList.remove(...n);
	}
	setButtonLabel(e) {
		e && this.buttonLabelEl && (this.buttonLabelEl.textContent = e);
	}
	addEventListeners() {
		this.button.addEventListener("click", this.toggle), this.options.closeOnEsc && document.addEventListener("keydown", this.onEscKeyPress), this.options.closeOnOutsideClick && document.addEventListener("click", this.onClickOutside), this.options.closeOnFocusLeave && document.addEventListener("keyup", this.onFocusLeaveHandler);
	}
	onEscKeyPress(e) {
		e.key === "Escape" && this.isOpen() && this.close();
	}
	onClickOutside(e) {
		this.isOpen() && (this.options.group ? console.warn("closeOnOutsideClick is not supported in a group") : this.dropdownItem.contains(e.target) || this.button.contains(e.target) || this.close());
	}
	onFocusLeaveHandler(e) {
		e.key === "Tab" && this.isOpen() && (this.dropdownItem.contains(e.target) || this.close());
	}
	destroy() {
		this.resetState(), this.removeEventListeners(), this.removeInstanceFromGroup(), this.options.onDestroy?.(this.dropdownItem);
	}
	resetState() {
		e.killTweensOf(this.dropdownItem), this.button.removeAttribute("aria-expanded"), this.options.openClass && this.removeClasses(this.button, this.options.openClass), this.options.openLabel && this.setButtonLabel(this.options.openLabel), this.dropdownItem.removeAttribute("aria-hidden"), this.dropdownItem.removeAttribute("style");
	}
	removeEventListeners() {
		this.button.removeEventListener("click", this.toggle), document.removeEventListener("keydown", this.onEscKeyPress), document.removeEventListener("click", this.onClickOutside), document.removeEventListener("keyup", this.onFocusLeaveHandler);
	}
	addInstanceToGroup() {
		let e = t.groupInstances[this.options.group] || [];
		t.groupInstances[this.options.group] = e, e.includes(this) || e.push(this);
	}
	removeInstanceFromGroup() {
		let e = t.groupInstances[this.options.group];
		if (this.options.group && e) {
			let n = e.indexOf(this);
			n > -1 && e.splice(n, 1), e.length === 0 && delete t.groupInstances[this.options.group];
		}
	}
	shouldOpenOnLoad() {
		return this.button.getAttribute("aria-expanded") === "true" || this.options.openOnLoad;
	}
	init() {
		this.shouldOpenOnLoad() && this.open(!0), this.options.group && this.addInstanceToGroup(), this.addEventListeners();
	}
};
export { r as DropdownToggle };
