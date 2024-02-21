# Dropdown Toggle

A package for creating interactive dropdown menus. Utilizing the GreenSock Animation Platform (GSAP) for smooth animations, this class offers a comprehensive set of features for managing dropdown states and behaviors.

## Table of Contents

- [Features](#markdown-header-features)
- [Dependencies](#markdown-header-dependencies)
- [Installation](#markdown-header-installation)
- [Usage](#markdown-header-usage)
- [API](#markdown-header-api)
- [Release Notes](#markdown-header-release-notes)

## Features
- **Dynamic State Management**: Maintains the open or closed state of the dropdown, ensuring interactions are responsive and state-aware.
- **Accessibility Support**: Sets ARIA attributes dynamically, improving accessibility by indicating the expanded or collapsed state of the dropdown to assistive technologies.
- **Customizable Animations**: Leverages GSAP for animating dropdown open and close actions, with customizable duration and easing options for tailored visual effects.
- **Group Behavior**: Supports grouping of dropdowns, allowing for the management of multiple dropdowns in a cohesive manner. Only one dropdown within a group can be open at a time, enhancing the user experience by preventing overlapping dropdowns.
- **Extended Options**: Offers a range of configurable options such as open and close labels, CSS classes for open and closed states, and callbacks for open and close events, providing flexibility for various use cases.
- **Event Handling**: Includes built-in event listeners for toggle actions, keyboard interactions (e.g., closing dropdowns with the Escape key), and clicks outside of the dropdown to automatically close it, ensuring a seamless user interaction.
- **Lifecycle Management**: Features methods for initializing and destroying dropdown instances, enabling proper setup and teardown of components to prevent memory leaks and ensure clean transitions between states.

## Dependencies

- GSAP

## Installation

**Please install a specific tagged version.**

`npm install ssh://git@bitbucket.org:numiko/dropdown-toggle.git#<TAG_NAME>`


## Usage

### Example JS

```javascript
import { DropdownToggle } from '@numiko/dropdown-toggle';

const myDropdown = new DropdownToggle('[data-js-my-dropdown-button]', {
  // selector|element for the button label - this is usually a span within the button along side an svg icon for example
  buttonLabelEl: '[data-js-my-dropdown-button-label]',
  // open label for the button
  openLabel: 'Open',
  // close label for the button
  closeLabel: 'Close',
  // class applied to button in open state
  openClass: '',
  // should dropdown be open at load
  openOnLoad: false,
  // close on escape key
  closeOnEsc: true,
  // close when clicking outside the dropdown
  closeOnOutsideClick: false,
  // duration for default open tween
  openDuration: 0.3,
  // ease for default open tween
  openEase: 'power2.easeInOut',
  // duration for default close tween
  closeDuration: 0.3,
  // ease for default close tween
  closeEase: 'power2.easeInOut',
  // assign the dropdown to a group - only one dropdown in a group will be open at one time
  group: '',
  // callback when open animation starts
  onOpenStart: () => {},
  // callback when open animation ends
  onOpenEnd: () => {},
  // callback when close animation starts
  onCloseStart: () => {},
  // callback when close animation ends
  onCloseEnd: () => {},
});


myDropdown.init(); // initialise
```
### Example HTML
---
```HTML
<!-- Link your button to your content via the aria-controls attribute -->
<button type="button" data-js-my-dropdown-button aria-controls="mydropdown-container">
  <span data-js-my-dropdown-button-label>Open</span>
</button>

<div id="mydropdown-container" class="hidden overflow-hidden">This is the dropdown content</div>
```

## API

### Options
The `dropdownToggle` constructor accepts options as a second argument.

| Option | Description | Type | Default
| --- | --- | --- | --- |
| `buttonLabelEl` | Element that will hold the button label.  Will also accept a valid querySelector string | `HTMLElement` / `string`| `null` |
| `openLabel` | Text to set for button label when open | `string` | `'Open'` |
| `closeLabel` | Text to set for button label when closed | `string` | `'Close'` |
| `openClass` | Class applied to dropdown button when open. Removed when closed | `string` | `''` |
| `openOnLoad` | Have the dropdown in its open state on load | `boolean` | `false` |
| `closeOnEsc` | Close dropdown when clicking the escape button | `boolean` | `false` |
| `closeOnClickOutside` | Close dropdown when clicking outside of it | `boolean` | `false` |
| `openDuration` | Tween duration for open animation | `number` | 0.3 |
| `closeDuration` | Tween duration for close animation | `number` | 0.3 |
| `openEase` | [A GSAP ease](https://gsap.com/docs/v3/Eases/) | `string` | `'power2.easeInOut'`|
| `closeEase` | [A GSAP ease](https://gsap.com/docs/v3/Eases/) | `string` | `'power2.easeInOut'` |
| `group` | Assign a group name to a dropdown. Dropdowns in the same group will close others before opening.  Useful for menus or accordions where you want only one open at a time.  |  `string` | `''` |
| `onOpenStart` | Callback that fires before open animation |  `function` | `null` |
| `onOpenEnd` | Callback that fires after open animation | `function` | `null` |
| `onCloseStart` | Callback that fires before close animation | `function` | `null` |
| `onCloseEnd` | Callback that fires after close animation | `function` | `null` |
| `onDestroy` | Callback that fires when DropdownToggle is destroyed | `function` | `null` |

### Methods
| Method | Description |
| --- | --- |
| `init()` | Initalise the dropdown |
| `destroy()` | Destroy the dropdown |
| `open()` | Programatically open the dropdown |
| `close()` | Programatically close the dropdown |
| `toggle()` | Programatically toggle the dropdown (open/close depending on current state) |
| `isOpen()` | Return `true/false` is the dropdown is currently open |
| `isAnimating()` | Return `true/false` is the dropdown is currently animating |


## Release notes
### v1.0.0

**Breaking changes**

- Removed ability to use custom tweens.  DropdownToggle is specifically built to work with a height transition of the dropdownItem element.  The  `openDuration`, `closeDuration`, `openEase`, and `closeEase` should be enough to fit into the motion language of different sites.
- `isOpen` and `isAnimating` are now methods so need to be invoked with `isOpen()`, `isAnimating()`
- `DropdownToggle` is now a named export so needs to be imported using `import { DropdownToggle } from '@numiko/dropdown-toggle';`
- `closeClass` removed.  Instead the `openClass` classes are toggled on/off which works better from a tailwindcss approach.

**Notes**

- Add `group` option. this was specifically added to make the dropdownToggle work better when used with the Sitekit menus.  It will allo you to group a collection of dropdowns so that any open dropdowns in a group will close before another one opens.  Could also be useful for accordions where you don't want to be able to have them all open.
- Add `onDestroy` callback.
- Removed `@numiko/animation` dependency.  Instead default tweens are part of this codebase for simplicity.
