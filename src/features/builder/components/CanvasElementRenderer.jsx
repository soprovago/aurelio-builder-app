import React from 'react';
import { FiGrid, FiInbox, FiTarget } from 'react-icons/fi';
import { ELEMENT_TYPES } from '../../../constants/elementTypes';
import ContainerChild from '../../../components/Editor/components/ContainerChild';

/**
 * CanvasElementRenderer - Componente especializado para renderizar elementos específicos
 * 
 * Separa la lógica de renderizado del CanvasElement principal,
 * haciendo el código más modular y mantenible.
 */
function CanvasElementRenderer({ 
  element, 
  allElements, 
  selectedElement,
  isDragOver,
  onAddToContainer,
  onMoveToContainer,
  onSelect,
  onDelete,
  onDuplicate,
  viewportMode,
  onUpdateElement,
  onAddElementAtIndex,
  onReorder,
  onAddElement
}) {
  // Función para renderizar elementos básicos (no contenedores)
  const renderBasicElement = (elementData) => {
    const { type, props } = elementData;
    
    switch (type) {
      case ELEMENT_TYPES.HEADING:
        return (
          <div
            style={{
              color: props.color,
              fontSize: props.fontSize,
              textAlign: props.alignment,
            }}
          >
            <h1>{props.text}</h1>
          </div>
        );
        
      case ELEMENT_TYPES.TEXT:
        return (
          <div
            style={{
              color: props.color,
              fontSize: props.fontSize,
              textAlign: props.alignment,
            }}
          >
            {props.text}
          </div>
        );
        
      case ELEMENT_TYPES.IMAGE:
        return (
          <img
            src={props.src}
            alt={props.alt}
            style={{
              width: props.width,
              height: props.height,
              objectFit: 'cover',
            }}
          />
        );
        
      case ELEMENT_TYPES.BUTTON:
        return (
          <button
            style={{
              backgroundColor: props.backgroundColor,
              color: props.textColor,
              padding: props.padding,
              borderRadius: props.borderRadius,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {props.text}
          </button>
        );
        
      default:
        return <div className="p-4 bg-gray-700 rounded">Elemento: {type}</div>;
    }
  };
  
  // Función para renderizar contenedores con lógica especializada
  const renderContainer = () => {
    const { props } = element;
    const hasChildren = props.children && props.children.length > 0;
    

    return (
      <div
        className={`relative transition-all duration-300 ease-in-out ${
          isDragOver 
            ? 'shadow-lg transform scale-[1.02]' 
            : 'hover:shadow-md'
        }`}
        style={{
          minHeight: props.minHeight || (hasChildren ? '120px' : '200px'),
          padding: props.padding || (hasChildren ? '16px' : '48px'),
          // Manejar background según el tipo
          ...(() => {
            if (isDragOver) {
              return { backgroundColor: '#dbeafe' };
            }
            
            // Si el tipo de fondo es gradiente, usar la propiedad backgroundGradient
            if (props.backgroundType === 'gradient' && props.backgroundGradient) {
              console.log('🟢 CANVAS GRADIENT DETECTED:', {
                backgroundType: props.backgroundType,
                backgroundGradient: props.backgroundGradient,
                elementId: element.id
              });
              return { background: props.backgroundGradient };
            }
            
            // También verificar si hay backgroundGradient sin backgroundType
            if (props.backgroundGradient && !props.backgroundType) {
              console.log('🟡 CANVAS GRADIENT WITHOUT TYPE DETECTED:', {
                backgroundGradient: props.backgroundGradient,
                elementId: element.id
              });
              return { background: props.backgroundGradient };
            }
            
            const baseColor = props.backgroundColor || '#f8fafc';
            const opacity = props.backgroundOpacity || 1;
            
            // Si hay opacidad personalizada, convertir a rgba
            if (opacity < 1 && baseColor !== 'transparent' && baseColor.startsWith('#')) {
              const hex = baseColor.replace('#', '');
              const r = parseInt(hex.substr(0, 2), 16);
              const g = parseInt(hex.substr(2, 2), 16);
              const b = parseInt(hex.substr(4, 2), 16);
              return { backgroundColor: `rgba(${r}, ${g}, ${b}, ${opacity})` };
            }
            
            return { backgroundColor: baseColor };
          })(),
          // Aplicar backdrop-filter blur cuando esté habilitado
          ...(props.backgroundBlur && props.backgroundBlur > 0 ? {
            backdropFilter: `blur(${props.backgroundBlur}px)`,
            WebkitBackdropFilter: `blur(${props.backgroundBlur}px)`, // Safari support
          } : {}),
          border: props.border === 'none' ? 'none' : (props.border || (isDragOver ? '3px solid #3b82f6' : '2px dashed #cbd5e1')),
          borderRadius: props.borderRadius || '12px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: hasChildren ? 'stretch' : 'center',
          justifyContent: hasChildren ? 'flex-start' : 'center',
          cursor: isDragOver ? 'copy' : 'default',
          position: 'relative',
          overflow: 'hidden' // Para que el blur no se salga del contenedor
        }}
      >
        {/* Imagen de fondo con opacidad y blur */}
        {props.backgroundImage && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `url(${props.backgroundImage})`,
              backgroundSize: props.backgroundSize || 'cover',
              backgroundPosition: props.backgroundPosition || 'center',
              backgroundRepeat: props.backgroundRepeat || 'no-repeat',
              opacity: props.backgroundOpacity || 1,
              filter: props.backgroundBlur && props.backgroundBlur > 0 ? `blur(${props.backgroundBlur}px)` : 'none',
              borderRadius: props.borderRadius || '12px',
              zIndex: 0, // Nivel base, detrás del contenido pero visible
              // Optimizaciones de rendimiento
              willChange: props.backgroundBlur && props.backgroundBlur > 0 ? 'filter' : 'auto',
              transform: 'translateZ(0)', // Forzar aceleración por hardware
              backfaceVisibility: 'hidden'
            }}
          />
        )}
        
        {/* Overlay de drop activo */}
        {isDragOver && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-200/30 to-blue-300/30 border-2 border-blue-400 border-dashed rounded-xl flex items-center justify-center z-20 backdrop-blur-sm">
            <div className="bg-blue-500 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-blue-300">
              <div className="w-8 h-8 bg-blue-400 rounded-lg flex items-center justify-center">
                <FiTarget className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm">Soltar elemento aquí</span>
                <span className="text-blue-200 text-xs">Contenedor</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Contenido del contenedor */}
        {hasChildren ? (
          <div className="w-full relative z-10">
            <div className="space-y-2">
              {/* Usar ContainerChild para elementos hijos */}
              {props.children.map((child, childIndex) => {
                return (
                  <ContainerChild
                    key={child.id}
                    element={child}
                    onSelect={onSelect}
                    onDelete={(childId) => onDelete(childId, element.id)}
                    onDuplicate={(childElement) => onDuplicate(childElement, element.id)}
                    isSelected={selectedElement?.id === child.id}
                    onAddToContainer={onAddToContainer}
                    onMoveToContainer={onMoveToContainer}
                    selectedElement={selectedElement}
                    viewportMode={viewportMode}
                    parentElement={element}
                    onUpdateElement={onUpdateElement}
                  />
                );
              })}
            </div>
          </div>
        ) : (
          // Estado vacío
          <div className="text-center w-full h-full flex flex-col items-center justify-center relative z-10">
            {!isDragOver && (
              <>
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-dashed border-gray-300 flex items-center justify-center mb-6 transition-all duration-300 hover:from-blue-50 hover:to-blue-100 hover:border-blue-300">
                  <FiInbox className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 mb-4 max-w-xs mx-auto leading-relaxed">
                  Arrastra elementos aquí para comenzar
                </p>
              </>
            )}
          </div>
        )}
      </div>
    );
  };
  
  // Renderizado principal basado en el tipo de elemento
  if (element.type === ELEMENT_TYPES.CONTAINER) {
    return renderContainer();
  } else {
    // Para elementos básicos, solo renderizar (la selección se maneja en CanvasElement)
    return renderBasicElement(element);
  }
}

export default CanvasElementRenderer;