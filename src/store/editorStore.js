import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { EditorState, CanvasElement, Position, Size, ElementType, DropResult } from '@/types';

interface EditorStore extends EditorState {
  // Element Actions
  addElement: (element: Omit<CanvasElement, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  deleteElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  duplicateElement: (id: string) => string | null;
  moveElement: (id: string, newPosition: Position) => void;
  resizeElement: (id: string, newSize: Size) => void;
  reorderElement: (id: string, newOrder: number) => void;
  
  // Drag & Drop Actions
  handleDrop: (dropResult: DropResult) => void;
  
  // Canvas Actions
  updateCanvas: (updates: Partial<EditorState['canvas']>) => void;
  updateUI: (updates: Partial<EditorState['ui']>) => void;
  
  // History Actions
  undo: () => void;
  redo: () => void;
  saveToHistory: () => void;
  clearHistory: () => void;
  
  // Utility Actions
  getElementById: (id: string) => CanvasElement | null;
  getElementChildren: (parentId: string) => CanvasElement[];
  getNextOrder: (parentId: string | null) => number;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

// Función para generar IDs únicos
const generateId = (): string => {
  return `element_${Math.random().toString(36).substring(2, 15)}`;
};

// Función para crear elementos por defecto según el tipo
const createDefaultElement = (type: ElementType, position: Position): Partial<CanvasElement> => {
  const defaults: Record<ElementType, Partial<CanvasElement>> = {
    button: {
      type: 'button',
      size: { width: 120, height: 40 },
      styles: {
        backgroundColor: '#3b82f6',
        color: '#ffffff',
        borderRadius: '8px',
        padding: '8px 16px',
      },
      props: { text: 'Button' },
    },
    text: {
      type: 'text',
      size: { width: 200, height: 30 },
      styles: {
        color: '#374151',
        fontSize: '16px',
      },
      props: { text: 'Text Element' },
    },
    input: {
      type: 'input',
      size: { width: 200, height: 40 },
      styles: {
        border: '1px solid #d1d5db',
        borderRadius: '4px',
        padding: '8px 12px',
      },
      props: { placeholder: 'Enter text...' },
    },
    image: {
      type: 'image',
      size: { width: 200, height: 150 },
      styles: {
        borderRadius: '4px',
      },
      props: { 
        src: 'https://picsum.photos/200/150',
        alt: 'Image'
      },
    },
    container: {
      type: 'container',
      size: { width: 300, height: 200 },
      styles: {
        backgroundColor: '#f9fafb',
        border: '2px dashed #d1d5db',
        borderRadius: '8px',
      },
      props: {},
    },
    heading: {
      type: 'heading',
      size: { width: 300, height: 40 },
      styles: {
        color: '#111827',
        fontSize: '32px',
        fontWeight: 'bold',
      },
      props: { text: 'Heading' },
    },
    paragraph: {
      type: 'paragraph',
      size: { width: 400, height: 80 },
      styles: {
        color: '#374151',
        fontSize: '16px',
      },
      props: { text: 'This is a paragraph of text.' },
    },
    link: {
      type: 'link',
      size: { width: 100, height: 24 },
      styles: {
        color: '#3b82f6',
        textDecoration: 'underline',
      },
      props: { 
        text: 'Link',
        href: '#'
      },
    },
  };

  return {
    ...defaults[type],
    position,
  };
};

export const useEditorStore = create<EditorStore>()(
  immer((set, get) => ({
    // Estado inicial
    elements: {},
    elementIds: [],
    selectedElementId: null,
    clipboardElementId: null,
    
    canvas: {
      width: 1200,
      height: 800,
      backgroundColor: '#ffffff',
      zoom: 1,
    },
    
    ui: {
      showGrid: true,
      showRulers: false,
      snapToGrid: true,
      gridSize: 10,
    },
    
    history: {
      past: [],
      present: null,
      future: [],
    },
    
    isLoading: false,
    error: null,

    // Element Actions
    addElement: (elementData) => {
      const id = generateId();
      const timestamp = new Date().toISOString();
      
      set((state) => {
        const newElement: CanvasElement = {
          id,
          createdAt: timestamp,
          updatedAt: timestamp,
          parentId: null,
          children: [],
          order: get().getNextOrder(elementData.parentId || null),
          isLocked: false,
          isVisible: true,
          ...elementData,
        };
        
        state.elements[id] = newElement;
        state.elementIds.push(id);
        
        // Si tiene padre, agregarlo a los children del padre
        if (newElement.parentId && state.elements[newElement.parentId]) {
          state.elements[newElement.parentId].children.push(id);
        }
      });
      
      return id;
    },

    updateElement: (id, updates) => {
      set((state) => {
        if (state.elements[id]) {
          state.elements[id] = {
            ...state.elements[id],
            ...updates,
            updatedAt: new Date().toISOString(),
          };
        }
      });
    },

    deleteElement: (id) => {
      set((state) => {
        const element = state.elements[id];
        if (!element) return;
        
        // Eliminar de los children del padre
        if (element.parentId && state.elements[element.parentId]) {
          const parentChildren = state.elements[element.parentId].children;
          const childIndex = parentChildren.indexOf(id);
          if (childIndex > -1) {
            parentChildren.splice(childIndex, 1);
          }
        }
        
        // Eliminar recursivamente todos los children
        const deleteRecursive = (elementId: string) => {
          const el = state.elements[elementId];
          if (el) {
            el.children.forEach(deleteRecursive);
            delete state.elements[elementId];
            const idIndex = state.elementIds.indexOf(elementId);
            if (idIndex > -1) {
              state.elementIds.splice(idIndex, 1);
            }
          }
        };
        
        deleteRecursive(id);
        
        // Deseleccionar si estaba seleccionado
        if (state.selectedElementId === id) {
          state.selectedElementId = null;
        }
      });
    },

    selectElement: (id) => {
      set((state) => {
        state.selectedElementId = id;
      });
    },

    duplicateElement: (id) => {
      const element = get().elements[id];
      if (!element) return null;
      
      const duplicatedId = get().addElement({
        ...element,
        position: {
          x: element.position.x + 20,
          y: element.position.y + 20,
        },
        parentId: element.parentId,
      });
      
      return duplicatedId;
    },

    moveElement: (id, newPosition) => {
      get().updateElement(id, { position: newPosition });
    },

    resizeElement: (id, newSize) => {
      get().updateElement(id, { size: newSize });
    },

    reorderElement: (id, newOrder) => {
      get().updateElement(id, { order: newOrder });
    },

    // Drag & Drop Actions
    handleDrop: (dropResult) => {
      set((state) => {
        const { elementId, newPosition, newParentId, newOrder } = dropResult;
        const element = state.elements[elementId];
        
        if (element) {
          // Remover del padre anterior
          if (element.parentId && state.elements[element.parentId]) {
            const oldParentChildren = state.elements[element.parentId].children;
            const childIndex = oldParentChildren.indexOf(elementId);
            if (childIndex > -1) {
              oldParentChildren.splice(childIndex, 1);
            }
          }
          
          // Actualizar elemento
          element.position = newPosition;
          element.parentId = newParentId;
          element.order = newOrder;
          element.updatedAt = new Date().toISOString();
          
          // Agregar al nuevo padre
          if (newParentId && state.elements[newParentId]) {
            state.elements[newParentId].children.push(elementId);
          }
        }
      });
    },

    // Canvas Actions
    updateCanvas: (updates) => {
      set((state) => {
        state.canvas = { ...state.canvas, ...updates };
      });
    },

    updateUI: (updates) => {
      set((state) => {
        state.ui = { ...state.ui, ...updates };
      });
    },

    // History Actions (implementación básica)
    undo: () => {
      // Implementación básica del undo
      // En una implementación completa, se manejarían snapshots del estado
    },

    redo: () => {
      // Implementación básica del redo
    },

    saveToHistory: () => {
      // Guardar snapshot del estado actual
    },

    clearHistory: () => {
      set((state) => {
        state.history = {
          past: [],
          present: null,
          future: [],
        };
      });
    },

    // Utility Actions
    getElementById: (id) => {
      return get().elements[id] || null;
    },

    getElementChildren: (parentId) => {
      const state = get();
      return state.elementIds
        .map(id => state.elements[id])
        .filter(element => element.parentId === parentId)
        .sort((a, b) => a.order - b.order);
    },

    getNextOrder: (parentId) => {
      const children = get().getElementChildren(parentId || '');
      return children.length > 0 ? Math.max(...children.map(c => c.order)) + 1 : 0;
    },

    setLoading: (isLoading) => {
      set((state) => {
        state.isLoading = isLoading;
      });
    },

    setError: (error) => {
      set((state) => {
        state.error = error;
      });
    },
  }))
);

// Hook personalizado para crear elementos con valores por defecto
export const useCreateElement = () => {
  const addElement = useEditorStore((state) => state.addElement);
  
  return (type: ElementType, position: Position, parentId?: string) => {
    const elementDefaults = createDefaultElement(type, position);
    return addElement({
      ...elementDefaults,
      parentId: parentId || null,
    } as Omit<CanvasElement, 'id' | 'createdAt' | 'updatedAt'>);
  };
};