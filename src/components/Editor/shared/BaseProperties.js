/**
 * Base Properties System
 * Propiedades compartidas que pueden heredar todos los elementos del editor
 */

// Propiedades de espaciado (Layout)
export const SPACING_PROPERTIES = {
  padding: {
    type: 'spacing',
    default: '0px',
    responsive: true,
    sides: ['top', 'right', 'bottom', 'left'],
    units: ['px', 'rem', 'em', '%'],
    min: 0,
    max: 100
  },
  margin: {
    type: 'spacing',
    default: '0px',
    responsive: true,
    sides: ['top', 'right', 'bottom', 'left'],
    units: ['px', 'rem', 'em', '%'],
    min: -100,
    max: 100
  },
  gap: {
    type: 'spacing',
    default: '0px',
    responsive: true,
    units: ['px', 'rem', 'em'],
    min: 0,
    max: 100
  }
};

// Propiedades de apariencia visual
export const VISUAL_PROPERTIES = {
  backgroundColor: {
    type: 'color',
    default: 'transparent',
    supportAlpha: true,
    presets: ['transparent', '#ffffff', '#000000', '#ff1b6d', '#8b5cf6']
  },
  borderRadius: {
    type: 'spacing',
    default: '0px',
    responsive: true,
    corners: ['topLeft', 'topRight', 'bottomRight', 'bottomLeft'],
    units: ['px', 'rem', '%'],
    min: 0,
    max: 50
  },
  border: {
    type: 'border',
    default: {
      width: '0px',
      style: 'solid',
      color: '#000000'
    },
    styles: ['none', 'solid', 'dashed', 'dotted'],
    units: ['px'],
    min: 0,
    max: 20
  },
  boxShadow: {
    type: 'shadow',
    default: 'none',
    presets: [
      'none',
      '0 1px 3px rgba(0,0,0,0.12)',
      '0 4px 6px rgba(0,0,0,0.1)',
      '0 10px 15px rgba(0,0,0,0.1)',
      '0 25px 50px rgba(0,0,0,0.25)'
    ]
  },
  opacity: {
    type: 'slider',
    default: 1,
    min: 0,
    max: 1,
    step: 0.1
  }
};

// Propiedades de tipografía
export const TYPOGRAPHY_PROPERTIES = {
  color: {
    type: 'color',
    default: '#000000',
    supportAlpha: true,
    presets: ['#000000', '#ffffff', '#333333', '#666666', '#999999']
  },
  fontSize: {
    type: 'spacing',
    default: '16px',
    responsive: true,
    units: ['px', 'rem', 'em'],
    min: 8,
    max: 72
  },
  fontFamily: {
    type: 'select',
    default: 'Inter',
    options: [
      { value: 'Inter', label: 'Inter' },
      { value: 'Roboto', label: 'Roboto' },
      { value: 'Arial', label: 'Arial' },
      { value: 'Georgia', label: 'Georgia' },
      { value: 'monospace', label: 'Monospace' }
    ]
  },
  fontWeight: {
    type: 'select',
    default: '400',
    options: [
      { value: '100', label: 'Thin (100)' },
      { value: '200', label: 'Light (200)' },
      { value: '300', label: 'Light (300)' },
      { value: '400', label: 'Regular (400)' },
      { value: '500', label: 'Medium (500)' },
      { value: '600', label: 'Semibold (600)' },
      { value: '700', label: 'Bold (700)' },
      { value: '800', label: 'Extra Bold (800)' },
      { value: '900', label: 'Black (900)' }
    ]
  },
  lineHeight: {
    type: 'spacing',
    default: '1.5',
    units: ['', 'px', 'rem'],
    min: 0.8,
    max: 3,
    step: 0.1
  },
  textAlign: {
    type: 'select',
    default: 'left',
    options: [
      { value: 'left', label: 'Izquierda' },
      { value: 'center', label: 'Centro' },
      { value: 'right', label: 'Derecha' },
      { value: 'justify', label: 'Justificado' }
    ]
  }
};

// Propiedades de layout/posicionamiento
export const LAYOUT_PROPERTIES = {
  display: {
    type: 'select',
    default: 'block',
    options: [
      { value: 'block', label: 'Block' },
      { value: 'inline-block', label: 'Inline Block' },
      { value: 'flex', label: 'Flex' },
      { value: 'grid', label: 'Grid' },
      { value: 'none', label: 'None' }
    ]
  },
  position: {
    type: 'select',
    default: 'static',
    options: [
      { value: 'static', label: 'Static' },
      { value: 'relative', label: 'Relative' },
      { value: 'absolute', label: 'Absolute' },
      { value: 'fixed', label: 'Fixed' },
      { value: 'sticky', label: 'Sticky' }
    ]
  },
  width: {
    type: 'dimension',
    default: 'auto',
    responsive: true,
    units: ['auto', 'px', '%', 'rem', 'vw'],
    min: 0,
    max: 2000
  },
  height: {
    type: 'dimension',
    default: 'auto',
    responsive: true,
    units: ['auto', 'px', '%', 'rem', 'vh'],
    min: 0,
    max: 2000
  },
  minWidth: {
    type: 'dimension',
    default: 'auto',
    responsive: true,
    units: ['auto', 'px', '%', 'rem'],
    min: 0,
    max: 2000
  },
  minHeight: {
    type: 'dimension',
    default: 'auto',
    responsive: true,
    units: ['auto', 'px', '%', 'rem'],
    min: 0,
    max: 2000
  }
};

