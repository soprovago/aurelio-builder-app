/**
 * Hook con utilidades para manipular elementos en la jerarquía
 */
export function useElementUtils() {
  /**
   * Función para buscar y actualizar elementos anidados recursivamente
   */
  const updateNestedElement = (elements, targetId, updater) => {
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
  };

  /**
   * Función para encontrar un elemento en cualquier nivel de la jerarquía
   */
  const findElementById = (elements, targetId) => {
    for (const element of elements) {
      if (element.id === targetId) {
        return element;
      }
      if (element.props?.children) {
        const found = findElementById(element.props.children, targetId);
        if (found) return found;
      }
    }
    return null;
  };

  /**
   * Función para obtener la ruta completa de un elemento (para debugging)
   */
  const getElementPath = (elements, targetId, path = []) => {
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const currentPath = [...path, { id: element.id, type: element.type, index: i }];
      
      if (element.id === targetId) {
        return currentPath;
      }
      
      if (element.props?.children) {
        const found = getElementPath(element.props.children, targetId, currentPath);
        if (found) return found;
      }
    }
    return null;
  };

  /**
   * Función para generar IDs únicos
   */
  const generateId = () => {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  /**
   * Función recursiva para encontrar y remover un elemento
   */
  const findAndRemoveElement = (elements, targetId) => {
    let foundElement = null;
    
    const updatedElements = elements.reduce((acc, element) => {
      if (element.id === targetId) {
        foundElement = element;
        return acc; // No incluir este elemento en el resultado
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

  return {
    updateNestedElement,
    findElementById,
    getElementPath,
    generateId,
    findAndRemoveElement
  };
}