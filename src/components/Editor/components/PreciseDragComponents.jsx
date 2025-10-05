import React from 'react';
import { FiMove, FiGrid, FiPlus } from 'react-icons/fi';
import { usePreciseDragDrop } from '../hooks/usePreciseDragDrop';

/**
 * Elemento del panel lateral arrastrables (basado en WeMax)
 */
export function PrecisePanelElement({ element, onClick }) {
  const { 
    isDragging,
    handlePanelDragStart,
    handlePanelDragEnd
  } = usePreciseDragDrop();

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      onClick && onClick(e);
    }
  };

  return (
    <div
      draggable
      onDragStart={(e) => handlePanelDragStart(e, element)}
      onDragEnd={handlePanelDragEnd}
      onClick={handleClick}
      className={`flex flex-col items-center justify-center p-4 bg-[#2a2a2a] rounded-lg text-white hover:bg-[#3a3a3a] transition-colors min-h-[80px] group cursor-grab active:cursor-grabbing select-none ${
        isDragging ? 'opacity-50 scale-95' : ''
      }`}
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        WebkitTouchCallout: 'none'
      }}
    >
      <div 
        className="mb-2 group-hover:scale-110 transition-transform pointer-events-none" 
        style={{ userSelect: 'none' }}
      >
        {element.icon}
      </div>
      <span 
        className="text-xs text-center font-medium pointer-events-none" 
        style={{ userSelect: 'none' }}
      >
        {element.name}
      </span>
    </div>
  );
}

/**
 * Elemento del canvas con drag preciso (basado en WeMax)
 */
