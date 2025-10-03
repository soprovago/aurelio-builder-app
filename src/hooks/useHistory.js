import { useReducer, useCallback } from 'react';

// Estados y acciones para el reducer
const ACTIONS = {
  SAVE_STATE: 'SAVE_STATE',
  UNDO: 'UNDO',
  REDO: 'REDO'
};

function historyReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SAVE_STATE: {
      const { payload } = action;
      // Eliminar todo el historial después del índice actual
      const newHistory = state.history.slice(0, state.currentIndex + 1);
      // Agregar el nuevo estado (deep clone)
      newHistory.push(JSON.parse(JSON.stringify(payload)));
      
      // Limitar a 50 estados para evitar problemas de memoria
      let finalHistory = newHistory;
      let finalIndex = newHistory.length - 1;
      
      if (newHistory.length > 50) {
        finalHistory = newHistory.slice(1);
        finalIndex = 49;
      }
      
      return {
        history: finalHistory,
        currentIndex: finalIndex,
        canUndo: finalIndex > 0,
        canRedo: false
      };
    }
    
    case ACTIONS.UNDO: {
      if (!state.canUndo) return state;
      const newIndex = state.currentIndex - 1;
      console.log('⏪ Undo - Moving to index:', newIndex);
      return {
        ...state,
        currentIndex: newIndex,
        canUndo: newIndex > 0,
        canRedo: true
      };
    }
    
    case ACTIONS.REDO: {
      if (!state.canRedo) return state;
      const newIndex = state.currentIndex + 1;
      console.log('⏩ Redo - Moving to index:', newIndex);
      return {
        ...state,
        currentIndex: newIndex,
        canUndo: true,
        canRedo: newIndex < state.history.length - 1
      };
    }
    
    default:
      return state;
  }
}

// Hook personalizado para manejo de historial (Undo/Redo)
function useHistory(initialState = []) {
  const [state, dispatch] = useReducer(historyReducer, {
    history: [initialState],
    currentIndex: 0,
    canUndo: false,
    canRedo: false
  });

  const saveState = useCallback((newState) => {
    dispatch({ type: ACTIONS.SAVE_STATE, payload: newState });
  }, []);

  const undo = useCallback(() => {
    const previousIndex = state.currentIndex - 1;
    dispatch({ type: ACTIONS.UNDO });
    return state.history[previousIndex] || state.history[state.currentIndex];
  }, [state]);

  const redo = useCallback(() => {
    const nextIndex = state.currentIndex + 1;
    dispatch({ type: ACTIONS.REDO });
    return state.history[nextIndex] || state.history[state.currentIndex];
  }, [state]);

  const getCurrentState = useCallback(() => {
    return state.history[state.currentIndex];
  }, [state.history, state.currentIndex]);

  return {
    saveState,
    undo,
    redo,
    canUndo: state.canUndo,
    canRedo: state.canRedo,
    getCurrentState,
    historyLength: state.history.length,
    currentIndex: state.currentIndex
  };
}

export default useHistory;