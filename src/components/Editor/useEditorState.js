import { useState, useCallback } from 'react';
import { VIEWPORT_MODES } from '../../constants/viewportConfigs';

/**
 * Hook personalizado para manejar el estado del editor
 */
export function useEditorState() {
  // Estado básico del editor
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [viewportMode, setViewportMode] = useState(VIEWPORT_MODES.DESKTOP);
  const [projectName, setProjectName] = useState('Mi Proyecto');

  // Función para generar IDs únicos
  const generateId = useCallback(() => {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Función para agregar elementos al canvas principal
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
  }, [generateId]);

  // Función para seleccionar elementos
  const selectElement = useCallback((element) => {
    setSelectedElement(element);
  }, []);

  // Función para actualizar elementos
  const updateElement = useCallback((updatedElement) => {
    console.log('Updating element:', updatedElement.id);
    
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
    
    setElements(prev => updateElementRecursively(prev));
    setSelectedElement(updatedElement);
  }, []);

  // Función para buscar y actualizar elementos anidados recursivamente
  const updateNestedElement = useCallback((elements, targetId, updater) => {
    return elements.map(element => {
      if (element.id === targetId) {
        return updater(element);
      }
      if (element.props?.children) {
        return {
          ...element,
          props: {
            ...element.props,
            children: updateNestedElement(element.props.children, targetId, updater)
          }
        };
      }
      return element;
    });
  }, []);

  // Función para agregar a contenedor
  const addToContainer = useCallback((containerId, elementTemplate) => {
    console.log('📦 Adding to container:', containerId, elementTemplate.name);
    
    const newElement = {
      id: `${elementTemplate.type}-${generateId()}`,
      type: elementTemplate.type,
      props: { ...elementTemplate.defaultProps },
    };
    
    setElements(prev => 
      updateNestedElement(prev, containerId, (container) => ({
        ...container,
        props: {
          ...container.props,
          children: [...(container.props.children || []), newElement]
        }
      }))
    );
    
    return newElement;
  }, [generateId, updateNestedElement]);

  // Función para mover elementos entre contenedores
  const moveToContainer = useCallback((elementId, containerId) => {
    console.log('Moving element', elementId, 'to container', containerId);
    
    const findAndRemoveElement = (elements, targetId) => {
      let foundElement = null;
      
      const updatedElements = elements.reduce((acc, element) => {
        if (element.id === targetId) {
          foundElement = element;
          return acc;
        }
        
        if (element.props?.children) {
          const result = findAndRemoveElement(element.props.children, targetId);
          if (result.foundElement) {
            foundElement = result.foundElement;
          }
          return [...acc, {
            ...element,
            props: {
              ...element.props,
              children: result.elements
            }
          }];
        }
        
        return [...acc, element];
      }, []);
      
      return { elements: updatedElements, foundElement };
    };

    setElements((prev) => {
      const { elements: elementsAfterRemoval, foundElement } = findAndRemoveElement(prev, elementId);
      
      if (!foundElement) {
        console.error('Element not found:', elementId);
        return prev;
      }
      
      if (containerId === null) {
        console.log('Moving element to main canvas');
        return [...elementsAfterRemoval, foundElement];
      }
      
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
  }, [updateNestedElement]);

  return {
    // Estado
    elements,
    selectedElement,
    viewportMode,
    projectName,
    
    // Setters
    setElements,
    setSelectedElement,
    setViewportMode,
    setProjectName,
    
    // Operaciones
    addElement,
    selectElement,
    updateElement,
    updateNestedElement,
    generateId,
    
    // Operaciones de contenedor
    addToContainer,
    moveToContainer,
  };
}