/**
 * Hook para manejar drag & drop nativo en el editor Aurelio Builder
 * 
 * @description Sistema completo de drag & drop que maneja:
 * - Arrastre de elementos desde sidebar al canvas
 * - Reordenamiento de elementos en el canvas
 * - Movimiento de elementos entre contenedores
 * - Indicadores visuales de drop zones
 */

import { useState, useCallback, useRef } from 'react';

// Tipos de datos de drag
export const DRAG_TYPES = {
  NEW_ELEMENT: 'new-element',
  EXISTING_ELEMENT: 'existing-element',
  CONTAINER: 'container'
};

// Posiciones de drop
export const DROP_POSITIONS = {
  BEFORE: 'before',
  AFTER: 'after',
  INSIDE: 'inside'
};

/**
 * Hook principal de drag & drop
 */
export const useDragDrop = (onAddElement, onMoveElement, onReorderElement) => {
  const [dragState, setDragState] = useState({
    isDragging: false,
    draggedElement: null,
    dragType: null,
    dropTarget: null,
    dropPosition: null,
    dragPreview: null
  });

  const dragPreviewRef = useRef();

  /**
   * Iniciar arrastre de elemento nuevo desde sidebar
   */
  const handleNewElementDragStart = useCallback((event, elementConfig) => {
    console.log('🆕 Starting new element drag:', elementConfig.name);
    
    // Configurar datos del drag
    event.dataTransfer.setData('text/plain', ''); // Requerido para Firefox
    event.dataTransfer.effectAllowed = 'copy';
    
    // Crear imagen de arrastre personalizada
    const dragImage = createDragPreview(elementConfig);
    event.dataTransfer.setDragImage(dragImage, 50, 25);
    
    setDragState({
      isDragging: true,
      draggedElement: elementConfig,
      dragType: DRAG_TYPES.NEW_ELEMENT,
      dropTarget: null,
      dropPosition: null,
      dragPreview: dragImage
    });
  }, []);

  /**
   * Iniciar arrastre de elemento existente en canvas
   */
  const handleExistingElementDragStart = useCallback((event, element) => {
    console.log('↔️ Starting existing element drag:', element.id);
    
    event.dataTransfer.setData('text/plain', '');
    event.dataTransfer.effectAllowed = 'move';
    
    const dragImage = createElementDragPreview(element);
    event.dataTransfer.setDragImage(dragImage, 50, 25);
    
    setDragState({
      isDragging: true,
      draggedElement: element,
      dragType: DRAG_TYPES.EXISTING_ELEMENT,
      dropTarget: null,
      dropPosition: null,
      dragPreview: dragImage
    });
  }, []);

  /**
   * Manejar drag over para drop zones
   */
  const handleDragOver = useCallback((event, dropZoneInfo) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = dragState.dragType === DRAG_TYPES.NEW_ELEMENT ? 'copy' : 'move';
    
    const dropPosition = calculateDropPosition(event, dropZoneInfo);
    
    setDragState(prev => ({
      ...prev,
      dropTarget: dropZoneInfo,
      dropPosition
    }));
  }, [dragState.dragType]);

  /**
   * Manejar drop
   */
  const handleDrop = useCallback((event, dropZoneInfo) => {
    event.preventDefault();
    console.log('📍 Drop event:', {
      dragType: dragState.dragType,
      dropTarget: dropZoneInfo,
      dropPosition: dragState.dropPosition
    });

    if (!dragState.isDragging || !dragState.draggedElement) {
      return;
    }

    const { draggedElement, dragType, dropPosition } = dragState;

    switch (dragType) {
      case DRAG_TYPES.NEW_ELEMENT:
        handleNewElementDrop(draggedElement, dropZoneInfo, dropPosition);
        break;
        
      case DRAG_TYPES.EXISTING_ELEMENT:
        handleExistingElementDrop(draggedElement, dropZoneInfo, dropPosition);
        break;
        
      default:
        console.warn('Unknown drag type:', dragType);
    }

    // Limpiar estado
    handleDragEnd();
  }, [dragState, onAddElement, onMoveElement, onReorderElement]);

  /**
   * Manejar fin de arrastre
   */
  const handleDragEnd = useCallback(() => {
    console.log('🏁 Drag ended');
    
    // Limpiar imagen de arrastre
    if (dragState.dragPreview && dragState.dragPreview.parentNode) {
      dragState.dragPreview.parentNode.removeChild(dragState.dragPreview);
    }
    
    setDragState({
      isDragging: false,
      draggedElement: null,
      dragType: null,
      dropTarget: null,
      dropPosition: null,
      dragPreview: null
    });
  }, [dragState.dragPreview]);

  /**
   * Manejar drop de elemento nuevo
   */
  const handleNewElementDrop = useCallback((elementConfig, dropZoneInfo, dropPosition) => {
    console.log('🆕 Handling new element drop');
    
    if (dropZoneInfo.type === 'canvas') {
      // Drop en canvas principal
      const insertIndex = dropPosition === DROP_POSITIONS.AFTER ? dropZoneInfo.index + 1 : dropZoneInfo.index;
      onAddElement(elementConfig, insertIndex);
      
    } else if (dropZoneInfo.type === 'container') {
      // Drop dentro de contenedor
      onAddElement(elementConfig, null, dropZoneInfo.containerId);
    }
  }, [onAddElement]);

  /**
   * Manejar drop de elemento existente
   */
  const handleExistingElementDrop = useCallback((element, dropZoneInfo, dropPosition) => {
    console.log('↔️ Handling existing element drop');
    
    if (dropZoneInfo.type === 'canvas') {
      // Reordenar en canvas
      const targetIndex = dropPosition === DROP_POSITIONS.AFTER ? dropZoneInfo.index + 1 : dropZoneInfo.index;
      onReorderElement(element.id, targetIndex);
      
    } else if (dropZoneInfo.type === 'container') {
      // Mover a contenedor
      onMoveElement(element.id, dropZoneInfo.containerId);
    }
  }, [onMoveElement, onReorderElement]);

  return {
    dragState,
    handleNewElementDragStart,
    handleExistingElementDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd
  };
};

