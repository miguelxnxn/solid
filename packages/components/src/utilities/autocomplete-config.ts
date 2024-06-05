import type SdInput from "../components/input/input";
import type SdPopup from "../components/popup/popup";

/**
 * This function is a helper to quickly setup autocomplete.js for Solid components.
 * Besides some needed defaults it adds additional styles and event listeners.
 * @param sdInputSelector - Reference to `sd-input` element or selector to the element, defaults to `#autoCompleteInput`.
 * @param sdPopupSelector - Reference to `sd-popup` element or selector to the element, defaults to `#autoCompletePopup`.
 * @param setValueOnSelection - If `true` the value of `sd-input` will be updated to reflect the current selection. Default: `true`.
 * @param scrollSelectionIntoView - If `true` the selected element will be scrolled into view. Default: `true`.
 * @returns The configuration object for autocomplete.js.
 */
export function setupAutocomplete(
  sdInputSelector: HTMLUnknownElement | string = '#autoCompleteInput',
  sdPopupSelector: HTMLUnknownElement | string = '#autoCompletePopup',
  {
    setValueOnSelection,
    scrollSelectionIntoView,
  } = {
    /** Bind the value to `sd-input` */
    setValueOnSelection: true,
    /** Selected elements should also be in view */
    scrollSelectionIntoView: true
  }
) {
  /**
   * Verifies the element is an `sd-SOMETHING` element and returns it.
   * 
   * @param T - i.e. `SdInput`, `SdButton`, `SdAccordionGroup`, etc.
   * @param name - i.e. `input`, `button`, `accordion-group`, etc.
   * @param elementOrSelector - element reference or string to be used for `document.querySelector()`
   * 
   * @throws Error if the provided element or selector does not resolve to an `sd-SOMETHING` element.
   * 
   * @remarks For brevity, comments assume `name === 'input'` and `T === SdInput`. 
   */
  const getAndVerifySdElement = <T extends HTMLElement>(name:string, elementOrSelector: HTMLUnknownElement | string) : T => {
    const candidate: HTMLUnknownElement | null = typeof elementOrSelector === 'string'
      ? document.querySelector(elementOrSelector)
      : elementOrSelector;
    
    // Verify `candidate` resolves to `sd-input` or `sd-1-2-3-input`.
    // Avoid using `candidate instanceof SdInput` as this would check against _this package's_ `SdInput` class, returning `false` if `sd-input` was imported from somewhere else (i.e. CDN, another bundle)
    const tagStartsWithSD = candidate?.tagName.startsWith('SD-');
    const tagEndsWithName = candidate?.tagName.endsWith(`-${name.toUpperCase()}`);
    if (!tagStartsWithSD || !tagEndsWithName) {
      throw new Error(`The provided element or selector "${JSON.stringify(elementOrSelector)}" does not resolve to an sd-${name} element.`);
    }
    // We're now reasonably certain that we're dealing with an `sd-input`
    return candidate as T;
  }

  const getAndVerifyShadowRoot = (element: HTMLElement) : ShadowRoot => {
    if (!element.shadowRoot) {
      throw new Error(`The provided element does not have a shadowRoot.`);
    }
    return element.shadowRoot;
  }

  const sdInput: SdInput = getAndVerifySdElement<SdInput>('input', sdInputSelector);
  const sdPopup: SdPopup = getAndVerifySdElement<SdPopup>('popup', sdPopupSelector);

  const sdInputShadowRoot: ShadowRoot = getAndVerifyShadowRoot(sdInput);

  const input = sdInputShadowRoot.querySelector('input')!;

  /* Helper to use PostCSS and Syntax highlighting */
  const css = (string: TemplateStringsArray) => string[0];

  const setupElementsAndStyles = () => {
    sdInputShadowRoot.appendChild(sdPopup);

    sdInput.classList.add('sd-autocomplete__input');
    
    sdPopup.classList.add('sd-autocomplete__popup');
    sdPopup.setAttribute('exportparts', 'popup__content');
    sdPopup.active = false;
    sdPopup.autoSize = 'vertical';
    sdPopup.autoSizePadding = 16;
    sdPopup.placement = 'bottom-start';
    sdPopup.anchor = sdInput;
    sdPopup.sync = 'width';

    // `ul` is created by autocomplete.js, see `resultsList`
    const ul = sdInputShadowRoot.querySelector('ul');
    if (ul) {
      ul.setAttribute('part', 'listbox');
      sdPopup.appendChild(ul);
    }

    const styles = css`
      .sd-autocomplete__input[active] {
        &::part(border) {
          @apply rounded-b-none;
        }
        &::part(form-control) {
          @apply z-50;
        }
      }
      .sd-autocomplete__popup {
        &::part(popup) {
          @apply overflow-y-scroll z-dropdown border-2 border-t-0 border-primary bg-white rounded-b-default shadow px-2 py-3;
        }
        li {
          @apply hover:bg-neutral-100 transition-all;
          list-style-type: '';
          mark {
            @apply font-bold bg-transparent;
          }

          /* This recreates the styles of sd-option if the element doesn't contain a sd-option */
          &:not(:has(sd-option)) {
            @apply px-4 py-3 text-base cursor-pointer text-black;
            &:hover {
              @apply bg-neutral-200;
            }
          }

          &[aria-selected='true'] {
            @apply bg-neutral-200;
          }
        }
      }
    `;
    const styleSheet = new CSSStyleSheet();
    styleSheet.replaceSync(styles);
    sdInputShadowRoot.adoptedStyleSheets = [...sdInputShadowRoot.adoptedStyleSheets, styleSheet];
  };

  input.addEventListener('init', () => {
    setupElementsAndStyles();
  });

  input.addEventListener('open', () => {
    sdInput.setAttribute('active', 'true');
    sdPopup.setAttribute('active', 'true');
  });

  input.addEventListener('close', () => {
    sdInput.removeAttribute('active');
    sdPopup.removeAttribute('active');
  });

  input.addEventListener('selection', (event: CustomEvent) => {
    if (!setValueOnSelection) return;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    sdInput.value = event?.detail?.selection.value as string;
  });
  
  input.addEventListener('navigate', () => {
    if (!scrollSelectionIntoView) return;
    const selected = sdInputShadowRoot.querySelector('[aria-selected="true"]');
    selected?.scrollIntoView({ block: 'nearest' });
  });

  return {
    config: {
      selector: () => {
        // For correct handling we need the input element inside the ShadowDOM.
        // A11y requires to then also push the popup into the ShadowDOM as well.
        // Unfortunately this hinders people to style things just from outside with their own stylesheets
        // Experiments using resultsList.destination as destination and the whole sd-input as selector failed
        // Maybe there could be a fix in the future for that
        return input;
      },
      resultsList: {
        tag: 'ul'
      },
      wrapper: false
    }
  };
}
