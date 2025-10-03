/**
 * Custom Hook for Managing Favorite Templates
 * Hook para gestionar las plantillas favoritas del usuario
 */

import { useState, useEffect, useCallback } from 'react';

// Clave para localStorage
const FAVORITES_STORAGE_KEY = 'aurelio-favorite-templates';

function useFavoriteTemplates() {
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Cargar favoritos desde localStorage al inicializar
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        const favoriteArray = JSON.parse(stored);
        setFavoriteIds(new Set(favoriteArray));
      }
    } catch (error) {
      console.error('Error loading favorite templates:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Guardar favoritos en localStorage cuando cambian
  const saveFavoritesToStorage = useCallback((favSet) => {
    try {
      const favoriteArray = Array.from(favSet);
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteArray));
    } catch (error) {
      console.error('Error saving favorite templates:', error);
    }
  }, []);

  // Agregar una plantilla a favoritos
  const addToFavorites = useCallback((templateId) => {
    setFavoriteIds((prevFavorites) => {
      const newFavorites = new Set(prevFavorites);
      newFavorites.add(templateId);
      saveFavoritesToStorage(newFavorites);
      return newFavorites;
    });
  }, [saveFavoritesToStorage]);

  // Remover una plantilla de favoritos
  const removeFromFavorites = useCallback((templateId) => {
    setFavoriteIds((prevFavorites) => {
      const newFavorites = new Set(prevFavorites);
      newFavorites.delete(templateId);
      saveFavoritesToStorage(newFavorites);
      return newFavorites;
    });
  }, [saveFavoritesToStorage]);

  // Toggle favorito (agregar si no existe, remover si existe)
  const toggleFavorite = useCallback((templateId) => {
    if (favoriteIds.has(templateId)) {
      removeFromFavorites(templateId);
    } else {
      addToFavorites(templateId);
    }
  }, [favoriteIds, addToFavorites, removeFromFavorites]);

  // Verificar si una plantilla es favorita
  const isFavorite = useCallback((templateId) => {
    return favoriteIds.has(templateId);
  }, [favoriteIds]);

  // Obtener todas las plantillas favoritas de una lista
  const getFavoriteTemplates = useCallback((templates) => {
    return templates.filter(template => favoriteIds.has(template.id));
  }, [favoriteIds]);

  // Limpiar todos los favoritos
  const clearAllFavorites = useCallback(() => {
    setFavoriteIds(new Set());
    try {
      localStorage.removeItem(FAVORITES_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing favorite templates:', error);
    }
  }, []);

  // Importar favoritos desde una lista de IDs
  const importFavorites = useCallback((templateIds) => {
    const newFavorites = new Set(templateIds);
    setFavoriteIds(newFavorites);
    saveFavoritesToStorage(newFavorites);
  }, [saveFavoritesToStorage]);

  // Exportar favoritos como array
  const exportFavorites = useCallback(() => {
    return Array.from(favoriteIds);
  }, [favoriteIds]);

  return {
    // Estado
    favoriteIds: Array.from(favoriteIds),
    favoriteCount: favoriteIds.size,
    isLoading,

    // Operaciones CRUD
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    clearAllFavorites,

    // Utilidades
    isFavorite,
    getFavoriteTemplates,

    // Importar/Exportar
    importFavorites,
    exportFavorites
  };
}

export default useFavoriteTemplates;