/**
 * CommandManager - Sistema de comandos unificado inspirado en Elementor
 * 
 * Implementa un sistema de comandos similar al $e.run de Elementor,
 * permitiendo la ejecución centralized y extensible de operaciones.
 * 
 * @version 1.0.0
 * @author Aurelio Builder Team
 */

import { EventEmitter } from 'events';

/**
 * Clase base para todos los comandos
 */
class Command extends EventEmitter {
  constructor() {
    super();
    this.name = this.constructor.name;
  }

  /**
   * Validar argumentos del comando (sobrescribir en subclases)
   * @param {Object} args - Argumentos a validar
   */
  validateArgs(args) {
    // Implementar validación específica en subclases
  }

  /**
   * Ejecutar el comando (debe ser implementado en subclases)
   * @param {Object} args - Argumentos del comando
   * @returns {*} - Resultado del comando
   */
  execute(args) {
    throw new Error(`Command ${this.name} must implement execute method`);
  }

  /**
   * Verificar si el comando puede ser ejecutado (sobrescribir en subclases)
   * @param {Object} args - Argumentos del comando
   * @returns {boolean}
   */
  canExecute(args) {
    return true;
  }

  /**
   * Obtener descripción del comando (sobrescribir en subclases)
   * @returns {string}
   */
  getDescription() {
    return `Command: ${this.name}`;
  }
}

/**
 * Manager principal de comandos
 */
class CommandManager extends EventEmitter {
  constructor() {
    super();
    
    /**
     * Registry de comandos registrados
     * @type {Map<string, Command>}
     */
    this._commands = new Map();
    
    /**
     * Historial de comandos ejecutados
     * @type {Array}
     */
    this._history = [];
    
    /**
     * Comando actualmente ejecutándose
     * @type {string|null}
     */
    this._currentCommand = null;
    
    /**
     * Middlewares para pre/post procesamiento
     * @type {Array}
     */
    this._middlewares = [];
    
    /**
     * Comandos en cola de ejecución
     * @type {Array}
     */
    this._queue = [];
    
    /**
     * Si el manager está procesando la cola
     * @type {boolean}
     */
    this._processing = false;

    this._initializeBuiltInCommands();
  }

  /**
   * Registrar un comando
   * @param {string} name - Nombre del comando
   * @param {Command|Function} command - Instancia de comando o función
   * @returns {CommandManager}
   */
  register(name, command) {
    if (this._commands.has(name)) {
      console.warn(`Command "${name}" already registered. Overriding...`);
    }

    // Si es una función, convertirla a Command
    if (typeof command === 'function' && !(command instanceof Command)) {
      const functionCommand = new Command();
      functionCommand.name = name;
      functionCommand.execute = command;
      command = functionCommand;
    }

    // Validar que sea una instancia válida de Command
    if (!(command instanceof Command)) {
      throw new Error(`Command "${name}" must be a Command instance or function`);
    }

    this._commands.set(name, command);
    
    console.log(`⚡ Command "${name}" registered`);
    return this;
  }

  /**
   * Desregistrar un comando
   * @param {string} name - Nombre del comando
   * @returns {boolean}
   */
  unregister(name) {
    if (!this._commands.has(name)) {
      console.warn(`Command "${name}" is not registered`);
      return false;
    }

    this._commands.delete(name);
    console.log(`🗑️ Command "${name}" unregistered`);
    return true;
  }

  /**
   * Verificar si un comando está registrado
   * @param {string} name - Nombre del comando
   * @returns {boolean}
   */
  has(name) {
    return this._commands.has(name);
  }

  /**
   * Obtener un comando registrado
   * @param {string} name - Nombre del comando
   * @returns {Command|null}
   */
  get(name) {
    return this._commands.get(name) || null;
  }

  /**
   * Ejecutar un comando
   * @param {string} name - Nombre del comando
   * @param {Object} args - Argumentos del comando
   * @param {Object} options - Opciones de ejecución
   * @returns {Promise<*>} - Resultado del comando
   */
  async run(name, args = {}, options = {}) {
    console.log(`🚀 Running command: ${name}`);

    // Verificar si el comando existe
    if (!this.has(name)) {
      throw new Error(`Command "${name}" is not registered`);
    }

    const command = this.get(name);
    
    // Preparar contexto de ejecución
    const executionContext = {
      command: name,
      args,
      options,
      timestamp: Date.now(),
      id: this._generateExecutionId(),
    };

    try {
      // Emitir evento de pre-ejecución
      this.emit('command:before', executionContext);

      // Validar argumentos
      if (command.validateArgs) {
        command.validateArgs(args);
      }

      // Verificar si se puede ejecutar
      if (!command.canExecute(args)) {
        throw new Error(`Command "${name}" cannot be executed with provided arguments`);
      }

      // Aplicar middlewares de pre-procesamiento
      await this._applyMiddlewares('before', executionContext);

      // Establecer comando actual
      this._currentCommand = name;

      // Ejecutar el comando
      const result = await command.execute(args);

      // Establecer resultado en el contexto
      executionContext.result = result;
      executionContext.success = true;
      executionContext.endTime = Date.now();
      executionContext.duration = executionContext.endTime - executionContext.timestamp;

      // Aplicar middlewares de post-procesamiento
      await this._applyMiddlewares('after', executionContext);

      // Agregar al historial
      this._addToHistory(executionContext);

      // Emitir evento de post-ejecución
      this.emit('command:after', executionContext);
      this.emit(`command:${name}:success`, executionContext);

      console.log(`✅ Command "${name}" executed successfully in ${executionContext.duration}ms`);
      
      return result;

    } catch (error) {
      executionContext.error = error;
      executionContext.success = false;
      executionContext.endTime = Date.now();
      executionContext.duration = executionContext.endTime - executionContext.timestamp;

      // Agregar al historial incluso si falló
      this._addToHistory(executionContext);

      // Emitir eventos de error
      this.emit('command:error', executionContext);
      this.emit(`command:${name}:error`, executionContext);

      console.error(`❌ Command "${name}" failed:`, error);
      
      // Re-lanzar el error si no está en modo silencioso
      if (!options.silent) {
        throw error;
      }
    } finally {
      this._currentCommand = null;
    }
  }

