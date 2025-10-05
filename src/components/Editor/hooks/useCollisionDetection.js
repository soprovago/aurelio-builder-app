import { useCallback, useRef } from 'react';
import { CollisionDetector, detectCollision } from '../utils/collisionDetection';

/**
 * Hook para integrar collision detection avanzada con el sistema de drag existente
 * Inspirado en @dnd-kit pero adaptado a nuestra arquitectura
 */
export const useCollisionDetection = (options = {}) => {
  const collisionDetectorRef = useRef(new CollisionDetector(options));
  const droppableElementsRef = useRef(new Map());

  /**
   * Registra un elemento como droppable
   * @param {string} id - ID único del elemento
   * @param {Element} element - Elemento DOM
   * @param {Object} data - Datos adicionales del elemento
   */
  const registerDroppable = useCallback((id, element, data = {}) => {
    if (!element || !id) return;

    droppableElementsRef.current.set(id, {
      id,
      element,
      data,
      type: data.type || 'element',
      isContainer: data.isContainer || false
    });
  }, []);

  /**
   * Desregistra un elemento droppable
   * @param {string} id - ID del elemento
   */
  const unregisterDroppable = useCallback((id) => {
    droppableElementsRef.current.delete(id);
  }, []);

  /**
   * Obtiene todos los elementos droppables registrados
   * @returns {Array} Array de elementos droppable
   */
  const getDroppableElements = useCallback(() => {
    return Array.from(droppableElementsRef.current.values());
  }, []);

  /**
   * Encuentra el mejor elemento droppable para el elemento activo
   * @param {DOMRect|Object} activeRect - Rectángulo del elemento siendo arrastrado
   * @param {Object} activeData - Datos del elemento activo
   * @returns {Object|null} Mejor elemento encontrado
   */
  const findBestDropTarget = useCallback((activeRect, activeData = {}) => {
    const droppableElements = getDroppableElements();
    
    if (!droppableElements.length || !activeRect) return null;

    // Filtrar elementos válidos (no arrastrarse a sí mismo, no loops de contenedores)
    const validDroppables = droppableElements.filter(droppable => {
      // No arrastrarse a sí mismo
      if (droppable.id === activeData.id) return false;
      
      // Si es un contenedor, verificar que no se esté arrastrando dentro de sí mismo
      if (activeData.isContainer && droppable.data.parentId === activeData.id) return false;
      
      // Verificar que el elemento aún existe en el DOM
      if (!droppable.element.isConnected) return false;
      
      return true;
    });

    return collisionDetectorRef.current.detect(validDroppables, activeRect);
  }, [getDroppableElements]);

  /**
   * Versión optimizada que incluye filtrado por tipo
   * @param {DOMRect|Object} activeRect - Rectángulo activo
   * @param {Object} activeData - Datos del elemento activo
   * @param {Object} filters - Filtros adicionales
   * @returns {Object|null} Mejor match
   */
  const findBestDropTargetWithFilters = useCallback((activeRect, activeData = {}, filters = {}) => {
    const droppableElements = getDroppableElements();
    
    if (!droppableElements.length || !activeRect) return null;

    // Aplicar filtros
    const filteredDroppables = droppableElements.filter(droppable => {
      // Filtros básicos
      if (droppable.id === activeData.id) return false;
      if (!droppable.element.isConnected) return false;
      
      // Filtro por tipo de elemento
      if (filters.acceptedTypes && !filters.acceptedTypes.includes(droppable.data.type)) {
        return false;
      }
      
      // Filtro para contenedores solamente
      if (filters.containersOnly && !droppable.data.isContainer) {
        return false;
      }
      
      // Filtro de exclusión por ID
      if (filters.excludeIds && filters.excludeIds.includes(droppable.id)) {
        return false;
      }
      
      // Custom filter function
      if (filters.customFilter && !filters.customFilter(droppable, activeData)) {
        return false;
      }
      
      return true;
    });

    return collisionDetectorRef.current.detect(filteredDroppables, activeRect);
  }, [getDroppableElements]);

  /**
   * Actualiza las opciones del detector de colisiones
   * @param {Object} newOptions - Nuevas opciones
   */
  const updateDetectorOptions = useCallback((newOptions) => {
    collisionDetectorRef.current.updateOptions(newOptions);
  }, []);

  /**
   * Obtiene información de debug sobre la detección actual
   * @param {DOMRect|Object} activeRect - Rectángulo activo
   * @returns {Object} Información de debug
   */
  const getDebugInfo = useCallback((activeRect) => {
    const droppableElements = getDroppableElements();
    return collisionDetectorRef.current.getDebugInfo(droppableElements, activeRect);
  }, [getDroppableElements]);

  /**
   * Función de conveniencia para detectar colisiones rápidamente
   * @param {DOMRect|Object} activeRect - Rectángulo activo
   * @param {Object} options - Opciones override
   * @returns {Object|null} Resultado de la detección
   */
  const quickDetect = useCallback((activeRect, options = {}) => {
    const droppableElements = getDroppableElements();
    return detectCollision(droppableElements, activeRect, options);
  }, [getDroppableElements]);

  /**
   * Función para limpiar referencias a elementos DOM eliminados
   */
  const cleanup = useCallback(() => {
    const elementsToRemove = [];
    
    droppableElementsRef.current.forEach((value, key) => {
      if (!value.element.isConnected) {
        elementsToRemove.push(key);
      }
    });
    
    elementsToRemove.forEach(id => {
      droppableElementsRef.current.delete(id);
    });
  }, []);

  return {
    // Registro de elementos
    registerDroppable,
    unregisterDroppable,
    getDroppableElements,
    
    // Detección de colisiones
    findBestDropTarget,
    findBestDropTargetWithFilters,
    quickDetect,
    
    // Configuración
    updateDetectorOptions,
    
    // Utilidades
    getDebugInfo,
    cleanup,
    
    // Acceso directo al detector
    detector: collisionDetectorRef.current
  };
};