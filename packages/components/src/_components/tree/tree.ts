import { clamp } from '../../internal/math';
import { customElement } from '../../../src/internal/register-custom-element';
import {property, query } from 'lit/decorators.js';
import { html } from 'lit';
import { LocalizeController } from '../../utilities/localize';
import { watch } from '../../internal/watch';
import SdTreeItem from '../tree-item/tree-item';
import SolidElement from '../../internal/solid-element';
import styles from './tree.styles';
import type { CSSResultGroup } from 'lit';

function syncCheckboxes(changedTreeItem: SdTreeItem, initialSync = false) {
  function syncParentItem(treeItem: SdTreeItem) {
    const children = treeItem.getChildrenItems({ includeDisabled: false });

    if (children.length) {
      const allChecked = children.every(item => item.selected);
      const allUnchecked = children.every(item => !item.selected && !item.indeterminate);

      treeItem.selected = allChecked;
      treeItem.indeterminate = !allChecked && !allUnchecked;
    }
  }

  function syncAncestors(treeItem: SdTreeItem) {
    const parentItem: SdTreeItem | null = treeItem.parentElement as SdTreeItem;

    if (SdTreeItem.isTreeItem(parentItem)) {
      syncParentItem(parentItem);
      syncAncestors(parentItem);
    }
  }

  function syncDescendants(treeItem: SdTreeItem) {
    for (const childItem of treeItem.getChildrenItems()) {
      childItem.selected = initialSync
        ? treeItem.selected || childItem.selected
        : !childItem.disabled && treeItem.selected;

      syncDescendants(childItem);
    }

    if (initialSync) {
      syncParentItem(treeItem);
    }
  }

  syncDescendants(changedTreeItem);
  syncAncestors(changedTreeItem);
}

/**
 * @summary Trees allow you to display a hierarchical list of selectable [tree items](/components/tree-item). Items with children can be expanded and collapsed as desired by the user.
 * @documentation https://solid.union-investment.com/[storybook-link]/tree
 * @status stable
 * @since 1.0
 *
 * @event {{ selection: TreeItem[] }} sd-selection-change - Emitted when a tree item is selected or deselected.
 *
 * @slot - The default slot.
 * @slot expand-icon - The icon to show when the tree item is expanded. Works best with `<sd-icon>`.
 * @slot collapse-icon - The icon to show when the tree item is collapsed. Works best with `<sd-icon>`.
 *
 * @csspart base - The component's base wrapper.
 *
 * @cssproperty [--indent-size=var(--sd-spacing-medium)] - The size of the indentation for nested items.
 * @cssproperty [--indent-guide-color=var(--sd-color-neutral-200)] - The color of the indentation line.
 * @cssproperty [--indent-guide-offset=0] - The amount of vertical spacing to leave between the top and bottom of the
 *  indentation line's starting position.
 * @cssproperty [--indent-guide-style=solid] - The style of the indentation line, e.g. solid, dotted, dashed.
 * @cssproperty [--indent-guide-width=0] - The width of the indentation line.
 */
@customElement('sd-tree')
export default class SdTree extends SolidElement {
  static styles: CSSResultGroup = styles;

  @query('slot:not([name])') defaultSlot: HTMLSlotElement;
  @query('slot[name=expand-icon]') expandedIconSlot: HTMLSlotElement;
  @query('slot[name=collapse-icon]') collapsedIconSlot: HTMLSlotElement;

  /**
   * The selection behavior of the tree. Single selection allows only one node to be selected at a time. Multiple
   * displays checkboxes and allows more than one node to be selected. Leaf allows only leaf nodes to be selected.
   */
  @property() selection: 'single' | 'multiple' | 'leaf' = 'single';

  //
  // A collection of all the items in the tree, in the order they appear. The collection is live, meaning it is
  // automatically updated when the underlying document is changed.
  //
  private lastFocusedItem: SdTreeItem;
  private readonly localize = new LocalizeController(this);
  private mutationObserver: MutationObserver;

  async connectedCallback() {
    super.connectedCallback();
    this.handleTreeChanged = this.handleTreeChanged.bind(this);
    this.handleFocusIn = this.handleFocusIn.bind(this);
    this.handleFocusOut = this.handleFocusOut.bind(this);

    this.setAttribute('role', 'tree');
    this.setAttribute('tabindex', '0');

    this.addEventListener('focusin', this.handleFocusIn);
    this.addEventListener('focusout', this.handleFocusOut);
    this.addEventListener('sd-lazy-change', this.handleSlotChange);

    await this.updateComplete;

    this.mutationObserver = new MutationObserver(this.handleTreeChanged);
    this.mutationObserver.observe(this, { childList: true, subtree: true });
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this.mutationObserver.disconnect();

    this.removeEventListener('focusin', this.handleFocusIn);
    this.removeEventListener('focusout', this.handleFocusOut);
    this.removeEventListener('sd-lazy-change', this.handleSlotChange);
  }

