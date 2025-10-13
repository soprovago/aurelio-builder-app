/**
 * 🎛️ Utilidades para sliders con gradiente de progreso
 * 
 * Funciones helper para crear sliders con indicador visual
 * de progreso usando gradiente morado.
 */

/**
 * Calcula el estilo de fondo con gradiente de progreso
 * @param {number|string} value - Valor actual del slider
 * @param {number|string} min - Valor mínimo del slider
 * @param {number|string} max - Valor máximo del slider
 * @returns {object} Objeto de estilo para aplicar al slider
 */
export function getProgressGradientStyle(value, min = 0, max = 100) {
  const numValue = parseFloat(value) || 0;
  const numMin = parseFloat(min) || 0;
  const numMax = parseFloat(max) || 100;
  
  // Calcular porcentaje de progreso
  const percentage = ((numValue - numMin) / (numMax - numMin)) * 100;
  
  return {
    background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${percentage}%, #2a2a2a ${percentage}%, #2a2a2a 100%)`,
    WebkitAppearance: 'none',
    outline: 'none'
  };
}

/**
 * Calcula el estilo de fondo con gradiente para valores de opacidad (0-1)
 * @param {number|string} opacity - Valor de opacidad (0-1)
 * @returns {object} Objeto de estilo para aplicar al slider
 */
export function getOpacityProgressStyle(opacity = 1) {
  const percentage = (parseFloat(opacity) || 0) * 100;
  
  return {
    background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${percentage}%, #2a2a2a ${percentage}%, #2a2a2a 100%)`,
    WebkitAppearance: 'none',
    outline: 'none'
  };
}

/**
 * Props comunes para sliders con gradiente de progreso
 */
export const SLIDER_COMMON_PROPS = {
  className: "flex-1 custom-slider progress-gradient",
  style: {
    WebkitAppearance: 'none',
    outline: 'none'
  }
};

/**
 * Crea props completos para un slider con gradiente de progreso
 * @param {number|string} value - Valor actual
 * @param {number|string} min - Valor mínimo
 * @param {number|string} max - Valor máximo
 * @param {function} onChange - Función de cambio
 * @returns {object} Props listos para aplicar al slider
 */
export function createProgressSliderProps(value, min, max, onChange) {
  return {
    value,
    min,
    max,
    onChange,
    className: "flex-1 custom-slider progress-gradient",
    style: getProgressGradientStyle(value, min, max)
  };
}