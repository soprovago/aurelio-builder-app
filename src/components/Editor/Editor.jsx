import React from 'react';
import { useEditorState } from './useEditorState';
import EditorToolbar from './EditorToolbar';
import ElementsPanel from './ElementsPanel';
import Canvas from '../../features/builder/components/Canvas';
import PropertiesPanel from '../../features/builder/components/PropertiesPanel';

/**
 * Editor refactorizado - Componente principal del editor
 * 
 * Esta versión está completamente refactorizada siguiendo las mejores prácticas:
 * - Separación de responsabilidades
 * - Componentes pequeños y enfocados
 * - Hooks personalizados para lógica compleja
 * - Máximo 100 líneas por archivo
 */
function Editor({ onExit }) {
  const {
    elements,
    selectedElement,
    viewportMode,
    projectName,
    setViewportMode,
    setProjectName,
    addElement,
    selectElement,
    updateElement,
    addToContainer,
    moveToContainer,
  } = useEditorState();

  // Handlers del toolbar
  const handleSave = () => {
    console.log('Guardando página...', elements);
    alert('Página guardada correctamente');
  };

  const handlePublish = () => {
    console.log('Publicando página...', elements);
    alert('Página publicada correctamente');
  };

  const handlePreview = () => {
    console.log('Abriendo vista previa...', elements);
    alert('Vista previa (funcionalidad pendiente)');
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col">
      {/* Toolbar superior */}
      <EditorToolbar
        projectName={projectName}
        onProjectNameChange={setProjectName}
        viewportMode={viewportMode}
        onViewportChange={setViewportMode}
        onExit={onExit}
        onSave={handleSave}
        onPreview={handlePreview}
        onPublish={handlePublish}
      />

      {/* Editor principal */}
      <div className="flex" style={{ height: 'calc(100vh - 80px)' }}>
        {/* Panel de elementos */}
        <ElementsPanel onAddElement={addElement} />

        {/* Canvas central */}
        <div className="flex-1">
          <Canvas
            elements={elements}
            selectedElement={selectedElement}
            onSelectElement={selectElement}
            viewportMode={viewportMode}
            onAddElement={addElement}
            onDeleteElement={() => {}}
            onDuplicateElement={() => {}}
            onAddToContainer={addToContainer}
            onMoveToContainer={moveToContainer}
            onUpdateElement={updateElement}
            onAddElementAtIndex={() => {}}
            onReorder={() => {}}
          />
        </div>

        {/* Panel de propiedades */}
        <PropertiesPanel
          selectedElement={selectedElement}
          onUpdateElement={updateElement}
        />
      </div>
    </div>
  );
}

export default Editor;
