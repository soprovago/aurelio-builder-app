/**
 * HookManager - Sistema de hooks y eventos inspirado en Elementor
 * 
 * Implementa un sistema extensible de hooks (filtros) y eventos (acciones)
 * similar al de WordPress y Elementor para máxima flexibilidad.
 * 
 * @version 1.0.0
 * @author Aurelio Builder Team
 */

import { EventEmitter } from 'events';

class HookManager extends EventEmitter {
  constructor() {
    super();
    
    /**
     * Registry de filters (hooks de filtrado)
     * @type {Map<string, Array>}
     */
    this.filters = new Map();
    
    /**
     * Registry de actions (hooks de acción)
     * @type {Map<string, Array>}
     */
    this.actions = new Map();
    
    /**
     * Caché para optimizar filters frecuentes
     * @type {Map<string, any>}
     */
    this.filterCache = new Map();
    
    /**
     * Configuración del manager
     * @type {Object}
     */
    this.config = {
      enableCache: true,
      maxCacheSize: 100,
      debug: false,
    };

    console.log('🎣 HookManager initialized');
  }

  /**
   * Agregar un filter hook
   * @param {string} tag - Nombre del filter
   * @param {Function} callback - Función callback
   * @param {number} priority - Prioridad (menor número = mayor prioridad)
   * @returns {HookManager}
   */
  addFilter(tag, callback, priority = 10) {
    if (typeof callback !== 'function') {
      throw new Error('Filter callback must be a function');
    }

    if (!this.filters.has(tag)) {
      this.filters.set(tag, []);
    }

    const filters = this.filters.get(tag);
    
    // Agregar el filter con prioridad
    filters.push({
      callback,
      priority,
      id: this._generateHookId(),
    });

    // Ordenar por prioridad (menor número = mayor prioridad)
    filters.sort((a, b) => a.priority - b.priority);

    // Limpiar caché relacionado
    this._clearFilterCache(tag);

    if (this.config.debug) {
      console.log(`🎯 Filter added: ${tag} (priority: ${priority})`);
    }

    return this;
  }

  /**
   * Remover un filter hook
   * @param {string} tag - Nombre del filter
   * @param {Function|string} callbackOrId - Función callback o ID del hook
   * @returns {boolean}
   */
  removeFilter(tag, callbackOrId) {
    if (!this.filters.has(tag)) {
      return false;
    }

    const filters = this.filters.get(tag);
    const initialLength = filters.length;

    // Filtrar por callback o ID
    const newFilters = filters.filter(filter => {
      if (typeof callbackOrId === 'string') {
        return filter.id !== callbackOrId;
      }
      return filter.callback !== callbackOrId;
    });

    this.filters.set(tag, newFilters);

    // Limpiar caché si hubo cambios
    if (newFilters.length !== initialLength) {
      this._clearFilterCache(tag);
      
      if (this.config.debug) {
        console.log(`🗑️ Filter removed from: ${tag}`);
      }
      
      return true;
    }

    return false;
  }

  /**
   * Aplicar filters a un valor
   * @param {string} tag - Nombre del filter
   * @param {*} value - Valor a filtrar
   * @param {...*} args - Argumentos adicionales
   * @returns {*} - Valor filtrado
   */
  applyFilters(tag, value, ...args) {
    // Verificar caché si está habilitado
    if (this.config.enableCache) {
      const cacheKey = this._getCacheKey(tag, value, args);
      if (this.filterCache.has(cacheKey)) {
        return this.filterCache.get(cacheKey);
      }
    }

    if (!this.filters.has(tag)) {
      return value;
    }

    let filteredValue = value;
    const filters = this.filters.get(tag);

    for (const filter of filters) {
      try {
        filteredValue = filter.callback(filteredValue, ...args);
      } catch (error) {
        console.error(`Error in filter "${tag}":`, error);
        // Continuar con el siguiente filter
      }
    }

    // Guardar en caché si está habilitado
    if (this.config.enableCache) {
      const cacheKey = this._getCacheKey(tag, value, args);
      this._addToCache(cacheKey, filteredValue);
    }

    if (this.config.debug) {
      console.log(`🔄 Filter applied: ${tag}`, { original: value, filtered: filteredValue });
    }

    return filteredValue;
  }

