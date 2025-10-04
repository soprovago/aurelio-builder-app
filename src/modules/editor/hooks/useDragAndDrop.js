import { useState, useCallback } from 'react';
import {
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  TouchSensor,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useEditorStore, useCreateElement } from '@/store';
import { ElementType, Position, DragData } from '@/types';

interface DragState {
  isDragging: boolean;
  draggedElementId: string | null;
  draggedElementType: ElementType | null;
  isCreatingNew: boolean;
}

export const useDragAndDrop = () => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedElementId: null,
    draggedElementType: null,
    isCreatingNew: false,
  });

  // Store actions
  const {
    moveElement,
    selectElement,
    handleDrop,
    ui,
  } = useEditorStore();
  
  const createElement = useCreateElement();

  // Configurar sensores para diferentes tipos de input
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Mínima distancia antes de activar drag
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Función para calcular posición ajustada al grid
  const snapToGrid = useCallback((position: Position): Position => {
    if (!ui.snapToGrid) return position;
    
    const gridSize = ui.gridSize;
    return {
      x: Math.round(position.x / gridSize) * gridSize,
      y: Math.round(position.y / gridSize) * gridSize,
    };
  }, [ui.snapToGrid, ui.gridSize]);

  // Manejar inicio del drag
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const dragData = active.data.current as DragData;
    
    if (!dragData) return;

    const isCreatingNew = !dragData.elementId;
    
    setDragState({
      isDragging: true,
      draggedElementId: dragData.elementId || null,
      draggedElementType: dragData.elementType,
      isCreatingNew,
    });

    // Si estamos arrastrando un elemento existente, seleccionarlo
    if (dragData.elementId) {
      selectElement(dragData.elementId);
    }
  }, [selectElement]);

  // Manejar drag over (opcional, para feedback visual)
  const handleDragOver = useCallback((event: DragOverEvent) => {
    // Aquí podríamos implementar lógica para mostrar indicadores visuales
    // durante el arrastre, como destacar áreas de drop válidas
  }, []);

  // Manejar final del drag
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over, delta } = event;
    const dragData = active.data.current as DragData;
    
    if (!dragData) {
      setDragState({
        isDragging: false,
        draggedElementId: null,
        draggedElementType: null,
        isCreatingNew: false,
      });
      return;
    }

    // Calcular nueva posición
    const rect = (event.activatorEvent?.target as HTMLElement)?.getBoundingClientRect();
    let newPosition: Position = {
      x: delta.x,
      y: delta.y,
    };

    // Si tenemos información del target, usar coordenadas absolutas
    if (rect) {
      newPosition = {
        x: rect.left + delta.x,
        y: rect.top + delta.y,
      };
    }

    // Aplicar snap to grid si está habilitado
    newPosition = snapToGrid(newPosition);

    // Asegurar que la posición esté dentro de los límites del canvas
    newPosition = {
      x: Math.max(0, Math.min(newPosition.x, 1200 - 100)), // Assuming element width ~100
      y: Math.max(0, Math.min(newPosition.y, 800 - 50)),   // Assuming element height ~50
    };

    if (dragState.isCreatingNew) {
      // Crear nuevo elemento
      if (dragData.elementType && over?.id === 'canvas') {
        const newElementId = createElement(dragData.elementType, newPosition);
        selectElement(newElementId);
      }
    } else if (dragData.elementId) {
      // Mover elemento existente
      if (over?.id === 'canvas') {
        moveElement(dragData.elementId, newPosition);
      } else {
        // Si se suelta en un contenedor válido, manejar la lógica de drop
        const dropResult = {
          elementId: dragData.elementId,
          newPosition,
          newParentId: over?.id as string || null,
          newOrder: 0, // Calcular order apropiado basado en la posición
        };
        handleDrop(dropResult);
      }
    }

    // Resetear estado de drag
    setDragState({
      isDragging: false,
      draggedElementId: null,
      draggedElementType: null,
      isCreatingNew: false,
    });
  }, [
    dragState.isCreatingNew,
    createElement,
    selectElement,
    moveElement,
    handleDrop,
    snapToGrid,
  ]);

  // Función para verificar si un elemento puede ser soltado en un target
  const canDropElement = useCallback((
    draggedType: ElementType,
    targetId: string | null
  ): boolean => {
    if (!targetId || targetId === 'canvas') return true;
    
    // Aquí podríamos implementar lógica para validar si ciertos elementos
    // pueden ser soltados en ciertos contenedores
    return true;
  }, []);

  // Función para obtener el cursor durante el drag
  const getDragCursor = useCallback((): string => {
    if (!dragState.isDragging) return 'default';
    return dragState.isCreatingNew ? 'copy' : 'grabbing';
  }, [dragState.isDragging, dragState.isCreatingNew]);

  return {
    // Estado
    dragState,
    
    // Handlers
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    
    // Sensors
    sensors,
    
    // Utilidades
    canDropElement,
    getDragCursor,
    snapToGrid,
    
    // Estado computed
    isDragging: dragState.isDragging,
    draggedElementId: dragState.draggedElementId,
    draggedElementType: dragState.draggedElementType,
    isCreatingNew: dragState.isCreatingNew,
  };
};