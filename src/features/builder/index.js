// Punto de entrada principal para la feature builder
export { default as Builder } from './components/Builder';
export { default as Canvas } from './components/Canvas';
export { default as CanvasElement } from './components/CanvasElement';
export { default as CanvasElementRenderer } from './components/CanvasElementRenderer';
export { default as ElementsPanel } from './components/ElementsPanel';
export { default as ElementMenu, DragHandle, DragIndicators } from './components/ElementMenu';
export { default as PanelElement } from './components/PanelElement';
export { default as PropertiesPanel } from './components/PropertiesPanel';
export { default as ViewportSelector } from './components/ViewportSelector';

// Hooks
export { default as useBuilderState } from './hooks/useBuilderState';
export { default as useDragDropManager } from './hooks/useDragDropManager';
export { default as useElementOperations } from './hooks/useElementOperations';
export { default as useElementUtils } from './hooks/useElementUtils';

// Utilidades
export { availableElements } from './utils/availableElements.jsx';
