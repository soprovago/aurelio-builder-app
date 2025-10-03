/**
 * ElementsManager - Gestor principal de elementos inspirado en Elementor
 * 
 * Gestiona la creación, registro y operaciones de todos los elementos del builder,
 * siguiendo los patrones arquitectónicos de Elementor para máxima extensibilidad.
 * 
 * @version 1.0.0
 * @author Aurelio Builder Team
 */

import { EventEmitter } from 'events';
import elementRegistry from '../registry/ElementRegistry.js';
import Container from '../containers/Container.js';
import commandManager from '../commands/CommandManager.js';

class ElementsManager extends EventEmitter {
  constructor() {
    super();
    
    /**
     * Referencia al registro de elementos
     * @type {ElementRegistry}
     */
    this.registry = elementRegistry;
    
    /**
     * Instancias activas de elementos
     * @type {Map<string, Container>}
     */
    this.instances = new Map();
    
    /**
     * Configuración del manager
     * @type {Object}
     */
    this.config = {
      autoRegisterBuiltins: true,
      validateOnCreation: true,
      trackInstances: true,
    };

    this._initialize();
  }

  /**
   * Inicialización del manager
   * @private
   */
  _initialize() {
    if (this.config.autoRegisterBuiltins) {
      this._registerBuiltinElements();
    }

    this._registerCommands();
    
    console.log('🎯 ElementsManager initialized');
  }

  /**
   * Crear una instancia de elemento
   * @param {string} type - Tipo de elemento
   * @param {Object} props - Propiedades del elemento
   * @param {Object} options - Opciones adicionales
   * @returns {Container} - Instancia del elemento creado
   */
  createElement(type, props = {}, options = {}) {
    console.log(`🏗️ Creating element: ${type}`);

    // Verificar si el elemento está registrado
    if (!this.registry.has(type)) {
      throw new Error(`Element type "${type}" is not registered`);
    }

    // Obtener configuración del elemento
    const elementConfig = this.registry.get(type);
    
    // Crear el contenedor
    const container = new Container({
      type,
      elType: elementConfig.type || 'element',
      props: { ...elementConfig.defaultProps, ...props },
      label: elementConfig.label || elementConfig.name,
      ...options,
    });

    // Trackear instancia si está habilitado
    if (this.config.trackInstances) {
      this.instances.set(container.id, container);
      
      // Cleanup cuando se destruya
      container.once('destroyed', () => {
        this.instances.delete(container.id);
      });
    }

    // Validar si está habilitado
    if (this.config.validateOnCreation) {
      this._validateElement(container);
    }

    // Emitir eventos
    this.emit('element:created', container);
    this.emit(`element:created:${type}`, container);

    console.log(`✅ Element "${type}" created with ID: ${container.id}`);
    return container;
  }

  /**
   * Obtener una instancia de elemento por ID
   * @param {string} id - ID del elemento
   * @returns {Container|null}
   */
  getInstance(id) {
    return this.instances.get(id) || null;
  }

  /**
   * Obtener todas las instancias de un tipo específico
   * @param {string} type - Tipo de elemento
   * @returns {Array<Container>}
   */
  getInstancesByType(type) {
    return Array.from(this.instances.values())
      .filter(instance => instance.type === type);
  }

  /**
   * Obtener todas las instancias activas
   * @returns {Array<Container>}
   */
  getAllInstances() {
    return Array.from(this.instances.values());
  }

  /**
   * Destruir una instancia de elemento
   * @param {string} id - ID del elemento
   * @returns {boolean}
   */
  destroyInstance(id) {
    const instance = this.instances.get(id);
    
    if (!instance) {
      console.warn(`Instance "${id}" not found`);
      return false;
    }

    // Emitir eventos antes de destruir
    this.emit('element:destroying', instance);
    instance.emit('destroying');

    // Remover de parent si lo tiene
    if (instance.parent) {
      instance.parent.removeChild(id);
    }

    // Destruir children recursivamente
    [...instance.children].forEach(child => {
      this.destroyInstance(child.id);
    });

    // Cleanup
    this.instances.delete(id);
    instance.emit('destroyed');
    instance.removeAllListeners();

    console.log(`🗑️ Element "${id}" destroyed`);
    return true;
  }

