import React from 'react';
import { CanvasElement } from '@/types';

interface InputRendererProps {
  element: CanvasElement;
}

const InputRenderer: React.FC<InputRendererProps> = ({ element }) => {
  const { props, styles } = element;
  
  const inputStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    border: styles.border || '1px solid #d1d5db',
    borderRadius: styles.borderRadius || '4px',
    padding: styles.padding || '8px 12px',
    fontSize: styles.fontSize || '14px',
    color: styles.color || '#374151',
    backgroundColor: styles.backgroundColor || '#ffffff',
    outline: 'none',
  };

  return (
    <input
      type="text"
      style={inputStyle}
      placeholder={props.placeholder || 'Enter text...'}
      className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      // Prevenir edición en modo editor
      readOnly
    />
  );
};

export default InputRenderer;