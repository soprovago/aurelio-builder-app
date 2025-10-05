import React from 'react';
import { ELEMENT_TYPES } from '../../../constants/elementTypes';
import {
  FiType,
  FiImage,
  FiSquare,
  FiGrid,
} from 'react-icons/fi';

// Elementos disponibles en la sidebar
export const availableElements = [
  {
    id: 'container',
    type: ELEMENT_TYPES.CONTAINER,
    name: 'Contenedor',
    icon: <FiGrid className="w-5 h-5" />,
    defaultProps: {
      children: [],
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
      href: '#',
      target: '_self',
      rel: '',
      buttonType: 'button',
      disabled: false,
      backgroundColor: '#8b5cf6',
      textColor: '#ffffff',
      backgroundColorHover: '#7c3aed',
      textColorHover: '#ffffff',
      fontSize: '16px',
      fontWeight: '500',
      fontFamily: 'Inter, sans-serif',
      padding: '12px 24px',
      margin: '0px',
      borderRadius: '8px',
      border: 'none',
      transition: 'all 0.2s ease',
      alignSelf: 'auto',
      ariaLabel: ''
    }
  }
];