import React from 'react';
import { CanvasElement } from '@/types';

interface LinkRendererProps {
  element: CanvasElement;
}

const LinkRenderer: React.FC<LinkRendererProps> = ({ element }) => {
  const { props, styles } = element;
  
  const linkStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    color: styles.color || '#3b82f6',
    fontSize: styles.fontSize || '16px',
    fontWeight: styles.fontWeight || 'normal',
    textAlign: styles.textAlign || 'left',
    textDecoration: styles.textDecoration || 'underline',
    lineHeight: '1.5',
    padding: styles.padding || '0',
    margin: styles.margin || '0',
    display: 'flex',
    alignItems: 'center',
    userSelect: 'none',
    cursor: 'pointer',
    wordBreak: 'break-word',
  };

  return (
    <a
      href={props.href || '#'}
      style={linkStyle}
      className="link-element hover:opacity-80"
      // Prevenir navegación en el editor
      onClick={(e) => e.preventDefault()}
      target={props.target || '_self'}
      rel={props.rel}
    >
      {props.text || 'Link'}
    </a>
  );
};

export default LinkRenderer;