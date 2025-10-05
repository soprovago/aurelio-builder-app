import React, { useState } from 'react';
import {
  FiArrowLeft,
  FiSave,
  FiEye,
  FiGlobe,
  FiEdit3,
  FiSettings
} from 'react-icons/fi';
import AurelioLogo from '../shared/AurelioLogo';
import ViewportSelector from './ViewportSelector';

/**
 * Toolbar superior del editor con controles principales
 */
function EditorToolbar({ 
  projectName, 
  onProjectNameChange, 
  viewportMode, 
  onViewportChange, 
  onExit, 
  onSave, 
  onPreview, 
  onPublish,
  onToggleDebug,
  isDebugActive,
  isDragging 
}) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const handleSave = () => {
    console.log('Guardando página...');
    onSave();
  };

  const handlePublish = () => {
    console.log('Publicando página...');
    onPublish();
  };

  const handlePreview = () => {
    console.log('Abriendo vista previa...');
    onPreview();
  };

  return (
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
                onChange={(e) => onProjectNameChange(e.target.value)}
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
            onModeChange={onViewportChange} 
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
            onClick={onToggleDebug}
            className={`flex items-center justify-center w-8 h-8 transition-colors ${
              isDragging 
                ? (isDebugActive ? 'text-purple-300 hover:text-purple-200' : 'text-purple-400 hover:text-purple-300')
                : 'text-gray-500 hover:text-gray-400'
            }`}
            title={isDragging 
              ? (isDebugActive ? "Cerrar debug de colisiones" : "Debug de colisiones")
              : "Debug de colisiones (arrastra un elemento)"
            }
          >
            <FiSettings className="w-4 h-4" />
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
  );
}

export default EditorToolbar;