/**
 * Calcular posición de drop basada en la posición del mouse
 */
function calculateDropPosition(event, dropZoneInfo) {
  if (dropZoneInfo.type === 'container') {
    return DROP_POSITIONS.INSIDE;
  }
  
  const rect = event.currentTarget.getBoundingClientRect();
  const midY = rect.top + rect.height / 2;
  
  return event.clientY < midY ? DROP_POSITIONS.BEFORE : DROP_POSITIONS.AFTER;
}

/**
 * Crear imagen de vista previa personalizada para elementos nuevos
 */
function createDragPreview(elementConfig) {
  const preview = document.createElement('div');
  preview.style.cssText = `
    position: absolute;
    top: -1000px;
    left: -1000px;
    width: 100px;
    height: 50px;
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 12px;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
    pointer-events: none;
    z-index: 1000;
  `;
  preview.textContent = elementConfig.name;
  
  document.body.appendChild(preview);
  return preview;
}

/**
 * Crear imagen de vista previa para elementos existentes
 */
function createElementDragPreview(element) {
  const preview = document.createElement('div');
  preview.style.cssText = `
    position: absolute;
    top: -1000px;
    left: -1000px;
    width: 120px;
    height: 40px;
    background: rgba(42, 42, 42, 0.95);
    border: 2px solid #8b5cf6;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 11px;
    font-weight: 500;
    pointer-events: none;
    z-index: 1000;
  `;
  preview.textContent = `Moving ${element.type}`;
  
  document.body.appendChild(preview);
  return preview;
}

/**
 * Hook para componentes que pueden recibir drops
 */
export const useDropZone = (dropZoneInfo, dragDropContext) => {
  const [isDropTarget, setIsDropTarget] = useState(false);
  const [dropPosition, setDropPosition] = useState(null);

  const handleDragEnter = useCallback((event) => {
    event.preventDefault();
    setIsDropTarget(true);
  }, []);

  const handleDragLeave = useCallback((event) => {
    // Solo actualizar si realmente salimos del elemento
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsDropTarget(false);
      setDropPosition(null);
    }
  }, []);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    const position = calculateDropPosition(event, dropZoneInfo);
    setDropPosition(position);
    dragDropContext.handleDragOver(event, dropZoneInfo);
  }, [dropZoneInfo, dragDropContext]);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    setIsDropTarget(false);
    setDropPosition(null);
    dragDropContext.handleDrop(event, dropZoneInfo);
  }, [dropZoneInfo, dragDropContext]);

  return {
    isDropTarget,
    dropPosition,
    dropZoneProps: {
      onDragEnter: handleDragEnter,
      onDragLeave: handleDragLeave,
      onDragOver: handleDragOver,
      onDrop: handleDrop
    }
  };
};