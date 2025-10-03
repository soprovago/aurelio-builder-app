import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEditor } from '../../hooks/useEditor';
import { ELEMENT_TYPES } from '../../constants/elementTypes';
import { VIEWPORT_MODES, VIEWPORT_CONFIGS } from '../../constants/viewportConfigs';
import { getResponsiveProperty } from '../../utils/responsiveUtils';
import AurelioLogo from '../shared/AurelioLogo';
import CanvasTemplateSystem from './components/CanvasTemplateSystem';
import { useDragDrop, useDropZone } from './hooks/useDragDrop';
import { DraggableCanvasElement, DroppableContainer, DragGhost } from './components/DragDropIndicators';
import './slider-styles.css';

// Importar iconos necesarios
import {
  FiArrowLeft,
  FiSave,
  FiEye,
  FiGlobe,
  FiType,
  FiImage,
  FiSquare,
  FiGrid,
  FiMonitor,
  FiTablet,
  FiSmartphone,
  FiEdit3,
  FiTrash2,
  FiCopy,
  FiMoreVertical,
  FiDroplet,
  FiSliders,
  FiPlus
} from 'react-icons/fi';

// Elementos disponibles en la sidebar
const availableElements = [
  {
    id: 'container',
    type: ELEMENT_TYPES.CONTAINER,
    name: 'Contenedor',
    icon: <FiGrid className="w-5 h-5" />,
    defaultProps: {
      layout: 'vertical',
      gap: '16px',
      padding: '20px',
      backgroundColor: 'transparent',
      borderRadius: '0px',
      border: 'none',
      minHeight: '100px',
      alignment: 'left',
      children: [],
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      flexWrap: 'nowrap',
      width: '100%',
      height: '200px',
      widthType: 'full'
    }
  },
  {
    id: 'heading',
    type: ELEMENT_TYPES.HEADING,
    name: 'Encabezado',
    icon: <FiType className="w-5 h-5" />,
    defaultProps: {
      text: 'Tu Encabezado Aquí',
      level: 1,
      alignment: 'left',
      color: '#000000',
      fontSize: '32px',
    }
  },
  {
    id: 'text',
    type: ELEMENT_TYPES.TEXT,
    name: 'Texto',
    icon: <FiType className="w-5 h-5" />,
    defaultProps: {
      text: 'Tu texto aquí. Puedes editarlo haciendo clic.',
      alignment: 'left',
      color: '#333333',
      fontSize: '16px',
    }
  },
  {
    id: 'image',
    type: ELEMENT_TYPES.IMAGE,
    name: 'Imagen',
    icon: <FiImage className="w-5 h-5" />,
    defaultProps: {
      src: '/api/placeholder/400/300',
      alt: 'Imagen',
      width: '100%',
      height: 'auto',
    }
  },
  {
    id: 'button',
    type: ELEMENT_TYPES.BUTTON,
    name: 'Botón',
    icon: <FiSquare className="w-5 h-5" />,
    defaultProps: {
      text: 'Haz Clic Aquí',
      link: '#',
      backgroundColor: '#8b5cf6',
      textColor: '#ffffff',
      padding: '12px 24px',
      borderRadius: '8px',
    }
  }
];

// Componente para elementos del panel
function PanelElement({ element, onClick, onDragStart }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      onClick(e);
    }
  };

  const handleDragStart = (e) => {
    setIsDragging(true);
    onDragStart(e, element);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      draggable
      onClick={handleClick}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`flex flex-col items-center justify-center p-4 bg-[#2a2a2a] rounded-lg text-white hover:bg-[#3a3a3a] transition-colors min-h-[80px] group cursor-grab active:cursor-grabbing select-none ${
        isDragging ? 'opacity-50 scale-95' : ''
      }`}
    >
      <div className="mb-2 group-hover:scale-110 transition-transform pointer-events-none">
        {element.icon}
      </div>
      <span className="text-xs text-center font-medium pointer-events-none">
        {element.name}
      </span>
      
      {/* Indicador visual de drag */}
      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-2 h-2 bg-[#8b5cf6] rounded-full" />
      </div>
    </div>
  );
}

