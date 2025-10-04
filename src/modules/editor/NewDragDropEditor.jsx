import React, { useState } from 'react';
import { DndContext, useDraggable, useDroppable, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { useNavigate } from 'react-router-dom';

// Elementos disponibles para arrastrar
const AVAILABLE_ELEMENTS = [
  { id: 'button', name: 'Botón', icon: '🔘', type: 'button' },
  { id: 'text', name: 'Texto', icon: '📝', type: 'text' },
  { id: 'image', name: 'Imagen', icon: '🖼️', type: 'image' },
  { id: 'input', name: 'Input', icon: '📝', type: 'input' },
  { id: 'heading', name: 'Título', icon: '📄', type: 'heading' },
];

// Componente draggable para elementos nuevos
const DraggableElement = ({ element }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: `new-${element.id}`,
    data: { elementType: element.type }
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="p-3 border border-gray-200 rounded-lg cursor-grab hover:border-blue-300 hover:bg-blue-50 transition-all"
      {...attributes}
      {...listeners}
    >
      <div className="flex items-center space-x-3">
        <div className="text-2xl">{element.icon}</div>
        <div>
          <div className="font-medium text-sm text-gray-900">{element.name}</div>
          <div className="text-xs text-gray-500">Arrastra al canvas</div>
        </div>
      </div>
    </div>
  );
};

// Componente para elementos en el canvas
const CanvasElement = ({ element, isSelected, onSelect, onUpdate }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: element.id,
    data: { elementType: element.type, elementId: element.id }
  });

  const style = {
    position: 'absolute',
    left: element.x,
    top: element.y,
    width: element.width || 120,
    height: element.height || 40,
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isSelected ? 1000 : 1,
  };

  const renderContent = () => {
    const baseStyle = {
      width: '100%',
      height: '100%',
      backgroundColor: element.backgroundColor || '#3b82f6',
      color: element.color || '#ffffff',
      border: 'none',
      borderRadius: '4px',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      userSelect: 'none',
    };

    switch (element.type) {
      case 'button':
        return (
          <button style={baseStyle} onClick={(e) => e.preventDefault()}>
            {element.text || 'Button'}
          </button>
        );
      case 'text':
        return (
          <div style={{ ...baseStyle, backgroundColor: 'transparent', color: '#374151' }}>
            {element.text || 'Text Element'}
          </div>
        );
      case 'heading':
        return (
          <h1 style={{ ...baseStyle, backgroundColor: 'transparent', color: '#111827', fontSize: '24px', fontWeight: 'bold' }}>
            {element.text || 'Heading'}
          </h1>
        );
      case 'input':
        return (
          <input
            type="text"
            style={{ ...baseStyle, backgroundColor: '#ffffff', color: '#374151', border: '1px solid #d1d5db' }}
            placeholder={element.placeholder || 'Enter text...'}
            readOnly
          />
        );
      case 'image':
        return (
          <img
            src={element.src || 'https://picsum.photos/120/40'}
            alt={element.alt || 'Image'}
            style={{ ...baseStyle, objectFit: 'cover' }}
            draggable={false}
          />
        );
      default:
        return <div style={baseStyle}>Element</div>;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`cursor-grab ${isSelected ? 'ring-2 ring-blue-500' : 'hover:ring-1 hover:ring-gray-300'} transition-all`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(element.id);
      }}
      {...attributes}
      {...listeners}
    >
      {renderContent()}
      
      {isSelected && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 border border-white"></div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border border-white"></div>
          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 border border-white"></div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 border border-white"></div>
        </div>
      )}
    </div>
  );
};

