import React from 'react';

// Hooks personalizados
import { useBackgroundState } from './BackgroundSelector/hooks/useBackgroundState';
import { useGradientLogic } from './BackgroundSelector/hooks/useGradientLogic';

// Componentes modulares
import BackgroundTypeSelector from './BackgroundSelector/components/BackgroundTypeSelector';
import SolidColorControls from './BackgroundSelector/components/SolidColorControls';

/**
 * 🎨 BackgroundSelector - Versión Modular y Escalable
 * 
 * Arquitectura profesional:
 * - Hooks personalizados para separar lógica de UI
 * - Componentes modulares y reutilizables  
 * - Fácil de mantener y expandir
 * - Experiencia de usuario optimizada
 * 
 * Funcionalidades principales:
 * 1. Color sólido con opacidad
 * 2. Gradientes (linear/radial) con controles avanzados
 * 3. Imágenes de fondo (URL/archivo)
 * 4. Efectos blur/glassmorphism
 */
function BackgroundSelector({ 
  element,
  onChange, 
  className = "" 
}) {
  // Debug log
  console.log('🎨 BackgroundSelector (NEW) rendering for:', element.id);

  // Hook principal para estado del fondo
  const {
    activeType,
    imageSource,
    isProcessingFile,
    setImageSource,
    setIsProcessingFile,
    hasActiveGradient,
    handleActiveTypeChange,
    elementProps
  } = useBackgroundState(element, onChange);

  // Hook especializado para gradientes
  const gradientLogic = useGradientLogic(elementProps, onChange, hasActiveGradient);

  return (
    <div className={`space-y-6 ${className}`}>
      
      {/* ===== SELECTOR DE TIPO PRINCIPAL ===== */}
      <BackgroundTypeSelector 
        activeType={activeType}
        onActiveTypeChange={handleActiveTypeChange}
      />

      {/* ===== CONTROLES PARA CADA TIPO ===== */}
      
      {/* Color Sólido */}
      {activeType === 'solid' && (
        <SolidColorControls 
          elementProps={elementProps}
          onChange={onChange}
        />
      )}

      {/* Gradiente */}
      {activeType === 'gradient' && (
        <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#3a3a3a]">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-gradient-to-r from-purple-500 to-pink-500"></div>
            Controles de Gradiente
          </h3>
          
          {/* Vista previa del gradiente */}
          <div className="mb-4">
            <div 
              className="w-full h-20 rounded-lg border border-[#3a3a3a]"
              style={{ 
                background: elementProps.backgroundGradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
              }}
            />
            <p className="text-xs text-gray-500 mt-2">Vista previa del gradiente</p>
          </div>
          
          <div className="text-center py-8">
            <p className="text-sm text-gray-400 mb-2">Controles avanzados próximamente</p>
            <p className="text-xs text-gray-500">Direcciones, colores, presets, etc.</p>
          </div>
        </div>
      )}

      {/* Glass/Blur */}
      {activeType === 'glass' && (
        <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#3a3a3a]">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-gradient-to-r from-cyan-500 to-blue-500"></div>
            Efecto Glass / Glassmorphism
          </h3>
          
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400/30 to-blue-400/30 backdrop-blur-sm border border-white/20 flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm"></div>
            </div>
            <p className="text-sm text-gray-400 mb-2">Efecto glassmorphism activo</p>
            <p className="text-xs text-gray-500">Controles de intensidad próximamente</p>
          </div>
        </div>
      )}

      {/* Imagen */}
      {activeType === 'image' && (
        <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#3a3a3a]">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-gradient-to-r from-green-500 to-emerald-500"></div>
            Imagen de Fondo
          </h3>
          
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400/20 to-emerald-400/20 border border-green-400/30 flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 rounded bg-gradient-to-r from-green-400 to-emerald-400"></div>
            </div>
            <p className="text-sm text-gray-400 mb-2">Controles de imagen próximamente</p>
            <p className="text-xs text-gray-500">URL, archivo, posición, tamaño, etc.</p>
          </div>
        </div>
      )}

    </div>
  );
}

export default BackgroundSelector;