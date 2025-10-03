import { useState, useCallback } from 'react';
import { VIEWPORT_MODES } from '../../../constants/viewportConfigs';
import { useElementOperations } from './useElementOperations';

/**
 * Hook principal para manejar el estado del editor/builder
 */
export function useBuilderState() {
  // Estado principal del editor
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [viewportMode, setViewportMode] = useState(VIEWPORT_MODES.DESKTOP);
  const [projectName, setProjectName] = useState('Mi Proyecto');
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  // Hook para operaciones de elementos
  const elementOperations = useElementOperations(elements, setElements, selectedElement, setSelectedElement);

  // Handlers para el editor
  const handleAddElement = useCallback((elementTemplate) => {
    elementOperations.addElement(elementTemplate);
  }, [elementOperations.addElement]);

  const handleDeleteElement = useCallback((elementId, parentId = null) => {
    elementOperations.deleteElement(elementId, parentId);
  }, [elementOperations.deleteElement]);

  const handleDuplicateElement = useCallback((elementToDuplicate, parentId = null) => {
    elementOperations.duplicateElement(elementToDuplicate, parentId);
  }, [elementOperations.duplicateElement]);

  const handleSelectElement = useCallback((element) => {
    setSelectedElement(element);
  }, []);

  const handleUpdateElement = useCallback((updatedElement) => {
    elementOperations.updateElement(updatedElement);
  }, [elementOperations.updateElement]);

  // Handlers para acciones del proyecto
  const handleSave = useCallback(() => {
    console.log('Guardando página...', elements);
    alert('Página guardada correctamente');
  }, [elements]);

  const handlePublish = useCallback(() => {
    console.log('Publicando página...', elements);
    alert('Página publicada correctamente');
  }, [elements]);

  const handlePreview = useCallback(() => {
    console.log('Abriendo vista previa...', elements);
    alert('Vista previa (funcionalidad pendiente)');
  }, [elements]);

  return {
    // Estado
    elements,
    selectedElement,
    viewportMode,
    projectName,
    isEditingTitle,
    
    // Setters de estado básico
    setViewportMode,
    setProjectName,
    setIsEditingTitle,
    
    // Operaciones de elementos
    ...elementOperations,
    
    // Handlers
    handleAddElement,
    handleDeleteElement,
    handleDuplicateElement,
    handleSelectElement,
    handleUpdateElement,
    handleSave,
    handlePublish,
    handlePreview
  };
}