  /**
   * Agregar un action hook
   * @param {string} tag - Nombre del action
   * @param {Function} callback - Función callback
   * @param {number} priority - Prioridad (menor número = mayor prioridad)
   * @returns {HookManager}
   */
  addAction(tag, callback, priority = 10) {
    if (typeof callback !== 'function') {
      throw new Error('Action callback must be a function');
    }

    if (!this.actions.has(tag)) {
      this.actions.set(tag, []);
    }

    const actions = this.actions.get(tag);
    
    // Agregar el action con prioridad
    actions.push({
      callback,
      priority,
      id: this._generateHookId(),
    });

    // Ordenar por prioridad
    actions.sort((a, b) => a.priority - b.priority);

    if (this.config.debug) {
      console.log(`⚡ Action added: ${tag} (priority: ${priority})`);
    }

    return this;
  }

  /**
   * Remover un action hook
   * @param {string} tag - Nombre del action
   * @param {Function|string} callbackOrId - Función callback o ID del hook
   * @returns {boolean}
   */
  removeAction(tag, callbackOrId) {
    if (!this.actions.has(tag)) {
      return false;
    }

    const actions = this.actions.get(tag);
    const initialLength = actions.length;

    // Filtrar por callback o ID
    const newActions = actions.filter(action => {
      if (typeof callbackOrId === 'string') {
        return action.id !== callbackOrId;
      }
      return action.callback !== callbackOrId;
    });

    this.actions.set(tag, newActions);

    if (newActions.length !== initialLength) {
      if (this.config.debug) {
        console.log(`🗑️ Action removed from: ${tag}`);
      }
      
      return true;
    }

    return false;
  }

  /**
   * Ejecutar actions
   * @param {string} tag - Nombre del action
   * @param {...*} args - Argumentos para las funciones
   * @returns {HookManager}
   */
  doAction(tag, ...args) {
    if (!this.actions.has(tag)) {
      return this;
    }

    const actions = this.actions.get(tag);

    for (const action of actions) {
      try {
        action.callback(...args);
      } catch (error) {
        console.error(`Error in action "${tag}":`, error);
        // Continuar con el siguiente action
      }
    }

    if (this.config.debug) {
      console.log(`🚀 Action executed: ${tag}`, args);
    }

    return this;
  }

  /**
   * Verificar si un hook existe
   * @param {string} tag - Nombre del hook
   * @param {string} type - Tipo de hook ('filter' | 'action')
   * @returns {boolean}
   */
  hasHook(tag, type = 'filter') {
    const registry = type === 'filter' ? this.filters : this.actions;
    return registry.has(tag) && registry.get(tag).length > 0;
  }

  /**
   * Obtener todos los hooks de un tag
   * @param {string} tag - Nombre del hook
   * @param {string} type - Tipo de hook ('filter' | 'action')
   * @returns {Array}
   */
  getHooks(tag, type = 'filter') {
    const registry = type === 'filter' ? this.filters : this.actions;
    return registry.get(tag) || [];
  }

  /**
   * Obtener estadísticas de hooks
   * @returns {Object}
   */
  getStats() {
    const filterCount = Array.from(this.filters.values())
      .reduce((sum, filters) => sum + filters.length, 0);
    
    const actionCount = Array.from(this.actions.values())
      .reduce((sum, actions) => sum + actions.length, 0);

    return {
      totalFilters: filterCount,
      totalActions: actionCount,
      filterTags: this.filters.size,
      actionTags: this.actions.size,
      cacheSize: this.filterCache.size,
      cacheEnabled: this.config.enableCache,
    };
  }

  /**
   * Limpiar todos los hooks
   * @param {string} type - Tipo a limpiar ('filter' | 'action' | 'all')
   */
  clear(type = 'all') {
    if (type === 'filter' || type === 'all') {
      this.filters.clear();
    }
    
    if (type === 'action' || type === 'all') {
      this.actions.clear();
    }
    
    if (type === 'all') {
      this.filterCache.clear();
    }

    console.log(`🧹 Hooks cleared: ${type}`);
  }

