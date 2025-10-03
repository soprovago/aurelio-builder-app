/**
 * Template Preview Modal Component
 * Modal para mostrar vista previa real del contenido de las plantillas
 */

import React, { useState } from 'react';
import { 
  FiX, 
  FiDownload, 
  FiZoomIn,
  FiZoomOut,
  FiMonitor,
  FiTablet,
  FiSmartphone,
  FiMaximize2
} from 'react-icons/fi';

// Importar sistema de rating
import { StarRating, useTemplateRating, RatingModal } from './TemplateRatingSystem';

function TemplatePreviewModal({ isOpen, template, onClose, onSelectTemplate }) {
  const [scale, setScale] = useState(0.8);
  const [deviceView, setDeviceView] = useState('desktop'); // desktop, tablet, mobile
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  
  // Hook de rating
  const { 
    userRating, 
    hasRated, 
    submitRating 
  } = useTemplateRating(template?.id);

  if (!isOpen || !template) return null;

  const deviceSizes = {
    desktop: { width: '100%', maxWidth: '1200px' },
    tablet: { width: '768px', maxWidth: '768px' },
    mobile: { width: '375px', maxWidth: '375px' }
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.3));
  };

  const handleDeviceChange = (device) => {
    setDeviceView(device);
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const renderPreviewContent = () => {
    if (!template.elements || template.elements.length === 0) {
      return (
        <div className="flex items-center justify-center h-64 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg">
          <div className="text-center">
            <FiMonitor className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-300 text-lg font-medium">Vista previa no disponible</p>
            <p className="text-gray-500 text-sm">Esta plantilla no tiene elementos para mostrar</p>
          </div>
        </div>
      );
    }

    return (
      <div 
        className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300"
        style={{
          ...deviceSizes[deviceView],
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          margin: '0 auto'
        }}
      >
        <div className="relative">
          {/* Renderizar elementos de la plantilla */}
          <div className="preview-container">
            {template.elements.map((element, index) => (
              <PreviewElement key={element.id || index} element={element} />
            ))}
          </div>
          
          {/* Overlay con información de la plantilla */}
          <div className="absolute top-4 right-4 bg-[#1a1a1a] bg-opacity-90 backdrop-blur-sm border border-[#2a2a2a] text-white px-3 py-2 rounded-lg text-sm">
            {template.name}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className={`bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl shadow-2xl mx-4 flex flex-col overflow-hidden transition-all duration-300 ${
        isFullscreen 
          ? 'w-full h-full max-w-none max-h-none' 
          : 'w-full max-w-6xl max-h-[90vh]'
      }`}>
        
        {/* Header con controles */}
        <div className="flex items-center justify-between p-6 border-b border-[#2a2a2a] bg-[#1a1a1a]">
          <div className="flex items-center gap-4">
            <div>
              <h3 className="text-xl font-bold text-white">{template.name}</h3>
              <p className="text-sm text-gray-400">{template.description}</p>
            </div>
            
            {/* Rating y stats */}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <StarRating 
                  rating={template.rating} 
                  size={16} 
                  showValue={false}
                />
                <span className="text-gray-400">({template.rating})</span>
                {!hasRated && (
                  <button
                    onClick={() => setShowRatingModal(true)}
                    className="ml-2 text-xs text-[#8b5cf6] hover:text-[#7c3aed] transition-colors"
                  >
                    Calificar
                  </button>
                )}
                {hasRated && (
                  <span className="ml-2 text-xs text-[#10b981]">
                    Tu rating: {userRating} ⭐
                  </span>
                )}
              </div>
              <span className="text-gray-500">{template.downloads?.toLocaleString()} descargas</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Controles de zoom */}
            <div className="flex items-center gap-1 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg">
              <button
                onClick={handleZoomOut}
                className="p-2 hover:bg-[#3a3a3a] transition-colors text-gray-300"
                title="Alejar"
              >
                <FiZoomOut className="w-4 h-4" />
              </button>
              <span className="px-2 text-sm text-gray-300 border-x border-[#3a3a3a]">
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                className="p-2 hover:bg-[#3a3a3a] transition-colors text-gray-300"
                title="Acercar"
              >
                <FiZoomIn className="w-4 h-4" />
              </button>
            </div>

            {/* Selector de dispositivo */}
            <div className="flex items-center bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg">
              <button
                onClick={() => handleDeviceChange('desktop')}
                className={`p-2 transition-colors ${
                  deviceView === 'desktop' 
                    ? 'bg-[#8b5cf6] text-white' 
                    : 'text-gray-300 hover:bg-[#3a3a3a] hover:text-white'
                }`}
                title="Vista Desktop"
              >
                <FiMonitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDeviceChange('tablet')}
                className={`p-2 transition-colors ${
                  deviceView === 'tablet' 
                    ? 'bg-[#8b5cf6] text-white' 
                    : 'text-gray-300 hover:bg-[#3a3a3a] hover:text-white'
                }`}
                title="Vista Tablet"
              >
                <FiTablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDeviceChange('mobile')}
                className={`p-2 transition-colors ${
                  deviceView === 'mobile' 
                    ? 'bg-[#8b5cf6] text-white' 
                    : 'text-gray-300 hover:bg-[#3a3a3a] hover:text-white'
                }`}
                title="Vista Móvil"
              >
                <FiSmartphone className="w-4 h-4" />
              </button>
            </div>

            {/* Pantalla completa */}
            <button
              onClick={handleFullscreen}
              className="p-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg hover:bg-[#3a3a3a] transition-colors text-gray-300"
              title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
            >
              <FiMaximize2 className="w-4 h-4" />
            </button>

            {/* Cerrar */}
            <button
              onClick={onClose}
              className="p-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg hover:bg-[#3a3a3a] transition-colors text-gray-300"
              title="Cerrar vista previa"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Área de vista previa */}
        <div className="flex-1 overflow-auto bg-[#0f0f0f] p-6">
          <div className="flex justify-center min-h-full">
            {renderPreviewContent()}
          </div>
        </div>

        {/* Footer con acciones */}
        <div className="p-6 border-t border-[#2a2a2a] bg-[#1a1a1a]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {template.tags?.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-[#2a2a2a] text-[#a0a0a0] text-xs rounded font-medium border border-[#3a3a3a]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-[#a0a0a0] hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onSelectTemplate(template);
                  onClose();
                }}
                className="flex items-center gap-2 bg-[#8b5cf6] text-white px-6 py-2 rounded-lg hover:bg-[#7c3aed] transition-colors font-medium"
              >
                <FiDownload className="w-4 h-4" />
                Usar esta Plantilla
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal de rating */}
      {showRatingModal && (
        <RatingModal
          isOpen={showRatingModal}
          template={template}
          onClose={() => setShowRatingModal(false)}
          onSubmitRating={async (rating, review) => {
            await submitRating(rating, review);
            setShowRatingModal(false);
          }}
          existingRating={userRating}
        />
      )}
    </div>
  );
}

