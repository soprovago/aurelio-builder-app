import React, { createContext, useContext, useState, useEffect } from 'react';

// Crear el contexto
const AurelioBuilderContext = createContext();

// Provider del contexto
export function AurelioBuilderProvider({ children }) {
  // Inicializar estado desde localStorage
  const getInitialEditorData = () => {
    try {
      const savedEditorData = localStorage.getItem('aurelio-builder-editorData');
      if (savedEditorData) {
        const parsed = JSON.parse(savedEditorData);
        console.log('AurelioBuilderContext - Loaded state from localStorage:', parsed);
        return parsed;
      }
    } catch (error) {
      console.error('Error loading editor data from localStorage:', error);
      // Si hay error, limpiar el localStorage corrupto
      localStorage.removeItem('aurelio-builder-editorData');
    }
    console.log('AurelioBuilderContext - Using default state');
    return {
      isActive: true, // Para Aurelio standalone siempre está activo
      selectedTemplate: null,
      projectName: 'Mi Proyecto',
    };
  };

  const [editorData, setEditorData] = useState(getInitialEditorData);

  // Guardar estado del editor en localStorage cuando cambie
  useEffect(() => {
    try {
      localStorage.setItem('aurelio-builder-editorData', JSON.stringify(editorData));
    } catch (error) {
      console.error('Error saving editor data to localStorage:', error);
    }
  }, [editorData]);

  const startWithTemplate = (template = null) => {
    setEditorData(prev => ({
      ...prev,
      selectedTemplate: template,
    }));
  };

  const setProjectName = (name) => {
    setEditorData(prev => ({
      ...prev,
      projectName: name,
    }));
  };

  const clearProject = () => {
    console.log('AurelioBuilderContext - Clearing project');
    setEditorData({
      isActive: true,
      selectedTemplate: null,
      projectName: 'Nuevo Proyecto',
    });
    // Limpiar también el estado del lienzo
    try {
      localStorage.removeItem('aurelio-builder-editorState');
    } catch (error) {
      console.error('Error clearing editor state:', error);
    }
  };

  // Función para resetear completamente el estado (útil para debugging)
  const resetState = () => {
    console.log('AurelioBuilderContext - Resetting all state');
    setEditorData({
      isActive: true,
      selectedTemplate: null,
      projectName: 'Nuevo Proyecto',
    });
    try {
      localStorage.removeItem('aurelio-builder-editorData');
      localStorage.removeItem('aurelio-builder-editorState');
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  };

  const value = {
    editorData,
    isActive: editorData.isActive,
    selectedTemplate: editorData.selectedTemplate,
    projectName: editorData.projectName,
    startWithTemplate,
    setProjectName,
    clearProject,
    resetState,
  };

  return (
    <AurelioBuilderContext.Provider value={value}>
      {children}
    </AurelioBuilderContext.Provider>
  );
}

// Hook personalizado para usar el contexto
export function useAurelioBuilder() {
  const context = useContext(AurelioBuilderContext);
  if (!context) {
    throw new Error('useAurelioBuilder must be used within an AurelioBuilderProvider');
  }
  return context;
}

export default AurelioBuilderContext;