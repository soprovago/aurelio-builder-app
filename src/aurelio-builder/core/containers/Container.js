/**
 * Container - Sistema de contenedores inspirado en Elementor
 * 
 * Implementa la arquitectura de contenedores jerárquicos de Elementor,
 * con soporte completo para parent-child relationships, validación,
 * eventos y gestión de estado.
 * 
 * @version 1.0.0
 * @author Aurelio Builder Team
 */

import { EventEmitter } from 'events';

/**
 * Clase base para todos los contenedores
 */
class Container extends EventEmitter {
  constructor(args = {}) {
    super();
    
    // Validar argumentos requeridos
    this._validateArgs(args);
    
    // Propiedades principales (inspiradas en Elementor)
    this.id = args.id || this._generateId();
    this.type = args.type;
    this.elType = args.elType || 'element';
    
    // Modelos y configuración
    this.model = args.model || null;
    this.settings = args.settings || new Map();
    this.props = args.props || {};
    
    // Jerarquía
    this.parent = args.parent || null;
    this.children = [];
    
    // Metadatos
    this.label = args.label || this._generateLabel();
    this.document = args.document || null;
    
    // Control y gestión
    this.controls = args.controls || {};
    this.view = null;
    this.renderer = args.renderer || this;
    
    // Estado
    this.isActive = false;
    this.isSelected = false;
    this.isLocked = args.isLocked || false;
    this.isVisible = args.isVisible !== false;
    
    // Timing
    this.createdAt = Date.now();
    this.updatedAt = Date.now();
    
    // Inicializar
    this._initialize(args);
  }

  /**
   * Inicialización del contenedor
   * @param {Object} args - Argumentos de inicialización
   * @private
   */
  _initialize(args) {
    // Conectar con el parent si existe
    if (this.parent) {
      this._addToParent();
    }
    
    // Procesar children si los hay
    if (args.children && Array.isArray(args.children)) {
      args.children.forEach(child => this.appendChild(child));
    }
    
    // Emitir evento de inicialización
    this.emit('initialized', this);
    
    console.log(`📦 Container "${this.id}" (${this.type}) initialized`);
  }

  /**
   * Validar argumentos del constructor
   * @param {Object} args - Argumentos a validar
   * @private
   */
  _validateArgs(args) {
    if (!args.type) {
      throw new Error('Container requires a type');
    }
    
    if (args.parent && !(args.parent instanceof Container)) {
      throw new Error('Parent must be a Container instance');
    }
  }

  /**
   * Agregar un hijo al contenedor
   * @param {Container|Object} child - Contenedor hijo o datos para crearlo
   * @param {number} index - Índice donde insertar (opcional)
   * @returns {Container} - El contenedor hijo agregado
   */
  appendChild(child, index = null) {
    // Crear Container si es necesario
    if (!(child instanceof Container)) {
      child = new Container({
        ...child,
        parent: this,
        document: this.document,
      });
    }
    
    // Validar si el hijo es válido
    if (!this._isValidChild(child)) {
      throw new Error(`Child of type "${child.type}" is not valid for parent "${this.type}"`);
    }
    
    // Remover de parent anterior si lo tiene
    if (child.parent && child.parent !== this) {
      child.parent.removeChild(child.id);
    }
    
    // Establecer relación parent-child
    child.parent = this;
    
    // Agregar a la lista de hijos
    if (index !== null && index >= 0 && index < this.children.length) {
      this.children.splice(index, 0, child);
    } else {
      this.children.push(child);
    }
    
    // Actualizar timestamps
    this.updatedAt = Date.now();
    
    // Emitir eventos
    this.emit('child:added', child, index);
    child.emit('parent:changed', this);
    
    console.log(`➕ Child "${child.id}" added to "${this.id}"`);
    return child;
  }

  /**
   * Remover un hijo del contenedor
   * @param {string|Container} childId - ID del hijo o instancia del contenedor
   * @returns {Container|null} - El contenedor removido o null
   */
  removeChild(childId) {
    const id = typeof childId === 'string' ? childId : childId.id;
    const index = this.children.findIndex(child => child.id === id);
    
    if (index === -1) {
      console.warn(`Child "${id}" not found in "${this.id}"`);
      return null;
    }
    
    const child = this.children[index];
    
    // Remover de la lista
    this.children.splice(index, 1);
    
    // Limpiar relación parent
    child.parent = null;
    
    // Actualizar timestamp
    this.updatedAt = Date.now();
    
    // Emitir eventos
    this.emit('child:removed', child, index);
    child.emit('parent:changed', null);
    
    console.log(`➖ Child "${id}" removed from "${this.id}"`);
    return child;
  }

  /**
   * Mover un hijo a otra posición
   * @param {string} childId - ID del hijo a mover
   * @param {number} newIndex - Nueva posición
   * @returns {boolean} - Si la operación fue exitosa
   */
  moveChild(childId, newIndex) {
    const oldIndex = this.children.findIndex(child => child.id === childId);
    
    if (oldIndex === -1) {
      console.warn(`Child "${childId}" not found in "${this.id}"`);
      return false;
    }
    
    if (newIndex < 0 || newIndex >= this.children.length) {
      console.warn(`Invalid index ${newIndex} for container "${this.id}"`);
      return false;
    }
    
    if (oldIndex === newIndex) {
      return true; // No hay que hacer nada
    }
    
    // Mover el elemento
    const [child] = this.children.splice(oldIndex, 1);
    this.children.splice(newIndex, 0, child);
    
    // Actualizar timestamp
    this.updatedAt = Date.now();
    
    // Emitir evento
    this.emit('child:moved', child, oldIndex, newIndex);
    
    console.log(`🔄 Child "${childId}" moved from ${oldIndex} to ${newIndex} in "${this.id}"`);
    return true;
  }