// Panel de elementos disponibles
function ElementsPanel({ onAddElement, onElementDragStart }) {
  const handleElementClick = (element, e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddElement(element);
  };

  return (
    <div className="w-64 bg-[#1a1a1a] border-r border-[#2a2a2a] p-4">
      <h3 className="text-white font-semibold mb-4">Elementos</h3>
      <div className="text-xs text-gray-400 mb-3">
        Haz clic o arrastra para agregar
      </div>
      <div className="grid grid-cols-2 gap-3">
        {availableElements.map((element) => (
          <div key={element.id} className="relative">
            <PanelElement 
              element={element} 
              onClick={(e) => handleElementClick(element, e)}
              onDragStart={onElementDragStart}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// Componente Canvas con drag & drop
function Canvas({ elements, selectedElement, onSelectElement, viewportMode, onAddElement, onLoadTemplate, dragDropContext }) {
  const viewportConfig = VIEWPORT_CONFIGS[viewportMode];
  
  // Drop zone para canvas principal
  const canvasDropZone = useDropZone(
    { type: 'canvas', index: elements.length },
    dragDropContext
  );
  
  // Funciones para el sistema de plantillas
  const handleAddContainerStructure = (structure) => {
    console.log('📦 Adding container structure:', structure);
    
    const elementTemplate = {
      id: structure.id || `element-${Date.now()}`,
      type: ELEMENT_TYPES.CONTAINER,
      name: 'Container Structure',
      defaultProps: structure.props
    };
    
    onAddElement(elementTemplate);
  };
  
  const handleLoadTemplate = (template) => {
    console.log('📚 Loading template:', template.name);
    if (template.elements && template.elements.length > 0) {
      template.elements.forEach((element, index) => {
        setTimeout(() => {
          onAddElement({ ...element, id: `template-element-${Date.now()}-${index}` });
        }, index * 100);
      });
    }
    onLoadTemplate && onLoadTemplate(template);
  };
  
  const handleUploadTemplate = (template) => {
    console.log('📁 Uploading template:', template);
    if (template.elements && template.elements.length > 0) {
      template.elements.forEach((element, index) => {
        setTimeout(() => {
          onAddElement({ ...element, id: `uploaded-element-${Date.now()}-${index}` });
        }, index * 100);
      });
    }
  };

  // Componente interno para manejar contenedores con drag & drop
  function ContainerElement({ element, selectedElement, onSelectElement, dragDropContext }) {
    const containerDropZone = useDropZone(
      { type: 'container', containerId: element.id },
      dragDropContext
    );
    
    const isEmpty = !element.props.children || element.props.children.length === 0;
    
    return (
      <DroppableContainer
        container={element}
        isEmpty={isEmpty}
        dropZoneProps={containerDropZone.dropZoneProps}
        isDropTarget={containerDropZone.isDropTarget}
        dropPosition={containerDropZone.dropPosition}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: element.props.flexDirection || 'column',
            gap: element.props.gap || '16px',
            padding: element.props.padding || '20px',
            backgroundColor: element.props.backgroundColor === 'transparent' ? 'transparent' : (element.props.backgroundColor || 'transparent'),
            borderRadius: element.props.borderRadius || '0px',
            border: element.props.border || 'none',
            minHeight: element.props.minHeight || '100px',
            alignItems: element.props.alignItems || 'stretch',
            justifyContent: element.props.justifyContent || 'flex-start',
            flexWrap: element.props.flexWrap || 'nowrap'
          }}
          className="transition-all"
        >
          {element.props.children && element.props.children.length > 0 ? (
            element.props.children.map((child) => (
              <CanvasElement
                key={child.id}
                element={child}
                selectedElement={selectedElement}
                onSelectElement={onSelectElement}
                dragDropContext={dragDropContext}
              />
            ))
          ) : null}
        </div>
      </DroppableContainer>
    );
  }
  
  // Componente interno para elementos individuales con drop zones
  function CanvasElement({ element, selectedElement, onSelectElement, dragDropContext, index = 0 }) {
    const elementDropZone = useDropZone(
      { type: 'canvas', index },
      dragDropContext
    );
    
    return (
      <DraggableCanvasElement
        element={element}
        isSelected={selectedElement?.id === element.id}
        onSelect={onSelectElement}
        onDragStart={dragDropContext.handleExistingElementDragStart}
        dropZoneProps={elementDropZone.dropZoneProps}
        isDropTarget={elementDropZone.isDropTarget}
        dropPosition={elementDropZone.dropPosition}
      >
        {renderElement(element)}
      </DraggableCanvasElement>
    );
  }
  
  const renderElement = (element) => {
    switch (element.type) {
      case ELEMENT_TYPES.CONTAINER:
        return (
          <ContainerElement
            element={element}
            selectedElement={selectedElement}
            onSelectElement={onSelectElement}
            dragDropContext={dragDropContext}
          />
        );
      case ELEMENT_TYPES.HEADING:
        return (
          <div
            style={{
              color: element.props.color,
              fontSize: element.props.fontSize,
              textAlign: element.props.alignment,
            }}
          >
            <h1>{element.props.text}</h1>
          </div>
        );
      case ELEMENT_TYPES.TEXT:
        return (
          <div
            style={{
              color: element.props.color,
              fontSize: element.props.fontSize,
              textAlign: element.props.alignment,
            }}
          >
            {element.props.text}
          </div>
        );
      case ELEMENT_TYPES.IMAGE:
        return (
          <img
            src={element.props.src}
            alt={element.props.alt}
            style={{
              width: element.props.width,
              height: element.props.height,
              objectFit: 'cover',
            }}
          />
        );
      case ELEMENT_TYPES.BUTTON:
        return (
          <button
            style={{
              backgroundColor: element.props.backgroundColor,
              color: element.props.textColor,
              padding: element.props.padding,
              borderRadius: element.props.borderRadius,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {element.props.text}
          </button>
        );
      default:
        return <div className="p-4 bg-gray-700 rounded">Elemento: {element.type}</div>;
    }
  };

  return (
    <>
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
                viewportMode === VIEWPORT_MODES.DESKTOP ? 'w-full' : 'rounded-lg shadow-lg border border-gray-200'
              }`}
              {...canvasDropZone.dropZoneProps}
            >
              {elements.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[500px]">
                  <div className="text-center text-gray-500 mb-8">
                    <FiGrid className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h2 className="text-2xl font-bold mb-3 text-gray-700">
                      Comienza tu diseño
                    </h2>
                    <p className="text-base mb-8 max-w-md mx-auto leading-relaxed">
                      Arrastra elementos aquí o elige una plantilla
                    </p>
                  </div>
                  
                  {/* Sistema de plantillas */}
                  <CanvasTemplateSystem
                    onAddContainerStructure={handleAddContainerStructure}
                    onLoadTemplate={handleLoadTemplate}
                    onUploadTemplate={handleUploadTemplate}
                  />
                  
                  {/* Indicador de drop zone cuando canvas está vacío */}
                  {canvasDropZone.isDropTarget && (
                    <div className="absolute inset-0 bg-[#8b5cf6]/10 border-2 border-dashed border-[#8b5cf6] rounded-lg flex items-center justify-center">
                      <div className="bg-[#8b5cf6] text-white px-4 py-2 rounded-lg font-medium">
                        Soltar elemento aquí
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  {elements.map((element, index) => (
                    <CanvasElement
                      key={element.id}
                      element={element}
                      selectedElement={selectedElement}
                      onSelectElement={onSelectElement}
                      dragDropContext={dragDropContext}
                      index={index}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Ghost de arrastre */}
      <DragGhost dragState={dragDropContext.dragState} />
    </>
  );
}

// Panel de propiedades básico
function PropertiesPanel({ selectedElement, onUpdateElement }) {
  if (!selectedElement) {
    return (
      <div className="w-80 bg-[#1a1a1a] border-l border-[#2a2a2a] p-6">
        <p className="text-gray-400 text-sm">Selecciona un elemento para editar sus propiedades</p>
      </div>
    );
  }

  const handlePropertyChange = (property, value) => {
    const updatedElement = {
      ...selectedElement,
      props: {
        ...selectedElement.props,
        [property]: value,
      },
    };
    onUpdateElement(updatedElement);
  };

  return (
    <div className="w-80 bg-[#1a1a1a] border-l border-[#2a2a2a] p-6 overflow-y-auto">
      <h3 className="text-white font-semibold mb-4">Propiedades</h3>
      
      {(selectedElement.type === ELEMENT_TYPES.HEADING || selectedElement.type === ELEMENT_TYPES.TEXT) && (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Texto</label>
            <textarea
              value={selectedElement.props.text}
              onChange={(e) => handlePropertyChange('text', e.target.value)}
              className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-3 py-2 text-white resize-none"
              rows={3}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={selectedElement.props.color}
                onChange={(e) => handlePropertyChange('color', e.target.value)}
                className="w-12 h-10 bg-[#2a2a2a] border border-[#3a3a3a] rounded cursor-pointer"
              />
              <input
                type="text"
                value={selectedElement.props.color}
                onChange={(e) => handlePropertyChange('color', e.target.value)}
                className="flex-1 px-3 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded text-white text-sm font-mono"
                placeholder="#000000"
              />
            </div>
          </div>
        </>
      )}

      {selectedElement.type === ELEMENT_TYPES.BUTTON && (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Texto</label>
            <input
              type="text"
              value={selectedElement.props.text}
              onChange={(e) => handlePropertyChange('text', e.target.value)}
              className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-3 py-2 text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Color de fondo</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={selectedElement.props.backgroundColor}
                onChange={(e) => handlePropertyChange('backgroundColor', e.target.value)}
                className="w-12 h-10 bg-[#2a2a2a] border border-[#3a3a3a] rounded cursor-pointer"
              />
              <input
                type="text"
                value={selectedElement.props.backgroundColor}
                onChange={(e) => handlePropertyChange('backgroundColor', e.target.value)}
                className="flex-1 px-3 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded text-white text-sm font-mono"
                placeholder="#8b5cf6"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Selector de viewport
function ViewportSelector({ currentMode, onModeChange }) {
  return (
    <div className="flex items-center gap-1 bg-[#2a2a2a] rounded-lg p-1">
      {Object.entries(VIEWPORT_CONFIGS).map(([mode, config]) => {
        const IconComponent = config.icon;
        return (
          <button
            key={mode}
            onClick={() => onModeChange(mode)}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              currentMode === mode
                ? 'bg-[#ff1b6d] text-white'
                : 'text-gray-300 hover:bg-[#3a3a3a] hover:text-white'
            }`}
            title={`Vista ${config.name}`}
          >
            <IconComponent className="w-4 h-4" />
          </button>
        );
      })}
    </div>
  );
}

