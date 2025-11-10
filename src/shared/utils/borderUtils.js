/**
 * Utilidades para generar estilos de borde para contenedores
 * Soporta bordes sólidos y bordes degradados
 */

/**
 * Genera los estilos CSS para un borde basado en las propiedades del elemento
 * @param {Object} props - Propiedades del elemento
 * @returns {Object} - Objeto con estilos CSS para aplicar
 */
export const generateBorderStyles = (props) => {
  const borderType = props.borderType || 'solid';
  // Para gradientes usar un borde más grueso por defecto para que sea visible
  const borderWidth = props.borderWidth || (borderType === 'gradient' ? '4' : '1');
  const borderRadius = props.borderRadius || '0px';
  
  let borderStyles = {
    borderRadius: borderRadius,
  };

  // Comentado - log innecesario
  // if (borderType === 'gradient') {
  //   console.log('🔧 generateBorderStyles for GRADIENT:', { borderType, borderWidth, props });
  // }

  if (borderType === 'gradient') {
    // Borde degradado usando la técnica de background-image dual
    const color1 = props.borderGradientColor1 || '#8b5cf6';
    const color2 = props.borderGradientColor2 || '#3b82f6';
    const direction = props.borderGradientDirection || '45deg';
    // Para bordes degradados, determinar el fondo correcto (imagen o color)
    let backgroundColor;
    if (props.backgroundType === 'image' && props.backgroundImage) {
      // Si hay imagen de fondo, usar un color de respaldo
      backgroundColor = props.backgroundColor || '#f8fafc';
    } else {
      // Solo color
      backgroundColor = props.backgroundColor || '#f8fafc';
    }
    
    // console.log('🌈 Generating gradient border:', { color1, color2, direction, backgroundColor });
    
    // Técnica de doble background: gradiente + color sólido
    let gradientBackground;
    if (direction === 'radial') {
      gradientBackground = `radial-gradient(circle, ${color1}, ${color2})`;
    } else {
      gradientBackground = `linear-gradient(${direction}, ${color1}, ${color2})`;
    }
    
    // Técnica alternativa: usar padding para simular el borde
    borderStyles.background = gradientBackground;
    borderStyles.padding = `${borderWidth}px`;
    
    // Crear un div interno con el fondo real
    borderStyles._isGradientBorder = true;
    borderStyles._innerBackground = backgroundColor;
    borderStyles._borderWidth = borderWidth;
    
    console.log('✅ GRADIENT BORDER APPLIED with width:', borderWidth + 'px');
    
  } else if (borderType === 'solid') {
    // Borde sólido tradicional
    const borderColor = props.borderColor || '#cccccc';
    const borderStyle = props.borderStyle || 'solid';
    
    // Solo aplicar borde si el ancho es mayor a 0
    if (parseInt(borderWidth) > 0) {
      borderStyles.border = `${borderWidth}px ${borderStyle} ${borderColor}`;
    }
  }

  return borderStyles;
};

/**
 * Determina si el elemento tiene un borde visible
 * @param {Object} props - Propiedades del elemento
 * @returns {boolean} - True si el elemento tiene un borde visible
 */
export const hasBorder = (props) => {
  const borderType = props.borderType || 'solid';
  const borderWidth = parseInt(props.borderWidth || '0');
  
  if (borderType === 'gradient') {
    return borderWidth > 0 && props.borderGradientColor1 && props.borderGradientColor2;
  } else if (borderType === 'solid') {
    return borderWidth > 0 && props.borderColor;
  }
  
  return false;
};

/**
 * Genera CSS inline string para usar en elementos que requieren string CSS
 * @param {Object} props - Propiedades del elemento
 * @returns {string} - String CSS para usar en atributos style
 */
export const generateBorderCSSString = (props) => {
  const styles = generateBorderStyles(props);
  
  return Object.entries(styles)
    .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
    .join('; ');
};

/**
 * Obtiene el preview CSS para mostrar en el BorderSelector
 * @param {Object} props - Propiedades del elemento
 * @returns {Object} - Estilos CSS para el preview
 */
export const getPreviewStyles = (props) => {
  const borderType = props.borderType || 'solid';
  const borderWidth = props.borderWidth || (borderType === 'gradient' ? '3' : '1');
  
  if (borderType === 'gradient') {
    const color1 = props.borderGradientColor1 || '#8b5cf6';
    const color2 = props.borderGradientColor2 || '#3b82f6';
    const direction = props.borderGradientDirection || '45deg';
    
    let gradientBackground;
    if (direction === 'radial') {
      gradientBackground = `radial-gradient(circle, ${color1}, ${color2})`;
    } else {
      gradientBackground = `linear-gradient(${direction}, ${color1}, ${color2})`;
    }
    
    return {
      background: `${gradientBackground}, #2a2a2a`,
      backgroundOrigin: 'border-box, content-box',
      backgroundClip: 'border-box, content-box',
      border: `${borderWidth}px solid transparent`,
      borderRadius: props.borderRadius || '0px',
      minHeight: '48px'
    };
  } else {
    const borderColor = props.borderColor || '#cccccc';
    const borderStyle = props.borderStyle || 'solid';
    
    return {
      border: `${borderWidth}px ${borderStyle} ${borderColor}`,
      borderRadius: props.borderRadius || '0px',
      minHeight: '48px',
      backgroundColor: '#2a2a2a'
    };
  }
};
