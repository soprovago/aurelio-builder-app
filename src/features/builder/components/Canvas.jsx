import React, { useState } from 'react';
import { VIEWPORT_MODES, VIEWPORT_CONFIGS } from '../../../constants/viewportConfigs';
import { FiPlus, FiGrid } from 'react-icons/fi';
import CanvasTemplateSystem from '../../../components/Editor/components/CanvasTemplateSystem';

/**
 * Canvas principal del editor (versión simplificada)
 * Nota: Este componente se puede expandir gradualmente
 */
function Canvas({ 
  elements, 
  selectedElement, 
  onSelectElement, 
  viewportMode, 
  onAddElement, 
  onDeleteElement, 
  onDuplicateElement, 
  onAddToContainer, 
  onMoveToContainer, 
  onUpdateElement, 
  onAddElementAtIndex, 
  onReorder 
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const viewportConfig = VIEWPORT_CONFIGS[viewportMode];
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      
      if (data.type === 'panel-element') {
        onAddElement(data.element);
      }
    } catch (error) {
      console.error('Error parsing drag data:', error);
    }
  };

  return (
    <div className="w-full h-full bg-gray-100">
      <div className="w-full h-full overflow-auto">
        <div className="w-full flex justify-center p-4">
          <div
            style={{
              width: viewportConfig.width,
              maxWidth: viewportConfig.maxWidth,
              minHeight: elements.length === 0 ? viewportConfig.minHeight : 'auto',
              padding: viewportConfig.padding,
              boxSizing: 'border-box',
            }}
            className={`bg-white transition-colors ${
              isDragOver ? 'bg-blue-50 ring-2 ring-blue-300' : ''
            } ${viewportMode === VIEWPORT_MODES.DESKTOP ? 'w-full' : 'rounded-lg shadow-lg border border-gray-200'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {elements.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[500px]">
                <div className={`text-center transition-all duration-300 ${
                  isDragOver 
                    ? 'transform scale-105 text-blue-600' 
                    : 'text-gray-500'
                }`}>
                  <div className={`w-20 h-20 mx-auto rounded-full border-2 border-dashed flex items-center justify-center transition-all duration-300 mb-6 ${
                    isDragOver 
                      ? 'border-blue-400 bg-blue-50 shadow-lg' 
                      : 'border-gray-300 bg-gray-50'
                  }`}>
                    {isDragOver ? (
                      <FiPlus className="w-8 h-8 text-blue-500" />
                    ) : (
                      <FiGrid className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-3 text-gray-700">
                    {isDragOver ? '¡Perfecto! Suelta aquí' : 'Comienza tu diseño'}
                  </h2>
                  
                  <p className="text-base mb-8 max-w-md mx-auto leading-relaxed">
                    {isDragOver 
                      ? 'Tu elemento será agregado al lienzo' 
                      : 'Arrastra elementos desde el panel lateral o elige una plantilla'}
                  </p>
                </div>
                
                <CanvasTemplateSystem
                  onAddContainerStructure={(structure) => console.log('Add container structure:', structure)}
                  onLoadTemplate={(template) => console.log('Load template:', template)}
                  onUploadTemplate={(template) => console.log('Upload template:', template)}
                />
              </div>
            ) : (
              <>
                {/* Aquí irían los elementos del canvas */}
                <div className="space-y-2 mb-8">
                  {elements.map((element, index) => (
                    <div 
                      key={element.id} 
                      className="p-4 border border-gray-200 rounded"
                      onClick={() => onSelectElement(element)}
                    >
                      <strong>Elemento:</strong> {element.type} ({element.id})
                      {/* TODO: Aquí se renderizaría el CanvasElement refactorizado */}
                    </div>
                  ))}
                </div>
                
                {/* Sistema de plantillas siempre visible */}
                <div className="border-t border-gray-200 pt-6">
                  <CanvasTemplateSystem
                    onAddContainerStructure={(structure) => console.log('Add container structure:', structure)}
                    onLoadTemplate={(template) => console.log('Load template:', template)}
                    onUploadTemplate={(template) => console.log('Upload template:', template)}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Canvas;