// Servicio para cargar y gestionar Google Fonts dinámicamente

// Lista de tipografías populares de Google Fonts
export const GOOGLE_FONTS = [
  // Sans Serif - Modernas y limpias
  { name: 'Inter', category: 'sans-serif', weights: [300, 400, 500, 600, 700] },
  { name: 'Roboto', category: 'sans-serif', weights: [300, 400, 500, 700] },
  { name: 'Open Sans', category: 'sans-serif', weights: [300, 400, 600, 700] },
  { name: 'Poppins', category: 'sans-serif', weights: [300, 400, 500, 600, 700] },
  { name: 'Lato', category: 'sans-serif', weights: [300, 400, 700] },
  { name: 'Montserrat', category: 'sans-serif', weights: [300, 400, 500, 600, 700] },
  { name: 'Source Sans Pro', category: 'sans-serif', weights: [300, 400, 600, 700] },
  { name: 'Nunito', category: 'sans-serif', weights: [300, 400, 600, 700] },
  
  // Serif - Elegantes y clásicas
  { name: 'Playfair Display', category: 'serif', weights: [400, 500, 700] },
  { name: 'Merriweather', category: 'serif', weights: [300, 400, 700] },
  { name: 'Lora', category: 'serif', weights: [400, 500, 700] },
  { name: 'Source Serif Pro', category: 'serif', weights: [400, 600, 700] },
  { name: 'Crimson Text', category: 'serif', weights: [400, 600, 700] },
  
  // Display - Para títulos y encabezados llamativos
  { name: 'Oswald', category: 'display', weights: [300, 400, 500, 700] },
  { name: 'Bebas Neue', category: 'display', weights: [400] },
  { name: 'Raleway', category: 'display', weights: [300, 400, 500, 700] },
  { name: 'Anton', category: 'display', weights: [400] },
  { name: 'Abril Fatface', category: 'display', weights: [400] },
  
  // Handwriting - Creativas y personales
  { name: 'Dancing Script', category: 'handwriting', weights: [400, 700] },
  { name: 'Pacifico', category: 'handwriting', weights: [400] },
  { name: 'Lobster', category: 'handwriting', weights: [400] },
  
  // Monospace - Para código o diseños técnicos
  { name: 'JetBrains Mono', category: 'monospace', weights: [300, 400, 500, 700] },
  { name: 'Fira Code', category: 'monospace', weights: [300, 400, 500, 700] },
  { name: 'Source Code Pro', category: 'monospace', weights: [300, 400, 600] }
];

// Tipografías más populares para mostrar primero
export const POPULAR_FONTS = [
  'Inter',
  'Roboto', 
  'Open Sans',
  'Poppins',
  'Montserrat',
  'Playfair Display',
  'Lora',
  'Oswald'
];

// Cache de fuentes y pesos cargados para evitar cargas duplicadas
const loadedFonts = new Map(); // fontName -> Set of loaded weights

/**
 * Carga una tipografía de Google Fonts dinámicamente
 * @param {string} fontName - Nombre de la tipografía
 * @param {number[]} weights - Pesos de fuente a cargar (opcional)
 */
