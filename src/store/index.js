// ==========================================
// STORES CENTRALIZADOS
// ==========================================

// Exportar todos los stores individuales
export { useAuthStore } from './authStore';
export { useProjectsStore } from './projectsStore';
export { useEditorStore, useCreateElement } from './editorStore';

// Exportar tipos relevantes
export type {
  User,
  AuthState,
  Project,
  ProjectsState,
  CanvasElement,
  EditorState,
  ElementType,
  Position,
  Size,
  DragData,
  DropResult,
} from '@/types';

// Hook combinado para acceder a múltiples stores si es necesario
export const useAppStore = () => ({
  auth: useAuthStore(),
  projects: useProjectsStore(),
  editor: useEditorStore(),
});

// Selectores útiles para evitar re-renders innecesarios
export const useAuthUser = () => useAuthStore((state) => state.user);
export const useAuthState = () => useAuthStore((state) => ({
  isAuthenticated: state.isAuthenticated,
  isLoading: state.isLoading,
  error: state.error,
}));

export const useProjectsList = () => useProjectsStore((state) => ({
  projects: state.projectIds.map(id => state.projects[id]),
  isLoading: state.isLoading,
  error: state.error,
}));

export const useSelectedProject = () => {
  const selectedId = useProjectsStore((state) => state.selectedProjectId);
  const project = useProjectsStore((state) => 
    selectedId ? state.projects[selectedId] : null
  );
  return { project, selectedId };
};

export const useCanvasElements = () => useEditorStore((state) => ({
  elements: state.elementIds.map(id => state.elements[id]),
  selectedElementId: state.selectedElementId,
}));

export const useSelectedElement = () => {
  const selectedId = useEditorStore((state) => state.selectedElementId);
  const element = useEditorStore((state) => 
    selectedId ? state.elements[selectedId] : null
  );
  return { element, selectedId };
};

export const useCanvasState = () => useEditorStore((state) => ({
  canvas: state.canvas,
  ui: state.ui,
}));