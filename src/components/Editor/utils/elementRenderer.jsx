import React from 'react';
import { ELEMENT_TYPES } from '../../../constants/elementTypes';
import { FiTarget, FiInbox } from 'react-icons/fi';

// Función para renderizar elementos básicos (sin contenedores)
export const renderBasicElement = (element) => {
  switch (element.type) {
    case ELEMENT_TYPES.HEADING:
      return (
        <div
          style={{
            color: element.props.color,
            fontSize: element.props.fontSize,
            textAlign: element.props.alignment,
          }}
        >
          <h1>{element.props.text}</h1>
        </div>
      );
    case ELEMENT_TYPES.TEXT:
      return (
        <div
          style={{
            color: element.props.color,
            fontSize: element.props.fontSize,
            textAlign: element.props.alignment,
          }}
        >
          {element.props.text}
        </div>
      );
    case ELEMENT_TYPES.IMAGE:
      return (
        <img
          src={element.props.src}
          alt={element.props.alt}
          style={{
            width: element.props.width,
            height: element.props.height,
            objectFit: 'cover',
          }}
        />
      );
    case ELEMENT_TYPES.BUTTON:
      return (
        <button
          style={{
            backgroundColor: element.props.backgroundColor,
            color: element.props.textColor,
            padding: element.props.padding,
            borderRadius: element.props.borderRadius,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {element.props.text}
        </button>
      );
    default:
      return <div className="p-4 bg-gray-700 rounded">Elemento: {element.type}</div>;
  }
};

// Componente Container simplificado
export const ContainerElement = ({ 
  element, 
  isSelected, 
  isDragOver, 
  children, 
  onDragOver, 
  onDragLeave, 
  onDrop, 
  onDragEnter, 
  onSelect,
  isNested = false // Nueva prop para indicar si el contenedor está anidado
}) => {
  const hasChildren = element.props.children && element.props.children.length > 0;
  
  // Determinar si el contenedor tiene color personalizado
  const hasCustomColor = element.props.backgroundColor && element.props.backgroundColor !== 'transparent';

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onDragEnter={onDragEnter}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onSelect(element);
      }}
      className={`relative transition-all duration-300 ease-in-out cursor-pointer ${
        isDragOver 
          ? 'shadow-lg transform scale-[1.02]' 
          : 'hover:shadow-md'
      }`}
      style={{
        minHeight: element.props.minHeight || (hasChildren ? '120px' : '200px'),
        padding: element.props.padding || (hasChildren ? '16px' : '48px'),
        backgroundColor: isDragOver ? '#dbeafe' : (element.props.backgroundColor || (isNested && !hasCustomColor ? '#f8fafc' : 'transparent')),
        border: isDragOver ? '3px solid #3b82f6' : (isSelected ? '2px solid #8b5cf6' : (isNested && !hasCustomColor ? '1px dotted #cbd5e1' : element.props.border || 'none')),
        borderRadius: element.props.borderRadius || '0px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: hasChildren ? 'stretch' : 'center',
        justifyContent: hasChildren ? 'flex-start' : 'center',
        cursor: isDragOver ? 'copy' : 'default',
        position: 'relative'
      }}
    >
      {/* Overlay de drop */}
      {isDragOver && (
        <div className="absolute inset-0 z-20 pointer-events-none">
          <div className="absolute inset-0 border-2 border-blue-400 border-dashed rounded-lg opacity-70"></div>
          <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-lg shadow-lg text-xs flex items-center gap-1">
            <FiTarget className="w-3 h-3" />
            Drop
          </div>
          <div className="absolute inset-0 bg-blue-200/10 rounded-lg"></div>
        </div>
      )}
      
      {/* Contenido del contenedor */}
      {hasChildren ? (
        <div className="w-full space-y-2">
          {children}
        </div>
      ) : (
        <div className="text-center w-full h-full flex flex-col items-center justify-center relative z-10">
          {!isDragOver && (
            <>
              <div className="w-16 h-16 rounded-xl bg-gray-200 flex items-center justify-center mb-4">
                <FiInbox className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-600 mb-1">Contenedor Vacío</h3>
              <p className="text-xs text-gray-500">Arrastra cualquier elemento</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};