/**
 * Element Renderer System
 * Sistema genérico para renderizar cualquier tipo de elemento registrado
 */

import React from 'react';
import elementRegistry from './ElementRegistry';
import { VIEWPORT_MODES } from '../../../constants/viewportConfigs';

/**
 * Componente genérico que renderiza cualquier elemento basado en su tipo
 */
function ElementRenderer({ 
  element, 
  isSelected = false, 
  viewportMode = VIEWPORT_MODES.DESKTOP,
  onSelect = () => {},
  onDoubleClick = () => {},
  children
}) {
  if (!element || !element.type) {
    console.warn('ElementRenderer: Invalid element provided', element);
    return null;
  }

  const elementConfig = elementRegistry.getElement(element.type);
  
  if (!elementConfig) {
    console.warn(`ElementRenderer: Element type "${element.type}" not found in registry`);
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <strong>Error:</strong> Element type "{element.type}" not found
      </div>
    );
  }

  const { renderComponent: RenderComponent } = elementConfig;
  
  // Merge element props with computed styles
  const computedProps = {
    ...element.props,
    id: element.id,
    viewportMode,
    isSelected,
    onSelect: () => onSelect(element),
    onDoubleClick: () => onDoubleClick(element),
    children: children || element.children
  };

  try {
    // Estilos especiales para centrar botones
    const wrapperStyle = element.type === 'button' && element.props?.alignSelf === 'center' 
      ? { display: 'flex', justifyContent: 'center' }
      : {};

    return (
      <div
        className={`element-wrapper ${isSelected ? 'selected' : ''}`}
        data-element-id={element.id}
        data-element-type={element.type}
        style={wrapperStyle}
      >
        <RenderComponent {...computedProps} />
      </div>
    );
  } catch (error) {
    console.error(`ElementRenderer: Error rendering element "${element.type}"`, error);
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        <strong>Render Error:</strong> {element.type}
        <div className="text-sm mt-1">{error.message}</div>
      </div>
    );
  }
}

/**
 * Componente para renderizar una lista de elementos (como children de un container)
 */
function ElementList({ 
  elements = [], 
  selectedElement,
  viewportMode,
  onSelectElement,
  onDoubleClickElement
}) {
  if (!Array.isArray(elements) || elements.length === 0) {
    return null;
  }

  return (
    <>
      {elements.map((element) => (
        <ElementRenderer
          key={element.id}
          element={element}
          isSelected={selectedElement?.id === element.id}
          viewportMode={viewportMode}
          onSelect={onSelectElement}
          onDoubleClick={onDoubleClickElement}
        >
          {/* Renderizar children recursivamente */}
          {element.children && element.children.length > 0 && (
            <ElementList
              elements={element.children}
              selectedElement={selectedElement}
              viewportMode={viewportMode}
              onSelectElement={onSelectElement}
              onDoubleClickElement={onDoubleClickElement}
            />
          )}
        </ElementRenderer>
      ))}
    </>
  );
}

/**
 * Hook para obtener estilos computados de un elemento
 */
export function useElementStyles(element, viewportMode = VIEWPORT_MODES.DESKTOP) {
  const elementConfig = elementRegistry.getElement(element.type);
  
  if (!elementConfig) {
    return {};
  }

  const { properties } = elementConfig;
  const computedStyles = {};

  // Aplicar propiedades base CSS
  Object.entries(element.props).forEach(([propName, propValue]) => {
    const propConfig = properties[propName];
    
    if (propConfig && propConfig.type) {
      // Convertir propiedades a CSS válido
      switch (propConfig.type) {
        case 'color':
          if (propValue && propValue !== 'transparent') {
            computedStyles[propName] = propValue;
          }
          break;
          
        case 'spacing':
        case 'dimension':
          if (propValue && propValue !== 'auto') {
            // Convertir camelCase a kebab-case para CSS
            const cssProperty = propName.replace(/([A-Z])/g, '-$1').toLowerCase();
            computedStyles[cssProperty] = propValue;
          }
          break;
          
        case 'select':
          if (propValue) {
            const cssProperty = propName.replace(/([A-Z])/g, '-$1').toLowerCase();
            computedStyles[cssProperty] = propValue;
          }
          break;
          
        case 'slider':
          if (propValue !== undefined) {
            const cssProperty = propName.replace(/([A-Z])/g, '-$1').toLowerCase();
            computedStyles[cssProperty] = propValue;
          }
          break;
      }
    }
  });

  return computedStyles;
}

/**
 * Componente de alto nivel para renderizar el canvas completo
 */
function CanvasRenderer({ 
  elements = [], 
  selectedElement,
  viewportMode = VIEWPORT_MODES.DESKTOP,
  onSelectElement = () => {},
  onDoubleClickElement = () => {},
  className = "",
  style = {}
}) {
  return (
    <div 
      className={`canvas-renderer ${className}`}
      style={style}
      data-viewport={viewportMode}
    >
      <ElementList
        elements={elements}
        selectedElement={selectedElement}
        viewportMode={viewportMode}
        onSelectElement={onSelectElement}
        onDoubleClickElement={onDoubleClickElement}
      />
      
      {elements.length === 0 && (
        <div className="flex items-center justify-center h-64 text-gray-400">
          <div className="text-center">
            <div className="text-4xl mb-4">📄</div>
            <p className="text-lg font-medium">Canvas vacío</p>
            <p className="text-sm">Arrastra elementos aquí para comenzar</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ElementRenderer;
export { ElementList, CanvasRenderer, useElementStyles };