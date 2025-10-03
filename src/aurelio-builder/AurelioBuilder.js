/**
 * AurelioBuilder - Clase principal del builder inspirada en Elementor
 * 
 * Orquesta toda la arquitectura del builder, proporcionando una interfaz
 * unificada similar a la variable global `elementor` de Elementor.
 * 
 * @version 1.0.0
 * @author Aurelio Builder Team
 */

import { EventEmitter } from 'events';
import elementRegistry from './core/registry/ElementRegistry.js';
import elementsManager from './core/managers/ElementsManager.js';
import commandManager from './core/commands/CommandManager.js';
import hookManager, { builderHooks, editorHooks, elementsHooks } from './api/hooks/HookManager.js';
import Container from './core/containers/Container.js';

class AurelioBuilder extends EventEmitter {
  constructor() {
    super();
    
    /**
     * Versión del builder
     * @type {string}
     */
    this.version = '1.0.0';
    
    /**
     * Estado de inicialización
     * @type {boolean}
     */
    this.isInitialized = false;
    
    /**
     * Configuración global
     * @type {Object}
     */
    this.config = {
      debug: false,
      autoInit: true,
      previewMode: false,
      editMode: true,
    };

    // Referencias a los managers principales
    this.registry = elementRegistry;
    this.elements = elementsManager;
    this.commands = commandManager;
    this.hooks = hookManager;
    
    // Namespaces de hooks para conveniencia
    this.builderHooks = builderHooks;
    this.editorHooks = editorHooks;
    this.elementsHooks = elementsHooks;
    
    /**
     * Documento actual (similar a Elementor)
     * @type {Object}
     */
    this.document = {
      id: null,
      elements: [],
      settings: {},
    };
    
    /**
     * Estado del editor
     * @type {Object}
     */
    this.editor = {
      selectedElement: null,
      clipboard: null,
      history: [],
      undoStack: [],
      redoStack: [],
    };

    // Auto-inicializar si está habilitado
    if (this.config.autoInit) {
      this.init();
    }
  }

  /**
   * Inicializar el builder
   * @param {Object} options - Opciones de inicialización
   */
  async init(options = {}) {
    if (this.isInitialized) {
      console.warn('AurelioBuilder is already initialized');
      return;
    }

    console.log('🚀 Initializing AurelioBuilder...');

    // Aplicar configuración
    Object.assign(this.config, options);

    try {
      // Inicializar componentes
      await this._initializeCore();
      await this._initializeCommands();
      await this._initializeHooks();
      await this._initializeDocument();

      this.isInitialized = true;
      
      // Emitir evento de inicialización
      this.emit('initialized', this);
      this.hooks.doAction('builder:initialized', this);

      console.log('✅ AurelioBuilder initialized successfully');
      
    } catch (error) {
      console.error('❌ Failed to initialize AurelioBuilder:', error);
      throw error;
    }
  }

  /**
   * Crear un elemento (interfaz principal)
   * @param {string} type - Tipo de elemento
   * @param {Object} props - Propiedades del elemento
   * @param {Object} options - Opciones adicionales
   * @returns {Container}
   */
  createElement(type, props = {}, options = {}) {
    return this.run('elements/create', { type, props, options });
  }

  /**
   * Mover un elemento
   * @param {string} elementId - ID del elemento
   * @param {string} targetId - ID del contenedor destino
   * @param {number} index - Índice de inserción
   * @returns {boolean}
   */
  moveElement(elementId, targetId, index = null) {
    return this.run('elements/move', { elementId, targetId, index });
  }

  /**
   * Actualizar propiedades de un elemento
   * @param {string} id - ID del elemento
   * @param {Object} props - Nuevas propiedades
   * @returns {boolean}
   */
  updateElement(id, props) {
    return this.run('elements/update', { id, props });
  }

  /**
   * Clonar un elemento
   * @param {string} id - ID del elemento
   * @param {Object} overrides - Propiedades a sobrescribir
   * @returns {Container}
   */
  cloneElement(id, overrides = {}) {
    return this.run('elements/clone', { id, overrides });
  }