// Panel de propiedades simple
const PropertiesPanel = ({ selectedElement, onUpdate, onDelete }) => {
  if (!selectedElement) {
    return (
      <div className="p-4 text-center text-gray-500">
        <div className="text-4xl mb-2">🎯</div>
        <h3 className="font-medium mb-2">Sin elemento seleccionado</h3>
        <p className="text-sm">Selecciona un elemento del canvas para editar sus propiedades.</p>
      </div>
    );
  }

  const handleChange = (property, value) => {
    onUpdate(selectedElement.id, { [property]: value });
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between pb-4 border-b">
        <div>
          <h3 className="font-medium capitalize">{selectedElement.type}</h3>
          <p className="text-sm text-gray-500">ID: {selectedElement.id}</p>
        </div>
        <button
          onClick={() => onDelete(selectedElement.id)}
          className="p-2 text-red-600 hover:bg-red-50 rounded"
          title="Eliminar"
        >
          🗑️
        </button>
      </div>

      {/* Position */}
      <div>
        <h4 className="font-medium mb-2">Posición</h4>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm text-gray-600">X</label>
            <input
              type="number"
              value={selectedElement.x || 0}
              onChange={(e) => handleChange('x', parseInt(e.target.value) || 0)}
              className="w-full px-2 py-1 text-sm border rounded"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Y</label>
            <input
              type="number"
              value={selectedElement.y || 0}
              onChange={(e) => handleChange('y', parseInt(e.target.value) || 0)}
              className="w-full px-2 py-1 text-sm border rounded"
            />
          </div>
        </div>
      </div>

      {/* Size */}
      <div>
        <h4 className="font-medium mb-2">Tamaño</h4>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm text-gray-600">Ancho</label>
            <input
              type="number"
              value={selectedElement.width || 120}
              onChange={(e) => handleChange('width', parseInt(e.target.value) || 120)}
              className="w-full px-2 py-1 text-sm border rounded"
              min="1"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Alto</label>
            <input
              type="number"
              value={selectedElement.height || 40}
              onChange={(e) => handleChange('height', parseInt(e.target.value) || 40)}
              className="w-full px-2 py-1 text-sm border rounded"
              min="1"
            />
          </div>
        </div>
      </div>

      {/* Text content */}
      {['button', 'text', 'heading'].includes(selectedElement.type) && (
        <div>
          <label className="block text-sm text-gray-600 mb-1">Texto</label>
          <input
            type="text"
            value={selectedElement.text || ''}
            onChange={(e) => handleChange('text', e.target.value)}
            className="w-full px-2 py-1 text-sm border rounded"
            placeholder="Ingresa el texto..."
          />
        </div>
      )}

      {/* Colors */}
      <div>
        <h4 className="font-medium mb-2">Colores</h4>
        <div className="space-y-2">
          <div>
            <label className="block text-sm text-gray-600">Color de fondo</label>
            <input
              type="color"
              value={selectedElement.backgroundColor || '#3b82f6'}
              onChange={(e) => handleChange('backgroundColor', e.target.value)}
              className="w-full h-10 border rounded cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Color de texto</label>
            <input
              type="color"
              value={selectedElement.color || '#ffffff'}
              onChange={(e) => handleChange('color', e.target.value)}
              className="w-full h-10 border rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente principal del Editor
const NewDragDropEditor = ({ selectedTemplate, onExit }) => {
  const navigate = useNavigate();
  const [elements, setElements] = useState([]);
  const [selectedElementId, setSelectedElementId] = useState(null);
  const [nextId, setNextId] = useState(1);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const selectedElement = elements.find(el => el.id === selectedElementId);

  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas',
  });

  const handleDragEnd = (event) => {
    console.log('handleDragEnd called:', event);
    const { active, over } = event;
    
    if (!over || over.id !== 'canvas') {
      console.log('No drop on canvas, over:', over);
      return;
    }

    const dragData = active.data.current;
    console.log('dragData:', dragData);
    
    if (!dragData || !dragData.elementType) {
      console.log('No dragData or elementType');
      return;
    }
    
    if (!dragData.elementId) {
      // Creating new element
      console.log('Creating new element');
      
      // Usar coordenadas aleatorias para testing, luego mejoraremos
      const x = Math.floor(Math.random() * 200) + 50;
      const y = Math.floor(Math.random() * 200) + 50;
      
      const newElement = {
        id: `element-${nextId}`,
        type: dragData.elementType,
        x,
        y,
        width: 120,
        height: 40,
        text: getDefaultText(dragData.elementType),
        backgroundColor: getDefaultBackgroundColor(dragData.elementType),
        color: getDefaultTextColor(dragData.elementType),
      };
      
      console.log('New element to add:', newElement);

      setElements(prev => {
        const newElements = [...prev, newElement];
        console.log('Updated elements:', newElements);
        return newElements;
      });
      setNextId(prev => prev + 1);
      setSelectedElementId(newElement.id);
    } else {
      // Moving existing element
      console.log('Moving existing element:', dragData.elementId);
      setElements(prev => prev.map(el => 
        el.id === dragData.elementId 
          ? { ...el, x: el.x + (event.delta?.x || 0), y: el.y + (event.delta?.y || 0) }
          : el
      ));
    }
  };

  const getDefaultText = (type) => {
    switch (type) {
      case 'button': return 'Button';
      case 'text': return 'Text Element';
      case 'heading': return 'Heading';
      default: return '';
    }
  };

  const getDefaultBackgroundColor = (type) => {
    switch (type) {
      case 'button': return '#3b82f6';
      case 'text': return 'transparent';
      case 'heading': return 'transparent';
      case 'input': return '#ffffff';
      case 'image': return 'transparent';
      default: return '#3b82f6';
    }
  };

  const getDefaultTextColor = (type) => {
    switch (type) {
      case 'button': return '#ffffff';
      case 'text': return '#374151';
      case 'heading': return '#111827';
      case 'input': return '#374151';
      case 'image': return '#ffffff';
      default: return '#ffffff';
    }
  };

  const updateElement = (id, updates) => {
    setElements(prev => prev.map(el => 
      el.id === id ? { ...el, ...updates } : el
    ));
  };

  const deleteElement = (id) => {
    setElements(prev => prev.filter(el => el.id !== id));
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Toolbar */}
      <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onExit ? onExit() : navigate('/dashboard')}
            className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
          >
            <span>←</span>
            <span>Dashboard</span>
          </button>
          <h1 className="text-lg font-semibold text-white bg-green-500 px-4 py-2 rounded-lg shadow-lg animate-pulse">
            🚀 NUEVO EDITOR CON DND-KIT 🚀
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">{elements.length} elementos</span>
          <button className="px-4 py-1.5 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-md">
            Guardar
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Elements Panel */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-900">Elementos</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {AVAILABLE_ELEMENTS.map(element => (
              <DraggableElement key={element.id} element={element} />
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 flex flex-col">
          <DndContext
            sensors={sensors}
            onDragStart={(event) => {
              console.log('Drag started:', event.active.data.current);
            }}
            onDragEnd={handleDragEnd}
          >
            <div 
              id="canvas"
              ref={setNodeRef}
              className={`flex-1 relative bg-white m-8 shadow-lg ${isOver ? 'ring-2 ring-blue-400' : ''}`}
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setSelectedElementId(null);
                }
              }}
            >
              {isOver && (
                <div className="absolute inset-0 bg-blue-50 bg-opacity-50 border-2 border-dashed border-blue-400 flex items-center justify-center pointer-events-none">
                  <div className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                    Suelta el elemento aquí
                  </div>
                </div>
              )}

              {elements.map(element => (
                <CanvasElement
                  key={element.id}
                  element={element}
                  isSelected={selectedElementId === element.id}
                  onSelect={setSelectedElementId}
                  onUpdate={updateElement}
                />
              ))}
            </div>
          </DndContext>
        </div>

        {/* Properties Panel */}
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-900">
              {selectedElement ? 'Propiedades' : 'Sin selección'}
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            <PropertiesPanel
              selectedElement={selectedElement}
              onUpdate={updateElement}
              onDelete={deleteElement}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewDragDropEditor;
