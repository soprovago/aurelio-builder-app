import React from 'react';

/**
 * Wrapper inteligente para elementos hijos dentro de contenedores
 * Maneja el dimensionamiento flexible basado en la dirección del contenedor padre
 */
export function FlexibleChildWrapper({ 
  parentElement, 
  childElement, 
  childIndex, 
  totalChildren, 
  children, 
  className = "" 
}) {
  // Obtener la configuración del contenedor padre
  const parentDirection = parentElement?.props?.flexDirection || 'column';
  const parentJustifyContent = parentElement?.props?.justifyContent || 'flex-start';
  const parentAlignItems = parentElement?.props?.alignItems || 'stretch';
  const parentFlexWrap = parentElement?.props?.flexWrap || 'nowrap';

  // Determinar si el layout es horizontal
  const isHorizontalLayout = parentDirection === 'row' || parentDirection === 'row-reverse';

  // Calcular estilos flexibles basados en el layout del padre
  const calculateFlexStyles = () => {
    let styles = {
      position: 'relative',
      boxSizing: 'border-box'
    };

    if (isHorizontalLayout) {
      // Layout horizontal (row) - Los hijos deben ocupar espacio proporcional
      styles = {
        ...styles,
        flex: '1 1 0%', // flex-grow: 1, flex-shrink: 1, flex-basis: 0
        minWidth: '200px', // Ancho mínimo para permitir drag & drop fácil
        minHeight: '120px', // Altura mínima para contenedores
        maxWidth: parentFlexWrap === 'nowrap' ? `${100 / totalChildren}%` : 'none'
      };

      // Ajustes especiales para diferentes casos
      if (totalChildren === 2) {
        styles.minWidth = '250px'; // Más espacio para 2 columnas
      } else if (totalChildren === 3) {
        styles.minWidth = '200px'; // Espacio balanceado para 3 columnas
      } else if (totalChildren >= 4) {
        styles.minWidth = '180px'; // Mínimo para más columnas
      }

    } else {
      // Layout vertical (column) - Los hijos ocupan todo el ancho
      styles = {
        ...styles,
        width: '100%',
        flex: parentAlignItems === 'stretch' ? '0 0 auto' : '0 0 auto',
        minHeight: childElement?.type === 'container' ? '100px' : 'auto'
      };
    }

    // Ajustes específicos para contenedores anidados
    if (childElement?.type === 'container') {
      if (isHorizontalLayout) {
        styles.minHeight = '150px'; // Más altura para contenedores en fila
      } else {
        styles.minHeight = '100px'; // Altura base para contenedores en columna
      }
    }

    return styles;
  };

  // Calcular clases CSS adicionales
  const calculateClasses = () => {
    let classes = [];

    if (isHorizontalLayout) {
      classes.push('flex-1'); // Flex grow en horizontal
      
      // Clases responsivas para diferentes cantidades de hijos
      if (totalChildren === 2) {
        classes.push('w-1/2');
      } else if (totalChildren === 3) {
        classes.push('w-1/3');
      } else if (totalChildren >= 4) {
        classes.push('w-1/4');
      }
    } else {
      classes.push('w-full'); // Ancho completo en vertical
    }

    return classes.join(' ');
  };

  const flexStyles = calculateFlexStyles();
  const flexClasses = calculateClasses();

  return (
    <div
      className={`${flexClasses} ${className}`}
      style={flexStyles}
      data-child-index={childIndex}
      data-parent-direction={parentDirection}
      data-total-children={totalChildren}
    >
      {children}
    </div>
  );
}

/**
 * Contenedor padre optimizado que prepara el contexto para sus hijos
 */
export function FlexibleContainer({ 
  element, 
  children,
  className = ""
}) {
  const flexDirection = element.props?.flexDirection || 'column';
  const justifyContent = element.props?.justifyContent || 'flex-start';
  const alignItems = element.props?.alignItems || 'stretch';
  const flexWrap = element.props?.flexWrap || 'nowrap';
  const gap = element.props?.gap || '16px';
  
  const childrenArray = React.Children.toArray(children);
  const totalChildren = childrenArray.length;
  
  const isHorizontalLayout = flexDirection === 'row' || flexDirection === 'row-reverse';

  const containerStyles = {
    display: 'flex',
    flexDirection,
    justifyContent,
    alignItems,
    flexWrap,
    gap,
    width: '100%',
    // Para layouts horizontales, asegurar altura mínima
    minHeight: isHorizontalLayout ? '150px' : 'auto'
  };

  return (
    <div 
      className={`${className}`}
      style={containerStyles}
    >
      {childrenArray.map((child, index) => (
        <FlexibleChildWrapper
          key={child.key || index}
          parentElement={element}
          childElement={child.props?.element} // Asumir que el elemento está en props
          childIndex={index}
          totalChildren={totalChildren}
        >
          {child}
        </FlexibleChildWrapper>
      ))}
    </div>
  );
}

export default FlexibleChildWrapper;