  /**
   * Destruir un elemento
   * @param {string} id - ID del elemento
   * @returns {boolean}
   */
  destroyElement(id) {
    return this.run('elements/destroy', { id });
  }

  /**
   * Ejecutar un comando (interfaz simplificada)
   * @param {string} command - Nombre del comando
   * @param {Object} args - Argumentos del comando
   * @param {Object} options - Opciones de ejecución
   * @returns {*}
   */
  run(command, args = {}, options = {}) {
    return this.commands.run(command, args, options);
  }

  /**
   * Seleccionar un elemento
   * @param {string|Container} element - ID del elemento o instancia
   */
  selectElement(element) {
    const elementId = typeof element === 'string' ? element : element.id;
    const elementInstance = this.elements.getInstance(elementId);

    if (!elementInstance) {
      console.warn(`Element "${elementId}" not found`);
      return;
    }

    // Deseleccionar elemento anterior
    if (this.editor.selectedElement) {
      this.editor.selectedElement.isSelected = false;
    }

    // Seleccionar nuevo elemento
    elementInstance.isSelected = true;
    this.editor.selectedElement = elementInstance;

    // Emitir eventos
    this.emit('element:selected', elementInstance);
    this.hooks.doAction('editor:element:selected', elementInstance);

    console.log(`🎯 Element "${elementId}" selected`);
  }

  /**
   * Deseleccionar elemento actual
   */
  deselectElement() {
    if (this.editor.selectedElement) {
      this.editor.selectedElement.isSelected = false;
      
      const previousElement = this.editor.selectedElement;
      this.editor.selectedElement = null;

      this.emit('element:deselected', previousElement);
      this.hooks.doAction('editor:element:deselected', previousElement);

      console.log('🎯 Element deselected');
    }
  }

  /**
   * Obtener el elemento seleccionado
   * @returns {Container|null}
   */
  getSelectedElement() {
    return this.editor.selectedElement;
  }

  /**
   * Copiar elemento al clipboard
   * @param {string|Container} element - Elemento a copiar
   */
  copyElement(element) {
    const elementId = typeof element === 'string' ? element : element.id;
    const elementInstance = this.elements.getInstance(elementId);

    if (!elementInstance) {
      console.warn(`Cannot copy element "${elementId}": not found`);
      return;
    }

    this.editor.clipboard = elementInstance.toJSON();
    
    this.emit('element:copied', elementInstance);
    this.hooks.doAction('editor:element:copied', elementInstance);

    console.log(`📋 Element "${elementId}" copied to clipboard`);
  }

  /**
   * Pegar elemento desde clipboard
   * @param {string} targetId - ID del contenedor destino
   * @param {number} index - Índice de inserción
   * @returns {Container|null}
   */
  pasteElement(targetId = null, index = null) {
    if (!this.editor.clipboard) {
      console.warn('Clipboard is empty');
      return null;
    }

    try {
      // Crear elemento desde clipboard
      const element = Container.fromJSON(this.editor.clipboard);
      
      // Trackear en elements manager
      this.elements.instances.set(element.id, element);

      // Mover al contenedor destino si se especifica
      if (targetId) {
        this.moveElement(element.id, targetId, index);
      }

      this.emit('element:pasted', element);
      this.hooks.doAction('editor:element:pasted', element);

      console.log(`📋 Element pasted: "${element.id}"`);
      return element;

    } catch (error) {
      console.error('Error pasting element:', error);
      return null;
    }
  }

  /**
   * Serializar documento completo
   * @returns {Object}
   */
  serialize() {
    const elements = this.elements.serialize();
    
    return {
      id: this.document.id,
      version: this.version,
      elements,
      settings: this.document.settings,
      metadata: {
        createdAt: Date.now(),
        builderVersion: this.version,
      },
    };
  }

