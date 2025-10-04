import React, { useState } from 'react';
import { availableElements } from '../config/availableElements.jsx';

// Componente para elementos del panel
function PanelElement({ element, onClick }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      onClick(e);
    }
  };

  const handleDragStart = (e) => {
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'panel-element', element: element }));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      draggable
      onClick={handleClick}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`relative flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#2a2a2a] to-[#252525] rounded-xl text-white hover:from-[#3a3a3a] hover:to-[#353535] transition-all duration-200 min-h-[90px] group cursor-grab active:cursor-grabbing select-none border border-[#404040] hover:border-[#8b5cf6]/50 ${
        isDragging ? 'opacity-50 scale-95' : 'hover:scale-105'
      }`}
    >
      <div className="mb-2 group-hover:scale-110 transition-transform pointer-events-none text-[#8b5cf6]">
        {element.icon}
      </div>
      <span className="text-xs text-center font-medium pointer-events-none group-hover:text-white transition-colors">
        {element.name}
      </span>
      
      {/* Efecto de brillo en hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br from-[#8b5cf6] via-transparent to-[#ec4899] rounded-xl transition-opacity pointer-events-none" />
    </div>
  );
}

// Panel de elementos disponibles
function ElementsPanel({ onAddElement }) {
  const handleElementClick = (element, e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddElement(element);
  };

  return (
    <div className="w-64 bg-gradient-to-b from-[#1a1a1a] to-[#151515] border-r border-[#2a2a2a] p-4 shadow-xl">
      <div className="mb-6">
        <h3 className="text-white font-bold mb-4 text-lg">
          Elementos
        </h3>
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