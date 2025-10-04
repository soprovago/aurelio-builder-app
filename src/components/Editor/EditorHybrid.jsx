import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DndContext, useDraggable, useDroppable, useSensor, useSensors, PointerSensor, TouchSensor } from '@dnd-kit/core';

// Importar componentes y utilidades del editor original
import { ELEMENT_TYPES } from '../../constants/elementTypes';
import { VIEWPORT_MODES, VIEWPORT_CONFIGS } from '../../constants/viewportConfigs';
import { getResponsiveProperty } from '../../shared/utils/responsiveUtils';
import AurelioLogo from '../shared/AurelioLogo';
import CanvasTemplateSystem from './components/CanvasTemplateSystem';
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
  FiMove,
  FiMoreVertical,
  FiDroplet,
  FiSliders,
  FiPlus,
  FiInbox,
  FiPackage,
  FiTarget
} from 'react-icons/fi';

// Elementos disponibles (con estilos del original)
const availableElements = [
  {
    id: 'container',
    type: ELEMENT_TYPES.CONTAINER,
    name: 'Contenedor',
    icon: <FiGrid className="w-5 h-5" />,
    defaultProps: {
      children: [],
      layout: 'vertical',
      gap: '16px',
      padding: '20px',
      backgroundColor: 'transparent',
      borderRadius: '0px',
      border: 'none',
      minHeight: '100px',
      alignment: 'left',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      flexWrap: 'nowrap',
      width: '100%',
      height: 'auto',
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

// Componente draggable mejorado con dnd-kit
function DraggableElement({ element, index }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: `element-${element.id}`,
    data: { elementType: element.type, element: element, isNew: true }
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex flex-col items-center justify-center p-4 bg-[#2a2a2a] rounded-lg text-white hover:bg-[#3a3a3a] transition-colors min-h-[80px] group cursor-grab active:cursor-grabbing select-none relative ${
        isDragging ? 'opacity-50 scale-95' : ''
      }`}
      {...attributes}
      {...listeners}
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

// Panel de elementos con estilos originales
function ElementsPanel({ onAddElement }) {
  return (
    <div className="w-64 bg-[#1a1a1a] border-r border-[#2a2a2a] p-4 flex flex-col">
      <h3 className="text-white font-semibold mb-4">Elementos</h3>
      <div className="text-xs text-gray-400 mb-3">
        Arrastra para agregar al canvas
      </div>
      
      <div className="grid grid-cols-2 gap-3 flex-1">
        {availableElements.map((element, index) => (
          <DraggableElement 
            key={element.id} 
            element={element} 
            index={index}
          />
        ))}
      </div>
      
      {/* Sistema de Plantillas */}
      <div className="mt-6 pt-4 border-t border-[#2a2a2a]">
        <h3 className="text-white font-semibold mb-3">Plantillas</h3>
        <CanvasTemplateSystem />
      </div>
    </div>
  );
}

// Canvas droppable con estilos profesionales
function EditorCanvas({ elements, selectedId, onSelectElement, onUpdateElement, onDeleteElement }) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'editor-canvas',
  });

  return (
    <div className="flex-1 bg-[#0f0f0f] overflow-auto">
      <div className="min-h-full p-8">
        <div
          ref={setNodeRef}
          className={`
            canvas-main min-h-[600px] bg-white rounded-lg shadow-xl relative transition-all duration-200
            ${isOver ? 'ring-4 ring-[#8b5cf6] ring-opacity-50 bg-opacity-95' : ''}
          `}
        >
          {/* Indicador de drop - estilo original */}
          {isOver && (
            <div className="absolute inset-0 bg-[#8b5cf6] bg-opacity-10 border-2 border-dashed border-[#8b5cf6] rounded-lg pointer-events-none">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-[#8b5cf6] text-white px-4 py-2 rounded-lg shadow-lg font-medium text-sm">
                  <FiPlus className="inline w-4 h-4 mr-2" />
                  Suelta aquí
                </div>
              </div>
            </div>
          )}

          {/* Elementos del canvas */}
          {elements.map((element) => (
            <CanvasElement
              key={element.id}
              element={element}
              isSelected={selectedId === element.id}
              onSelect={() => onSelectElement(element.id)}
              onUpdate={(updates) => onUpdateElement(element.id, updates)}
              onDelete={() => onDeleteElement(element.id)}
            />
          ))}

          {/* Estado vacío */}
          {elements.length === 0 && !isOver && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <FiTarget className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">Canvas vacío</p>
                <p className="text-sm">Arrastra elementos desde el panel izquierdo</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Componente individual para elementos en el canvas
function CanvasElement({ element, isSelected, onSelect, onUpdate, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: `canvas-element-${element.id}`,
    data: { elementType: element.type, elementId: element.id, isNew: false }
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  const renderElement = () => {
    const baseClasses = "w-full h-full";
    
    switch (element.type) {
      case ELEMENT_TYPES.HEADING:
        return (
          <h1 
            className={`${baseClasses} font-bold`}
            style={{ 
              fontSize: element.fontSize || '32px',
              color: element.color || '#000000',
              textAlign: element.alignment || 'left'
            }}
          >
            {element.text || 'Encabezado'}
          </h1>
        );
      
      case ELEMENT_TYPES.TEXT:
        return (
          <p 
            className={baseClasses}
            style={{ 
              fontSize: element.fontSize || '16px',
              color: element.color || '#333333',
              textAlign: element.alignment || 'left'
            }}
          >
            {element.text || 'Texto'}
          </p>
        );
      
      case ELEMENT_TYPES.BUTTON:
        return (
          <button 
            className={`${baseClasses} font-medium transition-all hover:opacity-90`}
            style={{ 
              backgroundColor: element.backgroundColor || '#8b5cf6',
              color: element.textColor || '#ffffff',
              padding: element.padding || '12px 24px',
              borderRadius: element.borderRadius || '8px',
              border: 'none',
              cursor: 'pointer'
            }}
            onClick={(e) => e.preventDefault()}
          >
            {element.text || 'Botón'}
          </button>
        );
      
      case ELEMENT_TYPES.IMAGE:
        return (
          <img 
            className={`${baseClasses} object-cover`}
            src={element.src || 'https://picsum.photos/400/300'}
            alt={element.alt || 'Imagen'}
            style={{
              width: element.width || '100%',
              height: element.height || 'auto'
            }}
          />
        );
      
      case ELEMENT_TYPES.CONTAINER:
        return (
          <div 
            className={`${baseClasses} border-2 border-dashed border-gray-300`}
            style={{
              backgroundColor: element.backgroundColor || 'transparent',
              borderRadius: element.borderRadius || '0px',
              padding: element.padding || '20px',
              minHeight: element.minHeight || '100px',
              display: 'flex',
              flexDirection: element.flexDirection || 'column',
              justifyContent: element.justifyContent || 'flex-start',
              alignItems: element.alignItems || 'stretch',
              gap: element.gap || '16px'
            }}
          >
            <div className="text-gray-500 text-center text-sm">
              Contenedor - Arrastra elementos aquí
            </div>
          </div>
        );
      
      default:
        return <div className={baseClasses}>Elemento desconocido</div>;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        position: 'absolute',
        left: element.x || 50,
        top: element.y || 50,
        width: element.width || 200,
        height: element.height || 'auto',
        zIndex: isSelected ? 1000 : 1,
        ...style
      }}
      className={`
        cursor-grab active:cursor-grabbing
        ${isSelected ? 'ring-2 ring-[#8b5cf6] ring-opacity-75' : 'hover:ring-2 hover:ring-gray-300'}
        transition-all duration-150
      `}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      {...attributes}
      {...listeners}
    >
      {renderElement()}
      
      {/* Controles de elemento seleccionado */}
      {isSelected && (
        <>
          {/* Handles de redimensionamiento */}
          <div className="absolute -top-2 -left-2 w-4 h-4 bg-[#8b5cf6] border-2 border-white rounded-full cursor-nw-resize"></div>
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#8b5cf6] border-2 border-white rounded-full cursor-ne-resize"></div>
          <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-[#8b5cf6] border-2 border-white rounded-full cursor-sw-resize"></div>
          <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-[#8b5cf6] border-2 border-white rounded-full cursor-se-resize"></div>
          
          {/* Toolbar de elemento */}
          <div className="absolute -top-10 left-0 bg-[#1a1a1a] rounded-lg shadow-lg flex items-center space-x-1 px-2 py-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1 text-red-400 hover:text-red-300 transition-colors"
              title="Eliminar"
            >
              <FiTrash2 className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                // onDuplicate();
              }}
              className="p-1 text-gray-400 hover:text-gray-300 transition-colors"
              title="Duplicar"
            >
              <FiCopy className="w-3 h-3" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// Panel de propiedades con estilos originales
function PropertiesPanel({ selectedElement, onUpdate, onDelete }) {
  if (!selectedElement) {
    return (
      <div className="w-80 bg-[#1a1a1a] border-l border-[#2a2a2a] p-4">
        <div className="text-center py-8">
          <FiTarget className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <h3 className="text-white font-medium mb-2">Sin elemento seleccionado</h3>
          <p className="text-gray-400 text-sm">
            Selecciona un elemento del canvas para editar sus propiedades
          </p>
        </div>
      </div>
    );
  }

  const handleChange = (property, value) => {
    onUpdate({ [property]: value });
  };

  return (
    <div className="w-80 bg-[#1a1a1a] border-l border-[#2a2a2a] p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-white font-semibold capitalize">
            {selectedElement.name || selectedElement.type}
          </h3>
          <p className="text-gray-400 text-sm">ID: {selectedElement.id}</p>
        </div>
        <button
          onClick={onDelete}
          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
          title="Eliminar elemento"
        >
          <FiTrash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Propiedades específicas por tipo */}
      <div className="space-y-6">
        {/* Propiedades de texto */}
        {(selectedElement.type === ELEMENT_TYPES.HEADING || selectedElement.type === ELEMENT_TYPES.TEXT || selectedElement.type === ELEMENT_TYPES.BUTTON) && (
          <div>
            <label className="block text-white text-sm font-medium mb-2">Texto</label>
            <input
              type="text"
              value={selectedElement.text || ''}
              onChange={(e) => handleChange('text', e.target.value)}
              className="w-full px-3 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#8b5cf6]"
              placeholder="Ingresa el texto..."
            />
          </div>
        )}

        {/* Color de texto */}
        {(selectedElement.type === ELEMENT_TYPES.HEADING || selectedElement.type === ELEMENT_TYPES.TEXT) && (
          <div>
            <label className="block text-white text-sm font-medium mb-2">Color de texto</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={selectedElement.color || '#000000'}
                onChange={(e) => handleChange('color', e.target.value)}
                className="w-12 h-10 bg-[#2a2a2a] border border-[#3a3a3a] rounded cursor-pointer"
              />
              <input
                type="text"
                value={selectedElement.color || '#000000'}
                onChange={(e) => handleChange('color', e.target.value)}
                className="flex-1 px-3 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#8b5cf6]"
              />
            </div>
          </div>
        )}

        {/* Propiedades de botón */}
        {selectedElement.type === ELEMENT_TYPES.BUTTON && (
          <>
            <div>
              <label className="block text-white text-sm font-medium mb-2">Color de fondo</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={selectedElement.backgroundColor || '#8b5cf6'}
                  onChange={(e) => handleChange('backgroundColor', e.target.value)}
                  className="w-12 h-10 bg-[#2a2a2a] border border-[#3a3a3a] rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={selectedElement.backgroundColor || '#8b5cf6'}
                  onChange={(e) => handleChange('backgroundColor', e.target.value)}
                  className="flex-1 px-3 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#8b5cf6]"
                />
              </div>
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">Color de texto</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={selectedElement.textColor || '#ffffff'}
                  onChange={(e) => handleChange('textColor', e.target.value)}
                  className="w-12 h-10 bg-[#2a2a2a] border border-[#3a3a3a] rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={selectedElement.textColor || '#ffffff'}
                  onChange={(e) => handleChange('textColor', e.target.value)}
                  className="flex-1 px-3 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#8b5cf6]"
                />
              </div>
            </div>
          </>
        )}

        {/* Posición */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">Posición</label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-gray-400 text-xs mb-1">X</label>
              <input
                type="number"
                value={selectedElement.x || 50}
                onChange={(e) => handleChange('x', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white focus:outline-none focus:border-[#8b5cf6]"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-1">Y</label>
              <input
                type="number"
                value={selectedElement.y || 50}
                onChange={(e) => handleChange('y', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white focus:outline-none focus:border-[#8b5cf6]"
              />
            </div>
          </div>
        </div>

        {/* Tamaño */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">Tamaño</label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-gray-400 text-xs mb-1">Ancho</label>
              <input
                type="number"
                value={selectedElement.width || 200}
                onChange={(e) => handleChange('width', parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white focus:outline-none focus:border-[#8b5cf6]"
                min="1"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-1">Alto</label>
              <input
                type="number"
                value={selectedElement.height || 'auto'}
                onChange={(e) => handleChange('height', parseInt(e.target.value) || 'auto')}
                className="w-full px-3 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white focus:outline-none focus:border-[#8b5cf6]"
                min="1"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Toolbar superior con estilos originales
function EditorToolbar({ onSave, onPreview, onExit }) {
  return (
    <div className="h-16 bg-[#1a1a1a] border-b border-[#2a2a2a] flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={onExit}
          className="flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-[#2a2a2a] rounded-lg transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Volver</span>
        </button>
        
        <div className="flex items-center space-x-3">
          <AurelioLogo className="w-8 h-8" />
          <div>
            <h1 className="text-white font-semibold">Editor Aurelio</h1>
            <p className="text-gray-400 text-sm">🚀 Con dnd-kit + Plantillas</p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* Viewport selector */}
        <div className="flex items-center bg-[#2a2a2a] rounded-lg p-1">
          <button className="p-2 text-[#8b5cf6] bg-[#8b5cf6]/20 rounded-md">
            <FiMonitor className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <FiTablet className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <FiSmartphone className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={onPreview}
          className="flex items-center space-x-2 px-4 py-2 bg-[#2a2a2a] text-gray-300 hover:text-white hover:bg-[#3a3a3a] rounded-lg transition-colors"
        >
          <FiEye className="w-4 h-4" />
          <span>Vista previa</span>
        </button>

        <button
          onClick={onSave}
          className="flex items-center space-x-2 px-4 py-2 bg-[#8b5cf6] text-white hover:bg-[#7c3aed] rounded-lg transition-colors"
        >
          <FiSave className="w-4 h-4" />
          <span>Guardar</span>
        </button>
      </div>
    </div>
  );
}

// Componente principal del Editor Híbrido
function EditorHybrid({ selectedTemplate, onExit }) {
  const navigate = useNavigate();
  const [elements, setElements] = useState([]);
  const [selectedElementId, setSelectedElementId] = useState(null);
  const [nextId, setNextId] = useState(1);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Configurar sensores de dnd-kit
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8,
      },
    })
  );

  // Manejar drop de elementos
  const handleDragEnd = useCallback((event) => {
    console.log('🎯 handleDragEnd:', event);
    const { active, over, activatorEvent, delta, collisions } = event;
    
    if (!over || over.id !== 'editor-canvas') {
      console.log('❌ Drop fuera del canvas');
      return;
    }

    const dragData = active.data.current;
    console.log('📦 dragData:', dragData);
    
    if (!dragData || !dragData.elementType) {
      console.log('❌ No dragData válido');
      return;
    }

    if (dragData.isNew) {
      // Crear nuevo elemento donde se suelta (comportamiento original)
      console.log('✨ Creando nuevo elemento donde se suelta');
      
      // Obtener el canvas para calcular posición relativa
      const canvasElement = document.querySelector('.canvas-main');
      if (!canvasElement) {
        console.error('❌ Canvas no encontrado');
        return;
      }
      
      const canvasRect = canvasElement.getBoundingClientRect();
      
      // Tamaños por defecto según el tipo
      const getDefaultSize = (type) => {
        switch (type) {
          case ELEMENT_TYPES.HEADING: return { width: 300, height: 40 };
          case ELEMENT_TYPES.TEXT: return { width: 250, height: 60 };
          case ELEMENT_TYPES.BUTTON: return { width: 150, height: 45 };
          case ELEMENT_TYPES.IMAGE: return { width: 200, height: 150 };
          case ELEMENT_TYPES.CONTAINER: return { width: 300, height: 200 };
          default: return { width: 200, height: 50 };
        }
      };
      
      const defaultSize = getDefaultSize(dragData.elementType);
      
      // Layout vertical automático - calcular próxima posición Y
      let x = 20; // Margen izquierdo fijo
      let y = 0;  // Empezar desde arriba
      
      // Calcular la próxima posición Y basada en los elementos existentes
      if (elements.length > 0) {
        const lastElement = elements[elements.length - 1];
        y = lastElement.y + lastElement.height + 20; // 20px de espacio entre elementos
        console.log(`📐 Calculando posición Y: último elemento en y=${lastElement.y}, altura=${lastElement.height}, nueva Y=${y}`);
      }
      
      console.log(`📍 Posición automática: x=${x}, y=${y}`);
      console.log(`📋 Total de elementos existentes: ${elements.length}`);
      
      // Asegurar que el elemento esté dentro del canvas verticalmente
      const maxY = canvasRect.height - defaultSize.height - 20;
      if (y > maxY) {
        y = maxY;
        console.log(`⚠️ Posición Y limitada al máximo del canvas: ${y}`);
      }
      
      const newElement = {
        id: `element-${nextId}`,
        type: dragData.elementType,
        name: dragData.element.name,
        x: Math.round(x),
        y: Math.round(y),
        width: defaultSize.width,
        height: defaultSize.height,
        ...dragData.element.defaultProps,
      };
      
      console.log('🆕 Nuevo elemento (posición del mouse):', newElement);
      setElements(prev => [...prev, newElement]);
      setNextId(prev => prev + 1);
      setSelectedElementId(newElement.id);
    } else {
      // Para elementos existentes, permitir solo reordenamiento vertical
      console.log('🔄 Reordenando elemento existente en layout vertical');
      const canvasElement = document.querySelector('.canvas-main');
      if (!canvasElement) return;
      
      // Encontrar el elemento que se está moviendo
      const movingElement = elements.find(el => el.id === dragData.elementId);
      if (!movingElement) return;
      
      // Determinar nueva posición en el layout basada en el delta Y
      const deltaY = delta?.y || 0;
      const currentIndex = elements.findIndex(el => el.id === dragData.elementId);
      
      if (Math.abs(deltaY) > 30) { // Umbral mínimo para reordenar
        let newIndex = currentIndex;
        
        if (deltaY > 0 && currentIndex < elements.length - 1) {
          // Mover hacia abajo
          newIndex = currentIndex + 1;
        } else if (deltaY < 0 && currentIndex > 0) {
          // Mover hacia arriba
          newIndex = currentIndex - 1;
        }
        
        if (newIndex !== currentIndex) {
          console.log(`🔄 Reordenando: de posición ${currentIndex} a ${newIndex}`);
          
          // Reordenar elementos
          setElements(prev => {
            const newElements = [...prev];
            const [movedElement] = newElements.splice(currentIndex, 1);
            newElements.splice(newIndex, 0, movedElement);
            
            // Recalcular posiciones Y para todos los elementos
            return newElements.map((el, index) => ({
              ...el,
              x: 20, // Mantener X fijo
              y: index * (el.height + 20) // Espaciado vertical
            }));
          });
        }
      }
    }
  }, [nextId]);

  // Seleccionar elemento
  const handleSelectElement = useCallback((elementId) => {
    setSelectedElementId(elementId);
  }, []);

  // Actualizar elemento manteniendo layout vertical
  const handleUpdateElement = useCallback((elementId, updates) => {
    setElements(prev => {
      const updatedElements = prev.map(el => {
        if (el.id !== elementId) return el;
        
        const updatedElement = { ...el, ...updates };
        
        // Mantener X fijo para layout vertical
        if (updates.x !== undefined) {
          updatedElement.x = 20; // Forzar X fijo
        }
        
        return updatedElement;
      });
      
      // Si se cambió la altura, recalcular todas las posiciones Y
      if (updates.height !== undefined) {
        console.log('📅 Recalculando layout por cambio de altura');
        return updatedElements.map((el, index) => ({
          ...el,
          x: 20,
          y: index === 0 ? 0 : updatedElements.slice(0, index).reduce((acc, prevEl) => acc + prevEl.height + 20, 0)
        }));
      }
      
      return updatedElements;
    });
  }, []);

  // Eliminar elemento
  const handleDeleteElement = useCallback((elementId) => {
    setElements(prev => prev.filter(el => el.id !== elementId));
    if (selectedElementId === elementId) {
      setSelectedElementId(null);
    }
  }, [selectedElementId]);

  // Handlers del toolbar
  const handleSave = useCallback(() => {
    console.log('💾 Guardando proyecto...', elements);
    // Aquí implementar lógica de guardado
  }, [elements]);

  const handlePreview = useCallback(() => {
    console.log('👁️ Vista previa');
    // Aquí implementar vista previa
  }, []);

  const handleExit = useCallback(() => {
    if (onExit) {
      onExit();
    } else {
      navigate('/dashboard');
    }
  }, [onExit, navigate]);

  const selectedElement = elements.find(el => el.id === selectedElementId);

  return (
    <div className="h-screen flex flex-col bg-[#0f0f0f]">
      {/* Toolbar */}
      <EditorToolbar 
        onSave={handleSave}
        onPreview={handlePreview}
        onExit={handleExit}
      />

      <div className="flex-1 flex overflow-hidden">
        <DndContext
          sensors={sensors}
          onDragStart={(event) => console.log('🚀 Drag start:', event.active.data.current)}
          onDragEnd={handleDragEnd}
        >
          {/* Panel de elementos */}
          <ElementsPanel />

          {/* Canvas */}
          <EditorCanvas
            elements={elements}
            selectedId={selectedElementId}
            onSelectElement={handleSelectElement}
            onUpdateElement={handleUpdateElement}
            onDeleteElement={handleDeleteElement}
          />

          {/* Panel de propiedades */}
          <PropertiesPanel
            selectedElement={selectedElement}
            onUpdate={(updates) => selectedElement && handleUpdateElement(selectedElement.id, updates)}
            onDelete={() => selectedElement && handleDeleteElement(selectedElement.id)}
          />
        </DndContext>
      </div>
    </div>
  );
}

export default EditorHybrid;