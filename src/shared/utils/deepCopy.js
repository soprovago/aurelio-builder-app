/**
 * Utilidad para realizar deep copy (copia profunda) de objetos
 * Maneja objetos, arrays, dates y valores primitivos
 * 
 * @param {*} obj - Objeto a copiar
 * @returns {*} Copia profunda del objeto
 */
export const deepCopy = (obj) => {
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

/**
 * Duplicar elemento con deep copy y nuevo ID único
 * 
 * @param {Object} element - Elemento a duplicar
 * @param {Function} generateId - Función para generar IDs únicos
 * @returns {Object} Elemento duplicado con datos independientes
 */
export const duplicateElementWithDeepCopy = (element, generateId) => {
  const duplicatedElement = {
    ...element,
    id: `${element.type}-${generateId()}`,
    props: deepCopy(element.props)
  };
  
  // Si el elemento tiene children, también duplicarlos con IDs únicos
  if (duplicatedElement.props?.children) {
    duplicatedElement.props.children = duplicatedElement.props.children.map(child => ({
      ...child,
      id: `${child.type}-${generateId()}`,
      props: deepCopy(child.props)
    }));
  }
  
  return duplicatedElement;
};

export default deepCopy;