import { ELEMENT_TYPES } from './elementTypes';

/**
 * Elementos disponibles en la barra lateral del editor
 * 
 * Cada elemento define:
 * - id: identificador único
 * - type: tipo de elemento (debe coincidir con ELEMENT_TYPES)
 * - name: nombre visible al usuario
 * - iconName: nombre del icono (se renderiza en ElementsPanel)
 * - defaultProps: propiedades por defecto al crear el elemento
 */
export const availableElements = [
  {
    id: 'container',
    type: ELEMENT_TYPES.CONTAINER,
    name: 'Contenedor',
    iconName: 'FiGrid',
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
    iconName: 'FiType',
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
    iconName: 'FiType',
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
    iconName: 'FiImage',
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
    iconName: 'FiSquare',
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

export default availableElements;