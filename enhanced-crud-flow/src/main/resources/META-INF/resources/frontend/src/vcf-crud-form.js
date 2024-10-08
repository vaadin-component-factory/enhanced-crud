/**
@license
Copyright (c) 2017 Vaadin Ltd.
This program is available under Commercial Vaadin Add-On License 3.0, available at http://vaadin.com/license/cval-3.
*/
import '@polymer/polymer/polymer-element.js';

import { FormLayoutElement } from '@vaadin/vaadin-form-layout/src/vaadin-form-layout.js';
import '@vaadin/vaadin-text-field/src/vaadin-text-field.js';
import { IncludedMixin } from './vcf-crud-include-mixin.js';

/**
 * `<vcf-crud-form>` is a <vaadin-form-layout> which automatically can configures all its items based
 * on the JSON structure of the first item set.
 *
 * You cannot manually configure fields but you can still style the layout as it's described in
 * `<vaadin-form-layout>` [Documentation](https://vaadin.com/components/vaadin-form-layout/html-api/elements/Vaadin.FormLayoutElement)
 *
 * @memberof Vaadin
 * @mixes Vaadin.Crud.IncludedMixin
 */
class CrudFormElement extends IncludedMixin(class extends FormLayoutElement {}) {
  static get is() {
    return 'vcf-crud-form';
  }

  static get properties() {
    return {
      /**
       * The item being edited.
       */
      item: Object
    };
  }

  static get observers() {
    return ['__onItemChange(item)'];
  }

  /**
   * Autogenerate form fields based on the JSON structure of the object provided.
   *
   * If not called, the method will be executed the first time an item is assigned.
   */
  _configure(object) {
    this.innerHTML = '';
    this._fields = [];
    this.__createFields(this, object);
    this.notifyResize();
  }

  __onItemChange(item) {
    if (!this._fields) {
      this._configure(item);
    }
  }

  __createField(parent, path, type) {
    const field = document.createElement('vaadin-text-field');
    field.label = this.__capitalize(path);
    field.path = path;
    field.required = true;
    parent.appendChild(field);
    this._fields.push(field);
    return field;
  }

  __createFields(parent, object, path) {
    Object.keys(object).forEach(prop => {
      if (!this.include && this.exclude && this.exclude.test(prop)) {
        return;
      }
      const newPath = (path ? `${path}.` : '') + prop;
      if (object[prop] && typeof object[prop] === 'object') {
        this.__createFields(parent, object[prop], newPath);
      } else {
        this.__createField(parent, newPath);
      }
    });
    if (!this._fields.length) {
      this._fields = undefined;
    }
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

customElements.define(CrudFormElement.is, CrudFormElement);

export { CrudFormElement };