/**
 * Sistema de detección de colisiones mejorado
 * Inspirado en @dnd-kit/core collision detection algorithms
 * Adaptado para Aurelio Builder
 */

/**
 * Calcula el rectángulo de un elemento o coordenadas
 * @param {Element|Object} elementOrRect - Elemento DOM o objeto con coordenadas
 * @returns {DOMRect} Rectángulo normalizado
 */
export const getRectFromElement = (elementOrRect) => {
  if (elementOrRect.getBoundingClientRect) {
    return elementOrRect.getBoundingClientRect();
  }
  
  // Si ya es un rect object
  if (elementOrRect.left !== undefined) {
    return elementOrRect;
  }
  
  return {
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    width: 0,
    height: 0
  };
};

/**
 * Algoritmo de detección por centro más cercano
 * Encuentra el elemento cuyo centro está más cerca del centro del elemento arrastrado
 * @param {Array} droppableElements - Array de elementos que pueden recibir drops
 * @param {DOMRect|Object} activeRect - Rectángulo del elemento siendo arrastrado
 * @returns {Object|null} Elemento más cercano o null
 */
export const closestCenter = (droppableElements, activeRect) => {
  if (!droppableElements.length || !activeRect) return null;

  const activeCenter = {
    x: activeRect.left + activeRect.width / 2,
    y: activeRect.top + activeRect.height / 2
  };

  let closest = null;
  let closestDistance = Infinity;

  droppableElements.forEach(element => {
    const rect = getRectFromElement(element.element || element);
    const center = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };

    const distance = Math.sqrt(
      Math.pow(activeCenter.x - center.x, 2) + Math.pow(activeCenter.y - center.y, 2)
    );

    if (distance < closestDistance) {
      closestDistance = distance;
      closest = {
        ...element,
        distance,
        rect,
        center
      };
    }
  });

  return closest;
};

/**
 * Algoritmo de detección por esquinas más cercanas
 * Útil para contenedores y layouts complejos
 * @param {Array} droppableElements - Array de elementos que pueden recibir drops
 * @param {DOMRect|Object} activeRect - Rectángulo del elemento siendo arrastrado
 * @returns {Object|null} Elemento más cercano o null
 */
export const closestCorners = (droppableElements, activeRect) => {
  if (!droppableElements.length || !activeRect) return null;

  const activeCorners = [
    { x: activeRect.left, y: activeRect.top }, // top-left
    { x: activeRect.right, y: activeRect.top }, // top-right
    { x: activeRect.left, y: activeRect.bottom }, // bottom-left
    { x: activeRect.right, y: activeRect.bottom } // bottom-right
  ];

  let closest = null;
  let closestDistance = Infinity;

  droppableElements.forEach(element => {
    const rect = getRectFromElement(element.element || element);
    const corners = [
      { x: rect.left, y: rect.top },
      { x: rect.right, y: rect.top },
      { x: rect.left, y: rect.bottom },
      { x: rect.right, y: rect.bottom }
    ];

    // Calcular distancia mínima entre cualquier par de esquinas
    let minDistance = Infinity;
    
    activeCorners.forEach(activeCorner => {
      corners.forEach(corner => {
        const distance = Math.sqrt(
          Math.pow(activeCorner.x - corner.x, 2) + Math.pow(activeCorner.y - corner.y, 2)
        );
        minDistance = Math.min(minDistance, distance);
      });
    });

    if (minDistance < closestDistance) {
      closestDistance = minDistance;
      closest = {
        ...element,
        distance: minDistance,
        rect,
        corners
      };
    }
  });

  return closest;
};

/**
 * Algoritmo de detección por intersección de rectángulos
 * Ideal para contenedores anidados y overlapping elements
 * @param {Array} droppableElements - Array de elementos que pueden recibir drops
 * @param {DOMRect|Object} activeRect - Rectángulo del elemento siendo arrastrado
 * @returns {Object|null} Elemento con mayor intersección o null
 */
export const rectIntersection = (droppableElements, activeRect) => {
  if (!droppableElements.length || !activeRect) return null;

  let bestMatch = null;
  let largestIntersectionArea = 0;

  droppableElements.forEach(element => {
    const rect = getRectFromElement(element.element || element);
    
    // Calcular área de intersección
    const intersectionLeft = Math.max(activeRect.left, rect.left);
    const intersectionTop = Math.max(activeRect.top, rect.top);
    const intersectionRight = Math.min(activeRect.right, rect.right);
    const intersectionBottom = Math.min(activeRect.bottom, rect.bottom);

    const intersectionWidth = Math.max(0, intersectionRight - intersectionLeft);
    const intersectionHeight = Math.max(0, intersectionBottom - intersectionTop);
    const intersectionArea = intersectionWidth * intersectionHeight;

    // Calcular porcentaje de intersección respecto al elemento activo
    const activeArea = activeRect.width * activeRect.height;
    const intersectionRatio = activeArea > 0 ? intersectionArea / activeArea : 0;

    if (intersectionArea > largestIntersectionArea && intersectionRatio > 0.1) {
      largestIntersectionArea = intersectionArea;
      bestMatch = {
        ...element,
        intersectionArea,
        intersectionRatio,
        rect
      };
    }
  });

  return bestMatch;
};

