import React, { useState, useCallback, useRef } from 'react';
import { FiDroplet, FiImage, FiUpload, FiRefreshCw, FiFolder, FiLink } from 'react-icons/fi';

/**
 * Componente selector de fondo para contenedores
 * Soporta color sólido e imagen de fondo
 */
function BackgroundSelector({ 
  element,
  onChange, 
  className = "" 
}) {
  console.log('🎨 BackgroundSelector loaded for element:', element?.id);
  
  // Determinar el tipo de fondo actual
  const currentBackgroundType = element.props.backgroundType || 'color';
  
  // Estados locales para mejor UX
  const [backgroundType, setBackgroundType] = useState(currentBackgroundType);
  const [imageSource, setImageSource] = useState('url'); // 'url', 'file'
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  
  // Ref para el input de archivo
  const fileInputRef = useRef(null);

  // Manejar cambio de tipo de fondo
  const handleBackgroundTypeChange = useCallback((newType) => {
    console.log('🎨 Changing background type to:', newType);
    setBackgroundType(newType);
    onChange('backgroundType', newType);
    
    // Limpiar propiedades del tipo anterior
    if (newType === 'color') {
      console.log('🎨 Setting up color background');
      onChange('backgroundImage', undefined);
      onChange('backgroundSize', undefined);
      onChange('backgroundPosition', undefined);
      onChange('backgroundRepeat', undefined);
      // Establecer color por defecto si no existe
      if (!element.props.backgroundColor) {
        onChange('backgroundColor', '#f8fafc');
      }
    } else if (newType === 'image') {
      console.log('🖼️ Setting up image background');
      // Establecer valores por defecto para imagen
      if (!element.props.backgroundSize) {
        onChange('backgroundSize', 'cover');
      }
      if (!element.props.backgroundPosition) {
        onChange('backgroundPosition', 'center');
      }
      if (!element.props.backgroundRepeat) {
        onChange('backgroundRepeat', 'no-repeat');
      }
    }
  }, [onChange, element.props]);

  // Manejar selección de archivo de imagen
  const handleFileSelect = useCallback((event) => {
    const file = event.target.files[0];
    
    if (!file) return;
    
    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido.');
      return;
    }
    
    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('El archivo es demasiado grande. Por favor selecciona una imagen menor a 5MB.');
      return;
    }
    
    setIsProcessingFile(true);
    console.log('🖼️ Processing image file:', file.name, 'Size:', (file.size / 1024 / 1024).toFixed(2) + 'MB');
    
    // Crear FileReader para convertir a base64
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const base64URL = e.target.result;
      console.log('🖼️ Image converted to base64, length:', base64URL.length);
      
      // Aplicar la imagen como fondo
      onChange('backgroundImage', base64URL);
      setImageSource('file');
      setIsProcessingFile(false);
    };
    
    reader.onerror = () => {
      console.error('❌ Error reading image file');
      alert('Error al procesar la imagen. Por favor intenta con otro archivo.');
      setIsProcessingFile(false);
    };
    
    // Leer el archivo como data URL (base64)
    reader.readAsDataURL(file);
  }, [onChange]);
  
  // Función para abrir selector de archivo
  const openFileSelector = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Sincronizar estado local con props cuando cambien
  React.useEffect(() => {
    setBackgroundType(element.props.backgroundType || 'color');
    
    // Detectar automáticamente el tipo de fuente de imagen
    if (element.props.backgroundImage) {
      if (element.props.backgroundImage.startsWith('data:')) {
        setImageSource('file');
      } else {
        setImageSource('url');
      }
    }
  }, [element.props.backgroundType, element.props.backgroundImage]);

  return (
    <div className={className}>
      <label className="block text-xs font-medium text-gray-400 mb-3">
        Tipo de fondo
      </label>
      
      {/* Selector de tipo de fondo */}
      <div className="flex gap-1 mb-4 bg-[#2a2a2a] rounded-lg p-1">
        <button
          onClick={() => handleBackgroundTypeChange('color')}
          className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 ${
            backgroundType === 'color' 
              ? 'bg-purple-500 text-white' 
              : 'text-gray-400 hover:text-white hover:bg-[#3a3a3a]'
          }`}
        >
          <FiDroplet className="w-3 h-3" />
          <span className="text-xs font-medium">Color</span>
        </button>
        
        <button
          onClick={() => handleBackgroundTypeChange('image')}
          className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 ${
            backgroundType === 'image' 
              ? 'bg-purple-500 text-white' 
              : 'text-gray-400 hover:text-white hover:bg-[#3a3a3a]'
          }`}
        >
          <FiImage className="w-3 h-3" />
          <span className="text-xs font-medium">Imagen</span>
        </button>
      </div>

      {/* Controles para fondo de color */}
      {backgroundType === 'color' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">
              Color de fondo
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={element.props.backgroundColor === 'transparent' ? '#ffffff' : (element.props.backgroundColor || '#ffffff')}
                onChange={(e) => onChange('backgroundColor', e.target.value)}
                className="w-8 h-8 bg-[#2a2a2a] border border-[#3a3a3a] rounded cursor-pointer"
              />
              <input
                type="text"
                value={element.props.backgroundColor || 'transparent'}
                onChange={(e) => onChange('backgroundColor', e.target.value)}
                className="flex-1 px-2 py-1 bg-[#2a2a2a] border border-[#3a3a3a] rounded text-white text-xs font-mono"
                placeholder="transparent"
              />
            </div>
          </div>
        </div>
      )}

      {/* Controles para imagen de fondo */}
      {backgroundType === 'image' && (
        <div className="space-y-4">
          {/* Selector de fuente de imagen */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">
              Fuente de imagen
            </label>
            <div className="flex gap-1 bg-[#2a2a2a] rounded-lg p-1">
              <button
                onClick={() => setImageSource('url')}
                className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 text-xs ${
                  imageSource === 'url' 
                    ? 'bg-purple-500 text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-[#3a3a3a]'
                }`}
              >
                <FiLink className="w-3 h-3" />
                <span>URL</span>
              </button>
              
              <button
                onClick={() => setImageSource('file')}
                className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 text-xs ${
                  imageSource === 'file' 
                    ? 'bg-purple-500 text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-[#3a3a3a]'
                }`}
              >
                <FiFolder className="w-3 h-3" />
                <span>Archivo</span>
              </button>
            </div>
          </div>
          
          {/* Input oculto para archivos */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          {/* Controles según la fuente seleccionada */}
          {imageSource === 'url' && (
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">
                URL de la imagen
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={element.props.backgroundImage || ''}
                  onChange={(e) => {
                    onChange('backgroundImage', e.target.value);
                    if (e.target.value) setImageSource('url');
                  }}
                  className="flex-1 px-3 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded text-white text-sm"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>
              {element.props.backgroundImage && (
                <p className="text-xs text-gray-500 mt-1">
                  Imagen cargada correctamente
                </p>
              )}
              
              {/* Imágenes de ejemplo rápidas */}
              <div className="mt-3">
                <label className="block text-xs font-medium text-gray-400 mb-2">
                  Ejemplos rápidos
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    {
                      url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop',
                      name: 'Oficina'
                    },
                    {
                      url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop',
                      name: 'Espacio'
                    },
                    {
                      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
                      name: 'Montañas'
                    }
                  ].map((example, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        onChange('backgroundImage', example.url);
                        console.log('🖼️ Applied example image:', example.url);
                      }}
                      className="group relative h-12 bg-cover bg-center rounded border border-[#3a3a3a] hover:border-purple-500 transition-colors overflow-hidden"
                      style={{ backgroundImage: `url(${example.url})` }}
                      title={`Usar imagen: ${example.name}`}
                    >
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                        <FiRefreshCw className="w-3 h-3 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Haz clic para usar una imagen de ejemplo
                </p>
              </div>
            </div>
          )}
          
          {imageSource === 'file' && (
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">
                Archivo de imagen
              </label>
              <div className="flex gap-2">
                <button
                  onClick={openFileSelector}
                  disabled={isProcessingFile}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded border-2 border-dashed transition-all duration-200 ${
                    isProcessingFile
                      ? 'border-gray-500 bg-gray-500 text-gray-300 cursor-not-allowed'
                      : 'border-[#3a3a3a] hover:border-purple-500 hover:bg-[#3a3a3a] text-gray-300'
                  }`}
                >
                  {isProcessingFile ? (
                    <>
                      <FiRefreshCw className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Procesando...</span>
                    </>
                  ) : (
                    <>
                      <FiUpload className="w-4 h-4" />
                      <span className="text-sm">Seleccionar imagen</span>
                    </>
                  )}
                </button>
              </div>
              
              {element.props.backgroundImage && element.props.backgroundImage.startsWith('data:') && (
                <div className="mt-2 p-2 bg-[#1a1a1a] rounded border border-[#3a3a3a]">
                  <p className="text-xs text-green-400 font-medium mb-1">
                    ✓ Imagen cargada desde archivo local
                  </p>
                  <p className="text-xs text-gray-500">
                    Tamaño: {(element.props.backgroundImage.length / 1024 / 1.37).toFixed(0)} KB aprox.
                  </p>
                </div>
              )}
              
              <div className="mt-2 p-2 bg-[#1a1a1a] rounded border border-[#3a3a3a]">
                <p className="text-xs text-gray-400">
                  <strong>Formatos soportados:</strong> JPG, PNG, GIF, WebP
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  <strong>Tamaño máximo:</strong> 5MB
                </p>
              </div>
            </div>
          )}
          

          {/* Tamaño de la imagen */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">
              Tamaño de la imagen
            </label>
            <select
              value={element.props.backgroundSize || 'cover'}
              onChange={(e) => onChange('backgroundSize', e.target.value)}
              className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-3 py-2 text-white text-sm hover:bg-[#3a3a3a] transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="cover">Cubrir (cover)</option>
              <option value="contain">Contener (contain)</option>
              <option value="auto">Tamaño original</option>
              <option value="100% 100%">Estirar (100%)</option>
            </select>
          </div>

          {/* Posición de la imagen */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">
              Posición de la imagen
            </label>
            <div className="grid grid-cols-3 gap-1">
              {[
                { value: 'left top', label: '↖', name: 'Arriba Izquierda' },
                { value: 'center top', label: '↑', name: 'Arriba Centro' },
                { value: 'right top', label: '↗', name: 'Arriba Derecha' },
                { value: 'left center', label: '←', name: 'Centro Izquierda' },
                { value: 'center', label: '⊙', name: 'Centro' },
                { value: 'right center', label: '→', name: 'Centro Derecha' },
                { value: 'left bottom', label: '↙', name: 'Abajo Izquierda' },
                { value: 'center bottom', label: '↓', name: 'Abajo Centro' },
                { value: 'right bottom', label: '↘', name: 'Abajo Derecha' }
              ].map((position) => (
                <button
                  key={position.value}
                  onClick={() => onChange('backgroundPosition', position.value)}
                  className={`p-2 rounded text-center transition-all duration-200 ${
                    (element.props.backgroundPosition || 'center') === position.value
                      ? 'bg-purple-500 text-white'
                      : 'bg-[#2a2a2a] text-gray-400 hover:bg-[#3a3a3a] border border-[#3a3a3a]'
                  }`}
                  title={position.name}
                >
                  <span className="text-lg">{position.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Repetición de la imagen */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">
              Repetición de la imagen
            </label>
            <select
              value={element.props.backgroundRepeat || 'no-repeat'}
              onChange={(e) => onChange('backgroundRepeat', e.target.value)}
              className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-3 py-2 text-white text-sm hover:bg-[#3a3a3a] transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="no-repeat">Sin repetición</option>
              <option value="repeat">Repetir (ambas direcciones)</option>
              <option value="repeat-x">Repetir horizontalmente</option>
              <option value="repeat-y">Repetir verticalmente</option>
            </select>
          </div>

        </div>
      )}
    </div>
  );
}

export default BackgroundSelector;