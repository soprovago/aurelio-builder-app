/**
 * Button Element Component
 * Elemento de botón con estados, enlaces y estilos avanzados
 */

import React, { useState } from 'react';
import { FiSquare, FiExternalLink, FiEdit3, FiMousePointer } from 'react-icons/fi';

function Button({ 
  isSelected = false,
  onSelect = () => {},
  onDoubleClick = () => {},
  viewportMode,
  // Button specific props
  text = 'Haz Clic Aquí',
  href = '#',
  target = '_self',
  rel = '',
  buttonType = 'button',
  disabled = false,
  // Style props
  backgroundColor = '#8b5cf6',
  textColor = '#ffffff',
  fontSize = '16px',
  fontFamily = 'Inter',
  fontWeight = '500',
  // Base props
  padding = '12px 24px',
  margin = '0px',
  borderRadius = '8px',
  border = 'none',
  width = 'auto',
  height = 'auto',
  // Hover states
  backgroundColorHover = '#7c3aed',
  textColorHover = '#ffffff',
  // Animation
  transition = 'all 0.2s ease',
  ...otherProps
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingText, setEditingText] = useState(text);
  const [isHovered, setIsHovered] = useState(false);

  const computedStyles = {
    backgroundColor: isHovered ? backgroundColorHover : backgroundColor,
    color: isHovered ? textColorHover : textColor,
    fontSize,
    fontFamily,
    fontWeight,
    padding,
    margin,
    borderRadius,
    border: border === 'none' ? 'none' : border,
    width,
    height: height === 'auto' ? 'auto' : height,
    position: 'relative',
    cursor: disabled ? 'not-allowed' : 'pointer',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    outline: 'none',
    transition,
    opacity: disabled ? 0.6 : 1,
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

  const handleButtonClick = (e) => {
    if (isSelected && !isEditing) {
      e.preventDefault();
      return;
    }
    
    // In editor mode, prevent actual navigation
    if (isSelected) {
      e.preventDefault();
    }
  };

  const isExternalLink = href && (href.startsWith('http') || href.startsWith('https'));
  const ButtonTag = href && href !== '#' ? 'a' : 'button';

  const buttonProps = {
    ...computedStyles,
    ...(ButtonTag === 'a' ? {
      href: href !== '#' ? href : undefined,
      target: isExternalLink ? target : undefined,
      rel: isExternalLink ? (rel || 'noopener noreferrer') : undefined
    } : {
      type: buttonType,
      disabled
    })
  };

  return (
    <ButtonTag
      className={`aurelio-button transition-all ${isSelected ? 'aurelio-selected' : ''} hover:outline hover:outline-1 hover:outline-blue-400 hover:outline-dashed`}
      style={computedStyles}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-testid="aurelio-button"
      {...(ButtonTag === 'button' && { onClickCapture: handleButtonClick })}
    >
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute -top-0.5 -left-0.5 -right-0.5 -bottom-0.5 border-2 border-blue-500 pointer-events-none rounded" />
      )}

      {/* Button content */}
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

      {/* External link indicator */}
      {isExternalLink && !isSelected && (
        <FiExternalLink className="w-4 h-4 opacity-75" />
      )}

      {/* Button type indicator when selected */}
      {isSelected && (
        <div className="absolute top-0 left-0 transform -translate-x-1 -translate-y-1">
          <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
            <FiMousePointer className="w-3 h-3" />
            {ButtonTag === 'a' ? 'Link' : 'Button'}
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

      {/* Link info when selected */}
      {isSelected && href && href !== '#' && (
        <div className="absolute bottom-0 left-0 right-0 transform translate-y-full mt-1">
          <div className="bg-black bg-opacity-75 text-white text-xs p-2 rounded max-w-xs truncate">
            <div className="flex items-center gap-1">
              <FiExternalLink className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{href}</span>
            </div>
            {target === '_blank' && (
              <div className="text-xs opacity-75 mt-1">Se abre en nueva pestaña</div>
            )}
          </div>
        </div>
      )}
    </ButtonTag>
  );
}

// Configuración específica del elemento Button
Button.elementConfig = {
  type: 'button',
  name: 'Botón',
  icon: <FiSquare className="w-5 h-5" />,
  category: 'interactive',
  description: 'Botón interactivo con enlaces y estados personalizables',
  tags: ['button', 'link', 'cta', 'action', 'interactive'],
  
  // Propiedades específicas del Button (además de las base)
  properties: {
    text: {
      type: 'text',
      label: 'Texto del botón',
      default: 'Haz Clic Aquí',
      required: true,
      category: 'content'
    },
    href: {
      type: 'text',
      label: 'Enlace (URL)',
      default: '#',
      category: 'link',
      placeholder: 'https://ejemplo.com'
    },
    target: {
      type: 'select',
      label: 'Abrir enlace',
      default: '_self',
      options: [
        { value: '_self', label: 'En la misma pestaña' },
        { value: '_blank', label: 'En nueva pestaña' },
        { value: '_parent', label: 'En ventana padre' },
        { value: '_top', label: 'En ventana superior' }
      ],
      category: 'link'
    },
    rel: {
      type: 'text',
      label: 'Relación (rel)',
      default: '',
      category: 'link',
      placeholder: 'nofollow, sponsored, ugc'
    },
    buttonType: {
      type: 'select',
      label: 'Tipo de botón',
      default: 'button',
      options: [
        { value: 'button', label: 'Botón normal' },
        { value: 'submit', label: 'Enviar formulario' },
        { value: 'reset', label: 'Resetear formulario' }
      ],
      category: 'behavior'
    },
    disabled: {
      type: 'toggle',
      label: 'Deshabilitado',
      default: false,
      category: 'behavior'
    },
    textColor: {
      type: 'color',
      label: 'Color del texto',
      default: '#ffffff',
      category: 'style'
    },
    backgroundColorHover: {
      type: 'color',
      label: 'Color de fondo (hover)',
      default: '#7c3aed',
      category: 'style'
    },
    textColorHover: {
      type: 'color',
      label: 'Color del texto (hover)',
      default: '#ffffff',
      category: 'style'
    },
    transition: {
      type: 'text',
      label: 'Transición CSS',
      default: 'all 0.2s ease',
      category: 'animation'
    }
  },

  // Props por defecto específicas
  defaultProps: {
    text: 'Haz Clic Aquí',
    href: '#',
    target: '_self',
    rel: '',
    buttonType: 'button',
    disabled: false,
    backgroundColor: '#8b5cf6',
    textColor: '#ffffff',
    fontSize: '16px',
    fontFamily: 'Inter',
    fontWeight: '500',
    padding: '12px 24px',
    margin: '0px',
    borderRadius: '8px',
    border: 'none',
    width: 'auto',
    height: 'auto',
    backgroundColorHover: '#7c3aed',
    textColorHover: '#ffffff',
    transition: 'all 0.2s ease'
  }
};

export default Button;