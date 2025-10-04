import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CanvasElement, DragData } from '@/types';

// Importar renderizadores específicos
import ButtonRenderer from './ButtonRenderer';
import TextRenderer from './TextRenderer';
import InputRenderer from './InputRenderer';
import ImageRenderer from './ImageRenderer';
import ContainerRenderer from './ContainerRenderer';
import HeadingRenderer from './HeadingRenderer';
import ParagraphRenderer from './ParagraphRenderer';
import LinkRenderer from './LinkRenderer';

interface ElementRendererProps {
  element: CanvasElement;
  isSelected: boolean;
  onSelect: (id: string) => void;
  isDragging?: boolean;
}

const ElementRenderer: React.FC<ElementRendererProps> = ({
  element,
  isSelected,
  onSelect,
  isDragging = false,
}) => {
  // Configurar draggable para elementos existentes
  const dragData: DragData = {
    elementType: element.type,
    elementId: element.id,
  };

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging: isDraggedElement,
  } = useDraggable({
    id: element.id,
    data: dragData,
  });

  // Aplicar estilos de posición y transformación
  const style: React.CSSProperties = {
    position: 'absolute',
    left: element.position.x,
    top: element.position.y,
    width: element.size.width,
    height: element.size.height,
    transform: transform 
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)` 
      : undefined,
    opacity: isDraggedElement ? 0.5 : element.isVisible ? 1 : 0.5,
    pointerEvents: element.isLocked ? 'none' : 'auto',
    zIndex: isSelected ? 1000 : element.order,
    ...element.styles,
  };

  // Renderizar el contenido específico del elemento
  const renderElementContent = () => {
    const commonProps = {
      element,
      style: element.styles,
    };

    switch (element.type) {
      case 'button':
        return <ButtonRenderer {...commonProps} />;
      case 'text':
        return <TextRenderer {...commonProps} />;
      case 'input':
        return <InputRenderer {...commonProps} />;
      case 'image':
        return <ImageRenderer {...commonProps} />;
      case 'container':
        return <ContainerRenderer {...commonProps} />;
      case 'heading':
        return <HeadingRenderer {...commonProps} />;
      case 'paragraph':
        return <ParagraphRenderer {...commonProps} />;
      case 'link':
        return <LinkRenderer {...commonProps} />;
      default:
        return (
          <div className="bg-gray-200 border border-gray-400 p-2 text-xs text-gray-600">
            Unknown Element: {element.type}
          </div>
        );
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        element-wrapper 
        ${isSelected ? 'ring-2 ring-blue-500' : 'hover:ring-1 hover:ring-gray-300'}
        ${isDraggedElement ? 'cursor-grabbing' : 'cursor-grab'}
        transition-all duration-150
      `}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(element.id);
      }}
      {...attributes}
      {...listeners}
    >
      {/* Contenido del elemento */}
      {renderElementContent()}
      
      {/* Indicador de selección */}
      {isSelected && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Esquinas de redimensionamiento */}
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 border border-white cursor-nw-resize"></div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border border-white cursor-ne-resize"></div>
          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 border border-white cursor-sw-resize"></div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 border border-white cursor-se-resize"></div>
          
          {/* Bordes de redimensionamiento */}
          <div className="absolute -top-1 left-2 right-2 h-3 cursor-n-resize"></div>
          <div className="absolute -bottom-1 left-2 right-2 h-3 cursor-s-resize"></div>
          <div className="absolute -left-1 top-2 bottom-2 w-3 cursor-w-resize"></div>
          <div className="absolute -right-1 top-2 bottom-2 w-3 cursor-e-resize"></div>
        </div>
      )}
      
      {/* Indicadores de estado */}
      {element.isLocked && (
        <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded-bl">
          🔒
        </div>
      )}
      
      {!element.isVisible && (
        <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <span className="text-white text-xs">Hidden</span>
        </div>
      )}
    </div>
  );
};

export default ElementRenderer;