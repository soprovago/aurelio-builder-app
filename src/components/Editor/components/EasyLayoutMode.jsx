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
  FiX
} from 'react-icons/fi';

/**
 * Modo Easy Layout - Simplifica el maquetado con presets visuales
 */
function EasyLayoutMode({ onCreateLayout, isActive, onToggle, className = "" }) {
  const [selectedPreset, setSelectedPreset] = useState(null);

  // Estructuras básicas de contenedores
  const containerStructures = [
    {
      id: 'single-container',
      name: '1 Contenedor',
      description: 'Contenedor único centrado',
      icon: <FiLayout className="w-6 h-6" />,
      preview: (
        <div className="w-full h-12 bg-gradient-to-r from-purple-200 to-purple-300 rounded border-2 border-purple-400">
          <div className="h-full flex items-center justify-center text-xs text-purple-700 font-medium">
            1 Contenedor
          </div>
        </div>
      ),
      isStructure: true,
      layout: {
        type: 'container',
        props: {
          width: '100%',
          height: 'auto',
          minHeight: '200px',
          backgroundColor: 'transparent',
          borderRadius: '0px',
          border: 'none',
          padding: '40px 20px',
          margin: '0px 0px 20px 0px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '16px',
          children: []
        }
      }
    },
    {
      id: 'double-container', 
      name: '2 Contenedores',
      description: 'Dos contenedores lado a lado',
      icon: <FiColumns className="w-6 h-6" />,
      preview: (
        <div className="w-full h-12 bg-gradient-to-r from-purple-200 to-purple-300 rounded border-2 border-purple-400 flex gap-1 p-1">
          <div className="flex-1 bg-white/80 rounded text-xs text-purple-700 font-medium flex items-center justify-center">50%</div>
          <div className="flex-1 bg-white/80 rounded text-xs text-purple-700 font-medium flex items-center justify-center">50%</div>
        </div>
      ),
      isStructure: true,
      layout: {
        type: 'container',
        props: {
          width: '100%',
          height: 'auto', 
          minHeight: '200px',
          backgroundColor: 'transparent',
          borderRadius: '0px',
          border: 'none',
          padding: '20px',
          margin: '0px 0px 20px 0px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'stretch',
          gap: '20px',
          children: [
            {
              id: `container-left-${Date.now()}`,
              type: 'container',
              props: {
                width: '50%',
                height: 'auto',
                minHeight: '150px',
                backgroundColor: 'transparent',
                borderRadius: '0px',
                border: 'none',
                padding: '30px 15px',
                margin: '0px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '12px',
                children: []
              }
            },
            {
              id: `container-right-${Date.now()}`,
              type: 'container',
              props: {
                width: '50%',
                height: 'auto',
                minHeight: '150px',
                backgroundColor: 'transparent',
                borderRadius: '0px',
                border: 'none',
                padding: '30px 15px',
                margin: '0px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '12px',
                children: []
              }
            }
          ]
        }
      }
    },
    {
      id: 'triple-container',
      name: '3 Contenedores',
      description: 'Tres contenedores lado a lado',
      icon: <FiGrid className="w-6 h-6" />,
      preview: (
        <div className="w-full h-12 bg-gradient-to-r from-purple-200 to-purple-300 rounded border-2 border-purple-400 flex gap-1 p-1">
          <div className="flex-1 bg-white/80 rounded text-xs text-purple-700 font-medium flex items-center justify-center">33%</div>
          <div className="flex-1 bg-white/80 rounded text-xs text-purple-700 font-medium flex items-center justify-center">33%</div>
          <div className="flex-1 bg-white/80 rounded text-xs text-purple-700 font-medium flex items-center justify-center">33%</div>
        </div>
      ),
      isStructure: true,
      layout: {
        type: 'container',
        props: {
          width: '100%',
          height: 'auto',
          minHeight: '200px',
          backgroundColor: 'transparent',
          borderRadius: '0px',
          border: 'none',
          padding: '20px',
          margin: '0px 0px 20px 0px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'stretch',
          gap: '15px',
          children: [
            {
              id: `container-1-${Date.now()}`,
              type: 'container',
              props: {
                width: '33.33%',
                height: 'auto',
                minHeight: '150px',
                backgroundColor: 'transparent',
                borderRadius: '0px',
                border: 'none',
                padding: '25px 10px',
                margin: '0px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
                children: []
              }
            },
            {
              id: `container-2-${Date.now() + 1}`,
              type: 'container',
              props: {
                width: '33.33%',
                height: 'auto',
                minHeight: '150px',
                backgroundColor: 'transparent',
                borderRadius: '0px',
                border: 'none',
                padding: '25px 10px',
                margin: '0px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
                children: []
              }
            },
            {
              id: `container-3-${Date.now() + 2}`,
              type: 'container',
              props: {
                width: '33.33%',
                height: 'auto',
                minHeight: '150px',
                backgroundColor: 'transparent',
                borderRadius: '0px',
                border: 'none',
                padding: '25px 10px',
                margin: '0px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
                children: []
              }
            }
          ]
        }
      }
    }
  ];

  const layoutPresets = [
    {
      id: 'hero-container',
      name: 'Contenedor Hero',
      description: 'Contenedor principal para sección hero',
      icon: <FiLayout className="w-6 h-6" />,
      preview: (
        <div className="w-full h-12 bg-gradient-to-r from-blue-200 to-blue-300 rounded border-2 border-blue-400 flex items-center justify-center">
          <div className="text-xs text-blue-700 font-medium">
            Hero
          </div>
        </div>
      ),
      layout: {
        type: 'container',
        props: {
          width: '100%',
          height: 'auto',
          minHeight: '400px',
          backgroundColor: 'transparent',
          borderRadius: '0px',
          border: 'none',
          padding: '80px 40px',
          margin: '0px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '24px',
          children: []
        }
      }
    },
    {
      id: 'content-container',
      name: 'Contenedor de Contenido',
      description: 'Contenedor para texto y contenido general',
      icon: <FiLayout className="w-6 h-6" />,
      preview: (
        <div className="w-full h-12 bg-gradient-to-r from-purple-200 to-purple-300 rounded border-2 border-purple-400 flex items-center justify-center">
          <div className="text-xs text-purple-700 font-medium">
            Contenido
          </div>
        </div>
      ),
      layout: {
        type: 'container',
        props: {
          width: '100%',
          height: 'auto',
          minHeight: '300px',
          backgroundColor: 'transparent',
          borderRadius: '0px',
          border: 'none',
          padding: '60px 40px',
          margin: '0px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'stretch',
          gap: '20px',
          children: []
        }
      }
    },
    {
      id: 'card-container',
      name: 'Contenedor Tarjeta',
      description: 'Contenedor estilo tarjeta con borde y sombra',
      icon: <FiLayout className="w-6 h-6" />,
      preview: (
        <div className="w-full h-12 bg-gradient-to-r from-green-200 to-green-300 rounded border-2 border-green-400 flex items-center justify-center">
          <div className="text-xs text-green-700 font-medium">
            Tarjeta
          </div>
        </div>
      ),
      layout: {
        type: 'container',
        props: {
          width: '100%',
          height: 'auto',
          minHeight: '250px',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          padding: '32px',
          margin: '20px 0px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'stretch',
          gap: '16px',
          children: []
        }
      }
    },
    {
      id: 'section-container',
      name: 'Contenedor Sección',
      description: 'Contenedor para secciones de página',
      icon: <FiLayout className="w-6 h-6" />,
      preview: (
        <div className="w-full h-12 bg-gradient-to-r from-orange-200 to-orange-300 rounded border-2 border-orange-400 flex items-center justify-center">
          <div className="text-xs text-orange-700 font-medium">Sección</div>
        </div>
      ),
      layout: {
        type: 'container',
        props: {
          width: '100%',
          height: 'auto',
          minHeight: '350px',
          backgroundColor: 'transparent',
          borderRadius: '0px',
          border: 'none',
          padding: '60px 20px',
          margin: '40px 0px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '20px',
          children: []
        }
      }
    },
    {
      id: 'full-width-container',
      name: 'Contenedor Ancho Completo',
      description: 'Contenedor que ocupa todo el ancho disponible',
      icon: <FiMonitor className="w-6 h-6" />,
      preview: (
        <div className="w-full h-12 bg-gradient-to-r from-indigo-200 to-indigo-300 rounded border-2 border-indigo-400 flex items-center justify-center">
          <div className="text-xs text-indigo-700 font-medium">Ancho Completo</div>
        </div>
      ),
      layout: {
        type: 'container',
        props: {
          width: '100%',
          height: 'auto',
          minHeight: '200px',
          backgroundColor: 'transparent',
          borderRadius: '0px',
          border: 'none',
          padding: '40px 0px',
          margin: '0px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'stretch',
          gap: '16px',
          children: []
        }
      }
    },
    {
      id: 'centered-container',
      name: 'Contenedor Centrado',
      description: 'Contenedor centrado con ancho limitado',
      icon: <FiNavigation className="w-6 h-6" />,
      preview: (
        <div className="w-full h-12 bg-gradient-to-r from-pink-200 to-pink-300 rounded border-2 border-pink-400 flex items-center justify-center">
          <div className="w-8 h-8 bg-white/80 rounded text-xs text-pink-700 font-medium flex items-center justify-center">Centro</div>
        </div>
      ),
      layout: {
        type: 'container',
        props: {
          width: '100%',
          height: 'auto',
          minHeight: '300px',
          backgroundColor: 'transparent',
          borderRadius: '0px',
          border: 'none',
          padding: '60px 40px',
          margin: '0px auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '20px',
          maxWidth: '800px',
          children: []
        }
      }
    }
  ];

  const handlePresetClick = (preset) => {
    setSelectedPreset(preset.id === selectedPreset ? null : preset.id);
  };

  // Función para generar IDs únicos
  const generateUniqueId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Función para clonar y regenerar IDs de estructura recursivamente
  const cloneStructureWithNewIds = (structure) => {
    const cloned = {
      ...structure,
      id: generateUniqueId()
    };
    
    if (structure.props?.children) {
      cloned.props = {
        ...structure.props,
        children: structure.props.children.map(child => cloneStructureWithNewIds(child))
      };
    }
    
    return cloned;
  };

  const handleCreateLayout = (preset) => {
    if (onCreateLayout) {
      if (preset.isStructure) {
        // Para estructuras de contenedores, crear el elemento completo con IDs únicos
        const structureElement = cloneStructureWithNewIds(preset.layout);
        onCreateLayout({ layout: structureElement });
      } else {
        // Para presets normales, usar el comportamiento existente
        onCreateLayout(preset);
      }
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
    <div className={`bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl shadow-2xl overflow-hidden ${className}`}>
      {/* Header del panel */}
      <div className="bg-gradient-to-r from-[#8b5cf6] to-[#ff1b6d] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <FiZap className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">Easy Layout</h3>
            <p className="text-white/80 text-sm">Crea layouts profesionales al instante</p>
          </div>
        </div>
        <button
          onClick={onToggle}
          className="text-white/80 hover:text-white p-1 rounded transition-colors"
          title="Cerrar Easy Layout"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>

      {/* Grid de presets */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4">
          {/* Primero las estructuras de contenedores */}
          {containerStructures.map((preset) => (
            <div
              key={preset.id}
              className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                selectedPreset === preset.id
                  ? 'bg-[#8b5cf6]/10 border-2 border-[#8b5cf6] shadow-lg'
                  : 'bg-[#2a2a2a] hover:bg-[#3a3a3a] border border-[#404040] hover:border-[#8b5cf6]/50'
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
                <h4 className="text-[#e4e4e7] font-semibold text-sm mb-1">
                  {preset.name}
                </h4>
                <p className="text-[#9ca3af] text-xs leading-tight">
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
                    Crear {preset.isStructure ? 'Estructura' : 'Layout'}
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
          
          {/* Luego los presets de layout */}
          {layoutPresets.map((preset) => (
            <div
              key={preset.id}
              className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                selectedPreset === preset.id
                  ? 'bg-[#8b5cf6]/10 border-2 border-[#8b5cf6] shadow-lg'
                  : 'bg-[#2a2a2a] hover:bg-[#3a3a3a] border border-[#404040] hover:border-[#8b5cf6]/50'
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
                <h4 className="text-[#e4e4e7] font-semibold text-sm mb-1">
                  {preset.name}
                </h4>
                <p className="text-[#9ca3af] text-xs leading-tight">
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
        <div className="mt-6 p-4 bg-[#2a2a2a] rounded-lg border border-[#404040]">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <FiLayers className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h5 className="text-[#e4e4e7] font-medium text-sm mb-1">¿Cómo funciona?</h5>
              <p className="text-[#9ca3af] text-xs leading-relaxed">
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