import React from 'react';
import { CanvasElement } from '@/types';

interface ImageRendererProps {
  element: CanvasElement;
}

const ImageRenderer: React.FC<ImageRendererProps> = ({ element }) => {
  const { props, styles } = element;
  
  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: styles.borderRadius || '4px',
    border: styles.border,
  };

  return (
    <img
      src={props.src || 'https://picsum.photos/200/150'}
      alt={props.alt || 'Image'}
      style={imageStyle}
      className="select-none"
      draggable={false}
      onError={(e) => {
        // Fallback en caso de error de imagen
        const target = e.target as HTMLImageElement;
        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNHB4IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2UgTm90IEZvdW5kPC90ZXh0Pjwvc3ZnPg==';
      }}
    />
  );
};

export default ImageRenderer;