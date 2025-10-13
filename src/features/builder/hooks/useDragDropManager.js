import { useState, useRef } from 'react';
import { ELEMENT_TYPES } from '../../../constants/elementTypes';

/**
 * useDragDropManager - Hook personalizado para gestionar drag & drop
 * 
 * Centraliza toda la lógica de arrastre y soltar, simplificando 
 * los componentes que necesitan estas funcionalidades.
 */
function useDragDropManager({
  element,
  index,
  onAddElementAtIndex,
  onReorder,
  onAddToContainer,
  onMoveToContainer
}) {
  // Estados del drag & drop
  const [isDragging, setIsDragging] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragOverPosition, setDragOverPosition] = useState(null);
  const dragRef = useRef(null);

  // Handlers para elementos generales (no contenedores)
  const handleDragStart = (e) => {
    console.log('Drag started:', element.type, element.id);
    setIsDragging(true);
    
    e.dataTransfer.setData('text/plain', JSON.stringify({ 
      type: 'canvas-element', 
      id: element.id, 
      index 
    }));
    e.dataTransfer.effectAllowed = 'move';
    
    // Crear imagen personalizada de arrastre solo para elementos no-contenedores
    if (element.type !== ELEMENT_TYPES.CONTAINER) {
      const dragImage = e.currentTarget.cloneNode(true);
      dragImage.style.opacity = '0.7';
      dragImage.style.transform = 'rotate(5deg)';
      dragImage.style.position = 'absolute';
      dragImage.style.top = '-1000px';
      document.body.appendChild(dragImage);
      e.dataTransfer.setDragImage(dragImage, 50, 20);
      
      // Limpiar después
      setTimeout(() => {
        if (document.body.contains(dragImage)) {
          document.body.removeChild(dragImage);
        }
      }, 0);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDragOverPosition(null);
    setIsDragOver(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Verificar qué tipo de elemento se está arrastrando
    const dataTransfer = e.dataTransfer;
    let dropEffect = 'move';
    
    // Para elementos del sidebar, usar 'copy'
    if (dataTransfer.effectAllowed === 'copy') {
      dropEffect = 'copy';
    }
    
    e.dataTransfer.dropEffect = dropEffect;
    
    // SIMPLIFICADO: Tratar todos los elementos igual
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseY = e.clientY;
    const elementMiddle = rect.top + rect.height / 2;
    
    setDragOverPosition(mouseY < elementMiddle ? 'top' : 'bottom');
  };

  const handleDragLeave = (e) => {
    // Solo limpiar si realmente salimos del elemento
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverPosition(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverPosition(null);
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      
      if (data.type === 'panel-element') {
        // Elemento desde el sidebar - insertarlo en la posición correcta
        let targetIndex = index;
        if (dragOverPosition === 'bottom') {
          targetIndex = index + 1;
        }
        
        console.log(`📥 Adding element from sidebar at index ${targetIndex}`);
        if (typeof onAddElementAtIndex === 'function') {
          onAddElementAtIndex(data.element, targetIndex);
        }
      } else if (data.type === 'canvas-element' && data.id !== element.id) {
        // Reordenar elementos existentes (incluye contenedores)
        let targetIndex = index;
        if (dragOverPosition === 'bottom') {
          targetIndex = index + 1;
        }
        
        console.log(`🔄 Reordering ${data.id} from index ${data.index} to ${targetIndex}`);
        if (typeof onReorder === 'function') {
          onReorder(data.index, targetIndex);
        }
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };

  // Handlers específicos para contenedores
  const handleContainerDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
    return false;
  };

  const handleContainerDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  };

  const handleContainerDrop = (e) => {
    console.log('Container drop received on', element.id);
    e.preventDefault();
    e.stopPropagation();
    
    // Retrasar el cambio de estado para no cancelar el drop
    setTimeout(() => setIsDragOver(false), 100);
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      
      if (data.type === 'panel-element') {
        console.log('Adding element to container:', data.element.name);
        if (onAddToContainer) {
          onAddToContainer(element.id, data.element);
        }
      } else if (data.type === 'canvas-element') {
        console.log('Moving element to container:', data.id);
        if (onMoveToContainer) {
          onMoveToContainer(data.id, element.id);
        }
      }
    } catch (error) {
      console.error('Container drop error:', error);
    }
  };

  const handleContainerDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
    return false;
  };

  // Props para elementos draggable generales
  const draggableProps = {
    ref: dragRef,
    draggable: true,
    onDragStart: handleDragStart,
    onDragEnd: handleDragEnd,
    // Los contenedores también pueden ser reordenados a nivel de canvas
    onDragOver: handleDragOver,
    onDragLeave: handleDragLeave,
    onDrop: handleDrop,
  };

  // Props específicas para contenedores
  const containerDropProps = {
    onDragOver: handleContainerDragOver,
    onDragLeave: handleContainerDragLeave,
    onDrop: handleContainerDrop,
    onDragEnter: handleContainerDragEnter,
  };

  // Indicadores visuales
  const dragIndicators = {
    isDragging,
    isDragOver,
    dragOverPosition,
  };

  return {
    // Props para elementos draggable
    draggableProps,
    
    // Props para contenedores
    containerDropProps,
    
    // Estados visuales
    dragIndicators,
    
    // Referencias
    dragRef,
  };
}

export default useDragDropManager;