  // Generates a clone of the expand icon element to use for each tree item
  private getExpandButtonIcon(status: 'expand' | 'collapse') {
    const slot = status === 'expand' ? this.expandedIconSlot : this.collapsedIconSlot;
    const icon = slot.assignedElements({ flatten: true })[0] as HTMLElement;

    // Clone it, remove ids, and slot it
    if (icon) {
      const clone = icon.cloneNode(true) as HTMLElement;
      [clone, ...clone.querySelectorAll('[id]')].forEach(el => el.removeAttribute('id'));
      clone.setAttribute('data-default', '');
      clone.slot = `${status}-icon`;

      return clone;
    }

    return null;
  }

  // Initializes new items by setting the `selectable` property and the expanded/collapsed icons if any
  private initTreeItem = (item: SdTreeItem) => {
    item.selectable = this.selection === 'multiple';

    ['expand', 'collapse']
      .filter(status => !!this.querySelector(`[slot="${status}-icon"]`))
      .forEach((status: 'expand' | 'collapse') => {
        const existingIcon = item.querySelector(`[slot="${status}-icon"]`);

        if (existingIcon === null) {
          // No separator exists, add one
          item.append(this.getExpandButtonIcon(status)!);
        } else if (existingIcon.hasAttribute('data-default')) {
          // A default separator exists, replace it
          existingIcon.replaceWith(this.getExpandButtonIcon(status)!);
        } else {
          // The user provided a custom icon, leave it alone
        }
      });
  };

  private handleTreeChanged(mutations: MutationRecord[]) {
    for (const mutation of mutations) {
      const addedNodes: SdTreeItem[] = [...mutation.addedNodes].filter(SdTreeItem.isTreeItem) as SdTreeItem[];
      const removedNodes = [...mutation.removedNodes].filter(SdTreeItem.isTreeItem) as SdTreeItem[];

      addedNodes.forEach(this.initTreeItem);

      // If the focused item has been removed form the DOM, move the focus to the first focusable item
      if (removedNodes.includes(this.lastFocusedItem)) {
        this.focusItem(this.getFocusableItems()[0]);
      }
    }
  }

  private syncTreeItems(selectedItem: SdTreeItem) {
    const items = this.getAllTreeItems();

    if (this.selection === 'multiple') {
      syncCheckboxes(selectedItem);
    } else {
      for (const item of items) {
        if (item !== selectedItem) {
          item.selected = false;
        }
      }
    }
  }

  private selectItem(selectedItem: SdTreeItem) {
    const previousSelection = [...this.selectedItems];

    if (this.selection === 'multiple') {
      selectedItem.selected = !selectedItem.selected;
      if (selectedItem.lazy) {
        selectedItem.expanded = true;
      }
      this.syncTreeItems(selectedItem);
    } else if (this.selection === 'single' || selectedItem.isLeaf) {
      selectedItem.expanded = !selectedItem.expanded;
      selectedItem.selected = true;

      this.syncTreeItems(selectedItem);
    } else if (this.selection === 'leaf') {
      selectedItem.expanded = !selectedItem.expanded;
    }

    const nextSelection = this.selectedItems;

    if (
      previousSelection.length !== nextSelection.length ||
      nextSelection.some(item => !previousSelection.includes(item))
    ) {
      // Wait for the tree items' DOM to update before emitting
      Promise.all(nextSelection.map(el => el.updateComplete)).then(() => {
        this.emit('sd-selection-change', { detail: { selection: nextSelection } });
      });
    }
  }

  private getAllTreeItems() {
    return [...this.querySelectorAll<SdTreeItem>('sd-tree-item')];
  }

