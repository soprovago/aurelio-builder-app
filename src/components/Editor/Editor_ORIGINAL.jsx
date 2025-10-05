import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEditor } from '../../hooks/useEditor';
import { ELEMENT_TYPES } from '../../constants/elementTypes';
import { VIEWPORT_MODES, VIEWPORT_CONFIGS } from '../../constants/viewportConfigs';
import { getResponsiveProperty } from '../../shared/utils/responsiveUtils';
import AurelioLogo from '../shared/AurelioLogo';
import CanvasTemplateSystem from './components/CanvasTemplateSystem';
import './slider-styles.css';
import './canvas-hover.css';
import './enhanced-drag-animations.css';

// Importar iconos necesarios
import {
  FiArrowLeft,
  FiSave,
  FiEye,
  FiGlobe,
  FiGrid,
  FiMonitor,
  FiTablet,
  FiSmartphone,
  FiEdit3,
  FiTrash2,
  FiCopy,
  FiDroplet,
  FiSliders,
  FiPlus,
  FiInbox,
  FiTarget
} from 'react-icons/fi';
import AddContainerButton from './components/AddContainerButton';
import ElementsPanel from './components/ElementsPanelOptimized';
import ViewportSelector from './components/ViewportSelector';
import PropertiesPanel from './components/PropertiesPanel';
import Canvas from './components/Canvas';
import { renderBasicElement, ContainerElement } from './utils/elementRenderer';
import { useCollisionDetection } from './hooks/useCollisionDetection';
import CollisionDebugger from './components/CollisionDebugger';
import ContainerReorderControls from './components/ContainerReorderControls';
import ContainerVisualIndicators from './components/ContainerVisualIndicators';
import QuickLayoutControls from './components/QuickLayoutControls';
import { FlexibleChildWrapper } from './components/FlexibleChildWrapper';
import EasyLayoutMode from './components/EasyLayoutMode';

// Constantes de estilo
const CONTROL_STYLES = {
  button: "text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 p-1 transition-colors",
  deleteButton: "text-red-400 hover:text-red-300 hover:bg-red-500/20 p-1 transition-colors",
  menuButton: "text-gray-400 hover:text-gray-300 hover:bg-gray-500/20 p-1 transition-colors",
  controlsContainer: "flex items-center bg-black/80 backdrop-blur-sm rounded-md border border-gray-600/50 shadow-lg overflow-hidden"
};


// Función helper para verificar si un elemento es hijo de otro (evitar loops)
const isElementChild = (parentElement, childId, allElements) => {
  const findInChildren = (element) => {
    if (element.id === childId) return true;
    if (element.props?.children) {
      return element.props.children.some(child => findInChildren(child));
    }
    return false;
  };
  return findInChildren(parentElement);
};

