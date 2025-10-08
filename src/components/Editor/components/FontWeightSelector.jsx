import React, { useMemo } from 'react';
import { GOOGLE_FONTS, loadFontWeight } from '../../../services/googleFonts';

/**
 * Componente selector de peso de tipografía
 * Muestra solo los pesos disponibles para la fuente seleccionada
 */
function FontWeightSelector({ 
  fontFamily = 'default', 
  value = '400', 
  onChange, 
  className = "" 
}) {
  
  // Obtener los pesos disponibles para la fuente actual
  const availableWeights = useMemo(() => {
    if (!fontFamily || fontFamily === 'default') {
      // Para fuentes del sistema, mostrar pesos estándar
      return [
        { value: '300', label: '300 - Ligera' },
        { value: '400', label: '400 - Normal' },
        { value: '500', label: '500 - Media' },
        { value: '600', label: '600 - Semi-Bold' },
        { value: '700', label: '700 - Negrita' },
        { value: '800', label: '800 - Extra Bold' },
        { value: '900', label: '900 - Black' }
      ];
    }
    
    // Buscar la fuente en Google Fonts
    const googleFont = GOOGLE_FONTS.find(font => font.name === fontFamily);
    
    if (googleFont && googleFont.weights) {
      return googleFont.weights.map(weight => {
        const weightLabels = {
          100: '100 - Thin',
          200: '200 - Extra Light',
          300: '300 - Ligera',
          400: '400 - Normal',
          500: '500 - Media',
          600: '600 - Semi-Bold',
          700: '700 - Negrita',
          800: '800 - Extra Bold',
          900: '900 - Black'
        };
        
        return {
          value: weight.toString(),
          label: weightLabels[weight] || `${weight}`
        };
      });
    }
    
    // Fallback a pesos estándar
    return [
      { value: '400', label: '400 - Normal' },
      { value: '700', label: '700 - Negrita' }
    ];
  }, [fontFamily]);

  // Verificar si el peso actual está disponible, sino usar el primer disponible
  const currentValue = useMemo(() => {
    const isAvailable = availableWeights.some(weight => weight.value === value);
    return isAvailable ? value : availableWeights[0]?.value || '400';
  }, [value, availableWeights]);

  // Si el valor cambió automáticamente, notificar al parent
  React.useEffect(() => {
    if (currentValue !== value) {
      onChange(currentValue);
    }
  }, [currentValue, value, onChange]);

  // Manejar cambio de peso con carga dinámica
  const handleWeightChange = (newWeight) => {
    // Cargar el peso específico si no es fuente por defecto
    if (fontFamily && fontFamily !== 'default') {
      loadFontWeight(fontFamily, parseInt(newWeight));
    }
    
    onChange(newWeight);
  };

  return (
    <div className={className}>
      <label className="block text-xs font-medium text-gray-400 mb-2">
        Peso de la tipografía
      </label>
      
      <select
        value={currentValue}
        onChange={(e) => handleWeightChange(e.target.value)}
        className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-3 py-2 text-white text-sm hover:bg-[#3a3a3a] transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      >
        {availableWeights.map(weight => (
          <option key={weight.value} value={weight.value}>
            {weight.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default FontWeightSelector;