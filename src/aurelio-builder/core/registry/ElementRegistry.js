/**
 * ElementRegistry - Sistema de registro de elementos inspirado en Elementor
 * 
 * Gestiona el registro centralizado de todos los elementos disponibles,
 * siguiendo el patrón Registry de Elementor para extensibilidad y mantenabilidad.
 * 
 * @version 1.0.0
 * @author Aurelio Builder Team
 */
class ElementRegistry {
  constructor() {
    /**
     * Registry de elementos registrados
     * @type {Map<string, ElementType>}
     */
    this._elements = new Map();
    
    /**
     * Categorías de elementos
     * @type {Map<string, Category>}
     */
    this._categories = new Map();
    
    /**
     * Factory instances para crear elementos
     * @type {Map<string, Function>}
     */
    this._factories = new Map();
    
    /**
     * Elementos cargados dinámicamente
     * @type {Set<string>}
     */
    this._loadedElements = new Set();

    this._initializeDefaultCategories();
  }

  /**
   * Registrar un nuevo tipo de elemento
   * @param {string} name - Nombre del elemento
   * @param {Object} elementData - Datos del elemento
   * @param {Function} factory - Factory function para crear instancias
   */
  register(name, elementData, factory = null) {
    if (this._elements.has(name)) {
      console.warn(`Element "${name}" is already registered. Overriding...`);
    }

    // Validar datos del elemento
    this._validateElementData(name, elementData);

    // Registrar elemento
    this._elements.set(name, {
      name,
      ...elementData,
      registeredAt: Date.now(),
    });

    // Registrar factory si se proporciona
    if (factory && typeof factory === 'function') {
      this._factories.set(name, factory);
    }

    // Agregar a categoría
    if (elementData.category) {
      this._addToCategory(elementData.category, name);
    }

    console.log(`✅ Element "${name}" registered successfully`);
    return true;
  }

  /**
   * Desregistrar un elemento
   * @param {string} name - Nombre del elemento
   */
  unregister(name) {
    if (!this._elements.has(name)) {
      console.warn(`Element "${name}" is not registered`);
      return false;
    }

    const element = this._elements.get(name);
    
    // Remover de categoría
    if (element.category) {
      this._removeFromCategory(element.category, name);
    }

    // Limpiar registros
    this._elements.delete(name);
    this._factories.delete(name);
    this._loadedElements.delete(name);

    console.log(`🗑️ Element "${name}" unregistered`);
    return true;
  }

  /**
   * Obtener un elemento registrado
   * @param {string} name - Nombre del elemento
   * @returns {Object|null}
   */
  get(name) {
    return this._elements.get(name) || null;
  }

  /**
   * Verificar si un elemento está registrado
   * @param {string} name - Nombre del elemento
   * @returns {boolean}
   */
  has(name) {
    return this._elements.has(name);
  }

  /**
   * Obtener todos los elementos registrados
   * @param {Object} filters - Filtros opcionales
   * @returns {Array}
   */
  getAll(filters = {}) {
    let elements = Array.from(this._elements.values());

    // Aplicar filtros
    if (filters.category) {
      elements = elements.filter(el => el.category === filters.category);
    }

    if (filters.type) {
      elements = elements.filter(el => el.type === filters.type);
    }

    if (filters.active !== undefined) {
      elements = elements.filter(el => el.active === filters.active);
    }

    return elements;
  }

  /**
   * Crear instancia de un elemento
   * @param {string} name - Nombre del elemento
   * @param {Object} props - Props para el elemento
   * @param {Object} options - Opciones adicionales
   * @returns {Object|null}
   */
  createElement(name, props = {}, options = {}) {
    if (!this.has(name)) {
      console.error(`Cannot create element "${name}": not registered`);
      return null;
    }

    const element = this.get(name);
    const factory = this._factories.get(name);

    // Usar factory si está disponible
    if (factory) {
      try {
        return factory(props, options, element);
      } catch (error) {
        console.error(`Error creating element "${name}" with factory:`, error);
        return null;
      }
    }

    // Crear elemento básico
    return this._createBasicElement(element, props, options);
  }