export const loadGoogleFont = (fontName, weights = [400]) => {
  // Verificar qué pesos ya están cargados
  const loadedWeights = loadedFonts.get(fontName) || new Set();
  const newWeights = weights.filter(weight => !loadedWeights.has(weight));
  
  // Si todos los pesos ya están cargados, no hacer nada
  if (newWeights.length === 0) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    try {
      // Encontrar la configuración de la fuente
      const fontConfig = GOOGLE_FONTS.find(font => font.name === fontName);
      
      if (!fontConfig) {
        console.warn(`Fuente ${fontName} no encontrada en la configuración`);
        resolve(); // No rechazar, usar fuente por defecto
        return;
      }

      // Filtrar solo los pesos disponibles para esta fuente
      const availableWeights = newWeights.filter(weight => 
        fontConfig.weights.includes(weight)
      );
      
      // Si no hay pesos válidos, no hacer nada
      if (availableWeights.length === 0) {
        resolve();
        return;
      }
      
      const weightsToLoad = availableWeights;
      
      // Crear el nombre de la fuente para Google Fonts API
      const fontNameForUrl = fontName.replace(/\s+/g, '+');
      const weightsParam = weightsToLoad.join(';');
      
      // URL de Google Fonts
      const googleFontUrl = `https://fonts.googleapis.com/css2?family=${fontNameForUrl}:wght@${weightsParam}&display=swap`;
      
      // Crear un identificador único para esta combinación de fuente y pesos
      const fontId = `${fontName}-${weightsToLoad.join('-')}`;
      
      // Verificar si ya existe un link con esta URL exacta
      const existingLink = document.querySelector(`link[href="${googleFontUrl}"]`);
      if (existingLink) {
        // Marcar como cargado en el cache
        const currentWeights = loadedFonts.get(fontName) || new Set();
        weightsToLoad.forEach(weight => currentWeights.add(weight));
        loadedFonts.set(fontName, currentWeights);
        resolve();
        return;
      }
      
      // Crear elemento link para cargar la fuente
      const link = document.createElement('link');
      link.href = googleFontUrl;
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.setAttribute('data-font-family', fontName);
      link.setAttribute('data-font-weights', weightsToLoad.join(','));
      
      // Eventos de carga
      link.onload = () => {
        // Marcar los pesos cargados en el cache
        const currentWeights = loadedFonts.get(fontName) || new Set();
        weightsToLoad.forEach(weight => currentWeights.add(weight));
        loadedFonts.set(fontName, currentWeights);
        
        console.log(`✅ Google Font cargada: ${fontName} (pesos: ${weightsToLoad.join(', ')})`);
        resolve();
      };
      
      link.onerror = (error) => {
        console.error(`❌ Error cargando Google Font: ${fontName}`, error);
        resolve(); // No rechazar para no romper la UI
      };
      
      // Agregar al head del documento
      document.head.appendChild(link);
      
    } catch (error) {
      console.error(`Error al cargar Google Font ${fontName}:`, error);
      resolve(); // No rechazar para no romper la UI
    }
  });
};

/**
 * Precargar las fuentes más populares
 */
export const preloadPopularFonts = () => {
  console.log('🔤 Precargando tipografías populares...');
  
  POPULAR_FONTS.slice(0, 5).forEach(fontName => {
    loadGoogleFont(fontName, [400, 700]);
  });
};

/**
 * Obtener el CSS font-family correcto para una tipografía
 * @param {string} fontName - Nombre de la tipografía
 * @returns {string} - String CSS para font-family
 */
export const getFontFamily = (fontName) => {
  if (!fontName || fontName === 'default') {
    return 'system-ui, -apple-system, sans-serif';
  }
  
  const fontConfig = GOOGLE_FONTS.find(font => font.name === fontName);
  
  if (!fontConfig) {
    return `"${fontName}", system-ui, -apple-system, sans-serif`;
  }
  
  // Agregar fallbacks según la categoría
  const fallbacks = {
    'sans-serif': 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
    'serif': 'Georgia, "Times New Roman", Times, serif',
    'display': 'system-ui, -apple-system, sans-serif',
    'handwriting': 'cursive',
    'monospace': '"Courier New", Courier, monospace'
  };
  
  return `"${fontName}", ${fallbacks[fontConfig.category] || fallbacks['sans-serif']}`;
};

/**
 * Obtener fuentes agrupadas por categoría para el selector
 */
/**
 * Cargar un peso específico de una fuente (útil cuando se cambia el peso)
 * @param {string} fontName - Nombre de la tipografía
 * @param {number} weight - Peso específico a cargar
 */
export const loadFontWeight = (fontName, weight) => {
  return loadGoogleFont(fontName, [weight]);
};

export const getFontsByCategory = () => {
  const grouped = {
    popular: [],
    'sans-serif': [],
    serif: [],
    display: [],
    handwriting: [],
    monospace: []
  };
  
  // Agregar fuentes populares
  POPULAR_FONTS.forEach(fontName => {
    const font = GOOGLE_FONTS.find(f => f.name === fontName);
    if (font) {
      grouped.popular.push(font);
    }
  });
  
  // Agrupar el resto por categorías
  GOOGLE_FONTS.forEach(font => {
    if (!POPULAR_FONTS.includes(font.name)) {
      grouped[font.category].push(font);
    }
  });
  
  return grouped;
};