import { useCallback } from 'react';

/**
 * Hook especializado para manejar la lógica de gradientes
 * Separa toda la complejidad de gradientes en su propio módulo
 */
export const useGradientLogic = (elementProps, onChange, hasActiveGradient) => {
  
  // Toggle gradiente ON/OFF
  const toggleGradient = useCallback(() => {
    console.log('⚡ GRADIENT BUTTON CLICKED!');
    
    const hasGradient = hasActiveGradient(elementProps.backgroundGradient);
    console.log('🔍 Current gradient state:', hasGradient);
    
    if (hasGradient) {
      console.log('🔴 Disabling gradient');
      onChange('backgroundGradient', null);
      onChange('backgroundType', 'color');
    } else {
      console.log('🟢 Enabling gradient');
      const colors = elementProps.gradientColors || [
        { color: '#667eea', position: 0 }, 
        { color: '#764ba2', position: 100 }
      ];
      const direction = elementProps.gradientDirection || '135deg';
      const gradientString = `linear-gradient(${direction}, ${colors.map(c => `${c.color} ${c.position}%`).join(', ')})`;
      
      onChange('backgroundType', 'gradient');
      onChange('backgroundGradient', gradientString);
    }
  }, [elementProps, onChange, hasActiveGradient]);

  // Cambiar tipo de gradiente (linear/radial)
  const changeGradientType = useCallback((type) => {
    onChange('gradientType', type);
    onChange('backgroundType', 'gradient');
    
    const colors = elementProps.gradientColors || [
      { color: '#667eea', position: 0 }, 
      { color: '#764ba2', position: 100 }
    ];
    
    let gradientString;
    if (type === 'linear') {
      const direction = elementProps.gradientDirection || '135deg';
      gradientString = `linear-gradient(${direction}, ${colors.map(c => `${c.color} ${c.position}%`).join(', ')})`;
    } else {
      gradientString = `radial-gradient(circle, ${colors.map(c => `${c.color} ${c.position}%`).join(', ')})`;
    }
    
    onChange('backgroundGradient', gradientString);
  }, [elementProps, onChange]);

  // Cambiar dirección del gradiente
  const changeGradientDirection = useCallback((direction) => {
    onChange('gradientDirection', direction);
    onChange('backgroundType', 'gradient');
    
    const colors = elementProps.gradientColors || [
      { color: '#667eea', position: 0 }, 
      { color: '#764ba2', position: 100 }
    ];
    const gradientString = `linear-gradient(${direction}, ${colors.map(c => `${c.color} ${c.position}%`).join(', ')})`;
    onChange('backgroundGradient', gradientString);
  }, [elementProps, onChange]);

  // Actualizar colores del gradiente
  const updateGradientColors = useCallback((newColors) => {
    onChange('gradientColors', newColors);
    onChange('backgroundType', 'gradient');
    
    const type = elementProps.gradientType || 'linear';
    const direction = elementProps.gradientDirection || '135deg';
    const gradientString = type === 'linear' 
      ? `linear-gradient(${direction}, ${newColors.map(c => `${c.color} ${c.position}%`).join(', ')})`
      : `radial-gradient(circle, ${newColors.map(c => `${c.color} ${c.position}%`).join(', ')})`;
    onChange('backgroundGradient', gradientString);
  }, [elementProps, onChange]);

  // Aplicar preset de gradiente
  const applyGradientPreset = useCallback((preset) => {
    onChange('backgroundGradient', preset.gradient);
    onChange('backgroundType', 'gradient');
    onChange('gradientColors', preset.colors);
    onChange('gradientType', 'linear');
    onChange('gradientDirection', '135deg');
  }, [onChange]);

  // Presets predefinidos
  const gradientPresets = [
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
  ];

  // Direcciones disponibles
  const gradientDirections = [
    { value: '0deg', label: '↑', name: 'Arriba' },
    { value: '45deg', label: '↗', name: 'Arriba-Derecha' },
    { value: '90deg', label: '→', name: 'Derecha' },
    { value: '135deg', label: '↘', name: 'Abajo-Derecha' },
    { value: '180deg', label: '↓', name: 'Abajo' },
    { value: '225deg', label: '↙', name: 'Abajo-Izquierda' },
    { value: '270deg', label: '←', name: 'Izquierda' },
    { value: '315deg', label: '↖', name: 'Arriba-Izquierda' }
  ];

  return {
    toggleGradient,
    changeGradientType,
    changeGradientDirection,
    updateGradientColors,
    applyGradientPreset,
    gradientPresets,
    gradientDirections
  };
};