  /**
   * Configurar opciones del manager
   * @param {Object} options - Opciones de configuración
   */
  configure(options) {
    Object.assign(this.config, options);
    
    if (!this.config.enableCache) {
      this.filterCache.clear();
    }
  }

  // Métodos privados
  _generateHookId() {
    return `hook_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  _getCacheKey(tag, value, args) {
    // Crear una key simple basada en el tag y argumentos
    const argsHash = JSON.stringify(args).substring(0, 50);
    return `${tag}:${typeof value}:${argsHash}`;
  }

  _addToCache(key, value) {
    // Limpiar caché si supera el límite
    if (this.filterCache.size >= this.config.maxCacheSize) {
      const oldestKey = this.filterCache.keys().next().value;
      this.filterCache.delete(oldestKey);
    }

    this.filterCache.set(key, value);
  }

  _clearFilterCache(tag) {
    if (!this.config.enableCache) return;

    // Limpiar entradas de caché relacionadas con este tag
    for (const key of this.filterCache.keys()) {
      if (key.startsWith(`${tag}:`)) {
        this.filterCache.delete(key);
      }
    }
  }

  // Métodos de conveniencia inspirados en Elementor
  
  /**
   * Crear un namespace de hooks
   * @param {string} namespace - Nombre del namespace
   * @returns {Object} - Objeto con métodos del namespace
   */
  createNamespace(namespace) {
    return {
      addFilter: (tag, callback, priority) => 
        this.addFilter(`${namespace}:${tag}`, callback, priority),
      
      addAction: (tag, callback, priority) => 
        this.addAction(`${namespace}:${tag}`, callback, priority),
      
      applyFilters: (tag, value, ...args) => 
        this.applyFilters(`${namespace}:${tag}`, value, ...args),
      
      doAction: (tag, ...args) => 
        this.doAction(`${namespace}:${tag}`, ...args),
      
      removeFilter: (tag, callbackOrId) => 
        this.removeFilter(`${namespace}:${tag}`, callbackOrId),
      
      removeAction: (tag, callbackOrId) => 
        this.removeAction(`${namespace}:${tag}`, callbackOrId),
    };
  }

  /**
   * Crear hooks temporales que se auto-destruyen
   * @param {string} tag - Nombre del hook
   * @param {Function} callback - Función callback
   * @param {string} type - Tipo de hook ('filter' | 'action')
   * @param {number} maxExecutions - Número máximo de ejecuciones
   * @returns {string} - ID del hook temporal
   */
  createTemporaryHook(tag, callback, type = 'filter', maxExecutions = 1) {
    let executionCount = 0;
    const hookId = this._generateHookId();

    const wrappedCallback = (...args) => {
      executionCount++;
      
      const result = callback(...args);
      
      if (executionCount >= maxExecutions) {
        // Auto-remover después de las ejecuciones especificadas
        setTimeout(() => {
          if (type === 'filter') {
            this.removeFilter(tag, hookId);
          } else {
            this.removeAction(tag, hookId);
          }
        }, 0);
      }
      
      return result;
    };

    // Agregar el hook con el callback envuelto
    if (type === 'filter') {
      this.addFilter(tag, wrappedCallback);
    } else {
      this.addAction(tag, wrappedCallback);
    }

    return hookId;
  }

  // Método para debug
  debug() {
    console.group('🔍 HookManager Debug Info');
    console.log('Stats:', this.getStats());
    console.log('Filter Tags:', Array.from(this.filters.keys()));
    console.log('Action Tags:', Array.from(this.actions.keys()));
    console.log('Config:', this.config);
    console.groupEnd();
  }
}

// Singleton instance
const hookManager = new HookManager();

// Crear namespaces comunes
const builderHooks = hookManager.createNamespace('builder');
const editorHooks = hookManager.createNamespace('editor');
const elementsHooks = hookManager.createNamespace('elements');

export { HookManager, builderHooks, editorHooks, elementsHooks };
export default hookManager;