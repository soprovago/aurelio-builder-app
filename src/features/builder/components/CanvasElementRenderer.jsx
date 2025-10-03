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
        onClick={(e) => {
          // Solo seleccionar el contenedor si no se clickea un hijo
          const isChildClick = e.target !== e.currentTarget;
          if (!isChildClick && onSelect) {
            e.stopPropagation();
            onSelect(element);
          }
        }}
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
              {/* Renderizar elementos hijos usando componentes temporales hasta resolver circular import */}
              {props.children.map((child, childIndex) => (
                <div
                  key={child.id}
                  className={`relative group transition-all cursor-pointer ${
                    selectedElement?.id === child.id 
                      ? 'ring-2 ring-[#8b5cf6]' 
                      : 'hover:ring-2 hover:ring-[#8b5cf6] hover:ring-opacity-30'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSelect) {
                      onSelect(child);
                    }
                  }}
                >
                  {/* Renderizar el elemento hijo */}
                  <div className="relative">
                    {child.type === ELEMENT_TYPES.CONTAINER ? (
                      <CanvasElementRenderer
                        element={child}
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
                    ) : (
                      <CanvasElementRenderer
                        element={child}
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
                    )}
                    
                    {/* Menú contextual para elementos hijos */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onDuplicate) onDuplicate(child.id);
                        }}
                        className="p-1 bg-gray-800 bg-opacity-80 text-white rounded hover:bg-gray-700 shadow-lg transition-colors mr-1"
                        title="Duplicar"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onDelete) onDelete(child.id);
                        }}
                        className="p-1 bg-gray-800 bg-opacity-80 text-red-400 rounded hover:bg-gray-700 shadow-lg transition-colors"
                        title="Eliminar"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
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
  
  // Renderizado principal basado en el tipo de elemento
  if (element.type === ELEMENT_TYPES.CONTAINER) {
    return renderContainer();
  } else {
    return renderBasicElement(element);
  }
}

export default CanvasElementRenderer;