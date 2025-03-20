import { Window } from 'happy-dom';
import { vi, beforeEach, afterEach } from 'vitest';
import { DropdownToggle } from '../lib/DropdownToggle';

const window = new Window();
const document = window.document;
global.window = window;
global.document = document;

const htmlDocumentContent = `
<div data-js-group-a class="mb-4">

  <button data-js-dropdown aria-controls="accordion1" type="button" aria-expanded="true">
    <span data-js-dropdown-label>An accordion with user added aria-expanded=true</span>
  </button>
  <div id="accordion1" class="hidden overflow-hidden" aria-hidden="false">
    <a href="/" data-js-dropdown-link>This is a link</a>
    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corporis, voluptatibus, commodi dolorum suscipit corrupti esse quae temporibus eum sint quam, doloribus distinctio sit. Repellat quo sequi rem veniam alias minus?</p>
  </div>

  <button data-js-dropdown aria-controls="accordion2" type="button" aria-expanded="false">
    <span data-js-dropdown-label>An accordion</span>
  </button>
  <div id="accordion2" class="hidden overflow-hidden" aria-hidden="true">
    <a href="/" data-js-dropdown-link>This is a link</a>
    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corporis, voluptatibus, commodi dolorum suscipit corrupti esse quae temporibus eum sint quam, doloribus distinctio sit. Repellat quo sequi rem veniam alias minus?</p>
  </div>

  <button data-js-dropdown aria-controls="accordion3" type="button" aria-expanded="false">
    <span data-js-dropdown-label>An accordion</span>
  </button>
  <div id="accordion3" class="hidden overflow-hidden" aria-hidden="true">
    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corporis, voluptatibus, commodi dolorum suscipit corrupti esse quae temporibus eum sint quam, doloribus distinctio sit. Repellat quo sequi rem veniam alias minus?</p>
  </div>

</div>
<div data-js-group-b>

  <button data-js-dropdown aria-controls="accordion4" type="button">
    <span data-js-dropdown-label>An accordion</span>
  </button>
  <div id="accordion4" class="hidden overflow-hidden" aria-hidden="true">
    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corporis, voluptatibus, commodi dolorum suscipit corrupti esse quae temporibus eum sint quam, doloribus distinctio sit. Repellat quo sequi rem veniam alias minus?</p>
  </div>

  <button data-js-dropdown aria-controls="accordion5" type="button" aria-expanded="false">
    <span data-js-dropdown-label>An accordion</span>
  </button>
  <div id="accordion5" class="hidden overflow-hidden" aria-hidden="true">
    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corporis, voluptatibus, commodi dolorum suscipit corrupti esse quae temporibus eum sint quam, doloribus distinctio sit. Repellat quo sequi rem veniam alias minus?</p>
  </div>

</div>
`;


export function setupTest() {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.write(htmlDocumentContent);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    DropdownToggle.groupInstances = {};
  });
}

export async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
