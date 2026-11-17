# Dropdown Toggle

A package for creating interactive dropdowns. Utilizing the GreenSock Animation Platform (GSAP) for smooth animations, this class offers a comprehensive set of features for managing dropdown states and behaviors.

## Installation

Please install a specific tagged version.

```bash
npm install @numiko/dropdown-toggle
```

## Usage

### HTML Structure

The dropdown expects a container element with a button and a content panel:

```html
<div data-js-dropdown>
  <button data-js-dropdown-button>Toggle</button>
  <div data-js-dropdown-item>
    <!-- Dropdown content -->
  </div>
</div>
```

### Initialisation

Import the class and create a new instance, passing the container element and an options object. Then call `init()` to set up the dropdown:

```js
import { DropdownToggle } from '@numiko/dropdown-toggle';

const dropdown = document.querySelector('[data-js-dropdown]');
const instance = new DropdownToggle(dropdown, {
  group: 'my-group',
  groupMode: 'multiple',
});
instance.init();
```

### Group Modes

When using groups, the `groupMode` option controls how dropdowns interact:

- **`multiple`** — Multiple dropdowns can be open at the same time.
- **`single`** — Only one dropdown can be open at a time. Opening one immediately closes others.
- **`single-await`** — Only one dropdown can be open at a time. The next dropdown waits for the current one to finish closing before opening.

### Opening/Closing All in a Group

Use the static methods to control all dropdowns in a group:

```js
DropdownToggle.openAllInGroup('my-group');
DropdownToggle.closeAllInGroup('my-group');
DropdownToggle.isGroupAllOpen('my-group');
```

## API

Visit our [documentation](https://v4-1-0--numiko-dropdown.netlify.app/) for exhaustive information on the module.
