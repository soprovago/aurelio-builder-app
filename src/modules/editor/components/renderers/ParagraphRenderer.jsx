import React from 'react';
import { CanvasElement } from '@/types';

interface ParagraphRendererProps {
  element: CanvasElement;
}

const ParagraphRenderer: React.FC<ParagraphRendererProps> = ({ element }) => {
  const { props, styles } = element;
  
  const paragraphStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    color: styles.color || '#374151',
    fontSize: styles.fontSize || '16px',
    fontWeight: styles.fontWeight || 'normal',
    textAlign: styles.textAlign || 'left',
    lineHeight: '1.6',
    padding: styles.padding || '0',
    margin: styles.margin || '0',
    display: 'flex',
    alignItems: 'flex-start',
    userSelect: 'none',
    wordBreak: 'break-word',
    overflow: 'hidden',
  };

  return (
    <p 
      style={paragraphStyle}
      className="paragraph-element"
    >
      {props.text || 'This is a paragraph of text.'}
    </p>
  );
};

export default ParagraphRenderer;