// Componente CanvasElement (elemento individual en canvas)
function CanvasElement({ element, index, isSelected, onSelect, onDelete, onDuplicate, onAddToContainer, onMoveToContainer, selectedElement, viewportMode, onUpdateElement, onAddElement, onAddElementAtIndex, onReorder, allElements, isNested = false, parentId = null, parentElement = null, totalElementsInContainer = 0, onReorderInContainer, onMoveOutOfContainer, collisionDetection, setActiveDrag }) {
  const [isDragging, setIsDragging] = useState(false);
  const [showAddButton, setShowAddButton] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragOverPosition, setDragOverPosition] = useState(null);
  const dragRef = useRef(null);
  const dragTimeoutRef = useRef(null);
  const dragOverThrottleRef = useRef(null);


  // Efecto de limpieza para timeout de drag
  useEffect(() => {
    return () => {
      if (dragTimeoutRef.current) {
        clearTimeout(dragTimeoutRef.current);
      }
      if (dragOverThrottleRef.current) {
        clearTimeout(dragOverThrottleRef.current);
      }
    };
  }, []);
  
  // Registrar elemento para collision detection
  useEffect(() => {
    if (dragRef.current && collisionDetection) {
      collisionDetection.registerDroppable(element.id, dragRef.current, {
        type: element.type,
        isContainer: element.type === ELEMENT_TYPES.CONTAINER,
        parentId: parentId,
        element: element
      });
      
      return () => {
        collisionDetection.unregisterDroppable(element.id);
      };
    }
  }, [element.id, element.type, parentId, collisionDetection]);

  // Limpiar isDragOver cuando cambia la selección o se interactúa con otros elementos
  useEffect(() => {
    if (selectedElement?.id !== element.id && isDragOver) {
      setIsDragOver(false);
    }
  }, [selectedElement, element.id, isDragOver]);

  // Cleanup global para eventos que indican fin de drag
  useEffect(() => {
    const handleGlobalMouseMove = () => {
      if (isDragOver && !isDragging) {
        setIsDragOver(false);
      }
    };
    
    const handleGlobalClick = () => {
      if (isDragOver) {
        setIsDragOver(false);
      }
    };
    
    const handleGlobalDragEnd = () => {
      if (isDragOver) {
        setIsDragOver(false);
      }
    };
    
    if (isDragOver) {
      document.addEventListener('click', handleGlobalClick);
      document.addEventListener('dragend', handleGlobalDragEnd);
      document.addEventListener('mousemove', handleGlobalMouseMove);
      
      return () => {
        document.removeEventListener('click', handleGlobalClick);
        document.removeEventListener('dragend', handleGlobalDragEnd);
        document.removeEventListener('mousemove', handleGlobalMouseMove);
      };
    }
  }, [isDragOver, isDragging]);


  const renderElement = () => {
    if (element.type === ELEMENT_TYPES.CONTAINER) {
      const handleContainerDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Forzar dropEffect para permitir el drop
        e.dataTransfer.dropEffect = e.dataTransfer.effectAllowed === 'move' ? 'move' : 'copy';
        
        // Throttle para reducir la frecuencia de eventos
        if (!dragOverThrottleRef.current) {
          setIsDragOver(true);
          dragOverThrottleRef.current = setTimeout(() => {
            dragOverThrottleRef.current = null;
          }, 16); // ~60fps
        }
        
        return false;
      };

      const handleContainerDragLeave = (e) => {
        // Limpiar estado cuando salimos del contenedor (más tolerante)
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Añadir un pequeño delay para evitar flickering
          setTimeout(() => {
            setIsDragOver(false);
          }, 50);
        }
      };

      const handleContainerDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        
        try {
          const data = JSON.parse(e.dataTransfer.getData('text/plain'));
          
          if (data.type === 'panel-element') {
            // Elemento nuevo desde el panel lateral
            if (onAddToContainer) onAddToContainer(element.id, data.element);
          } else if (data.type === 'canvas-element') {
            // Elemento existente siendo movido
            // Evitar mover un elemento a sí mismo o a sus propios hijos
            if (data.id !== element.id && !isElementChild(element, data.id, allElements)) {
              if (onMoveToContainer) {
                onMoveToContainer(data.id, element.id);
              }
            }
          }
        } catch (error) {
          console.error('Error in container drop:', error);
        }
      };

      const handleContainerDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'copy';
        setIsDragOver(true);
        return false;
      };

      const containerChildren = element.props.children && element.props.children.length > 0 ? (
        element.props.children.map((child, childIndex) => (
          <FlexibleChildWrapper
            key={child.id}
            parentElement={element}
            childElement={child}
            childIndex={childIndex}
            totalChildren={element.props.children.length}
            className="cursor-pointer"
          >
            <div 
              onClick={(e) => {
                e.stopPropagation();
                onSelect(child);
              }}
              onMouseEnter={(e) => {
                e.stopPropagation();
              }}
              onMouseLeave={(e) => {
                e.stopPropagation();
              }}
              className="h-full w-full"
            >
              <CanvasElement
                element={child}
                index={childIndex}
                isSelected={selectedElement?.id === child.id}
                onSelect={onSelect}
                onDelete={onDelete}
                onDuplicate={onDuplicate}
                onAddToContainer={onAddToContainer}
                onMoveToContainer={onMoveToContainer}
                selectedElement={selectedElement}
                viewportMode={viewportMode}
                onUpdateElement={onUpdateElement}
                onAddElementAtIndex={onAddElementAtIndex}
                onReorder={onReorder}
                onAddElement={onAddElement}
                allElements={allElements}
                isNested={true}
                parentId={element.id}
                parentElement={element}
                totalElementsInContainer={element.props.children?.length || 0}
                onReorderInContainer={onReorderInContainer}
                onMoveOutOfContainer={onMoveOutOfContainer}
                collisionDetection={collisionDetection}
                setActiveDrag={setActiveDrag}
              />
            </div>
          </FlexibleChildWrapper>
        ))
      ) : null;

      return (
        <ContainerElement
          element={element}
          isSelected={isSelected}
          isDragOver={isDragOver}
          onDragOver={handleContainerDragOver}
          onDragLeave={handleContainerDragLeave}
          onDrop={handleContainerDrop}
          onDragEnter={handleContainerDragEnter}
          onSelect={onSelect}
          isNested={isNested}
        >
          {containerChildren}
        </ContainerElement>
      );
    }
    
    // Para elementos no-contenedor, usar la función de renderizado básico
    return renderBasicElement(element);
  };


  // Manejador para agregar contenedor debajo del elemento actual
  const handleAddContainer = (containerElement) => {
    // Agregar el contenedor al canvas principal
    if (typeof onAddElement === 'function') {
      onAddElement(containerElement);
    }
  };

  const handleDragStart = (e) => {
    e.stopPropagation(); // ¡CRÍTICO! Detener propagación para evitar arrastrar contenedores padre
    
    const dragData = { 
      type: 'canvas-element', 
      id: element.id, 
      index,
      parentId: parentId // Incluir información del contenedor padre si existe
    };
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = 'move';
    
    // Actualizar estado de drag activo para debugging
    if (dragRef.current) {
      const rect = dragRef.current.getBoundingClientRect();
      setActiveDrag?.({
        isDragging: true,
        element: element,
        rect: rect,
        data: dragData
      });
    }
    
    // No crear imagen personalizada para contenedores ya que puede interferir
    if (element.type !== ELEMENT_TYPES.CONTAINER) {
      // Crear imagen personalizada de arrastre solo para elementos no-contenedores
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
    setIsDragOver(false); // Limpiar estado de dragOver
    
    // Limpiar estado de drag activo
    setActiveDrag?.({ isDragging: false });
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
    
    // Determinar si estamos en la mitad superior o inferior
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
        
        // Llamar a la función de agregar elemento con el índice específico
        if (typeof onAddElementAtIndex === 'function') {
          onAddElementAtIndex(data.element, targetIndex);
        }
      } else if (data.type === 'canvas-element' && data.id !== element.id) {
        // Manejar movimiento de elementos existentes
        if (element.type === ELEMENT_TYPES.CONTAINER) {
          // Si el target es un contenedor, mover el elemento arrastrado dentro del contenedor
          if (!isElementChild(element, data.id, allElements)) {
            if (onMoveToContainer) {
              onMoveToContainer(data.id, element.id);
            }
          }
        } else {
          // Reordenar elementos existentes (solo para no-contenedores del mismo nivel)
          let targetIndex = index;
          if (dragOverPosition === 'bottom') {
            targetIndex = index + 1;
          }
          
          // Solo reordenar si ambos elementos están en el mismo contenedor padre
          if (data.parentId === parentId) {
            onReorder(data.index, targetIndex);
          }
          // Para otros casos (mover entre contenedores), no hacer nada aquí
          // ya que el contenedor de destino maneja el movimiento
        }
      }
    } catch (error) {
      console.error('Error in element drop:', error);
    }
  };

  return (
    <div className="relative">
      {/* Indicador de drop en la parte superior */}
      {dragOverPosition === 'top' && (
        <div className="absolute -top-1 left-0 right-0 z-50">
          <div className="h-1 bg-[#8b5cf6] rounded-full shadow-lg">
            <div className="absolute -left-1 -top-1 w-3 h-3 bg-[#8b5cf6] rounded-full" />
            <div className="absolute -right-1 -top-1 w-3 h-3 bg-[#8b5cf6] rounded-full" />
          </div>
        </div>
      )}
      
      {/* Elemento principal */}
      <div
        ref={dragRef}
        draggable={true} // Hacer todos los elementos draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={undefined} // Deshabilitado para evitar interferencias con contenedores
        onDragLeave={undefined}
        onDrop={undefined}
        onMouseEnter={(e) => {
          e.stopPropagation();
          setShowAddButton(true);
        }}
        onMouseLeave={(e) => {
          e.stopPropagation();
          // Verificar que relatedTarget existe antes de usar contains
          if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget)) {
            setShowAddButton(false);
          }
        }}
        data-canvas-element={element.id}
        className={`canvas-element relative group ${
          isSelected ? 'ring-2 ring-[#8b5cf6]' : ''
        } ${
          isDragging ? 'opacity-50 scale-95' : ''
        } ${
          dragOverPosition ? 'ring-2 ring-[#8b5cf6] ring-opacity-50' : 'hover:ring-2 hover:ring-[#8b5cf6] hover:ring-opacity-30'
        } transition-all cursor-grab active:cursor-grabbing`}
        onClick={(e) => {
          // Permitir clic para seleccionar solo si no estamos arrastrando
          if (!isDragging) {
            onSelect(element);
          }
        }}
      >
        <div className={`relative ${
          element.type === ELEMENT_TYPES.CONTAINER ? 'pointer-events-auto' : 'pointer-events-none'
        }`}>
          {renderElement()}
          
          {/* Controles compactos agrupados */}
          <div className="canvas-controls absolute top-1 right-1 opacity-0 transition-all duration-200 pointer-events-auto z-[9999]">
            <div className={CONTROL_STYLES.controlsContainer}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicate(element, parentId);
                }}
                className={CONTROL_STYLES.button}
                title="Duplicar"
              >
                <FiCopy className="w-3 h-3" />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(element.id, parentId);
                }}
                className={CONTROL_STYLES.deleteButton}
                title="Eliminar"
              >
                <FiTrash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
          
          {/* Controles de reordenamiento para elementos dentro de contenedores */}
          {isNested && parentElement && onReorderInContainer && (
            <div className="canvas-reorder-controls absolute top-1 left-1 opacity-0 transition-all duration-200 pointer-events-auto z-[9999]">
              <ContainerReorderControls
                element={element}
                parentElement={parentElement}
                index={index}
                totalElements={totalElementsInContainer}
                onReorderInContainer={onReorderInContainer}
                onMoveOutOfContainer={onMoveOutOfContainer}
                className="scale-90"
              />
            </div>
          )}
          
          {/* Overlay mejorado para indicar que es arrastrable */}
          <div className="canvas-overlay absolute inset-0 bg-gradient-to-br from-[#8b5cf6] to-[#ec4899] pointer-events-none rounded-lg" />
        </div>
        
        {/* Indicadores visuales para contenedores */}
        <ContainerVisualIndicators 
          element={element}
          isSelected={isSelected}
        />
        
        {/* Controles rápidos de layout para contenedores */}
        <QuickLayoutControls
          selectedElement={isSelected ? element : null}
          onUpdateElement={onUpdateElement}
          position="floating"
        />
        
        {/* Botón de añadir contenedor (solo para contenedores) */}
        {element.type === ELEMENT_TYPES.CONTAINER && showAddButton && (
          <AddContainerButton 
            onAddContainer={handleAddContainer}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          />
        )}
      </div>
      
      {/* Indicador de drop en la parte inferior */}
      {dragOverPosition === 'bottom' && (
        <div className="absolute -bottom-1 left-0 right-0 z-50">
          <div className="h-1 bg-[#8b5cf6] rounded-full shadow-lg">
            <div className="absolute -left-1 -top-1 w-3 h-3 bg-[#8b5cf6] rounded-full" />
            <div className="absolute -right-1 -top-1 w-3 h-3 bg-[#8b5cf6] rounded-full" />
          </div>
        </div>
      )}
    </div>
  );
}

  



