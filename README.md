# Dropdown Toggle

A package for creating interactive dropdown menus. Utilizing the GreenSock Animation Platform (GSAP) for smooth animations, this class offers a comprehensive set of features for managing dropdown states and behaviors.

## Features

For an exhaustive list of features see the `options` taken by the `constructor`.

### Group mode

Group mode provides the ability to group a collection of dropdowns together, managing their behaviour as a whole; see the `groupMode` documentation.

### Custom tweens

Custom tweens provide the ability to animate dropdowns in a completely customisable way; see `openOptions` and `closeOptions` for documentation.

Visit our [documentation](https://dropdowntoggledocs.netlify.app/modules) for exhaustive information on the module.

## Installation

**Please install a specific tagged version.**

```bash
npm install ssh://git@bitbucket.org:numiko/dropdown-toggle.git#<VERSION>
```

```bash
npm install ssh://git@bitbucket.org:numiko/dropdown-toggle.git#semver:<VERSION>
```

## Usage

### Example
---
```HTML
<!-- Important! Link your button to your content via the aria-controls attribute -->
<button type="button" data-js-my-dropdown-button aria-controls="mydropdown-container">
  <span data-js-my-dropdown-button-label>Open</span>
</button>

<div id="mydropdown-container" class="hidden overflow-hidden">This is the dropdown content</div>
```

```javascript
import { DropdownToggle } from '@numiko/dropdown-toggle';

const myDropdown = new DropdownToggle('[data-js-my-dropdown-button]');
```

## Dependencies

- GSAP (looking to remove this dependency in future - and allow your own custom tweens)

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
