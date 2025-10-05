import React, { useState } from 'react';
import { availableElements } from '../config/availableElements.jsx';
import ContainerTemplatesPanel from './ContainerTemplatesPanel';
import { createFromTemplate } from '../templates/containerTemplates';

// Componente para elementos del panel
function PanelElement({ element, onClick }) {
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
    e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'panel-element', element: element }));
    e.dataTransfer.effectAllowed = 'copy';
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
      className={`relative flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#2a2a2a] to-[#252525] rounded-xl text-white hover:from-[#3a3a3a] hover:to-[#353535] transition-all duration-200 min-h-[90px] group cursor-grab active:cursor-grabbing select-none border border-[#404040] hover:border-[#8b5cf6]/50 ${
        isDragging ? 'opacity-50 scale-95' : 'hover:scale-105'
      }`}
    >
      <div className="mb-2 group-hover:scale-110 transition-transform pointer-events-none text-[#8b5cf6]">
        {element.icon}
      </div>
      <span className="text-xs text-center font-medium pointer-events-none group-hover:text-white transition-colors">
        {element.name}
      </span>
      
      {/* Efecto de brillo en hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br from-[#8b5cf6] via-transparent to-[#ec4899] rounded-xl transition-opacity pointer-events-none" />
    </div>
  );
}

// Componente SectionsPanel mejorado sin emojis
function SectionsPanel({ onAddTemplate }) {
  const predefinedSections = [
    {
      id: 'card-template',
      name: 'Card',
      description: 'Tarjeta con imagen, título y texto',
      gradient: 'from-pink-500 to-rose-500',
      hoverColor: 'pink-400'
    },
    {
      id: 'hero-template',
      name: 'Hero Section',
      description: 'Sección hero con título, subtítulo y botón',
      gradient: 'from-blue-500 to-purple-500',
      hoverColor: 'blue-400'
    },
    {
      id: 'two-columns-template',
      name: 'Dos Columnas',
      description: 'Layout de dos columnas con contenido',
      gradient: 'from-green-500 to-teal-500',
      hoverColor: 'green-400'
    },
    {
      id: 'three-columns-template',
      name: 'Tres Columnas',
      description: 'Layout de tres columnas para grid de contenido',
      gradient: 'from-amber-500 to-orange-500',
      hoverColor: 'amber-400'
    },
    {
      id: 'header-template',
      name: 'Header/Navegación',
      description: 'Header con logo y navegación',
      gradient: 'from-indigo-500 to-blue-500',
      hoverColor: 'indigo-400'
    },
    {
      id: 'footer-template',
      name: 'Footer',
      description: 'Footer con información y enlaces',
      gradient: 'from-slate-600 to-gray-700',
      hoverColor: 'slate-400'
    }
  ];

  const handleSectionClick = (templateId) => {
    console.log('Adding predefined section:', templateId);
    const containerElement = createFromTemplate(templateId);
    if (containerElement && onAddTemplate) {
      onAddTemplate({
        ...containerElement,
        name: `Template ${templateId}`,
        defaultProps: containerElement.props
      });
    }
  };

  return (
    <div className="px-4 pb-4">
      {/* Plantillas prediseñadas */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-white mb-3">Plantillas</h4>
        <div className="grid grid-cols-1 gap-2">
          {predefinedSections.map((section) => (
            <button 
              key={section.id}
              onClick={() => handleSectionClick(section.id)}
              className="p-3 bg-gradient-to-r from-[#2a2a2a] to-[#252525] hover:from-[#3a3a3a] hover:to-[#353535] rounded-lg transition-all duration-200 group text-left border border-[#404040] hover:border-[#8b5cf6]/50"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-6 bg-gradient-to-r ${section.gradient} rounded flex-shrink-0`} />
                <div className="flex-1">
                  <div className={`text-sm font-medium text-white group-hover:text-${section.hoverColor} transition-colors`}>
                    {section.name}
                  </div>
                  <div className="text-xs text-gray-400">
                    {section.description}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Sección de importación */}
      <div>
        <h4 className="text-sm font-medium text-white mb-3">Importar</h4>
        <button 
          onClick={() => console.log('Import JSON clicked')}
          className="w-full p-3 bg-gradient-to-r from-[#2a2a2a] to-[#252525] hover:from-[#3a3a3a] hover:to-[#353535] rounded-lg transition-all duration-200 group border border-dashed border-[#404040] hover:border-[#8b5cf6]/50"
        >
          <div className="flex items-center justify-center space-x-2">
            <svg className="w-4 h-4 text-gray-400 group-hover:text-[#8b5cf6] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
              Subir JSON
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}

// Panel de elementos disponibles con pestañas
function ElementsPanel({ onAddElement }) {
  const [activeTab, setActiveTab] = useState('elements');

  const handleElementClick = (element, e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddElement(element);
  };

  return (
    <div className="w-64 bg-gradient-to-b from-[#1a1a1a] to-[#151515] border-r border-[#2a2a2a] flex flex-col shadow-xl">
      {/* Header con pestañas */}
      <div className="p-4 pb-0 flex-shrink-0">
        <div className="flex bg-[#2a2a2a] rounded-lg p-1 mb-4">
          <button
            onClick={() => setActiveTab('elements')}
            className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'elements'
                ? 'bg-[#8b5cf6] text-white shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-[#3a3a3a]'
            }`}
          >
            Elementos
          </button>
          <button
            onClick={() => setActiveTab('sections')}
            className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'sections'
                ? 'bg-[#8b5cf6] text-white shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-[#3a3a3a]'
            }`}
          >
            Secciones
          </button>
        </div>
      </div>

      {/* Contenido de pestañas */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'elements' && (
          <div className="px-4 pb-4">
            <div className="grid grid-cols-2 gap-3">
              {availableElements.map((element) => (
                <div key={element.id} className="relative">
                  <PanelElement 
                    element={element} 
                    onClick={(e) => handleElementClick(element, e)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'sections' && (
          <SectionsPanel onAddTemplate={onAddElement} />
        )}
      </div>
    </div>
  );
}

export default ElementsPanel;