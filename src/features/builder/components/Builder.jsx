import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiEye, FiGlobe, FiEdit3 } from 'react-icons/fi';

// Componentes refactorizados
import ElementsPanel from './ElementsPanel';
import ViewportSelector from './ViewportSelector';
import PropertiesPanel from './PropertiesPanel';
import Canvas from './Canvas';

// Componente compartido
import AurelioLogo from '../../../components/shared/AurelioLogo';

// Hook personalizado
import useBuilderState from '../hooks/useBuilderState';

/**
 * Componente principal del Builder/Editor refactorizado
 * @param {Function} onExit - Función para salir del editor
 */
function Builder({ onExit }) {
  const navigate = useNavigate();
  
  // Usar el hook personalizado para el estado
  const {
    elements,
    selectedElement,
    viewportMode,
    projectName,
    isEditingTitle,
    setViewportMode,
    setProjectName,
    setIsEditingTitle,
    addToContainer,
    moveToContainer,
    addElementAtIndex,
    reorderElements,
    handleAddElement,
    handleDeleteElement,
    handleDuplicateElement,
    handleSelectElement,
    handleUpdateElement,
    handleSave,
    handlePublish,
    handlePreview
  } = useBuilderState();

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col">
      {/* Toolbar superior */}
      <div className="bg-[#1a1a1a] border-b border-[#2a2a2a] flex items-center relative">
        <div className="flex items-center w-full p-4 pr-36">
          {/* Sección izquierda */}
          <div className="flex items-center gap-4 flex-1">
            <div className="flex-shrink-0">
              <AurelioLogo variant="icon-only" className="w-8 h-8" />
            </div>

            <div className="text-white group">
              {isEditingTitle ? (
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  onBlur={() => setIsEditingTitle(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setIsEditingTitle(false);
                    }
                  }}
                  className="bg-transparent font-semibold border-none outline-none focus:ring-2 focus:ring-purple-500 px-2 py-1 rounded"
                  autoFocus
                  placeholder="Nombre del proyecto"
                />
              ) : (
                <div 
                  className="flex items-center gap-2 cursor-pointer hover:bg-white/10 px-2 py-1 rounded transition-colors"
                  onClick={() => setIsEditingTitle(true)}
                  title="Haz clic para editar el nombre"
                >
                  <h1 className="font-semibold">{projectName}</h1>
                  <FiEdit3 className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              )}
            </div>
          </div>
          
          {/* Sección central */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <ViewportSelector 
              currentMode={viewportMode} 
              onModeChange={setViewportMode} 
            />
          </div>
          
          {/* Sección derecha */}
          <div className="flex items-center gap-2">
            <button
              onClick={onExit}
              className="flex items-center justify-center w-8 h-8 text-gray-300 hover:text-white transition-colors"
              title="Volver al dashboard"
            >
              <FiArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleSave}
              className="flex items-center justify-center w-8 h-8 text-gray-300 hover:text-white transition-colors"
              title="Guardar"
            >
              <FiSave className="w-4 h-4" />
            </button>
            <button
              onClick={handlePreview}
              className="flex items-center justify-center w-8 h-8 text-gray-300 hover:text-white transition-colors"
              title="Vista Previa"
            >
              <FiEye className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Botón Publicar */}
        <button
          onClick={handlePublish}
          className="absolute right-0 top-0 bottom-0 flex items-center justify-center gap-2 bg-[#ff1b6d] text-white px-6 hover:bg-[#e0195f] transition-colors border-l border-[#2a2a2a]"
          title="Publicar página"
        >
          <FiGlobe className="w-4 h-4" />
          Publicar
        </button>
      </div>

      {/* Editor principal */}
      <div className="flex" style={{ height: 'calc(100vh - 80px)' }}>
        {/* Panel de elementos */}
        <ElementsPanel onAddElement={handleAddElement} />

        {/* Canvas central */}
        <div className="flex-1">
          <Canvas 
            elements={elements}
            selectedElement={selectedElement}
            onSelectElement={handleSelectElement}
            viewportMode={viewportMode}
            onAddElement={handleAddElement}
            onDeleteElement={handleDeleteElement}
            onDuplicateElement={handleDuplicateElement}
            onAddToContainer={addToContainer}
            onMoveToContainer={moveToContainer}
            onUpdateElement={handleUpdateElement}
            onAddElementAtIndex={addElementAtIndex}
            onReorder={reorderElements}
          />
        </div>

        {/* Panel de propiedades */}
        <PropertiesPanel
          selectedElement={selectedElement}
          onUpdateElement={handleUpdateElement}
        />
      </div>
    </div>
  );
}

export default Builder;