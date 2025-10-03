/**
 * Text Element Component
 * Elemento de texto con propiedades avanzadas de tipografía
 */

import React, { useState } from 'react';
import { FiType, FiEdit3 } from 'react-icons/fi';

function Text({ 
  isSelected = false,
  onSelect = () => {},
  onDoubleClick = () => {},
  viewportMode,
  // Text specific props
  text = 'Tu texto aquí. Puedes editarlo haciendo clic.',
  color = '#333333',
  fontSize = '16px',
  fontFamily = 'Inter',
  fontWeight = '400',
  lineHeight = '1.5',
  textAlign = 'left',
  textDecoration = 'none',
  fontStyle = 'normal',
  letterSpacing = 'normal',
  textTransform = 'none',
  whiteSpace = 'normal',
  wordBreak = 'normal',
  // Base props
  padding = '0px',
  margin = '0px',
  backgroundColor = 'transparent',
  borderRadius = '0px',
  border = 'none',
  width = 'auto',
  height = 'auto',
  ...otherProps
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingText, setEditingText] = useState(text);

  const computedStyles = {
    color,
    fontSize,
    fontFamily,
    fontWeight,
    lineHeight,
    textAlign,
    textDecoration,
    fontStyle,
    letterSpacing,
    textTransform,
    whiteSpace,
    wordBreak,
    padding,
    margin,
    backgroundColor: backgroundColor === 'transparent' ? 'transparent' : backgroundColor,
    borderRadius,
    border: border === 'none' ? 'none' : border,
    width,
    height: height === 'auto' ? 'auto' : height,
    position: 'relative',
    cursor: isSelected ? 'text' : 'pointer',
    minHeight: '1em',
    outline: 'none',
    ...otherProps.style
  };

  const handleClick = (e) => {
    e.stopPropagation();
    onSelect();
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    if (isSelected) {
      setIsEditing(true);
    }
    onDoubleClick();
  };

  const handleTextChange = (e) => {
    setEditingText(e.target.innerText);
  };

  const handleBlur = () => {
    setIsEditing(false);
    // Here you would typically update the element's text property
    // This would be handled by the parent component
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      setIsEditing(false);
    }
    if (e.key === 'Escape') {
      setEditingText(text);
      setIsEditing(false);
    }
  };

  return (
    <div
      className={`aurelio-text transition-all ${isSelected ? 'aurelio-selected' : ''} hover:outline hover:outline-1 hover:outline-blue-400 hover:outline-dashed`}
      style={computedStyles}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      data-testid="aurelio-text"
    >
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute -top-0.5 -left-0.5 -right-0.5 -bottom-0.5 border-2 border-blue-500 pointer-events-none rounded" />
      )}

      {/* Editable text content */}
      {isEditing ? (
        <div
          contentEditable
          suppressContentEditableWarning
          onInput={handleTextChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="focus:outline-none"
          autoFocus
          dangerouslySetInnerHTML={{ __html: editingText }}
        />
      ) : (
        <div 
          dangerouslySetInnerHTML={{ __html: text }}
          className="select-none"
        />
      )}

      {/* Edit indicator */}
      {isSelected && !isEditing && (
        <div className="absolute top-0 right-0 transform translate-x-1 -translate-y-1">
          <div className="bg-blue-500 text-white p-1 rounded text-xs flex items-center gap-1">
            <FiEdit3 className="w-3 h-3" />
            <span className="text-xs">Doble clic para editar</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Configuración específica del elemento Text
Text.elementConfig = {
  type: 'text',
  name: 'Texto',
  icon: <FiType className="w-5 h-5" />,
  category: 'content',
  description: 'Elemento de texto editable con opciones de tipografía avanzadas',
  tags: ['text', 'typography', 'content', 'paragraph'],
  
  // Propiedades específicas del Text (además de las base)
  properties: {
    text: {
      type: 'textarea',
      label: 'Contenido',
      default: 'Tu texto aquí. Puedes editarlo haciendo clic.',
      required: true,
      category: 'content'
    },
    textDecoration: {
      type: 'select',
      label: 'Decoración',
      default: 'none',
      options: [
        { value: 'none', label: 'Ninguna' },
        { value: 'underline', label: 'Subrayado' },
        { value: 'line-through', label: 'Tachado' },
        { value: 'overline', label: 'Línea superior' }
      ],
      category: 'typography'
    },
    fontStyle: {
      type: 'select',
      label: 'Estilo',
      default: 'normal',
      options: [
        { value: 'normal', label: 'Normal' },
        { value: 'italic', label: 'Cursiva' },
        { value: 'oblique', label: 'Oblicua' }
      ],
      category: 'typography'
    },
    letterSpacing: {
      type: 'spacing',
      label: 'Espaciado de letras',
      default: 'normal',
      units: ['normal', 'px', 'em', 'rem'],
      min: -5,
      max: 20,
      category: 'typography'
    },
    textTransform: {
      type: 'select',
      label: 'Transformación',
      default: 'none',
      options: [
        { value: 'none', label: 'Ninguna' },
        { value: 'uppercase', label: 'MAYÚSCULAS' },
        { value: 'lowercase', label: 'minúsculas' },
        { value: 'capitalize', label: 'Primera Letra' }
      ],
      category: 'typography'
    },
    whiteSpace: {
      type: 'select',
      label: 'Espacios en blanco',
      default: 'normal',
      options: [
        { value: 'normal', label: 'Normal' },
        { value: 'nowrap', label: 'Sin ajuste' },
        { value: 'pre', label: 'Preservar' },
        { value: 'pre-wrap', label: 'Preservar y ajustar' },
        { value: 'pre-line', label: 'Preservar saltos' }
      ],
      category: 'typography'
    },
    wordBreak: {
      type: 'select',
      label: 'Corte de palabras',
      default: 'normal',
      options: [
        { value: 'normal', label: 'Normal' },
        { value: 'break-all', label: 'Cortar todo' },
        { value: 'break-word', label: 'Cortar palabras' },
        { value: 'keep-all', label: 'Mantener todo' }
      ],
      category: 'typography'
    }
  },

  // Props por defecto específicas
  defaultProps: {
    text: 'Tu texto aquí. Puedes editarlo haciendo clic.',
    color: '#333333',
    fontSize: '16px',
    fontFamily: 'Inter',
    fontWeight: '400',
    lineHeight: '1.5',
    textAlign: 'left',
    textDecoration: 'none',
    fontStyle: 'normal',
    letterSpacing: 'normal',
    textTransform: 'none',
    whiteSpace: 'normal',
    wordBreak: 'normal',
    padding: '0px',
    margin: '0px',
    backgroundColor: 'transparent',
    borderRadius: '0px',
    border: 'none',
    width: 'auto',
    height: 'auto'
  }
};

export default Text;