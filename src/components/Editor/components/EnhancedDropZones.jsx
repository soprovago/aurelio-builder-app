import React from 'react';
import { FiPlus, FiArrowDown, FiArrowRight, FiBox } from 'react-icons/fi';

/**
 * Zona de drop mejorada con animaciones y colores más distintivos
 */
function DropZone({ 
  position, 
  isActive, 
  onDrop, 
  onDragOver, 
  onDragLeave, 
  orientation = 'horizontal',
  size = 'normal',
  className = "" 
}) {
  const sizeClasses = {
    small: 'h-2',
    normal: 'h-4',
    large: 'h-8'
  };

  return (
    <div
      className={`relative transition-all duration-300 ease-out ${
        isActive 
          ? 'scale-105 opacity-100' 
          : 'scale-100 opacity-0 hover:opacity-60'
      } ${sizeClasses[size]} ${className}`}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    >
      {/* Línea principal de drop */}
      <div className={`w-full h-full rounded-full transition-all duration-300 ${
        isActive
          ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-lg shadow-blue-500/50'
          : 'bg-gray-400/50'
      }`} />

      {/* Indicador de posición */}
      {isActive && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white rounded-full p-1 shadow-lg animate-pulse">
            <FiPlus className="w-3 h-3 text-purple-600" />
          </div>
        </div>
      )}

      {/* Efectos de partículas durante el drop activo */}
      {isActive && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-1 top-1/2 w-2 h-2 bg-blue-400 rounded-full animate-ping" />
          <div className="absolute -right-1 top-1/2 w-2 h-2 bg-purple-400 rounded-full animate-ping animation-delay-150" />
          <div className="absolute left-1/2 -top-1 w-2 h-2 bg-pink-400 rounded-full animate-ping animation-delay-300" />
        </div>
      )}
    </div>
  );
}

/**
 * Zona de drop para contenedores con mejor feedback visual
 */
function ContainerDropZone({ 
  isActive, 
  isEmpty, 
  onDrop, 
  onDragOver, 
  onDragLeave, 
  children,
  className = "" 
}) {
  return (
    <div
      className={`relative transition-all duration-300 rounded-lg ${
        isActive
          ? 'bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-dashed border-blue-400 shadow-lg shadow-blue-400/30'
          : isEmpty
          ? 'bg-gray-50 border-2 border-dashed border-gray-300 hover:border-gray-400'
          : 'bg-transparent'
      } ${className}`}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    >
      {/* Contenido del contenedor */}
      <div className={`relative z-10 ${isActive ? 'opacity-90' : 'opacity-100'}`}>
        {children}
      </div>

      {/* Overlay de drop activo */}
      {isActive && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl px-6 py-4 shadow-xl border border-blue-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center animate-bounce">
                <FiBox className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-800">¡Suelta aquí!</p>
                <p className="text-sm text-gray-600">Tu elemento será agregado al contenedor</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Efecto de ondas durante el drag activo */}
      {isActive && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-2 border border-blue-300/50 rounded-lg animate-ping" />
          <div className="absolute inset-4 border border-purple-300/50 rounded-lg animate-ping animation-delay-300" />
        </div>
      )}
    </div>
  );
}

/**
 * Indicador de inserción entre elementos
 */
function InsertionIndicator({ 
  isActive, 
  orientation = 'horizontal', 
  position = 'between',
  className = "" 
}) {
  if (!isActive) return null;

  const orientationClasses = {
    horizontal: 'h-1 w-full',
    vertical: 'w-1 h-full'
  };

  return (
    <div className={`relative ${orientationClasses[orientation]} ${className}`}>
      {/* Línea de inserción */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full animate-pulse shadow-lg shadow-blue-500/50" />
      
      {/* Círculos en los extremos */}
      <div className={`absolute ${
        orientation === 'horizontal' 
          ? '-left-2 top-1/2 transform -translate-y-1/2' 
          : 'left-1/2 -top-2 transform -translate-x-1/2'
      } w-4 h-4 bg-blue-500 rounded-full shadow-lg animate-pulse`} />
      
      <div className={`absolute ${
        orientation === 'horizontal' 
          ? '-right-2 top-1/2 transform -translate-y-1/2' 
          : 'left-1/2 -bottom-2 transform -translate-x-1/2'
      } w-4 h-4 bg-blue-500 rounded-full shadow-lg animate-pulse animation-delay-150`} />
    </div>
  );
}

/**
 * Zona de drop para el canvas principal
 */
function CanvasDropZone({ 
  isActive, 
  isEmpty, 
  onDrop, 
  onDragOver, 
  onDragLeave,
  children,
  className = "" 
}) {
  return (
    <div
      className={`relative min-h-screen transition-all duration-300 ${
        isActive
          ? 'bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50'
          : 'bg-white'
      } ${className}`}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    >
      {/* Contenido del canvas */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Estado vacío con mejor visualización */}
      {isEmpty && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`text-center transition-all duration-300 ${
            isActive
              ? 'transform scale-110 text-blue-600'
              : 'text-gray-500'
          }`}>
            <div className={`w-24 h-24 mx-auto rounded-full border-4 border-dashed flex items-center justify-center mb-6 transition-all duration-300 ${
              isActive
                ? 'border-blue-400 bg-blue-50 shadow-xl shadow-blue-400/30'
                : 'border-gray-300 bg-gray-50'
            }`}>
              {isActive ? (
                <FiPlus className="w-10 h-10 text-blue-500 animate-bounce" />
              ) : (
                <FiBox className="w-10 h-10 text-gray-400" />
              )}
            </div>
            
            <h2 className="text-3xl font-bold mb-4">
              {isActive ? '¡Perfecto! Suelta aquí' : 'Comienza tu diseño'}
            </h2>
            
            <p className="text-lg max-w-md mx-auto leading-relaxed">
              {isActive
                ? 'Tu elemento será agregado al lienzo'
                : 'Arrastra elementos desde el panel lateral para comenzar'}
            </p>

            {/* Animación de ondas durante el drag */}
            {isActive && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-8 border border-blue-300/30 rounded-full animate-ping" />
                <div className="absolute inset-16 border border-purple-300/30 rounded-full animate-ping animation-delay-300" />
                <div className="absolute inset-24 border border-pink-300/30 rounded-full animate-ping animation-delay-500" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export { 
  DropZone, 
  ContainerDropZone, 
  InsertionIndicator, 
  CanvasDropZone 
};

export default DropZone;