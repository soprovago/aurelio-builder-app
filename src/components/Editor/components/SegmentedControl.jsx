import React from 'react';

/**
 * 🎛️ SegmentedControl - Componente reutilizable
 * 
 * Un control de selección moderno tipo iOS/macOS que se puede usar
 * en cualquier parte de la aplicación para mantener consistencia visual.
 * 
 * Características:
 * - Indicador deslizante animado
 * - Ancho completo con distribución equitativa
 * - Iconos personalizables
 * - Estados de hover y active
 * - Accesible con tooltips
 */
function SegmentedControl({
  options = [],
  activeValue,
  onChange,
  className = ""
}) {
  const activeIndex = options.findIndex(option => option.value === activeValue);
  
  return (
    <div className={`relative flex bg-[#1a1a1a] rounded-lg p-1 border border-[#3a3a3a] mb-6 ${className}`}>
      {/* Indicador deslizante */}
      <div 
        className="absolute top-1 left-1 h-10 bg-purple-500 rounded-md transition-all duration-200 ease-out shadow-sm"
        style={{
          width: `calc(${100 / options.length}% - 0.125rem)`,
          transform: `translateX(${activeIndex * 100}%)`
        }}
      />
      
      {options.map((option, index) => {
        const Icon = option.icon;
        const isActive = activeValue === option.value;
        
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`relative z-10 flex items-center justify-center flex-1 h-10 transition-colors duration-200 ${
              isActive
                ? 'text-white' 
                : 'text-gray-400 hover:text-gray-200'
            }`}
            title={option.description || option.name}
          >
            {/* Renderizar icono según su tipo */}
            {typeof Icon === 'function' && option.customIcon ? (
              <Icon />
            ) : Icon ? (
              <Icon className="w-4 h-4" />
            ) : (
              <span className="text-xs font-medium">{option.name}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default SegmentedControl;