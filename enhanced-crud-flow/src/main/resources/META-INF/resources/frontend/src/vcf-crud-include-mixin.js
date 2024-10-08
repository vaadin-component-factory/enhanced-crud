/**
@license
Copyright (c) 2017 Vaadin Ltd.
This program is available under Commercial Vaadin Add-On License 3.0, available at http://vaadin.com/license/cval-3.
*/
/**
 * @polymerMixin
 */
export const IncludedMixin = superClass => class IncludedMixin extends superClass {
  static get properties() {
    return {
      /**
       * A list of item fields that should not be mapped to form fields.
       *
       * When [`include`](#/elements/vcf-crud-form#property-include) is defined, this property is ignored.
       *
       * Default is to exclude any private property.
       *
       * @type{String|RegExp}
       */
      exclude: {
        value: '^_',
        observer: '__onExcludeChange'
      },
      /**
       * A list of item properties that should be mapped to form fields.
       *
       * When it is defined [`exclude`](#/elements/vcf-crud-form#property-exclude) is ignored.
       *
       * @type{String|Array}
       */
      include: {
        observer: '__onIncludeChange'
      }
    };
  }

  __onExcludeChange(exclude) {
    if (typeof exclude == 'string') {
      this.exclude = exclude ? RegExp(exclude.replace(/, */g, '|'), 'i') : undefined;
    }
  }

  __onIncludeChange(include) {
    if (typeof include == 'string') {
      this.include = include ? include.split(/, */) : undefined;
    } else if (!this._fields && Array.isArray(include)) {
      const item = {};
      this.include.forEach(path => this.__set(path, null, item));
      this._configure(item);
    }
  }
};