  /**
   * Obtener elementos por categoría
   * @param {string} categoryName - Nombre de la categoría
   * @returns {Array}
   */
  getByCategory(categoryName) {
    const category = this._categories.get(categoryName);
    if (!category) {
      return [];
    }

    return category.elements.map(name => this.get(name)).filter(Boolean);
  }

  /**
   * Registrar una nueva categoría
   * @param {string} name - Nombre de la categoría
   * @param {Object} categoryData - Datos de la categoría
   */
  registerCategory(name, categoryData) {
    if (this._categories.has(name)) {
      console.warn(`Category "${name}" already exists. Updating...`);
    }

    this._categories.set(name, {
      name,
      elements: this._categories.get(name)?.elements || [],
      ...categoryData,
    });

    console.log(`📁 Category "${name}" registered`);
  }

  /**
   * Obtener todas las categorías
   * @returns {Array}
   */
  getCategories() {
    return Array.from(this._categories.values());
  }

  /**
   * Cargar elemento dinámicamente
   * @param {string} name - Nombre del elemento
   * @param {Function} loader - Función de carga
   */
  async loadElement(name, loader) {
    if (this._loadedElements.has(name)) {
      return this.get(name);
    }

    try {
      const elementModule = await loader();
      const elementData = elementModule.default || elementModule;
      
      if (elementData.register) {
        elementData.register(this);
      } else {
        this.register(name, elementData);
      }

      this._loadedElements.add(name);
      return this.get(name);
    } catch (error) {
      console.error(`Failed to load element "${name}":`, error);
      return null;
    }
  }

  /**
   * Obtener estadísticas del registry
   * @returns {Object}
   */
  getStats() {
    return {
      totalElements: this._elements.size,
      totalCategories: this._categories.size,
      loadedElements: this._loadedElements.size,
      elementsWithFactories: this._factories.size,
    };
  }

  // Métodos privados
  _validateElementData(name, elementData) {
    const required = ['type', 'icon', 'defaultProps'];
    const missing = required.filter(field => !elementData.hasOwnProperty(field));
    
    if (missing.length > 0) {
      throw new Error(`Element "${name}" is missing required fields: ${missing.join(', ')}`);
    }
  }

  _initializeDefaultCategories() {
    const defaultCategories = [
      { name: 'basic', label: 'Básicos', icon: 'eicon-elementor-circle' },
      { name: 'layout', label: 'Diseño', icon: 'eicon-columns' },
      { name: 'content', label: 'Contenido', icon: 'eicon-document-file' },
      { name: 'media', label: 'Media', icon: 'eicon-gallery-grid' },
      { name: 'forms', label: 'Formularios', icon: 'eicon-form-horizontal' },
      { name: 'advanced', label: 'Avanzados', icon: 'eicon-pro-icon' },
    ];

    defaultCategories.forEach(category => {
      this.registerCategory(category.name, category);
    });
  }

  _addToCategory(categoryName, elementName) {
    if (!this._categories.has(categoryName)) {
      this.registerCategory(categoryName, { label: categoryName });
    }

    const category = this._categories.get(categoryName);
    if (!category.elements.includes(elementName)) {
      category.elements.push(elementName);
    }
  }

  _removeFromCategory(categoryName, elementName) {
    const category = this._categories.get(categoryName);
    if (category) {
      category.elements = category.elements.filter(name => name !== elementName);
    }
  }

  _createBasicElement(element, props, options) {
    return {
      id: this._generateId(),
      type: element.name,
      elType: element.type,
      props: { ...element.defaultProps, ...props },
      settings: {},
      children: [],
      createdAt: Date.now(),
      ...options,
    };
  }

  _generateId() {
    return `element_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Método para debug
  debug() {
    console.group('🔍 ElementRegistry Debug Info');
    console.log('Stats:', this.getStats());
    console.log('Registered Elements:', Array.from(this._elements.keys()));
    console.log('Categories:', Array.from(this._categories.keys()));
    console.log('Loaded Elements:', Array.from(this._loadedElements));
    console.groupEnd();
  }
}

// Singleton instance
const elementRegistry = new ElementRegistry();

export default elementRegistry;