  private focusItem(item?: SdTreeItem | null) {
    item?.focus();
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (!['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Home', 'End', 'Enter', ' '].includes(event.key)) {
      return;
    }

    const items = this.getFocusableItems();
    const isLtr = this.localize.dir() === 'ltr';
    const isRtl = this.localize.dir() === 'rtl';

    if (items.length > 0) {
      event.preventDefault();
      const activeItemIndex = items.findIndex(item => item.matches(':focus'));
      const activeItem: SdTreeItem | undefined = items[activeItemIndex];

      const focusItemAt = (index: number) => {
        const item = items[clamp(index, 0, items.length - 1)];
        this.focusItem(item);
      };
      const toggleExpand = (expanded: boolean) => {
        activeItem.expanded = expanded;
      };

      if (event.key === 'ArrowDown') {
        // Moves focus to the next node that is focusable without opening or closing a node.
        focusItemAt(activeItemIndex + 1);
      } else if (event.key === 'ArrowUp') {
        // Moves focus to the next node that is focusable without opening or closing a node.
        focusItemAt(activeItemIndex - 1);
      } else if ((isLtr && event.key === 'ArrowRight') || (isRtl && event.key === 'ArrowLeft')) {
        //
        // When focus is on a closed node, opens the node; focus does not move.
        // When focus is on a open node, moves focus to the first child node.
        // When focus is on an end node (a tree item with no children), does nothing.
        //
        if (!activeItem || activeItem.disabled || activeItem.expanded || (activeItem.isLeaf && !activeItem.lazy)) {
          focusItemAt(activeItemIndex + 1);
        } else {
          toggleExpand(true);
        }
      } else if ((isLtr && event.key === 'ArrowLeft') || (isRtl && event.key === 'ArrowRight')) {
        //
        // When focus is on an open node, closes the node.
        // When focus is on a child node that is also either an end node or a closed node, moves focus to its parent node.
        // When focus is on a closed `tree`, does nothing.
        //
        if (!activeItem || activeItem.disabled || activeItem.isLeaf || !activeItem.expanded) {
          focusItemAt(activeItemIndex - 1);
        } else {
          toggleExpand(false);
        }
      } else if (event.key === 'Home') {
        // Moves focus to the first node in the tree without opening or closing a node.
        focusItemAt(0);
      } else if (event.key === 'End') {
        // Moves focus to the last node in the tree that is focusable without opening the node.
        focusItemAt(items.length - 1);
      } else if (event.key === 'Enter' || event.key === ' ') {
        // Selects the focused node.
        if (!activeItem.disabled) {
          this.selectItem(activeItem);
        }
      }
    }
  }

  private handleClick(event: Event) {
    const target = event.target as HTMLElement;
    const treeItem = target.closest('sd-tree-item')!;
    const isExpandButton = event
      .composedPath()
      .some((el: HTMLElement) => el?.classList?.contains('tree-item__expand-button'));

    if (!treeItem || treeItem.disabled) {
      return;
    }

    if (this.selection === 'multiple' && isExpandButton) {
      treeItem.expanded = !treeItem.expanded;
    } else {
      this.selectItem(treeItem);
    }
  }

  private handleFocusOut(event: FocusEvent) {
    const relatedTarget = event.relatedTarget as HTMLElement;

    // If the element that got the focus is not in the tree
    if (!relatedTarget || !this.contains(relatedTarget)) {
      this.tabIndex = 0;
    }
  }

  private handleFocusIn(event: FocusEvent) {
    const target = event.target as SdTreeItem;

    // If the tree has been focused, move the focus to the last focused item
    if (event.target === this) {
      this.focusItem(this.lastFocusedItem || this.getAllTreeItems()[0]);
    }

    // If the target is a tree item, update the tabindex
    if (SdTreeItem.isTreeItem(target) && !target.disabled) {
      if (this.lastFocusedItem) {
        this.lastFocusedItem.tabIndex = -1;
      }
      this.lastFocusedItem = target;
      this.tabIndex = -1;

      target.tabIndex = 0;
    }
  }

  private handleSlotChange() {
    const items = this.getAllTreeItems();
    items.forEach(this.initTreeItem);
  }

  @watch('selection')
  async handleSelectionChange() {
    const isSelectionMultiple = this.selection === 'multiple';
    const items = this.getAllTreeItems();

    this.setAttribute('aria-multiselectable', isSelectionMultiple ? 'true' : 'false');

    for (const item of items) {
      item.selectable = isSelectionMultiple;
    }

    if (isSelectionMultiple) {
      await this.updateComplete;

      [...this.querySelectorAll(':scope > sd-tree-item')].forEach((treeItem: SdTreeItem) =>
        syncCheckboxes(treeItem, true)
      );
    }
  }

  /** @internal Returns the list of tree items that are selected in the tree. */
  get selectedItems(): SdTreeItem[] {
    const items = this.getAllTreeItems();
    const isSelected = (item: SdTreeItem) => item.selected;

    return items.filter(isSelected);
  }

  /** @internal Gets focusable tree items in the tree. */
  getFocusableItems() {
    const items = this.getAllTreeItems();
    const collapsedItems = new Set();

    return items.filter(item => {
      // Exclude disabled elements
      if (item.disabled) return false;

      // Exclude those whose parent is collapsed or loading
      const parent: SdTreeItem | null | undefined = item.parentElement?.closest('[role=treeitem]');
      if (parent && (!parent.expanded || parent.loading || collapsedItems.has(parent))) {
        collapsedItems.add(item);
      }

      return !collapsedItems.has(item);
    });
  }

  render() {
    return html`
      <div part="base" class="tree" @click=${this.handleClick} @keydown=${this.handleKeyDown}>
        <slot @slotchange=${this.handleSlotChange}></slot>
        <slot name="expand-icon" hidden aria-hidden="true"> </slot>
        <slot name="collapse-icon" hidden aria-hidden="true"> </slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sd-tree': SdTree;
  }
}
