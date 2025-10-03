/**
 * Custom Hook for Managing Template Categories
 * Hook para gestionar categorías de plantillas de forma dinámica
 */

import { useState, useEffect, useCallback } from 'react';
import templateService from '../services/templateService';

// Mapeo de iconos string a componentes
import {
  FiGrid, FiGlobe, FiPlay, FiMail, FiTrendingUp, FiFileText,
  FiUsers, FiBookOpen, FiHeart, FiShoppingBag, FiCalendar,
  FiMonitor, FiCamera, FiMusic, FiTool, FiCoffee
} from 'react-icons/fi';

const ICON_MAP = {
  'FiGrid': FiGrid,
  'FiGlobe': FiGlobe,
  'FiPlay': FiPlay,
  'FiMail': FiMail,
  'FiTrendingUp': FiTrendingUp,
  'FiFileText': FiFileText,
  'FiUsers': FiUsers,
  'FiBookOpen': FiBookOpen,
  'FiHeart': FiHeart,
  'FiShoppingBag': FiShoppingBag,
  'FiCalendar': FiCalendar,
  'FiMonitor': FiMonitor,
  'FiCamera': FiCamera,
  'FiMusic': FiMusic,
  'FiTool': FiTool,
  'FiCoffee': FiCoffee,
};

function useTemplateCategories() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Cargar categorías
  const loadCategories = useCallback(async (forceRefresh = false) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await templateService.getCategories(forceRefresh);
      
      // Convertir strings de iconos a componentes
      const categoriesWithIcons = data.map(category => ({
        ...category,
        icon: ICON_MAP[category.icon] || FiGrid
      }));
      
      setCategories(categoriesWithIcons);
      setLastUpdated(new Date());
      
    } catch (err) {
      setError({
        message: 'Error al cargar categorías',
        details: err.message,
        canRetry: true
      });
      
      // En caso de error, usar categorías estáticas como fallback
      const fallbackCategories = [
        { id: 'all', name: 'Todas', icon: FiGrid, color: 'gray' },
        { id: 'landing', name: 'Landing Pages', icon: FiGlobe, color: 'blue' },
        { id: 'webinar', name: 'Webinar', icon: FiPlay, color: 'red' }
      ];
      
      setCategories(fallbackCategories);
      
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cargar categorías al montar el componente
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Obtener una categoría por ID
  const getCategoryById = useCallback((categoryId) => {
    return categories.find(category => category.id === categoryId);
  }, [categories]);

  // Obtener categorías con plantillas (excluyendo las vacías)
  const getCategoriesWithContent = useCallback(() => {
    return categories.filter(category => 
      category.id === 'all' || (category.count && category.count > 0)
    );
  }, [categories]);

  // Obtener categorías ordenadas por popularidad
  const getCategoriesByPopularity = useCallback(() => {
    return [...categories].sort((a, b) => {
      if (a.id === 'all') return -1;
      if (b.id === 'all') return 1;
      return (b.count || 0) - (a.count || 0);
    });
  }, [categories]);

  // Actualizar contador de una categoría específica
  const updateCategoryCount = useCallback((categoryId, newCount) => {
    setCategories(prevCategories => 
      prevCategories.map(category => 
        category.id === categoryId 
          ? { ...category, count: newCount }
          : category
      )
    );
  }, []);

  // Reintentar carga en caso de error
  const retry = useCallback(() => {
    loadCategories(true);
  }, [loadCategories]);

  // Verificar si las categorías están desactualizadas
  const isStale = useCallback(() => {
    if (!lastUpdated) return true;
    
    const STALE_TIME = 10 * 60 * 1000; // 10 minutos
    return Date.now() - lastUpdated.getTime() > STALE_TIME;
  }, [lastUpdated]);

  // Refrescar categorías si están desactualizadas
  const refreshIfStale = useCallback(() => {
    if (isStale()) {
      loadCategories(true);
    }
  }, [isStale, loadCategories]);

  return {
    // Estado principal
    categories,
    isLoading,
    error,
    lastUpdated,

    // Operaciones
    loadCategories,
    retry,
    refreshIfStale,

    // Utilidades de consulta
    getCategoryById,
    getCategoriesWithContent,
    getCategoriesByPopularity,

    // Mutaciones
    updateCategoryCount,

    // Verificaciones
    isStale,
    
    // Estadísticas
    totalCategories: categories.length,
    categoriesWithContent: categories.filter(c => c.count > 0).length
  };
}

export default useTemplateCategories;