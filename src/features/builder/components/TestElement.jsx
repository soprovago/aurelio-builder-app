import React from 'react';

/**
 * Componente de prueba simple para verificar selección
 */
function TestElement({ element, isSelected, onSelect, children }) {
  const hasChildren = element.type === 'container' && children;
  
  return (
    <div
      className={`p-4 border-2 transition-all ${
        !hasChildren ? 'cursor-pointer' : ''
      } ${
        isSelected 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-300 hover:border-gray-400'
      }`}
      onClick={!hasChildren ? (e) => {
        console.log('🔴 TestElement onClick triggered:', {
          elementId: element.id,
          elementType: element.type,
          target: e.target,
          currentTarget: e.currentTarget,
          onSelectExists: !!onSelect
        });
        e.stopPropagation();
        
        if (onSelect) {
          console.log('✅ Calling onSelect for:', element.id);
          onSelect(element);
        } else {
          console.log('❌ onSelect is null/undefined');
        }
      } : undefined}
    >
      <div className="text-sm font-mono text-gray-600 mb-2">
        {element.type} - {element.id} {isSelected ? '(SELECTED)' : ''}
      </div>
      
      {/* Contenido del elemento */}
      <div className="mb-2">
        {element.type === 'text' && (
          <div>{element.props.text || 'Texto de prueba'}</div>
        )}
        {element.type === 'heading' && (
          <h1>{element.props.text || 'Encabezado de prueba'}</h1>
        )}
        {element.type === 'container' && (
          <div 
            className="bg-gray-100 p-2 rounded"
            onClick={(e) => {
              // Solo seleccionar el contenedor si se hace click en el área vacía
              if (e.target === e.currentTarget) {
                console.log('🟠 Container area clicked, selecting container:', element.id);
                e.stopPropagation();
                onSelect(element);
              }
              // Si se hace click en un hijo, no hacer nada aquí (dejar que el hijo maneje el evento)
            }}
          >
            <div className="text-xs text-gray-500 mb-2">Contenedor:</div>
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

export default TestElement;