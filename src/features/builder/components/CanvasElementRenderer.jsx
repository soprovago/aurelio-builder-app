import React from 'react';
import { FiGrid, FiInbox, FiTarget } from 'react-icons/fi';
import { ELEMENT_TYPES } from '../../../constants/elementTypes';

/**
 * CanvasElementRenderer - Componente especializado para renderizar elementos específicos
 * 
 * Separa la lógica de renderizado del CanvasElement principal,
 * haciendo el código más modular y mantenible.
 */
function CanvasElementRenderer({ 
  element, 
  allElements, 
  selectedElement,
  isDragOver,
  onAddToContainer,
  onMoveToContainer,
  onSelect,
  onDelete,
  onDuplicate,
  viewportMode,
  onUpdateElement,
  onAddElementAtIndex,
  onReorder,
  onAddElement
}) {
  
  console.log('🟡 CanvasElementRenderer rendered for:', {
    elementId: element.id,
    elementType: element.type,
    hasOnSelect: !!onSelect,
    selectedElementId: selectedElement?.id
  });
  
  // Función para renderizar elementos básicos (no contenedores)
  const renderBasicElement = (elementData) => {
    const { type, props } = elementData;
    
    switch (type) {
      case ELEMENT_TYPES.HEADING:
        return (
          <div
            style={{
              color: props.color,
              fontSize: props.fontSize,
              textAlign: props.alignment,
            }}
          >
            <h1>{props.text}</h1>
          </div>
        );
        
      case ELEMENT_TYPES.TEXT:
        return (
          <div
            style={{
              color: props.color,
              fontSize: props.fontSize,
              textAlign: props.alignment,
            }}
          >
            {props.text}
          </div>
        );
        
      case ELEMENT_TYPES.IMAGE:
        return (
          <img
            src={props.src}
            alt={props.alt}
            style={{
              width: props.width,
              height: props.height,
              objectFit: 'cover',
            }}
          />
        );
        
      case ELEMENT_TYPES.BUTTON:
        return (
          <button
            style={{
              backgroundColor: props.backgroundColor,
              color: props.textColor,
              padding: props.padding,
              borderRadius: props.borderRadius,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {props.text}
          </button>
        );
        
      default:
        return <div className="p-4 bg-gray-700 rounded">Elemento: {type}</div>;
    }
  };
  
  // Función para renderizar contenedores con lógica especializada
  const renderContainer = () => {
    const { props } = element;
    const hasChildren = props.children && props.children.length > 0;
    
    // Handlers específicos del contenedor
    const handleContainerDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = 'copy';
      return false;
    };

    const handleContainerDragLeave = (e) => {
      if (!e.currentTarget.contains(e.relatedTarget)) {
        // El estado se maneja en el componente padre
      }
    };

    const handleContainerDrop = (e) => {
      console.log('Container drop received on', element.id);
      e.preventDefault();
      e.stopPropagation();
      
      try {
        const data = JSON.parse(e.dataTransfer.getData('text/plain'));
        
        if (data.type === 'panel-element') {
          console.log('Adding element to container:', data.element.name);
          if (onAddToContainer) {
            onAddToContainer(element.id, data.element);
          }
        } else if (data.type === 'canvas-element') {
          console.log('Moving element to container:', data.id);
          if (onMoveToContainer) {
            onMoveToContainer(data.id, element.id);
          }
        }
      } catch (error) {
        console.error('Container drop error:', error);
      }
    };

    return (
      <div
        onDragOver={handleContainerDragOver}
        onDragLeave={handleContainerDragLeave}
        onDrop={handleContainerDrop}
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
          e.dataTransfer.dropEffect = 'copy';
          return false;
        }}
        className={`relative transition-all duration-300 ease-in-out ${
          isDragOver 
            ? 'shadow-lg transform scale-[1.02]' 
            : 'hover:shadow-md'
        }`}
        style={{
          minHeight: props.minHeight || (hasChildren ? '120px' : '200px'),
          padding: props.padding || (hasChildren ? '16px' : '48px'),
          backgroundColor: props.backgroundColor || (isDragOver ? '#dbeafe' : '#f8fafc'),
          border: props.border === 'none' ? 'none' : (props.border || (isDragOver ? '3px solid #3b82f6' : '2px dashed #cbd5e1')),
          borderRadius: props.borderRadius || '12px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: hasChildren ? 'stretch' : 'center',
          justifyContent: hasChildren ? 'flex-start' : 'center',
          cursor: isDragOver ? 'copy' : 'default',
          position: 'relative'
        }}
      >
        {/* Overlay de drop activo */}
        {isDragOver && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-200/30 to-blue-300/30 border-2 border-blue-400 border-dashed rounded-xl flex items-center justify-center z-20 backdrop-blur-sm">
            <div className="bg-blue-500 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-blue-300">
              <div className="w-8 h-8 bg-blue-400 rounded-lg flex items-center justify-center">
                <FiTarget className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm">Soltar elemento aquí</span>
                <span className="text-blue-200 text-xs">Contenedor</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Contenido del contenedor */}
        {hasChildren ? (
          <div className="w-full">
            <div className="space-y-2">
              {/* Renderizar elementos hijos IGUAL que Canvas - usando CanvasElement */}
              {props.children.map((child, childIndex) => {
                // Importación dinámica para evitar circular import
                const CanvasElement = require('./CanvasElement').default;
                
                return (
                  <CanvasElement
                    key={child.id}
                    element={child}
                    index={childIndex}
                    isSelected={selectedElement?.id === child.id}
                    onSelect={onSelect}
                    onDelete={onDelete}
                    onDuplicate={onDuplicate}
                    onAddToContainer={onAddToContainer}
                    onMoveToContainer={onMoveToContainer}
                    selectedElement={selectedElement}
                    viewportMode={viewportMode}
                    onUpdateElement={onUpdateElement}
                    onAddElementAtIndex={onAddElementAtIndex}
                    onReorder={onReorder}
                    onAddElement={onAddElement}
                    allElements={allElements}
                  />
                );
              })}
            </div>
          </div>
        ) : (
          // Estado vacío
          <div className="text-center w-full h-full flex flex-col items-center justify-center relative z-10">
            {!isDragOver && (
              <>
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-dashed border-gray-300 flex items-center justify-center mb-6 transition-all duration-300 hover:from-blue-50 hover:to-blue-100 hover:border-blue-300">
                  <FiInbox className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 mb-4 max-w-xs mx-auto leading-relaxed">
                  Arrastra elementos aquí para comenzar
                </p>
              </>
            )}
          </div>
        )}
      </div>
    );
  };
  
  // DEBUG: Usar componente simple para probar selección
  const TestElement = require('./TestElement').default;
  
  if (element.type === ELEMENT_TYPES.CONTAINER) {
    const hasChildren = element.props.children && element.props.children.length > 0;
    
    return (
      <TestElement 
        element={element} 
        isSelected={selectedElement?.id === element.id}
        onSelect={onSelect}
      >
        {hasChildren && (
          <div className="space-y-2">
            {element.props.children.map((child) => (
              <TestElement
                key={child.id}
                element={child}
                isSelected={selectedElement?.id === child.id}
                onSelect={onSelect}
              />
            ))}
          </div>
        )}
      </TestElement>
    );
  } else {
    return (
      <TestElement 
        element={element} 
        isSelected={selectedElement?.id === element.id}
        onSelect={onSelect}
      />
    );
  }
}

export default CanvasElementRenderer;