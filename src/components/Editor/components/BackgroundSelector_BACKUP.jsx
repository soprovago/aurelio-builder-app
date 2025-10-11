import React, { useState, useCallback, useRef } from 'react';
import { FiDroplet, FiImage, FiFolder, FiLink, FiEye, FiEyeOff, FiFilter, FiRefreshCw, FiUpload, FiTrendingUp } from 'react-icons/fi';

/**
 * Componente selector de fondo para contenedores
 * Soporta color sólido, imagen de fondo y efectos blur
 */
function BackgroundSelector({ 
  element,
  onChange, 
  className = "" 
}) {
  console.log('🎨 BackgroundSelector rendering for element:', element.id, {
    backgroundType: element.props.backgroundType,
    backgroundGradient: element.props.backgroundGradient,
    allProps: element.props
  });
  
  // Función helper para detectar si hay gradiente activo
  const hasActiveGradient = (gradient) => {
    return gradient && 
           gradient !== null &&
           gradient !== undefined &&
           typeof gradient === 'string' &&
           gradient.trim() !== '' &&
           gradient !== 'none';
  };
  
  // Determinar el tipo de fondo actual
  const currentBackgroundType = element.props.backgroundType || 'color';
  
  // Estados locales para mejor UX
  const [backgroundType, setBackgroundType] = useState(currentBackgroundType === 'gradient' ? 'color' : currentBackgroundType);
  const [imageSource, setImageSource] = useState('url'); // 'url', 'file'
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  
  // Ref para el input de archivo
  const fileInputRef = useRef(null);

  // Manejar cambio de tipo de fondo
  const handleBackgroundTypeChange = useCallback((newType) => {
    setBackgroundType(newType);
    onChange('backgroundType', newType);
    
    // Limpiar propiedades del tipo anterior
    if (newType === 'color') {
      console.log('🧙 handleBackgroundTypeChange: Switching to color, clearing image props');
      onChange('backgroundImage', undefined);
      onChange('backgroundSize', undefined);
      onChange('backgroundPosition', undefined);
      onChange('backgroundRepeat', undefined);
      onChange('backgroundBlur', 0);
      // NO limpiar backgroundGradient aquí porque gradient es parte de color
      // Establecer color por defecto si no existe
      if (!element.props.backgroundColor) {
        onChange('backgroundColor', '#f8fafc');
      }
    } else if (newType === 'gradient') {
      console.log('🧙 handleBackgroundTypeChange: Switching to gradient - no cleanup needed');
      // No limpiar nada para gradient porque es parte de la pestaña color
    } else if (newType === 'image') {
      onChange('backgroundBlur', 0);
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
      if (!element.props.backgroundOpacity) {
        onChange('backgroundOpacity', 1);
      }
    } else if (newType === 'blur') {
      // Limpiar propiedades de imagen
      onChange('backgroundImage', undefined);
      onChange('backgroundSize', undefined);
      onChange('backgroundPosition', undefined);
      onChange('backgroundRepeat', undefined);
      // Establecer valores por defecto para blur
      if (!element.props.backgroundBlur) {
        onChange('backgroundBlur', 10);
      }
      if (!element.props.backgroundOpacity) {
        onChange('backgroundOpacity', 0.8);
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
    
    // Crear FileReader para convertir a base64
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const base64URL = e.target.result;
      onChange('backgroundImage', base64URL);
      setImageSource('file');
      setIsProcessingFile(false);
    };
    
    reader.onerror = () => {
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
    const currentType = element.props.backgroundType || 'color';
    console.log('🔄 useEffect triggered - element.props.backgroundType:', element.props.backgroundType);
    console.log('🔄 useEffect - currentType will be:', currentType);
    console.log('🔄 useEffect - current backgroundGradient:', element.props.backgroundGradient);
    
    // Configurar el tipo principal
    if (currentType === 'image') {
      console.log('🔄 useEffect - Setting backgroundType to: image');
      setBackgroundType('image');
    } else {
      // Tanto 'color' como 'gradient' se manejan en la misma pestaña 'color'
      console.log('🔄 useEffect - Setting backgroundType to: color');
      setBackgroundType('color');
    }
    
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
      
      {/* Selector de tipo de fondo - 2 pestañas principales */}
      <div className="flex gap-1 mb-4 bg-[#2a2a2a] rounded-lg p-1">
        <button
          onClick={() => handleBackgroundTypeChange('color')}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md transition-all duration-200 text-sm ${
            backgroundType === 'color'
              ? 'bg-purple-500 text-white' 
              : 'text-gray-400 hover:text-white hover:bg-[#3a3a3a]'
          }`}
        >
          <FiDroplet className="w-4 h-4" />
          <span className="font-medium">Color</span>
        </button>
        
        <button
          onClick={() => handleBackgroundTypeChange('image')}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md transition-all duration-200 text-sm ${
            backgroundType === 'image' 
              ? 'bg-purple-500 text-white' 
              : 'text-gray-400 hover:text-white hover:bg-[#3a3a3a]'
          }`}
        >
          <FiImage className="w-4 h-4" />
          <span className="font-medium">Imagen</span>
        </button>
      </div>

      {/* Controles para fondo de color */}
      {backgroundType === 'color' && (
        <div className="space-y-4">
          {/* Controles para color */}
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
          
          {/* Control de opacidad del color */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">
              Opacidad del color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={element.props.backgroundOpacity || 1}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  onChange('backgroundOpacity', value);
                }}
                className="flex-1 h-2 bg-[#2a2a2a] rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${((element.props.backgroundOpacity || 1) * 100)}%, #2a2a2a ${((element.props.backgroundOpacity || 1) * 100)}%, #2a2a2a 100%)`,
                  WebkitAppearance: 'none',
                  outline: 'none'
                }}
              />
              <span className="text-xs text-gray-400 w-12">
                {Math.round((element.props.backgroundOpacity || 1) * 100)}%
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Controla la transparencia del color de fondo
            </p>
          </div>
          
          {/* Controles para gradiente */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-medium text-gray-400">
                Gradiente de fondo
              </label>
              <button
                onClick={() => {
                  console.log('⚡ GRADIENT BUTTON CLICKED!', element.id, element.props);
                  
                  // Detectar si hay gradiente activo
                  const hasGradient = hasActiveGradient(element.props.backgroundGradient);
                  
                  console.log('🔍 Current gradient state:', hasGradient);
                  console.log('🔍 Current backgroundGradient value:', element.props.backgroundGradient);
                  console.log('🔍 Current backgroundType:', element.props.backgroundType);
                  
                  // Toggle gradiente
                  if (hasGradient) {
                    console.log('🔴 Disabling gradient for element:', element.id);
                    console.log('🧹 Setting backgroundGradient to null');
                    onChange('backgroundGradient', null);
                    onChange('backgroundType', 'color');
                    console.log('🧹 After clearing - element.props.backgroundGradient should be null');
                  } else {
                    console.log('🟢 Enabling gradient for element:', element.id);
                    const colors = element.props.gradientColors || [{ color: '#667eea', position: 0 }, { color: '#764ba2', position: 100 }];
                    const direction = element.props.gradientDirection || '135deg';
                    const gradientString = `linear-gradient(${direction}, ${colors.map(c => `${c.color} ${c.position}%`).join(', ')})`;
                    console.log('🎨 Setting gradient:', gradientString);
                    
                    // Establecer ambas propiedades
                    onChange('backgroundType', 'gradient');
                    onChange('backgroundGradient', gradientString);
                  }
                }}
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                  hasActiveGradient(element.props.backgroundGradient)
                    ? 'bg-purple-500 text-white'
                    : 'bg-[#3a3a3a] text-gray-400 hover:text-white'
                }`}
                title="Activar/desactivar gradiente"
              >
                {hasActiveGradient(element.props.backgroundGradient) ? (
                  <><span>ON</span></>
                ) : (
                  <><span>OFF</span></>
                )}
              </button>
            </div>
            
            {/* Controles del gradiente (solo si hay gradiente activo) */}
            {hasActiveGradient(element.props.backgroundGradient) && (
              <div className="space-y-4">
                {/* Tipo de gradiente */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">
                    Tipo de gradiente
                  </label>
                  <div className="flex gap-1 bg-[#2a2a2a] rounded-lg p-1">
                    <button
                      onClick={() => {
                        onChange('gradientType', 'linear');
                        onChange('backgroundType', 'gradient');
                        // Actualizar gradiente
                        const colors = element.props.gradientColors || [{ color: '#667eea', position: 0 }, { color: '#764ba2', position: 100 }];
                        const direction = element.props.gradientDirection || '135deg';
                        const gradientString = `linear-gradient(${direction}, ${colors.map(c => `${c.color} ${c.position}%`).join(', ')})`;
                        onChange('backgroundGradient', gradientString);
                      }}
                      className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 text-xs ${
                        (element.props.gradientType || 'linear') === 'linear' 
                          ? 'bg-purple-500 text-white' 
                          : 'text-gray-400 hover:text-white hover:bg-[#3a3a3a]'
                      }`}
                    >
                      <span>Lineal</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        onChange('gradientType', 'radial');
                        onChange('backgroundType', 'gradient');
                        // Actualizar gradiente
                        const colors = element.props.gradientColors || [{ color: '#667eea', position: 0 }, { color: '#764ba2', position: 100 }];
                        const gradientString = `radial-gradient(circle, ${colors.map(c => `${c.color} ${c.position}%`).join(', ')})`;
                        onChange('backgroundGradient', gradientString);
                      }}
                      className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 text-xs ${
                        element.props.gradientType === 'radial' 
                          ? 'bg-purple-500 text-white' 
                          : 'text-gray-400 hover:text-white hover:bg-[#3a3a3a]'
                      }`}
                    >
                      <span>Radial</span>
                    </button>
                  </div>
                </div>

                {/* Dirección del gradiente (solo para linear) */}
                {(element.props.gradientType || 'linear') === 'linear' && (
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-2">
                      Dirección del gradiente
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { value: '0deg', label: '↑', name: 'Arriba' },
                        { value: '45deg', label: '↗', name: 'Arriba-Derecha' },
                        { value: '90deg', label: '→', name: 'Derecha' },
                        { value: '135deg', label: '↘', name: 'Abajo-Derecha' },
                        { value: '180deg', label: '↓', name: 'Abajo' },
                        { value: '225deg', label: '↙', name: 'Abajo-Izquierda' },
                        { value: '270deg', label: '←', name: 'Izquierda' },
                        { value: '315deg', label: '↖', name: 'Arriba-Izquierda' }
                      ].map((direction) => (
                        <button
                          key={direction.value}
                          onClick={() => {
                            onChange('gradientDirection', direction.value);
                            onChange('backgroundType', 'gradient');
                            // Actualizar gradiente
                            const colors = element.props.gradientColors || [{ color: '#667eea', position: 0 }, { color: '#764ba2', position: 100 }];
                            const gradientString = `linear-gradient(${direction.value}, ${colors.map(c => `${c.color} ${c.position}%`).join(', ')})`;
                            onChange('backgroundGradient', gradientString);
                          }}
                          className={`p-2 rounded text-center transition-all duration-200 ${
                            (element.props.gradientDirection || '135deg') === direction.value
                              ? 'bg-purple-500 text-white'
                              : 'bg-[#2a2a2a] text-gray-400 hover:bg-[#3a3a3a] border border-[#3a3a3a]'
                          }`}
                          title={direction.name}
                        >
                          <span className="text-lg">{direction.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Colores del gradiente */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">
                    Colores del gradiente
                  </label>
                  <div className="space-y-2">
                    {(element.props.gradientColors || [{ color: '#667eea', position: 0 }, { color: '#764ba2', position: 100 }]).map((colorStop, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="color"
                          value={colorStop.color}
                          onChange={(e) => {
                            const newColors = [...(element.props.gradientColors || [{ color: '#667eea', position: 0 }, { color: '#764ba2', position: 100 }])];
                            newColors[index] = { ...newColors[index], color: e.target.value };
                            onChange('gradientColors', newColors);
                            onChange('backgroundType', 'gradient');
                            
                            // Actualizar gradiente
                            const type = element.props.gradientType || 'linear';
                            const direction = element.props.gradientDirection || '135deg';
                            const gradientString = type === 'linear' 
                              ? `linear-gradient(${direction}, ${newColors.map(c => `${c.color} ${c.position}%`).join(', ')})`
                              : `radial-gradient(circle, ${newColors.map(c => `${c.color} ${c.position}%`).join(', ')})`;
                            onChange('backgroundGradient', gradientString);
                          }}
                          className="w-8 h-8 bg-[#2a2a2a] border border-[#3a3a3a] rounded cursor-pointer"
                        />
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={colorStop.position}
                          onChange={(e) => {
                            const newColors = [...(element.props.gradientColors || [{ color: '#667eea', position: 0 }, { color: '#764ba2', position: 100 }])];
                            newColors[index] = { ...newColors[index], position: parseInt(e.target.value) };
                            onChange('gradientColors', newColors);
                            onChange('backgroundType', 'gradient');
                            
                            // Actualizar gradiente
                            const type = element.props.gradientType || 'linear';
                            const direction = element.props.gradientDirection || '135deg';
                            const gradientString = type === 'linear' 
                              ? `linear-gradient(${direction}, ${newColors.map(c => `${c.color} ${c.position}%`).join(', ')})`
                              : `radial-gradient(circle, ${newColors.map(c => `${c.color} ${c.position}%`).join(', ')})`;
                            onChange('backgroundGradient', gradientString);
                          }}
                          className="flex-1 h-2 bg-[#2a2a2a] rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-xs text-gray-400 w-10">{colorStop.position}%</span>
                        {(element.props.gradientColors || []).length > 2 && (
                          <button
                            onClick={() => {
                              const newColors = (element.props.gradientColors || []).filter((_, i) => i !== index);
                              onChange('gradientColors', newColors);
                              onChange('backgroundType', 'gradient');
                              
                              // Actualizar gradiente
                              const type = element.props.gradientType || 'linear';
                              const direction = element.props.gradientDirection || '135deg';
                              const gradientString = type === 'linear' 
                                ? `linear-gradient(${direction}, ${newColors.map(c => `${c.color} ${c.position}%`).join(', ')})`
                                : `radial-gradient(circle, ${newColors.map(c => `${c.color} ${c.position}%`).join(', ')})`;
                              onChange('backgroundGradient', gradientString);
                            }}
                            className="px-2 py-1 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded"
                            title="Eliminar color"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                    
                    {/* Botón para agregar color */}
                    {(element.props.gradientColors || []).length < 5 && (
                      <button
                        onClick={() => {
                          const currentColors = element.props.gradientColors || [{ color: '#667eea', position: 0 }, { color: '#764ba2', position: 100 }];
                          const newPosition = Math.round((currentColors[currentColors.length - 1].position + currentColors[currentColors.length - 2]?.position || 0) / 2);
                          const newColors = [...currentColors, { color: '#ffffff', position: newPosition }];
                          onChange('gradientColors', newColors);
                          onChange('backgroundType', 'gradient');
                          
                          // Actualizar gradiente
                          const type = element.props.gradientType || 'linear';
                          const direction = element.props.gradientDirection || '135deg';
                          const gradientString = type === 'linear' 
                            ? `linear-gradient(${direction}, ${newColors.map(c => `${c.color} ${c.position}%`).join(', ')})`
                            : `radial-gradient(circle, ${newColors.map(c => `${c.color} ${c.position}%`).join(', ')})`;
                          onChange('backgroundGradient', gradientString);
                        }}
                        className="w-full px-3 py-2 text-xs text-gray-400 hover:text-white bg-[#2a2a2a] hover:bg-[#3a3a3a] border border-dashed border-[#3a3a3a] rounded transition-colors"
                      >
                        + Agregar color
                      </button>
                    )}
                  </div>
                </div>

                {/* Presets de gradiente */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">
                    Presets de gradiente
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { 
                        name: 'Azul', 
                        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        colors: [{ color: '#667eea', position: 0 }, { color: '#764ba2', position: 100 }]
                      },
                      { 
                        name: 'Sunset', 
                        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        colors: [{ color: '#f093fb', position: 0 }, { color: '#f5576c', position: 100 }]
                      },
                      { 
                        name: 'Ocean', 
                        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                        colors: [{ color: '#4facfe', position: 0 }, { color: '#00f2fe', position: 100 }]
                      },
                      { 
                        name: 'Green', 
                        gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                        colors: [{ color: '#43e97b', position: 0 }, { color: '#38f9d7', position: 100 }]
                      }
                    ].map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => {
                          onChange('backgroundGradient', preset.gradient);
                          onChange('backgroundType', 'gradient');
                          onChange('gradientColors', preset.colors);
                          onChange('gradientType', 'linear');
                          onChange('gradientDirection', '135deg');
                        }}
                        className="group relative h-12 rounded border border-[#3a3a3a] hover:border-purple-500 transition-colors overflow-hidden"
                        style={{ background: preset.gradient }}
                        title={`Usar gradiente: ${preset.name}`}
                      >
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center">
                          <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                            {preset.name}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Vista previa del gradiente actual */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">
                    Vista previa
                  </label>
                  <div 
                    className="w-full h-12 rounded border border-[#3a3a3a]"
                    style={{ background: element.props.backgroundGradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Control de efecto Blur */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-medium text-gray-400">
                Efecto Blur (Glassmorphism)
              </label>
              <button
                onClick={() => {
                  const currentBlur = element.props.backgroundBlur || 0;
                  onChange('backgroundBlur', currentBlur > 0 ? 0 : 8);
                }}
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                  (element.props.backgroundBlur || 0) > 0
                    ? 'bg-purple-500 text-white'
                    : 'bg-[#3a3a3a] text-gray-400 hover:text-white'
                }`}
                title="Activar/desactivar efecto blur"
              >
                {(element.props.backgroundBlur || 0) > 0 ? (
                  <><FiEye className="w-3 h-3" /><span>ON</span></>
                ) : (
                  <><FiEyeOff className="w-3 h-3" /><span>OFF</span></>
                )}
              </button>
            </div>
            
            {/* Slider de intensidad del blur */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="30"
                  step="1"
                  value={element.props.backgroundBlur || 0}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    onChange('backgroundBlur', value);
                  }}
                  className="flex-1 h-3 bg-[#2a2a2a] rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${((element.props.backgroundBlur || 0) / 30) * 100}%, #2a2a2a ${((element.props.backgroundBlur || 0) / 30) * 100}%, #2a2a2a 100%)`,
                    WebkitAppearance: 'none',
                    outline: 'none'
                  }}
                />
                <input
                  type="number"
                  min="0"
                  max="30"
                  step="1"
                  value={element.props.backgroundBlur || 0}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0;
                    onChange('backgroundBlur', Math.max(0, Math.min(30, value)));
                  }}
                  className="w-16 px-2 py-1 bg-[#2a2a2a] border border-[#3a3a3a] rounded text-white text-xs text-center"
                />
                <span className="text-xs text-gray-500 w-6">px</span>
              </div>
              
              {/* Presets de blur */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">
                  Presets rápidos
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { name: 'Sin blur', value: 0, desc: 'Sin desenfoque' },
                    { name: 'Suave', value: 6, desc: 'Desenfoque ligero' },
                    { name: 'Medio', value: 12, desc: 'Desenfoque moderado' },
                    { name: 'Fuerte', value: 20, desc: 'Desenfoque intenso' }
                  ].map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => {
                        onChange('backgroundBlur', preset.value);
                      }}
                      className={`px-2 py-2 rounded text-xs transition-colors ${
                        (element.props.backgroundBlur || 0) === preset.value
                          ? 'bg-purple-500 text-white'
                          : 'bg-[#2a2a2a] text-gray-400 hover:bg-[#3a3a3a] hover:text-white'
                      }`}
                      title={preset.desc}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
                
                <p className="text-xs text-gray-500 mt-2">
                  🎆 El efecto blur desenfoca lo que está detrás del contenedor, ideal para efectos glassmorphism
                </p>
              </div>
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
                {element.props.backgroundImage && (
                  <button
                    onClick={() => {
                      onChange('backgroundImage', '');
                    }}
                    className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 rounded transition-colors"
                    title="Eliminar imagen de fondo"
                  >
                    ×
                  </button>
                )}
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
                {element.props.backgroundImage && element.props.backgroundImage.startsWith('data:') && (
                  <button
                    onClick={() => {
                      onChange('backgroundImage', '');
                    }}
                    className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 rounded transition-colors"
                    title="Eliminar imagen de fondo"
                  >
                    ×
                  </button>
                )}
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

          {/* Control de opacidad de la imagen */}
          {element.props.backgroundImage && (
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">
                Opacidad de la imagen
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={element.props.backgroundOpacity || 1}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    onChange('backgroundOpacity', value);
                  }}
                  className="flex-1 h-2 bg-[#2a2a2a] rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${((element.props.backgroundOpacity || 1) * 100)}%, #2a2a2a ${((element.props.backgroundOpacity || 1) * 100)}%, #2a2a2a 100%)`,
                    WebkitAppearance: 'none',
                    outline: 'none'
                  }}
                />
                <span className="text-xs text-gray-400 w-12">
                  {Math.round((element.props.backgroundOpacity || 1) * 100)}%
                </span>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}

export default BackgroundSelector;