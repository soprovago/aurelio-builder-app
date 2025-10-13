import React, { useState, useRef, useEffect } from 'react';
import { FiMoreVertical, FiCopy, FiTrash2, FiMove } from 'react-icons/fi';

/**
 * ElementMenu - Componente reutilizable para menús contextuales de elementos
 * 
 * Proporciona acciones comunes como duplicar, eliminar, etc.
 * de forma consistente a través de todos los elementos del canvas.
 */
function ElementMenu({ 
  element, 
  onDuplicate, 
  onDelete, 
  isVisible = false,
  className = "" 
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  // Cerrar menú cuando el elemento deja de ser visible
  useEffect(() => {
    if (!isVisible && isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [isVisible, isMenuOpen]);

  const handleDuplicate = (e) => {
    e.stopPropagation();
    if (onDuplicate && element) {
      onDuplicate(element.id);
    }
    setIsMenuOpen(false);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete && element) {
      onDelete(element.id);
    }
    setIsMenuOpen(false);
  };

  const handleMenuToggle = (e) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  if (!element) return null;

  return (
    <div className={`absolute top-2 right-2 transition-opacity pointer-events-auto ${className}`} ref={menuRef}>
      <div className="relative">
        {/* Botón de menú (3 puntos) */}
        <button
          onClick={handleMenuToggle}
          className="p-1 bg-gray-800 bg-opacity-80 text-white rounded hover:bg-gray-700 shadow-lg transition-colors"
          title="Más opciones"
          aria-label={`Opciones para ${element.type}`}
        >
          <FiMoreVertical className="w-3 h-3" />
        </button>
        
        {/* Menú desplegable */}
        {isMenuOpen && (
          <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[120px] z-50">
            <button
              onClick={handleDuplicate}
              className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors"
              title={`Duplicar ${element.type}`}
            >
              <FiCopy className="w-4 h-4 text-blue-500" />
              Duplicar
            </button>
            
            <div className="border-t border-gray-100"></div>
            
            <button
              onClick={handleDelete}
              className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
              title={`Eliminar ${element.type}`}
            >
              <FiTrash2 className="w-4 h-4" />
              Eliminar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * DragHandle - Componente para el indicador de arrastre
 */
export function DragHandle({ className = "", isVisible = false }) {
  return (
    <div className={`absolute top-2 left-2 transition-opacity pointer-events-none ${className}`}>
      <div className="p-2 bg-gray-900 bg-opacity-90 rounded-md shadow-lg border border-gray-600" title="Arrastra para reordenar elementos">
        <FiMove className="w-4 h-4 text-white" />
      </div>
    </div>
  );
}

/**
 * DragIndicators - Componente para mostrar indicadores de drop
 */
export function DragIndicators({ dragOverPosition }) {
  if (!dragOverPosition) return null;

  return (
    <>
      {/* Indicador de drop en la parte superior */}
      {dragOverPosition === 'top' && (
        <div className="absolute -top-1 left-0 right-0 z-50">
          <div className="h-1 bg-[#8b5cf6] rounded-full shadow-lg">
            <div className="absolute -left-1 -top-1 w-3 h-3 bg-[#8b5cf6] rounded-full" />
            <div className="absolute -right-1 -top-1 w-3 h-3 bg-[#8b5cf6] rounded-full" />
          </div>
        </div>
      )}
      
      {/* Indicador de drop en la parte inferior */}
      {dragOverPosition === 'bottom' && (
        <div className="absolute -bottom-1 left-0 right-0 z-50">
          <div className="h-1 bg-[#8b5cf6] rounded-full shadow-lg">
            <div className="absolute -left-1 -top-1 w-3 h-3 bg-[#8b5cf6] rounded-full" />
            <div className="absolute -right-1 -top-1 w-3 h-3 bg-[#8b5cf6] rounded-full" />
          </div>
        </div>
      )}
    </>
  );
}

export default ElementMenu;