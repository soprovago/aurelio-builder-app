import React from 'react';
import { CanvasElement, ElementStyles } from '@/types';

interface TextRendererProps {
  element: CanvasElement;
  style?: ElementStyles;
}

const TextRenderer: React.FC<TextRendererProps> = ({ element }) => {
  const { props, styles } = element;
  
  const textStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    color: styles.color || '#374151',
    fontSize: styles.fontSize || '16px',
    fontWeight: styles.fontWeight || 'normal',
    textAlign: styles.textAlign || 'left',
    lineHeight: '1.5',
    padding: styles.padding || '0',
    margin: styles.margin || '0',
    display: 'flex',
    alignItems: 'center',
    userSelect: 'none',
    wordBreak: 'break-word',
  };

  return (
    <div 
      style={textStyle}
      className="text-element"
    >
      {props.text || 'Text Element'}
    </div>
  );
};

export default TextRenderer;