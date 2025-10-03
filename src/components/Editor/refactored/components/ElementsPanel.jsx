import React from 'react';
import { availableElements } from '../data/availableElements';
import PanelElement from './PanelElement';

/**
 * Panel lateral que contiene todos los elementos disponibles para arrastrar
 * @param {Function} onAddElement - Handler para agregar elementos al canvas
 */
function ElementsPanel({ onAddElement }) {
  const handleElementClick = (element, e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddElement(element);
  };

  return (
    <div className="w-64 bg-[#1a1a1a] border-r border-[#2a2a2a] p-4">
      <h3 className="text-white font-semibold mb-4">Elementos</h3>
      <div className="text-xs text-gray-400 mb-3">
        Haz clic o arrastra para agregar
      </div>
      <div className="grid grid-cols-2 gap-3">
        {availableElements.map((element) => (
          <div key={element.id} className="relative">
            <PanelElement 
              element={element} 
              onClick={(e) => handleElementClick(element, e)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ElementsPanel;