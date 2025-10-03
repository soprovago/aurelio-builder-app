/**
 * Container Element Component
 * Elemento contenedor flexible con propiedades de layout
 */

import React from 'react';
import { FiGrid } from 'react-icons/fi';
import { useElementStyles } from '../../core/ElementRenderer';

function Container({ 
  children = [],
  isSelected = false,
  onSelect = () => {},
  onDoubleClick = () => {},
  viewportMode,
  // Container specific props
  layout = 'vertical',
  gap = '16px',
  padding = '20px',
  backgroundColor = 'transparent',
  borderRadius = '0px',
  border = 'none',
  minHeight = '100px',
  justifyContent = 'flex-start',
  alignItems = 'stretch',
  flexDirection = 'column',
  flexWrap = 'nowrap',
  width = '100%',
  height = 'auto',
  ...otherProps
}) {
  // Compute styles using the element styles hook
  const computedStyles = {
    display: 'flex',
    flexDirection,
    gap,
    padding,
    backgroundColor: backgroundColor === 'transparent' ? 'transparent' : backgroundColor,
    borderRadius,
    border: border === 'none' ? 'none' : border,
    minHeight,
    justifyContent,
    alignItems,
    flexWrap,
    width,
    height: height === 'auto' ? 'auto' : height,
    position: 'relative',
    ...otherProps.style
  };

  const handleClick = (e) => {
    e.stopPropagation();
    onSelect();
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    onDoubleClick();
  };

  return (
    <div
      className={`aurelio-container transition-all ${isSelected ? 'aurelio-selected' : ''} hover:outline hover:outline-1 hover:outline-blue-400 hover:outline-dashed`}
      style={computedStyles}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      data-testid="aurelio-container"
    >
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute -top-0.5 -left-0.5 -right-0.5 -bottom-0.5 border-2 border-blue-500 pointer-events-none rounded" />
      )}

      {/* Content */}
      {children && children.length > 0 ? (
        children
      ) : (
        <div className="flex items-center justify-center py-12 text-gray-400 select-none">
          <div className="text-center">
            <FiGrid className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs">Arrastra elementos aquí</p>
          </div>
        </div>
      )}

      {/* Resize handles when selected */}
      {isSelected && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Corner handles */}
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 border border-white pointer-events-auto cursor-nw-resize" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 border border-white pointer-events-auto cursor-ne-resize" />
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-500 border border-white pointer-events-auto cursor-sw-resize" />
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 border border-white pointer-events-auto cursor-se-resize" />
        </div>
      )}
    </div>
  );
}

// Configuración específica del elemento Container
Container.elementConfig = {
  type: 'container',
  name: 'Contenedor',
  icon: <FiGrid className="w-5 h-5" />,
  category: 'layout',
  description: 'Contenedor flexible para organizar otros elementos',
  tags: ['layout', 'container', 'flex', 'wrapper'],
  
  // Propiedades específicas del Container (además de las base)
  properties: {
    layout: {
      type: 'select',
      label: 'Orientación',
      default: 'vertical',
      options: [
        { value: 'vertical', label: 'Vertical' },
        { value: 'horizontal', label: 'Horizontal' }
      ],
      category: 'layout'
    },
    gap: {
      type: 'spacing',
      label: 'Espaciado',
      default: '16px',
      responsive: true,
      units: ['px', 'rem', 'em'],
      min: 0,
      max: 100,
      category: 'layout'
    },
    justifyContent: {
      type: 'select',
      label: 'Alineación horizontal',
      default: 'flex-start',
      options: [
        { value: 'flex-start', label: 'Inicio' },
        { value: 'center', label: 'Centro' },
        { value: 'flex-end', label: 'Final' },
        { value: 'space-between', label: 'Espacio entre' },
        { value: 'space-around', label: 'Espacio alrededor' },
        { value: 'space-evenly', label: 'Espacio uniforme' }
      ],
      category: 'layout'
    },
    alignItems: {
      type: 'select',
      label: 'Alineación vertical',
      default: 'stretch',
      options: [
        { value: 'stretch', label: 'Estirar' },
        { value: 'flex-start', label: 'Inicio' },
        { value: 'center', label: 'Centro' },
        { value: 'flex-end', label: 'Final' },
        { value: 'baseline', label: 'Línea base' }
      ],
      category: 'layout'
    },
    flexWrap: {
      type: 'select',
      label: 'Ajuste de línea',
      default: 'nowrap',
      options: [
        { value: 'nowrap', label: 'No ajustar' },
        { value: 'wrap', label: 'Ajustar' },
        { value: 'wrap-reverse', label: 'Ajustar inverso' }
      ],
      category: 'layout'
    }
  },

  // Props por defecto específicas
  defaultProps: {
    layout: 'vertical',
    gap: '16px',
    padding: '20px',
    backgroundColor: 'transparent',
    borderRadius: '0px',
    border: 'none',
    minHeight: '100px',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    width: '100%',
    height: 'auto',
    children: []
  }
};

export default Container;