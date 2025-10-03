import React from 'react';
import { VIEWPORT_CONFIGS } from '../../../../constants/viewportConfigs';

/**
 * Selector de modos de viewport (desktop, tablet, mobile)
 * @param {string} currentMode - Modo actual seleccionado
 * @param {Function} onModeChange - Handler para cambio de modo
 */
function ViewportSelector({ currentMode, onModeChange }) {
  return (
    <div className="flex items-center gap-1 bg-[#2a2a2a] rounded-lg p-1">
      {Object.entries(VIEWPORT_CONFIGS).map(([mode, config]) => {
        const IconComponent = config.icon;
        return (
          <button
            key={mode}
            onClick={() => onModeChange(mode)}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              currentMode === mode
                ? 'bg-[#ff1b6d] text-white'
                : 'text-gray-300 hover:bg-[#3a3a3a] hover:text-white'
            }`}
            title={`Vista ${config.name}`}
          >
            <IconComponent className="w-4 h-4" />
          </button>
        );
      })}
    </div>
  );
}

export default ViewportSelector;