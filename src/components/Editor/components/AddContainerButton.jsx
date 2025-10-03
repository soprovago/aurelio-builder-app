import React, { useState, useRef, useEffect } from 'react';
import { FiPlus, FiGrid, FiColumns } from 'react-icons/fi';
import { ELEMENT_TYPES } from '../../../constants/elementTypes';

// Estilos CSS para animaciones personalizadas
const animationStyles = `
  @keyframes slideInScale {
    0% {
      opacity: 0;
      transform: translateY(10px) scale(0.9);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

// Inyectar estilos si no existen
if (typeof document !== 'undefined' && !document.getElementById('add-container-animations')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'add-container-animations';
  styleSheet.textContent = animationStyles;
  document.head.appendChild(styleSheet);
}

/**
 * Componente para botón de agregar contenedor
 * Aparece al hacer hover en la parte inferior central de un contenedor
 */
function AddContainerButton({ onAddContainer, className = '' }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && 
          buttonRef.current && !buttonRef.current.contains(event.target)) {
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

  const containerStructures = [
    {
      id: 'single-container',
      name: 'Contenedor',
      description: '1 columna',
      icon: <FiGrid className="w-4 h-4" />,
      props: {
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
        height: 'auto',
        widthType: 'full'
      }
    },
    {
      id: 'two-columns',
      name: '2 Columnas',
      description: 'Layout en 2 columnas',
      icon: <FiColumns className="w-4 h-4" />,
      props: {
        layout: 'horizontal',
        gap: '20px',
        padding: '20px',
        backgroundColor: 'transparent',
        borderRadius: '0px',
        border: 'none',
        minHeight: '200px',
        alignment: 'left',
        children: [
          {
            id: `col-1-${Date.now()}`,
            type: ELEMENT_TYPES.CONTAINER,
            props: {
              layout: 'vertical',
              gap: '12px',
              padding: '16px',
              backgroundColor: 'transparent',
              borderRadius: '0px',
              border: 'none',
              minHeight: '150px',
              width: '50%',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'stretch',
              children: []
            }
          },
          {
            id: `col-2-${Date.now() + 1}`,
            type: ELEMENT_TYPES.CONTAINER,
            props: {
              layout: 'vertical',
              gap: '12px',
              padding: '16px',
              backgroundColor: 'transparent',
              borderRadius: '0px',
              border: 'none',
              minHeight: '150px',
              width: '50%',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'stretch',
              children: []
            }
          }
        ],
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        flexWrap: 'nowrap',
        width: '100%',
        height: 'auto',
        widthType: 'full'
      }
    },
    {
      id: 'three-columns',
      name: '3 Columnas',
      description: 'Layout en 3 columnas',
      icon: (
        <div className="flex gap-0.5">
          <div className="w-1 h-4 bg-current rounded-sm"></div>
          <div className="w-1 h-4 bg-current rounded-sm"></div>
          <div className="w-1 h-4 bg-current rounded-sm"></div>
        </div>
      ),
      props: {
        layout: 'horizontal',
        gap: '16px',
        padding: '20px',
        backgroundColor: 'transparent',
        borderRadius: '0px',
        border: 'none',
        minHeight: '200px',
        alignment: 'left',
        children: [
          {
            id: `col-1-${Date.now()}`,
            type: ELEMENT_TYPES.CONTAINER,
            props: {
              layout: 'vertical',
              gap: '12px',
              padding: '16px',
              backgroundColor: 'transparent',
              borderRadius: '0px',
              border: 'none',
              minHeight: '150px',
              width: '33.333%',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'stretch',
              children: []
            }
          },
          {
            id: `col-2-${Date.now() + 1}`,
            type: ELEMENT_TYPES.CONTAINER,
            props: {
              layout: 'vertical',
              gap: '12px',
              padding: '16px',
              backgroundColor: 'transparent',
              borderRadius: '0px',
              border: 'none',
              minHeight: '150px',
              width: '33.333%',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'stretch',
              children: []
            }
          },
          {
            id: `col-3-${Date.now() + 2}`,
            type: ELEMENT_TYPES.CONTAINER,
            props: {
              layout: 'vertical',
              gap: '12px',
              padding: '16px',
              backgroundColor: 'transparent',
              borderRadius: '0px',
              border: 'none',
              minHeight: '150px',
              width: '33.333%',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'stretch',
              children: []
            }
          }
        ],
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        flexWrap: 'nowrap',
        width: '100%',
        height: 'auto',
        widthType: 'full'
      }
    }
  ];

  const handleStructureSelect = (structure) => {
    const containerElement = {
      id: `container-${Date.now()}`,
      type: ELEMENT_TYPES.CONTAINER,
      name: structure.name,
      defaultProps: structure.props
    };

    onAddContainer(containerElement);
    setIsMenuOpen(false);
  };

  return (
    <div className={`absolute -bottom-4 left-1/2 transform -translate-x-1/2 z-20 ${className}`}>
      {/* Botón principal circular */}
      <button
        ref={buttonRef}
        onClick={(e) => {
          e.stopPropagation();
          setIsMenuOpen(!isMenuOpen);
        }}
        className="relative w-6 h-6 bg-[#8b5cf6] text-white rounded-full shadow-md hover:bg-[#7c3aed] transition-all duration-200 flex items-center justify-center group hover:scale-110"
        title="Añadir Contenedor"
      >
        <FiPlus className={`w-3 h-3 transition-transform duration-200 ${isMenuOpen ? 'rotate-45' : 'group-hover:scale-110'}`} />
        
        {/* Anillo decorativo */}
        <div className="absolute -inset-0.5 bg-[#8b5cf6] rounded-full opacity-15 animate-ping group-hover:animate-none"></div>
      </button>

      {/* Menú desplegable */}
      {isMenuOpen && (
        <div 
          ref={menuRef} 
          className="absolute bottom-10 backdrop-blur-lg bg-[#1a1a1a]/90 border border-[#2a2a2a]/80 rounded-lg shadow-2xl p-4 z-50"
          style={{
            left: '50%',
            transform: 'translateX(-50%)',
            width: '380px',
            animation: 'slideInScale 0.3s ease-out forwards',
            backdropFilter: 'blur(16px) saturate(180%)',
            WebkitBackdropFilter: 'blur(16px) saturate(180%)',
            background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(42, 42, 42, 0.8) 100%)'
          }}
        >
          <div className="text-center mb-3">
            <h4 className="text-sm font-semibold text-white">Añadir Contenedor</h4>
            <p className="text-xs text-gray-400 mt-1">Selecciona una estructura</p>
          </div>
          
          <div className="border-t border-[#2a2a2a]/40 mb-3"></div>
          
          <div className="flex gap-3">
            {containerStructures.map((structure) => (
              <button
                key={structure.id}
                onClick={() => handleStructureSelect(structure)}
                className="flex flex-col items-center justify-center p-3 hover:bg-white/10 rounded-lg transition-all duration-200 group flex-1 hover:scale-105 min-w-0"
                title={structure.description}
              >
                <div className="w-8 h-8 bg-[#8b5cf6]/25 rounded-lg flex items-center justify-center text-[#8b5cf6] group-hover:bg-[#8b5cf6]/40 mb-2 transition-all duration-200">
                  {structure.icon}
                </div>
                <div className="text-xs font-medium text-white text-center whitespace-nowrap overflow-hidden text-ellipsis w-full">
                  {structure.name}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Flecha indicadora del menú */}
      {isMenuOpen && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[4px] border-l-transparent border-r-transparent z-40" 
             style={{ borderTopColor: 'rgba(26, 26, 26, 0.9)' }}>
        </div>
      )}
    </div>
  );
}

export default AddContainerButton;