import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEditor } from '../../hooks/useEditor';
import { ELEMENT_TYPES } from '../../constants/elementTypes';
import { VIEWPORT_MODES, VIEWPORT_CONFIGS } from '../../constants/viewportConfigs';
import { getResponsiveProperty } from '../../utils/responsiveUtils';
import AurelioLogo from '../shared/AurelioLogo';
import CanvasTemplateSystem from './components/CanvasTemplateSystem';
import './slider-styles.css';

// Importar iconos necesarios
import {
  FiArrowLeft,
  FiSave,
  FiEye,
  FiGlobe,
  FiType,
  FiImage,
  FiSquare,
  FiGrid,
  FiMonitor,
  FiTablet,
  FiSmartphone,
  FiEdit3,
  FiTrash2,
  FiCopy,
  FiMove,
  FiMoreVertical,
  FiDroplet,
  FiSliders,
  FiPlus
} from 'react-icons/fi';
import AddContainerButton from './components/AddContainerButton';
import ContainerChild from './components/ContainerChild';

// Elementos disponibles en la sidebar
const availableElements = [
  {
    id: 'container',
    type: ELEMENT_TYPES.CONTAINER,
    name: 'Contenedor',
    icon: <FiGrid className="w-5 h-5" />,
    defaultProps: {
      layout: 'vertical',
      gap: '16px',
      padding: '20px',
      backgroundColor: 'transparent',
      borderRadius: '0px',
      border: 'none',
      minHeight: '100px',
      alignment: 'left',
      children: [],
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      flexWrap: 'nowrap',
      width: '100%',
      height: '200px',
      widthType: 'full'
    }
  },
  {
    id: 'heading',
    type: ELEMENT_TYPES.HEADING,
    name: 'Encabezado',
    icon: <FiType className="w-5 h-5" />,
    defaultProps: {
      text: 'Tu Encabezado Aquí',
      level: 1,
      alignment: 'left',
      color: '#000000',
      fontSize: '32px',
    }
  },
  {
    id: 'text',
    type: ELEMENT_TYPES.TEXT,
    name: 'Texto',
    icon: <FiType className="w-5 h-5" />,
    defaultProps: {
      text: 'Tu texto aquí. Puedes editarlo haciendo clic.',
      alignment: 'left',
      color: '#333333',
      fontSize: '16px',
    }
  },
  {
    id: 'image',
    type: ELEMENT_TYPES.IMAGE,
    name: 'Imagen',
    icon: <FiImage className="w-5 h-5" />,
    defaultProps: {
      src: '/api/placeholder/400/300',
      alt: 'Imagen',
      width: '100%',
      height: 'auto',
    }
  },
  {
    id: 'button',
    type: ELEMENT_TYPES.BUTTON,
    name: 'Botón',
    icon: <FiSquare className="w-5 h-5" />,
    defaultProps: {
      text: 'Haz Clic Aquí',
      link: '#',
      backgroundColor: '#8b5cf6',
      textColor: '#ffffff',
      padding: '12px 24px',
      borderRadius: '8px',
    }
  }
];

// Componente para elementos del panel
function PanelElement({ element, onClick }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      onClick(e);
    }
  };

  const handleDragStart = (e) => {
    console.log('🚀 PanelElement drag started:', element.name);
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'panel-element', element: element }));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      draggable
      onClick={handleClick}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`flex flex-col items-center justify-center p-4 bg-[#2a2a2a] rounded-lg text-white hover:bg-[#3a3a3a] transition-colors min-h-[80px] group cursor-grab active:cursor-grabbing select-none ${
        isDragging ? 'opacity-50 scale-95' : ''
      }`}
    >
      <div className="mb-2 group-hover:scale-110 transition-transform pointer-events-none">
        {element.icon}
      </div>
      <span className="text-xs text-center font-medium pointer-events-none">
        {element.name}
      </span>
      
      {/* Indicador visual de drag */}
      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-2 h-2 bg-[#8b5cf6] rounded-full" />
      </div>
    </div>
  );
}