  /**
   * Ejecutar comando en cola (asíncrono)
   * @param {string} name - Nombre del comando
   * @param {Object} args - Argumentos del comando
   * @param {Object} options - Opciones de ejecución
   * @returns {Promise<*>}
   */
  async queue(name, args = {}, options = {}) {
    return new Promise((resolve, reject) => {
      this._queue.push({
        name,
        args,
        options,
        resolve,
        reject,
        timestamp: Date.now(),
      });

      this._processQueue();
    });
  }

  /**
   * Agregar middleware
   * @param {Function} middleware - Función middleware
   * @param {string} type - Tipo de middleware ('before' | 'after' | 'both')
   * @returns {CommandManager}
   */
  use(middleware, type = 'both') {
    if (typeof middleware !== 'function') {
      throw new Error('Middleware must be a function');
    }

    this._middlewares.push({
      function: middleware,
      type,
    });

    return this;
  }

  /**
   * Obtener historial de comandos
   * @param {Object} filters - Filtros opcionales
   * @returns {Array}
   */
  getHistory(filters = {}) {
    let history = [...this._history];

    if (filters.command) {
      history = history.filter(entry => entry.command === filters.command);
    }

    if (filters.success !== undefined) {
      history = history.filter(entry => entry.success === filters.success);
    }

    if (filters.limit) {
      history = history.slice(-filters.limit);
    }

    return history;
  }

  /**
   * Limpiar historial
   * @param {Object} options - Opciones de limpieza
   */
  clearHistory(options = {}) {
    if (options.command) {
      this._history = this._history.filter(entry => entry.command !== options.command);
    } else {
      this._history = [];
    }

    console.log('🧹 Command history cleared');
  }

  /**
   * Obtener comando actualmente ejecutándose
   * @returns {string|null}
   */
  getCurrentCommand() {
    return this._currentCommand;
  }

  /**
   * Verificar si hay un comando ejecutándose
   * @returns {boolean}
   */
  isExecuting() {
    return this._currentCommand !== null;
  }

  /**
   * Obtener estadísticas del CommandManager
   * @returns {Object}
   */
  getStats() {
    const successfulCommands = this._history.filter(entry => entry.success).length;
    const failedCommands = this._history.filter(entry => !entry.success).length;

    return {
      totalCommands: this._commands.size,
      totalExecutions: this._history.length,
      successfulExecutions: successfulCommands,
      failedExecutions: failedCommands,
      successRate: this._history.length > 0 ? (successfulCommands / this._history.length) * 100 : 0,
      queueLength: this._queue.length,
      isExecuting: this.isExecuting(),
      currentCommand: this.getCurrentCommand(),
      middlewares: this._middlewares.length,
    };
  }

  /**
   * Obtener lista de comandos registrados
   * @returns {Array}
   */
  getCommands() {
    return Array.from(this._commands.entries()).map(([name, command]) => ({
      name,
      description: command.getDescription ? command.getDescription() : `Command: ${name}`,
    }));
  }

  // Métodos privados
  async _processQueue() {
    if (this._processing || this._queue.length === 0) {
      return;
    }

    this._processing = true;

    while (this._queue.length > 0) {
      const queuedCommand = this._queue.shift();
      
      try {
        const result = await this.run(
          queuedCommand.name, 
          queuedCommand.args, 
          queuedCommand.options
        );
        queuedCommand.resolve(result);
      } catch (error) {
        queuedCommand.reject(error);
      }
    }

    this._processing = false;
  }

  async _applyMiddlewares(type, context) {
    const middlewares = this._middlewares.filter(
      middleware => middleware.type === type || middleware.type === 'both'
    );

    for (const middleware of middlewares) {
      try {
        await middleware.function(context);
      } catch (error) {
        console.error(`Middleware error during ${type}:`, error);
      }
    }
  }

  _addToHistory(executionContext) {
    this._history.push(executionContext);

    // Mantener un límite en el historial para evitar memory leaks
    if (this._history.length > 1000) {
      this._history = this._history.slice(-500); // Mantener las últimas 500
    }
  }

  _generateExecutionId() {
    return `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  _initializeBuiltInCommands() {
    // Comando de ping para testing
    this.register('ping', new class extends Command {
      execute(args) {
        return { pong: true, timestamp: Date.now(), args };
      }
      
      getDescription() {
        return 'Test command that returns pong';
      }
    });

    // Comando para obtener estadísticas
    this.register('stats', new class extends Command {
      constructor(manager) {
        super();
        this.manager = manager;
      }
      
      execute() {
        return this.manager.getStats();
      }
      
      getDescription() {
        return 'Get CommandManager statistics';
      }
    }(this));

    console.log('🏗️ Built-in commands initialized');
  }

  // Método para debug
  debug() {
    console.group('🔍 CommandManager Debug Info');
    console.log('Stats:', this.getStats());
    console.log('Registered Commands:', Array.from(this._commands.keys()));
    console.log('Recent History:', this._history.slice(-5));
    console.log('Queue Length:', this._queue.length);
    console.log('Middlewares:', this._middlewares.length);
    console.groupEnd();
  }
}

// Singleton instance (al estilo Elementor)
const commandManager = new CommandManager();

// Exportar tanto la clase como la instancia
export { Command, CommandManager };
export default commandManager;