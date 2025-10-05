import React, { useState } from 'react';
import { 
  FiLayers, 
  FiGrid, 
  FiLayout, 
  FiColumns, 
  FiSidebar,
  FiNavigation,
  FiMonitor,
  FiZap,
  FiSettings
} from 'react-icons/fi';

/**
 * Modo Easy Layout - Simplifica el maquetado con presets visuales
 */
function EasyLayoutMode({ onCreateLayout, isActive, onToggle, className = "" }) {
  const [selectedPreset, setSelectedPreset] = useState(null);

  const layoutPresets = [
    {
      id: 'single-column',
      name: 'Una Columna',
      description: 'Layout simple vertical',
      icon: <FiLayout className="w-6 h-6" />,
      preview: (
        <div className="w-full h-12 bg-gradient-to-r from-blue-200 to-blue-300 rounded border-2 border-blue-400">
          <div className="h-full flex flex-col justify-center items-center text-xs text-blue-700 font-medium">
            Una Columna
          </div>
        </div>
      ),
      layout: {
        type: 'container',
        props: {
          flexDirection: 'column',
          alignItems: 'stretch',
          gap: '20px',
          padding: '40px',
          minHeight: '400px'
        }
      }
    },
    {
      id: 'two-columns',
      name: 'Dos Columnas',
      description: 'Layout de dos columnas iguales',
      icon: <FiColumns className="w-6 h-6" />,
      preview: (
        <div className="w-full h-12 bg-gradient-to-r from-purple-200 to-purple-300 rounded border-2 border-purple-400 flex gap-1 p-1">
          <div className="flex-1 bg-white/80 rounded text-xs text-purple-700 font-medium flex items-center justify-center">50%</div>
          <div className="flex-1 bg-white/80 rounded text-xs text-purple-700 font-medium flex items-center justify-center">50%</div>
        </div>
      ),
      layout: {
        type: 'container',
        props: {
          flexDirection: 'row',
          alignItems: 'stretch',
          justifyContent: 'space-between',
          gap: '24px',
          padding: '40px',
          minHeight: '400px'
        }
      }
    },
    {
      id: 'three-columns',
      name: 'Tres Columnas',
      description: 'Grid de tres columnas',
      icon: <FiGrid className="w-6 h-6" />,
      preview: (
        <div className="w-full h-12 bg-gradient-to-r from-green-200 to-green-300 rounded border-2 border-green-400 flex gap-1 p-1">
          <div className="flex-1 bg-white/80 rounded text-xs text-green-700 font-medium flex items-center justify-center">33%</div>
          <div className="flex-1 bg-white/80 rounded text-xs text-green-700 font-medium flex items-center justify-center">33%</div>
          <div className="flex-1 bg-white/80 rounded text-xs text-green-700 font-medium flex items-center justify-center">33%</div>
        </div>
      ),
      layout: {
        type: 'container',
        props: {
          flexDirection: 'row',
          alignItems: 'stretch',
          justifyContent: 'space-between',
          gap: '20px',
          padding: '40px',
          minHeight: '300px'
        }
      }
    },
    {
      id: 'sidebar-layout',
      name: 'Sidebar + Contenido',
      description: 'Sidebar lateral con contenido principal',
      icon: <FiSidebar className="w-6 h-6" />,
      preview: (
        <div className="w-full h-12 bg-gradient-to-r from-orange-200 to-orange-300 rounded border-2 border-orange-400 flex gap-1 p-1">
          <div className="w-1/3 bg-white/80 rounded text-xs text-orange-700 font-medium flex items-center justify-center">Sidebar</div>
          <div className="flex-1 bg-white/80 rounded text-xs text-orange-700 font-medium flex items-center justify-center">Contenido</div>
        </div>
      ),
      layout: {
        type: 'container',
        props: {
          flexDirection: 'row',
          alignItems: 'stretch',
          gap: '32px',
          padding: '0px 40px 40px 40px',
          minHeight: '500px'
        }
      }
    },
    {
      id: 'header-content-footer',
      name: 'Header + Contenido + Footer',
      description: 'Layout clásico de página web',
      icon: <FiMonitor className="w-6 h-6" />,
      preview: (
        <div className="w-full h-12 bg-gradient-to-r from-pink-200 to-pink-300 rounded border-2 border-pink-400 flex flex-col gap-1 p-1">
          <div className="h-2 bg-white/80 rounded text-xs text-pink-700 font-medium flex items-center justify-center">Header</div>
          <div className="flex-1 bg-white/60 rounded text-xs text-pink-700 font-medium flex items-center justify-center">Content</div>
          <div className="h-2 bg-white/80 rounded text-xs text-pink-700 font-medium flex items-center justify-center">Footer</div>
        </div>
      ),
      layout: {
        type: 'container',
        props: {
          flexDirection: 'column',
          alignItems: 'stretch',
          gap: '0px',
          padding: '0px',
          minHeight: '100vh'
        }
      }
    },
    {
      id: 'hero-sections',
      name: 'Hero + Secciones',
      description: 'Hero grande con secciones de contenido',
      icon: <FiNavigation className="w-6 h-6" />,
      preview: (
        <div className="w-full h-12 bg-gradient-to-r from-indigo-200 to-indigo-300 rounded border-2 border-indigo-400 flex flex-col gap-1 p-1">
          <div className="h-6 bg-white/80 rounded text-xs text-indigo-700 font-medium flex items-center justify-center">Hero</div>
          <div className="flex-1 bg-white/60 rounded text-xs text-indigo-700 font-medium flex items-center justify-center">Secciones</div>
        </div>
      ),
      layout: {
        type: 'container',
        props: {
          flexDirection: 'column',
          alignItems: 'stretch',
          gap: '0px',
          padding: '0px',
          minHeight: '100vh'
        }
      }
    }
  ];

  const handlePresetClick = (preset) => {
    setSelectedPreset(preset.id === selectedPreset ? null : preset.id);
  };

  const handleCreateLayout = (preset) => {
    if (onCreateLayout) {
      onCreateLayout(preset);
    }
    setSelectedPreset(null);
  };

  if (!isActive) {
    return (
      <button
        onClick={onToggle}
        className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl ${className}`}
        title="Activar Modo Easy Layout"
      >
        <FiZap className="w-4 h-4" />
        <span className="text-sm font-medium">Easy Layout</span>
      </button>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden ${className}`}>
      {/* Header del panel */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <FiZap className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">Easy Layout</h3>
            <p className="text-purple-100 text-sm">Crea layouts profesionales al instante</p>
          </div>
        </div>
        <button
          onClick={onToggle}
          className="text-white/80 hover:text-white p-1 rounded transition-colors"
          title="Cerrar Easy Layout"
        >
          <FiSettings className="w-5 h-5" />
        </button>
      </div>

      {/* Grid de presets */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4">
          {layoutPresets.map((preset) => (
            <div
              key={preset.id}
              className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                selectedPreset === preset.id
                  ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-400 shadow-lg'
                  : 'bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-gray-500'
              }`}
              onClick={() => handlePresetClick(preset)}
            >
              {/* Vista previa del layout */}
              <div className="mb-3 h-16 relative">
                {preset.preview}
                
                {/* Overlay con icono */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded flex items-center justify-center">
                  <div className="text-white">
                    {preset.icon}
                  </div>
                </div>
              </div>

              {/* Información del preset */}
              <div className="text-center">
                <h4 className="text-white font-semibold text-sm mb-1">
                  {preset.name}
                </h4>
                <p className="text-gray-400 text-xs leading-tight">
                  {preset.description}
                </p>
              </div>

              {/* Botón de acción (visible cuando está seleccionado) */}
              {selectedPreset === preset.id && (
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCreateLayout(preset);
                    }}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Crear Layout
                  </button>
                </div>
              )}

              {/* Indicador de selección */}
              {selectedPreset === preset.id && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Información adicional */}
        <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <FiLayers className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h5 className="text-white font-medium text-sm mb-1">¿Cómo funciona?</h5>
              <p className="text-gray-400 text-xs leading-relaxed">
                Selecciona un preset de layout y se creará automáticamente en tu canvas. 
                Después puedes personalizar y agregar más elementos fácilmente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EasyLayoutMode;