  /**
   * Clonar un elemento existente
   * @param {string} id - ID del elemento a clonar
   * @param {Object} overrides - Propiedades a sobrescribir
   * @returns {Container|null}
   */
  cloneElement(id, overrides = {}) {
    const source = this.getInstance(id);
    
    if (!source) {
      console.error(`Cannot clone element "${id}": not found`);
      return null;
    }

    // Clonar el contenedor
    const cloned = source.clone(overrides);

    // Trackear la nueva instancia
    if (this.config.trackInstances) {
      this.instances.set(cloned.id, cloned);
    }

    // Emitir eventos
    this.emit('element:cloned', cloned, source);

    console.log(`📄 Element "${id}" cloned as "${cloned.id}"`);
    return cloned;
  }

  /**
   * Buscar elementos por criterios
   * @param {Object} criteria - Criterios de búsqueda
   * @returns {Array<Container>}
   */
  findElements(criteria = {}) {
    let results = Array.from(this.instances.values());

    // Filtrar por tipo
    if (criteria.type) {
      results = results.filter(el => el.type === criteria.type);
    }

    // Filtrar por parent
    if (criteria.parent) {
      results = results.filter(el => el.parent?.id === criteria.parent);
    }

    // Filtrar por propiedades
    if (criteria.props) {
      results = results.filter(el => {
        return Object.entries(criteria.props).every(([key, value]) => {
          return el.props[key] === value;
        });
      });
    }

    // Filtrar por estado
    if (criteria.isSelected !== undefined) {
      results = results.filter(el => el.isSelected === criteria.isSelected);
    }

    if (criteria.isVisible !== undefined) {
      results = results.filter(el => el.isVisible === criteria.isVisible);
    }

    return results;
  }

  /**
   * Actualizar propiedades de un elemento
   * @param {string} id - ID del elemento
   * @param {Object} props - Nuevas propiedades
   * @returns {boolean}
   */
  updateElementProps(id, props) {
    const element = this.getInstance(id);
    
    if (!element) {
      console.error(`Cannot update element "${id}": not found`);
      return false;
    }

    const oldProps = { ...element.props };
    
    // Actualizar propiedades
    Object.assign(element.props, props);
    element.updatedAt = Date.now();

    // Emitir eventos
    this.emit('element:updated', element, oldProps, props);
    element.emit('updated', oldProps, props);

    console.log(`📝 Element "${id}" props updated`);
    return true;
  }

  /**
   * Mover elemento a otro contenedor
   * @param {string} elementId - ID del elemento a mover
   * @param {string} targetId - ID del contenedor destino
   * @param {number} index - Índice donde insertar
   * @returns {boolean}
   */
  moveElement(elementId, targetId, index = null) {
    const element = this.getInstance(elementId);
    const target = this.getInstance(targetId);

    if (!element) {
      console.error(`Cannot move element "${elementId}": not found`);
      return false;
    }

    if (targetId && !target) {
      console.error(`Cannot move to target "${targetId}": not found`);
      return false;
    }

    // Remover del parent actual
    const oldParent = element.parent;
    if (oldParent) {
      oldParent.removeChild(elementId);
    }

    // Agregar al nuevo parent
    if (target) {
      target.appendChild(element, index);
    } else {
      element.parent = null;
    }

    // Emitir eventos
    this.emit('element:moved', element, oldParent, target);

    console.log(`🔄 Element "${elementId}" moved to "${targetId || 'root'}"`);
    return true;
  }

  /**
   * Obtener estadísticas del manager
   * @returns {Object}
   */
  getStats() {
    const instancesByType = {};
    
    this.instances.forEach(instance => {
      instancesByType[instance.type] = (instancesByType[instance.type] || 0) + 1;
    });

    return {
      totalInstances: this.instances.size,
      registeredTypes: this.registry.getStats().totalElements,
      instancesByType,
      categories: this.registry.getCategories().length,
    };
  }

  /**
   * Serializar todos los elementos a JSON
   * @returns {Array}
   */
  serialize() {
    return Array.from(this.instances.values())
      .filter(instance => !instance.parent) // Solo elementos raíz
      .map(instance => instance.toJSON());
  }

  /**
   * Deserializar elementos desde JSON
   * @param {Array} data - Datos JSON
   * @returns {Array<Container>}
   */
  deserialize(data) {
    const elements = [];
    
    for (const elementData of data) {
      try {
        const element = Container.fromJSON(elementData);
        
        if (this.config.trackInstances) {
          this._trackElementRecursively(element);
        }
        
        elements.push(element);
      } catch (error) {
        console.error('Error deserializing element:', error, elementData);
      }
    }

    return elements;
  }

