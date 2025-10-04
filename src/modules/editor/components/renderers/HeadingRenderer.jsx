import React from 'react';
import { CanvasElement } from '@/types';

interface HeadingRendererProps {
  element: CanvasElement;
}

const HeadingRenderer: React.FC<HeadingRendererProps> = ({ element }) => {
  const { props, styles } = element;
  
  const headingStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    color: styles.color || '#111827',
    fontSize: styles.fontSize || '32px',
    fontWeight: styles.fontWeight || 'bold',
    textAlign: styles.textAlign || 'left',
    lineHeight: '1.2',
    padding: styles.padding || '0',
    margin: styles.margin || '0',
    display: 'flex',
    alignItems: 'center',
    userSelect: 'none',
    wordBreak: 'break-word',
  };

  return (
    <h1 
      style={headingStyle}
      className="heading-element"
    >
      {props.text || 'Heading'}
    </h1>
  );
};

export default HeadingRenderer;