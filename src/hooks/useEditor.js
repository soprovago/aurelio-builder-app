/**
 * Hook principal para manejo del estado del Editor de Aurelio Builder
 * 
 * @description Centraliza todo el estado y lógica del editor, incluyendo elementos,
 * selección, viewport mode y operaciones CRUD. Reemplaza la gestión de estado
 * distribuida del Editor.jsx original.
 */

import { useState, useCallback } from 'react';
import { VIEWPORT_MODES, getDefaultViewportMode } from '../constants/viewportConfigs.js';

/**
 * Generar ID único para elementos
 * @returns {string} ID único
 */
const generateId = () => {
  return `element_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Hook principal del editor
 * 
 * @param {Object} initialState - Estado inicial opcional
 * @returns {Object} Estado y funciones del editor
 */
export const useEditor = (initialState = {}) => {
  // Estados principales
  const [elements, setElements] = useState(initialState.elements || []);
  const [selectedElement, setSelectedElement] = useState(initialState.selectedElement || null);
  const [viewportMode, setViewportMode] = useState(initialState.viewportMode || getDefaultViewportMode());
  const [isPreviewMode, setIsPreviewMode] = useState(initialState.isPreviewMode || false);

  /**
   * Agregar nuevo elemento al canvas
   * 
   * @param {Object} elementConfig - Configuración del elemento
   * @param {number} index - Índice donde insertar (opcional)
   */
  const addElement = useCallback((elementConfig, index = null) => {
    console.log('🆕 Adding element:', elementConfig.name);
    
    const newElement = {
      id: generateId(),
      type: elementConfig.type,
      props: { ...elementConfig.defaultProps },
    };

    setElements(prev => {
      if (index !== null && index >= 0 && index <= prev.length) {
        const newElements = [...prev];
        newElements.splice(index, 0, newElement);
        return newElements;
      }
      return [...prev, newElement];
    });

    // Auto-seleccionar el nuevo elemento
    setSelectedElement(newElement);
    
    return newElement;
  }, []);

  /**
   * Agregar elemento en un índice específico
   * 
   * @param {Object} elementConfig - Configuración del elemento
   * @param {number} targetIndex - Índice donde insertar
   */
  const addElementAtIndex = useCallback((elementConfig, targetIndex) => {
    console.log('🆕 Adding element at index:', elementConfig.name, 'at index', targetIndex);
    
    const newElement = {
      id: generateId(),
      type: elementConfig.type,
      props: { ...elementConfig.defaultProps },
    };

    setElements(prev => {
      const newElements = [...prev];
      newElements.splice(targetIndex, 0, newElement);
      return newElements;
    });

    // Auto-seleccionar el nuevo elemento
    setSelectedElement(newElement);
    
    return newElement;
  }, []);

  /**
   * Eliminar elemento por ID
   * 
   * @param {string} elementId - ID del elemento a eliminar
   * @param {string} parentId - ID del contenedor padre (si es elemento hijo)
   */
  const deleteElement = useCallback((elementId, parentId = null) => {
    console.log('🗑️ Deleting element:', elementId, parentId ? `from parent ${parentId}` : '');

    if (parentId) {
      // Eliminar elemento hijo de un contenedor
      setElements(prev => 
        updateElementRecursively(prev, parentId, (parent) => ({
          ...parent,
          props: {
            ...parent.props,
            children: parent.props.children?.filter(child => child.id !== elementId) || []
          }
        }))
      );
    } else {
      // Eliminar elemento del canvas principal
      setElements(prev => prev.filter(element => element.id !== elementId));
    }

    // Deseleccionar si era el elemento seleccionado
    if (selectedElement?.id === elementId) {
      setSelectedElement(null);
    }
  }, [selectedElement]);

  /**
   * Duplicar elemento con deep copy
   * 
   * @param {Object} element - Elemento a duplicar
   * @param {string} parentId - ID del contenedor padre (si es elemento hijo)
   */
  const duplicateElement = useCallback((element, parentId = null) => {
    console.log('📋 Duplicating element:', element.id);
    
    // Función para hacer deep copy de objetos
    const deepCopy = (obj) => {
      if (obj === null || typeof obj !== "object") return obj;
      if (obj instanceof Date) return new Date(obj.getTime());
      if (obj instanceof Array) return obj.map(item => deepCopy(item));
      if (typeof obj === "object") {
        const clonedObj = {};
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            clonedObj[key] = deepCopy(obj[key]);
          }
        }
        return clonedObj;
      }
    };

    const duplicatedElement = {
      ...element,
      id: generateId(),
      props: deepCopy(element.props) // Deep copy de todas las props
    };
    
    // Si el elemento tiene children, también duplicarlos con IDs únicos
    if (duplicatedElement.props?.children) {
      duplicatedElement.props.children = duplicatedElement.props.children.map(child => ({
        ...child,
        id: generateId(),
        props: deepCopy(child.props)
      }));
    }

    if (parentId) {
      // Duplicar elemento hijo dentro de un contenedor
      setElements(prev => 
        updateElementRecursively(prev, parentId, (parent) => ({
          ...parent,
          props: {
            ...parent.props,
            children: [...(parent.props.children || []), duplicatedElement]
          }
        }))
      );
    } else {
      // Duplicar elemento en el canvas principal
      setElements(prev => [...prev, duplicatedElement]);
    }

    return duplicatedElement;
  }, []);

  /**
   * Duplicar elemento en una posición específica (justo después del original)
   * 
   * @param {string} elementId - ID del elemento a duplicar
   */
  const duplicateElementAtIndex = useCallback((elementId) => {
    console.log('📋 Duplicating element at index:', elementId);
    
    setElements(prev => {
      const elementIndex = prev.findIndex(el => el.id === elementId);
      if (elementIndex === -1) {
        console.error('❌ Element not found for duplication:', elementId);
        return prev;
      }
      
      const originalElement = prev[elementIndex];
      
      // Función para hacer deep copy de objetos  
      const deepCopy = (obj) => {
        if (obj === null || typeof obj !== "object") return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => deepCopy(item));
        if (typeof obj === "object") {
          const clonedObj = {};
          for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
              clonedObj[key] = deepCopy(obj[key]);
            }
          }
          return clonedObj;
        }
      };
      
      const duplicatedElement = {
        ...originalElement,
        id: generateId(),
        props: deepCopy(originalElement.props) // Deep copy de todas las props
      };
      
      // Si el elemento tiene children, también duplicarlos con IDs únicos
      if (duplicatedElement.props?.children) {
        duplicatedElement.props.children = duplicatedElement.props.children.map(child => ({
          ...child,
          id: generateId(),
          props: deepCopy(child.props)
        }));
      }
      
      // Insertar justo después del elemento original
      const newElements = [...prev];
      newElements.splice(elementIndex + 1, 0, duplicatedElement);
      
      return newElements;
    });
  }, []);

  /**
   * Actualizar propiedades de un elemento
   * 
   * @param {Object} updatedElement - Elemento con propiedades actualizadas
   */
  const updateElement = useCallback((updatedElement) => {
    console.log('✏️ Updating element:', updatedElement.id);

    setElements(prev => 
      updateElementRecursively(prev, updatedElement.id, () => updatedElement)
    );

    // Actualizar elemento seleccionado si coincide
    if (selectedElement?.id === updatedElement.id) {
      setSelectedElement(updatedElement);
    }
  }, [selectedElement]);

  /**
   * Agregar elemento a un contenedor específico
   * 
   * @param {string} containerId - ID del contenedor
   * @param {Object} elementConfig - Configuración del elemento a agregar
   */
  const addToContainer = useCallback((containerId, elementConfig) => {
    console.log('📦 Adding to container:', containerId, elementConfig.name);

    const newElement = {
      id: generateId(),
      type: elementConfig.type,
      props: { ...elementConfig.defaultProps },
    };

    setElements(prev => 
      updateElementRecursively(prev, containerId, (container) => ({
        ...container,
        props: {
          ...container.props,
          children: [...(container.props.children || []), newElement]
        }
      }))
    );

    return newElement;
  }, []);

  /**
   * Mover elemento a un contenedor
   * 
   * @param {string} elementId - ID del elemento a mover
   * @param {string} targetContainerId - ID del contenedor destino (null para canvas principal)
   */
  const moveToContainer = useCallback((elementId, targetContainerId) => {
    console.log('📦➡️ Moving element to container:', elementId, '→', targetContainerId);

    let elementToMove = null;

    // Buscar y remover elemento de su ubicación actual
    setElements(prev => {
      const { element, updatedElements } = removeElementRecursively(prev, elementId);
      elementToMove = element;
      return updatedElements;
    });

    if (!elementToMove) {
      console.error('❌ Element to move not found:', elementId);
      return;
    }

    // Agregar elemento a nueva ubicación
    if (targetContainerId) {
      // Mover a contenedor específico
      setElements(prev => 
        updateElementRecursively(prev, targetContainerId, (container) => ({
          ...container,
          props: {
            ...container.props,
            children: [...(container.props.children || []), elementToMove]
          }
        }))
      );
    } else {
      // Mover al canvas principal
      setElements(prev => [...prev, elementToMove]);
    }
  }, []);

  /**
   * Seleccionar elemento
   * 
   * @param {Object} element - Elemento a seleccionar
   */
  const selectElement = useCallback((element) => {
    console.log('🎯 Selecting element:', element?.id);
    setSelectedElement(element);
  }, []);

  /**
   * Cambiar modo de viewport
   * 
   * @param {string} mode - Nuevo modo de viewport
   */
  const changeViewportMode = useCallback((mode) => {
    console.log('📱 Changing viewport mode to:', mode);
    setViewportMode(mode);
  }, []);

  /**
   * Alternar modo preview
   */
  const togglePreviewMode = useCallback(() => {
    setIsPreviewMode(prev => !prev);
  }, []);

  /**
   * Reordenar elementos del canvas
   * 
   * @param {Array} newOrder - Nuevo orden de elementos
   */
  const reorderElements = useCallback((newOrder) => {
    console.log('🔄 Reordering elements');
    setElements(newOrder);
  }, []);

  /**
   * Reordenar elemento por ID a un índice específico
   * 
   * @param {string} elementId - ID del elemento a mover
   * @param {number} targetIndex - Índice de destino
   */
  const reorderElementByIndex = useCallback((elementId, targetIndex) => {
    console.log('🔄 Reordering element by index:', elementId, 'to index', targetIndex);
    
    setElements(prev => {
      const currentIndex = prev.findIndex(el => el.id === elementId);
      if (currentIndex === -1 || currentIndex === targetIndex) {
        return prev; // Elemento no encontrado o ya está en la posición correcta
      }
      
      const newElements = [...prev];
      const [movedElement] = newElements.splice(currentIndex, 1);
      newElements.splice(targetIndex, 0, movedElement);
      
      return newElements;
    });
  }, []);

  /**
   * Agregar elemento a un contenedor específico por ID
   * 
   * @param {Object} elementConfig - Configuración del elemento
   * @param {number} index - Índice donde insertar (opcional)
   * @param {string} containerId - ID del contenedor (opcional)
   */
  const addElementToContainer = useCallback((elementConfig, index = null, containerId = null) => {
    console.log('🆕 Adding element to container:', elementConfig.name, 'container:', containerId);
    
    const newElement = {
      id: generateId(),
      type: elementConfig.type,
      props: { ...elementConfig.defaultProps },
    };

    if (containerId) {
      // Agregar a contenedor específico
      setElements(prev => 
        updateElementRecursively(prev, containerId, (container) => ({
          ...container,
          props: {
            ...container.props,
            children: [...(container.props.children || []), newElement]
          }
        }))
      );
    } else {
      // Agregar al canvas principal
      setElements(prev => {
        if (index !== null && index >= 0 && index <= prev.length) {
          const newElements = [...prev];
          newElements.splice(index, 0, newElement);
          return newElements;
        }
        return [...prev, newElement];
      });
    }

    // Auto-seleccionar el nuevo elemento
    setSelectedElement(newElement);
    
    return newElement;
  }, []);

  /**
   * Limpiar canvas (remover todos los elementos)
   */
  const clearCanvas = useCallback(() => {
    console.log('🧹 Clearing canvas');
    setElements([]);
    setSelectedElement(null);
  }, []);

  /**
   * Cargar elementos desde template o archivo
   * 
   * @param {Array} newElements - Elementos a cargar
   */
  const loadElements = useCallback((newElements) => {
    console.log('📂 Loading elements:', newElements.length);
    setElements(newElements);
    setSelectedElement(null);
  }, []);

  // Estado y funciones exportadas
  return {
    // Estado
    elements,
    selectedElement,
    viewportMode,
    isPreviewMode,
    
    // Operaciones de elementos
    addElement,
    addElementAtIndex,
    deleteElement,
    duplicateElement,
    duplicateElementAtIndex,
    updateElement,
    selectElement,
    
    // Operaciones de contenedores
    addToContainer,
    moveToContainer,
    addElementToContainer,
    
    // Operaciones de canvas
    reorderElements,
    reorderElementByIndex,
    clearCanvas,
    loadElements,
    
    // Operaciones de viewport
    changeViewportMode,
    togglePreviewMode,
    
    // Métodos de utilidad
    getElementsCount: () => elements.length,
    hasElements: () => elements.length > 0,
    isElementSelected: (elementId) => selectedElement?.id === elementId,
  };
};

/**
 * Función helper para actualizar elemento recursivamente
 * 
 * @param {Array} elements - Array de elementos
 * @param {string} targetId - ID del elemento objetivo
 * @param {Function} updateFn - Función que retorna el elemento actualizado
 * @returns {Array} Array de elementos actualizado
 */
const updateElementRecursively = (elements, targetId, updateFn) => {
  return elements.map(element => {
    if (element.id === targetId) {
      return updateFn(element);
    }
    
    if (element.props?.children) {
      return {
        ...element,
        props: {
          ...element.props,
          children: updateElementRecursively(element.props.children, targetId, updateFn)
        }
      };
    }
    
    return element;
  });
};

/**
 * Función helper para remover elemento recursivamente
 * 
 * @param {Array} elements - Array de elementos  
 * @param {string} targetId - ID del elemento a remover
 * @returns {Object} { element: elementoRemovido, updatedElements: arrayActualizado }
 */
const removeElementRecursively = (elements, targetId) => {
  let removedElement = null;
  
  const updatedElements = elements.reduce((acc, element) => {
    if (element.id === targetId) {
      removedElement = element;
      return acc; // No agregar este elemento (eliminarlo)
    }
    
    if (element.props?.children) {
      const { element: childRemoved, updatedElements: updatedChildren } = 
        removeElementRecursively(element.props.children, targetId);
      
      if (childRemoved) {
        removedElement = childRemoved;
      }
      
      return [...acc, {
        ...element,
        props: {
          ...element.props,
          children: updatedChildren
        }
      }];
    }
    
    return [...acc, element];
  }, []);
  
  return {
    element: removedElement,
    updatedElements
  };
};

export default useEditor;