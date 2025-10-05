import React, { useState } from 'react';
import { ELEMENT_TYPES } from '../../../constants/elementTypes';
import { 
  FiChevronDown, 
  FiChevronRight, 
  FiPackage, 
  FiImage, 
  FiType, 
  FiSquare,
  FiLayout,
  FiGrid,
  FiDroplet,
  FiMove,
  FiEye,
  FiSettings
} from 'react-icons/fi';

// Componente de sección colapsable
function CollapsibleSection({ title, icon: Icon, children, isOpen: initialIsOpen = true }) {
  const [isOpen, setIsOpen] = useState(initialIsOpen);

  return (
    <div className="mb-4 border border-[#2a2a2a] rounded-lg bg-[#1a1a1a]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 text-left hover:bg-[#2a2a2a] transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-white">{title}</span>
        </div>
        {isOpen ? (
          <FiChevronDown className="w-4 h-4 text-gray-400" />
        ) : (
          <FiChevronRight className="w-4 h-4 text-gray-400" />
        )}
      </button>
      {isOpen && (
        <div className="p-4 pt-0 border-t border-[#2a2a2a]">
          {children}
        </div>
      )}
    </div>
  );
}

// Panel de propiedades con secciones organizadas
function PropertiesPanel({ selectedElement, onUpdateElement }) {
  const [activeTab, setActiveTab] = useState('layout');
  
  if (!selectedElement) {
    return (
      <div className="w-80 bg-[#1a1a1a] border-l border-[#2a2a2a] p-4">
        <div className="text-center py-8">
          <FiSettings className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Selecciona un elemento</p>
          <p className="text-gray-500 text-xs mt-1">para editar sus propiedades</p>
        </div>
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
  
  // Obtener el nombre del elemento para el título
  const getElementDisplayName = () => {
    switch(selectedElement.type) {
      case 'container': return 'Contenedor';
      case 'text': return 'Texto';
      case 'heading': return 'Encabezado';
      case 'image': return 'Imagen';
      case 'button': return 'Botón';
      default: return 'Elemento';
    }
  };

  return (
    <div className="w-80 bg-[#0f0f0f] border-l border-[#2a2a2a] overflow-y-auto">
      {/* Título del elemento */}
      <div className="px-4 py-3 bg-[#1a1a1a] border-b border-[#2a2a2a]">
        <h2 className="text-sm font-medium text-white">
          Editar {getElementDisplayName()}
        </h2>
      </div>
      
      {/* Header con pestañas */}
      <div className="border-b border-[#2a2a2a] bg-[#1a1a1a]">
        <div className="flex w-full">
          <button 
            onClick={() => setActiveTab('layout')}
            className={`flex-1 py-3 text-xs font-medium transition-colors ${
              activeTab === 'layout' 
                ? 'text-white bg-[#2a2a2a] border-b-2 border-purple-500' 
                : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
            }`}
          >
            <FiLayout className="w-4 h-4 mx-auto mb-1" />
            <div>Disposición</div>
          </button>
          <button 
            onClick={() => setActiveTab('style')}
            className={`flex-1 py-3 text-xs font-medium transition-colors ${
              activeTab === 'style' 
                ? 'text-white bg-[#2a2a2a] border-b-2 border-purple-500' 
                : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
            }`}
          >
            <FiDroplet className="w-4 h-4 mx-auto mb-1" />
            <div>Estilo</div>
          </button>
          <button 
            onClick={() => setActiveTab('advanced')}
            className={`flex-1 py-3 text-xs font-medium transition-colors ${
              activeTab === 'advanced' 
                ? 'text-white bg-[#2a2a2a] border-b-2 border-purple-500' 
                : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
            }`}
          >
            <FiSettings className="w-4 h-4 mx-auto mb-1" />
            <div>Avanzado</div>
          </button>
        </div>
      </div>

      <div className="p-4">
        {/* CONTENIDO DE PESTAÑA DISPOSICIÓN */}
        {activeTab === 'layout' && (
          <>
            {/* CONTENEDOR */}
            {selectedElement.type === ELEMENT_TYPES.CONTAINER && (
              <>
            <CollapsibleSection title="Contenedor" icon={FiPackage} isOpen={true}>
              <div className="space-y-4">
                {/* Diseño del contenedor */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Diseño del contenedor</label>
                  <select
                    value={selectedElement.props.layout || 'flexbox'}
                    onChange={(e) => handlePropertyChange('layout', e.target.value)}
                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-3 py-2 text-white text-sm"
                  >
                    <option value="flexbox">Flexbox</option>
                    <option value="grid">Grid</option>
                    <option value="block">Block</option>
                  </select>
                </div>

                {/* Ancho del contenido */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Ancho del contenido</label>
                  <select
                    value={selectedElement.props.widthType || 'full'}
                    onChange={(e) => handlePropertyChange('widthType', e.target.value)}
                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-3 py-2 text-white text-sm"
                  >
                    <option value="caja">Caja</option>
                    <option value="full">Ancho completo</option>
                    <option value="custom">Personalizado</option>
                  </select>
                </div>

                {/* Ancho */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Ancho</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="1200"
                      value={parseInt(selectedElement.props.width || '1140')}
                      onChange={(e) => handlePropertyChange('width', e.target.value + 'px')}
                      className="flex-1 accent-purple-600"
                    />
                    <span className="text-xs text-gray-400 min-w-[50px]">
                      {selectedElement.props.width || '1140px'}
                    </span>
                  </div>
                </div>

                {/* Altura mínima */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Altura mínima</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="800"
                      value={parseInt(selectedElement.props.minHeight || '100')}
                      onChange={(e) => handlePropertyChange('minHeight', e.target.value + 'px')}
                      className="flex-1 accent-purple-600"
                    />
                    <span className="text-xs text-gray-400 min-w-[50px]">
                      {selectedElement.props.minHeight || '100px'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Para conseguir un contenedor de altura completa, utiliza 100vh.
                  </p>
                </div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Elementos" icon={FiGrid} isOpen={true}>
              <div className="space-y-4">
                {/* Dirección */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Dirección</label>
                  <div className="grid grid-cols-4 gap-1">
                    <button
                      onClick={() => handlePropertyChange('flexDirection', 'row')}
                      className={`p-2 rounded text-xs transition-colors ${
                        selectedElement.props.flexDirection === 'row'
                          ? 'bg-purple-600 text-white' 
                          : 'bg-[#2a2a2a] text-gray-400 hover:bg-[#3a3a3a]'
                      }`}
                    >
                      <FiMove className="w-4 h-4 mx-auto mb-1 rotate-90" />
                    </button>
                    <button
                      onClick={() => handlePropertyChange('flexDirection', 'column')}
                      className={`p-2 rounded text-xs transition-colors ${
                        selectedElement.props.flexDirection === 'column'
                          ? 'bg-purple-600 text-white' 
                          : 'bg-[#2a2a2a] text-gray-400 hover:bg-[#3a3a3a]'
                      }`}
                    >
                      <FiMove className="w-4 h-4 mx-auto mb-1" />
                    </button>
                    <button
                      onClick={() => handlePropertyChange('flexDirection', 'row-reverse')}
                      className={`p-2 rounded text-xs transition-colors ${
                        selectedElement.props.flexDirection === 'row-reverse'
                          ? 'bg-purple-600 text-white' 
                          : 'bg-[#2a2a2a] text-gray-400 hover:bg-[#3a3a3a]'
                      }`}
                    >
                      <FiMove className="w-4 h-4 mx-auto mb-1 rotate-90 transform scale-x-[-1]" />
                    </button>
                    <button
                      onClick={() => handlePropertyChange('flexDirection', 'column-reverse')}
                      className={`p-2 rounded text-xs transition-colors ${
                        selectedElement.props.flexDirection === 'column-reverse'
                          ? 'bg-purple-600 text-white' 
                          : 'bg-[#2a2a2a] text-gray-400 hover:bg-[#3a3a3a]'
                      }`}
                    >
                      <FiMove className="w-4 h-4 mx-auto mb-1 transform scale-y-[-1]" />
                    </button>
                  </div>
                </div>

                {/* Contenido justificado */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Contenido justificado</label>
                  <div className="grid grid-cols-6 gap-1">
                    {[
                      { value: 'flex-start', icon: '⊣' },
                      { value: 'center', icon: '⊢⊣' },
                      { value: 'flex-end', icon: '⊢' },
                      { value: 'space-between', icon: '⊣ ⊢' },
                      { value: 'space-around', icon: '⌐ ⌐' },
                      { value: 'space-evenly', icon: '⌐⌐⌐' }
                    ].map(item => (
                      <button
                        key={item.value}
                        onClick={() => handlePropertyChange('justifyContent', item.value)}
                        className={`p-2 rounded text-xs transition-colors ${
                          selectedElement.props.justifyContent === item.value
                            ? 'bg-purple-600 text-white' 
                            : 'bg-[#2a2a2a] text-gray-400 hover:bg-[#3a3a3a]'
                        }`}
                      >
                        {item.icon}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Alinear elementos */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Alinear elementos</label>
                  <div className="grid grid-cols-5 gap-1">
                    {[
                      { value: 'stretch', icon: '⊞' },
                      { value: 'flex-start', icon: '⊤' },
                      { value: 'center', icon: '⊢⊣' },
                      { value: 'flex-end', icon: '⊥' },
                      { value: 'baseline', icon: '⊣' }
                    ].map(item => (
                      <button
                        key={item.value}
                        onClick={() => handlePropertyChange('alignItems', item.value)}
                        className={`p-2 rounded text-xs transition-colors ${
                          selectedElement.props.alignItems === item.value
                            ? 'bg-purple-600 text-white' 
                            : 'bg-[#2a2a2a] text-gray-400 hover:bg-[#3a3a3a]'
                        }`}
                      >
                        {item.icon}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Huecos */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Huecos</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <input
                        type="number"
                        value={parseInt(selectedElement.props.gap || '20')}
                        onChange={(e) => handlePropertyChange('gap', e.target.value + 'px')}
                        className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-2 py-1 text-white text-xs"
                        placeholder="20"
                      />
                      <p className="text-xs text-gray-500 mt-1">Columna</p>
                    </div>
                    <div>
                      <input
                        type="number"
                        value={parseInt(selectedElement.props.rowGap || '20')}
                        onChange={(e) => handlePropertyChange('rowGap', e.target.value + 'px')}
                        className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-2 py-1 text-white text-xs"
                        placeholder="20"
                      />
                      <p className="text-xs text-gray-500 mt-1">Fila</p>
                    </div>
                  </div>
                  <button className="mt-2 p-1 text-xs text-gray-400 hover:text-white transition-colors">
                    🔗
                  </button>
                </div>

                {/* Envoltura */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Envoltura</label>
                  <div className="grid grid-cols-3 gap-1">
                    {[
                      { value: 'nowrap', icon: '→', label: 'Sin envoltura' },
                      { value: 'wrap', icon: '↲', label: 'Envoltura' },
                      { value: 'wrap-reverse', icon: '↳', label: 'Envoltura reversa' }
                    ].map(item => (
                      <button
                        key={item.value}
                        onClick={() => handlePropertyChange('flexWrap', item.value)}
                        className={`p-2 rounded text-xs transition-colors ${
                          selectedElement.props.flexWrap === item.value
                            ? 'bg-purple-600 text-white' 
                            : 'bg-[#2a2a2a] text-gray-400 hover:bg-[#3a3a3a]'
                        }`}
                        title={item.label}
                      >
                        {item.icon}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Los elementos que están dentro del contenedor pueden permanecer en una sola línea (Sin envoltura), o romperse en varias líneas (Envoltura).
                  </p>
                </div>
              </div>
            </CollapsibleSection>
              </>
            )}

            {/* TEXTO Y ENCABEZADO */}
            {(selectedElement.type === ELEMENT_TYPES.HEADING || selectedElement.type === ELEMENT_TYPES.TEXT) && (
          <>
            <CollapsibleSection title="Contenido" icon={FiType} isOpen={true}>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Texto</label>
                  <textarea
                    value={selectedElement.props.text}
                    onChange={(e) => handlePropertyChange('text', e.target.value)}
                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-3 py-2 text-white text-sm resize-none"
                    rows={3}
                  />
                </div>
                
                {selectedElement.type === ELEMENT_TYPES.HEADING && (
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-2">Nivel del encabezado</label>
                    <select
                      value={selectedElement.props.level || 1}
                      onChange={(e) => handlePropertyChange('level', parseInt(e.target.value))}
                      className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-3 py-2 text-white text-sm"
                    >
                      <option value={1}>H1 - Encabezado principal</option>
                      <option value={2}>H2 - Subencabezado</option>
                      <option value={3}>H3 - Encabezado menor</option>
                      <option value={4}>H4 - Encabezado pequeño</option>
                      <option value={5}>H5 - Muy pequeño</option>
                      <option value={6}>H6 - Mínimo</option>
                    </select>
                  </div>
                )}
                
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Alineación</label>
                  <div className="grid grid-cols-4 gap-1">
                    {[
                      { value: 'left', icon: '⊣', label: 'Izquierda' },
                      { value: 'center', icon: '⊢⊣', label: 'Centro' },
                      { value: 'right', icon: '⊢', label: 'Derecha' },
                      { value: 'justify', icon: '⊞', label: 'Justificar' }
                    ].map(item => (
                      <button
                        key={item.value}
                        onClick={() => handlePropertyChange('alignment', item.value)}
                        className={`p-2 rounded text-xs transition-colors ${
                          selectedElement.props.alignment === item.value
                            ? 'bg-purple-600 text-white' 
                            : 'bg-[#2a2a2a] text-gray-400 hover:bg-[#3a3a3a]'
                        }`}
                        title={item.label}
                      >
                        {item.icon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </CollapsibleSection>
            
            <CollapsibleSection title="Estilo" icon={FiDroplet} isOpen={true}>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Color del texto</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={selectedElement.props.color}
                      onChange={(e) => handlePropertyChange('color', e.target.value)}
                      className="w-8 h-8 bg-[#2a2a2a] border border-[#3a3a3a] rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={selectedElement.props.color}
                      onChange={(e) => handlePropertyChange('color', e.target.value)}
                      className="flex-1 px-2 py-1 bg-[#2a2a2a] border border-[#3a3a3a] rounded text-white text-xs font-mono"
                      placeholder="#000000"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Tamaño de fuente</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="8"
                      max="72"
                      value={parseInt(selectedElement.props.fontSize || '16')}
                      onChange={(e) => handlePropertyChange('fontSize', e.target.value + 'px')}
                      className="flex-1 accent-purple-600"
                    />
                    <span className="text-xs text-gray-400 min-w-[40px]">
                      {selectedElement.props.fontSize || '16px'}
                    </span>
                  </div>
                </div>
              </div>
            </CollapsibleSection>
          </>
        )}

        {/* BOTÓN */}
        {selectedElement.type === ELEMENT_TYPES.BUTTON && (
          <>
            <CollapsibleSection title="Contenido" icon={FiType} isOpen={true}>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Texto del botón</label>
                  <input
                    type="text"
                    value={selectedElement.props.text || 'Botón'}
                    onChange={(e) => handlePropertyChange('text', e.target.value)}
                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-3 py-2 text-white text-sm"
                    placeholder="Texto del botón"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">URL (Enlace)</label>
                  <input
                    type="url"
                    value={selectedElement.props.href || '#'}
                    onChange={(e) => handlePropertyChange('href', e.target.value)}
                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-3 py-2 text-white text-xs"
                    placeholder="https://ejemplo.com"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Abrir enlace</label>
                  <select
                    value={selectedElement.props.target || '_self'}
                    onChange={(e) => handlePropertyChange('target', e.target.value)}
                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-3 py-2 text-white text-xs"
                  >
                    <option value="_self">Misma pestaña</option>
                    <option value="_blank">Nueva pestaña</option>
                    <option value="_parent">Ventana padre</option>
                    <option value="_top">Ventana superior</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Tipo de botón</label>
                  <select
                    value={selectedElement.props.buttonType || 'button'}
                    onChange={(e) => handlePropertyChange('buttonType', e.target.value)}
                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-3 py-2 text-white text-xs"
                  >
                    <option value="button">Botón normal</option>
                    <option value="submit">Enviar formulario</option>
                    <option value="reset">Resetear formulario</option>
                  </select>
                </div>
                
                <div>
                  <label className="flex items-center gap-2 text-xs text-gray-400">
                    <input
                      type="checkbox"
                      checked={selectedElement.props.disabled || false}
                      onChange={(e) => handlePropertyChange('disabled', e.target.checked)}
                      className="w-3 h-3 bg-[#2a2a2a] border border-[#3a3a3a] rounded"
                    />
                    Deshabilitado
                  </label>
                </div>
              </div>
            </CollapsibleSection>
            
            <CollapsibleSection title="Estilo" icon={FiDroplet} isOpen={true}>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Color de fondo</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={selectedElement.props.backgroundColor || '#8b5cf6'}
                      onChange={(e) => handlePropertyChange('backgroundColor', e.target.value)}
                      className="w-8 h-8 bg-[#2a2a2a] border border-[#3a3a3a] rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={selectedElement.props.backgroundColor || '#8b5cf6'}
                      onChange={(e) => handlePropertyChange('backgroundColor', e.target.value)}
                      className="flex-1 px-2 py-1 bg-[#2a2a2a] border border-[#3a3a3a] rounded text-white text-xs font-mono"
                      placeholder="#8b5cf6"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Color de texto</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={selectedElement.props.textColor || '#ffffff'}
                      onChange={(e) => handlePropertyChange('textColor', e.target.value)}
                      className="w-8 h-8 bg-[#2a2a2a] border border-[#3a3a3a] rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={selectedElement.props.textColor || '#ffffff'}
                      onChange={(e) => handlePropertyChange('textColor', e.target.value)}
                      className="flex-1 px-2 py-1 bg-[#2a2a2a] border border-[#3a3a3a] rounded text-white text-xs font-mono"
                      placeholder="#ffffff"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Color de fondo (hover)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={selectedElement.props.backgroundColorHover || '#7c3aed'}
                      onChange={(e) => handlePropertyChange('backgroundColorHover', e.target.value)}
                      className="w-8 h-8 bg-[#2a2a2a] border border-[#3a3a3a] rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={selectedElement.props.backgroundColorHover || '#7c3aed'}
                      onChange={(e) => handlePropertyChange('backgroundColorHover', e.target.value)}
                      className="flex-1 px-2 py-1 bg-[#2a2a2a] border border-[#3a3a3a] rounded text-white text-xs font-mono"
                      placeholder="#7c3aed"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Tamaño de fuente</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="8"
                      max="32"
                      value={parseInt(selectedElement.props.fontSize || '16')}
                      onChange={(e) => handlePropertyChange('fontSize', e.target.value + 'px')}
                      className="flex-1 accent-purple-600"
                    />
                    <span className="text-xs text-gray-400 min-w-[40px]">
                      {selectedElement.props.fontSize || '16px'}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Peso de fuente</label>
                  <select
                    value={selectedElement.props.fontWeight || '500'}
                    onChange={(e) => handlePropertyChange('fontWeight', e.target.value)}
                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-3 py-2 text-white text-xs"
                  >
                    <option value="300">Light (300)</option>
                    <option value="400">Regular (400)</option>
                    <option value="500">Medium (500)</option>
                    <option value="600">Semibold (600)</option>
                    <option value="700">Bold (700)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Padding</label>
                  <input
                    type="text"
                    value={selectedElement.props.padding || '12px 24px'}
                    onChange={(e) => handlePropertyChange('padding', e.target.value)}
                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-2 py-1 text-white text-xs"
                    placeholder="12px 24px"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Radio del borde</label>
                  <input
                    type="text"
                    value={selectedElement.props.borderRadius || '8px'}
                    onChange={(e) => handlePropertyChange('borderRadius', e.target.value)}
                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-2 py-1 text-white text-xs"
                    placeholder="8px"
                  />
                </div>
              </div>
            </CollapsibleSection>
          </>
        )}

        {/* IMAGEN */}
        {selectedElement.type === ELEMENT_TYPES.IMAGE && (
          <>
            <CollapsibleSection title="Seleccionar imagen" icon={FiImage} isOpen={true}>
              <div className="space-y-4">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-[#3a3a3a] rounded-lg cursor-pointer bg-[#1a1a1a] hover:bg-[#2a2a2a] transition-colors">
                    <div className="flex flex-col items-center justify-center pt-2 pb-2">
                      <svg className="w-6 h-6 mb-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-xs text-gray-400">Subir imagen</p>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            handlePropertyChange('src', event.target.result);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
                
                <div>
                  <label className="block text-xs text-gray-400 mb-1">O ingresa una URL:</label>
                  <input
                    type="url"
                    value={selectedElement.props.src || ''}
                    onChange={(e) => handlePropertyChange('src', e.target.value)}
                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-2 py-1 text-white text-xs"
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                </div>
                
                <div>
                  <button
                    onClick={() => handlePropertyChange('src', '/images/general-img-landscape.png')}
                    className="w-full bg-[#3a3a3a] hover:bg-[#4a4a4a] text-white px-2 py-1 rounded text-xs transition-colors"
                  >
                    🔄 Usar imagen por defecto
                  </button>
                </div>
              </div>
            </CollapsibleSection>
            
            <CollapsibleSection title="Información" icon={FiType} isOpen={false}>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Texto alternativo (Alt)</label>
                  <input
                    type="text"
                    value={selectedElement.props.alt || ''}
                    onChange={(e) => handlePropertyChange('alt', e.target.value)}
                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-2 py-1 text-white text-xs"
                    placeholder="Descripción de la imagen"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Título (Tooltip)</label>
                  <input
                    type="text"
                    value={selectedElement.props.title || ''}
                    onChange={(e) => handlePropertyChange('title', e.target.value)}
                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-2 py-1 text-white text-xs"
                    placeholder="Tooltip al pasar el mouse"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Etiqueta de accesibilidad</label>
                  <input
                    type="text"
                    value={selectedElement.props.ariaLabel || ''}
                    onChange={(e) => handlePropertyChange('ariaLabel', e.target.value)}
                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-2 py-1 text-white text-xs"
                    placeholder="Descripción detallada"
                  />
                </div>
              </div>
            </CollapsibleSection>
            
            <CollapsibleSection title="Dimensiones" icon={FiMove} isOpen={false}>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Ancho</label>
                  <input
                    type="text"
                    value={selectedElement.props.width || 'auto'}
                    onChange={(e) => handlePropertyChange('width', e.target.value)}
                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-2 py-1 text-white text-xs"
                    placeholder="400px, 100%, auto"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Alto</label>
                  <input
                    type="text"
                    value={selectedElement.props.height || 'auto'}
                    onChange={(e) => handlePropertyChange('height', e.target.value)}
                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-2 py-1 text-white text-xs"
                    placeholder="300px, auto"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Ancho máximo</label>
                  <input
                    type="text"
                    value={selectedElement.props.maxWidth || '100%'}
                    onChange={(e) => handlePropertyChange('maxWidth', e.target.value)}
                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-2 py-1 text-white text-xs"
                    placeholder="100%, 800px, none"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Ajuste de imagen</label>
                  <select
                    value={selectedElement.props.objectFit || 'cover'}
                    onChange={(e) => handlePropertyChange('objectFit', e.target.value)}
                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-2 py-1 text-white text-xs"
                  >
                    <option value="cover">Cubrir (cover)</option>
                    <option value="contain">Contener (contain)</option>
                    <option value="fill">Llenar (fill)</option>
                    <option value="none">Original (none)</option>
                    <option value="scale-down">Escalar hacia abajo</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Posición de imagen</label>
                  <select
                    value={selectedElement.props.objectPosition || 'center'}
                    onChange={(e) => handlePropertyChange('objectPosition', e.target.value)}
                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-2 py-1 text-white text-xs"
                  >
                    <option value="center">Centro</option>
                    <option value="top">Superior</option>
                    <option value="bottom">Inferior</option>
                    <option value="left">Izquierda</option>
                    <option value="right">Derecha</option>
                    <option value="top left">Superior izquierda</option>
                    <option value="top right">Superior derecha</option>
                    <option value="bottom left">Inferior izquierda</option>
                    <option value="bottom right">Inferior derecha</option>
                  </select>
                </div>
                
                <div>
                  <label className="flex items-center gap-2 text-xs text-gray-400">
                    <input
                      type="checkbox"
                      checked={selectedElement.props.responsive || false}
                      onChange={(e) => handlePropertyChange('responsive', e.target.checked)}
                      className="w-3 h-3 bg-[#2a2a2a] border border-[#3a3a3a] rounded"
                    />
                    Imagen responsive
                  </label>
                </div>
              </div>
            </CollapsibleSection>
            
            <CollapsibleSection title="Estilo" icon={FiDroplet} isOpen={false}>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Radio del borde</label>
                  <input
                    type="text"
                    value={selectedElement.props.borderRadius || '0px'}
                    onChange={(e) => handlePropertyChange('borderRadius', e.target.value)}
                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-2 py-1 text-white text-xs"
                    placeholder="8px, 50%, 0px"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Borde</label>
                  <input
                    type="text"
                    value={selectedElement.props.border || 'none'}
                    onChange={(e) => handlePropertyChange('border', e.target.value)}
                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-2 py-1 text-white text-xs font-mono"
                    placeholder="2px solid #8b5cf6"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Sombra</label>
                  <select
                    value={selectedElement.props.boxShadow || 'none'}
                    onChange={(e) => handlePropertyChange('boxShadow', e.target.value)}
                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-2 py-1 text-white text-xs"
                  >
                    <option value="none">Sin sombra</option>
                    <option value="0 2px 4px rgba(0,0,0,0.1)">Sombra ligera</option>
                    <option value="0 4px 8px rgba(0,0,0,0.1)">Sombra media</option>
                    <option value="0 8px 16px rgba(0,0,0,0.1)">Sombra fuerte</option>
                    <option value="0 12px 24px rgba(0,0,0,0.15)">Sombra muy fuerte</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Opacidad</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={selectedElement.props.opacity || '1'}
                      onChange={(e) => handlePropertyChange('opacity', e.target.value)}
                      className="flex-1 accent-purple-600"
                    />
                    <span className="text-xs text-gray-400 min-w-[3rem]">
                      {Math.round((selectedElement.props.opacity || 1) * 100)}%
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Filtros</label>
                  <select
                    value={selectedElement.props.filter || 'none'}
                    onChange={(e) => handlePropertyChange('filter', e.target.value)}
                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-2 py-1 text-white text-xs"
                  >
                    <option value="none">Sin filtro</option>
                    <option value="grayscale(100%)">Escala de grises</option>
                    <option value="sepia(100%)">Sepia</option>
                    <option value="blur(2px)">Desenfoque ligero</option>
                    <option value="brightness(1.2)">Más brillo</option>
                    <option value="contrast(1.2)">Más contraste</option>
                  </select>
                </div>
              </div>
            </CollapsibleSection>
            
            <CollapsibleSection title="Enlaces" icon={FiSettings} isOpen={false}>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">URL del enlace (opcional)</label>
                  <input
                    type="url"
                    value={selectedElement.props.href || ''}
                    onChange={(e) => handlePropertyChange('href', e.target.value)}
                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-2 py-1 text-white text-xs"
                    placeholder="https://ejemplo.com"
                  />
                </div>
                
                {selectedElement.props.href && selectedElement.props.href !== '' && (
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-2">Abrir enlace</label>
                    <select
                      value={selectedElement.props.target || '_self'}
                      onChange={(e) => handlePropertyChange('target', e.target.value)}
                      className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-2 py-1 text-white text-xs"
                    >
                      <option value="_self">Misma pestaña</option>
                      <option value="_blank">Nueva pestaña</option>
                      <option value="_parent">Ventana padre</option>
                      <option value="_top">Ventana superior</option>
                    </select>
                  </div>
                )}
                
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Carga de imagen</label>
                  <select
                    value={selectedElement.props.loading || 'lazy'}
                    onChange={(e) => handlePropertyChange('loading', e.target.value)}
                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-2 py-1 text-white text-xs"
                  >
                    <option value="lazy">Carga diferida (lazy)</option>
                    <option value="eager">Carga inmediata (eager)</option>
                  </select>
                </div>
              </div>
            </CollapsibleSection>
          </>
        )}
        
          </>
        )}
        
        {/* CONTENIDO DE PESTAÑA ESTILO */}
        {activeTab === 'style' && (
          <>
            {/* CONTENEDOR - Estilos */}
            {selectedElement.type === ELEMENT_TYPES.CONTAINER && (
              <>
                <CollapsibleSection title="Fondo" icon={FiDroplet} isOpen={true}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-2">Color de fondo</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={selectedElement.props.backgroundColor === 'transparent' ? '#ffffff' : (selectedElement.props.backgroundColor || '#ffffff')}
                          onChange={(e) => handlePropertyChange('backgroundColor', e.target.value)}
                          className="w-8 h-8 bg-[#2a2a2a] border border-[#3a3a3a] rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={selectedElement.props.backgroundColor || 'transparent'}
                          onChange={(e) => handlePropertyChange('backgroundColor', e.target.value)}
                          className="flex-1 px-2 py-1 bg-[#2a2a2a] border border-[#3a3a3a] rounded text-white text-xs font-mono"
                          placeholder="transparent"
                        />
                      </div>
                    </div>
                  </div>
                </CollapsibleSection>
                
                <CollapsibleSection title="Borde" icon={FiSquare} isOpen={false}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-2">Borde</label>
                      <input
                        type="text"
                        value={selectedElement.props.border || 'none'}
                        onChange={(e) => handlePropertyChange('border', e.target.value)}
                        className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-2 py-1 text-white text-xs font-mono"
                        placeholder="1px solid #ccc"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-2">Radio del borde</label>
                      <input
                        type="text"
                        value={selectedElement.props.borderRadius || '0px'}
                        onChange={(e) => handlePropertyChange('borderRadius', e.target.value)}
                        className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-2 py-1 text-white text-xs"
                        placeholder="8px"
                      />
                    </div>
                  </div>
                </CollapsibleSection>
              </>
            )}
            
            {/* Mensaje para otros elementos */}
            {selectedElement.type !== ELEMENT_TYPES.CONTAINER && (
              <div className="text-center py-8">
                <FiDroplet className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">Propiedades de estilo</p>
                <p className="text-gray-500 text-xs mt-1">para {getElementDisplayName()}</p>
              </div>
            )}
          </>
        )}
        
        {/* CONTENIDO DE PESTAÑA AVANZADO */}
        {activeTab === 'advanced' && (
          <>
            <div className="text-center py-8">
              <FiSettings className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Propiedades avanzadas</p>
              <p className="text-gray-500 text-xs mt-1">Próximamente disponibles</p>
            </div>
          </>
        )}
        
        {/* Ayuda al final */}
        <div className="mt-8 p-3 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-gray-400">¿Necesitas ayuda?</span>
            <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-xs text-gray-500">
            Usa las secciones colapsables para organizar tus propiedades de manera eficiente.
          </p>
        </div>
      </div>
    </div>
  );
}

export default PropertiesPanel;
