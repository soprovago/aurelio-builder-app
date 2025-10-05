import React, { useState, useEffect } from 'react';
import { FiGrid, FiEyeOff, FiEye } from 'react-icons/fi';

/**
 * Sistema de grillas visuales para facilitar el maquetado
 * Muestra líneas guía durante el drag & drop
 */
function VisualGrid({ isDragging, showGrid, onToggleGrid, gridSize = 20, className = "" }) {
  const [gridLines, setGridLines] = useState({ vertical: [], horizontal: [] });

  useEffect(() => {
    if (!showGrid && !isDragging) return;

    const updateGrid = () => {
      const container = document.querySelector('.canvas-grid-container');
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const verticalLines = [];
      const horizontalLines = [];

      // Generar líneas verticales
      for (let x = 0; x <= rect.width; x += gridSize) {
        verticalLines.push(x);
      }

      // Generar líneas horizontales  
      for (let y = 0; y <= rect.height; y += gridSize) {
        horizontalLines.push(y);
      }

      setGridLines({ vertical: verticalLines, horizontal: horizontalLines });
    };

    updateGrid();
    window.addEventListener('resize', updateGrid);
    return () => window.removeEventListener('resize', updateGrid);
  }, [showGrid, isDragging, gridSize]);

  if (!showGrid && !isDragging) return null;

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {/* Líneas verticales */}
      {gridLines.vertical.map((x, index) => (
        <div
          key={`v-${index}`}
          className={`absolute top-0 bottom-0 w-px transition-opacity duration-200 ${
            isDragging 
              ? 'bg-blue-400/40 opacity-60' 
              : 'bg-gray-300/20 opacity-30'
          }`}
          style={{ left: x }}
        />
      ))}

      {/* Líneas horizontales */}
      {gridLines.horizontal.map((y, index) => (
        <div
          key={`h-${index}`}
          className={`absolute left-0 right-0 h-px transition-opacity duration-200 ${
            isDragging 
              ? 'bg-blue-400/40 opacity-60' 
              : 'bg-gray-300/20 opacity-30'
          }`}
          style={{ top: y }}
        />
      ))}

      {/* Puntos de intersección durante el drag */}
      {isDragging && (
        <>
          {gridLines.vertical.map((x) => 
            gridLines.horizontal.map((y, yIndex) => (
              <div
                key={`point-${x}-${y}`}
                className="absolute w-1 h-1 bg-blue-500/60 rounded-full transform -translate-x-0.5 -translate-y-0.5"
                style={{ left: x, top: y }}
              />
            ))
          )}
        </>
      )}
    </div>
  );
}

/**
 * Control de toggle para la grilla
 */
function GridToggle({ showGrid, onToggle, isDragging, className = "" }) {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
        showGrid || isDragging
          ? 'bg-blue-500 text-white shadow-lg'
          : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
      } ${className}`}
      title={showGrid ? 'Ocultar grilla' : 'Mostrar grilla'}
    >
      <FiGrid className="w-4 h-4" />
      <span className="text-sm font-medium">
        {showGrid ? 'Grilla' : 'Grilla'}
      </span>
      {showGrid ? (
        <FiEye className="w-3 h-3" />
      ) : (
        <FiEyeOff className="w-3 h-3" />
      )}
    </button>
  );
}

export { VisualGrid, GridToggle };
export default VisualGrid;