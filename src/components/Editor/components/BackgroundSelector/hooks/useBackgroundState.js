import { useState, useEffect, useCallback } from 'react';

/**
 * Hook personalizado para manejar el estado del selector de fondo
 * Centraliza toda la lógica de estado y sincronización
 */
export const useBackgroundState = (element, onChange) => {
  // Estados locales - ahora maneja 4 tipos: solid, gradient, glass, image
  const [activeType, setActiveType] = useState('solid');
  const [imageSource, setImageSource] = useState('url');
  const [isProcessingFile, setIsProcessingFile] = useState(false);

  // Función helper para detectar gradiente activo
  const hasActiveGradient = useCallback((gradient) => {
    return gradient && 
           gradient !== null &&
           gradient !== undefined &&
           typeof gradient === 'string' &&
           gradient.trim() !== '' &&
           gradient !== 'none';
  }, []);

  // Sincronizar estado SOLO al montar el componente (primera vez)
  useEffect(() => {
    // Solo ejecutar en el primer render para establecer estado inicial
    const currentType = element.props.backgroundType || 'solid';
    
    let initialType = 'solid';
    if (currentType === 'image') {
      initialType = 'image';
    } else if (currentType === 'gradient' || (element.props.backgroundGradient && element.props.backgroundGradient !== null && element.props.backgroundGradient !== '')) {
      initialType = 'gradient';
    } else if (currentType === 'blur' || (element.props.backgroundBlur && element.props.backgroundBlur > 0)) {
      initialType = 'glass';
    }
    
    console.log('🎆 Initial setup - setting activeType to:', initialType);
    setActiveType(initialType);
    
    // Detectar automáticamente el tipo de fuente de imagen
    if (element.props.backgroundImage) {
      if (element.props.backgroundImage.startsWith('data:')) {
        setImageSource('file');
      } else {
        setImageSource('url');
      }
    }
  }, []); // Solo al montar - sin dependencias

  // Cambiar tipo de fondo principal
  const handleActiveTypeChange = useCallback((newType) => {
    console.log('🎯 CLICK: Changing active type from', activeType, 'to:', newType);
    
    // Actualizar inmediatamente el estado local para UI responsiva
    setActiveType(newType);
    
    // Aplicar cambios inmediatamente
    console.log('🔄 Applying changes for type:', newType);
    
    switch (newType) {
        case 'solid':
          console.log('🟦 Setting up solid background');
          onChange('backgroundType', 'color');
          onChange('backgroundGradient', null);
          onChange('backgroundBlur', 0);
          onChange('backgroundImage', undefined);
          if (!element.props.backgroundColor) {
            onChange('backgroundColor', '#f8fafc');
          }
          break;
          
        case 'gradient':
          console.log('🌈 Setting up gradient background');
          onChange('backgroundType', 'gradient');
          onChange('backgroundBlur', 0);
          onChange('backgroundImage', undefined);
          // Establecer gradiente por defecto si no existe
          if (!element.props.backgroundGradient) {
            const defaultColors = [{ color: '#667eea', position: 0 }, { color: '#764ba2', position: 100 }];
            const defaultDirection = '135deg';
            const gradientString = `linear-gradient(${defaultDirection}, ${defaultColors.map(c => `${c.color} ${c.position}%`).join(', ')})`;
            onChange('backgroundGradient', gradientString);
            onChange('gradientColors', defaultColors);
            onChange('gradientDirection', defaultDirection);
            onChange('gradientType', 'linear');
          }
          break;
          
        case 'glass':
          console.log('🧐 Setting up glass background');
          onChange('backgroundType', 'blur');
          onChange('backgroundGradient', null);
          onChange('backgroundImage', undefined);
          onChange('backgroundBlur', 10);
          onChange('backgroundOpacity', 0.3);
          break;
          
        case 'image':
          console.log('🖼️ Setting up image background');
          onChange('backgroundType', 'image');
          onChange('backgroundGradient', null);
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
          break;
    }
    
    console.log('🏁 Finished applying changes for:', newType);
  }, [onChange, element.props, activeType]);

  return {
    // Estados
    activeType,
    imageSource,
    isProcessingFile,
    setImageSource,
    setIsProcessingFile,
    
    // Funciones
    hasActiveGradient,
    handleActiveTypeChange,
    
    // Props del elemento
    elementProps: element.props
  };
};