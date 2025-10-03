/**
 * Aurelio Builder - Arquitectura principal inspirada en Elementor
 * 
 * Sistema de builder moderno y extensible con:
 * - Registry de elementos centralizado
 * - Sistema de contenedores jerárquicos  
 * - Comandos unificados (estilo $e.run)
 * - Hooks extensibles (filters y actions)
 * - Managers especializados
 * 
 * @version 1.0.0
 * @author Aurelio Builder Team
 */

// Importar la clase principal
import AurelioBuilder from './AurelioBuilder.js';

// Importar componentes individuales para uso avanzado
import elementRegistry from './core/registry/ElementRegistry.js';
import elementsManager from './core/managers/ElementsManager.js';
import commandManager from './core/commands/CommandManager.js';
import hookManager, { builderHooks, editorHooks, elementsHooks } from './api/hooks/HookManager.js';
import Container from './core/containers/Container.js';
import { Command, CommandManager } from './core/commands/CommandManager.js';

// Exportar instancia principal (similar a como Elementor exporta `elementor`)
export default AurelioBuilder;

// Exportar componentes individuales para uso avanzado
export {
  // Clase principal
  AurelioBuilder,
  
  // Core components
  elementRegistry,
  elementsManager,
  commandManager,
  hookManager,
  Container,
  
  // Command system
  Command,
  CommandManager,
  
  // Hook namespaces
  builderHooks,
  editorHooks,
  elementsHooks,
};

// Información del paquete
export const version = '1.0.0';
export const name = 'aurelio-builder';

console.log(`
🎨 Aurelio Builder v${version}
📚 Arquitectura inspirada en Elementor
🚀 Iniciando sistema modular...
`);

// Inicializar automáticamente si estamos en navegador
if (typeof window !== 'undefined') {
  // Hacer disponible globalmente
  window.AurelioBuilder = AurelioBuilder;
  
  console.log('✅ Aurelio Builder disponible globalmente como window.aurelio');
}