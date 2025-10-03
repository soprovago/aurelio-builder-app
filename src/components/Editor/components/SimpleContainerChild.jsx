import React, { useState } from 'react';
import { ELEMENT_TYPES } from '../../../constants/elementTypes';
import { FiGrid, FiMoreVertical, FiCopy, FiTrash2, FiMove } from 'react-icons/fi';

/**
 * Componente SUPER SIMPLE para elementos dentro de contenedores
 * Solo se enfoca en funcionalidad básica de drag & drop
 */
function SimpleContainerChild({ 
  element, 
  onSelect, 
  onDelete, 
  onDuplicate, 
  isSelected, 
  onAddToContainer, 
  onMoveToContainer, 
  selectedElement, 
  parentElement
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Manejo de drag start - SUPER SIMPLE
  const handleDragStart = (e) => {
    console.log('🚀 SimpleChild drag start:', element.id);
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', JSON.stringify({ 
      type: 'canvas-element', 
      id: element.id,
      parentId: parentElement?.id 
    }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    console.log('🏁 SimpleChild drag end:', element.id);
    setIsDragging(false);
  };

  const renderSimpleElement = () => {
    if (element.type === ELEMENT_TYPES.CONTAINER) {
      return (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
            console.log('📦 Drag over nested container:', element.id);
          }}
          onDragLeave={() => {
            setIsDragOver(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOver(false);
            
            console.log('🎯 Drop on nested container:', element.id);
            
            try {
              const data = JSON.parse(e.dataTransfer.getData('text/plain'));
              console.log('📦 Drop data:', data);
              
              if (data.type === 'panel-element' && onAddToContainer) {
                console.log('✅ Adding to nested container');
                onAddToContainer(element.id, data.element);
              } else if (data.type === 'canvas-element' && onMoveToContainer) {
                console.log('✅ Moving to nested container');
                onMoveToContainer(data.id, element.id);
              }
            } catch (error) {
              console.error('❌ Drop error:', error);
            }
          }}
          style={{
            minHeight: '100px',
            padding: '20px',
            border: isDragOver ? '2px dashed #8b5cf6' : '1px dashed #d1d5db',
            borderRadius: '8px',
            backgroundColor: isDragOver ? '#f3f4f6' : 'transparent',
          }}
        >
          {element.props.children && element.props.children.length > 0 ? (
            element.props.children.map((child) => (
              <SimpleContainerChild
                key={child.id}
                element={child}
                onSelect={onSelect}
                onDelete={onDelete}
                onDuplicate={onDuplicate}
                isSelected={selectedElement?.id === child.id}
                onAddToContainer={onAddToContainer}
                onMoveToContainer={onMoveToContainer}
                selectedElement={selectedElement}
                parentElement={element}
              />
            ))
          ) : (
            <div className="text-center text-gray-400 py-4">
              <FiGrid className="w-6 h-6 mx-auto mb-2" />
              <p className="text-sm">
                {isDragOver ? 'Suelta aquí' : 'Contenedor anidado vacío'}
              </p>
            </div>
          )}
        </div>
      );
    }

    // Para otros tipos de elementos (texto, imagen, botón)
    return (
      <div style={{ padding: '10px', border: '1px solid #e5e5e5', borderRadius: '4px', marginBottom: '8px' }}>
        {element.type === ELEMENT_TYPES.HEADING && (
          <h1 style={{ color: element.props.color, fontSize: element.props.fontSize }}>
            {element.props.text}
          </h1>
        )}
        {element.type === ELEMENT_TYPES.TEXT && (
          <p style={{ color: element.props.color, fontSize: element.props.fontSize }}>
            {element.props.text}
          </p>
        )}
        {element.type === ELEMENT_TYPES.IMAGE && (
          <img 
            src={element.props.src} 
            alt={element.props.alt} 
            style={{ width: element.props.width, height: element.props.height, objectFit: 'cover' }}
          />
        )}
        {element.type === ELEMENT_TYPES.BUTTON && (
          <button 
            style={{ 
              backgroundColor: element.props.backgroundColor, 
              color: element.props.textColor, 
              padding: element.props.padding,
              borderRadius: element.props.borderRadius,
              border: 'none'
            }}
          >
            {element.props.text}
          </button>
        )}
      </div>
    );
  };

  return (
    <div
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`relative group ${isSelected ? 'ring-2 ring-blue-500' : ''} ${isDragging ? 'opacity-50' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(element);
      }}
      style={{ cursor: 'grab' }}
    >
      {renderSimpleElement()}
      
      {/* Indicador de drag */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <FiMove className="w-4 h-4 text-gray-600" />
      </div>
      
      {/* Menú simple */}
      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen(!isMenuOpen);
          }}
          className="p-1 bg-gray-700 text-white rounded text-xs"
        >
          <FiMoreVertical className="w-3 h-3" />
        </button>
        
        {isMenuOpen && (
          <div className="absolute top-full left-0 mt-1 bg-white border rounded shadow-lg z-50">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate(element, parentElement.id);
                setIsMenuOpen(false);
              }}
              className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
            >
              Duplicar
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(element.id, parentElement.id);
                setIsMenuOpen(false);
              }}
              className="block w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
            >
              Eliminar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SimpleContainerChild;