  // Métodos privados
  _validateElement(element) {
    const elementConfig = this.registry.get(element.type);
    
    if (!elementConfig) {
      throw new Error(`Element type "${element.type}" not found in registry`);
    }

    // Validaciones básicas
    if (!element.id) {
      throw new Error('Element must have an ID');
    }

    // Validaciones específicas del tipo pueden añadirse aquí
  }

  _trackElementRecursively(element) {
    this.instances.set(element.id, element);
    
    element.children.forEach(child => {
      this._trackElementRecursively(child);
    });
  }

  _registerBuiltinElements() {
    // Registrar elementos básicos
    const builtinElements = [
      {
        name: 'container',
        type: 'container',
        category: 'layout',
        icon: 'eicon-columns',
        label: 'Contenedor',
        defaultProps: {
          padding: '20px',
          backgroundColor: 'transparent',
          borderRadius: '0px',
          minHeight: '100px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        },
      },
      {
        name: 'text',
        type: 'widget',
        category: 'basic',
        icon: 'eicon-text',
        label: 'Texto',
        defaultProps: {
          text: 'Texto de ejemplo',
          color: '#000000',
          fontSize: '16px',
          textAlign: 'left',
        },
      },
      {
        name: 'heading',
        type: 'widget',
        category: 'basic',
        icon: 'eicon-heading',
        label: 'Encabezado',
        defaultProps: {
          text: 'Encabezado',
          level: 1,
          color: '#000000',
          fontSize: '32px',
          textAlign: 'left',
        },
      },
      {
        name: 'image',
        type: 'widget',
        category: 'media',
        icon: 'eicon-image',
        label: 'Imagen',
        defaultProps: {
          src: '/api/placeholder/400/300',
          alt: 'Imagen',
          width: '100%',
          height: 'auto',
        },
      },
      {
        name: 'button',
        type: 'widget',
        category: 'basic',
        icon: 'eicon-button',
        label: 'Botón',
        defaultProps: {
          text: 'Haz clic aquí',
          backgroundColor: '#8b5cf6',
          textColor: '#ffffff',
          padding: '12px 24px',
          borderRadius: '8px',
        },
      },
    ];

    builtinElements.forEach(element => {
      this.registry.register(element.name, element);
    });

    console.log('🧱 Built-in elements registered');
  }

  _registerCommands() {
    // Comando para crear elementos
    commandManager.register('elements/create', {
      execute: ({ type, props, options }) => {
        return this.createElement(type, props, options);
      },
      validateArgs: (args) => {
        if (!args.type) {
          throw new Error('Element type is required');
        }
      },
      getDescription: () => 'Create a new element instance',
    });

    // Comando para mover elementos
    commandManager.register('elements/move', {
      execute: ({ elementId, targetId, index }) => {
        return this.moveElement(elementId, targetId, index);
      },
      validateArgs: (args) => {
        if (!args.elementId) {
          throw new Error('Element ID is required');
        }
      },
      getDescription: () => 'Move an element to another container',
    });

    // Comando para actualizar elementos
    commandManager.register('elements/update', {
      execute: ({ id, props }) => {
        return this.updateElementProps(id, props);
      },
      validateArgs: (args) => {
        if (!args.id || !args.props) {
          throw new Error('Element ID and props are required');
        }
      },
      getDescription: () => 'Update element properties',
    });

    // Comando para clonar elementos
    commandManager.register('elements/clone', {
      execute: ({ id, overrides }) => {
        return this.cloneElement(id, overrides);
      },
      validateArgs: (args) => {
        if (!args.id) {
          throw new Error('Element ID is required');
        }
      },
      getDescription: () => 'Clone an existing element',
    });

    // Comando para destruir elementos
    commandManager.register('elements/destroy', {
      execute: ({ id }) => {
        return this.destroyInstance(id);
      },
      validateArgs: (args) => {
        if (!args.id) {
          throw new Error('Element ID is required');
        }
      },
      getDescription: () => 'Destroy an element instance',
    });

    console.log('⚡ ElementsManager commands registered');
  }

  // Método para debug
  debug() {
    console.group('🔍 ElementsManager Debug Info');
    console.log('Stats:', this.getStats());
    console.log('Active Instances:', this.instances.size);
    console.log('Registry Stats:', this.registry.getStats());
    console.groupEnd();
  }
}

// Singleton instance
const elementsManager = new ElementsManager();

export default elementsManager;