// Propiedades de flexbox
export const FLEXBOX_PROPERTIES = {
  flexDirection: {
    type: 'select',
    default: 'row',
    options: [
      { value: 'row', label: 'Horizontal →' },
      { value: 'row-reverse', label: 'Horizontal ←' },
      { value: 'column', label: 'Vertical ↓' },
      { value: 'column-reverse', label: 'Vertical ↑' }
    ]
  },
  justifyContent: {
    type: 'select',
    default: 'flex-start',
    options: [
      { value: 'flex-start', label: 'Inicio' },
      { value: 'center', label: 'Centro' },
      { value: 'flex-end', label: 'Final' },
      { value: 'space-between', label: 'Espacio entre' },
      { value: 'space-around', label: 'Espacio alrededor' },
      { value: 'space-evenly', label: 'Espacio uniforme' }
    ]
  },
  alignItems: {
    type: 'select',
    default: 'stretch',
    options: [
      { value: 'stretch', label: 'Estirar' },
      { value: 'flex-start', label: 'Inicio' },
      { value: 'center', label: 'Centro' },
      { value: 'flex-end', label: 'Final' },
      { value: 'baseline', label: 'Línea base' }
    ]
  },
  flexWrap: {
    type: 'select',
    default: 'nowrap',
    options: [
      { value: 'nowrap', label: 'No envolver' },
      { value: 'wrap', label: 'Envolver' },
      { value: 'wrap-reverse', label: 'Envolver reverso' }
    ]
  }
};

// Propiedades de transformación
export const TRANSFORM_PROPERTIES = {
  transform: {
    type: 'transform',
    default: {
      rotate: 0,
      scaleX: 1,
      scaleY: 1,
      translateX: 0,
      translateY: 0,
      skewX: 0,
      skewY: 0
    }
  }
};

// Propiedades de animación/transición
export const ANIMATION_PROPERTIES = {
  transition: {
    type: 'transition',
    default: 'none',
    properties: ['all', 'opacity', 'transform', 'background-color', 'color'],
    durations: ['0ms', '150ms', '300ms', '500ms', '1s', '2s'],
    easings: ['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear']
  }
};

// Agrupación de todas las propiedades base
export const BASE_PROPERTIES = {
  ...SPACING_PROPERTIES,
  ...VISUAL_PROPERTIES,
  ...TYPOGRAPHY_PROPERTIES,
  ...LAYOUT_PROPERTIES,
  ...FLEXBOX_PROPERTIES,
  ...TRANSFORM_PROPERTIES,
  ...ANIMATION_PROPERTIES
};

// Función helper para obtener propiedades por categoría
export const getPropertiesByCategory = (category) => {
  const categories = {
    spacing: SPACING_PROPERTIES,
    visual: VISUAL_PROPERTIES,
    typography: TYPOGRAPHY_PROPERTIES,
    layout: LAYOUT_PROPERTIES,
    flexbox: FLEXBOX_PROPERTIES,
    transform: TRANSFORM_PROPERTIES,
    animation: ANIMATION_PROPERTIES
  };
  
  return categories[category] || {};
};

// Función helper para validar una propiedad
export const validateProperty = (propertyName, value, propertyConfig) => {
  if (!propertyConfig) return { valid: false, error: 'Property config not found' };
  
  const { type, min, max, options, units } = propertyConfig;
  
  switch (type) {
    case 'spacing':
    case 'dimension':
      // Validar que el valor tenga unidades válidas si es necesario
      if (typeof value === 'string' && units) {
        const hasValidUnit = units.some(unit => value.endsWith(unit));
        if (!hasValidUnit) {
          return { valid: false, error: `Unit must be one of: ${units.join(', ')}` };
        }
      }
      break;
      
    case 'select':
      if (options && !options.find(opt => opt.value === value)) {
        return { valid: false, error: 'Invalid option' };
      }
      break;
      
    case 'slider':
      const numValue = parseFloat(value);
      if (min !== undefined && numValue < min) {
        return { valid: false, error: `Value must be >= ${min}` };
      }
      if (max !== undefined && numValue > max) {
        return { valid: false, error: `Value must be <= ${max}` };
      }
      break;
  }
  
  return { valid: true };
};

export default BASE_PROPERTIES;