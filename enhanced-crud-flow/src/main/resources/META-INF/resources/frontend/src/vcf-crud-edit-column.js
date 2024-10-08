/**
@license
Copyright (c) 2017 Vaadin Ltd.
This program is available under Commercial Vaadin Add-On License 3.0, available at http://vaadin.com/license/cval-3.
*/
import '@polymer/polymer/polymer-legacy.js';

import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { GridColumnElement } from '@vaadin/vaadin-grid/src/vaadin-grid-column.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
/**
 * `<vcf-crud-edit>` is a helper element for `<vaadin-grid-column>` that provides
 * an easily themable button that fires an `edit` event with the row item as detail
 * when clicked.
 *
 * Typical usage is in a `<vaadin-grid-column>` of a custom `<vaadin-grid>` inside
 * a `<vcf-crud>` to enable editing.
 */
class CrudEditElement extends ThemableMixin(PolymerElement) {
  static get template() {
    return html`
    <style>
      :host {
        display: block;
      }
    </style>
`;
  }

  static get is() {
    return 'vcf-crud-edit';
  }

  /** @private */
  ready() {
    super.ready();
    this.addEventListener('click', this.__onClick);
    this.setAttribute('aria-label', 'Edit');
    this.setAttribute('role', 'button');
  }

  __onClick(e) {
    const tr = e.target.parentElement.assignedSlot.parentElement.parentElement;
    tr.dispatchEvent(
      new CustomEvent('edit', {detail: {item: tr._item, index: tr.index}, bubbles: true, composed: true}));
  }

  /**
   * Fired when user on the icon.
   *
   * @event edit
   * @param {Object} detail.item the item to edit
   * @param {Object} detail.index the index of the item in the data set
   */
}
window.customElements.define(CrudEditElement.is, CrudEditElement);
/**
 * `<vcf-crud-edit-column>` is a helper element for the `<vaadin-grid>`
 * that provides a clickable and themable edit icon.
 *
 * Typical usage is in a custom `<vaadin-grid>` inside a `<vcf-crud>`.
 *
 * #### Example:
 * ```html
 * <vaadin-grid items="[[items]]">
 *  <vcf-crud-edit-column></vcf-crud-edit-column>
 *
 *  <vaadin-grid-column>
 *    ...
 * ```
 *
 * @memberof Vaadin
 */
class CrudEditColumnElement extends (class extends GridColumnElement {}) {
  static get template() {
    return html`
    <template class="header" id="defaultHeaderTemplate" aria-label="Edit">
    </template>
    <template id="defaultBodyTemplate">
      <div id="edit">Edit</div>
    </template>
`;
  }

  static get is() {
    return 'vcf-crud-edit-column';
  }

  static get properties() {
    return {
      /**
       * Width of the cells for this column.
       * @private
       */
      width: {
        type: String,
        value: '4em'
      },

      /**
       * Flex grow ratio for the cell widths. When set to 0, cell width is fixed.
       * @private
       */
      flexGrow: {
        type: Number,
        value: 0
      },

      /** The arial-label for the edit button */
      ariaLabel: String
    };
  }

  /** @private */
  ready() {
    super.ready();
    this.renderer = (root, column, model) => {
      if (!root.firstElementChild) {
        const elm = document.createElement('vcf-crud-edit');
        this.hasAttribute('theme') && elm.setAttribute('theme', this.getAttribute('theme'));
        this.editLabel && elm.setAttribute('aria-label', this.ariaLabel);
        root.appendChild(elm);
      }
    };
  }
}

customElements.define(CrudEditColumnElement.is, CrudEditColumnElement);

export { CrudEditColumnElement };