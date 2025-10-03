/**
 * Heading Element Component
 * Elemento de encabezado con niveles H1-H6 y propiedades específicas
 */

import React, { useState } from 'react';
import { FiType, FiEdit3 } from 'react-icons/fi';

function Heading({ 
  isSelected = false,
  onSelect = () => {},
  onDoubleClick = () => {},
  viewportMode,
  // Heading specific props
  text = 'Tu Encabezado Aquí',
  level = 1,
  color = '#000000',
  fontSize = '32px',
  fontFamily = 'Inter',
  fontWeight = '600',
  lineHeight = '1.2',
  textAlign = 'left',
  textDecoration = 'none',
  fontStyle = 'normal',
  letterSpacing = 'normal',
  textTransform = 'none',
  // Base props
  padding = '0px',
  margin = '0px 0px 16px 0px',
  backgroundColor = 'transparent',
  borderRadius = '0px',
  border = 'none',
  width = 'auto',
  height = 'auto',
  ...otherProps
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingText, setEditingText] = useState(text);

  // Tamaños por defecto según el nivel del heading
  const defaultFontSizes = {
    1: '32px',
    2: '24px', 
    3: '20px',
    4: '18px',
    5: '16px',
    6: '14px'
  };

  const defaultFontWeights = {
    1: '700',
    2: '600',
    3: '600',
    4: '500',
    5: '500',
    6: '500'
  };

  const computedStyles = {
    color,
    fontSize: fontSize || defaultFontSizes[level],
    fontFamily,
    fontWeight: fontWeight || defaultFontWeights[level],
    lineHeight,
    textAlign,
    textDecoration,
    fontStyle,
    letterSpacing,
    textTransform,
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

  // Crear el elemento heading dinámicamente según el nivel
  const HeadingTag = `h${level}`;

  return (
    <HeadingTag
      className={`aurelio-heading transition-all ${isSelected ? 'aurelio-selected' : ''} hover:outline hover:outline-1 hover:outline-blue-400 hover:outline-dashed`}
      style={computedStyles}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      data-testid="aurelio-heading"
      data-level={level}
    >
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute -top-0.5 -left-0.5 -right-0.5 -bottom-0.5 border-2 border-blue-500 pointer-events-none rounded" />
      )}

      {/* Editable heading content */}
      {isEditing ? (
        <span
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
        <span 
          dangerouslySetInnerHTML={{ __html: text }}
          className="select-none"
        />
      )}

      {/* Level indicator */}
      {isSelected && (
        <div className="absolute top-0 left-0 transform -translate-x-1 -translate-y-1">
          <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
            H{level}
          </div>
        </div>
      )}

      {/* Edit indicator */}
      {isSelected && !isEditing && (
        <div className="absolute top-0 right-0 transform translate-x-1 -translate-y-1">
          <div className="bg-blue-500 text-white p-1 rounded text-xs flex items-center gap-1">
            <FiEdit3 className="w-3 h-3" />
            <span className="text-xs">Doble clic</span>
          </div>
        </div>
      )}
    </HeadingTag>
  );
}

// Configuración específica del elemento Heading
Heading.elementConfig = {
  type: 'heading',
  name: 'Encabezado',
  icon: <FiType className="w-5 h-5" />,
  category: 'content',
  description: 'Encabezados H1-H6 para títulos y subtítulos',
  tags: ['heading', 'title', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'typography'],
  
  // Propiedades específicas del Heading (además de las base)
  properties: {
    text: {
      type: 'text',
      label: 'Texto del encabezado',
      default: 'Tu Encabezado Aquí',
      required: true,
      category: 'content'
    },
    level: {
      type: 'select',
      label: 'Nivel de encabezado',
      default: 1,
      options: [
        { value: 1, label: 'H1 - Título principal' },
        { value: 2, label: 'H2 - Subtítulo' },
        { value: 3, label: 'H3 - Sección' },
        { value: 4, label: 'H4 - Subsección' },
        { value: 5, label: 'H5 - Texto destacado' },
        { value: 6, label: 'H6 - Texto pequeño' }
      ],
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
    }
  },

  // Props por defecto específicas
  defaultProps: {
    text: 'Tu Encabezado Aquí',
    level: 1,
    color: '#000000',
    fontSize: '32px',
    fontFamily: 'Inter',
    fontWeight: '600',
    lineHeight: '1.2',
    textAlign: 'left',
    textDecoration: 'none',
    fontStyle: 'normal',
    letterSpacing: 'normal',
    textTransform: 'none',
    padding: '0px',
    margin: '0px 0px 16px 0px',
    backgroundColor: 'transparent',
    borderRadius: '0px',
    border: 'none',
    width: 'auto',
    height: 'auto'
  }
};

export default Heading;