// Componente Editor principal
function Editor({ onExit }) {
  const navigate = useNavigate();
  const [viewportMode, setViewportMode] = useState(VIEWPORT_MODES.DESKTOP);
  const [projectName, setProjectName] = useState('Mi Proyecto');
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  // Usar el hook useEditor
  const {
    elements,
    selectedElement,
    addElement,
    selectElement,
    updateElement,
    addElementToContainer,
    reorderElementByIndex,
    moveToContainer,
  } = useEditor();

  // Sistema drag & drop
  const dragDropContext = useDragDrop(
    addElementToContainer, // Para elementos nuevos
    moveToContainer,       // Para mover elementos existentes  
    reorderElementByIndex  // Para reordenar elementos
  );

  const handleAddElement = useCallback((elementTemplate) => {
    addElement(elementTemplate);
  }, [addElement]);

  const handleElementDragStart = useCallback((event, element) => {
    dragDropContext.handleNewElementDragStart(event, element);
  }, [dragDropContext]);

  const handleSave = () => {
    console.log('Guardando página...', elements);
    alert('Página guardada correctamente');
  };

  const handlePublish = () => {
    console.log('Publicando página...', elements);
    alert('Página publicada correctamente');
  };

  const openPreviewWindow = () => {
    console.log('Abriendo vista previa...', elements);
    alert('Vista previa (funcionalidad pendiente)');
  };

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
              onClick={openPreviewWindow}
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
        <ElementsPanel 
          onAddElement={handleAddElement} 
          onElementDragStart={handleElementDragStart}
        />

        {/* Canvas central */}
        <div className="flex-1">
          <Canvas 
            elements={elements}
            selectedElement={selectedElement}
            onSelectElement={selectElement}
            viewportMode={viewportMode}
            onAddElement={handleAddElement}
            onLoadTemplate={(template) => console.log('Template loaded:', template.name)}
            dragDropContext={dragDropContext}
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