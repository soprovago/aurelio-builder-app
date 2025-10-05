/**
 * Image Element Component
 * Elemento de imagen con propiedades responsive y optimización
 */

import React, { useState, useRef } from 'react';
import { FiImage, FiUpload, FiX, FiMaximize2 } from 'react-icons/fi';

function Image({ 
  isSelected = false,
  onSelect = () => {},
  onDoubleClick = () => {},
  viewportMode,
  // Image specific props
  src = '/images/general-img-landscape.png',
  alt = 'Imagen',
  title = '',
  width = '100%',
  height = 'auto',
  objectFit = 'cover',
  objectPosition = 'center',
  loading = 'lazy',
  // Base props
  padding = '0px',
  margin = '0px',
  backgroundColor = 'transparent',
  borderRadius = '0px',
  border = 'none',
  opacity = 1,
  ...otherProps
}) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const fileInputRef = useRef(null);

  const computedStyles = {
    width,
    height,
    padding,
    margin,
    backgroundColor: backgroundColor === 'transparent' ? 'transparent' : backgroundColor,
    borderRadius,
    border: border === 'none' ? 'none' : border,
    position: 'relative',
    display: 'inline-block',
    opacity,
    ...otherProps.style
  };

  const imageStyles = {
    width: '100%',
    height: height === 'auto' ? 'auto' : '100%',
    objectFit,
    objectPosition,
    display: 'block',
    maxWidth: '100%',
  };

  const handleClick = (e) => {
    e.stopPropagation();
    onSelect();
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    if (isSelected) {
      setShowUploadModal(true);
    }
    onDoubleClick();
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setImageError(true);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        // Here you would typically update the src property
        // This would be handled by the parent component
        console.log('New image uploaded:', event.target.result);
        setShowUploadModal(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const ImagePlaceholder = () => (
    <div 
      className="flex flex-col items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 min-h-[200px] p-8"
      style={{ 
        width: width === 'auto' ? '400px' : width,
        height: height === 'auto' ? '200px' : height 
      }}
    >
      <FiImage className="w-12 h-12 text-gray-400 mb-4" />
      <p className="text-gray-600 text-center mb-4">
        {imageError ? 'Error al cargar imagen' : 'Imagen no encontrada'}
      </p>
      {isSelected && (
        <button
          onClick={openFileDialog}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          <FiUpload className="w-4 h-4" />
          Subir imagen
        </button>
      )}
    </div>
  );

  return (
    <div
      className={`aurelio-image transition-all ${isSelected ? 'aurelio-selected' : ''} hover:outline hover:outline-1 hover:outline-blue-400 hover:outline-dashed`}
      style={computedStyles}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      data-testid="aurelio-image"
    >
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute -top-0.5 -left-0.5 -right-0.5 -bottom-0.5 border-2 border-blue-500 pointer-events-none rounded z-10" />
      )}

      {/* Image or placeholder */}
      {!imageError && src ? (
        <>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
              <FiImage className="w-8 h-8 text-gray-400" />
            </div>
          )}
          <img
            src={src}
            alt={alt}
            title={title}
            loading={loading}
            style={imageStyles}
            onLoad={handleImageLoad}
            onError={handleImageError}
            className="transition-opacity duration-300"
          />
        </>
      ) : (
        <ImagePlaceholder />
      )}

      {/* Controls when selected */}
      {isSelected && !imageError && (
        <>
          {/* Upload button */}
          <div className="absolute top-2 right-2">
            <button
              onClick={openFileDialog}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors shadow-lg"
              title="Cambiar imagen"
            >
              <FiUpload className="w-4 h-4" />
            </button>
          </div>

          {/* Resize handles */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 border border-white pointer-events-auto cursor-nw-resize" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 border border-white pointer-events-auto cursor-ne-resize" />
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-500 border border-white pointer-events-auto cursor-sw-resize" />
            <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 border border-white pointer-events-auto cursor-se-resize" />
            
            {/* Side handles */}
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-500 border border-white pointer-events-auto cursor-n-resize" />
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-500 border border-white pointer-events-auto cursor-s-resize" />
            <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-500 border border-white pointer-events-auto cursor-w-resize" />
            <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-500 border border-white pointer-events-auto cursor-e-resize" />
          </div>

          {/* Image info */}
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white text-xs p-2">
            <div className="flex justify-between items-center">
              <span>{alt || 'Sin descripción'}</span>
              <span className="opacity-75">
                {width} × {height}
              </span>
            </div>
          </div>
        </>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Upload modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Cambiar imagen</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div
                onClick={openFileDialog}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 cursor-pointer transition-colors"
              >
                <FiUpload className="w-8 h-8 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Haz clic para subir una imagen</p>
                <p className="text-sm text-gray-500 mt-2">PNG, JPG, GIF hasta 10MB</p>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Configuración específica del elemento Image
Image.elementConfig = {
  type: 'image',
  name: 'Imagen',
  icon: <FiImage className="w-5 h-5" />,
  category: 'media',
  description: 'Elemento de imagen responsive con opciones de optimización',
  tags: ['image', 'media', 'photo', 'picture', 'responsive'],
  
  // Propiedades específicas del Image (además de las base)
  properties: {
    src: {
      type: 'image',
      label: 'URL de la imagen',
      default: '/images/general-img-landscape.png',
      required: true,
      category: 'content'
    },
    alt: {
      type: 'text',
      label: 'Texto alternativo',
      default: 'Imagen',
      required: true,
      category: 'content',
      description: 'Importante para accesibilidad y SEO'
    },
    title: {
      type: 'text',
      label: 'Título de la imagen',
      default: '',
      category: 'content'
    },
    objectFit: {
      type: 'select',
      label: 'Ajuste de imagen',
      default: 'cover',
      options: [
        { value: 'cover', label: 'Cubrir - mantiene proporción, puede recortar' },
        { value: 'contain', label: 'Contener - imagen completa visible' },
        { value: 'fill', label: 'Llenar - estira para ocupar todo el espacio' },
        { value: 'scale-down', label: 'Escalar - como contain pero más pequeña' },
        { value: 'none', label: 'Original - tamaño natural' }
      ],
      category: 'layout'
    },
    objectPosition: {
      type: 'select',
      label: 'Posición de la imagen',
      default: 'center',
      options: [
        { value: 'center', label: 'Centro' },
        { value: 'top', label: 'Arriba' },
        { value: 'bottom', label: 'Abajo' },
        { value: 'left', label: 'Izquierda' },
        { value: 'right', label: 'Derecha' },
        { value: 'top left', label: 'Arriba izquierda' },
        { value: 'top right', label: 'Arriba derecha' },
        { value: 'bottom left', label: 'Abajo izquierda' },
        { value: 'bottom right', label: 'Abajo derecha' }
      ],
      category: 'layout'
    },
    loading: {
      type: 'select',
      label: 'Carga de imagen',
      default: 'lazy',
      options: [
        { value: 'lazy', label: 'Perezosa - carga cuando sea visible' },
        { value: 'eager', label: 'Inmediata - carga de inmediato' }
      ],
      category: 'performance'
    }
  },

  // Props por defecto específicas
  defaultProps: {
    src: '/images/general-img-landscape.png',
    alt: 'Imagen',
    title: '',
    width: '100%',
    height: 'auto',
    objectFit: 'cover',
    objectPosition: 'center',
    loading: 'lazy',
    padding: '0px',
    margin: '0px',
    backgroundColor: 'transparent',
    borderRadius: '0px',
    border: 'none',
    opacity: 1
  }
};

export default Image;