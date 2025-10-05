import { useState, useCallback, useRef } from 'react';

/**
 * Hook personalizado para manejo preciso de drag & drop
 * Basado en el sistema de WeMax Suite App Pro
 */
export function usePreciseDragDrop() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragData, setDragData] = useState(null);
  const dragRef = useRef(null);

  // Crear datos de drag estructurados
  const createDragData = useCallback((type, element, additionalData = {}) => {
    return {
      type, // 'panel-element' | 'canvas-element'
      element: type === 'panel-element' ? element : undefined,
      id: type === 'canvas-element' ? element.id : undefined,
      index: type === 'canvas-element' ? additionalData.index : undefined,
      parentId: additionalData.parentId || null,
      timestamp: Date.now(),
      ...additionalData
    };
  }, []);

  // Handlers para elementos del panel
  const handlePanelDragStart = useCallback((e, element) => {
    console.log('🚀 Panel drag started:', element.name);
    const data = createDragData('panel-element', element);
    
    setIsDragging(true);
    setDragData(data);
    e.dataTransfer.setData('text/plain', JSON.stringify(data));
    e.dataTransfer.effectAllowed = 'copy';
  }, [createDragData]);

  const handlePanelDragEnd = useCallback(() => {
    setIsDragging(false);
    setDragData(null);
  }, []);

  // Handlers para elementos del canvas
  const handleCanvasDragStart = useCallback((e, element, index, parentId = null) => {
    console.log('🎯 Canvas drag started:', element.id, element.type);
    e.stopPropagation(); // Crítico para evitar propagación
    
    const data = createDragData('canvas-element', element, { index, parentId });
    
    setIsDragging(true);
    setDragData(data);
    e.dataTransfer.setData('text/plain', JSON.stringify(data));
    e.dataTransfer.effectAllowed = 'move';
  }, [createDragData]);

  const handleCanvasDragEnd = useCallback((e) => {
    e.stopPropagation();
    setIsDragging(false);
    setDragData(null);
  }, []);

  // Handlers para contenedores (drop zones)
  const handleContainerDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Determinar el efecto basado en el tipo de drag
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      e.dataTransfer.dropEffect = data.type === 'panel-element' ? 'copy' : 'move';
    } catch {
      e.dataTransfer.dropEffect = 'copy';
    }
    
    setIsDragOver(true);
  }, []);

  const handleContainerDragLeave = useCallback((e) => {
    e.stopPropagation();
    // Solo limpiar si realmente salimos del contenedor
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  }, []);

  const handleContainerDrop = useCallback((e, containerId, onSuccess) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    console.log('📦 Container drop triggered:', containerId);
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      console.log('📄 Drop data:', data);
      
      if (data.type === 'panel-element') {
        console.log('✅ Adding new element to container:', containerId);
        onSuccess && onSuccess('add', data.element, containerId);
      } else if (data.type === 'canvas-element') {
        // Prevenir mover un elemento a sí mismo
        if (data.id !== containerId) {
          console.log('✅ Moving existing element to container:', data.id, '->', containerId);
          onSuccess && onSuccess('move', { id: data.id, parentId: data.parentId }, containerId);
        }
      }
    } catch (error) {
      console.error('❌ Error parsing drop data:', error);
    }
  }, []);

  // Handler para reordenamiento en canvas principal
  const handleCanvasDrop = useCallback((e, onSuccess) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      
      if (data.type === 'panel-element') {
        console.log('✅ Adding new element to canvas');
        onSuccess && onSuccess('add', data.element);
      } else if (data.type === 'canvas-element') {
        console.log('✅ Moving element to canvas from container');
        onSuccess && onSuccess('moveToCanvas', { id: data.id, parentId: data.parentId });
      }
    } catch (error) {
      console.error('❌ Error in canvas drop:', error);
    }
  }, []);

  // Handler para reordenamiento entre elementos
  const handleElementReorder = useCallback((e, targetElement, targetIndex, onSuccess) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      
      if (data.type === 'canvas-element' && data.id !== targetElement.id) {
        console.log('↕️ Reordering elements:', data.index, '->', targetIndex);
        onSuccess && onSuccess('reorder', {
          fromIndex: data.index,
          toIndex: targetIndex,
          elementId: data.id,
          parentId: data.parentId
        });
      }
    } catch (error) {
      console.error('❌ Error in reorder:', error);
    }
  }, []);

  // Utilidades para validación
  const isValidDrop = useCallback((dragData, targetId) => {
    if (!dragData) return false;
    
    // Prevenir drop en sí mismo
    if (dragData.type === 'canvas-element' && dragData.id === targetId) {
      return false;
    }
    
    return true;
  }, []);

  const shouldAcceptDrop = useCallback((e, targetId) => {
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      return isValidDrop(data, targetId);
    } catch {
      return false;
    }
  }, [isValidDrop]);

  // Reset completo del estado
  const resetDragState = useCallback(() => {
    setIsDragging(false);
    setIsDragOver(false);
    setDragData(null);
  }, []);

  return {
    // Estados
    isDragOver,
    isDragging,
    dragData,
    dragRef,
    
    // Panel handlers
    handlePanelDragStart,
    handlePanelDragEnd,
    
    // Canvas handlers
    handleCanvasDragStart,
    handleCanvasDragEnd,
    
    // Container handlers
    handleContainerDragOver,
    handleContainerDragLeave,
    handleContainerDrop,
    
    // Canvas drop handler
    handleCanvasDrop,
    
    // Reorder handler
    handleElementReorder,
    
    // Utilidades
    isValidDrop,
    shouldAcceptDrop,
    resetDragState,
    createDragData
  };
}

export default usePreciseDragDrop;