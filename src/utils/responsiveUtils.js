/**
 * Utilidades para manejo de propiedades responsive en Aurelio Builder
 * 
 * @description Funciones helper para gestionar propiedades que varían según
 * el viewport (desktop, tablet, mobile) de manera consistente y eficiente.
 */

/**
 * Obtener propiedad responsive para un viewport específico
 * 
 * @param {Object} props - Propiedades del elemento
 * @param {string} property - Nombre de la propiedad a obtener
 * @param {string} viewportMode - Modo de viewport actual
 * @returns {any} Valor de la propiedad para el viewport o fallback
 */
export const getResponsiveProperty = (props, property, viewportMode) => {
  // Si el elemento tiene propiedades responsivas definidas
  if (props.responsive && 
      props.responsive[viewportMode] && 
      props.responsive[viewportMode][property] !== undefined) {
    return props.responsive[viewportMode][property];
  }
  
  // Fallback a la propiedad normal
  return props[property];
};

/**
 * Establecer propiedad responsive para un viewport específico
 * 
 * @param {Object} element - Elemento completo
 * @param {string} property - Nombre de la propiedad
 * @param {any} value - Valor a establecer
 * @param {string} viewportMode - Modo de viewport
 * @returns {Object} Elemento actualizado con la nueva propiedad
 */
export const setResponsiveProperty = (element, property, value, viewportMode) => {
  const updatedElement = {
    ...element,
    props: {
      ...element.props,
      [property]: value, // Actualizar también la propiedad base
    }
  };

  // Para contenedores, también actualizar la propiedad responsiva correspondiente
  if (element.props.responsive) {
    updatedElement.props.responsive = {
      ...element.props.responsive,
      [viewportMode]: {
        ...element.props.responsive[viewportMode],
        [property]: value
      }
    };
  }

  return updatedElement;
};

/**
 * Inicializar propiedades responsive para un elemento
 * 
 * @param {Object} defaultProps - Propiedades por defecto del elemento
 * @param {Object} customProps - Propiedades personalizadas adicionales
 * @returns {Object} Propiedades con estructura responsive inicializada
 */
export const initializeResponsiveProps = (defaultProps, customProps = {}) => {
  return {
    ...defaultProps,
    ...customProps,
    responsive: {
      desktop: { ...defaultProps.responsive?.desktop },
      tablet: { ...defaultProps.responsive?.tablet },
      mobile: { ...defaultProps.responsive?.mobile },
      ...customProps.responsive
    }
  };
};

/**
 * Obtener todas las propiedades para un viewport específico
 * 
 * @param {Object} props - Propiedades del elemento
 * @param {string} viewportMode - Modo de viewport
 * @returns {Object} Objeto con todas las propiedades del viewport
 */
export const getViewportProperties = (props, viewportMode) => {
  const responsiveProps = props.responsive?.[viewportMode] || {};
  
  return {
    ...props,
    ...responsiveProps
  };
};

/**
 * Verificar si un elemento tiene propiedades responsive configuradas
 * 
 * @param {Object} element - Elemento a verificar
 * @returns {boolean} True si tiene propiedades responsive
 */
export const hasResponsiveProperties = (element) => {
  return element.props.responsive && 
         Object.keys(element.props.responsive).length > 0;
};

/**
 * Limpiar propiedades responsive vacías o inválidas
 * 
 * @param {Object} element - Elemento a limpiar
 * @returns {Object} Elemento con propiedades responsive limpiadas
 */
export const cleanResponsiveProperties = (element) => {
  if (!element.props.responsive) {
    return element;
  }

  const cleanedResponsive = {};
  
  Object.keys(element.props.responsive).forEach(viewport => {
    const viewportProps = element.props.responsive[viewport];
    
    // Solo mantener propiedades con valores definidos
    const cleanedProps = Object.keys(viewportProps).reduce((acc, key) => {
      if (viewportProps[key] !== undefined && viewportProps[key] !== null) {
        acc[key] = viewportProps[key];
      }
      return acc;
    }, {});
    
    if (Object.keys(cleanedProps).length > 0) {
      cleanedResponsive[viewport] = cleanedProps;
    }
  });

  return {
    ...element,
    props: {
      ...element.props,
      responsive: Object.keys(cleanedResponsive).length > 0 ? cleanedResponsive : undefined
    }
  };
};