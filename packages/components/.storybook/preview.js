import { setCustomElementsManifest } from '@storybook/web-components';
import 'normalize.css';
import '../src/solid-styles.css';
import { fetchStyleComponents } from '../scripts/storybook/styles-helper';
import { registerIconLibrary } from '../src/utilities/icon-library';
import { storybookUtilities } from '../scripts/storybook/helper';

/**
 * This loads the custom elements manifest generated on run or on build time.
 */

async function loadCustomElements() {
  let customElements;

  fetch('./custom-elements.json')
    .then(() => {
      // Use dynamic manifest generated by Vite on runtime
      return fetch('./custom-elements.json').then(res => res.json());
    })
    .catch(() => {
      console.log('Failed to fetch custom-elements.json. Using local manifest...');
      // Use manifest file generated on build time
      return import('../dist/custom-elements.json');
    })
    .then(async customElements => {
      // In production, the manifest is optimized and styles are added during the build process.
      // However, in development mode, the manifest isn't built with styles, so we add them dynamically.
      // In the latter case therefore we have to "fetchStyleComponents", too.
      const stylesAreAlreadyIncluded = customElements.modules.some(module => module.styles === true);
      if (!stylesAreAlreadyIncluded) {
        const styleComponents = await fetchStyleComponents();
        customElements.modules = [...customElements?.modules, ...styleComponents];
      }

      setCustomElementsManifest(customElements);
    });

  console.log('Custom elements manifest loaded');
}

loadCustomElements();

/**
 * This registers iconLibraries for the sd-icon component
 */

registerIconLibrary('global-resources', {
  resolver: name => {
    // split path and name
    let path = name.split('/');
    let iconName = path.pop();

    // "system" and "system/colored" should both resolve to "system/colored", same for "content"
    if (path.length === 1) {
      path.push('colored');
    }

    return `https://global-resources.fe.union-investment.de/latest/scripts/services/svg/icons/${path.join(
      '/'
    )}/${iconName}.svg`;
  },

  // We need currentColor as the main color for the icons
  mutator: svg => {
    const recoloredElements = {};
    recoloredElements['currentColorFills'] = svg.querySelectorAll('[fill="#00358e"], [fill="#fff"]');
    recoloredElements['currentColorStrokes'] = svg.querySelectorAll('[stroke="#00358e"], [stroke="#fff"]');
    recoloredElements['greenFills'] = svg.querySelectorAll('[fill="#43b02a"]');
    recoloredElements['greenStrokes'] = svg.querySelectorAll('[stroke="#43b02a"]');

    recoloredElements.currentColorFills.forEach(filledElement => {
      filledElement.setAttribute('fill', 'currentColor');
    });

    recoloredElements.currentColorStrokes.forEach(strokedElement => {
      strokedElement.setAttribute('stroke', 'currentColor');
    });

    recoloredElements.greenFills.forEach(filledElement => {
      filledElement.setAttribute('fill', 'rgb(var(--sd-color-accent, 67 176 42) / var(--tw-bg-opacity, 1))');
    });

    recoloredElements.greenStrokes.forEach(strokedElement => {
      strokedElement.setAttribute('stroke', 'rgb(var(--sd-color-accent, 67 176 42) / var(--tw-bg-opacity, 1))');
    });
    return svg;
  }
});

registerIconLibrary('global-resources-overriden', {
  resolver: name => {
    // split path and name
    let path = name.split('/');
    let iconName = path.pop();

    // "system" and "system/colored" should both resolve to "system/colored", same for "content"
    if (path.length === 1) {
      path.push('colored');
    }

    // Override icon names which are baked into components
    if (path[0] === 'system') {
      iconName =
        {
          picture: 'dokumentimage'
        }[iconName] || iconName;
    } else if (path[0] === 'content') {
      iconName =
        {
          picture: 'dokumentimage'
        }[iconName] || iconName;
    }

    return `https://global-resources.fe.union-investment.de/latest/scripts/services/svg/attrax-icons/${path.join(
      '/'
    )}/${iconName}.svg`;
  },
  // We need currentColor as the main color for the icons
  mutator: svg => svg.setAttribute('fill', 'currentColor')
});

export const parameters = {
  docs: {
    source: {
      transform: code => storybookUtilities.codeOptimizer(code)
    }
  }
};

/**
 * This mocks the fetch API to return a mocked HTML response
 */

const originalFetch = global.fetch;

const defaultResponse = content => {
  // Mocked HTML response
  const init = {
    status: 200,
    statusText: 'OK'
  };
  const blob = new Blob([content], { type: 'text/html' });
  return new Response(blob, init);
};

