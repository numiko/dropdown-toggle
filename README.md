# Dropdown Toggle

A package for creating interactive dropdown menus. Utilizing the GreenSock Animation Platform (GSAP) for smooth animations, this class offers a comprehensive set of features for managing dropdown states and behaviors.

## Table of Contents

- [Dependencies](#markdown-header-dependencies)
- [Installation](#markdown-header-installation)
- [Usage](#markdown-header-usage)
- [API](#markdown-header-api)
- [Release Notes](#markdown-header-release-notes)


## Dependencies

- GSAP (looking to remove this dependency in future - and allow your own custom tweens)

## Installation

**Please install a specific tagged version.**

`npm install ssh://git@bitbucket.org:numiko/dropdown-toggle.git#<VERSION>`

`npm install ssh://git@bitbucket.org:numiko/dropdown-toggle.git#semver:<VERSION>`


## Usage

### Example HTML
---
```HTML
<!-- Important! Link your button to your content via the aria-controls attribute -->
<button type="button" data-js-my-dropdown-button aria-controls="mydropdown-container">
  <span data-js-my-dropdown-button-label>Open</span>
</button>

<div id="mydropdown-container" class="hidden overflow-hidden">This is the dropdown content</div>
```

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
  // close when focus moves outside the dropdown
  closeOnFocusLeave: false,
  // duration for default open tween
  openDuration: 0.3,
  // ease for default open tween
  openEase: 'power2.easeInOut',
  // duration for default close tween
  closeDuration: 0.3,
  // ease for default close tween
  closeEase: 'power2.easeInOut',
  // assign the dropdown to a group - see group option for more details
  group: '',
  // group mode - see group option for more details - 'default', 'accordion', 'accordion-await'
  groupMode: 'default',
  // callback when open animation starts
  onOpenStart: () => {},
  // callback when open animation ends
  onOpenEnd: () => {},
  // callback when close animation starts
  onCloseStart: () => {},
  // callback when close animation ends
  onCloseEnd: () => {},
  // callback when DropdownToggle is destroyed
  onDestroy: () => {},
});


myDropdown.init(); // initialise
```

### Using Custom Tweens

You can provide custom GSAP tweens for both opening and closing animations using the `openTween` and `closeTween` options. These functions should return a GSAP timeline or tween.

> **Note:** When using custom tweens, the `openDuration`, `openEase`, `closeDuration`, and `closeEase` options are ignored. You should specify your duration and easing within your custom tween.

```javascript
const myDropdown = new DropdownToggle('[data-js-my-dropdown-button]', {
  openTween: (element) => {
    return gsap.timeline()
      .set(element, {
        display: 'block',
        height: 0,
        opacity: 0
      })
      .to(element, {
        height: 'auto',
        opacity: 1,
        duration: 1,
      });
  }
});
```

In this example, we're creating a custom opening animation that:
1. Initially sets the element to be visible but with zero height and opacity
2. Animates both the height and opacity simultaneously
3. Uses a duration of 1 second for the animation

The `element` parameter passed to the tween function is the dropdown content container that will be animated.


## API

### Options
The `dropdownToggle` constructor accepts options as a second argument.

| Option | Description | Type | Default
| --- | --- | --- | --- |
| `buttonLabelEl` | Element that will hold the button label.  Will also accept a valid querySelector string | `HTMLElement` \| `string`| `null` |
| `openLabel` | Text to set for button label when open | `string` | `'Open'` |
| `closeLabel` | Text to set for button label when closed | `string` | `'Close'` |
| `openClass` | Class applied to dropdown button when open. Removed when closed | `string` | `''` |
| `openOnLoad` | Have the dropdown in its open state on load | `boolean` | `false` |
| `closeOnEsc` | Close dropdown when clicking the escape button | `boolean` | `false` |
| `closeOnOutsideClick` | Close dropdown when clicking outside of it | `boolean` | `false` |
| `closeOnFocusLeave` | Close dropdown when focus moves outside of it | `boolean` | `false` |
| `openDuration` | Tween duration for open animation | `number` | 0.3 |
| `openEase` | [A GSAP ease](https://gsap.com/docs/v3/Eases/) | `string` | `'power2.easeInOut'`|
| `openTween` | Function that returns a custom Tween or Timeline to use for the opening animation. See "Using Custom Tweens" section | `function` | `null` |
| `closeDuration` | Tween duration for close animation | `number` | 0.3 |
| `closeEase` | [A GSAP ease](https://gsap.com/docs/v3/Eases/) | `string` | `'power2.easeInOut'` |
| `closeTween` | Function that returns a custom Tween or Timeline to use for the closing animation. See "Using Custom Tweens" section | `function` | `null` |
| `group` | Assign a group name to a dropdown. Needed if you want to alter a group mode behavior. | `string` | `` |
| `groupMode` | Determines how dropdowns in a group behave. 'multiple': multiple dropdowns can be open simultaneously. 'single': only one dropdown can be open at a time. 'single-await': only one dropdown can be open at a time and waits for others to finish closing | `'multiple'` \| `'single'` \| `'single-await'` | `'multiple'` |
| `onOpenStart` | Callback that fires before open animation |  `function` | `null` |
| `onOpenEnd` | Callback that fires after open animation | `function` | `null` |
| `onCloseStart` | Callback that fires before close animation | `function` | `null` |
| `onCloseEnd` | Callback that fires after close animation | `function` | `null` |
| `onDestroy` | Callback that fires when DropdownToggle is destroyed | `function` | `null` |

### Methods

#### Instance Methods
| Method | Description |
| --- | --- |
| `init()` | Initalise the dropdown |
| `destroy()` | Destroy the dropdown |
| `open()` | Programatically open the dropdown |
| `close()` | Programatically close the dropdown |
| `toggle()` | Programatically toggle the dropdown (open/close depending on current state) |
| `isOpen()` | Return `true/false` is the dropdown is currently open |
| `isAnimating()` | Return `true/false` is the dropdown is currently animating |

#### Static Methods
| Method | Description |
| --- | --- |
| `DropdownToggle.isGroupAllOpen("<group>")` | Return `true/false` if all dropdowns in a group are open |
| `DropdownToggle.openAllInGroup("<group>")` | Open all dropdowns in a group |
| `DropdownToggle.closeAllInGroup("<group>")` | Close all dropdowns in a group |


## Customizing global defaults
If you want to customize the global defaults for the dropdownToggle class so you don't have to pass in the options each time you create a new instance, you can do so by setting the following static properties.

```JS
import { DropdownToggle } from '@numiko/dropdown-toggle';

// Provide new custom defaults
DropdownToggle.DURATION_DEFAULT = 0.4;
DropdownToggle.DURATION_REDUCED_MOTION = 0.001;
DropdownToggle.EASE_DEFAULT = 'elastic.out(1,0.3)';

```

## Group Modes
When using the `group` option, you can set the `groupMode` to one of the following:

- `multiple`: multiple dropdowns per group can be open simultaneously (default).
- `single`: only one dropdown per group can be open at a time.
- `single-await`: only one dropdown per group can be open at a time and waits for others to finish closing.

## 'Toggle All' behaviour
Each DropdownToggle instance will dispatch a custom event `DropdownToggle:group-change` when a dropdown is part of a group and is opened or closed.  This can be used to update a 'Toggle All' button for example.

- `DropdownToggle.isGroupAllOpen('<group>')`: returns `true/false` if all dropdowns in a group are open.
- `DropdownToggle.openAllInGroup('<group>')`: opens all dropdowns in a group.
- `DropdownToggle.closeAllInGroup('<group>')`: closes all dropdowns in a group.

```HTML
<!-- Add a 'Toggle All' button to the page -->
<button data-js-dropdown-toggle-default>Show All</button>
```

```javascript
// Add a listener to the 'Toggle All' button to open or close all dropdowns in a group.
const toggleButton = document.querySelector(`[data-js-dropdown-toggle-default]`);
if (toggleButton) {
  toggleButton.addEventListener('click', () => {
    // Here we are toggling the 'default' group
    const isAllOpen = DropdownToggle.isGroupAllOpen('default');
    if (!isAllOpen) {
      DropdownToggle.openAllInGroup('default');
    } else {
      DropdownToggle.closeAllInGroup('default');
    }
  });
}

// Add a listener to the window to update the 'Toggle All' button when a dropdown is opened or closed.
window.addEventListener('DropdownToggle:group-change', (e) => {
  // Use the group name provided in the event to find the 'Toggle All' button
  const toggleButton = document.querySelector(`[data-js-dropdown-toggle-${e.detail.group}]`);
  if (toggleButton) {
    toggleButton.setAttribute('aria-pressed', e.detail.isAllOpen);
    toggleButton.innerHTML = `${e.detail.isAllOpen ? 'Hide' : 'Show'} All`;
  }
});
```

## Release notes

### v3.0.0

Converts to TypeScript

**Breaking changes**

- `options.openDuration` now sits under `options.openOptions.duration`
- `options.closeDuration` now sits under `options.closeOptions.duration`
- `options.openTween` now sits under `options.openOptions.tween`
- `options.closeTween` now sits under `options.closeOptions.tween`

### v2.0.0

**Breaking changes**

- Added `groupMode` option.  This allows you to set the group mode to `single`, `single-await`, or `multiple`.  To get the same behavior as prior release you need to set a `group` and`groupMode` to `single`.
- Changed global defaults for duration and easing.  These can now be set by setting the static properties `DropdownToggle.DURATION_DEFAULT` and `DropdownToggle.EASE_DEFAULT`.
- Added `closeOnFocusLeave` option.  This will close the dropdown when the user tabs outside of it.  This renames the `onFocusLeave` option.

 **Notes**
- `openTween`and `closeTween` options for custom tweens added back in to support custom tweens.

### v1.0.0

**Breaking changes**

- Removed ability to use custom tweens.  DropdownToggle is specifically built to work with a height transition of the dropdownItem element.  The  `openDuration`, `closeDuration`, `openEase`, and `closeEase` should be enough to fit into the motion language of different sites.
- `isOpen` and `isAnimating` are now methods so need to be invoked with `isOpen()`, `isAnimating()`
- `DropdownToggle` is now a named export so needs to be imported using `import { DropdownToggle } from '@numiko/dropdown-toggle';`
- `closeClass` removed.  Instead the `openClass` classes are toggled on/off which works better from a tailwindcss approach.

**Notes**

- Add `group` option. this was specifically added to make the dropdownToggle work better when used with the Sitekit menus.  It will allow you to group a collection of dropdowns so that any open dropdowns in a group will close before another one opens.  Could also be useful for accordions where you don't want to be able to have them all open.
- Add `onDestroy` callback.
- Removed `@numiko/animation` dependency.  Instead default tweens are part of this codebase for simplicity.
- Allow user to define global defaults for both duration and easing.
