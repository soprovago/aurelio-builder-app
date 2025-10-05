import React, { useState, useRef } from 'react';
import { VIEWPORT_MODES, VIEWPORT_CONFIGS } from '../../../constants/viewportConfigs';
import { FiPlus } from 'react-icons/fi';
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
          <CanvasDropZone
            isActive={isDragOver}
            isEmpty={elements.length === 0}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={viewportMode === VIEWPORT_MODES.DESKTOP ? 'w-full' : 'rounded-lg shadow-lg border border-gray-200'}
            style={{
              width: viewportConfig.width,
              maxWidth: viewportConfig.maxWidth,
              minHeight: elements.length === 0 ? viewportConfig.minHeight : 'auto',
              padding: viewportConfig.padding,
              boxSizing: 'border-box',
            }}
          >
            {/* El CanvasDropZone ya maneja el estado vacío, solo agregamos contenido cuando hay elementos */}
            {elements.length > 0 && (
              <>
                {/* Elementos del canvas */}
                <div className="space-y-4 mb-8">
                  {elements.map((element, index) => (
                    <div key={element.id} className="relative">
                      {/* Indicador de inserción superior */}
                      <InsertionIndicator 
                        isActive={isDragging && index === 0}
                        orientation="horizontal"
                        className="mb-2"
                      />
                      
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
                      
                      {/* Indicador de inserción inferior */}
                      <InsertionIndicator 
                        isActive={isDragging && index === elements.length - 1}
                        orientation="horizontal"
                        className="mt-2"
                      />
                    </div>
                  ))}
                </div>
                
                {/* Sistema de plantillas siempre visible */}
                <div className="border-t border-gray-200 pt-6">
                  <CanvasTemplateSystem
                    onAddContainerStructure={handleAddContainerStructure}
                    onLoadTemplate={handleLoadTemplate}
                    onUploadTemplate={handleUploadTemplate}
                    onToggleEasyLayout={onToggleEasyLayout}
                  />
                </div>
              </>
            )}
          </CanvasDropZone>
        </div>
      </div>
    </div>
  );
}

export default Canvas;