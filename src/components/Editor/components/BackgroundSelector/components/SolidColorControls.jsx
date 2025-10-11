import React from 'react';

/**
 * Componente para los controles de color sólido
 * Maneja color de fondo y opacidad
 */
function SolidColorControls({ elementProps, onChange }) {
  return (
    <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#3a3a3a]">
      <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
        <div className="w-3 h-3 rounded bg-gradient-to-r from-red-500 to-blue-500"></div>
        Color Sólido
      </h3>
      
      <div className="space-y-4">
        {/* Color de fondo */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2">
            Color de fondo
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={elementProps.backgroundColor === 'transparent' ? '#ffffff' : (elementProps.backgroundColor || '#ffffff')}
              onChange={(e) => onChange('backgroundColor', e.target.value)}
              className="w-12 h-12 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg cursor-pointer hover:border-purple-500 transition-colors"
            />
            <input
              type="text"
              value={elementProps.backgroundColor || 'transparent'}
              onChange={(e) => onChange('backgroundColor', e.target.value)}
              className="flex-1 px-3 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white text-sm font-mono focus:outline-none focus:border-purple-500 transition-colors"
              placeholder="transparent"
            />
          </div>
        </div>
        
        {/* Control de opacidad del color */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2">
            Opacidad: {Math.round((elementProps.backgroundOpacity || 1) * 100)}%
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={elementProps.backgroundOpacity || 1}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                onChange('backgroundOpacity', value);
              }}
              className="flex-1 h-2 bg-[#2a2a2a] rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${((elementProps.backgroundOpacity || 1) * 100)}%, #2a2a2a ${((elementProps.backgroundOpacity || 1) * 100)}%, #2a2a2a 100%)`,
                WebkitAppearance: 'none',
                outline: 'none'
              }}
            />
            <span className="text-xs text-gray-400 w-12 text-right font-mono">
              {Math.round((elementProps.backgroundOpacity || 1) * 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SolidColorControls;