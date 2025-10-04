import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DndContext } from '@dnd-kit/core';
import { useEditorStore, useProjectsStore } from '@/store';

// Importar componentes del editor (los crearemos después)
import EditorCanvas from './components/EditorCanvas';
import ElementsPanel from './components/ElementsPanel';
import PropertiesPanel from './components/PropertiesPanel';
import EditorToolbar from './components/EditorToolbar';

// Hook personalizado para el drag and drop
import { useDragAndDrop } from './hooks/useDragAndDrop';

const EditorModule: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  
  // Estado del editor
  const {
    elements,
    elementIds,
    selectedElementId,
    canvas,
    ui,
    isLoading,
    error,
    selectElement,
  } = useEditorStore();
  
  // Estado de proyectos
  const { projects, selectProject } = useProjectsStore();
  
  // Hook para drag and drop
  const { handleDragStart, handleDragEnd, sensors } = useDragAndDrop();
  
  // Efecto para cargar el proyecto si se proporciona un ID
  useEffect(() => {
    if (projectId && projects[projectId]) {
      selectProject(projectId);
      // Aquí cargaríamos los datos del proyecto desde la API
      // Por ahora usaremos datos mock
    }
  }, [projectId, projects, selectProject]);
  
  // Manejar errores
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">
            Error en el Editor
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }
  
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando editor...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Toolbar Superior */}
      <EditorToolbar projectId={projectId} />
      
      {/* Contenedor Principal del Editor */}
      <div className="flex-1 flex overflow-hidden">
        {/* Panel Izquierdo - Elementos */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-900">Elementos</h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            <ElementsPanel />
          </div>
        </div>
        
        {/* Área Central - Canvas */}
        <div className="flex-1 flex flex-col">
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <EditorCanvas
              canvas={canvas}
              ui={ui}
              elements={elementIds.map(id => elements[id])}
              selectedElementId={selectedElementId}
              onSelectElement={selectElement}
            />
          </DndContext>
        </div>
        
        {/* Panel Derecho - Propiedades */}
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-900">
              {selectedElementId ? 'Propiedades' : 'Sin selección'}
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            <PropertiesPanel
              selectedElement={selectedElementId ? elements[selectedElementId] : null}
            />
          </div>
        </div>
      </div>
      
      {/* Status Bar */}
      <div className="h-8 bg-gray-800 text-white px-4 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-4">
          <span>Elementos: {elementIds.length}</span>
          <span>Zoom: {Math.round(canvas.zoom * 100)}%</span>
          <span>Canvas: {canvas.width}x{canvas.height}</span>
        </div>
        <div className="flex items-center space-x-2">
          {ui.showGrid && <span className="px-2 py-1 bg-gray-700 rounded">Grid</span>}
          {ui.snapToGrid && <span className="px-2 py-1 bg-gray-700 rounded">Snap</span>}
        </div>
      </div>
    </div>
  );
};

export default EditorModule;