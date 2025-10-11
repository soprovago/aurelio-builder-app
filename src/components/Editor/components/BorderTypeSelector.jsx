import React from 'react';
import { FiSquare } from 'react-icons/fi';
import SegmentedControl from './SegmentedControl';

/**
 * 🎨 BorderTypeSelector - Selector moderno para tipo de borde
 * 
 * Componente que permite seleccionar entre borde sólido y degradado
 * usando el mismo estilo de control segmentado que BackgroundTypeSelector.
 * 
 * Características:
 * - Control segmentado con indicador deslizante
 * - Iconos consistentes con el diseño de la app
 * - Integración perfecta con BorderSelector
 */
function BorderTypeSelector({ 
  borderType = 'solid', 
  onChange,
  className = ""
}) {
  // Definir las opciones para el selector de tipo de borde
  const borderTypeOptions = [
    {
      value: 'solid',
      name: 'Sólido',
      icon: FiSquare,
      description: 'Borde de color sólido'
    },
    {
      value: 'gradient',
      name: 'Degradado',
      icon: () => (
        <div className="w-4 h-4 rounded bg-gradient-to-r from-purple-500 to-blue-500" />
      ),
      customIcon: true,
      description: 'Borde con degradado de colores'
    }
  ];

  return (
    <div className={className}>
      <label className="block text-xs font-medium text-gray-400 mb-3">
        Tipo de borde
      </label>
      
      <SegmentedControl
        options={borderTypeOptions}
        activeValue={borderType}
        onChange={onChange}
        className="mb-0" // Quitamos el margin bottom del control ya que lo manejamos aquí
      />
    </div>
  );
}

export default BorderTypeSelector;