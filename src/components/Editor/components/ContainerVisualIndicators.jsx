import React from 'react';
import { FiGrid, FiArrowRight, FiArrowDown, FiRotateCw, FiMaximize2 } from 'react-icons/fi';

/**
 * Indicadores visuales avanzados para contenedores
 * Muestra información sobre el layout flexbox de manera visual
 */
function ContainerVisualIndicators({ element, isSelected, className = "" }) {
  if (!element || element.type !== 'container') return null;

  const props = element.props || {};
  const {
    flexDirection = 'column',
    justifyContent = 'flex-start',
    alignItems = 'stretch',
    flexWrap = 'nowrap',
    gap = '16px',
    children = []
  } = props;

  const isHorizontal = flexDirection.includes('row');
  const isReverse = flexDirection.includes('reverse');
  const hasWrap = flexWrap !== 'nowrap';

  // Solo mostrar si el contenedor está seleccionado
  if (!isSelected) return null;

  return (
    <div className={`absolute -top-8 left-0 z-50 ${className}`}>
      <div className="flex items-center bg-purple-600 text-white text-xs px-2 py-1 rounded-md shadow-lg border border-purple-500">
        {/* Icono principal */}
        <FiGrid className="w-3 h-3 mr-1" />
        
        {/* Indicador de dirección */}
        <div className="flex items-center mr-2">
          {isHorizontal ? (
            <>
              {isReverse ? (
                <span className="flex items-center text-orange-200">
                  ← Row Rev
                </span>
              ) : (
                <span className="flex items-center text-blue-200">
                  → Row
                </span>
              )}
            </>
          ) : (
            <>
              {isReverse ? (
                <span className="flex items-center text-orange-200">
                  ↑ Col Rev
                </span>
              ) : (
                <span className="flex items-center text-green-200">
                  ↓ Col
                </span>
              )}
            </>
          )}
        </div>

        {/* Separador */}
        <div className="w-px h-3 bg-purple-400 mx-2" />

        {/* Indicador de justify-content */}
        <div className="flex items-center mr-2">
          <span className="text-yellow-200 text-xs">
            {justifyContent === 'flex-start' && 'Start'}
            {justifyContent === 'center' && 'Center'}
            {justifyContent === 'flex-end' && 'End'}
            {justifyContent === 'space-between' && 'Between'}
            {justifyContent === 'space-around' && 'Around'}
            {justifyContent === 'space-evenly' && 'Evenly'}
          </span>
        </div>

        {/* Indicador de align-items */}
        <div className="flex items-center mr-2">
          <span className="text-cyan-200 text-xs">
            {alignItems === 'stretch' && 'Stretch'}
            {alignItems === 'flex-start' && 'Start'}
            {alignItems === 'center' && 'Center'}
            {alignItems === 'flex-end' && 'End'}
            {alignItems === 'baseline' && 'Baseline'}
          </span>
        </div>

        {/* Indicador de wrap si está activado */}
        {hasWrap && (
          <>
            <div className="w-px h-3 bg-purple-400 mx-2" />
            <div className="flex items-center">
              <FiRotateCw className="w-3 h-3 text-pink-200" />
              <span className="text-pink-200 text-xs ml-1">
                {flexWrap === 'wrap' ? 'Wrap' : 'Wrap Rev'}
              </span>
            </div>
          </>
        )}

        {/* Contador de elementos */}
        <div className="w-px h-3 bg-purple-400 mx-2" />
        <div className="flex items-center">
          <FiMaximize2 className="w-3 h-3 text-gray-200" />
          <span className="text-gray-200 text-xs ml-1">
            {children.length}
          </span>
        </div>

        {/* Indicador de gap si no es el default */}
        {gap !== '16px' && (
          <>
            <div className="w-px h-3 bg-purple-400 mx-1" />
            <span className="text-gray-300 text-xs">
              {gap}
            </span>
          </>
        )}
      </div>
    </div>
  );
}

export default ContainerVisualIndicators;