// Componente helper para renderizar elementos de preview simplificado
function PreviewElement({ element }) {
  if (!element) return null;

  const { type, props } = element;

  // Función para aplicar estilos del elemento
  const getElementStyles = (props) => {
    const styles = {};
    
    // Colores
    if (props.backgroundColor) styles.backgroundColor = props.backgroundColor;
    if (props.color) styles.color = props.color;
    
    // Espaciado
    if (props.padding) styles.padding = props.padding;
    if (props.margin) styles.margin = props.margin;
    
    // Dimensiones
    if (props.width) styles.width = props.width;
    if (props.height) styles.height = props.height;
    if (props.minHeight) styles.minHeight = props.minHeight;
    if (props.maxWidth) styles.maxWidth = props.maxWidth;
    
    // Layout
    if (props.display) styles.display = props.display;
    if (props.flexDirection) styles.flexDirection = props.flexDirection;
    if (props.justifyContent) styles.justifyContent = props.justifyContent;
    if (props.alignItems) styles.alignItems = props.alignItems;
    if (props.gap) styles.gap = props.gap;
    if (props.gridTemplateColumns) styles.gridTemplateColumns = props.gridTemplateColumns;
    
    // Bordes y efectos
    if (props.borderRadius) styles.borderRadius = props.borderRadius;
    if (props.border) styles.border = props.border;
    if (props.boxShadow) styles.boxShadow = props.boxShadow;
    
    // Tipografía
    if (props.fontSize) styles.fontSize = props.fontSize;
    if (props.fontWeight) styles.fontWeight = props.fontWeight;
    if (props.textAlign) styles.textAlign = props.textAlign;
    if (props.lineHeight) styles.lineHeight = props.lineHeight;
    
    // Posicionamiento
    if (props.position) styles.position = props.position;
    if (props.top) styles.top = props.top;
    if (props.right) styles.right = props.right;
    if (props.bottom) styles.bottom = props.bottom;
    if (props.left) styles.left = props.left;
    if (props.zIndex) styles.zIndex = props.zIndex;
    
    // Opacidad
    if (props.opacity) styles.opacity = props.opacity;

    return styles;
  };

  const elementStyles = getElementStyles(props);

  switch (type) {
    case 'container':
      return (
        <div style={elementStyles}>
          {props.children?.map((child, index) => (
            <PreviewElement key={child.id || index} element={child} />
          ))}
        </div>
      );

    case 'text':
      return (
        <p style={elementStyles}>
          {props.content || 'Texto de ejemplo'}
        </p>
      );

    case 'heading':
      const HeadingTag = props.level || 'h1';
      return (
        <HeadingTag style={elementStyles}>
          {props.content || `Encabezado ${props.level || 'H1'}`}
        </HeadingTag>
      );

    case 'button':
      return (
        <button style={elementStyles} disabled>
          {props.content || 'Botón'}
        </button>
      );

    case 'image':
      return (
        <img
          src={props.src || '/api/placeholder/300/200'}
          alt={props.alt || 'Imagen'}
          style={elementStyles}
          onError={(e) => {
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMjUgNzVIMTc1VjEyNUgxMjVWNzVaIiBzdHJva2U9IiM5Q0E0QUYiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPgo8L3N2Zz4K';
          }}
        />
      );

    default:
      return (
        <div style={elementStyles}>
          <span className="text-gray-400 text-sm">
            Elemento {type} no soportado en preview
          </span>
        </div>
      );
  }
}

export default TemplatePreviewModal;