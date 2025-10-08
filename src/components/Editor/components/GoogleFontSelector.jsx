import React, { useState, useEffect } from 'react';
import { FiType, FiChevronDown } from 'react-icons/fi';
import { GOOGLE_FONTS, getFontsByCategory, loadGoogleFont, getFontFamily } from '../../../services/googleFonts';

/**
 * Componente selector de tipografías de Google Fonts con preview
 */
function GoogleFontSelector({ 
  value = 'default', 
  onChange, 
  previewText = "Aa", 
  className = "",
  showCategory = false // Siempre false ahora
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loadingFont, setLoadingFont] = useState(null);
  
  // Crear lista simple de todas las fuentes
  const allFonts = [
    { name: 'Por defecto', value: 'default', category: 'system' },
    ...GOOGLE_FONTS.map(font => ({ ...font, value: font.name }))
  ];

  // Cargar la fuente seleccionada al montar el componente
  useEffect(() => {
    if (value && value !== 'default') {
      loadGoogleFont(value, [400, 700]);
    }
  }, [value]);

  // Manejar selección de tipografía
  const handleFontSelect = async (fontName) => {
    setLoadingFont(fontName);
    setIsOpen(false);
    
    try {
      // Cargar la fuente si no es la por defecto
      if (fontName !== 'default') {
        // Encontrar la fuente y cargar todos sus pesos disponibles
        const font = GOOGLE_FONTS.find(f => f.name === fontName);
        const weightsToLoad = font ? font.weights : [400, 700];
        
        await loadGoogleFont(fontName, weightsToLoad);
      }
      
      onChange(fontName);
    } catch (error) {
      console.error('Error cargando fuente:', error);
      // Aún así cambiar la fuente para que el usuario vea el cambio
      onChange(fontName);
    } finally {
      setLoadingFont(null);
    }
  };

  // Obtener el nombre de display de la fuente actual
  const getCurrentFontName = () => {
    const font = allFonts.find(f => f.value === value);
    return font ? font.name : 'Por defecto';
  };

  // Renderizar una opción de fuente con preview
  const renderFontOption = (font, isDefault = false) => {
    const fontValue = font.value;
    const displayName = font.name;
    const isSelected = value === fontValue;
    const isLoading = loadingFont === fontValue;
    
    return (
      <div
        key={fontValue}
        onClick={() => handleFontSelect(fontValue)}
        className={`flex items-center justify-between p-3 cursor-pointer transition-colors hover:bg-[#2a2a2a] ${
          isSelected ? 'bg-purple-600/20 border-l-2 border-purple-500' : ''
        }`}
      >
        <div className="flex items-center space-x-3 flex-1">
          <div 
            className="text-lg leading-none"
            style={{ 
              fontFamily: isDefault ? 'system-ui, sans-serif' : getFontFamily(fontValue),
              minWidth: '40px',
              textAlign: 'center'
            }}
          >
            {previewText}
          </div>
          <div>
            <div className="text-sm text-white font-medium">{displayName}</div>
            {!isDefault && (
              <div className="text-xs text-gray-400 capitalize">
                {font.category.replace('-', ' ')}
              </div>
            )}
          </div>
        </div>
        
        {isLoading && (
          <div className="w-4 h-4 border border-purple-500 border-t-transparent rounded-full animate-spin" />
        )}
        
        {isSelected && !isLoading && (
          <div className="w-2 h-2 bg-purple-500 rounded-full" />
        )}
      </div>
    );
  };

  return (
    <div className={`relative ${className}`}>
      {/* Selector principal */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-3 py-2 text-white text-sm cursor-pointer hover:bg-[#3a3a3a] transition-colors flex items-center justify-between"
      >
        <div className="flex items-center space-x-2">
          <FiType className="w-4 h-4 text-gray-400" />
          <div>
            <span 
              style={{ 
                fontFamily: value === 'default' ? 'system-ui, sans-serif' : getFontFamily(value) 
              }}
            >
              {getCurrentFontName()}
            </span>
            {loadingFont === value && (
              <span className="ml-2 text-xs text-gray-400">Cargando...</span>
            )}
          </div>
        </div>
        <FiChevronDown 
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </div>

      {/* Dropdown de opciones */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow-xl max-h-96 overflow-hidden">
          {/* Lista de fuentes */}
          <div className="max-h-64 overflow-y-auto">
            {/* Todas las fuentes en una lista simple */}
            {allFonts.map((font) => 
              renderFontOption(font, font.value === 'default')
            )}
          </div>
        </div>
      )}

      {/* Overlay para cerrar el dropdown */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

export default GoogleFontSelector;