/**
 * Element Registry System
 * Sistema escalable para registrar y gestionar elementos del editor
 */

import { BASE_PROPERTIES } from '../shared/BaseProperties';

class ElementRegistry {
  constructor() {
    this.elements = new Map();
    this.categories = new Map();
  }

  /**
   * Registra un nuevo tipo de elemento
   * @param {Object} elementConfig - Configuración del elemento
   */
  register(elementConfig) {
    const {
      type,
      name,
      icon,
      category = 'basic',
      description = '',
      properties = {},
      defaultProps = {},
      renderComponent,
      propertyPanel,
      tags = [],
      version = '1.0.0'
    } = elementConfig;

    if (!type || !name || !renderComponent) {
      throw new Error('Element registration requires: type, name, and renderComponent');
    }

    // Merge custom properties with base properties
    const mergedProperties = {
      ...BASE_PROPERTIES,
      ...properties
    };

    // Merge default props with base defaults
    const mergedDefaultProps = {
      id: null,
      type,
      ...this.getDefaultPropsFromProperties(mergedProperties),
      ...defaultProps
    };

    const element = {
      type,
      name,
      icon,
      category,
      description,
      properties: mergedProperties,
      defaultProps: mergedDefaultProps,
      renderComponent,
      propertyPanel,
      tags,
      version,
      registeredAt: new Date().toISOString()
    };

    // Register element
    this.elements.set(type, element);

    // Register category if new
    if (!this.categories.has(category)) {
      this.categories.set(category, {
        name: category,
        elements: [],
        order: this.categories.size
      });
    }

    // Add element to category
    this.categories.get(category).elements.push(type);

    console.log(`✅ Element registered: ${type} v${version}`);
    
    return element;
  }

  /**
   * Obtiene un elemento por tipo
   * @param {string} type - Tipo de elemento
   */
  getElement(type) {
    return this.elements.get(type);
  }

  /**
   * Obtiene todos los elementos
   */
  getAllElements() {
    return Array.from(this.elements.values());
  }

  /**
   * Obtiene elementos por categoría
   * @param {string} category - Categoría
   */
  getElementsByCategory(category) {
    const categoryData = this.categories.get(category);
    if (!categoryData) return [];
    
    return categoryData.elements
      .map(type => this.elements.get(type))
      .filter(Boolean);
  }

  /**
   * Obtiene todas las categorías
   */
  getCategories() {
    return Array.from(this.categories.values()).sort((a, b) => a.order - b.order);
  }

  /**
   * Busca elementos por tags o nombre
   * @param {string} query - Query de búsqueda
   */
  search(query) {
    const searchQuery = query.toLowerCase();
    
    return this.getAllElements().filter(element => {
      return (
        element.name.toLowerCase().includes(searchQuery) ||
        element.description.toLowerCase().includes(searchQuery) ||
        element.tags.some(tag => tag.toLowerCase().includes(searchQuery))
      );
    });
  }

  /**
   * Crea una instancia de elemento con props por defecto
   * @param {string} type - Tipo de elemento
   * @param {Object} customProps - Props personalizadas
   */
  createElement(type, customProps = {}) {
    const element = this.elements.get(type);
    if (!element) {
      throw new Error(`Element type "${type}" not found in registry`);
    }

    return {
      id: this.generateId(),
      type,
      props: {
        ...element.defaultProps,
        ...customProps
      },
      children: customProps.children || [],
      createdAt: new Date().toISOString()
    };
  }

  /**
   * Valida las propiedades de un elemento
   * @param {string} type - Tipo de elemento
   * @param {Object} props - Propiedades a validar
   */
  validateElement(type, props) {
    const element = this.elements.get(type);
    if (!element) {
      return { valid: false, errors: [`Element type "${type}" not found`] };
    }

    const errors = [];
    const { properties } = element;

    // Validate each property
    Object.entries(props).forEach(([propName, propValue]) => {
      const propConfig = properties[propName];
      if (propConfig) {
        const validation = this.validateProperty(propName, propValue, propConfig);
        if (!validation.valid) {
          errors.push(`${propName}: ${validation.error}`);
        }
      }
    });

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Genera props por defecto basadas en las configuraciones de propiedades
   * @param {Object} properties - Configuraciones de propiedades
   */
  getDefaultPropsFromProperties(properties) {
    const defaultProps = {};
    
    Object.entries(properties).forEach(([propName, propConfig]) => {
      if (propConfig && propConfig.default !== undefined) {
        defaultProps[propName] = propConfig.default;
      }
    });

    return defaultProps;
  }

  /**
   * Valida una propiedad individual
   * @param {string} propertyName - Nombre de la propiedad
   * @param {*} value - Valor a validar
   * @param {Object} propertyConfig - Configuración de la propiedad
   */
  validateProperty(propertyName, value, propertyConfig) {
    if (!propertyConfig) {
      return { valid: false, error: 'Property config not found' };
    }

    const { type, min, max, options, required } = propertyConfig;

    // Check if required
    if (required && (value === undefined || value === null || value === '')) {
      return { valid: false, error: 'This property is required' };
    }

    // Type-specific validation
    switch (type) {
      case 'select':
        if (options && value && !options.find(opt => opt.value === value)) {
          return { valid: false, error: 'Invalid option selected' };
        }
        break;

      case 'slider':
        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
          return { valid: false, error: 'Must be a valid number' };
        }
        if (min !== undefined && numValue < min) {
          return { valid: false, error: `Value must be >= ${min}` };
        }
        if (max !== undefined && numValue > max) {
          return { valid: false, error: `Value must be <= ${max}` };
        }
        break;

      case 'color':
        if (value && !value.match(/^(#[0-9A-Fa-f]{3,8}|transparent|rgba?\(.*\))$/)) {
          return { valid: false, error: 'Invalid color format' };
        }
        break;
    }

    return { valid: true };
  }

  /**
   * Genera un ID único para elementos
   */
  generateId() {
    return `element_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Obtiene estadísticas del registry
   */
  getStats() {
    return {
      totalElements: this.elements.size,
      totalCategories: this.categories.size,
      elementsByCategory: Object.fromEntries(
        Array.from(this.categories.entries()).map(([category, data]) => [
          category,
          data.elements.length
        ])
      )
    };
  }

  /**
   * Desregistra un elemento
   * @param {string} type - Tipo de elemento a desregistrar
   */
  unregister(type) {
    const element = this.elements.get(type);
    if (!element) return false;

    // Remove from elements
    this.elements.delete(type);

    // Remove from category
    const category = this.categories.get(element.category);
    if (category) {
      const index = category.elements.indexOf(type);
      if (index > -1) {
        category.elements.splice(index, 1);
      }
    }

    console.log(`❌ Element unregistered: ${type}`);
    return true;
  }

  /**
   * Limpia todos los elementos registrados
   */
  clear() {
    this.elements.clear();
    this.categories.clear();
    console.log('🧹 Element registry cleared');
  }
}

// Crear instancia singleton
const elementRegistry = new ElementRegistry();

export default elementRegistry;
export { ElementRegistry };