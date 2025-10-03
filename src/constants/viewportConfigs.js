import {
  FiMonitor,
  FiTablet,
  FiSmartphone
} from 'react-icons/fi';

/**
 * Modos de visualización responsive disponibles
 */
export const VIEWPORT_MODES = {
  DESKTOP: 'desktop',
  TABLET: 'tablet',
  MOBILE: 'mobile',
};

/**
 * Configuraciones específicas para cada modo de viewport
 * 
 * @description Define las dimensiones, iconos y comportamientos para cada modo
 * de visualización en el editor responsive de Aurelio Builder
 */
export const VIEWPORT_CONFIGS = {
  [VIEWPORT_MODES.DESKTOP]: {
    name: 'Escritorio',
    icon: FiMonitor,
    width: '100%',
    maxWidth: '1920px',
    minHeight: '1080px',
    padding: '0px',
    margin: '0px',
    description: 'Vista de escritorio - Full HD estándar',
    breakpoint: '1024px+',
    defaultContainerWidth: '1340px'
  },
  [VIEWPORT_MODES.TABLET]: {
    name: 'Tablet',
    icon: FiTablet,
    width: '768px',
    maxWidth: '768px',
    minHeight: '1024px',
    padding: '0px',
    margin: '20px auto',
    description: 'Vista de tablet - iPad estándar',
    breakpoint: '768px - 1023px',
    defaultContainerWidth: '100%'
  },
  [VIEWPORT_MODES.MOBILE]: {
    name: 'Móvil',
    icon: FiSmartphone,
    width: '375px',
    maxWidth: '375px',
    minHeight: '812px', // iPhone X standard height
    padding: '0px',
    margin: '16px auto',
    description: 'Vista móvil - iPhone estándar',
    breakpoint: '0px - 767px',
    defaultContainerWidth: '100%'
  },
};

/**
 * Obtener configuración de viewport por modo
 * @param {string} mode - Modo de viewport (desktop, tablet, mobile)
 * @returns {Object} Configuración del viewport
 */
export const getViewportConfig = (mode) => {
  return VIEWPORT_CONFIGS[mode] || VIEWPORT_CONFIGS[VIEWPORT_MODES.DESKTOP];
};

/**
 * Obtener lista de todos los modos disponibles
 * @returns {Array<Object>} Array de configuraciones de viewport
 */
export const getAllViewportModes = () => {
  return Object.values(VIEWPORT_MODES).map(mode => ({
    mode,
    ...VIEWPORT_CONFIGS[mode]
  }));
};

/**
 * Validar si un modo de viewport es válido
 * @param {string} mode - Modo a validar
 * @returns {boolean} True si el modo es válido
 */
export const isValidViewportMode = (mode) => {
  return Object.values(VIEWPORT_MODES).includes(mode);
};

/**
 * Obtener el modo por defecto
 * @returns {string} Modo de viewport por defecto
 */
export const getDefaultViewportMode = () => {
  return VIEWPORT_MODES.DESKTOP;
};