export function PreciseCanvasElement({ 
  element, 
  index, 
  isSelected, 
  onSelect, 
  onDelete, 
  onDuplicate,
  onAddToContainer,
  onMoveToContainer,
  onUpdateElement,
  parentId = null,
  children,
  renderElement
}) {
  const { 
    isDragging,
    handleCanvasDragStart,
    handleCanvasDragEnd,
    handleElementReorder
  } = usePreciseDragDrop();

  // Los contenedores no deben ser draggable en el wrapper principal
  const isDraggableWrapper = element.type !== 'container';
  
  // Handler separado para arrastrar contenedores
  const handleContainerDragStart = (e) => {
    console.log('🎯 Container drag started:', element.id);
    e.stopPropagation();
    handleCanvasDragStart(e, element, index, parentId);
  };
  
  const handleContainerDragEnd = (e) => {
    e.stopPropagation();
    handleCanvasDragEnd(e);
  };

  const handleDrop = (e) => {
    handleElementReorder(e, element, index, (action, data) => {
      if (action === 'reorder') {
        // Manejar reordenamiento
        console.log('Reordering elements:', data);
        // onReorder && onReorder(data.fromIndex, data.toIndex);
      }
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  return (
    <div
      draggable={isDraggableWrapper}
      onDragStart={isDraggableWrapper ? (e) => handleCanvasDragStart(e, element, index, parentId) : undefined}
      onDragEnd={isDraggableWrapper ? handleCanvasDragEnd : undefined}
      onDragOver={isDraggableWrapper ? handleDragOver : undefined}
      onDrop={isDraggableWrapper ? handleDrop : undefined}
      className={`relative group ${isSelected ? 'ring-2 ring-[#8b5cf6]' : ''} ${
        isDragging ? 'opacity-70' : ''
      } hover:ring-2 hover:ring-[#8b5cf6] transition-all`}
      onClick={() => onSelect && onSelect(element)}
    >
      <div className="relative">
        {/* Renderizar el elemento */}
        {renderElement ? renderElement() : children}
        
        {/* Overlay de herramientas que aparece al hacer hover */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-2 left-2 pointer-events-auto">
            {/* Handle de mover para todos los elementos, incluyendo contenedores */}
            {element.type === 'container' ? (
              <div
                draggable
                onDragStart={handleContainerDragStart}
                onDragEnd={handleContainerDragEnd}
                className="p-1 bg-[#8b5cf6] text-white rounded hover:bg-[#7c3aed] transition-all cursor-grab active:cursor-grabbing opacity-80 hover:opacity-100"
                title="Mover contenedor"
              >
                <FiMove className="w-2.5 h-2.5" />
              </div>
            ) : (
              <div
                className="p-1 bg-[#8b5cf6] text-white rounded hover:bg-[#7c3aed] transition-all cursor-grab active:cursor-grabbing opacity-80 hover:opacity-100"
                title="Mover"
              >
                <FiMove className="w-2.5 h-2.5" />
              </div>
            )}
          </div>
          
          {/* Controles adicionales pueden ir aquí */}
        </div>
      </div>
    </div>
  );
}

/**
 * Contenedor preciso con drop zone (basado en WeMax)
 */
export function PreciseContainer({ 
  element, 
  isSelected,
  onSelect,
  onAddToContainer, 
  onMoveToContainer,
  onUpdateElement,
  children,
  className = ""
}) {
  const { 
    isDragOver,
    handleContainerDragOver,
    handleContainerDragLeave,
    handleContainerDrop
  } = usePreciseDragDrop();

  const handleDrop = (e) => {
    handleContainerDrop(e, element.id, (action, data, containerId) => {
      if (action === 'add') {
        console.log('Adding element to container:', data.name, '->', containerId);
        onAddToContainer && onAddToContainer(containerId, data);
      } else if (action === 'move') {
        console.log('Moving element to container:', data.id, '->', containerId);
        onMoveToContainer && onMoveToContainer(data.id, containerId);
      }
    });
  };

  const hasChildren = element.props?.children && element.props.children.length > 0;
  const hasCustomColor = element.props?.backgroundColor && element.props.backgroundColor !== 'transparent';
  const shouldShowDefaultStyling = !hasCustomColor;

  return (
    <div
      onDragOver={handleContainerDragOver}
      onDragLeave={handleContainerDragLeave}
      onDrop={handleDrop}
      onClick={(e) => {
        e.stopPropagation();
        onSelect && onSelect(element);
      }}
      className={`relative transition-all duration-300 ease-in-out cursor-pointer ${
        isDragOver 
          ? 'shadow-lg transform scale-[1.02] z-50' 
          : 'hover:shadow-md z-auto'
      } ${className}`}
      style={{
        minHeight: element.props?.minHeight || (hasChildren ? '120px' : '200px'),
        padding: element.props?.padding || (hasChildren ? '16px' : '48px'),
        backgroundColor: isDragOver 
          ? '#dbeafe' 
          : (element.props?.backgroundColor || (shouldShowDefaultStyling ? '#f8fafc' : 'transparent')),
        border: isDragOver 
          ? '3px solid #3b82f6' 
          : (isSelected ? '2px solid #8b5cf6' : (shouldShowDefaultStyling ? '1px dotted #cbd5e1' : element.props?.border || 'none')),
        borderRadius: element.props?.borderRadius || '0px',
        display: 'flex',
        flexDirection: element.props?.flexDirection || 'column',
        alignItems: element.props?.alignItems || (hasChildren ? 'stretch' : 'center'),
        justifyContent: element.props?.justifyContent || (hasChildren ? 'flex-start' : 'center'),
        flexWrap: element.props?.flexWrap || 'nowrap',
        gap: element.props?.gap || '16px',
        position: 'relative',
        // Mejorar área de detección durante drag
        ...(isDragOver && {
          margin: '-4px',
          padding: `calc(${element.props?.padding || (hasChildren ? '16px' : '48px')} + 4px)`
        })
      }}
    >
      {/* Overlay de drop */}
      {isDragOver && (
        <div className="absolute inset-0 z-20 pointer-events-none">
          <div className="absolute inset-0 border-2 border-blue-400 border-dashed rounded-lg opacity-70"></div>
          <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-lg shadow-lg text-xs flex items-center gap-1">
            <FiPlus className="w-3 h-3" />
            Drop
          </div>
          <div className="absolute inset-0 bg-blue-200/10 rounded-lg"></div>
        </div>
      )}
      
      {/* Contenido del contenedor */}
      {hasChildren ? (
        <div 
          className="w-full" 
          style={{
            display: 'flex',
            flexDirection: element.props?.flexDirection || 'column',
            alignItems: element.props?.alignItems || 'stretch',
            justifyContent: element.props?.justifyContent || 'flex-start',
            flexWrap: element.props?.flexWrap || 'nowrap',
            gap: element.props?.gap || '16px'
          }}
        >
          {children}
        </div>
      ) : (
        <div className="text-center w-full h-full flex flex-col items-center justify-center relative z-10">
          {!isDragOver && (
            <>
              <div className="w-16 h-16 rounded-xl bg-gray-200 flex items-center justify-center mb-4">
                <FiGrid className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-600 mb-1">Contenedor Vacío</h3>
              <p className="text-xs text-gray-500">Arrastra cualquier elemento</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Canvas con drop zone preciso (basado en WeMax)
 */
export function PreciseCanvas({ 
  elements, 
  onAddElement, 
  onMoveToContainer,
  isDragOver: externalIsDragOver,
  children,
  className = ""
}) {
  const { 
    isDragOver,
    handleContainerDragOver,
    handleContainerDragLeave,
    handleCanvasDrop
  } = usePreciseDragDrop();

  const finalIsDragOver = externalIsDragOver || isDragOver;

  const handleDrop = (e) => {
    handleCanvasDrop(e, (action, data) => {
      if (action === 'add') {
        console.log('Adding element to canvas:', data.name);
        onAddElement && onAddElement(data);
      } else if (action === 'moveToCanvas') {
        console.log('Moving element to canvas:', data.id);
        onMoveToContainer && onMoveToContainer(data.id, null);
      }
    });
  };

  return (
    <div
      onDragOver={handleContainerDragOver}
      onDragLeave={handleContainerDragLeave}
      onDrop={handleDrop}
      className={`transition-colors ${
        finalIsDragOver ? 'bg-blue-50 ring-2 ring-blue-300' : 'bg-white'
      } ${className}`}
    >
      {elements.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[500px]">
          <div className={`text-center transition-all duration-300 ${
            finalIsDragOver 
              ? 'transform scale-105 text-blue-600' 
              : 'text-gray-500'
          }`}>
            <div className={`w-20 h-20 mx-auto rounded-full border-2 border-dashed flex items-center justify-center transition-all duration-300 mb-6 ${
              finalIsDragOver 
                ? 'border-blue-400 bg-blue-50 shadow-lg' 
                : 'border-gray-300 bg-gray-50'
            }`}>
              {finalIsDragOver ? (
                <FiPlus className="w-8 h-8 text-blue-500" />
              ) : (
                <FiGrid className="w-8 h-8 text-gray-400" />
              )}
            </div>
            
            <h2 className="text-2xl font-bold mb-3 text-gray-700">
              {finalIsDragOver ? '¡Perfecto! Suelta aquí' : 'Comienza tu diseño'}
            </h2>
            
            <p className="text-base mb-8 max-w-md mx-auto leading-relaxed">
              {finalIsDragOver 
                ? 'Tu elemento será agregado al lienzo' 
                : 'Arrastra elementos desde el panel lateral'}
            </p>
          </div>
        </div>
      ) : (
        children
      )}
    </div>
  );
}

export default {
  PrecisePanelElement,
  PreciseCanvasElement,
  PreciseContainer,
  PreciseCanvas
};