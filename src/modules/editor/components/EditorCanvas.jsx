import React, { useRef } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { CanvasElement, EditorState } from '@/types';
import ElementRenderer from './renderers/ElementRenderer';

interface EditorCanvasProps {
  canvas: EditorState['canvas'];
  ui: EditorState['ui'];
  elements: CanvasElement[];
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
}

const EditorCanvas: React.FC<EditorCanvasProps> = ({
  canvas,
  ui,
  elements,
  selectedElementId,
  onSelectElement,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Configurar el canvas como área de drop
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas',
  });

  // Estilos del canvas
  const canvasStyle: React.CSSProperties = {
    width: canvas.width,
    height: canvas.height,
    backgroundColor: canvas.backgroundColor,
    transform: `scale(${canvas.zoom})`,
    transformOrigin: '0 0',
    position: 'relative',
    overflow: 'hidden',
  };

  // Estilos del contenedor de canvas (con scroll y zoom)
  const canvasContainerStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    overflow: 'auto',
    padding: '40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: '#f3f4f6',
    backgroundImage: ui.showGrid ? 
      `linear-gradient(45deg, #e5e7eb 25%, transparent 25%), 
       linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), 
       linear-gradient(45deg, transparent 75%, #e5e7eb 75%), 
       linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)` : 
      'none',
    backgroundSize: ui.showGrid ? `${ui.gridSize * 2}px ${ui.gridSize * 2}px` : 'auto',
    backgroundPosition: ui.showGrid ? '0 0, 0 10px, 10px -10px, -10px 0px' : '0 0',
  };

  // Renderizar reglas si están habilitadas
  const renderRulers = () => {
    if (!ui.showRulers) return null;
    
    return (
      <>
        {/* Regla horizontal */}
        <div className="absolute top-0 left-10 right-0 h-10 bg-white border-b border-gray-300 flex items-end text-xs text-gray-500">
          {Array.from({ length: Math.ceil(canvas.width / 50) }, (_, i) => (
            <div key={i} className="flex-shrink-0 w-12 h-full relative">
              <div className="absolute bottom-0 left-0 w-px h-2 bg-gray-400"></div>
              <div className="absolute bottom-2 left-1 text-xs">{i * 50}</div>
            </div>
          ))}
        </div>
        
        {/* Regla vertical */}
        <div className="absolute top-10 left-0 bottom-0 w-10 bg-white border-r border-gray-300 flex flex-col items-end text-xs text-gray-500">
          {Array.from({ length: Math.ceil(canvas.height / 50) }, (_, i) => (
            <div key={i} className="flex-shrink-0 h-12 w-full relative">
              <div className="absolute top-0 right-0 h-px w-2 bg-gray-400"></div>
              <div className="absolute top-1 right-2 text-xs transform -rotate-90 origin-center">
                {i * 50}
              </div>
            </div>
          ))}
        </div>
        
        {/* Esquina de las reglas */}
        <div className="absolute top-0 left-0 w-10 h-10 bg-white border-r border-b border-gray-300"></div>
      </>
    );
  };

  return (
    <div className="flex-1 relative">
      {/* Reglas */}
      {renderRulers()}
      
      {/* Contenedor del canvas con scroll */}
      <div 
        style={canvasContainerStyle}
        className={ui.showRulers ? 'ml-10 mt-10' : ''}
      >
        {/* Canvas principal */}
        <div
          ref={(node) => {
            setNodeRef(node);
            if (canvasRef.current !== node) {
              (canvasRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
            }
          }}
          style={canvasStyle}
          className={`
            canvas-main 
            shadow-lg
            ${isOver ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}
            transition-all duration-200
          `}
          onClick={(e) => {
            // Deseleccionar si se hace clic en el canvas vacío
            if (e.target === e.currentTarget) {
              onSelectElement(null);
            }
          }}
        >
          {/* Indicador de área de drop */}
          {isOver && (
            <div className="absolute inset-0 bg-blue-50 bg-opacity-50 border-2 border-dashed border-blue-400 flex items-center justify-center pointer-events-none">
              <div className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg">
                Suelta el elemento aquí
              </div>
            </div>
          )}
          
          {/* Renderizar elementos */}
          {elements
            .filter(element => element.parentId === null) // Solo elementos de nivel superior
            .sort((a, b) => a.order - b.order) // Ordenar por order
            .map(element => (
              <ElementRenderer
                key={element.id}
                element={element}
                isSelected={selectedElementId === element.id}
                onSelect={onSelectElement}
              />
            ))}
          
          {/* Grid overlay si está habilitado */}
          {ui.showGrid && (
            <div 
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(to right, #94a3b8 1px, transparent 1px),
                  linear-gradient(to bottom, #94a3b8 1px, transparent 1px)
                `,
                backgroundSize: `${ui.gridSize}px ${ui.gridSize}px`,
              }}
            />
          )}
        </div>
      </div>
      
      {/* Información del canvas (esquina inferior derecha) */}
      <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white text-xs px-3 py-1 rounded pointer-events-none">
        {canvas.width} × {canvas.height} | {Math.round(canvas.zoom * 100)}%
      </div>
      
      {/* Controles de zoom (esquina inferior izquierda) */}
      <div className="absolute bottom-4 left-4 flex items-center space-x-2 bg-white rounded-lg shadow-md px-2 py-1">
        <button
          className="p-1 hover:bg-gray-100 rounded"
          onClick={() => {
            // Implementar zoom out
          }}
          title="Zoom Out"
        >
          −
        </button>
        <span className="text-xs font-mono min-w-[3rem] text-center">
          {Math.round(canvas.zoom * 100)}%
        </span>
        <button
          className="p-1 hover:bg-gray-100 rounded"
          onClick={() => {
            // Implementar zoom in
          }}
          title="Zoom In"
        >
          +
        </button>
        <div className="w-px h-4 bg-gray-300 mx-1"></div>
        <button
          className="p-1 hover:bg-gray-100 rounded text-xs"
          onClick={() => {
            // Implementar fit to screen
          }}
          title="Fit to Screen"
        >
          Fit
        </button>
      </div>
    </div>
  );
};

export default EditorCanvas;