  /**
   * Obtener un hijo por ID
   * @param {string} childId - ID del hijo
   * @returns {Container|null}
   */
  getChild(childId) {
    return this.children.find(child => child.id === childId) || null;
  }

  /**
   * Obtener todos los hijos recursivamente
   * @returns {Array<Container>}
   */
  getAllChildren() {
    const result = [];
    
    for (const child of this.children) {
      result.push(child);
      result.push(...child.getAllChildren());
    }
    
    return result;
  }

  /**
   * Obtener la jerarquía de padres hasta la raíz
   * @returns {Array<Container>}
   */
  getParentAncestry() {
    const ancestry = [];
    let current = this.parent;
    
    while (current) {
      ancestry.push(current);
      current = current.parent;
    }
    
    return ancestry;
  }

  /**
   * Obtener el contenedor raíz
   * @returns {Container}
   */
  getRoot() {
    let root = this;
    while (root.parent) {
      root = root.parent;
    }
    return root;
  }

  /**
   * Verificar si este contenedor es ancestro de otro
   * @param {Container} container - Contenedor a verificar
   * @returns {boolean}
   */
  isAncestorOf(container) {
    return container.getParentAncestry().includes(this);
  }

  /**
   * Verificar si este contenedor es descendiente de otro
   * @param {Container} container - Contenedor a verificar
   * @returns {boolean}
   */
  isDescendantOf(container) {
    return this.getParentAncestry().includes(container);
  }

  /**
   * Buscar contenedor por ID recursivamente
   * @param {string} id - ID a buscar
   * @returns {Container|null}
   */
  findById(id) {
    if (this.id === id) {
      return this;
    }
    
    for (const child of this.children) {
      const found = child.findById(id);
      if (found) {
        return found;
      }
    }
    
    return null;
  }

  /**
   * Buscar contenedores por tipo
   * @param {string} type - Tipo a buscar
   * @returns {Array<Container>}
   */
  findByType(type) {
    const results = [];
    
    if (this.type === type) {
      results.push(this);
    }
    
    for (const child of this.children) {
      results.push(...child.findByType(type));
    }
    
    return results;
  }

  /**
   * Clonar el contenedor (deep copy)
   * @param {Object} overrides - Propiedades a sobrescribir
   * @returns {Container}
   */
  clone(overrides = {}) {
    const clonedData = {
      type: this.type,
      elType: this.elType,
      props: { ...this.props },
      settings: new Map(this.settings),
      controls: { ...this.controls },
      label: this.label + ' (Copy)',
      isLocked: this.isLocked,
      isVisible: this.isVisible,
      children: this.children.map(child => child.clone()),
      ...overrides,
    };
    
    const cloned = new Container(clonedData);
    
    console.log(`📄 Container "${this.id}" cloned as "${cloned.id}"`);
    return cloned;
  }

  /**
   * Serializar el contenedor a JSON
   * @returns {Object}
   */
  toJSON() {
    return {
      id: this.id,
      type: this.type,
      elType: this.elType,
      props: this.props,
      settings: Object.fromEntries(this.settings),
      label: this.label,
      isLocked: this.isLocked,
      isVisible: this.isVisible,
      children: this.children.map(child => child.toJSON()),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  /**
   * Deserializar desde JSON
   * @param {Object} data - Datos JSON
   * @param {Container} parent - Contenedor padre (opcional)
   * @returns {Container}
   */
  static fromJSON(data, parent = null) {
    const container = new Container({
      ...data,
      parent,
      settings: new Map(Object.entries(data.settings || {})),
      children: [], // Los procesaremos después
    });
    
    // Procesar hijos recursivamente
    if (data.children && Array.isArray(data.children)) {
      data.children.forEach(childData => {
        const child = Container.fromJSON(childData, container);
        container.children.push(child);
      });
    }
    
    return container;
  }

  // Métodos privados
  _generateId() {
    return `container_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  _generateLabel() {
    return `${this.type.charAt(0).toUpperCase()}${this.type.slice(1)}`;
  }

  _addToParent() {
    if (this.parent && !this.parent.children.includes(this)) {
      this.parent.children.push(this);
    }
  }

  _isValidChild(child) {
    // Implementar lógica de validación específica según el tipo
    // Por ejemplo, un "text" no puede contener hijos
    
    if (this.type === 'text' || this.type === 'image' || this.type === 'button') {
      return false; // Estos elementos no pueden tener hijos
    }
    
    // Los contenedores pueden contener cualquier cosa por defecto
    return true;
  }

  // Getters útiles
  get hasChildren() {
    return this.children.length > 0;
  }

  get hasParent() {
    return this.parent !== null;
  }

  get isRoot() {
    return !this.hasParent;
  }

  get depth() {
    return this.getParentAncestry().length;
  }

  get path() {
    const ancestry = this.getParentAncestry().reverse();
    return [...ancestry.map(c => c.id), this.id].join('/');
  }

  // Método para debug
  debug() {
    console.group(`🔍 Container "${this.id}" Debug Info`);
    console.log('Type:', this.type);
    console.log('Parent:', this.parent?.id || 'none');
    console.log('Children:', this.children.map(c => c.id));
    console.log('Depth:', this.depth);
    console.log('Path:', this.path);
    console.log('Props:', this.props);
    console.log('Settings:', Object.fromEntries(this.settings));
    console.groupEnd();
  }
}

export default Container;