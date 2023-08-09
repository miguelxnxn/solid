import '../icon/icon';
import { css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { watch } from '../../internal/watch';
import cx from 'classix';
import SolidElement from '../../internal/solid-element';

/**
 * @summary A radio allows to select only one value from a set of options. Clicking on an unchecked radio will deselect the other one(s).
 * @documentation https://solid.union-investment.com/[storybook-link]/radio
 * @status stable
 * @since 2.0
 *
 * @dependency sd-icon
 *
 * @slot - The radio's label.
 *
 * @event sd-blur - Emitted when the control loses focus.
 * @event sd-focus - Emitted when the control gains focus.
 *
 * @csspart base - The component's base wrapper.
 * @csspart control - The circular container that wraps the radio's checked state.
 * @csspart control--checked - The radio control when the radio is checked.
 * @csspart checked-icon - The checked icon, an `<sd-icon>` element.
 * @csspart label - The container that wraps the radio's label.
 */
@customElement('sd-radio')
export default class SdRadio extends SolidElement {
  /** A Boolean attribute which, if present, indicates that this radio button is the default check one in the group. */
  @state() checked = false;
  @state() protected hasFocus = false;

  /** The radio's size. */
  @property({ reflect: true }) size: 'sm' | 'lg' = 'lg';

  /**  A Boolean attribute which, if present, marks the radio Button valid or invalid  */
  @property({ type: Boolean, reflect: true }) invalid = false;

  /** A Boolean attribute which, if present, disables the radio. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** The radio's value. When selected, the radio group will receive this value. */
  @property() value: string;

  connectedCallback() {
    super.connectedCallback();
    this.handleBlur = this.handleBlur.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.setInitialAttributes();
    this.addEventListeners();
  }

  disconnectedCallback() {
    this.removeEventListeners();
  }

  private addEventListeners() {
    this.addEventListener('blur', this.handleBlur);
    this.addEventListener('click', this.handleClick);
    this.addEventListener('focus', this.handleFocus);

    console.log('hasFocus 1', this.hasFocus);
  }

  private removeEventListeners() {
    this.removeEventListener('blur', this.handleBlur);
    this.removeEventListener('click', this.handleClick);
    this.removeEventListener('focus', this.handleFocus);
  }

  private handleBlur() {
    this.hasFocus = false;
    this.emit('sd-blur');

    console.log('hasFocus3 ', this.hasFocus);
  }

  private handleClick() {
    if (!this.disabled) {
      this.checked = true;
    }
  }

  private handleFocus() {
    this.hasFocus = true;
    this.emit('sd-focus');

    console.log('hasFocus 2', this.hasFocus);
  }

  private setInitialAttributes() {
    this.setAttribute('role', 'radio');
    this.setAttribute('tabindex', '-1');
    this.setAttribute('aria-disabled', this.disabled ? 'true' : 'false');
  }

  @watch('checked')
  handleCheckedChange() {
    this.setAttribute('aria-checked', this.checked ? 'true' : 'false');
    this.setAttribute('tabindex', this.checked ? '0' : '-1');
  }

  @watch('disabled', { waitUntilFirstUpdate: true })
  handleDisabledChange() {
    this.setAttribute('aria-disabled', this.disabled ? 'true' : 'false');
  }

  render() {
    return html`
      <span
        part="base"
        class=${cx(
          'radio inline-flex items-start items-center font-[var(--sd-input-font-family)] text-[var(--sd-input-font-size-medium)] font-[var(--sd-input-font-family)] text-[var(--sd-input-label-color)] cursor-pointer align-middle',
          this.checked && 'radio--checked',
          this.disabled && 'hover:cursor-not-allowed',
          this.hasFocus && 'radio--focused',
          {
            /* sizes, fonts */
            sm: 'radio--small text-sm',
            lg: 'radio--large text-base'
          }[this.size]
        )}
      >
        <span
          part="${`control${this.checked ? 'control--checked' : ''}`}"
          class=${cx(
            'radio__control relative inline-flex items-center justify-center border rounded-full bg-white h-4 w-4',
            (this.disabled && 'border-neutral-500') ||
              (this.invalid && 'border-error') ||
              (this.checked && 'border-accent hover:border-accent-300') ||
              'border-neutral-800 hover:bg-neutral-200'
          )}
        >
          ${this.checked
            ? html`
                <span
                  part="checked"
                  class=${cx(
                    'rounded-full inline-flex text-white border bg-accent h-2.5 w-2.5',
                    (this.disabled && 'bg-neutral-500') ||
                      (this.invalid && 'bg-error') ||
                      (this.checked && 'bg-accent hover:bg-accent-300') ||
                      'bg-neutral-800'
                  )}
                ></span>
              `
            : ''}
        </span>

        <slot
          part="label"
          class=${cx(
            'ml-2 select-none inline-block text-[var(--sd-input-label-color)]',
            (this.disabled && 'text-neutral-500') || (this.invalid && 'text-error') || 'text-neutral-800'
          )}
        >
        </slot>
      </span>
    `;
  }

  /**
   * Inherits Tailwind classes and includes additional styling.
   */
  static styles = [
    SolidElement.styles,
    css`
      :host {
        display: block;
      }

      :host(:focus-visible) {
        outline: 0;
      }

      .radio__control {
        flex: 0 0 auto;
        transition: var(--sd-transition-fast) border-color, var(--sd-transition-fast) background-color,
          var(--sd-transition-fast) color, var(--sd-transition-fast) box-shadow;
      }

      /* Checked + focus */
      :host(:focus-visible) .radio__control {
        outline: 2px solid #00358e;
        outline-offset: 2px;
      }
    `
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'sd-radio': SdRadio;
  }
}