  /**
   * Deserializar documento completo
   * @param {Object} data - Datos del documento
   */
  deserialize(data) {
    try {
      // Limpiar elementos actuales
      this.elements.instances.clear();

      // Deserializar elementos
      const elements = this.elements.deserialize(data.elements || []);

      // Actualizar documento
      this.document.id = data.id;
      this.document.elements = elements;
      this.document.settings = data.settings || {};

      this.emit('document:loaded', data);
      this.hooks.doAction('editor:document:loaded', data);

      console.log(`📄 Document "${data.id}" loaded with ${elements.length} root elements`);

    } catch (error) {
      console.error('Error loading document:', error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas completas
   * @returns {Object}
   */
  getStats() {
    return {
      builder: {
        version: this.version,
        initialized: this.isInitialized,
        config: this.config,
      },
      registry: this.registry.getStats(),
      elements: this.elements.getStats(),
      commands: this.commands.getStats(),
      hooks: this.hooks.getStats(),
      document: {
        id: this.document.id,
        totalElements: this.elements.instances.size,
        selectedElement: this.editor.selectedElement?.id || null,
        hasClipboard: !!this.editor.clipboard,
      },
    };
  }

  // Métodos privados
  async _initializeCore() {
    // Los managers ya están inicializados por sus imports
    console.log('🏗️ Core components initialized');
  }

  async _initializeCommands() {
    // Registrar comandos adicionales del builder

    // Comando de selección
    this.commands.register('editor/select', {
      execute: ({ elementId }) => {
        this.selectElement(elementId);
        return this.getSelectedElement();
      },
      validateArgs: (args) => {
        if (!args.elementId) {
          throw new Error('Element ID is required');
        }
      },
      getDescription: () => 'Select an element in the editor',
    });

    // Comando de copia
    this.commands.register('editor/copy', {
      execute: ({ elementId }) => {
        this.copyElement(elementId || this.getSelectedElement()?.id);
        return this.editor.clipboard;
      },
      getDescription: () => 'Copy element to clipboard',
    });

    // Comando de pegado
    this.commands.register('editor/paste', {
      execute: ({ targetId, index }) => {
        return this.pasteElement(targetId, index);
      },
      getDescription: () => 'Paste element from clipboard',
    });

    console.log('⚡ Builder commands registered');
  }

  async _initializeHooks() {
    // Registrar hooks básicos del builder

    // Hook para filtrar elementos disponibles
    this.hooks.addFilter('builder:available-elements', (elements) => {
      // Los desarrolladores pueden filtrar qué elementos están disponibles
      return elements;
    });

    // Hook para validar creación de elementos
    this.hooks.addFilter('builder:validate-element-creation', (isValid, type, props) => {
      // Validación personalizada de elementos
      return isValid;
    });

    // Action cuando se inicializa el builder
    this.hooks.addAction('builder:initialized', (builder) => {
      if (this.config.debug) {
        console.log('🎣 Builder hooks initialized', builder.getStats());
      }
    });

    console.log('🎣 Builder hooks initialized');
  }

  async _initializeDocument() {
    // Inicializar documento básico
    this.document.id = `document_${Date.now()}`;
    this.document.elements = [];
    this.document.settings = {};

    console.log('📄 Document initialized');
  }

  /**
   * Método para debug completo
   */
  debug() {
    console.group('🔍 AurelioBuilder Debug Info');
    console.log('Stats:', this.getStats());
    console.log('Registry:', this.registry.debug());
    console.log('Elements:', this.elements.debug());
    console.log('Commands:', this.commands.debug());
    console.log('Hooks:', this.hooks.debug());
    console.groupEnd();
  }
}

// Crear instancia singleton (similar a elementor global)
const aurelioBuilder = new AurelioBuilder();

// Hacer disponible globalmente para debugging y extensiones
if (typeof window !== 'undefined') {
  window.aurelio = aurelioBuilder;
  window.aurelioBuilder = aurelioBuilder;
}

export default aurelioBuilder;