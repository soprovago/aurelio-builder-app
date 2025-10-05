import React from 'react';
import { FiArrowUp, FiArrowDown, FiArrowLeft, FiArrowRight, FiMove } from 'react-icons/fi';

/**
 * Controles de reordenamiento para elementos dentro de contenedores
 * Permite mover elementos hacia arriba, abajo, izquierda o derecha
 * dependiendo de la dirección del flexbox del contenedor padre
 */
function ContainerReorderControls({ 
  element, 
  parentElement, 
  index, 
  totalElements,
  onReorderInContainer,
  onMoveOutOfContainer,
  className = ""
}) {
  const isFirst = index === 0;
  const isLast = index === totalElements - 1;
  const isHorizontal = parentElement?.props?.flexDirection === 'row' || parentElement?.props?.flexDirection === 'row-reverse';
  const isReverse = parentElement?.props?.flexDirection === 'column-reverse' || parentElement?.props?.flexDirection === 'row-reverse';

  const handleMoveUp = () => {
    if (!isFirst) {
      const newIndex = isReverse ? index + 1 : index - 1;
      onReorderInContainer(element.id, index, newIndex);
    }
  };

  const handleMoveDown = () => {
    if (!isLast) {
      const newIndex = isReverse ? index - 1 : index + 1;
      onReorderInContainer(element.id, index, newIndex);
    }
  };

  const handleMoveOut = () => {
    onMoveOutOfContainer(element.id, parentElement?.id);
  };

  // Iconos dinámicos basados en la dirección del contenedor
  const PreviousIcon = isHorizontal ? 
    (isReverse ? FiArrowRight : FiArrowLeft) : 
    (isReverse ? FiArrowDown : FiArrowUp);
    
  const NextIcon = isHorizontal ? 
    (isReverse ? FiArrowLeft : FiArrowRight) : 
    (isReverse ? FiArrowUp : FiArrowDown);

  return (
    <div className={`flex items-center bg-black/90 backdrop-blur-sm rounded-lg border border-gray-600/50 shadow-lg overflow-hidden ${className}`}>
      {/* Mover hacia atrás */}
      <button
        onClick={handleMoveUp}
        disabled={isFirst}
        className={`p-1.5 transition-all text-xs ${
          isFirst 
            ? 'text-gray-500 cursor-not-allowed' 
            : 'text-blue-400 hover:text-blue-300 hover:bg-blue-500/20'
        }`}
        title={isHorizontal ? (isReverse ? 'Mover a la derecha' : 'Mover a la izquierda') : (isReverse ? 'Mover abajo' : 'Mover arriba')}
      >
        <PreviousIcon className="w-3 h-3" />
      </button>

      {/* Mover hacia adelante */}
      <button
        onClick={handleMoveDown}
        disabled={isLast}
        className={`p-1.5 transition-all text-xs ${
          isLast 
            ? 'text-gray-500 cursor-not-allowed' 
            : 'text-blue-400 hover:text-blue-300 hover:bg-blue-500/20'
        }`}
        title={isHorizontal ? (isReverse ? 'Mover a la izquierda' : 'Mover a la derecha') : (isReverse ? 'Mover arriba' : 'Mover abajo')}
      >
        <NextIcon className="w-3 h-3" />
      </button>

      {/* Separador */}
      <div className="w-px h-6 bg-gray-600/50" />

      {/* Mover fuera del contenedor */}
      <button
        onClick={handleMoveOut}
        className="p-1.5 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/20 transition-all text-xs"
        title="Sacar del contenedor"
      >
        <FiMove className="w-3 h-3" />
      </button>

      {/* Indicador de posición */}
      <div className="px-2 py-1 text-gray-400 text-xs font-mono bg-gray-800/50">
        {index + 1}/{totalElements}
      </div>
    </div>
  );
}

export default ContainerReorderControls;