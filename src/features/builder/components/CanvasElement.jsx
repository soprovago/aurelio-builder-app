import React, { useState } from 'react';
import { ELEMENT_TYPES } from '../../../constants/elementTypes';
import CanvasElementRenderer from './CanvasElementRenderer';
import ElementMenu, { DragHandle, DragIndicators } from './ElementMenu';
import useDragDropManager from '../hooks/useDragDropManager';

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
  allElements 
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
        <div className={`relative ${
          element.type === ELEMENT_TYPES.CONTAINER ? 'pointer-events-auto' : 'pointer-events-none'
        }`}>
          {/* Renderizado específico del elemento */}
          <CanvasElementRenderer
            element={element}
            allElements={allElements}
            selectedElement={selectedElement}
            isDragOver={isDragOver}
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
            {...(element.type === ELEMENT_TYPES.CONTAINER ? containerDropProps : {})}
          />
          
          {/* Handle de arrastre */}
          <DragHandle 
            className={showControls ? "opacity-0 group-hover:opacity-100 pointer-events-auto" : "opacity-0"} 
          />
          
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