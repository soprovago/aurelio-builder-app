import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  FiColumns, 
  FiGrid, 
  FiLayers, 
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
  FiArrowDown,
  FiArrowRight,
  FiRotateCcw,
  FiMaximize,
  FiMinimize
} from 'react-icons/fi';

/**
 * Controles rápidos simplificados para contenedores
 * Permite cambiar fácilmente el layout sin configuraciones complejas
 */
function QuickLayoutControls({ 
  selectedElement, 
  onUpdateElement, 
  className = "",
  position = "floating", // "floating" | "panel"
  elementRef // Referencia al elemento seleccionado para calcular posición
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [shouldShowBelow, setShouldShowBelow] = useState(false);
  const [elementPosition, setElementPosition] = useState({ top: 0, left: 0, width: 0 });
  const controlsRef = useRef(null);

  // Calcular posición del elemento seleccionado en viewport
  useEffect(() => {
    if (!elementRef?.current || position !== 'floating') return;
    
    const updatePosition = () => {
      const rect = elementRef.current.getBoundingClientRect();
      const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      
      setElementPosition({
        top: rect.top + scrollY,
        left: rect.left + scrollX,
        width: rect.width,
        height: rect.height
      });
      
      // Determinar si mostrar abajo o arriba
      setShouldShowBelow(rect.top < 80);
    };
    
    // Actualizar posición inicial
    updatePosition();
    
    // Actualizar en resize y scroll
    const handleUpdate = () => {
      requestAnimationFrame(updatePosition);
    };
    
    window.addEventListener('resize', handleUpdate);
    window.addEventListener('scroll', handleUpdate, true);
    
    return () => {
      window.removeEventListener('resize', handleUpdate);
      window.removeEventListener('scroll', handleUpdate, true);
    };
  }, [selectedElement, elementRef, position]);

  if (!selectedElement || selectedElement.type !== 'container') {
    return null;
  }

  const props = selectedElement.props || {};

  // Funciones helper para actualizar propiedades
  const updateLayout = (updates) => {
    const updatedElement = {
      ...selectedElement,
      props: {
        ...props,
        ...updates
      }
    };
    onUpdateElement(updatedElement);
  };

  // Presets rápidos de layout
  const layoutPresets = [
    {
      id: 'vertical',
      name: 'Vertical',
      icon: <FiArrowDown className="w-3 h-3" />,
      props: {
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'flex-start'
      }
    },
    {
      id: 'horizontal',
      name: 'Horizontal',
      icon: <FiArrowRight className="w-3 h-3" />,
      props: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
      }
    },
    {
      id: 'grid',
      name: 'Grid',
      icon: <FiGrid className="w-3 h-3" />,
      props: {
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: 'space-between',
        flexWrap: 'wrap'
      }
    },
    {
      id: 'center',
      name: 'Centrado',
      icon: <FiAlignCenter className="w-3 h-3" />,
      props: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }
  ];

  // Controles de alineación
  const alignmentControls = [
    {
      id: 'left',
      icon: <FiAlignLeft className="w-2.5 h-2.5" />,
      title: 'Alinear izquierda',
      props: { alignItems: 'flex-start', justifyContent: 'flex-start' }
    },
    {
      id: 'center',
      icon: <FiAlignCenter className="w-2.5 h-2.5" />,
      title: 'Centrar',
      props: { alignItems: 'center', justifyContent: 'center' }
    },
    {
      id: 'right',
      icon: <FiAlignRight className="w-2.5 h-2.5" />,
      title: 'Alinear derecha',
      props: { alignItems: 'flex-end', justifyContent: 'flex-end' }
    }
  ];

  const currentLayout = layoutPresets.find(preset => 
    preset.props.flexDirection === props.flexDirection &&
    preset.props.alignItems === props.alignItems
  );

  if (position === "panel") {
    // Versión para el panel de propiedades
    return (
      <div className={`bg-[#2a2a2a] rounded-lg p-4 ${className}`}>
        <h4 className="text-white text-sm font-medium mb-3 flex items-center gap-2">
          <FiLayers className="w-4 h-4" />
          Layout Rápido
        </h4>
        
        {/* Presets de layout */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {layoutPresets.map(preset => (
            <button
              key={preset.id}
              onClick={() => updateLayout(preset.props)}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg text-xs transition-all ${
                currentLayout?.id === preset.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-[#3a3a3a] text-gray-300 hover:bg-[#4a4a4a]'
              }`}
              title={preset.name}
            >
              {preset.icon}
              <span>{preset.name}</span>
            </button>
          ))}
        </div>

        {/* Controles de espaciado rápido */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-xs">Espaciado</span>
            <div className="flex gap-1">
              {['8px', '16px', '24px', '32px'].map(gap => (
                <button
                  key={gap}
                  onClick={() => updateLayout({ gap })}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    props.gap === gap
                      ? 'bg-purple-600 text-white'
                      : 'bg-[#3a3a3a] text-gray-300 hover:bg-[#4a4a4a]'
                  }`}
                >
                  {gap}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-xs">Padding</span>
            <div className="flex gap-1">
              {['12px', '20px', '32px', '48px'].map(padding => (
                <button
                  key={padding}
                  onClick={() => updateLayout({ padding })}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    props.padding === padding
                      ? 'bg-purple-600 text-white'
                      : 'bg-[#3a3a3a] text-gray-300 hover:bg-[#4a4a4a]'
                  }`}
                >
                  {padding}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Versión flotante usando portal (overlay sobre el elemento seleccionado)
  const floatingControls = (
    <div 
      ref={controlsRef}
      className="fixed z-[999999] pointer-events-auto"
      style={{
        top: shouldShowBelow ? elementPosition.top + (elementPosition.height || 0) + 4 : elementPosition.top - 52,
        left: elementPosition.left,
        maxWidth: '100vw'
      }}
    >
      <div className="bg-[#1a1a1a]/95 backdrop-blur-sm border border-[#2a2a2a] rounded-lg shadow-xl p-2 flex items-center gap-1.5 animate-scale-in">
        {/* Presets principales */}
        {layoutPresets.slice(0, 3).map(preset => (
          <button
            key={preset.id}
            onClick={() => updateLayout(preset.props)}
            className={`p-1.5 rounded transition-all ${
              currentLayout?.id === preset.id
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-[#2a2a2a] text-gray-300 hover:bg-purple-600 hover:text-white'
            }`}
            title={preset.name}
          >
            {preset.icon}
          </button>
        ))}

        {/* Separador */}
        <div className="w-px h-6 bg-[#3a3a3a]" />

        {/* Controles de alineación rápida */}
        {alignmentControls.map(control => (
          <button
            key={control.id}
            onClick={() => updateLayout(control.props)}
            className="p-1 rounded text-gray-300 hover:bg-purple-600 hover:text-white transition-colors"
            title={control.title}
          >
            {control.icon}
          </button>
        ))}

        {/* Separador */}
        <div className="w-px h-6 bg-[#3a3a3a]" />

        {/* Controles de espaciado rápido */}
        <div className="flex items-center gap-1">
          <FiMinimize className="w-3 h-3 text-gray-400" />
          {['8px', '16px', '24px'].map(gap => (
            <button
              key={gap}
              onClick={() => updateLayout({ gap })}
              className={`px-1.5 py-0.5 text-xs rounded transition-colors ${
                props.gap === gap
                  ? 'bg-purple-600 text-white'
                  : 'bg-[#2a2a2a] text-gray-300 hover:bg-purple-600 hover:text-white'
              }`}
              title={`Gap: ${gap}`}
            >
              {gap.replace('px', '')}
            </button>
          ))}
          <FiMaximize className="w-3 h-3 text-gray-400" />
        </div>

        {/* Botón de configuración avanzada */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="p-1.5 rounded text-gray-300 hover:text-white hover:bg-[#2a2a2a] transition-colors"
          title="Configuración avanzada"
        >
          <FiRotateCcw className="w-3 h-3" />
        </button>
      </div>

      {/* Panel avanzado desplegable */}
      {showAdvanced && (
        <div 
          className="fixed bg-[#1a1a1a]/95 backdrop-blur-sm border border-[#2a2a2a] rounded-xl shadow-xl p-4 min-w-[280px] animate-slide-up z-[999999]"
          style={{
            top: (shouldShowBelow ? elementPosition.top + (elementPosition.height || 0) + 56 : elementPosition.top - 280),
            left: elementPosition.left,
            maxWidth: 'calc(100vw - 20px)',
            maxHeight: 'calc(100vh - 20px)',
            overflow: 'auto'
          }}
        >
          <h5 className="font-medium text-white mb-3 text-sm">Configuración Avanzada</h5>
          
          <div className="space-y-3">
            {/* Flex Wrap */}
            <div>
              <label className="block text-xs text-gray-400 mb-1">Envoltura</label>
              <div className="flex gap-1">
                {['nowrap', 'wrap', 'wrap-reverse'].map(wrap => (
                  <button
                    key={wrap}
                    onClick={() => updateLayout({ flexWrap: wrap })}
                    className={`px-3 py-1 text-xs rounded transition-colors ${
                      props.flexWrap === wrap
                        ? 'bg-purple-600 text-white'
                        : 'bg-[#2a2a2a] text-gray-300 hover:bg-purple-600 hover:text-white'
                    }`}
                  >
                    {wrap}
                  </button>
                ))}
              </div>
            </div>

            {/* Justify Content */}
            <div>
              <label className="block text-xs text-gray-400 mb-1">Distribución</label>
              <div className="grid grid-cols-2 gap-1">
                {[
                  ['flex-start', 'Inicio'],
                  ['center', 'Centro'],
                  ['flex-end', 'Final'],
                  ['space-between', 'Entre'],
                  ['space-around', 'Alrededor'],
                  ['space-evenly', 'Uniforme']
                ].map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => updateLayout({ justifyContent: value })}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      props.justifyContent === value
                        ? 'bg-purple-600 text-white'
                        : 'bg-[#2a2a2a] text-gray-300 hover:bg-purple-600 hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowAdvanced(false)}
            className="mt-3 w-full py-2 text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      )}
    </div>
  );

  // Renderizar usando portal si es versión flotante
  if (position === "floating") {
    return createPortal(floatingControls, document.body);
  }

  // Versión para panel (sin cambios)
  return floatingControls;
}

export default QuickLayoutControls;