import React, { useState } from 'react';

/**
 * Componente para elementos individuales del panel lateral
 * @param {Object} element - Configuración del elemento
 * @param {Function} onClick - Función a ejecutar al hacer clic
 */
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
    console.log('Drag started:', element.name);
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
      className={`flex flex-col items-center justify-center p-4 bg-[#2a2a2a] rounded-lg text-white hover:bg-[#3a3a3a] transition-colors min-h-[80px] group cursor-grab active:cursor-grabbing select-none ${
        isDragging ? 'opacity-50 scale-95' : ''
      }`}
    >
      <div className="mb-2 group-hover:scale-110 transition-transform pointer-events-none">
        {element.icon}
      </div>
      <span className="text-xs text-center font-medium pointer-events-none">
        {element.name}
      </span>
      
      {/* Indicador visual de drag */}
      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-2 h-2 bg-[#8b5cf6] rounded-full" />
      </div>
    </div>
  );
}

export default PanelElement;