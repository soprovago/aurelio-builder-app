import React from 'react';

/**
 * Componente para los controles de color sólido
 * Maneja color de fondo y opacidad
 */
function SolidColorControls({ elementProps, onChange }) {
  return (
    <div className="bg-[#1a1a1a] rounded-lg p-3 border border-[#3a3a3a]">
      <div className="space-y-3">
        {/* Color de fondo */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">
            Color de fondo
          </label>
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative flex-shrink-0">
              <div 
                className="w-8 h-8 border-2 border-[#3a3a3a] rounded-md cursor-pointer hover:border-purple-500 transition-colors"
                style={{
                  backgroundColor: elementProps.backgroundColor === 'transparent' ? '#ffffff' : (elementProps.backgroundColor || '#ffffff')
                }}
                onClick={() => document.getElementById('background-color-input').click()}
              />
              <input
                id="background-color-input"
                type="color"
                value={elementProps.backgroundColor === 'transparent' ? '#ffffff' : (elementProps.backgroundColor || '#ffffff')}
                onChange={(e) => onChange('backgroundColor', e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <input
              type="text"
              value={elementProps.backgroundColor || 'transparent'}
              onChange={(e) => onChange('backgroundColor', e.target.value)}
              className="flex-1 min-w-0 px-2.5 py-1.5 bg-[#2a2a2a] border border-[#3a3a3a] rounded-md text-white text-sm font-mono focus:outline-none focus:border-purple-500 transition-colors overflow-hidden"
              placeholder="transparent"
            />
          </div>
        </div>
        
        {/* Control de opacidad del color */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">
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
              className="flex-1 custom-slider progress-gradient"
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