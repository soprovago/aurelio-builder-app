import React from 'react';
import { DROP_POSITIONS } from '../hooks/useDragDrop';

/**
 * Componente para mostrar indicadores visuales de drop zones
 */
export default function DragDropIndicators({ 
  isDropTarget, 
  dropPosition, 
  containerType = 'canvas',
  children 
}) {
  return (
    <div className="relative">
      {/* Indicador de drop antes del elemento */}
      {isDropTarget && dropPosition === DROP_POSITIONS.BEFORE && (
        <div className="absolute -top-1 left-0 right-0 z-50">
          <div className="h-0.5 bg-[#8b5cf6] rounded-full shadow-lg shadow-[#8b5cf6]/50">
            <div className="absolute -left-1 -top-1 w-3 h-3 bg-[#8b5cf6] rounded-full shadow-lg shadow-[#8b5cf6]/50" />
            <div className="absolute -right-1 -top-1 w-3 h-3 bg-[#8b5cf6] rounded-full shadow-lg shadow-[#8b5cf6]/50" />
          </div>
        </div>
      )}

      {/* Indicador de drop después del elemento */}
      {isDropTarget && dropPosition === DROP_POSITIONS.AFTER && (
        <div className="absolute -bottom-1 left-0 right-0 z-50">
          <div className="h-0.5 bg-[#8b5cf6] rounded-full shadow-lg shadow-[#8b5cf6]/50">
            <div className="absolute -left-1 -top-1 w-3 h-3 bg-[#8b5cf6] rounded-full shadow-lg shadow-[#8b5cf6]/50" />
            <div className="absolute -right-1 -top-1 w-3 h-3 bg-[#8b5cf6] rounded-full shadow-lg shadow-[#8b5cf6]/50" />
          </div>
        </div>
      )}

      {/* Contenedor con indicador de drop interno */}
      <div className={`
        transition-all duration-200
        ${isDropTarget && dropPosition === DROP_POSITIONS.INSIDE 
          ? 'ring-2 ring-[#8b5cf6] ring-offset-2 ring-offset-white bg-[#8b5cf6]/5' 
          : ''
        }
        ${isDropTarget && containerType === 'container' 
          ? 'border-dashed border-2 border-[#8b5cf6]' 
          : ''
        }
      `}>
        {children}
        
        {/* Overlay para indicar drop interno */}
        {isDropTarget && dropPosition === DROP_POSITIONS.INSIDE && (
          <div className="absolute inset-0 bg-[#8b5cf6]/10 rounded pointer-events-none flex items-center justify-center z-40">
            <div className="bg-[#8b5cf6] text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg">
              Soltar aquí
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Componente específico para elementos del canvas que pueden ser arrastrados
 */
export function DraggableCanvasElement({ 
  element, 
  isSelected, 
  onSelect, 
  onDragStart, 
  dropZoneProps,
  isDropTarget,
  dropPosition,
  children 
}) {
  return (
    <DragDropIndicators 
      isDropTarget={isDropTarget} 
      dropPosition={dropPosition}
      containerType="canvas"
    >
      <div
        draggable
        onDragStart={(e) => onDragStart(e, element)}
        onClick={() => onSelect(element)}
        className={`
          relative group cursor-move transition-all duration-200
          ${isSelected ? 'ring-2 ring-[#8b5cf6]' : 'hover:ring-2 hover:ring-[#8b5cf6]/50'}
          ${isDropTarget ? 'z-10' : ''}
        `}
        {...dropZoneProps}
      >
        {/* Handle de arrastre visual */}
        <div className="absolute -top-2 -left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <div className="bg-[#8b5cf6] text-white p-1 rounded text-xs font-medium shadow-lg">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6L6 10l4 4 4-4-4-4z" />
            </svg>
          </div>
        </div>
        
        {/* Contenido del elemento */}
        {children}
        
        {/* Indicador de que el elemento está siendo arrastrado */}
        <div className="absolute inset-0 bg-[#8b5cf6]/20 rounded opacity-0 group-active:opacity-100 transition-opacity duration-150 pointer-events-none" />
      </div>
    </DragDropIndicators>
  );
}

/**
 * Componente para contenedores que pueden recibir elementos
 */
export function DroppableContainer({ 
  container, 
  isEmpty,
  dropZoneProps,
  isDropTarget,
  dropPosition,
  children 
}) {
  return (
    <DragDropIndicators 
      isDropTarget={isDropTarget} 
      dropPosition={dropPosition}
      containerType="container"
    >
      <div
        className={`
          transition-all duration-200 min-h-[100px]
          ${isEmpty ? 'border-2 border-dashed border-gray-300' : ''}
          ${isDropTarget ? 'border-[#8b5cf6] bg-[#8b5cf6]/5' : ''}
        `}
        {...dropZoneProps}
      >
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-24 text-gray-400">
            <svg className="w-8 h-8 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-sm">Contenedor vacío</p>
            <p className="text-xs">Arrastra elementos aquí</p>
          </div>
        ) : (
          children
        )}
      </div>
    </DragDropIndicators>
  );
}

/**
 * Componente para mostrar ghost/placeholder durante drag
 */
export function DragGhost({ dragState }) {
  if (!dragState.isDragging || !dragState.draggedElement) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <div className="absolute top-4 left-4 bg-[#1a1a1a] text-white px-3 py-2 rounded-lg shadow-lg border border-[#2a2a2a]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#8b5cf6] rounded-full animate-pulse" />
          <span className="text-sm">
            {dragState.dragType === 'new-element' 
              ? `Agregando ${dragState.draggedElement.name}` 
              : `Moviendo ${dragState.draggedElement.type}`
            }
          </span>
        </div>
      </div>
    </div>
  );
}