const mocks = {
  /**
   * Content
   */
  'https://union-investment.de/lorem-ipsum': '<h2>Imprint</h2>Ad Lorem aliquip adipisicing tempor in mollit proident.',
  /**
   * System icons
   */
  '/icons/system/colored/multi-functions.svg':
    '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#00358e" d="M14 4c0 1.105-0.895 2-2 2s-2-0.895-2-2c0-1.105 0.895-2 2-2s2 0.895 2 2z"/><path fill="#00358e" d="M14 12c0 1.105-0.895 2-2 2s-2-0.895-2-2c0-1.105 0.895-2 2-2s2 0.895 2 2z"/><path fill="#00358e" d="M14 20c0 1.105-0.895 2-2 2s-2-0.895-2-2c0-1.105 0.895-2 2-2s2 0.895 2 2z"/></svg>',
  '/icons/system/colored/minus.svg':
    '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#00358e" d="M21 11h-18c-0.552 0-1 0.448-1 1s0.448 1 1 1v0h18c0.552 0 1-0.448 1-1s-0.448-1-1-1v0z"/></svg>',
  '/icons/system/colored/picture.svg':
    '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#00358e" d="M21 2h-18c-0.552 0-1 0.448-1 1v0 18c0 0.552 0.448 1 1 1v0h18c0.552 0 1-0.448 1-1v0-18c0-0.552-0.448-1-1-1v0zM20 4v9.253l-1.627-1.627c-0.181-0.181-0.431-0.292-0.707-0.292s-0.526 0.112-0.707 0.292v0l-2.96 2.96-4.96-4.96c-0.181-0.181-0.431-0.292-0.707-0.292s-0.526 0.112-0.707 0.292v0l-3.627 3.627v-9.253zM4 16.080l4.333-4.333 8.253 8.253h-12.587zM19.413 20l-4-4 2.253-2.253 2.333 2.333v3.92z"/><path fill="#00358e" d="M16 8c0 1.105-0.895 2-2 2s-2-0.895-2-2c0-1.105 0.895-2 2-2s2 0.895 2 2z"/></svg>',
  '/icons/system/colored/arrow-right.svg':
    '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#00358e" d="M14.707 4.293c-0.183-0.196-0.443-0.318-0.732-0.318-0.552 0-1 0.448-1 1 0 0.289 0.122 0.549 0.318 0.731l0.001 0.001 5.293 5.293h-15.587c-0.552 0-1 0.448-1 1s0.448 1 1 1v0h15.587l-5.293 5.293c-0.181 0.181-0.292 0.431-0.292 0.707s0.112 0.526 0.292 0.707v0c0.181 0.181 0.431 0.292 0.707 0.292s0.526-0.112 0.707-0.292v0l7-7c0.181-0.181 0.292-0.431 0.292-0.707s-0.112-0.526-0.292-0.707v0z"></path></svg>',

  /**
   * Content icons
   */
  '/icons/content/colored/picture.svg': `<svg id="picture_svg__Ebene_1" data-name="Ebene 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72"> <path d="M52.13,4H12V58c0,5.61,3.46,10,7.87,10H60V14C60,8.39,56.54,4,52.13,4Zm0,4C54.23,8,56,10.75,56,14V48.17l-8-8-7,6.95-15-16L16,41.17V8ZM19.87,64C17.77,64,16,61.25,16,58V46.83l10-9.95,15,16,7-7.05,8,8V64Z" fill="#00358e"/> <circle cx="44" cy="20" r="6" fill="#43b02a"/> </svg> `,
  /**
   * Attrax icons
   */
  '/attrax-icons/system/colored/dokumentimage.svg': `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 32"> <path d="M21.632 6.656c0 1.467-1.189 2.656-2.656 2.656s-2.656-1.189-2.656-2.656c0-1.467 1.189-2.656 2.656-2.656s2.656 1.189 2.656 2.656zM11.584 30.016h11.136c1.184 0 2.24-0.736 2.656-1.76 0.16-0.352 0.224-0.736 0.224-1.152v-24.192c0-1.6-1.312-2.912-2.912-2.912h-19.776c-1.6 0-2.912 1.312-2.912 2.912v24.192c0 1.6 1.312 2.912 2.912 2.912h8.672zM23.84 20.608l-3.488-3.68-3.488 3.488-9.632-9.632-5.472 5.536v-13.408c0-0.608 0.512-1.152 1.152-1.152h19.776c0.608 0 1.152 0.512 1.152 1.152v17.696z"/> </svg> `,
  'attrax-icons/content/colored/dokumentimage.svg': `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 32"> <path d="M21.632 6.656c0 1.467-1.189 2.656-2.656 2.656s-2.656-1.189-2.656-2.656c0-1.467 1.189-2.656 2.656-2.656s2.656 1.189 2.656 2.656zM11.584 30.016h11.136c1.184 0 2.24-0.736 2.656-1.76 0.16-0.352 0.224-0.736 0.224-1.152v-24.192c0-1.6-1.312-2.912-2.912-2.912h-19.776c-1.6 0-2.912 1.312-2.912 2.912v24.192c0 1.6 1.312 2.912 2.912 2.912h8.672zM23.84 20.608l-3.488-3.68-3.488 3.488-9.632-9.632-5.472 5.536v-13.408c0-0.608 0.512-1.152 1.152-1.152h19.776c0.608 0 1.152 0.512 1.152 1.152v17.696z"/> </svg> `
};

global.fetch = (input, init) => {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;

  return new Promise((resolve, reject) => {
    const mock = mocks[Object.keys(mocks).find(key => url.includes(key))];
    if (mock) {
      console.log(`ℹ️ Mocked fetch: ${url}`);
      resolve(defaultResponse(mock));
    } else {
      // Fallback to original fetch method for all other requests
      return originalFetch(input, init).then(response => resolve(response));
    }
  });
};
