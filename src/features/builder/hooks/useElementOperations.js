import { useCallback } from 'react';
import useElementUtils from './useElementUtils';

/**
 * Hook para operaciones CRUD de elementos
 * @param {Array} elements - Lista de elementos actual
 * @param {Function} setElements - Función para actualizar elementos
 * @param {Object} selectedElement - Elemento seleccionado actual
 * @param {Function} setSelectedElement - Función para actualizar elemento seleccionado
 */
function useElementOperations(elements, setElements, selectedElement, setSelectedElement) {
  const { updateNestedElement, findAndRemoveElement, generateId } = useElementUtils();

  /**
   * Agregar elementos al canvas principal
   */
  const addElement = useCallback((elementTemplate) => {
    console.log('Adding element to canvas:', elementTemplate.name);
    
    const newElement = {
      id: `${elementTemplate.type}-${generateId()}`,
      type: elementTemplate.type,
      props: { ...elementTemplate.defaultProps },
    };
    
    setElements(prev => [...prev, newElement]);
    setSelectedElement(newElement);
    
    return newElement;
  }, [setElements, setSelectedElement]);

  /**
   * Agregar elementos a contenedores
   */
  const addToContainer = useCallback((containerId, elementTemplate) => {
    console.log('Adding', elementTemplate.name, 'to container', containerId);
    
    const newElement = {
      id: `${elementTemplate.type}-${generateId()}`,
      type: elementTemplate.type,
      props: { ...elementTemplate.defaultProps },
    };

    setElements((prev) => {
      const updated = updateNestedElement(prev, containerId, (container) => {
        const updatedContainer = {
          ...container,
          props: {
            ...container.props,
            children: [...(container.props.children || []), newElement]
          }
        };
        
        console.log('Element added! Container now has', updatedContainer.props.children.length, 'children');
        return updatedContainer;
      });
      
      return updated;
    });
  }, [setElements, updateNestedElement]);

  /**
   * Mover elementos existentes entre contenedores o al canvas
   */
  const moveToContainer = useCallback((elementId, containerId) => {
    console.log('Moving element', elementId, 'to container', containerId);

    setElements((prev) => {
      // 1. Encontrar y remover el elemento de su posición actual
      const { elements: elementsAfterRemoval, foundElement } = findAndRemoveElement(prev, elementId);
      
      if (!foundElement) {
        console.error('Element not found:', elementId);
        return prev;
      }
      
      // 2. Si containerId es null, mover al canvas principal
      if (containerId === null) {
        console.log('Moving element to main canvas');
        return [...elementsAfterRemoval, foundElement];
      }
      
      // 3. Si no, agregar el elemento al contenedor de destino
      const updated = updateNestedElement(elementsAfterRemoval, containerId, (container) => {
        return {
          ...container,
          props: {
            ...container.props,
            children: [...(container.props.children || []), foundElement]
          }
        };
      });
      
      console.log('Element moved successfully');
      return updated;
    });
  }, [setElements, findAndRemoveElement, updateNestedElement]);

  /**
   * Actualizar elemento existente
   */
  const updateElement = useCallback((updatedElement) => {
    console.log('Updating element:', updatedElement.id);
    
    // Función recursiva para buscar y actualizar el elemento
    const updateElementRecursively = (elements) => {
      return elements.map(el => {
        if (el.id === updatedElement.id) {
          return updatedElement;
        }
        if (el.props?.children) {
          return {
            ...el,
            props: {
              ...el.props,
              children: updateElementRecursively(el.props.children)
            }
          };
        }
        return el;
      });
    };
    
    setElements((prev) => updateElementRecursively(prev));
    setSelectedElement(updatedElement);
  }, [setElements, setSelectedElement]);

  /**
   * Eliminar elemento
   */
  const deleteElement = useCallback((elementId, parentId = null) => {
    if (parentId) {
      // Eliminar de contenedor específico
      setElements(prev => updateNestedElement(prev, parentId, (container) => ({
        ...container,
        props: {
          ...container.props,
          children: container.props.children?.filter(child => child.id !== elementId) || []
        }
      })));
    } else {
      // Eliminar del canvas principal
      setElements(prev => prev.filter(element => element.id !== elementId));
    }
    
    // Deseleccionar si era el elemento seleccionado
    if (selectedElement?.id === elementId) {
      setSelectedElement(null);
    }
  }, [setElements, updateNestedElement, selectedElement, setSelectedElement]);

  /**
   * Duplicar elemento
   */
  const duplicateElement = useCallback((elementToDuplicate, parentId = null) => {
    const duplicatedElement = {
      ...elementToDuplicate,
      id: `${elementToDuplicate.type}-${generateId()}`,
      props: { ...elementToDuplicate.props }
    };

    if (parentId) {
      // Duplicar en contenedor específico
      setElements(prev => updateNestedElement(prev, parentId, (container) => ({
        ...container,
        props: {
          ...container.props,
          children: [...(container.props.children || []), duplicatedElement]
        }
      })));
    } else {
      // Duplicar en canvas principal
      setElements(prev => [...prev, duplicatedElement]);
    }

    return duplicatedElement;
  }, [setElements, updateNestedElement]);

  /**
   * Agregar elemento en índice específico (para reordenamiento)
   */
  const addElementAtIndex = useCallback((elementTemplate, index) => {
    console.log('Adding element at index:', elementTemplate.name, 'at index:', index);
    
    const newElement = {
      id: `${elementTemplate.type}-${generateId()}`,
      type: elementTemplate.type,
      props: { ...elementTemplate.defaultProps },
    };
    
    setElements(prev => {
      const newElements = [...prev];
      newElements.splice(index, 0, newElement);
      return newElements;
    });
    
    setSelectedElement(newElement);
    return newElement;
  }, [setElements, setSelectedElement]);

  /**
   * Reordenar elementos en el canvas
   */
  const reorderElements = useCallback((fromIndex, toIndex) => {
    console.log('Reordering elements:', fromIndex, '->', toIndex);
    
    setElements(prev => {
      const newElements = [...prev];
      const [movedElement] = newElements.splice(fromIndex, 1);
      newElements.splice(toIndex, 0, movedElement);
      return newElements;
    });
  }, [setElements]);

  return {
    addElement,
    addToContainer,
    moveToContainer,
    updateElement,
    deleteElement,
    duplicateElement,
    addElementAtIndex,
    reorderElements
  };
}

export default useElementOperations;
