import Ember from 'ember';

const {isPresent, isBlank} = Ember;

/**
 * @module ember-cli-storagekit
 * @submodule mixins
 */

export default Ember.Mixin.create({

  /**
   * Namespace to prepend to each stored key, separated by a colon (:).
   *
   * Ex.
   *
   * ```javascript
   *  'my-namespace:my-key'
   * ```
   * @property {String} namespace
   * @default ""
   */
  namespace: '',

  /**
   * @property {String} _namespace
   * @private
   */
  _namespace: Ember.computed('namespace', function () {
    let namespace = this.get('namespace');

    if(isBlank(namespace) && this.container) {
      const env = this.container.lookupFactory('config:environment');

      if(env.hasOwnProperty('APP') && env.APP.hasOwnProperty('storagekit')) {
        namespace = env.APP.storagekit.namespace;
      }
    }

    return namespace || '';
  }),

  /**
   * @method namespaceKey
   * @param {String} key A key to be namespaced.
   * @public
   */
  buildNamespace(key) {
    const namespace = this.get('_namespace');
    return isPresent(namespace) ? `${namespace}:${key}` : `${key}`;
  },

  /**
   * @method extractKey
   */
  extractKey(key) {
    Ember.assert(`${key} is not a namespaced key`, this.isNamespacedKey(key));

    const length = this.get('_namespace.length');
    const sliceIndex = length === 0 ? 0 : length + 1;

    return `${key}`.slice(sliceIndex);
  },

  /**
   * Determines whether or not a provided key is namespaced.
   * @method isNamespaced
   * @param {string} key The key to check the namespace status of.
   */
  isNamespacedKey(key) {
    return `${key}`.indexOf(this.buildNamespace('')) === 0;
  }
});
