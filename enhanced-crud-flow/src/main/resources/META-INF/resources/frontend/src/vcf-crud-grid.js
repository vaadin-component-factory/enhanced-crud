/**
@license
Copyright (c) 2017 Vaadin Ltd.
This program is available under Commercial Vaadin Add-On License 3.0, available at http://vaadin.com/license/cval-3.
*/
import '@polymer/polymer/polymer-element.js';

import { GridElement } from '@vaadin/vaadin-grid/src/vaadin-grid.js';
import '@vaadin/vaadin-grid/src/vaadin-grid-column.js';
import '@vaadin/vaadin-grid/src/vaadin-grid-column-group.js';
import '@vaadin/vaadin-grid/src/vaadin-grid-sorter.js';
import '@vaadin/vaadin-grid/src/vaadin-grid-filter.js';
import { IncludedMixin } from './vcf-crud-include-mixin.js';
import './vcf-crud-edit-column.js';

/**
 * `<vcf-crud-grid>` is a `<vaadin-grid>` which automatically configures all its columns based
 * on the JSON structure of the first item received.
 *
 * You cannot manually configure columns but you can still style the grid as it's described in
 * `<vaadin-grid>` [Documentation](https://vaadin.com/components/vaadin-grid/html-api/elements/Vaadin.GridElement)
 *
 * @memberof Vaadin
 * @mixes Vaadin.Crud.IncludedMixin
 */
class CrudGridElement extends IncludedMixin(class extends GridElement {}) {
  static get is() {
    return 'vcf-crud-grid';
  }

  static get properties() {
    return {
      /**
       * Disable filtering in the generated columns.
       */
      noFilter: Boolean,
      /**
       * Disable sorting in the generated columns.
       */
      noSort: Boolean,
      /**
       * Do not add headers to columns.
       */
      noHead: Boolean,
      __hideEditColumn: Boolean
    };
  }

  static get observers() {
    return [
      '__onItemsChange(items)',
      '__onHideEditColumnChange(hideEditColumn)'
    ];
  }

  __onItemsChange(items) {
    if ((!this.dataProvider || this.dataProvider == this._arrayDataProvider) && !this.include && items && items[0]) {
      this._configure(items[0]);
    }
  }

  __onHideEditColumnChange(hideEditColumn) {
    if (this.firstChild) {
      this.__toggleEditColumn();
    }
  }

  __toggleEditColumn() {
    const el = this.querySelector('vcf-crud-edit-column');
    if (this.hideEditColumn) {
      el && this.removeChild(el);
    } else if (!el) {
      this.appendChild(document.createElement('vcf-crud-edit-column'));
    }
  }

  __dataProviderWrapper(params, callback) {
    this.__dataProvider(params, (items, size) => {
      if (this.innerHTML == '' && !this.include && items[0]) {
        this._configure(items[0]);
      }
      callback(items, size);
    });
  }

  /**
   * @override
   * @private
   */
  _dataProviderChanged(dataProvider, oldDataProvider) {
    if (this._arrayDataProvider == dataProvider) {
      super._dataProviderChanged(dataProvider, oldDataProvider);
    } else if (this.__dataProviderWrapper != dataProvider) {
      this.innerHTML = '';
      this.__dataProvider = dataProvider;
      this.dataProvider = this.__dataProviderWrapper;
      super._dataProviderChanged(this.__dataProviderWrapper, oldDataProvider);
    }
  }

  /**
   * Autogenerate grid columns based on the JSON structure of the object provided.
   *
   * Method will be executed when items or dataProvider is assigned.
   */
  _configure(item) {
    this.innerHTML = '';
    this.__createColumns(this, item);
    this.__toggleEditColumn();
  }

  __createColumn(parent, path) {
    const col = document.createElement('vaadin-grid-column');

    col.renderer = (root, column, model) => {
      root.textContent = path ? this.get(path, model.item) : model.item;
    };

    if (!this.noHead && path) {
      col.headerRenderer = (root) => {
        const label = this.__capitalize(path.replace(/^.*\./, ''));

        if (!this.noSort) {
          const sorter = window.document.createElement('vaadin-grid-sorter');
          sorter.setAttribute('path', path);
          sorter.textContent = label;
          root.appendChild(sorter);
        }

        if (!this.noFilter) {
          const filter = window.document.createElement('vaadin-grid-filter');
          filter.setAttribute('path', path);
          filter.style.display = 'flex';

          const textField = window.document.createElement('vaadin-text-field');
          textField.setAttribute('theme', 'small');
          textField.setAttribute('slot', 'filter');
          textField.setAttribute('focus-target', true);
          textField.style.width = '100%';
          this.noSort && (textField.placeholder = label);
          textField.addEventListener('value-changed', function(event) {
            filter.value = event.detail.value;
          });

          filter.appendChild(textField);
          root.appendChild(filter);
        }

        if (this.noSort && this.noFilter) {
          root.textContent = label;
        }
      };
    }

    parent.appendChild(col);
    return col;
  }

  __createColumns(parent, object, path) {
    if (typeof object === 'object') {
      Object.keys(object).forEach(prop => {
        if (!this.include && this.exclude && this.exclude.test(prop)) {
          return;
        }
        const newPath = (path ? `${path}.` : '') + prop;
        if (object[prop] && typeof object[prop] === 'object') {
          const group = this.noHead ? parent : this.__createGroup(parent, newPath, object[prop]);
          this.__createColumns(group, object[prop], newPath);
        } else {
          this.__createColumn(parent, newPath);
        }
      });
    } else {
      this.__createColumn(parent, '');
    }
  }

  __createGroup(parent, path, object) {
    const grp = document.createElement('vaadin-grid-column-group');
    grp.headerRenderer = root => root.textContent = this.__capitalize(path.replace(/^.*\./, ''));
    parent.appendChild(grp);
    return grp;
  }

  __capitalize(path) {
    return path.toLowerCase().replace(/([^\w]+)/g, ' ').trim().replace(/^./, c => c.toUpperCase());
  }

  __set(path, val, obj) {
    if (obj && path) {
      path.split('.').slice(0, -1).reduce((o, p) => (o[p] = o[p] || {}), obj);
      this.set(path, val, obj);
    }
  }
}

customElements.define(CrudGridElement.is, CrudGridElement);

export { CrudGridElement };