// Panel de elementos disponibles
function ElementsPanel({ onAddElement }) {
  const handleElementClick = (element, e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddElement(element);
  };

  return (
    <div className="w-64 bg-[#1a1a1a] border-r border-[#2a2a2a] p-4">
      <h3 className="text-white font-semibold mb-4">Elementos</h3>
      <div className="text-xs text-gray-400 mb-3">
        Haz clic o arrastra para agregar
      </div>
      <div className="grid grid-cols-2 gap-3">
        {availableElements.map((element) => (
          <div key={element.id} className="relative">
            <PanelElement 
              element={element} 
              onClick={(e) => handleElementClick(element, e)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// Componente CanvasElement (elemento individual en canvas)
function CanvasElement({ element, index, isSelected, onSelect, onDelete, onDuplicate, onReorder, onAddElementAtIndex, onAddToContainer, onMoveToContainer, selectedElement, viewportMode, onUpdateElement }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAddButton, setShowAddButton] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const dragRef = useRef(null);
  const menuRef = useRef(null);

  // Efecto para cerrar el menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isMenuOpen]);

  const renderElement = () => {
    switch (element.type) {
      case ELEMENT_TYPES.CONTAINER:
        return (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
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
              
              console.log('🎯 CanvasElement Container onDrop triggered for:', element.id);
              
              try {
                const data = JSON.parse(e.dataTransfer.getData('text/plain'));
                console.log('📦 Canvas Container drag data:', data);
                
                if (data.type === 'panel-element') {
                  console.log('✅ Adding NEW element to main container:', element.id, 'Element:', data.element.name);
                  onAddToContainer(element.id, data.element);
                } else if (data.type === 'canvas-element') {
                  console.log('✅ Moving EXISTING element to main container:', element.id, 'Element ID:', data.id);
                  onMoveToContainer && onMoveToContainer(data.id, element.id);
                } else {
                  console.log('❌ Canvas Container drag data type not recognized:', data.type);
                }
              } catch (error) {
                console.error('❌ Error parsing canvas container drag data:', error);
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
                : (element.props.backgroundColor === 'transparent' ? 'transparent' : (element.props.backgroundColor || 'transparent')),
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
              overflow: 'visible',
              flexShrink: 0,
            }}
            className={`transition-all ${isDragOver ? 'bg-gray-50' : ''}`}
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
              <div className={`text-center py-8 transition-colors ${
                isDragOver ? 'text-gray-600' : 'text-gray-400'
              }`}>
                <FiGrid className={`w-8 h-8 mx-auto mb-2 opacity-50 ${
                  isDragOver ? 'text-gray-600' : ''
                }`} />
                <p className="text-sm">
                  {isDragOver ? '¡Suelta aquí para agregar!' : 'Contenedor vacío'}
                </p>
                <p className="text-xs">
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
        return <div className="p-4 bg-gray-700 rounded">Elemento: {element.type}</div>;
    }
  };

  const renderChildElement = (childElement) => {
    switch (childElement.type) {
      case ELEMENT_TYPES.HEADING:
        return (
          <div
            style={{
              color: childElement.props.color,
              fontSize: childElement.props.fontSize,
              textAlign: childElement.props.alignment,
            }}
          >
            <h1>{childElement.props.text}</h1>
          </div>
        );
      case ELEMENT_TYPES.TEXT:
        return (
          <div
            style={{
              color: childElement.props.color,
              fontSize: childElement.props.fontSize,
              textAlign: childElement.props.alignment,
            }}
          >
            {childElement.props.text}
          </div>
        );
      case ELEMENT_TYPES.IMAGE:
        return (
          <img
            src={childElement.props.src}
            alt={childElement.props.alt}
            style={{
              width: childElement.props.width,
              height: childElement.props.height,
              objectFit: 'cover',
            }}
          />
        );
      case ELEMENT_TYPES.BUTTON:
        return (
          <button
            style={{
              backgroundColor: childElement.props.backgroundColor,
              color: childElement.props.textColor,
              padding: childElement.props.padding,
              borderRadius: childElement.props.borderRadius,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {childElement.props.text}
          </button>
        );
      default:
        return <div className="p-4 bg-gray-700 rounded">Elemento: {childElement.type}</div>;
    }
  };

  const [dragOverPosition, setDragOverPosition] = useState(null); // 'top' or 'bottom'

  // Manejador para agregar contenedor debajo del elemento actual
  const handleAddContainer = (containerElement) => {
    if (typeof onAddElementAtIndex === 'function') {
      // Agregar el contenedor justo después del elemento actual
      onAddElementAtIndex(containerElement, index + 1);
    }
  };

  const handleDragStart = (e) => {
    setIsDragging(true);
    setIsMenuOpen(false); // Cerrar menú al iniciar drag
    e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'canvas-element', id: element.id, index }));
    e.dataTransfer.effectAllowed = 'move';
    
    // Crear imagen personalizada de arrastre
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
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDragOverPosition(null);
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
        // Reordenar elementos existentes
        let targetIndex = index;
        if (dragOverPosition === 'bottom') {
          targetIndex = index + 1;
        }
        
        onReorder(data.index, targetIndex);
      }
    } catch (error) {
      console.error('Error handling drop:', error);
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
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onMouseEnter={() => setShowAddButton(true)}
        onMouseLeave={() => setShowAddButton(false)}
        className={`relative group ${
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
        <div className="relative pointer-events-none">
          {renderElement()}
          
          {/* Handle de arrastre */}
          <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto">
            <div className="p-1">
              <FiMove className="w-3 h-3 text-black drop-shadow-sm" />
            </div>
          </div>
          
          {/* Menú desplegable de acciones */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto" ref={menuRef}>
            <div className="relative">
              {/* Botón de menú (3 puntos) */}
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
                      onDuplicate(element.id);
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
                      onDelete(element.id);
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
          
          {/* Overlay para indicar que es arrastrable */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-5 bg-[#8b5cf6] transition-opacity pointer-events-none" />
        </div>
        
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

// Componente Canvas principal
function Canvas({ elements, selectedElement, onSelectElement, viewportMode, onAddElement, onAddElementAtIndex, onDeleteElement, onDuplicateElement, onReorderElements, onAddToContainer, onMoveToContainer, onUpdateElement }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const viewportConfig = VIEWPORT_CONFIGS[viewportMode];
  
  // Funciones para el sistema de plantillas
  const handleAddContainerStructure = (structure) => {
    console.log('📦 Adding container structure:', structure);
    
    const elementTemplate = {
      id: structure.id || `element-${Date.now()}`,
      type: ELEMENT_TYPES.CONTAINER,
      name: 'Container Structure',
      defaultProps: structure.props
    };
    
    onAddElement(elementTemplate);
  };
  
  const handleLoadTemplate = (template) => {
    console.log('📚 Loading template:', template.name);
    if (template.elements && template.elements.length > 0) {
      template.elements.forEach((element, index) => {
        setTimeout(() => {
          onAddElement({ ...element, id: `template-element-${Date.now()}-${index}` });
        }, index * 100);
      });
    }
  };
  
  const handleUploadTemplate = (template) => {
    console.log('📁 Uploading template:', template);
    if (template.elements && template.elements.length > 0) {
      template.elements.forEach((element, index) => {
        setTimeout(() => {
          onAddElement({ ...element, id: `uploaded-element-${Date.now()}-${index}` });
        }, index * 100);
      });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      
      if (data.type === 'panel-element') {
        onAddElement(data.element);
      }
    } catch (error) {
      console.error('Error parsing drag data:', error);
    }
  };

  return (
    <div className="w-full h-full bg-gray-100">
      <div className="w-full h-full overflow-auto">
        <div className="w-full flex justify-center p-4">
          <div
            style={{
              width: viewportConfig.width,
              maxWidth: viewportConfig.maxWidth,
              minHeight: elements.length === 0 ? viewportConfig.minHeight : 'auto',
              padding: viewportConfig.padding,
              boxSizing: 'border-box',
            }}
            className={`bg-white transition-colors ${
              isDragOver ? 'bg-blue-50 ring-2 ring-blue-300' : ''
            } ${viewportMode === VIEWPORT_MODES.DESKTOP ? 'w-full' : 'rounded-lg shadow-lg border border-gray-200'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {elements.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[500px]">
                <div className={`text-center transition-all duration-300 ${
                  isDragOver 
                    ? 'transform scale-105 text-blue-600' 
                    : 'text-gray-500'
                }`}>
                  <div className={`w-20 h-20 mx-auto rounded-full border-2 border-dashed flex items-center justify-center transition-all duration-300 mb-6 ${
                    isDragOver 
                      ? 'border-blue-400 bg-blue-50 shadow-lg' 
                      : 'border-gray-300 bg-gray-50'
                  }`}>
                    {isDragOver ? (
                      <FiPlus className="w-8 h-8 text-blue-500" />
                    ) : (
                      <FiGrid className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-3 text-gray-700">
                    {isDragOver ? '¡Perfecto! Suelta aquí' : 'Comienza tu diseño'}
                  </h2>
                  
                  <p className="text-base mb-8 max-w-md mx-auto leading-relaxed">
                    {isDragOver 
                      ? 'Tu elemento será agregado al lienzo' 
                      : 'Arrastra elementos desde el panel lateral o elige una plantilla'}
                  </p>
                </div>
                
                <CanvasTemplateSystem
                  onAddContainerStructure={handleAddContainerStructure}
                  onLoadTemplate={handleLoadTemplate}
                  onUploadTemplate={handleUploadTemplate}
                />
              </div>
            ) : (
              <>
                {/* Elementos del canvas */}
                <div className="space-y-2 mb-8">
                {elements.map((element, index) => (
                  <CanvasElement
                    key={element.id}
                    element={element}
                    index={index}
                    isSelected={selectedElement?.id === element.id}
                    onSelect={onSelectElement}
                    onDelete={onDeleteElement}
                    onDuplicate={onDuplicateElement}
                    onReorder={onReorderElements}
                    onAddElementAtIndex={onAddElementAtIndex}
                    onAddToContainer={onAddToContainer}
                    onMoveToContainer={onMoveToContainer}
                    selectedElement={selectedElement}
                    viewportMode={viewportMode}
                    onUpdateElement={onUpdateElement}
                  />
                ))}
                </div>
                
                {/* Sistema de plantillas siempre visible */}
                <div className="border-t border-gray-200 pt-6">
                  <CanvasTemplateSystem
                    onAddContainerStructure={handleAddContainerStructure}
                    onLoadTemplate={handleLoadTemplate}
                    onUploadTemplate={handleUploadTemplate}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
  

// Panel de propiedades básico
function PropertiesPanel({ selectedElement, onUpdateElement }) {
  if (!selectedElement) {
    return (
      <div className="w-80 bg-[#1a1a1a] border-l border-[#2a2a2a] p-6">
        <p className="text-gray-400 text-sm">Selecciona un elemento para editar sus propiedades</p>
      </div>
    );
  }

  const handlePropertyChange = (property, value) => {
    const updatedElement = {
      ...selectedElement,
      props: {
        ...selectedElement.props,
        [property]: value,
      },
    };
    onUpdateElement(updatedElement);
  };

  return (
    <div className="w-80 bg-[#1a1a1a] border-l border-[#2a2a2a] p-6 overflow-y-auto">
      <h3 className="text-white font-semibold mb-4">Propiedades</h3>
      
      {(selectedElement.type === ELEMENT_TYPES.HEADING || selectedElement.type === ELEMENT_TYPES.TEXT) && (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Texto</label>
            <textarea
              value={selectedElement.props.text}
              onChange={(e) => handlePropertyChange('text', e.target.value)}
              className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-3 py-2 text-white resize-none"
              rows={3}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={selectedElement.props.color}
                onChange={(e) => handlePropertyChange('color', e.target.value)}
                className="w-12 h-10 bg-[#2a2a2a] border border-[#3a3a3a] rounded cursor-pointer"
              />
              <input
                type="text"
                value={selectedElement.props.color}
                onChange={(e) => handlePropertyChange('color', e.target.value)}
                className="flex-1 px-3 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded text-white text-sm font-mono"
                placeholder="#000000"
              />
            </div>
          </div>
        </>
      )}

      {selectedElement.type === ELEMENT_TYPES.BUTTON && (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Texto</label>
            <input
              type="text"
              value={selectedElement.props.text}
              onChange={(e) => handlePropertyChange('text', e.target.value)}
              className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-3 py-2 text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Color de fondo</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={selectedElement.props.backgroundColor}
                onChange={(e) => handlePropertyChange('backgroundColor', e.target.value)}
                className="w-12 h-10 bg-[#2a2a2a] border border-[#3a3a3a] rounded cursor-pointer"
              />
              <input
                type="text"
                value={selectedElement.props.backgroundColor}
                onChange={(e) => handlePropertyChange('backgroundColor', e.target.value)}
                className="flex-1 px-3 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded text-white text-sm font-mono"
                placeholder="#8b5cf6"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Selector de viewport
function ViewportSelector({ currentMode, onModeChange }) {
  return (
    <div className="flex items-center gap-1 bg-[#2a2a2a] rounded-lg p-1">
      {Object.entries(VIEWPORT_CONFIGS).map(([mode, config]) => {
        const IconComponent = config.icon;
        return (
          <button
            key={mode}
            onClick={() => onModeChange(mode)}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              currentMode === mode
                ? 'bg-[#ff1b6d] text-white'
                : 'text-gray-300 hover:bg-[#3a3a3a] hover:text-white'
            }`}
            title={`Vista ${config.name}`}
          >
            <IconComponent className="w-4 h-4" />
          </button>
        );
      })}
    </div>
  );
}

// Componente Editor principal
function Editor({ onExit }) {
  const navigate = useNavigate();
  const [viewportMode, setViewportMode] = useState(VIEWPORT_MODES.DESKTOP);
  const [projectName, setProjectName] = useState('Mi Proyecto');
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  // Usar el hook useEditor
  const {
    elements,
    selectedElement,
    addElement,
    addElementAtIndex,
    selectElement,
    updateElement,
    deleteElement,
    duplicateElementAtIndex,
    reorderElementByIndex,
    addToContainer,
    moveToContainer,
  } = useEditor();

  const handleAddElement = useCallback((elementTemplate) => {
    addElement(elementTemplate);
  }, [addElement]);

  const handleAddElementAtIndex = useCallback((elementTemplate, index) => {
    addElementAtIndex(elementTemplate, index);
  }, [addElementAtIndex]);

  const handleDeleteElement = useCallback((elementId) => {
    deleteElement(elementId);
  }, [deleteElement]);

  const handleDuplicateElement = useCallback((elementId) => {
    duplicateElementAtIndex(elementId);
  }, [duplicateElementAtIndex]);

  const handleReorderElements = useCallback((fromIndex, toIndex) => {
    console.log('Reordering elements from', fromIndex, 'to', toIndex);
    reorderElementByIndex(elements[fromIndex].id, toIndex);
  }, [elements, reorderElementByIndex]);

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
            onSelectElement={selectElement}
            viewportMode={viewportMode}
            onAddElement={handleAddElement}
            onAddElementAtIndex={handleAddElementAtIndex}
            onDeleteElement={handleDeleteElement}
            onDuplicateElement={handleDuplicateElement}
            onReorderElements={handleReorderElements}
            onAddToContainer={addToContainer}
            onMoveToContainer={moveToContainer}
            onUpdateElement={updateElement}
          />
        </div>

        {/* Panel de propiedades */}
        <PropertiesPanel
          selectedElement={selectedElement}
          onUpdateElement={updateElement}
        />
      </div>
    </div>
  );
}

export default Editor;