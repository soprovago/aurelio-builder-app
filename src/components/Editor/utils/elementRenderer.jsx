import React from 'react';
import { ELEMENT_TYPES } from '../../../constants/elementTypes';
import { FiTarget, FiInbox } from 'react-icons/fi';
import { getFontFamily } from '../../../services/googleFonts';

// Función para renderizar elementos básicos (sin contenedores)
export const renderBasicElement = (element) => {
  switch (element.type) {
    case ELEMENT_TYPES.HEADING:
      return (
        <div
          style={{
            color: element.props.color,
            fontSize: element.props.fontSize,
            fontFamily: getFontFamily(element.props.fontFamily || 'default'),
            fontWeight: element.props.fontWeight,
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
            fontFamily: getFontFamily(element.props.fontFamily || 'default'),
            fontWeight: element.props.fontWeight,
            textAlign: element.props.alignment,
          }}
        >
          {element.props.text}
        </div>
      );
    case ELEMENT_TYPES.IMAGE:
      const handleImageError = (e) => {
        // Fallback a placeholder si la imagen falla
        e.target.src = 'https://via.placeholder.com/400x300/8b5cf6/ffffff?text=Error+Cargando+Imagen';
      };

      const handleImageClick = (e) => {
        // En modo editor, prevenir navegación si es un enlace
        if (element.props.href && element.props.href !== '') {
          e.preventDefault();
          console.log(`Imagen clickeada - Navegaría a: ${element.props.href}`);
        }
      };

      const imageStyles = {
        width: element.props.width || 'auto',
        height: element.props.height || 'auto',
        maxWidth: element.props.maxWidth || '100%',
        minWidth: element.props.minWidth || 'auto',
        maxHeight: element.props.maxHeight || 'auto',
        minHeight: element.props.minHeight || 'auto',
        objectFit: element.props.objectFit || 'cover',
        objectPosition: element.props.objectPosition || 'center',
        borderRadius: element.props.borderRadius || '0px',
        border: element.props.border || 'none',
        boxShadow: element.props.boxShadow || 'none',
        opacity: element.props.opacity || '1',
        filter: element.props.filter || 'none',
        transform: element.props.transform || 'none',
        cursor: element.props.href ? 'pointer' : (element.props.cursor || 'default'),
        transition: 'all 0.2s ease',
        margin: element.props.margin || '0px',
        padding: element.props.padding || '0px',
        backgroundColor: element.props.backgroundColor || 'transparent',
        display: 'block',
        // Responsive
        ...(element.props.responsive && {
          width: '100%',
          height: 'auto'
        })
      };

      const commonProps = {
        src: element.props.src || 'https://via.placeholder.com/400x300/8b5cf6/ffffff?text=Imagen',
        alt: element.props.alt || 'Imagen',
        title: element.props.title || '',
        loading: element.props.loading || 'lazy',
        style: imageStyles,
        onClick: handleImageClick,
        onError: handleImageError,
        // Accesibilidad
        role: element.props.role || '',
        'aria-label': element.props.ariaLabel || element.props.alt || 'Imagen'
      };

      let imageElement;
      
      if (element.props.href && element.props.href !== '') {
        // Renderizar como enlace con imagen
        const isExternalLink = element.props.href.startsWith('http') || element.props.href.startsWith('https');
        
        imageElement = (
          <a
            href={element.props.href}
            target={isExternalLink ? (element.props.target || '_blank') : (element.props.target || '_self')}
            rel={isExternalLink ? (element.props.rel || 'noopener noreferrer') : element.props.rel}
            style={{
              display: 'inline-block',
              lineHeight: 0, // Elimina espacios en blanco debajo de la imagen
              ...(element.props.alignSelf && { alignSelf: element.props.alignSelf })
            }}
            onClick={handleImageClick}
          >
            <img {...commonProps} />
          </a>
        );
      } else {
        // Renderizar imagen simple
        imageElement = (
          <img 
            {...commonProps}
            style={{
              ...imageStyles,
              ...(element.props.alignSelf && { alignSelf: element.props.alignSelf })
            }}
          />
        );
      }
      
      // Si la imagen tiene alignSelf: center, envolverla en un div centrado
      if (element.props.alignSelf === 'center') {
        return (
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            {imageElement}
          </div>
        );
      }
      
      return imageElement;
    case ELEMENT_TYPES.BUTTON:
      const handleButtonClick = (e) => {
        // En modo editor, prevenir navegación real
        if (element.props.href && element.props.href !== '#') {
          e.preventDefault();
          console.log(`Botón clickeado - Navegaría a: ${element.props.href}`);
          // En producción, aquí sería window.open() o window.location
        }
      };

      const buttonStyles = {
        backgroundColor: element.props.backgroundColor || '#8b5cf6',
        color: element.props.textColor || '#ffffff',
        padding: element.props.padding || '12px 24px',
        borderRadius: element.props.borderRadius || '8px',
        border: element.props.border || 'none',
        cursor: element.props.disabled ? 'not-allowed' : 'pointer',
        fontSize: element.props.fontSize || '16px',
        fontWeight: element.props.fontWeight || '500',
        fontFamily: element.props.fontFamily || 'Inter, sans-serif',
        transition: element.props.transition || 'all 0.2s ease',
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        outline: 'none',
        opacity: element.props.disabled ? 0.6 : 1,
        transform: 'translateZ(0)', // Optimización de hardware
        ...(element.props.width && element.props.width !== 'auto' && { width: element.props.width }),
        ...(element.props.height && element.props.height !== 'auto' && { height: element.props.height }),
      };

      const hoverStyles = {
        backgroundColor: element.props.backgroundColorHover || '#7c3aed',
        color: element.props.textColorHover || '#ffffff',
      };

      // Determinar el tipo de elemento (button o link)
      const isLink = element.props.href && element.props.href !== '#';
      const isExternalLink = isLink && (element.props.href.startsWith('http') || element.props.href.startsWith('https'));
      
      const buttonProps = {
        style: buttonStyles,
        onClick: handleButtonClick,
        onMouseEnter: (e) => {
          if (!element.props.disabled) {
            Object.assign(e.target.style, hoverStyles);
          }
        },
        onMouseLeave: (e) => {
          if (!element.props.disabled) {
            e.target.style.backgroundColor = buttonStyles.backgroundColor;
            e.target.style.color = buttonStyles.color;
          }
        },
        onFocus: (e) => {
          if (!element.props.disabled) {
            e.target.style.outline = '2px solid #8b5cf6';
            e.target.style.outlineOffset = '2px';
          }
        },
        onBlur: (e) => {
          e.target.style.outline = 'none';
        },
        // Atributos de accesibilidad
        'aria-label': element.props.ariaLabel || element.props.text,
        'aria-disabled': element.props.disabled || false,
        tabIndex: element.props.disabled ? -1 : 0,
      };

      let buttonElement;
      
      if (isLink) {
        // Renderizar como enlace
        buttonElement = (
          <a
            href={element.props.href}
            target={isExternalLink ? (element.props.target || '_blank') : (element.props.target || '_self')}
            rel={isExternalLink ? (element.props.rel || 'noopener noreferrer') : element.props.rel}
            {...buttonProps}
            role="button"
          >
            {element.props.text}
            {isExternalLink && (
              <span style={{ marginLeft: '4px', fontSize: '0.8em' }}>↗</span>
            )}
          </a>
        );
      } else {
        // Renderizar como botón
        buttonElement = (
          <button
            type={element.props.buttonType || 'button'}
            disabled={element.props.disabled || false}
            {...buttonProps}
          >
            {element.props.text}
          </button>
        );
      }
      
      // Si el botón tiene alignSelf: center, envolverlo en un div centrado
      if (element.props.alignSelf === 'center') {
        return (
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            {buttonElement}
          </div>
        );
      }
      
      return buttonElement;
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
  
  // Determinar si debe mostrar borde y fondo por defecto
  const shouldShowDefaultStyling = !hasCustomColor;

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onDragEnter={onDragEnter}
      onClick={(e) => {
        // No usar stopPropagation aquí para permitir eventos de drag
        onSelect(element);
      }}
      className={`relative transition-all duration-300 ease-in-out cursor-pointer ${
        isDragOver 
          ? 'shadow-lg transform scale-[1.02] z-50' 
          : 'hover:shadow-md z-auto'
      }`}
      style={{
        minHeight: element.props.minHeight || (hasChildren ? '120px' : '200px'),
        padding: element.props.padding || (hasChildren ? '16px' : '48px'),
        backgroundColor: isDragOver ? '#dbeafe' : (element.props.backgroundColor || (shouldShowDefaultStyling ? '#f8fafc' : 'transparent')),
        border: isDragOver ? '3px solid #3b82f6' : (isSelected ? '2px solid #8b5cf6' : (shouldShowDefaultStyling ? '1px dotted #cbd5e1' : element.props.border || 'none')),
        borderRadius: element.props.borderRadius || '0px',
        display: 'flex',
        flexDirection: element.props.flexDirection || 'column',
        alignItems: element.props.alignItems || (hasChildren ? 'stretch' : 'center'),
        justifyContent: element.props.justifyContent || (hasChildren ? 'flex-start' : 'center'),
        flexWrap: element.props.flexWrap || 'nowrap',
        gap: element.props.gap || '16px',
        cursor: isDragOver ? 'copy' : 'default',
        position: 'relative',
        // Mejorar área de detección durante drag
        ...(isDragOver && {
          margin: '-4px',
          padding: `calc(${element.props.padding || (hasChildren ? '16px' : '48px')} + 4px)`
        })
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
        <div 
          className={`w-full ${
            (element.props.flexDirection === 'row' || element.props.flexDirection === 'row-reverse') 
              ? 'horizontal-container' 
              : 'vertical-container'
          }`}
          data-child-count={element.props.children?.length || 0}
          style={{
            display: 'flex',
            flexDirection: element.props.flexDirection || 'column',
            alignItems: element.props.alignItems || 'stretch',
            justifyContent: element.props.justifyContent || 'flex-start',
            flexWrap: element.props.flexWrap || 'nowrap',
            gap: element.props.gap || '16px',
            minHeight: (element.props.flexDirection === 'row' || element.props.flexDirection === 'row-reverse') ? '150px' : 'auto'
          }}
        >
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