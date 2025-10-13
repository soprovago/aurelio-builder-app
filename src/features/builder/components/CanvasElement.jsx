import React, { useState } from 'react';
import { ELEMENT_TYPES } from '../../../constants/elementTypes';
import CanvasElementRenderer from './CanvasElementRenderer';
import ElementMenu, { DragHandle, DragIndicators } from './ElementMenu';
import useDragDropManager from '../hooks/useDragDropManager';
import { FiArrowUp, FiArrowDown, FiMove } from 'react-icons/fi';

/**
 * CanvasElement - Componente principal para elementos en el canvas
 * 
 * Versión refactorizada que integra todos los componentes especializados:
 * - CanvasElementRenderer: Renderizado específico por tipo
 * - ElementMenu: Menú contextual
 * - useDragDropManager: Lógica de drag & drop
 * - DragHandle/DragIndicators: Componentes de UI
 */
function CanvasElement({ 
  element, 
  index, 
  isSelected, 
  onSelect, 
  onDelete, 
  onDuplicate, 
  onAddToContainer, 
  onMoveToContainer, 
  selectedElement, 
  viewportMode, 
  onUpdateElement, 
  onAddElementAtIndex, 
  onReorder, 
  onAddElement, 
  allElements,
  onReorderInContainer, 
  onMoveOutOfContainer 
}) {
  const [showAddButton, setShowAddButton] = useState(false);

  // Hook personalizado para drag & drop
  const { 
    draggableProps, 
    containerDropProps, 
    dragIndicators 
  } = useDragDropManager({
    element,
    index,
    onAddElementAtIndex,
    onReorder,
    onAddToContainer,
    onMoveToContainer
  });

  const { isDragging, isDragOver, dragOverPosition } = dragIndicators;

  // Handler para seleccionar elemento
  const handleElementClick = (e) => {
    if (!isDragging && onSelect) {
      onSelect(element);
    }
  };

  // Determinar si mostrar controles de hover
  const showControls = !isDragging;
  
  // Lógica para controles de reordenamiento
  const totalElements = allElements?.length || 0;
  const isFirst = index === 0;
  const isLast = index === totalElements - 1;
  
  // Handlers para reordenamiento en canvas
  const handleMoveUp = () => {
    if (!isFirst && onReorder) {
      onReorder(index, index - 1);
    }
  };
  
  const handleMoveDown = () => {
    if (!isLast && onReorder) {
      onReorder(index, index + 1);
    }
  };

  return (
    <div className="relative">
      {/* Indicadores de drop position */}
      <DragIndicators dragOverPosition={dragOverPosition} />
      
      {/* Elemento principal con drag & drop */}
      <div
        {...draggableProps}
        onMouseEnter={() => setShowAddButton(true)}
        onMouseLeave={() => setShowAddButton(false)}
        className={`relative group ${
          isSelected ? 'ring-2 ring-[#8b5cf6]' : ''
        } ${
          isDragging ? 'opacity-50 scale-95' : ''
        } ${
          dragOverPosition ? 'ring-2 ring-[#8b5cf6] ring-opacity-50' : 'hover:ring-2 hover:ring-[#8b5cf6] hover:ring-opacity-30'
        } transition-all cursor-grab active:cursor-grabbing`}
        onClick={(e) => {
          // Permitir clic para seleccionar solo si no estamos arrastrando
          if (!isDragging) {
            onSelect(element);
          }
        }}
      >
        <div className="relative pointer-events-none">
          {/* Renderizado específico del elemento */}
          <CanvasElementRenderer
            element={element}
            allElements={allElements}
            selectedElement={selectedElement}
            isDragOver={false}
            onAddToContainer={onAddToContainer}
            onMoveToContainer={onMoveToContainer}
            onSelect={onSelect}
            onDelete={onDelete}
            onDuplicate={onDuplicate}
            viewportMode={viewportMode}
            onUpdateElement={onUpdateElement}
            onAddElementAtIndex={onAddElementAtIndex}
            onReorder={onReorder}
            onAddElement={onAddElement}
          />
          
          {/* Handle de arrastre */}
          <DragHandle 
            className={showControls ? "opacity-0 group-hover:opacity-100 pointer-events-auto" : "opacity-0"} 
          />
          
          {/* Controles de reordenamiento para canvas */}
          <div className={`absolute top-2 left-12 transition-opacity pointer-events-auto ${
            showControls ? "opacity-0 group-hover:opacity-100" : "opacity-0"
          }`}>
            <div className="flex items-center bg-black/90 backdrop-blur-sm rounded-lg border border-gray-600/50 shadow-lg overflow-hidden">
              {/* Mover arriba */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleMoveUp();
                }}
                disabled={isFirst}
                className={`p-1.5 transition-all text-xs ${
                  isFirst 
                    ? 'text-gray-500 cursor-not-allowed' 
                    : 'text-blue-400 hover:text-blue-300 hover:bg-blue-500/20'
                }`}
                title="Mover arriba"
              >
                <FiArrowUp className="w-3 h-3" />
              </button>

              {/* Mover abajo */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleMoveDown();
                }}
                disabled={isLast}
                className={`p-1.5 transition-all text-xs ${
                  isLast 
                    ? 'text-gray-500 cursor-not-allowed' 
                    : 'text-blue-400 hover:text-blue-300 hover:bg-blue-500/20'
                }`}
                title="Mover abajo"
              >
                <FiArrowDown className="w-3 h-3" />
              </button>

              {/* Indicador de posición */}
              <div className="px-2 py-1 text-gray-400 text-xs font-mono bg-gray-800/50">
                {index + 1}/{totalElements}
              </div>
            </div>
          </div>
          
          {/* Menú contextual */}
          <ElementMenu
            element={element}
            onDuplicate={onDuplicate}
            onDelete={onDelete}
            isVisible={showControls}
            className={showControls ? "opacity-0 group-hover:opacity-100 pointer-events-auto" : "opacity-0"}
          />
          
          {/* Overlay para indicar que es arrastrable */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-5 bg-[#8b5cf6] transition-opacity pointer-events-none" />
        </div>
      </div>
    </div>
  );
}

export default CanvasElement;