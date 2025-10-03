import React from 'react';
import { ELEMENT_TYPES } from '../../../../constants/elementTypes';
import {
  FiType,
  FiImage,
  FiSquare,
  FiGrid
} from 'react-icons/fi';

/**
 * Configuración de elementos disponibles en el panel lateral del editor
 */
export const getAvailableElements = () => [
  {
    id: 'container',
    type: ELEMENT_TYPES.CONTAINER,
    name: 'Contenedor',
    icon: React.createElement(FiGrid, { className: "w-5 h-5" }),
    defaultProps: {
      children: [], // Array para elementos hijos
      layout: 'vertical',
      gap: '16px',
      padding: '20px',
      backgroundColor: 'transparent',
      borderRadius: '0px',
      border: 'none',
      minHeight: '100px',
      alignment: 'left',
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
    id: 'heading',
    type: ELEMENT_TYPES.HEADING,
    name: 'Encabezado',
    icon: React.createElement(FiType, { className: "w-5 h-5" }),
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
    icon: React.createElement(FiType, { className: "w-5 h-5" }),
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
    icon: React.createElement(FiImage, { className: "w-5 h-5" }),
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
    icon: React.createElement(FiSquare, { className: "w-5 h-5" }),
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

// Exportar también como array para compatibilidad
export const availableElements = getAvailableElements();
