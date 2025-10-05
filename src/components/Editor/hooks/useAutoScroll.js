import { useRef, useCallback, useEffect } from 'react';

/**
 * Hook para auto-scroll durante operaciones de drag
 * Proporciona scroll automático cuando el usuario arrastra cerca de los bordes
 */
export const useAutoScroll = (containerRef) => {
  const autoScrollRef = useRef();
  const isScrollingRef = useRef(false);
  
  // Configuración del auto-scroll (más visible)
  const SCROLL_SPEED_BASE = 8;        // Velocidad base de scroll (aumentada)
  const EDGE_THRESHOLD = 80;          // Pixeles desde el borde para activar (aumentada)
  const MAX_SCROLL_SPEED = 25;        // Velocidad máxima de scroll (aumentada)
  const SCROLL_ACCELERATION = 2;      // Aceleración cerca del borde

  /**
   * Calcula la velocidad de scroll basada en la distancia del borde
   */
  const getScrollSpeed = useCallback((distanceFromEdge, threshold) => {
    if (distanceFromEdge >= threshold) return 0;
    
    const ratio = Math.max(0, 1 - distanceFromEdge / threshold);
    const acceleratedRatio = Math.pow(ratio, SCROLL_ACCELERATION);
    
    return Math.min(
      SCROLL_SPEED_BASE + acceleratedRatio * MAX_SCROLL_SPEED, 
      MAX_SCROLL_SPEED
    );
  }, []);

  /**
   * Inicia el auto-scroll en la dirección especificada
   */
  const startAutoScroll = useCallback((direction, clientY) => {
    if (isScrollingRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    
    let scrollSpeed = SCROLL_SPEED_BASE;
    
    // Calcular velocidad basada en distancia del borde
    if (direction === 'up') {
      const distanceFromTop = clientY - rect.top;
      scrollSpeed = getScrollSpeed(distanceFromTop, EDGE_THRESHOLD);
    } else if (direction === 'down') {
      const distanceFromBottom = rect.bottom - clientY;
      scrollSpeed = getScrollSpeed(distanceFromBottom, EDGE_THRESHOLD);
    }

    if (scrollSpeed === 0) return;

    isScrollingRef.current = true;

    const scroll = () => {
      if (!isScrollingRef.current || !container) return;

      const scrollDelta = direction === 'up' ? -scrollSpeed : scrollSpeed;
      const currentScrollTop = container.scrollTop;
      const maxScrollTop = container.scrollHeight - container.clientHeight;
      const newScrollTop = Math.max(0, Math.min(maxScrollTop, currentScrollTop + scrollDelta));
      
      // Solo hacer scroll si realmente podemos scrollear en esa dirección
      if (newScrollTop !== currentScrollTop) {
        container.scrollTop = newScrollTop;
        autoScrollRef.current = requestAnimationFrame(scroll);
      } else {
        stopAutoScroll();
      }
    };

    scroll();
  }, [containerRef, getScrollSpeed]);

  /**
   * Detiene el auto-scroll
   */
  const stopAutoScroll = useCallback(() => {
    isScrollingRef.current = false;
    if (autoScrollRef.current) {
      cancelAnimationFrame(autoScrollRef.current);
      autoScrollRef.current = null;
    }
  }, []);

  /**
   * Maneja el movimiento del drag para determinar si necesita auto-scroll
   */
  const handleDragMove = useCallback((event) => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const clientY = event.clientY;

    // Verificar si estamos fuera del área visible
    if (clientY < rect.top || clientY > rect.bottom) {
      stopAutoScroll();
      return;
    }

    const distanceFromTop = clientY - rect.top;
    const distanceFromBottom = rect.bottom - clientY;

    // Auto-scroll hacia arriba
    if (distanceFromTop < EDGE_THRESHOLD && container.scrollTop > 0) {
      startAutoScroll('up', clientY);
    }
    // Auto-scroll hacia abajo
    else if (distanceFromBottom < EDGE_THRESHOLD && 
             container.scrollTop < container.scrollHeight - container.clientHeight) {
      startAutoScroll('down', clientY);
    }
    // Detener si no estamos cerca de los bordes
    else {
      stopAutoScroll();
    }
  }, [containerRef, startAutoScroll, stopAutoScroll]);

  /**
   * Cleanup del auto-scroll al desmontar
   */
  useEffect(() => {
    return () => {
      stopAutoScroll();
    };
  }, [stopAutoScroll]);

  return {
    handleDragMove,      // Función para llamar en onMouseMove durante drag
    startAutoScroll,     // Función manual para iniciar scroll
    stopAutoScroll,      // Función manual para detener scroll
    isScrolling: () => isScrollingRef.current  // Verificar si está scrolleando
  };
};