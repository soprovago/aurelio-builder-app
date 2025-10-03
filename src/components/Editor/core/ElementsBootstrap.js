/**
 * Elements Bootstrap System
 * Registra automáticamente todos los elementos disponibles en el sistema
 */

import elementRegistry from './ElementRegistry';

// Importar todos los componentes de elementos
import Container from '../elements/Container/Container';
import Text from '../elements/Text/Text';
import Heading from '../elements/Heading/Heading';
import Image from '../elements/Image/Image';
import Button from '../elements/Button/Button';

/**
 * Lista de todos los elementos disponibles en el sistema
 * Agregar nuevos elementos aquí para registro automático
 */
const AVAILABLE_ELEMENTS = [
  {
    component: Container,
    config: Container.elementConfig
  },
  {
    component: Text,
    config: Text.elementConfig
  },
  {
    component: Heading,
    config: Heading.elementConfig
  },
  {
    component: Image,
    config: Image.elementConfig
  },
  {
    component: Button,
    config: Button.elementConfig
  }
];

/**
 * Registra todos los elementos disponibles
 */
export function registerAllElements() {
  console.log('🚀 Initiating Elements Bootstrap...');
  
  let successCount = 0;
  let errorCount = 0;

  AVAILABLE_ELEMENTS.forEach(({ component, config }) => {
    try {
      if (!config) {
        throw new Error(`No elementConfig found for component`);
      }

      // Validar configuración mínima requerida
      if (!config.type || !config.name || !component) {
        throw new Error(`Invalid element config for ${config.type || 'unknown'}`);
      }

      // Registrar el elemento con su componente de renderizado
      elementRegistry.register({
        ...config,
        renderComponent: component
      });

      successCount++;
    } catch (error) {
      console.error(`❌ Failed to register element:`, config?.type || 'unknown', error);
      errorCount++;
    }
  });

  // Mostrar estadísticas de registro
  const stats = elementRegistry.getStats();
  console.log(`✅ Elements Bootstrap completed!`);
  console.log(`📊 Registration Stats:`, {
    successful: successCount,
    failed: errorCount,
    total: AVAILABLE_ELEMENTS.length,
    categories: Object.keys(stats.elementsByCategory).length,
    ...stats
  });

  return {
    success: successCount,
    errors: errorCount,
    total: AVAILABLE_ELEMENTS.length,
    stats
  };
}

/**
 * Desregistra todos los elementos
 */
export function unregisterAllElements() {
  console.log('🧹 Unregistering all elements...');
  elementRegistry.clear();
  console.log('✅ All elements unregistered');
}

/**
 * Recarga todos los elementos (útil para desarrollo)
 */
export function reloadAllElements() {
  console.log('🔄 Reloading all elements...');
  unregisterAllElements();
  return registerAllElements();
}

/**
 * Valida que todos los elementos estén correctamente registrados
 */
export function validateElementsRegistry() {
  console.log('🔍 Validating elements registry...');
  
  const stats = elementRegistry.getStats();
  const issues = [];

  // Verificar que hay elementos registrados
  if (stats.totalElements === 0) {
    issues.push('No elements registered');
  }

  // Verificar cada elemento
  AVAILABLE_ELEMENTS.forEach(({ config }) => {
    const element = elementRegistry.getElement(config.type);
    
    if (!element) {
      issues.push(`Element "${config.type}" not found in registry`);
      return;
    }

    // Validar que tiene las propiedades mínimas
    if (!element.properties) {
      issues.push(`Element "${config.type}" has no properties defined`);
    }

    if (!element.defaultProps) {
      issues.push(`Element "${config.type}" has no default props defined`);
    }

    if (!element.renderComponent) {
      issues.push(`Element "${config.type}" has no render component`);
    }
  });

  if (issues.length > 0) {
    console.warn('⚠️ Registry validation issues found:', issues);
    return { valid: false, issues };
  }

  console.log('✅ Registry validation passed');
  return { valid: true, issues: [] };
}

/**
 * Obtiene información detallada sobre el estado del registry
 */
export function getRegistryInfo() {
  const stats = elementRegistry.getStats();
  const categories = elementRegistry.getCategories();
  const elements = elementRegistry.getAllElements();

  return {
    stats,
    categories: categories.map(cat => ({
      name: cat.name,
      elementCount: cat.elements.length,
      elements: cat.elements
    })),
    elements: elements.map(el => ({
      type: el.type,
      name: el.name,
      category: el.category,
      version: el.version,
      tags: el.tags,
      propertiesCount: Object.keys(el.properties).length,
      registeredAt: el.registeredAt
    }))
  };
}

/**
 * Función para desarrollo: agregar un elemento dinámicamente
 * Útil para testing y desarrollo de nuevos elementos
 */
export function addElementDynamically(elementComponent, elementConfig) {
  if (!elementComponent || !elementConfig) {
    throw new Error('Both component and config are required');
  }

  try {
    elementRegistry.register({
      ...elementConfig,
      renderComponent: elementComponent
    });

    console.log(`✅ Element "${elementConfig.type}" added dynamically`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to add element "${elementConfig.type}" dynamically:`, error);
    return false;
  }
}

/**
 * Auto-inicialización cuando se importa el módulo
 * Esto garantiza que los elementos estén disponibles tan pronto como se use el editor
 */
let isInitialized = false;

export function initializeElements() {
  if (isInitialized) {
    console.log('ℹ️  Elements already initialized, skipping...');
    return elementRegistry.getStats();
  }

  const result = registerAllElements();
  const validation = validateElementsRegistry();

  if (!validation.valid) {
    console.error('❌ Elements initialization failed validation:', validation.issues);
  }

  isInitialized = true;
  return result;
}

// Auto-inicializar elementos al importar el módulo
// Comentado para permitir inicialización manual si se prefiere
// initializeElements();

export default {
  registerAllElements,
  unregisterAllElements,
  reloadAllElements,
  validateElementsRegistry,
  getRegistryInfo,
  addElementDynamically,
  initializeElements,
  get isInitialized() {
    return isInitialized;
  }
};