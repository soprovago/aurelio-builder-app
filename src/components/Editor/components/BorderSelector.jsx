import React, { useState, useCallback } from 'react';
import { FiSquare, FiCircle, FiMinus } from 'react-icons/fi';
import { getPreviewStyles } from '../../../shared/utils/borderUtils';
import { getProgressGradientStyle } from '../../../shared/utils/sliderUtils';
import BorderTypeSelector from './BorderTypeSelector';

/**
 * Componente selector de bordes para contenedores
 * Soporta bordes sólidos y bordes degradados
 */
function BorderSelector({ 
  element,
  onChange, 
  className = "" 
}) {
  // Determinar el tipo de borde actual
  const currentBorderType = element.props.borderType || 'solid';
  
  // Estados locales para mejor UX - sincronizar con props
  const [borderType, setBorderType] = useState(currentBorderType);
  
  // Sincronizar estado local con props cuando cambien
  React.useEffect(() => {
    setBorderType(element.props.borderType || 'solid');
  }, [element.props.borderType]);

  // Manejar cambio de tipo de borde
  const handleBorderTypeChange = useCallback((newType) => {
    console.log('🔄 Changing border type to:', newType);
    console.log('🔍 onChange function type:', typeof onChange);
    console.log('🔍 onChange function:', onChange.toString().substring(0, 100));
    
    setBorderType(newType);
    
    console.log('📤 Calling onChange with borderType:', newType);
    onChange('borderType', newType);
    
    console.log('📝 SIMPLIFIED TEST - Only setting borderType, no other changes');
    
    // COMENTADO TEMPORALMENTE PARA PRUEBA
    // // Limpiar propiedades del tipo anterior
    // if (newType === 'solid') {
    //   console.log('🔲 Setting up solid border');
    //   onChange('borderGradientColor1', undefined);
    //   onChange('borderGradientColor2', undefined);
    //   onChange('borderGradientDirection', undefined);
    //   // Establecer valores por defecto para solid si no existen
    //   if (!element.props.borderColor) {
    //     onChange('borderColor', '#cccccc');
    //   }
    //   if (!element.props.borderWidth) {
    //     onChange('borderWidth', '1');
    //   }
    // } else if (newType === 'gradient') {
    //   console.log('🌈 Setting up gradient border');
    //   onChange('border', undefined);
    //   onChange('borderColor', undefined);
    //   // Establecer valores por defecto para gradient
    //   if (!element.props.borderGradientColor1) {
    //     onChange('borderGradientColor1', '#8b5cf6');
    //   }
    //   if (!element.props.borderGradientColor2) {
    //     onChange('borderGradientColor2', '#3b82f6');
    //   }
    //   if (!element.props.borderGradientDirection) {
    //     onChange('borderGradientDirection', '45deg');
    //   }
    //   if (!element.props.borderWidth) {
    //     onChange('borderWidth', '3');
    //   }
    // }
    
    // El log se ejecutará en el próximo render cuando las props se hayan actualizado
    setTimeout(() => {
      console.log('📊 Element props after update:', {
        borderType: element.props.borderType,
        borderWidth: element.props.borderWidth,
        color1: element.props.borderGradientColor1,
        color2: element.props.borderGradientColor2,
        direction: element.props.borderGradientDirection
      });
    }, 100);
  }, [onChange, element.props]);

  // Debug simplificado - solo para errores
  if (element.props.borderType === 'gradient' && !element.props.borderGradientColor1) {
    console.warn('⚠️ BorderSelector: gradient border without colors');
  }

  return (
    <div className={className}>
      {/* Selector moderno de tipo de borde */}
      <BorderTypeSelector
        borderType={borderType}
        onChange={(newType) => {
          console.log('🔄 BorderTypeSelector onChange:', newType);
          handleBorderTypeChange(newType);
        }}
        className="mb-4"
      />

      {/* Controles para borde sólido */}
      {borderType === 'solid' && (
        <div className="space-y-4">
          {/* Ancho del borde */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">
              Ancho del borde
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="20"
                value={parseInt(element.props.borderWidth || '1')}
                onChange={(e) => onChange('borderWidth', e.target.value)}
                className="flex-1 custom-slider progress-gradient"
                style={getProgressGradientStyle(parseInt(element.props.borderWidth || '1'), 0, 20)}
              />
              <span className="text-xs text-gray-400 min-w-[30px]">
                {element.props.borderWidth || '1'}px
              </span>
            </div>
          </div>

          {/* Color del borde */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">
              Color del borde
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={element.props.borderColor || '#cccccc'}
                onChange={(e) => onChange('borderColor', e.target.value)}
                className="w-8 h-8 bg-[#2a2a2a] border border-[#3a3a3a] rounded cursor-pointer"
              />
              <input
                type="text"
                value={element.props.borderColor || '#cccccc'}
                onChange={(e) => onChange('borderColor', e.target.value)}
                className="flex-1 px-2 py-1 bg-[#2a2a2a] border border-[#3a3a3a] rounded text-white text-xs font-mono"
                placeholder="#cccccc"
              />
            </div>
          </div>

          {/* Estilo del borde */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">
              Estilo del borde
            </label>
            <select
              value={element.props.borderStyle || 'solid'}
              onChange={(e) => onChange('borderStyle', e.target.value)}
              className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-3 py-2 text-white text-sm hover:bg-[#3a3a3a] transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="solid">Sólido</option>
              <option value="dashed">Discontinuo</option>
              <option value="dotted">Punteado</option>
              <option value="double">Doble</option>
            </select>
          </div>
        </div>
      )}

      {/* Controles para borde degradado */}
      {borderType === 'gradient' && (
        <div className="space-y-4">
          {/* Ancho del borde degradado */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">
              Ancho del borde
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="1"
                max="20"
                value={parseInt(element.props.borderWidth || '3')}
                onChange={(e) => onChange('borderWidth', e.target.value)}
                className="flex-1 custom-slider progress-gradient"
                style={getProgressGradientStyle(parseInt(element.props.borderWidth || '3'), 1, 20)}
              />
              <span className="text-xs text-gray-400 min-w-[30px]">
                {element.props.borderWidth || '3'}px
              </span>
            </div>
          </div>

          {/* Color 1 del degradado */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">
              Color inicial
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={element.props.borderGradientColor1 || '#8b5cf6'}
                onChange={(e) => onChange('borderGradientColor1', e.target.value)}
                className="w-8 h-8 bg-[#2a2a2a] border border-[#3a3a3a] rounded cursor-pointer"
              />
              <input
                type="text"
                value={element.props.borderGradientColor1 || '#8b5cf6'}
                onChange={(e) => onChange('borderGradientColor1', e.target.value)}
                className="flex-1 px-2 py-1 bg-[#2a2a2a] border border-[#3a3a3a] rounded text-white text-xs font-mono"
                placeholder="#8b5cf6"
              />
            </div>
          </div>

          {/* Color 2 del degradado */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">
              Color final
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={element.props.borderGradientColor2 || '#3b82f6'}
                onChange={(e) => onChange('borderGradientColor2', e.target.value)}
                className="w-8 h-8 bg-[#2a2a2a] border border-[#3a3a3a] rounded cursor-pointer"
              />
              <input
                type="text"
                value={element.props.borderGradientColor2 || '#3b82f6'}
                onChange={(e) => onChange('borderGradientColor2', e.target.value)}
                className="flex-1 px-2 py-1 bg-[#2a2a2a] border border-[#3a3a3a] rounded text-white text-xs font-mono"
                placeholder="#3b82f6"
              />
            </div>
          </div>

          {/* Dirección del degradado */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">
              Dirección del degradado
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: '0deg', label: '↑', name: 'Arriba' },
                { value: '45deg', label: '↗', name: 'Arriba-Der' },
                { value: '90deg', label: '→', name: 'Derecha' },
                { value: '135deg', label: '↘', name: 'Abajo-Der' },
                { value: '180deg', label: '↓', name: 'Abajo' },
                { value: '225deg', label: '↙', name: 'Abajo-Izq' },
                { value: '270deg', label: '←', name: 'Izquierda' },
                { value: '315deg', label: '↖', name: 'Arriba-Izq' },
                { value: 'radial', label: '⊙', name: 'Radial' }
              ].map((direction) => (
                <button
                  key={direction.value}
                  onClick={() => onChange('borderGradientDirection', direction.value)}
                  className={`p-2 rounded text-center transition-all duration-200 ${
                    (element.props.borderGradientDirection || '45deg') === direction.value
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

        </div>
      )}

      {/* Radio del borde (común para ambos tipos) */}
      <div className="mt-4">
        <label className="block text-xs font-medium text-gray-400 mb-2">
          Radio del borde
        </label>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="0"
            max="50"
            value={parseInt(element.props.borderRadius || '0')}
            onChange={(e) => onChange('borderRadius', e.target.value + 'px')}
            className="flex-1 custom-slider progress-gradient"
            style={getProgressGradientStyle(parseInt(element.props.borderRadius || '0'), 0, 50)}
          />
          <span className="text-xs text-gray-400 min-w-[35px]">
            {element.props.borderRadius || '0px'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default BorderSelector;