// Componente Editor principal
function Editor({ onExit }) {
  const navigate = useNavigate();
  const [viewportMode, setViewportMode] = useState(VIEWPORT_MODES.DESKTOP);
  const [projectName, setProjectName] = useState('Mi Proyecto');
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  // Estado local del editor (igual que WEMax)
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  
  // Estado para drag activo (para collision debugging)
  const [activeDrag, setActiveDrag] = useState(null);
  
  // Estado para Easy Layout
  const [showEasyLayout, setShowEasyLayout] = useState(false);
  
  // Sistema de collision detection mejorado
  const collisionDetection = useCollisionDetection({
    algorithm: 'smart',
    minimumIntersectionRatio: 0.2,
    preferIntersection: true,
    fallbackToCenter: true
  });

  // Función para generar IDs únicos
  const generateId = () => {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Función para crear layouts desde Easy Layout
  const handleEasyLayoutCreate = useCallback((preset) => {
    console.log('Creating Easy Layout:', preset);
    
    if (preset.layout) {
      // Si viene una estructura completa, usarla directamente
      const newElement = {
        id: preset.layout.id || `${preset.layout.type}-${generateId()}`,
        type: preset.layout.type,
        props: preset.layout.props
      };
      setElements(prev => [...prev, newElement]);
      setSelectedElement(newElement);
    } else {
      // Para presets normales, usar el comportamiento existente
      const newElement = {
        id: `${preset.layout.type}-${generateId()}`,
        type: preset.layout.type,
        props: { ...preset.layout.props, children: preset.layout.props.children || [] }
      };
      setElements(prev => [...prev, newElement]);
      setSelectedElement(newElement);
    }
    
    setShowEasyLayout(false);
  }, []);

  // Función para agregar elementos al canvas principal
  const addElement = useCallback((elementTemplate) => {
    console.log('Adding element to canvas:', elementTemplate.name);
    
    const newElement = {
      id: `${elementTemplate.type}-${generateId()}`,
      type: elementTemplate.type,
      props: { ...elementTemplate.defaultProps },
    };
    
    setElements(prev => [...prev, newElement]);
    setSelectedElement(newElement);
    
    return newElement;
  }, []);

  // Función para buscar y actualizar elementos anidados recursivamente
  const updateNestedElement = (elements, targetId, updater) => {
    return elements.map(element => {
      if (element.id === targetId) {
        return updater(element);
      }
      if (element.props?.children) {
        return {
          ...element,
          props: {
            ...element.props,
            children: updateNestedElement(element.props.children, targetId, updater)
          }
        };
      }
      return element;
    });
  };

  // Función para encontrar un elemento en cualquier nivel de la jerarquía
  const findElementById = (elements, targetId) => {
    for (const element of elements) {
      if (element.id === targetId) {
        return element;
      }
      if (element.props?.children) {
        const found = findElementById(element.props.children, targetId);
        if (found) return found;
      }
    }
    return null;
  };

  // Función para obtener la ruta completa de un elemento (para debugging)
  const getElementPath = (elements, targetId, path = []) => {
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const currentPath = [...path, { id: element.id, type: element.type, index: i }];
      
      if (element.id === targetId) {
        return currentPath;
      }
      
      if (element.props?.children) {
        const found = getElementPath(element.props.children, targetId, currentPath);
        if (found) return found;
      }
    }
    return null;
  };

  // Función para agregar elementos a contenedores
  const addToContainer = useCallback((containerId, elementTemplate) => {
    console.log('Adding', elementTemplate.name, 'to container', containerId);
    
    const newElement = {
      id: `${elementTemplate.type}-${generateId()}`,
      type: elementTemplate.type,
      props: { ...elementTemplate.defaultProps },
    };

    setElements((prev) => {
      const updated = updateNestedElement(prev, containerId, (container) => {
        const updatedContainer = {
          ...container,
          props: {
            ...container.props,
            children: [...(container.props.children || []), newElement]
          }
        };
        
        console.log('✅ Element added! Container now has', updatedContainer.props.children.length, 'children');
        return updatedContainer;
      });
      
      return updated;
    });
  }, []);

  // Función para mover elementos existentes
  const moveToContainer = useCallback((elementId, containerId) => {

    // Función recursiva para encontrar el elemento en cualquier nivel
    const findAndRemoveElement = (elements, targetId) => {
      let foundElement = null;
      
      const updatedElements = elements.reduce((acc, element) => {
        if (element.id === targetId) {
          foundElement = element;
          return acc; // No incluir este elemento en el resultado
        }
        
        if (element.props?.children) {
          const result = findAndRemoveElement(element.props.children, targetId);
          if (result.foundElement) {
            foundElement = result.foundElement;
          }
          return [...acc, {
            ...element,
            props: {
              ...element.props,
              children: result.elements
            }
          }];
        }
        
        return [...acc, element];
      }, []);
      
      return { elements: updatedElements, foundElement };
    };

    setElements((prev) => {
      // 1. Encontrar y remover el elemento de su posición actual
      const { elements: elementsAfterRemoval, foundElement } = findAndRemoveElement(prev, elementId);
      
      if (!foundElement) {
        console.error('Element not found:', elementId);
        return prev;
      }
      
      // 2. Si containerId es null, mover al canvas principal
      if (containerId === null) {
        console.log('Moving element to main canvas');
        return [...elementsAfterRemoval, foundElement];
      }
      
      // 3. Si no, agregar el elemento al contenedor de destino
      const updated = updateNestedElement(elementsAfterRemoval, containerId, (container) => {
        return {
          ...container,
          props: {
            ...container.props,
            children: [...(container.props.children || []), foundElement]
          }
        };
      });
      
      console.log('Element moved successfully');
      return updated;
    });
  }, []);

  // Función para actualizar elementos
  const updateElement = useCallback((updatedElement) => {
    console.log('Updating element:', updatedElement.id);
    
    // Función recursiva para buscar y actualizar el elemento
    const updateElementRecursively = (elements) => {
      return elements.map(el => {
        if (el.id === updatedElement.id) {
          return updatedElement;
        }
        if (el.props?.children) {
          return {
            ...el,
            props: {
              ...el.props,
              children: updateElementRecursively(el.props.children)
            }
          };
        }
        return el;
      });
    };
    
    setElements((prev) => updateElementRecursively(prev));
    setSelectedElement(updatedElement);
  }, []);

  // Función para eliminar elementos
  const deleteElement = useCallback((elementId, parentId = null) => {
    if (parentId) {
      // Eliminar de contenedor específico
      setElements(prev => updateNestedElement(prev, parentId, (container) => ({
        ...container,
        props: {
          ...container.props,
          children: container.props.children?.filter(child => child.id !== elementId) || []
        }
      })));
    } else {
      // Eliminar del canvas principal
      setElements(prev => prev.filter(element => element.id !== elementId));
    }
    
    // Deseleccionar si era el elemento seleccionado
    if (selectedElement?.id === elementId) {
      setSelectedElement(null);
    }
  }, [selectedElement]);

  // Función para duplicar elementos
  const duplicateElement = useCallback((elementToDuplicate, parentId = null) => {
    const duplicatedElement = {
      ...elementToDuplicate,
      id: `${elementToDuplicate.type}-${generateId()}`,
      props: { ...elementToDuplicate.props }
    };

    if (parentId) {
      // Duplicar en contenedor específico
      setElements(prev => updateNestedElement(prev, parentId, (container) => ({
        ...container,
        props: {
          ...container.props,
          children: [...(container.props.children || []), duplicatedElement]
        }
      })));
    } else {
      // Duplicar en canvas principal
      setElements(prev => [...prev, duplicatedElement]);
    }

    return duplicatedElement;
  }, []);

  // Función para agregar elemento en un índice específico (reordenamiento)
  const addElementAtIndex = useCallback((elementTemplate, index) => {
    console.log('Adding element at index:', elementTemplate.name, 'at index:', index);
    
    const newElement = {
      id: `${elementTemplate.type}-${generateId()}`,
      type: elementTemplate.type,
      props: { ...elementTemplate.defaultProps },
    };
    
    setElements(prev => {
      const newElements = [...prev];
      newElements.splice(index, 0, newElement);
      return newElements;
    });
    
    setSelectedElement(newElement);
    return newElement;
  }, []);

  // Función para reordenar elementos en el canvas
  const reorderElements = useCallback((fromIndex, toIndex) => {
    console.log('Reordering elements:', fromIndex, '->', toIndex);
    
    setElements(prev => {
      const newElements = [...prev];
      const [movedElement] = newElements.splice(fromIndex, 1);
      newElements.splice(toIndex, 0, movedElement);
      return newElements;
    });
  }, []);

  // Función para reordenar elementos dentro de contenedores
  const reorderInContainer = useCallback((elementId, currentIndex, newIndex) => {
    console.log('Reordering in container:', elementId, currentIndex, '->', newIndex);
    
    setElements(prev => {
      // Función recursiva para encontrar el contenedor padre y reordenar
      const reorderInNestedContainer = (elements) => {
        return elements.map(element => {
          if (element.props?.children) {
            const childIndex = element.props.children.findIndex(child => child.id === elementId);
            
            if (childIndex !== -1) {
              // Encontramos el contenedor con el elemento
              const newChildren = [...element.props.children];
              const [movedElement] = newChildren.splice(currentIndex, 1);
              newChildren.splice(newIndex, 0, movedElement);
              
              return {
                ...element,
                props: {
                  ...element.props,
                  children: newChildren
                }
              };
            } else {
              // Seguir buscando en contenedores anidados
              return {
                ...element,
                props: {
                  ...element.props,
                  children: reorderInNestedContainer(element.props.children)
                }
              };
            }
          }
          return element;
        });
      };
      
      return reorderInNestedContainer(prev);
    });
  }, []);

  // Función para mover elemento fuera de contenedor
  const moveOutOfContainer = useCallback((elementId, parentId) => {
    console.log('Moving element out of container:', elementId, 'from parent:', parentId);
    
    // Usar la función de mover a contenedor existente, pero con containerId = null (canvas principal)
    moveToContainer(elementId, null);
  }, [moveToContainer]);

  const handleAddElement = useCallback((elementTemplate) => {
    addElement(elementTemplate);
  }, [addElement]);

  const handleDeleteElement = useCallback((elementId, parentId = null) => {
    deleteElement(elementId, parentId);
  }, [deleteElement]);

  const handleDuplicateElement = useCallback((elementToDuplicate, parentId = null) => {
    duplicateElement(elementToDuplicate, parentId);
  }, [duplicateElement]);

  const handleSelectElement = useCallback((element) => {
    setSelectedElement(element);
  }, []);

  const handleSave = () => {
    console.log('Guardando página...', elements);
    alert('Página guardada correctamente');
  };

  const handlePublish = () => {
    console.log('Publicando página...', elements);
    alert('Página publicada correctamente');
  };

  const openPreviewWindow = () => {
    console.log('Abriendo vista previa...', elements);
    alert('Vista previa (funcionalidad pendiente)');
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col">
      {/* Toolbar superior */}
      <div className="bg-[#1a1a1a] border-b border-[#2a2a2a] flex items-center relative">
        <div className="flex items-center w-full p-4 pr-36">
          {/* Sección izquierda */}
          <div className="flex items-center gap-4 flex-1">
            <div className="flex-shrink-0">
              <AurelioLogo variant="icon-only" className="w-8 h-8" />
            </div>

            <div className="text-white group">
              {isEditingTitle ? (
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  onBlur={() => setIsEditingTitle(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setIsEditingTitle(false);
                    }
                  }}
                  className="bg-transparent font-semibold border-none outline-none focus:ring-2 focus:ring-purple-500 px-2 py-1 rounded"
                  autoFocus
                  placeholder="Nombre del proyecto"
                />
              ) : (
                <div 
                  className="flex items-center gap-2 cursor-pointer hover:bg-white/10 px-2 py-1 rounded transition-colors"
                  onClick={() => setIsEditingTitle(true)}
                  title="Haz clic para editar el nombre"
                >
                  <h1 className="font-semibold">{projectName}</h1>
                  <FiEdit3 className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              )}
            </div>
          </div>
          
          {/* Sección central */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <ViewportSelector 
              currentMode={viewportMode} 
              onModeChange={setViewportMode} 
            />
          </div>
          
          {/* Sección derecha */}
          <div className="flex items-center gap-2">
            <button
              onClick={onExit}
              className="flex items-center justify-center w-8 h-8 text-gray-300 hover:text-white transition-colors"
              title="Volver al dashboard"
            >
              <FiArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleSave}
              className="flex items-center justify-center w-8 h-8 text-gray-300 hover:text-white transition-colors"
              title="Guardar"
            >
              <FiSave className="w-4 h-4" />
            </button>
            <button
              onClick={openPreviewWindow}
              className="flex items-center justify-center w-8 h-8 text-gray-300 hover:text-white transition-colors"
              title="Vista Previa"
            >
              <FiEye className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Botón Publicar */}
        <button
          onClick={handlePublish}
          className="absolute right-0 top-0 bottom-0 flex items-center justify-center gap-2 bg-[#ff1b6d] text-white px-6 hover:bg-[#e0195f] transition-colors border-l border-[#2a2a2a]"
          title="Publicar página"
        >
          <FiGlobe className="w-4 h-4" />
          Publicar
        </button>
      </div>

      {/* Editor principal */}
      <div className="flex" style={{ height: 'calc(100vh - 80px)' }}>
        {/* Panel de elementos */}
        <ElementsPanel 
          onAddElement={handleAddElement}
        />

        {/* Canvas central */}
        <div className="flex-1">
          <Canvas 
            elements={elements}
            selectedElement={selectedElement}
            onSelectElement={handleSelectElement}
            viewportMode={viewportMode}
            onAddElement={handleAddElement}
            onDeleteElement={handleDeleteElement}
            onDuplicateElement={handleDuplicateElement}
            onAddToContainer={addToContainer}
            onMoveToContainer={moveToContainer}
            onUpdateElement={updateElement}
            onAddElementAtIndex={addElementAtIndex}
            onReorder={reorderElements}
            onReorderInContainer={reorderInContainer}
            onMoveOutOfContainer={moveOutOfContainer}
            CanvasElement={CanvasElement}
            collisionDetection={collisionDetection}
            setActiveDrag={setActiveDrag}
            onToggleEasyLayout={() => setShowEasyLayout(true)}
          />
        </div>

        {/* Panel de propiedades */}
        <PropertiesPanel
          selectedElement={selectedElement}
          onUpdateElement={updateElement}
        />
      </div>
      
      {/* Collision Detection Debugger */}
      <CollisionDebugger
        collisionDetection={collisionDetection}
        isDragging={activeDrag?.isDragging || false}
        activeRect={activeDrag?.rect}
        activeElement={activeDrag?.element}
      />
      
      {/* Easy Layout Modal */}
      {showEasyLayout && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-4xl w-full max-h-[90vh] overflow-auto">
            <EasyLayoutMode
              isActive={showEasyLayout}
              onToggle={() => setShowEasyLayout(false)}
              onCreateLayout={handleEasyLayoutCreate}
            />
          </div>
        </div>
      )}
    </div>
  );
}
export default Editor;