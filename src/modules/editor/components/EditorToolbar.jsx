import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEditorStore, useProjectsStore } from '@/store';
import CollisionDebugger from '../../../components/Editor/components/CollisionDebugger';

interface EditorToolbarProps {
  projectId?: string;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({ projectId }) => {
  const navigate = useNavigate();
  const [isDebugVisible, setIsDebugVisible] = useState(false);
  
  // State del editor
  const {
    elementIds,
    selectedElementId,
    canvas,
    ui,
    updateCanvas,
    updateUI,
    selectElement,
  } = useEditorStore();
  
  // State de proyectos
  const { projects } = useProjectsStore();
  
  const currentProject = projectId ? projects[projectId] : null;

  const handleSave = async () => {
    // Aquí implementarías la lógica para guardar el proyecto
    console.log('Saving project...');
    // Simular guardado
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert('Proyecto guardado exitosamente!');
  };

  const handleUndo = () => {
    // Implementar undo
    console.log('Undo action');
  };

  const handleRedo = () => {
    // Implementar redo
    console.log('Redo action');
  };

  const handlePreview = () => {
    // Implementar preview
    console.log('Preview mode');
  };

  const zoomLevels = [25, 50, 75, 100, 125, 150, 200];

  return (
    <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      {/* Lado izquierdo - Navegación y título */}
      <div className="flex items-center space-x-4">
        {/* Botón volver */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
        >
          <span>←</span>
          <span>Dashboard</span>
        </button>
        
        {/* Título del proyecto */}
        <div className="flex items-center space-x-2">
          <h1 className="text-lg font-semibold text-gray-900">
            {currentProject ? currentProject.name : 'Nuevo Proyecto'}
          </h1>
          {currentProject && (
            <span className="text-sm text-gray-500">
              (ID: {projectId})
            </span>
          )}
        </div>
      </div>

      {/* Centro - Controles principales */}
      <div className="flex items-center space-x-1">
        {/* Undo/Redo */}
        <div className="flex items-center border-r border-gray-200 pr-3 mr-3">
          <button
            onClick={handleUndo}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            title="Deshacer"
            disabled // Temporalmente deshabilitado
          >
            ↶
          </button>
          <button
            onClick={handleRedo}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            title="Rehacer"
            disabled // Temporalmente deshabilitado
          >
            ↷
          </button>
        </div>

        {/* Zoom */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              const newZoom = Math.max(0.25, canvas.zoom - 0.25);
              updateCanvas({ zoom: newZoom });
            }}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            title="Zoom Out"
            disabled={canvas.zoom <= 0.25}
          >
            −
          </button>
          
          <select
            value={Math.round(canvas.zoom * 100)}
            onChange={(e) => {
              const zoomPercent = parseInt(e.target.value);
              updateCanvas({ zoom: zoomPercent / 100 });
            }}
            className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {zoomLevels.map(level => (
              <option key={level} value={level}>
                {level}%
              </option>
            ))}
          </select>
          
          <button
            onClick={() => {
              const newZoom = Math.min(2, canvas.zoom + 0.25);
              updateCanvas({ zoom: newZoom });
            }}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            title="Zoom In"
            disabled={canvas.zoom >= 2}
          >
            +
          </button>
          
          <button
            onClick={() => updateCanvas({ zoom: 1 })}
            className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            title="Zoom 100%"
          >
            Fit
          </button>
        </div>
      </div>

      {/* Lado derecho - Acciones y configuración */}
      <div className="flex items-center space-x-2">
        {/* Información rápida */}
        <div className="text-sm text-gray-500 px-3 border-l border-gray-200">
          {elementIds.length} elementos
        </div>

        {/* Controles UI */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => updateUI({ showGrid: !ui.showGrid })}
            className={`p-2 text-sm rounded-md transition-colors ${
              ui.showGrid
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Mostrar/Ocultar Grid"
          >
            Grid
          </button>
          
          <button
            onClick={() => updateUI({ showRulers: !ui.showRulers })}
            className={`p-2 text-sm rounded-md transition-colors ${
              ui.showRulers
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Mostrar/Ocultar Reglas"
          >
            Rules
          </button>
          
          <button
            onClick={() => updateUI({ snapToGrid: !ui.snapToGrid })}
            className={`p-2 text-sm rounded-md transition-colors ${
              ui.snapToGrid
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Ajustar a Grid"
          >
            Snap
          </button>
          
          <button
            onClick={() => setIsDebugVisible(!isDebugVisible)}
            className={`p-2 text-sm rounded-md transition-colors ${
              isDebugVisible
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Debug de Colisiones"
          >
            ⚙️
          </button>
        </div>

        {/* Acciones principales */}
        <div className="flex items-center space-x-2 border-l border-gray-200 pl-3">
          <button
            onClick={handlePreview}
            className="px-3 py-1.5 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Preview
          </button>
          
          <button
            onClick={handleSave}
            className="px-4 py-1.5 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors"
          >
            Guardar
          </button>
        </div>

        {/* Menu usuario */}
        <div className="border-l border-gray-200 pl-3">
          <button
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            title="Opciones"
          >
            ⚙️
          </button>
        </div>
      </div>
      
      {/* Componente de Debug de Colisiones */}
      <CollisionDebugger
        isVisible={isDebugVisible}
        // TODO: Pasar las props necesarias cuando se integre con el sistema de drag & drop
        collisionDetection={null}
        isDragging={false}
        activeRect={null}
        activeElement={null}
      />
    </div>
  );
};

export default EditorToolbar;