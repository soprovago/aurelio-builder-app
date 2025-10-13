import React, { useState, useRef, useEffect } from 'react';
import { ELEMENT_TYPES } from '../../../constants/elementTypes';
import { FiGrid, FiMoreVertical, FiCopy, FiTrash2, FiMove } from 'react-icons/fi';

/**
 * Componente para renderizar elementos hijo dentro de contenedores
 * Soporta drag & drop recursivo y anidación de contenedores
 */
function ContainerChild({ 
  element, 
  onSelect, 
  onDelete, 
  onDuplicate, 
  isSelected, 
  onAddToContainer, 
  onMoveToContainer, 
  selectedElement, 
  viewportMode, 
  parentElement, 
  onUpdateElement,
  // Props adicionales para el canvas principal (reordenamiento)
  onAddElementAtIndex,
  onReorder,
  index,
  allElements
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dragOverPosition, setDragOverPosition] = useState(null);
  const childRef = useRef(null);
  const menuRef = useRef(null);
  
  // Determinar si estamos en el canvas principal (sin padre)
  const isInCanvasRoot = !parentElement;

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMenuOpen]);

  const handleDragStart = (e) => {
    console.log('🚀 ContainerChild drag started:', element.id, element.type, 'Parent:', parentElement?.id, 'Index:', index);
    setIsDragging(true);
    setIsMenuOpen(false);
    e.dataTransfer.setData('text/plain', JSON.stringify({ 
      type: 'canvas-element', 
      id: element.id,
      parentId: parentElement?.id || null, // Incluir información del padre
      index: index || 0 // Incluir índice del elemento
    }));
    e.dataTransfer.effectAllowed = 'move';
    // No detener la propagación para permitir que el parent también pueda manejar el evento
  };

  const handleDragEnd = (e) => {
    console.log('🏁 ContainerChild drag ended:', element.id);
    setIsDragging(false);
    setDragOverPosition(null);
    // No detener propagación para permitir que otros componentes manejen el evento
  };
  
  // Handlers para reordenamiento en canvas principal
  const handleElementDragOver = (e) => {
    if (!isInCanvasRoot) return; // Solo para elementos en canvas principal
    
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
    
    // Calcular posición de drop
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseY = e.clientY;
    const elementMiddle = rect.top + rect.height / 2;
    
    setDragOverPosition(mouseY < elementMiddle ? 'top' : 'bottom');
  };
  
  const handleElementDragLeave = (e) => {
    if (!isInCanvasRoot) return;
    
    // Solo limpiar si realmente salimos del elemento
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverPosition(null);
    }
  };
  
  const handleElementDrop = (e) => {
    if (!isInCanvasRoot) return; // Solo para elementos en canvas principal
    
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
        // Reordenar elementos existentes
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
      console.error('Error handling drop in canvas:', error);
    }
  };

  const renderChildElement = () => {
    switch (element.type) {
      case ELEMENT_TYPES.CONTAINER:
        return (
          <div
            onDragOver={(e) => {
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
              setIsDragOver(true);
            }}
            onDragLeave={(e) => {
              e.stopPropagation();
              if (!e.currentTarget.contains(e.relatedTarget)) {
                setIsDragOver(false);
              }
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDragOver(false);
              
              console.log('🎯 ContainerChild onDrop triggered for container:', element.id);
              
              try {
                const data = JSON.parse(e.dataTransfer.getData('text/plain'));
                console.log('📦 Drag data:', data);
                
                if (data.type === 'panel-element') {
                  console.log('✅ Adding element to nested container:', element.id, 'Element:', data.element.name);
                  if (typeof onAddToContainer === 'function') {
                    onAddToContainer(element.id, data.element);
                  } else {
                    console.error('❌ onAddToContainer is not a function!');
                  }
                } else if (data.type === 'canvas-element') {
                  console.log('✅ Moving EXISTING element to nested container:', element.id, 'Element ID:', data.id);
                  if (typeof onMoveToContainer === 'function') {
                    onMoveToContainer(data.id, element.id);
                  } else {
                    console.error('❌ onMoveToContainer is not a function!');
                  }
                } else {
                  console.log('❌ Drag data type not recognized:', data.type);
                }
              } catch (error) {
                console.error('❌ Error parsing drag data:', error);
              }
            }}
            style={{
              width: element.props.widthType === 'full' ? '100%' : element.props.width || '100%',
              height: 'auto',
              minHeight: element.props.height && element.props.height !== 'auto' 
                ? element.props.height 
                : (element.props.minHeight || '100px'),
              display: 'flex',
              flexDirection: element.props.flexDirection || 'column',
              gap: element.props.gap || '16px',
              padding: element.props.padding || '20px',
              backgroundColor: element.props.glassEffect 
                ? `${element.props.glassColor || '#ffffff'}${Math.round((element.props.glassOpacity || 20) * 2.55).toString(16).padStart(2, '0')}` 
                : element.props.backgroundColor,
              backgroundImage: element.props.backgroundImage || 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backdropFilter: element.props.glassEffect ? `blur(${element.props.glassBlur || 10}px)` : 'none',
              WebkitBackdropFilter: element.props.glassEffect ? `blur(${element.props.glassBlur || 10}px)` : 'none',
              borderRadius: element.props.borderRadius || '0px',
              border: isDragOver ? '2px dashed #8b5cf6' : 
                      (isSelected || (!element.props.children || element.props.children.length === 0)) ? 
                      element.props.border || '1px dashed #d1d5db' : 'none',
              alignItems: element.props.alignItems || 'stretch',
              justifyContent: element.props.justifyContent || 'flex-start',
              flexWrap: element.props.flexWrap || 'nowrap',
              boxSizing: 'border-box',
              overflow: 'visible', // ✅ Permitir expansión del contenido
              flexShrink: 0, // ✅ No encogerse
              flex: '0 0 auto', // ✅ Usar tamaño natural sin crecer/encogerse forzadamente
            }}
            className={isDragOver ? 'bg-gray-50' : ''}
          >
            {element.props.children && element.props.children.length > 0 ? (
              element.props.children.map((child) => (
                <div key={child.id} className={
                  element.props.flexDirection === 'row' || element.props.flexDirection === 'row-reverse' 
                    ? 'flex-1 min-w-0 relative' 
                    : 'w-full'
                }>
                  <ContainerChild
                    element={child}
                    onSelect={onSelect}
                    onDelete={(childId) => onDelete(childId, element.id)}
                    onDuplicate={(childElement) => onDuplicate(childElement, element.id)}
                    isSelected={selectedElement?.id === child.id}
                    onAddToContainer={onAddToContainer}
                    onMoveToContainer={onMoveToContainer}
                    selectedElement={selectedElement}
                    viewportMode={viewportMode}
                    parentElement={element}
                    onUpdateElement={onUpdateElement}
                  />
                </div>
              ))
            ) : (
              <div className={`text-center py-4 transition-colors ${
                isDragOver ? 'text-gray-600' : 'text-gray-400'
              }`}>
                <FiGrid className={`w-6 h-6 mx-auto mb-2 opacity-50 ${
                  isDragOver ? 'text-gray-600' : ''
                }`} />
                <p className="text-xs">
                  {isDragOver ? 'Suelta aquí' : 'Contenedor anidado'}
                </p>
                <p className="text-xs opacity-70">
                  {isDragOver ? 'Elemento listo para agregarse' : 'Arrastra elementos aquí'}
                </p>
              </div>
            )}
          </div>
        );

      case ELEMENT_TYPES.HEADING:
        return (
          <div
            style={{
              color: element.props.color,
              fontSize: element.props.fontSize,
              textAlign: element.props.alignment,
            }}
          >
            <h1>{element.props.text}</h1>
          </div>
        );

      case ELEMENT_TYPES.TEXT:
        return (
          <div
            style={{
              color: element.props.color,
              fontSize: element.props.fontSize,
              textAlign: element.props.alignment,
            }}
          >
            {element.props.text}
          </div>
        );

      case ELEMENT_TYPES.IMAGE:
        return (
          <img
            src={element.props.src}
            alt={element.props.alt}
            style={{
              width: element.props.width,
              height: element.props.height,
              objectFit: 'cover',
            }}
          />
        );

      case ELEMENT_TYPES.BUTTON:
        return (
          <button
            style={{
              backgroundColor: element.props.backgroundColor,
              backgroundImage: element.props.backgroundImage || 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              color: element.props.textColor,
              padding: element.props.padding,
              borderRadius: element.props.borderRadius,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {element.props.text}
          </button>
        );

      default:
        return <div className="p-2 bg-gray-100 rounded text-center text-sm text-gray-500">Elemento: {element.type}</div>;
    }
  };

  // Todos los elementos deben ser draggable, incluyendo contenedores
  const shouldBeDraggable = true;

  // Handler simplificado para la selección de elementos
  const handleElementClick = (e) => {
    console.log('🎯 ContainerChild click:', {
      elementId: element.id,
      elementType: element.type,
      isSelected,
      parentId: parentElement?.id
    });
    
    // IMPORTANTE: No usar stopPropagation aquí porque interfiere con la solución del wrapper en Editor.jsx
    onSelect(element);
  };

  return (
    <div className="relative">
      {/* Indicadores de posición de drop para canvas principal */}
      {isInCanvasRoot && dragOverPosition && (
        <div className={`absolute left-0 right-0 h-0.5 bg-[#8b5cf6] z-10 transition-all ${
          dragOverPosition === 'top' ? '-top-1' : '-bottom-1'
        }`} />
      )}
      
      <div
        ref={childRef}
        draggable={shouldBeDraggable}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        // Agregar handlers de reordenamiento solo para canvas principal
        {...(isInCanvasRoot ? {
          onDragOver: handleElementDragOver,
          onDragLeave: handleElementDragLeave,
          onDrop: handleElementDrop,
        } : {})}
        className={`relative group/item ${isSelected ? 'ring-2 ring-[#8b5cf6]' : ''} ${
          isDragging ? 'opacity-70' : ''
        } ${
          isInCanvasRoot && dragOverPosition ? 'ring-2 ring-[#8b5cf6] ring-opacity-50' : 'hover:ring-2 hover:ring-[#8b5cf6] hover:ring-opacity-30'
        } transition-all cursor-grab active:cursor-grabbing`}
        onClick={handleElementClick}
      >
      {/* Contenido del elemento */}
      {renderChildElement()}
      
      {/* Overlay de herramientas para elementos hijo */}
      <div className="absolute top-1 right-1 opacity-0 group-hover/item:opacity-100 transition-opacity pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-1">
          {/* Handle de mover */}
          <div
            className="p-1 bg-[#8b5cf6] text-white rounded hover:bg-[#7c3aed] transition-all cursor-grab active:cursor-grabbing"
            title="Mover"
          >
            <FiMove className="w-3 h-3" />
          </div>
          
          {/* Menú de acciones */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              className="p-1 bg-gray-800 bg-opacity-80 text-white rounded hover:bg-gray-700 shadow-lg transition-colors"
              title="Más opciones"
            >
              <FiMoreVertical className="w-3 h-3" />
            </button>
            
            {/* Menú desplegable */}
            {isMenuOpen && (
              <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[120px] z-50">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicate(element, parentElement?.id || null);
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors"
                >
                  <FiCopy className="w-4 h-4 text-blue-500" />
                  Duplicar
                </button>
                <div className="border-t border-gray-100"></div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(element.id, parentElement?.id || null);
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                >
                  <FiTrash2 className="w-4 h-4" />
                  Eliminar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

export default ContainerChild;