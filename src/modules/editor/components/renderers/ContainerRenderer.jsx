import React from 'react';
import { CanvasElement } from '@/types';

interface ContainerRendererProps {
  element: CanvasElement;
}

const ContainerRenderer: React.FC<ContainerRendererProps> = ({ element }) => {
  const { styles } = element;
  
  const containerStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    backgroundColor: styles.backgroundColor || '#f9fafb',
    border: styles.border || '2px dashed #d1d5db',
    borderRadius: styles.borderRadius || '8px',
    padding: styles.padding || '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  };

  return (
    <div style={containerStyle} className="container-element">
      <div className="text-gray-500 text-sm select-none pointer-events-none">
        Drop elements here
      </div>
    </div>
  );
};

export default ContainerRenderer;