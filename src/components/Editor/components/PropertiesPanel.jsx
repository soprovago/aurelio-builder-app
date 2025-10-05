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
            
            {/* Layout Direction */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Dirección</label>
              <select
                value={selectedElement.props.flexDirection || 'column'}
                onChange={(e) => handlePropertyChange('flexDirection', e.target.value)}
                className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-3 py-2 text-white text-sm"
              >
                <option value="column">Columna (vertical)</option>
                <option value="row">Fila (horizontal)</option>
                <option value="column-reverse">Columna reversa</option>
                <option value="row-reverse">Fila reversa</option>
              </select>
            </div>
            
            {/* Justify Content */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Alineación Principal</label>
              <select
                value={selectedElement.props.justifyContent || 'flex-start'}
                onChange={(e) => handlePropertyChange('justifyContent', e.target.value)}
                className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-3 py-2 text-white text-sm"
              >
                <option value="flex-start">Inicio</option>
                <option value="center">Centro</option>
                <option value="flex-end">Final</option>
                <option value="space-between">Espacio entre</option>
                <option value="space-around">Espacio alrededor</option>
                <option value="space-evenly">Espacio uniforme</option>
              </select>
            </div>
            
            {/* Align Items */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Alineación Secundaria</label>
              <select
                value={selectedElement.props.alignItems || 'stretch'}
                onChange={(e) => handlePropertyChange('alignItems', e.target.value)}
                className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-3 py-2 text-white text-sm"
              >
                <option value="stretch">Estirar</option>
                <option value="flex-start">Inicio</option>
                <option value="center">Centro</option>
                <option value="flex-end">Final</option>
                <option value="baseline">Línea base</option>
              </select>
            </div>
            
            {/* Flex Wrap */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Envoltura</label>
              <select
                value={selectedElement.props.flexWrap || 'nowrap'}
                onChange={(e) => handlePropertyChange('flexWrap', e.target.value)}
                className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-3 py-2 text-white text-sm"
              >
                <option value="nowrap">Sin envoltura</option>
                <option value="wrap">Con envoltura</option>
                <option value="wrap-reverse">Envoltura reversa</option>
              </select>
            </div>
            
            {/* Gap */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Espaciado entre Elementos</label>
              <input
                type="text"
                value={selectedElement.props.gap || '16px'}
                onChange={(e) => handlePropertyChange('gap', e.target.value)}
                className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-3 py-2 text-white text-sm"
                placeholder="16px"
              />
            </div>
            
            {/* Configuración de columnas rápidas */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Layout Rápido</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    handlePropertyChange('flexDirection', 'column');
                    handlePropertyChange('alignItems', 'stretch');
                  }}
                  className={`px-3 py-2 text-xs rounded transition-colors ${
                    selectedElement.props.flexDirection === 'column' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-[#3a3a3a] text-gray-300 hover:bg-[#4a4a4a]'
                  }`}
                >
                  Una Columna
                </button>
                <button
                  onClick={() => {
                    handlePropertyChange('flexDirection', 'row');
                    handlePropertyChange('alignItems', 'stretch');
                    handlePropertyChange('flexWrap', 'wrap');
                  }}
                  className={`px-3 py-2 text-xs rounded transition-colors ${
                    selectedElement.props.flexDirection === 'row' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-[#3a3a3a] text-gray-300 hover:bg-[#4a4a4a]'
                  }`}
                >
                  Múltiples
                </button>
              </div>
              
              {/* Presets de columnas */}
              {selectedElement.props.flexDirection === 'row' && (
                <div className="mt-2 grid grid-cols-3 gap-1">
                  <button
                    onClick={() => {
                      handlePropertyChange('justifyContent', 'space-between');
                    }}
                    className="px-2 py-1 text-xs bg-[#3a3a3a] text-gray-300 hover:bg-purple-600 hover:text-white rounded transition-colors"
                  >
                    2 Col
                  </button>
                  <button
                    onClick={() => {
                      handlePropertyChange('justifyContent', 'space-around');
                    }}
                    className="px-2 py-1 text-xs bg-[#3a3a3a] text-gray-300 hover:bg-purple-600 hover:text-white rounded transition-colors"
                  >
                    3 Col
                  </button>
                  <button
                    onClick={() => {
                      handlePropertyChange('justifyContent', 'space-evenly');
                    }}
                    className="px-2 py-1 text-xs bg-[#3a3a3a] text-gray-300 hover:bg-purple-600 hover:text-white rounded transition-colors"
                  >
                    4 Col
                  </button>
                </div>
              )}
            </div>
            
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
          {/* Contenido */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Texto</label>
            <input
              type="text"
              value={selectedElement.props.text || 'Botón'}
              onChange={(e) => handlePropertyChange('text', e.target.value)}
              className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-3 py-2 text-white"
              placeholder="Texto del botón"
            />
          </div>

          {/* Enlaces */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">URL (Enlace)</label>
            <input
              type="url"
              value={selectedElement.props.href || '#'}
              onChange={(e) => handlePropertyChange('href', e.target.value)}
              className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-3 py-2 text-white text-sm"
              placeholder="https://ejemplo.com o #"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Abrir enlace</label>
            <select
              value={selectedElement.props.target || '_self'}
              onChange={(e) => handlePropertyChange('target', e.target.value)}
              className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-3 py-2 text-white text-sm"
            >
              <option value="_self">Misma pestaña</option>
              <option value="_blank">Nueva pestaña</option>
              <option value="_parent">Ventana padre</option>
              <option value="_top">Ventana superior</option>
            </select>
          </div>

          {/* Colores normales */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Color de fondo</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={selectedElement.props.backgroundColor || '#8b5cf6'}
                onChange={(e) => handlePropertyChange('backgroundColor', e.target.value)}
                className="w-12 h-10 bg-[#2a2a2a] border border-[#3a3a3a] rounded cursor-pointer"
              />
              <input
                type="text"
                value={selectedElement.props.backgroundColor || '#8b5cf6'}
                onChange={(e) => handlePropertyChange('backgroundColor', e.target.value)}
                className="flex-1 px-3 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded text-white text-sm font-mono"
                placeholder="#8b5cf6"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Color de texto</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={selectedElement.props.textColor || '#ffffff'}
                onChange={(e) => handlePropertyChange('textColor', e.target.value)}
                className="w-12 h-10 bg-[#2a2a2a] border border-[#3a3a3a] rounded cursor-pointer"
              />
              <input
                type="text"
                value={selectedElement.props.textColor || '#ffffff'}
                onChange={(e) => handlePropertyChange('textColor', e.target.value)}
                className="flex-1 px-3 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded text-white text-sm font-mono"
                placeholder="#ffffff"
              />
            </div>
          </div>

          {/* Colores hover */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Color de fondo (hover)</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={selectedElement.props.backgroundColorHover || '#7c3aed'}
                onChange={(e) => handlePropertyChange('backgroundColorHover', e.target.value)}
                className="w-12 h-10 bg-[#2a2a2a] border border-[#3a3a3a] rounded cursor-pointer"
              />
              <input
                type="text"
                value={selectedElement.props.backgroundColorHover || '#7c3aed'}
                onChange={(e) => handlePropertyChange('backgroundColorHover', e.target.value)}
                className="flex-1 px-3 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded text-white text-sm font-mono"
                placeholder="#7c3aed"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Color de texto (hover)</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={selectedElement.props.textColorHover || '#ffffff'}
                onChange={(e) => handlePropertyChange('textColorHover', e.target.value)}
                className="w-12 h-10 bg-[#2a2a2a] border border-[#3a3a3a] rounded cursor-pointer"
              />
              <input
                type="text"
                value={selectedElement.props.textColorHover || '#ffffff'}
                onChange={(e) => handlePropertyChange('textColorHover', e.target.value)}
                className="flex-1 px-3 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded text-white text-sm font-mono"
                placeholder="#ffffff"
              />
            </div>
          </div>

          {/* Tipografía */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Tamaño de fuente</label>
            <input
              type="text"
              value={selectedElement.props.fontSize || '16px'}
              onChange={(e) => handlePropertyChange('fontSize', e.target.value)}
              className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-3 py-2 text-white text-sm"
              placeholder="16px"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Peso de fuente</label>
            <select
              value={selectedElement.props.fontWeight || '500'}
              onChange={(e) => handlePropertyChange('fontWeight', e.target.value)}
              className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-3 py-2 text-white text-sm"
            >
              <option value="300">Light (300)</option>
              <option value="400">Regular (400)</option>
              <option value="500">Medium (500)</option>
              <option value="600">Semibold (600)</option>
              <option value="700">Bold (700)</option>
              <option value="800">Extra Bold (800)</option>
            </select>
          </div>

          {/* Espaciado y dimensiones */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Padding</label>
            <input
              type="text"
              value={selectedElement.props.padding || '12px 24px'}
              onChange={(e) => handlePropertyChange('padding', e.target.value)}
              className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-3 py-2 text-white text-sm"
              placeholder="12px 24px"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Radio del borde</label>
            <input
              type="text"
              value={selectedElement.props.borderRadius || '8px'}
              onChange={(e) => handlePropertyChange('borderRadius', e.target.value)}
              className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-3 py-2 text-white text-sm"
              placeholder="8px"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Borde</label>
            <input
              type="text"
              value={selectedElement.props.border || 'none'}
              onChange={(e) => handlePropertyChange('border', e.target.value)}
              className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-3 py-2 text-white text-sm"
              placeholder="2px solid #8b5cf6 o none"
            />
          </div>

          {/* Comportamiento */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Tipo de botón</label>
            <select
              value={selectedElement.props.buttonType || 'button'}
              onChange={(e) => handlePropertyChange('buttonType', e.target.value)}
              className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-3 py-2 text-white text-sm"
            >
              <option value="button">Botón normal</option>
              <option value="submit">Enviar formulario</option>
              <option value="reset">Resetear formulario</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={selectedElement.props.disabled || false}
                onChange={(e) => handlePropertyChange('disabled', e.target.checked)}
                className="w-4 h-4 bg-[#2a2a2a] border border-[#3a3a3a] rounded"
              />
              Deshabilitado
            </label>
          </div>

          {/* Alineación */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Alineación</label>
            <select
              value={selectedElement.props.alignSelf || 'auto'}
              onChange={(e) => handlePropertyChange('alignSelf', e.target.value)}
              className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-3 py-2 text-white text-sm"
            >
              <option value="auto">Auto</option>
              <option value="flex-start">Izquierda</option>
              <option value="center">Centro</option>
              <option value="flex-end">Derecha</option>
              <option value="stretch">Estirar</option>
            </select>
          </div>

          {/* Accesibilidad */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Etiqueta de accesibilidad</label>
            <input
              type="text"
              value={selectedElement.props.ariaLabel || ''}
              onChange={(e) => handlePropertyChange('ariaLabel', e.target.value)}
              className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-3 py-2 text-white text-sm"
              placeholder="Descripción para lectores de pantalla"
            />
          </div>
        </>
      )}
    </div>
  );
}

export default PropertiesPanel;