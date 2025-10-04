import React from 'react';
import { ELEMENT_TYPES } from '../../../constants/elementTypes';
import { FiGrid, FiPackage } from 'react-icons/fi';

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
      
      {/* Propiedades del contenedor */}
      {selectedElement.type === ELEMENT_TYPES.CONTAINER && (
        <>
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-200 mb-3 flex items-center gap-2">
              <FiPackage className="w-4 h-4" />
              Contenedor
            </h4>
            
            {/* Padding */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Espaciado Interno</label>
              <input
                type="text"
                value={selectedElement.props.padding || '20px'}
                onChange={(e) => handlePropertyChange('padding', e.target.value)}
                className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-3 py-2 text-white text-sm"
                placeholder="20px"
              />
            </div>
            
            {/* Altura mínima */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Altura Mínima</label>
              <input
                type="text"
                value={selectedElement.props.minHeight || '150px'}
                onChange={(e) => handlePropertyChange('minHeight', e.target.value)}
                className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-3 py-2 text-white text-sm"
                placeholder="150px"
              />
            </div>
            
            {/* Color de fondo */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Color de Fondo</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={selectedElement.props.backgroundColor === 'transparent' ? '#ffffff' : (selectedElement.props.backgroundColor || '#ffffff')}
                  onChange={(e) => handlePropertyChange('backgroundColor', e.target.value)}
                  className="w-12 h-10 bg-[#2a2a2a] border border-[#3a3a3a] rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={selectedElement.props.backgroundColor || 'transparent'}
                  onChange={(e) => handlePropertyChange('backgroundColor', e.target.value)}
                  className="flex-1 px-3 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded text-white text-sm font-mono"
                  placeholder="transparent"
                />
              </div>
            </div>
            
            {/* Borde */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Borde</label>
              <input
                type="text"
                value={selectedElement.props.border || '2px dashed #d1d5db'}
                onChange={(e) => handlePropertyChange('border', e.target.value)}
                className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-3 py-2 text-white text-sm font-mono"
                placeholder="2px dashed #d1d5db"
              />
            </div>
            
            {/* Radio del borde */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Radio del Borde</label>
              <input
                type="text"
                value={selectedElement.props.borderRadius || '8px'}
                onChange={(e) => handlePropertyChange('borderRadius', e.target.value)}
                className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-3 py-2 text-white text-sm"
                placeholder="8px"
              />
            </div>
            
            {/* Información del contenedor */}
            <div className="mt-4 p-3 bg-[#0f0f0f] rounded border border-[#3a3a3a]">
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                <FiGrid className="w-3 h-3" />
                <span>Elementos hijos: {selectedElement.props.children?.length || 0}</span>
              </div>
              <div className="text-xs text-gray-500">
                {selectedElement.props.children?.length > 0 ? (
                  selectedElement.props.children.map((child, index) => (
                    <div key={child.id} className="flex items-center gap-1 mt-1">
                      <span>• {child.type.charAt(0).toUpperCase() + child.type.slice(1)}</span>
                    </div>
                  ))
                ) : (
                  <span>No hay elementos dentro del contenedor</span>
                )}
              </div>
            </div>
          </div>
        </>
      )}
      
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

export default PropertiesPanel;