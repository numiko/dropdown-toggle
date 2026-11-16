/**
 * Detail of the group change event that is emitted
 * when a dropdown in a group is opened or closed.
 */
type GroupChangeEventDetail = {
    group: string;
    /**
     * Whether all dropdowns in the group are open.
     */
    isAllOpen: boolean;
};
type AnimationOptions = {
    /**
     * Duration of the animation in seconds.
     */
    duration: number;
    ease: string;
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
    buttonLabelEl?: HTMLElement | string;
    /**
     * The text to set for the label when the dropdown is closed.
     */
    openLabel?: string;
    /**
     * The text to set for the label when the dropdown is open.
     */
    closeLabel?: string;
    /**
     * A space-separated list of classes to add to the button when the dropdown is open.
     */
    openClass?: string;
    openOnLoad?: boolean;
    closeOnEsc?: boolean;
    closeOnOutsideClick?: boolean;
    closeOnFocusLeave?: boolean;
    openTween?: (dropdownItem: HTMLElement) => gsap.core.Timeline | gsap.core.Tween;
    closeTween?: (dropdownItem: HTMLElement) => gsap.core.Timeline | gsap.core.Tween;
    onOpenStart?: (dropdownItem: HTMLElement) => void;
    onOpenEnd?: (dropdownItem: HTMLElement) => void;
    onCloseStart?: (dropdownItem: HTMLElement) => void;
    onCloseEnd?: (dropdownItem: HTMLElement) => void;
    onDestroy?: (dropdownItem: HTMLElement) => void;
    /**
     * Options for the open animation.
     *
     * These are ignored if a custom tween is provided.
     */
    openOptions?: AnimationOptions;
    /**
     * Options for the close animation.
     *
     * These are ignored if a custom tween is provided.
     */
    closeOptions?: AnimationOptions;
    group?: string;
    groupMode?: GroupMode;
};
declare class DropdownToggle {
    /**
     * The default animation duration in seconds.
     *
     * Note: this will not apply if a custom animation is provided.
     */
    static DURATION_DEFAULT: number;
    /**
     * The animation duration to use if a user has reduced motion enabled, in seconds.
     *
     * Note: this will not apply if a custom animation is provided.
     *
     */
    static DURATION_REDUCED_MOTION: number;
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
    readonly GROUP_CHANGE_EVENT_NAME = "DropdownToggle:group-change";
    /**
     * The default animation ease.
     *
     * See GSAP documentation for available easings: {@link https://gsap.com/docs/v3/Eases/}
     *
     * Note: this will not apply if a custom animation is provided.
     */
    static EASE_DEFAULT: string;
    private static prefersReducedMotion;
    private static getAnimationDuration;
    private static groupInstances;
    /**
     * Checks if all dropdowns in a given group are open.
     */
    static isGroupAllOpen(group: string): boolean;
    /**
     * Checks if all dropdowns in a given group are closed.
     */
    static isGroupAllClosed(group: string): boolean;
    static closeAllInGroup(group: string, currentInstance?: DropdownToggle): Promise<void>;
    static openAllInGroup(group: string): Promise<void>;
    private static isGroupAnimating;
    private button;
    private buttonLabelEl?;
    private dropdownId;
    private dropdownItem;
    private state;
    private options;
    constructor(button: HTMLElement | string, options?: DropdownOptions);
    private resolveButton;
    private resolveButtonLabel;
    private resolveDropdownId;
    private resolveDropdownElement;
    private dispatchGroupChangeEvent;
    private bindThisToMemberFunctions;
    isOpen(): boolean;
    isAnimating(): boolean;
    open(instant?: boolean, bypassGroup?: boolean): Promise<void>;
    close(instant?: boolean): Promise<void>;
    toggle(): Promise<void>;
    private animate;
    private defaultOpenTween;
    private defaultCloseTween;
    private setAria;
    private addClasses;
    private removeClasses;
    private setButtonLabel;
    private addEventListeners;
    private onEscKeyPress;
    private onClickOutside;
    private onFocusLeaveHandler;
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
    destroy(): void;
    private resetState;
    private removeEventListeners;
    private addInstanceToGroup;
    private removeInstanceFromGroup;
    private shouldOpenOnLoad;
    init(): void;
}
export { DropdownToggle, type DropdownOptions, type AnimationOptions, type GroupMode, type GroupChangeEventDetail };
