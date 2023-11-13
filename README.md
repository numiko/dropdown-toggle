## Installation
---
We want to install a specific tag because currently npm packages hosted privately on Bitbucket do not support semantic versioning.

`npm install ssh://git@bitbucket.org:numiko/dropdown-toggle.git#<TAG_NAME>`


## JS Setup & Options
---
```javascript
import DropdownToggle from './dropdown-toggle';

const myDropdown = new DropdownToggle('[data-js-my-dropdown-button]', {
  // selector|element for the button label - this is usually a span within the button along side an svg icon for exmaple
  buttonLabelEl: '[data-js-my-dropdown-button-label]',
  // open label for the button
  openLabel: 'Open',
  // close label for the button
  closeLabel: 'Close',
  // class applied to button in open state
  openClass: '',
  // class applied to button in close state
  closeClass: '',
  // should dropdown be open at load
  openOnLoad: false,
  // close on escape key
  closeOnEsc: true,
  // close when clicking outside the dropdown
  closeOnOutsideClick: false,
  // callback when open animation starts
  onOpenStart: () => {
    console.log('Event:Dropdown open start');
  },
  // callback when open animation ends
  onOpenEnd: () => {
    console.log('Event:Dropdown open end');
  },
  // callback when close animation starts
  onCloseStart: () => {
    console.log('Event:Dropdown close start');
  },
  // callback when close animation ends
  onCloseEnd: () => {
    console.log('Event:Dropdown close end');
  },
  customOpenTween: (dropdownItem) => {
    // You must return the tween or timeline
    // timeline example
    const tl = gsap.timeline();
    return tl
      .set(dropdownItem, {'display': 'block'})
      .to(dropdownItem, {
        height: 'auto',
        duration: 0.5,
        ease: 'power2.easeInOut',
      });
  },
  customCloseTween: (dropdownItem) => {
   // You must return the tween or timeline
   // tween example
   return gsap
     .to(dropdownItem, {
       height: 0,
       duration: 2,
       paused: true,
       ease: 'power2.easeInOut',
       onComplete: () => {
        gsap.set(dropdownItem, {'display': 'none'});
       }
     });
  },
});

myDropdown.init(); // initialise
```
## Example HTML
---
```HTML
<!-- Link your button to your content via the aria-controls attribute -->
<button type="button" data-js-my-dropdown-button aria-controls="mydropdown-container">
  <span data-js-my-dropdown-button-label>Open</span>
</button>

<div id="mydropdown-container">This is the dropdown content</div>
```

## Methods & Getters
---
```javascript
// Methods
myDropdown.init();        // initialise
myDropdown.open();        // open dropdown
myDropdown.close();       // close dropdown
myDropdown.toggle();      // toggle dropdown

// Getters
myDropdown.isOpen;        // returns if the dropdown is open
myDropdown.isAnimating;   // returns if the dropdown is animating
```