/**
 * Algoritmo híbrido que combina múltiples estrategias
 * Utiliza el mejor algoritmo según el contexto
 * @param {Array} droppableElements - Array de elementos que pueden recibir drops
 * @param {DOMRect|Object} activeRect - Rectángulo del elemento siendo arrastrado
 * @param {Object} options - Opciones de configuración
 * @returns {Object|null} Mejor elemento encontrado o null
 */
export const smartCollisionDetection = (droppableElements, activeRect, options = {}) => {
  const {
    preferIntersection = true,
    fallbackToCenter = true,
    minimumIntersectionRatio = 0.15
  } = options;

  if (!droppableElements.length || !activeRect) return null;

  // 1. Primero intentar detección por intersección
  if (preferIntersection) {
    const intersectionMatch = rectIntersection(droppableElements, activeRect);
    if (intersectionMatch && intersectionMatch.intersectionRatio >= minimumIntersectionRatio) {
      return {
        ...intersectionMatch,
        algorithm: 'intersection'
      };
    }
  }

  // 2. Si no hay intersección suficiente, usar centro más cercano
  if (fallbackToCenter) {
    const centerMatch = closestCenter(droppableElements, activeRect);
    if (centerMatch) {
      return {
        ...centerMatch,
        algorithm: 'center'
      };
    }
  }

  // 3. Como último recurso, usar esquinas más cercanas
  const cornersMatch = closestCorners(droppableElements, activeRect);
  if (cornersMatch) {
    return {
      ...cornersMatch,
      algorithm: 'corners'
    };
  }

  return null;
};

/**
 * Clase principal para manejar detección de colisiones
 * Integra todos los algoritmos y proporciona una API limpia
 */
export class CollisionDetector {
  constructor(options = {}) {
    this.options = {
      algorithm: 'smart', // 'center', 'corners', 'intersection', 'smart'
      minimumIntersectionRatio: 0.15,
      preferIntersection: true,
      fallbackToCenter: true,
      ...options
    };
  }

  /**
   * Encuentra el mejor elemento para recibir el drop
   * @param {Array} droppableElements - Elementos que pueden recibir drops
   * @param {DOMRect|Object} activeRect - Rectángulo del elemento arrastrado
   * @returns {Object|null} Mejor match o null
   */
  detect(droppableElements, activeRect) {
    if (!droppableElements.length || !activeRect) return null;

    switch (this.options.algorithm) {
      case 'center':
        return closestCenter(droppableElements, activeRect);
      
      case 'corners':
        return closestCorners(droppableElements, activeRect);
      
      case 'intersection':
        return rectIntersection(droppableElements, activeRect);
      
      case 'smart':
      default:
        return smartCollisionDetection(droppableElements, activeRect, this.options);
    }
  }

  /**
   * Actualiza las opciones del detector
   * @param {Object} newOptions - Nuevas opciones
   */
  updateOptions(newOptions) {
    this.options = { ...this.options, ...newOptions };
  }

  /**
   * Obtiene información de debug sobre la detección
   * @param {Array} droppableElements - Elementos droppable
   * @param {DOMRect|Object} activeRect - Rectángulo activo
   * @returns {Object} Información de debug
   */
  getDebugInfo(droppableElements, activeRect) {
    return {
      algorithm: this.options.algorithm,
      activeRect,
      droppableCount: droppableElements.length,
      results: {
        center: closestCenter(droppableElements, activeRect),
        corners: closestCorners(droppableElements, activeRect),
        intersection: rectIntersection(droppableElements, activeRect),
        smart: smartCollisionDetection(droppableElements, activeRect, this.options)
      }
    };
  }
}

/**
 * Instancia por defecto del detector de colisiones
 */
export const defaultCollisionDetector = new CollisionDetector();

/**
 * Función de conveniencia para detección rápida
 * @param {Array} droppableElements - Elementos droppable
 * @param {DOMRect|Object} activeRect - Rectángulo activo
 * @param {Object} options - Opciones adicionales
 * @returns {Object|null} Mejor match
 */
export const detectCollision = (droppableElements, activeRect, options = {}) => {
  const detector = new CollisionDetector(options);
  return detector.detect(droppableElements, activeRect);
};