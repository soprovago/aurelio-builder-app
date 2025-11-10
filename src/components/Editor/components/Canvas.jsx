import React, { useState, useRef } from 'react';
import { VIEWPORT_MODES, VIEWPORT_CONFIGS } from '../../../constants/viewportConfigs';
import { FiPlus, FiBox } from 'react-icons/fi';
import CanvasTemplateSystem from './CanvasTemplateSystem';
import { useAutoScroll } from '../hooks/useAutoScroll';
import { CanvasDropZone, InsertionIndicator } from './EnhancedDropZones';
// CanvasElement se importará desde el Editor principal

// Componente Canvas principal
function Canvas({ elements, selectedElement, onSelectElement, viewportMode, onAddElement, onDeleteElement, onDuplicateElement, onAddToContainer, onMoveToContainer, onUpdateElement, onAddElementAtIndex, onReorder, onReorderInContainer, onMoveOutOfContainer, CanvasElement, collisionDetection, setActiveDrag, onToggleEasyLayout }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const viewportConfig = VIEWPORT_CONFIGS[viewportMode];
  
  // Auto-scroll durante drag
  const canvasScrollContainerRef = useRef(null);
  const { handleDragMove, stopAutoScroll, isScrolling } = useAutoScroll(canvasScrollContainerRef);
  const [showAutoScrollIndicator, setShowAutoScrollIndicator] = useState(false);
  
  // Handlers de plantillas
  const handleAddContainerStructure = (structure) => {
    const elementTemplate = {
      id: structure.id || `element-${Date.now()}`,
      type: 'container',
      name: 'Container Structure',
      defaultProps: structure.props
    };
    onAddElement(elementTemplate);
  };
  
  const handleTemplateLoad = (template, prefix = 'template') => {
    if (template.elements?.length > 0) {
      template.elements.forEach((element, index) => {
        setTimeout(() => {
          onAddElement({ ...element, id: `${prefix}-element-${Date.now()}-${index}` });
        }, index * 100);
      });
    }
  };
  
  const handleLoadTemplate = (template) => handleTemplateLoad(template, 'template');
  const handleUploadTemplate = (template) => handleTemplateLoad(template, 'uploaded');

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    setIsDragging(false);
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      
      if (data.type === 'panel-element') {
        onAddElement(data.element);
      } else if (data.type === 'canvas-element') {
        // Mover elemento desde contenedor al canvas principal
        onMoveToContainer(data.id, null);
      }
    } catch (error) {
      console.error('Error parsing drag data:', error);
    }
  };


  return (
    <div className="w-full h-full bg-gray-100 relative">
      
      {/* Indicador de auto-scroll */}
      {showAutoScrollIndicator && (
        <div className="absolute top-4 right-4 z-50">
          <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg animate-pulse">
            Auto-scroll activo
          </div>
        </div>
      )}
      
      <div 
        ref={canvasScrollContainerRef}
        className="canvas-grid-container w-full h-full overflow-auto relative"
        onMouseMove={(e) => {
          handleDragMove(e);
          // Mostrar indicador cuando hay scroll activo
          const wasScrolling = isScrolling();
          if (wasScrolling !== showAutoScrollIndicator) {
            setShowAutoScrollIndicator(wasScrolling);
          }
        }}
        onMouseLeave={() => {
          stopAutoScroll();
          setShowAutoScrollIndicator(false);
          setIsDragging(false);
        }}
      >
        <div className="w-full flex justify-center p-4">
          <div
            className={`bg-white ${viewportMode === VIEWPORT_MODES.DESKTOP ? 'w-full' : 'rounded-lg shadow-lg border border-gray-200'}`}
            style={{
              width: viewportConfig.width,
              maxWidth: viewportConfig.maxWidth,
              minHeight: elements.length === 0 ? viewportConfig.minHeight : 'auto',
              padding: viewportConfig.padding,
              boxSizing: 'border-box',
            }}
          >
            {/* Zona de drop con estado vacío personalizada */}
            <div
              className={`relative transition-all duration-300 ${
                isDragOver && elements.length === 0
                  ? 'bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50'
                  : ''
              }`}
              onDrop={elements.length === 0 ? handleDrop : undefined}
              onDragOver={elements.length === 0 ? handleDragOver : undefined}
              onDragLeave={elements.length === 0 ? handleDragLeave : undefined}
            >
              {/* Estado vacío con mensaje de arrastar */}
              {elements.length === 0 && (
                <div className="relative flex items-center justify-center py-20">
                  <div className={`text-center transition-all duration-300 ${
                    isDragOver
                      ? 'transform scale-110 text-blue-600'
                      : 'text-gray-500'
                  }`}>
                    <div className={`w-24 h-24 mx-auto rounded-full border-4 border-dashed flex items-center justify-center mb-6 transition-all duration-300 ${
                      isDragOver
                        ? 'border-blue-400 bg-blue-50 shadow-xl shadow-blue-400/30'
                        : 'border-gray-300 bg-gray-50'
                    }`}>
                      {isDragOver ? (
                        <FiPlus className="w-10 h-10 text-blue-500 animate-bounce" />
                      ) : (
                        <FiBox className="w-10 h-10 text-gray-400" />
                      )}
                    </div>
                    
                    <h2 className="text-3xl font-bold mb-4">
                      {isDragOver ? '¡Perfecto! Suelta aquí' : 'Comienza tu diseño'}
                    </h2>
                    
                    <p className="text-lg max-w-md mx-auto leading-relaxed">
                      {isDragOver
                        ? 'Tu elemento será agregado al lienzo'
                        : 'Arrastra elementos desde el panel lateral para comenzar'}
                    </p>

                    {/* Animación de ondas durante el drag */}
                    {isDragOver && (
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute inset-8 border border-blue-300/30 rounded-full animate-ping" />
                        <div className="absolute inset-16 border border-purple-300/30 rounded-full animate-ping animation-delay-300" />
                        <div className="absolute inset-24 border border-pink-300/30 rounded-full animate-ping animation-delay-500" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Elementos del canvas cuando hay contenido */}
              {elements.length > 0 && (
                <div className="mb-8">
                  {elements.map((element, index) => (
                    <div key={element.id} className="relative">
                      {/* CanvasElement original - RESTAURADO y CORREGIDO */}
                      <CanvasElement
                        element={element}
                        index={index}
                        isSelected={selectedElement?.id === element.id}
                        onSelect={onSelectElement}
                        onDelete={onDeleteElement}
                        onDuplicate={onDuplicateElement}
                        onAddToContainer={onAddToContainer}
                        onMoveToContainer={onMoveToContainer}
                        selectedElement={selectedElement}
                        viewportMode={viewportMode}
                        onUpdateElement={onUpdateElement}
                        onAddElementAtIndex={onAddElementAtIndex}
                        onReorder={onReorder}
                        onAddElement={onAddElement}
                        allElements={elements}
                        onReorderInContainer={onReorderInContainer}
                        onMoveOutOfContainer={onMoveOutOfContainer}
                        collisionDetection={collisionDetection}
                        setActiveDrag={setActiveDrag}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Sistema de plantillas SIEMPRE visible */}
            <div className={`${elements.length > 0 ? 'border-t border-gray-200 pt-6' : 'mt-8'}`}>
              <CanvasTemplateSystem
                onAddContainerStructure={handleAddContainerStructure}
                onLoadTemplate={handleLoadTemplate}
                onUploadTemplate={handleUploadTemplate}
                onToggleEasyLayout={onToggleEasyLayout}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Canvas;