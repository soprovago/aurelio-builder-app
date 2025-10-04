import React from 'react';
import { CanvasElement, ElementStyles } from '@/types';

interface ButtonRendererProps {
  element: CanvasElement;
  style?: ElementStyles;
}

const ButtonRenderer: React.FC<ButtonRendererProps> = ({ element }) => {
  const { props, styles } = element;
  
  const buttonStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    border: 'none',
    borderRadius: styles.borderRadius || '4px',
    backgroundColor: styles.backgroundColor || '#3b82f6',
    color: styles.color || '#ffffff',
    fontSize: styles.fontSize || '14px',
    fontWeight: styles.fontWeight || '500',
    padding: styles.padding || '8px 16px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    textDecoration: 'none',
    userSelect: 'none',
  };

  return (
    <button
      style={buttonStyle}
      className="hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      // Prevenir comportamientos por defecto en el editor
      onClick={(e) => e.preventDefault()}
      onMouseDown={(e) => e.preventDefault()}
    >
      {props.text || 'Button'}
    </button>
  );
};

export default ButtonRenderer;