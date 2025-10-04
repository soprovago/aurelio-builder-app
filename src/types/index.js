// ==========================================
// TIPOS PARA AUTENTICACIÓN
// ==========================================
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// ==========================================
// TIPOS PARA PROYECTOS (DASHBOARD)
// ==========================================
export interface Project {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface ProjectsState {
  // Estado normalizado usando Map para búsqueda O(1)
  projects: Record<string, Project>;
  projectIds: string[];
  selectedProjectId: string | null;
  isLoading: boolean;
  error: string | null;
}

// ==========================================
// TIPOS PARA EL EDITOR DE UI
// ==========================================
export type ElementType = 
  | 'button'
  | 'text'
  | 'input'
  | 'image'
  | 'container'
  | 'heading'
  | 'paragraph'
  | 'link';

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface ElementStyles {
  backgroundColor?: string;
  color?: string;
  fontSize?: string;
  fontWeight?: string;
  padding?: string;
  margin?: string;
  border?: string;
  borderRadius?: string;
  textAlign?: 'left' | 'center' | 'right';
}

export interface ElementProps {
  text?: string;
  src?: string;
  href?: string;
  placeholder?: string;
  alt?: string;
  [key: string]: any;
}

export interface CanvasElement {
  id: string;
  type: ElementType;
  position: Position;
  size: Size;
  styles: ElementStyles;
  props: ElementProps;
  parentId: string | null;
  children: string[];
  order: number;
  isLocked: boolean;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EditorState {
  // Estado normalizado para elementos del canvas
  elements: Record<string, CanvasElement>;
  elementIds: string[];
  selectedElementId: string | null;
  clipboardElementId: string | null;
  
  // Estado del canvas
  canvas: {
    width: number;
    height: number;
    backgroundColor: string;
    zoom: number;
  };
  
  // Estado de la interfaz
  ui: {
    showGrid: boolean;
    showRulers: boolean;
    snapToGrid: boolean;
    gridSize: number;
  };
  
  // Historial para undo/redo
  history: {
    past: EditorState[];
    present: EditorState | null;
    future: EditorState[];
  };
  
  // Estado de carga
  isLoading: boolean;
  error: string | null;
}

// ==========================================
// TIPOS PARA DRAG & DROP
// ==========================================
export interface DragData {
  elementType: ElementType;
  elementId?: string;
  sourceIndex?: number;
}

export interface DropResult {
  elementId: string;
  newPosition: Position;
  newParentId: string | null;
  newOrder: number;
}

// ==========================================
// TIPOS PARA ACCIONES DEL STORE
// ==========================================
export interface StoreActions {
  // Auth Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  
  // Projects Actions
  fetchProjects: () => Promise<void>;
  createProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  selectProject: (id: string) => void;
  
  // Editor Actions
  addElement: (element: Omit<CanvasElement, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  deleteElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  duplicateElement: (id: string) => void;
  moveElement: (id: string, newPosition: Position) => void;
  resizeElement: (id: string, newSize: Size) => void;
  reorderElement: (id: string, newOrder: number) => void;
  
  // Canvas Actions
  updateCanvas: (updates: Partial<EditorState['canvas']>) => void;
  updateUI: (updates: Partial<EditorState['ui']>) => void;
  
  // History Actions
  undo: () => void;
  redo: () => void;
  saveToHistory: () => void;
  clearHistory: () => void;
}

// ==========================================
// TIPOS PARA UTILIDADES
// ==========================================
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}