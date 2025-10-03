// Punto de entrada principal para la feature builder
export { default as Builder } from './components/Builder';
export { default as ElementsPanel } from './components/ElementsPanel';
export { default as ViewportSelector } from './components/ViewportSelector';
export { default as PropertiesPanel } from './components/PropertiesPanel';
export { default as PanelElement } from './components/PanelElement';

// Hooks
export { useBuilderState } from './hooks/useBuilderState';
export { useElementOperations } from './hooks/useElementOperations';
export { useElementUtils } from './hooks/useElementUtils';

// Utilidades
export { availableElements } from './utils/availableElements.jsx';
