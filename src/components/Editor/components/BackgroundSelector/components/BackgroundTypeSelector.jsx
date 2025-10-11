import React from 'react';
import { FiSquare, FiImage, FiEye } from 'react-icons/fi';
import SegmentedControl from '../../SegmentedControl';

/**
 * Componente para seleccionar el tipo de fondo con iconos verticales
 * 4 tipos: Sólido, Degradado, Glass, Imagen
 */
function BackgroundTypeSelector({ 
  activeType, 
  onActiveTypeChange 
}) {
  
  const backgroundTypes = [
    {
      value: 'solid',
      name: 'Sólido',
      icon: FiSquare,
      description: 'Color sólido uniforme'
    },
    {
      value: 'gradient',
      name: 'Degradado',
      icon: () => (
        <div className="w-4 h-4 rounded bg-gradient-to-r from-purple-500 to-pink-500" />
      ),
      customIcon: true,
      description: 'Gradiente de colores'
    },
    {
      value: 'glass',
      name: 'Glass',
      icon: FiEye,
      description: 'Efecto glassmorphism'
    },
    {
      value: 'image',
      name: 'Imagen',
      icon: FiImage,
      description: 'Imagen de fondo'
    }
  ];

  return (
    <div>
      <label className="block text-xs font-medium text-gray-400 mb-3">
        Tipo de fondo
      </label>
      
      <SegmentedControl
        options={backgroundTypes}
        activeValue={activeType}
        onChange={onActiveTypeChange}
      />
    </div>
  );
}

export default BackgroundTypeSelector;
