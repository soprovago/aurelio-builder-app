import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { ElementType, DragData } from '@/types';

// Configuración de elementos disponibles
interface ElementConfig {
  type: ElementType;
  name: string;
  icon: string;
  description: string;
  category: 'basic' | 'layout' | 'media' | 'form';
}

const availableElements: ElementConfig[] = [
  // Básicos
  {
    type: 'text',
    name: 'Texto',
    icon: '📝',
    description: 'Elemento de texto simple',
    category: 'basic',
  },
  {
    type: 'heading',
    name: 'Título',
    icon: '📄',
    description: 'Encabezado o título',
    category: 'basic',
  },
  {
    type: 'paragraph',
    name: 'Párrafo',
    icon: '📖',
    description: 'Párrafo de texto',
    category: 'basic',
  },
  {
    type: 'button',
    name: 'Botón',
    icon: '🔘',
    description: 'Botón interactivo',
    category: 'basic',
  },
  {
    type: 'link',
    name: 'Enlace',
    icon: '🔗',
    description: 'Enlace a otra página',
    category: 'basic',
  },
  
  // Layout
  {
    type: 'container',
    name: 'Contenedor',
    icon: '📦',
    description: 'Contenedor para otros elementos',
    category: 'layout',
  },
  
  // Media
  {
    type: 'image',
    name: 'Imagen',
    icon: '🖼️',
    description: 'Imagen o foto',
    category: 'media',
  },
  
  // Form
  {
    type: 'input',
    name: 'Campo de texto',
    icon: '📝',
    description: 'Campo de entrada de texto',
    category: 'form',
  },
];

// Componente para elemento draggable
interface DraggableElementProps {
  element: ElementConfig;
}

const DraggableElement: React.FC<DraggableElementProps> = ({ element }) => {
  const dragData: DragData = {
    elementType: element.type,
    // No incluir elementId porque estamos creando uno nuevo
  };

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: `new-${element.type}`,
    data: dragData,
  });

  const style: React.CSSProperties = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        p-3 border border-gray-200 rounded-lg cursor-grab
        hover:border-blue-300 hover:bg-blue-50 
        transition-all duration-200
        ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
      `}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-center space-x-3">
        <div className="text-2xl">{element.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm text-gray-900">{element.name}</div>
          <div className="text-xs text-gray-500 truncate">{element.description}</div>
        </div>
      </div>
    </div>
  );
};

// Componente principal del panel
const ElementsPanel: React.FC = () => {
  const [activeCategory, setActiveCategory] = React.useState<string>('all');

  // Filtrar elementos por categoría
  const filteredElements = activeCategory === 'all' 
    ? availableElements
    : availableElements.filter(el => el.category === activeCategory);

  // Agrupar por categoría para mostrar
  const elementsByCategory = availableElements.reduce((acc, element) => {
    if (!acc[element.category]) {
      acc[element.category] = [];
    }
    acc[element.category].push(element);
    return acc;
  }, {} as Record<string, ElementConfig[]>);

  const categories = [
    { id: 'all', name: 'Todos', icon: '📋' },
    { id: 'basic', name: 'Básicos', icon: '🎯' },
    { id: 'layout', name: 'Layout', icon: '📐' },
    { id: 'media', name: 'Media', icon: '🎨' },
    { id: 'form', name: 'Formularios', icon: '📝' },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Tabs de categorías */}
      <div className="p-2 border-b border-gray-200">
        <div className="flex flex-wrap gap-1">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`
                px-2 py-1 text-xs rounded font-medium transition-colors
                ${activeCategory === category.id
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:bg-gray-100'
                }
              `}
            >
              <span className="mr-1">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de elementos */}
      <div className="flex-1 overflow-y-auto">
        {activeCategory === 'all' ? (
          // Mostrar por categorías
          <div className="p-2 space-y-4">
            {Object.entries(elementsByCategory).map(([categoryId, elements]) => {
              const category = categories.find(c => c.id === categoryId);
              return (
                <div key={categoryId}>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm">{category?.icon}</span>
                    <h4 className="text-sm font-medium text-gray-700 capitalize">
                      {category?.name}
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {elements.map(element => (
                      <DraggableElement key={element.type} element={element} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Mostrar solo la categoría seleccionada
          <div className="p-2 space-y-2">
            {filteredElements.map(element => (
              <DraggableElement key={element.type} element={element} />
            ))}
          </div>
        )}
      </div>

      {/* Información adicional */}
      <div className="p-3 bg-gray-50 border-t border-gray-200">
        <div className="text-xs text-gray-600">
          <div className="flex items-center justify-between mb-1">
            <span>Elementos disponibles:</span>
            <span className="font-medium">{filteredElements.length}</span>
          </div>
          <div className="text-center text-gray-500">
            Arrastra los elementos al canvas
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElementsPanel;