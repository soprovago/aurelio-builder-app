import React from 'react';
import { FiGrid, FiType, FiImage, FiSquare } from 'react-icons/fi';
import PanelElement from './PanelElement';
import { availableElements } from '../../../constants/availableElements';

// Mapeo de nombres de iconos a componentes JSX
const iconMap = {
  FiGrid: FiGrid,
  FiType: FiType,
  FiImage: FiImage,
  FiSquare: FiSquare,
};

/**
 * ElementsPanel - Panel lateral de elementos disponibles
 * 
 * Funcionalidades:
 * - Mostrar elementos disponibles en una cuadrícula
 * - Manejar clicks para agregar elementos al canvas
 * - Integrar drag & drop a través de PanelElement
 * - Proporcionar información de uso al usuario
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
        {availableElements.map((element) => {
          const IconComponent = iconMap[element.iconName];
          const elementWithIcon = {
            ...element,
            icon: IconComponent ? <IconComponent className="w-5 h-5" /> : null
          };
          
          return (
            <div key={element.id} className="relative">
              <PanelElement 
                element={elementWithIcon} 
                onClick={(e) => handleElementClick(element, e)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ElementsPanel;